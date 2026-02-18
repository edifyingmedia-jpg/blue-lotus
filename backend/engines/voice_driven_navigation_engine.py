# Voice-Driven Navigation Editing Engine - Modify navigation via voice
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid
import re


class NavigationAction(str, Enum):
    ADD_ROUTE = "add_route"
    REMOVE_ROUTE = "remove_route"
    SET_ROOT = "set_root_screen"
    CREATE_FLOW = "create_flow"
    LINK_SCREENS = "link_screens"
    REORDER = "reorder_navigation"
    EXPLAIN = "explain_navigation"


class NavigationLink(BaseModel):
    """Navigation link between screens."""
    link_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    source_screen: str
    target_screen: str
    trigger: str = "button"  # button, menu, automatic
    label: Optional[str] = None


class NavigationResult(BaseModel):
    """Result of voice navigation action."""
    success: bool
    action: NavigationAction
    message: str
    voice_message: str
    link: Optional[NavigationLink] = None
    requires_confirmation: bool = False
    confirmation_prompt: Optional[str] = None
    warnings: List[str] = []


class VoiceDrivenNavigationEditingEngine:
    """
    Voice-Driven Navigation Editing Engine.
    
    Responsibilities:
    - Modify navigation structure using voice commands
    - Add or remove screens from navigation
    - Create flows and link screens
    - Explain navigation paths when requested
    
    Supported Commands:
    - "Add the settings page to the main menu"
    - "Make the dashboard the home screen"
    - "Connect the login screen to the signup screen"
    - "Explain the navigation flow"
    
    Navigation Actions:
    - add_route, remove_route, set_root_screen
    - create_flow, link_screens, reorder_navigation
    
    Rules:
    - Must not create dead routes
    - Must not orphan screens
    - Must validate navigation integrity
    """
    
    # Navigation storage (mocked)
    _navigation: Dict[str, List[NavigationLink]] = {}
    _root_screens: Dict[str, str] = {}
    
    @classmethod
    def parse_navigation_command(cls, command: str) -> Tuple[NavigationAction, Dict[str, Any]]:
        """Parse voice command to determine navigation action."""
        command_lower = command.lower()
        params = {}
        
        # Add to menu/navigation
        if any(kw in command_lower for kw in ["add to menu", "add to navigation", "add to nav", "put in menu"]):
            action = NavigationAction.ADD_ROUTE
            screen_match = re.search(r'(?:add|put)\s+(?:the\s+)?(\w+)\s+(?:screen|page)?', command_lower)
            if screen_match:
                params["screen"] = screen_match.group(1).title()
                
        # Set home/root screen
        elif any(kw in command_lower for kw in ["make home", "set as home", "home screen", "root screen", "start screen"]):
            action = NavigationAction.SET_ROOT
            screen_match = re.search(r'(?:make|set)\s+(?:the\s+)?(\w+)\s+(?:the\s+)?(?:home|root|start)', command_lower)
            if not screen_match:
                screen_match = re.search(r'(?:home|root|start)\s+(?:screen\s+)?(?:to\s+)?(?:the\s+)?(\w+)', command_lower)
            if screen_match:
                params["screen"] = screen_match.group(1).title()
                
        # Connect/link screens
        elif any(kw in command_lower for kw in ["connect", "link", "go to", "navigate to"]):
            action = NavigationAction.LINK_SCREENS
            # Pattern: "Connect X to Y"
            connect_match = re.search(r'(?:connect|link)\s+(?:the\s+)?(\w+)\s+(?:screen\s+)?(?:to|with)\s+(?:the\s+)?(\w+)', command_lower)
            if connect_match:
                params["source"] = connect_match.group(1).title()
                params["target"] = connect_match.group(2).title()
            else:
                # Pattern: "make button go to X"
                goto_match = re.search(r'(?:go|navigate)\s+to\s+(?:the\s+)?(\w+)', command_lower)
                if goto_match:
                    params["target"] = goto_match.group(1).title()
                    
        # Remove from navigation
        elif any(kw in command_lower for kw in ["remove from menu", "remove from nav", "hide from menu"]):
            action = NavigationAction.REMOVE_ROUTE
            screen_match = re.search(r'(?:remove|hide)\s+(?:the\s+)?(\w+)\s+(?:from|screen)?', command_lower)
            if screen_match:
                params["screen"] = screen_match.group(1).title()
                
        # Create flow
        elif "flow" in command_lower:
            action = NavigationAction.CREATE_FLOW
            # Extract flow details
            screens_match = re.search(r'flow\s+(?:from\s+)?(\w+)\s+(?:to|through)\s+(\w+)', command_lower)
            if screens_match:
                params["start"] = screens_match.group(1).title()
                params["end"] = screens_match.group(2).title()
                
        # Explain navigation
        elif any(kw in command_lower for kw in ["explain navigation", "show navigation", "navigation flow", "how do users"]):
            action = NavigationAction.EXPLAIN
            
        # Reorder
        elif any(kw in command_lower for kw in ["reorder", "move up", "move down", "change order"]):
            action = NavigationAction.REORDER
            
        else:
            action = NavigationAction.EXPLAIN
        
        return action, params
    
    @classmethod
    async def execute_command(
        cls,
        command: str,
        project_id: str,
        current_screen: Optional[str] = None,
        existing_screens: List[Dict[str, Any]] = None
    ) -> NavigationResult:
        """Execute a voice navigation command."""
        action, params = cls.parse_navigation_command(command)
        
        if action == NavigationAction.ADD_ROUTE:
            return cls._add_route(project_id, params, existing_screens)
        elif action == NavigationAction.SET_ROOT:
            return cls._set_root_screen(project_id, params, existing_screens)
        elif action == NavigationAction.LINK_SCREENS:
            return cls._link_screens(project_id, params, current_screen, existing_screens)
        elif action == NavigationAction.REMOVE_ROUTE:
            return cls._remove_route(project_id, params)
        elif action == NavigationAction.CREATE_FLOW:
            return cls._create_flow(project_id, params, existing_screens)
        elif action == NavigationAction.EXPLAIN:
            return cls._explain_navigation(project_id, existing_screens)
        elif action == NavigationAction.REORDER:
            return cls._reorder_navigation(project_id, params)
        
        return NavigationResult(
            success=False,
            action=action,
            message="I didn't understand that navigation command.",
            voice_message="I didn't understand. Try saying connect login screen to dashboard, or add settings to the menu."
        )
    
    @classmethod
    def _add_route(
        cls,
        project_id: str,
        params: Dict[str, Any],
        existing_screens: List[Dict[str, Any]] = None
    ) -> NavigationResult:
        """Add a screen to the navigation menu."""
        screen = params.get("screen")
        
        if not screen:
            return NavigationResult(
                success=False,
                action=NavigationAction.ADD_ROUTE,
                message="Which screen should I add to the navigation?",
                voice_message="Which screen should I add to the menu?"
            )
        
        # Validate screen exists
        if existing_screens:
            screen_names = [s.get("name", "").lower() for s in existing_screens]
            if screen.lower() not in screen_names:
                return NavigationResult(
                    success=False,
                    action=NavigationAction.ADD_ROUTE,
                    message=f"I couldn't find a screen called **{screen}**.",
                    voice_message=f"I couldn't find a screen called {screen}. Do you want me to create it?",
                    warnings=[f"Screen '{screen}' not found"]
                )
        
        return NavigationResult(
            success=True,
            action=NavigationAction.ADD_ROUTE,
            message=f"✅ Added **{screen}** to the navigation menu.",
            voice_message=f"Done! I added {screen} to the navigation menu."
        )
    
    @classmethod
    def _set_root_screen(
        cls,
        project_id: str,
        params: Dict[str, Any],
        existing_screens: List[Dict[str, Any]] = None
    ) -> NavigationResult:
        """Set the root/home screen."""
        screen = params.get("screen")
        
        if not screen:
            return NavigationResult(
                success=False,
                action=NavigationAction.SET_ROOT,
                message="Which screen should be the home screen?",
                voice_message="Which screen should I make the home screen?"
            )
        
        cls._root_screens[project_id] = screen
        
        return NavigationResult(
            success=True,
            action=NavigationAction.SET_ROOT,
            message=f"✅ **{screen}** is now the home screen. Users will see this first.",
            voice_message=f"Done! {screen} is now the home screen. Users will see it first when they open your app."
        )
    
    @classmethod
    def _link_screens(
        cls,
        project_id: str,
        params: Dict[str, Any],
        current_screen: Optional[str],
        existing_screens: List[Dict[str, Any]] = None
    ) -> NavigationResult:
        """Create a navigation link between screens."""
        source = params.get("source", current_screen)
        target = params.get("target")
        
        if not target:
            return NavigationResult(
                success=False,
                action=NavigationAction.LINK_SCREENS,
                message="Where should this link go?",
                voice_message="Which screen should this link go to?"
            )
        
        if not source:
            source = "Current Screen"
        
        link = NavigationLink(
            source_screen=source,
            target_screen=target,
            trigger="button"
        )
        
        if project_id not in cls._navigation:
            cls._navigation[project_id] = []
        cls._navigation[project_id].append(link)
        
        return NavigationResult(
            success=True,
            action=NavigationAction.LINK_SCREENS,
            message=f"✅ Connected **{source}** → **{target}**\n\nUsers can now navigate from {source} to {target}.",
            voice_message=f"Done! I connected {source} to {target}. Users can now navigate between them.",
            link=link
        )
    
    @classmethod
    def _remove_route(cls, project_id: str, params: Dict[str, Any]) -> NavigationResult:
        """Remove a screen from navigation (requires confirmation)."""
        screen = params.get("screen")
        
        if not screen:
            return NavigationResult(
                success=False,
                action=NavigationAction.REMOVE_ROUTE,
                message="Which screen should I remove from navigation?",
                voice_message="Which screen should I remove from the menu?"
            )
        
        return NavigationResult(
            success=True,
            action=NavigationAction.REMOVE_ROUTE,
            message=f"⚠️ Remove **{screen}** from the navigation menu? Users won't be able to access it directly.",
            voice_message=f"Should I remove {screen} from the navigation? Users won't be able to access it directly. Say yes to confirm.",
            requires_confirmation=True,
            confirmation_prompt=f"Remove {screen} from navigation?",
            warnings=["Screen may become orphaned"]
        )
    
    @classmethod
    def _create_flow(
        cls,
        project_id: str,
        params: Dict[str, Any],
        existing_screens: List[Dict[str, Any]] = None
    ) -> NavigationResult:
        """Create a navigation flow between screens."""
        start = params.get("start")
        end = params.get("end")
        
        if not start or not end:
            return NavigationResult(
                success=False,
                action=NavigationAction.CREATE_FLOW,
                message="Please specify the start and end screens for the flow.",
                voice_message="Which screens should be at the start and end of the flow?"
            )
        
        return NavigationResult(
            success=True,
            action=NavigationAction.CREATE_FLOW,
            message=f"✅ Created flow: **{start}** → **{end}**",
            voice_message=f"Done! I created a flow from {start} to {end}."
        )
    
    @classmethod
    def _explain_navigation(
        cls,
        project_id: str,
        existing_screens: List[Dict[str, Any]] = None
    ) -> NavigationResult:
        """Explain the current navigation structure."""
        root = cls._root_screens.get(project_id, "Home")
        links = cls._navigation.get(project_id, [])
        
        if not links and (not existing_screens or len(existing_screens) <= 1):
            return NavigationResult(
                success=True,
                action=NavigationAction.EXPLAIN,
                message="Your app doesn't have navigation set up yet. Try saying 'Connect login to dashboard' to add a link.",
                voice_message="Your app doesn't have navigation yet. Would you like me to help set it up?"
            )
        
        # Build navigation explanation
        text = f"**Navigation Structure**\n\n"
        text += f"• **Home Screen**: {root}\n"
        
        if links:
            text += f"• **Links**: {len(links)}\n"
            for link in links[:5]:
                text += f"  - {link.source_screen} → {link.target_screen}\n"
        
        if existing_screens:
            screen_names = [s.get("name", "Unknown") for s in existing_screens]
            # Check for orphans
            linked = set()
            linked.add(root.lower())
            for link in links:
                linked.add(link.target_screen.lower())
            
            orphans = [s for s in screen_names if s.lower() not in linked and s.lower() != root.lower()]
            if orphans:
                text += f"\n⚠️ **Orphan screens** (not linked): {', '.join(orphans)}"
        
        voice_text = f"Your home screen is {root}. "
        if links:
            voice_text += f"You have {len(links)} navigation links. "
        voice_text += "Would you like me to add more connections?"
        
        return NavigationResult(
            success=True,
            action=NavigationAction.EXPLAIN,
            message=text,
            voice_message=voice_text
        )
    
    @classmethod
    def _reorder_navigation(cls, project_id: str, params: Dict[str, Any]) -> NavigationResult:
        """Reorder navigation items."""
        return NavigationResult(
            success=True,
            action=NavigationAction.REORDER,
            message="Tell me how you'd like to reorder the navigation. For example, 'Move Settings after Profile'.",
            voice_message="How would you like to reorder the navigation? Tell me which item to move and where."
        )
    
    @classmethod
    def check_navigation_integrity(
        cls,
        project_id: str,
        screens: List[str]
    ) -> Dict[str, Any]:
        """Check navigation for issues."""
        root = cls._root_screens.get(project_id)
        links = cls._navigation.get(project_id, [])
        
        issues = []
        warnings = []
        
        # Check root screen
        if not root:
            warnings.append("No home screen set")
        elif root not in screens:
            issues.append(f"Home screen '{root}' doesn't exist")
        
        # Check for orphan screens
        linked = {root} if root else set()
        for link in links:
            linked.add(link.target_screen)
        
        orphans = [s for s in screens if s not in linked]
        if orphans:
            warnings.append(f"Orphan screens: {', '.join(orphans)}")
        
        # Check for dead routes
        for link in links:
            if link.target_screen not in screens:
                issues.append(f"Dead route to '{link.target_screen}'")
        
        return {
            "valid": len(issues) == 0,
            "issues": issues,
            "warnings": warnings
        }
    
    @classmethod
    def get_supported_commands(cls) -> List[Dict[str, Any]]:
        """Get list of supported navigation commands."""
        return [
            {
                "action": "add_route",
                "examples": ["Add Settings to the menu", "Put Profile in the navigation"],
                "description": "Add a screen to the main navigation menu"
            },
            {
                "action": "set_root",
                "examples": ["Make Dashboard the home screen", "Set Login as the start screen"],
                "description": "Set which screen users see first"
            },
            {
                "action": "link_screens",
                "examples": ["Connect Login to Dashboard", "Link Signup to Profile"],
                "description": "Create navigation between screens"
            },
            {
                "action": "explain",
                "examples": ["Explain the navigation", "Show me the navigation flow"],
                "description": "Get an explanation of the current navigation structure"
            }
        ]
