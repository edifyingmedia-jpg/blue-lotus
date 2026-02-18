# Runtime Intelligence Engine - Analyzes user behavior and provides intelligent assistance
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import re


class IntentType(str, Enum):
    BUILD_SCREEN = "build_screen"
    BUILD_PAGE = "build_page"
    CREATE_MODEL = "create_model"
    SETUP_NAVIGATION = "setup_navigation"
    CONFIGURE_SETTINGS = "configure_settings"
    PREVIEW_PROJECT = "preview_project"
    PUBLISH_PROJECT = "publish_project"
    EXPORT_PROJECT = "export_project"
    ASK_FOR_HELP = "ask_for_help"
    UNKNOWN = "unknown"


class UserContext(BaseModel):
    user_id: str
    project_id: Optional[str] = None
    current_screen: Optional[str] = None
    recent_actions: List[str] = []
    session_duration_minutes: int = 0
    credits_remaining: int = 0
    plan: str = "free"


class IntelligenceOutput(BaseModel):
    suggested_actions: List[Dict[str, Any]] = []
    recommended_components: List[str] = []
    recommended_screens: List[str] = []
    contextual_explanations: List[str] = []
    guided_steps: List[Dict[str, str]] = []
    detected_intent: IntentType = IntentType.UNKNOWN
    confidence: float = 0.0


class RuntimeIntelligenceEngine:
    """
    Runtime Intelligence Engine analyzes user behavior in real time.
    
    Responsibilities:
    - Analyze user behavior in real time
    - Predict next likely actions
    - Surface helpful shortcuts
    - Detect stalled workflows
    - Recommend components or screens
    - Optimize generation prompts
    - Ensure emotional safety and clarity
    
    Rules:
    - Never modify user content automatically
    - Never generate without user intent
    - Never override user decisions
    - Always respect credit engine
    - Always respect plan enforcement
    """
    
    # Action patterns for intent detection
    INTENT_PATTERNS = {
        IntentType.BUILD_SCREEN: ["screen", "view", "ui", "interface", "dashboard", "page"],
        IntentType.BUILD_PAGE: ["page", "landing", "website", "section"],
        IntentType.CREATE_MODEL: ["model", "data", "schema", "database", "field"],
        IntentType.SETUP_NAVIGATION: ["navigation", "menu", "tabs", "drawer", "link"],
        IntentType.CONFIGURE_SETTINGS: ["settings", "config", "preferences", "options"],
        IntentType.PREVIEW_PROJECT: ["preview", "see", "view", "look", "show"],
        IntentType.PUBLISH_PROJECT: ["publish", "deploy", "launch", "live"],
        IntentType.EXPORT_PROJECT: ["export", "download", "code", "package"],
        IntentType.ASK_FOR_HELP: ["help", "how", "what", "explain", "guide"],
    }
    
    # Component recommendations based on screen type
    COMPONENT_RECOMMENDATIONS = {
        "dashboard": ["StatsCard", "Chart", "RecentActivity", "QuickActions", "DataTable"],
        "profile": ["Avatar", "ProfileInfo", "EditButton", "ActivityFeed", "Settings"],
        "settings": ["SettingsGroup", "Toggle", "Select", "Input", "SaveButton"],
        "login": ["EmailInput", "PasswordInput", "LoginButton", "SocialAuth", "ForgotPassword"],
        "signup": ["NameInput", "EmailInput", "PasswordInput", "SignupButton", "TermsCheckbox"],
        "home": ["Hero", "FeatureGrid", "Testimonials", "CTA", "Footer"],
        "list": ["SearchBar", "FilterBar", "ListView", "ListItem", "Pagination"],
        "detail": ["Header", "MainContent", "Sidebar", "ActionButtons", "Comments"],
    }
    
    # Screen recommendations based on project state
    SCREEN_RECOMMENDATIONS = {
        "app_starter": ["Dashboard", "Profile", "Settings", "Notifications"],
        "app_no_auth": ["Login", "Signup", "ForgotPassword"],
        "website_starter": ["Home", "About", "Contact", "Services"],
        "website_no_blog": ["Blog", "BlogPost"],
    }
    
    @staticmethod
    def detect_intent(prompt: str) -> Tuple[IntentType, float]:
        """Detect user intent from natural language prompt."""
        prompt_lower = prompt.lower()
        
        intent_scores = {}
        for intent, keywords in RuntimeIntelligenceEngine.INTENT_PATTERNS.items():
            score = sum(1 for kw in keywords if kw in prompt_lower)
            if score > 0:
                intent_scores[intent] = score / len(keywords)
        
        if not intent_scores:
            return IntentType.UNKNOWN, 0.0
        
        best_intent = max(intent_scores, key=intent_scores.get)
        confidence = min(intent_scores[best_intent] * 2, 1.0)  # Scale up, max 1.0
        
        return best_intent, confidence
    
    @staticmethod
    def analyze_context(context: UserContext) -> IntelligenceOutput:
        """Analyze user context and provide intelligent recommendations."""
        output = IntelligenceOutput()
        
        # Analyze recent actions to detect patterns
        if context.recent_actions:
            recent_str = " ".join(context.recent_actions[-5:])
            intent, confidence = RuntimeIntelligenceEngine.detect_intent(recent_str)
            output.detected_intent = intent
            output.confidence = confidence
        
        # Provide recommendations based on current context
        if context.current_screen:
            screen_lower = context.current_screen.lower()
            for screen_type, components in RuntimeIntelligenceEngine.COMPONENT_RECOMMENDATIONS.items():
                if screen_type in screen_lower:
                    output.recommended_components = components[:5]
                    break
        
        # Suggest actions based on session state
        suggestions = RuntimeIntelligenceEngine._generate_suggestions(context)
        output.suggested_actions = suggestions
        
        # Add contextual explanations
        explanations = RuntimeIntelligenceEngine._generate_explanations(context)
        output.contextual_explanations = explanations
        
        return output
    
    @staticmethod
    def _generate_suggestions(context: UserContext) -> List[Dict[str, Any]]:
        """Generate action suggestions based on context."""
        suggestions = []
        
        # Credit-based suggestions
        if context.credits_remaining < 10:
            suggestions.append({
                "type": "warning",
                "action": "purchase_credits",
                "message": f"Low credits ({context.credits_remaining}). Consider purchasing more.",
                "priority": "high"
            })
        
        # Session-based suggestions
        if context.session_duration_minutes > 30 and not context.recent_actions:
            suggestions.append({
                "type": "help",
                "action": "show_tutorial",
                "message": "Need help getting started? Check out our quick tutorial.",
                "priority": "medium"
            })
        
        # Project state suggestions
        if context.project_id:
            suggestions.append({
                "type": "action",
                "action": "preview_project",
                "message": "Preview your project to see the latest changes.",
                "priority": "low"
            })
        
        return suggestions
    
    @staticmethod
    def _generate_explanations(context: UserContext) -> List[str]:
        """Generate contextual explanations."""
        explanations = []
        
        if context.plan == "free":
            explanations.append("Upgrade to Creator plan to enable project export and publishing.")
        
        if context.credits_remaining < 5:
            explanations.append("Each screen generation costs 3 credits, pages cost 5 credits.")
        
        return explanations
    
    @staticmethod
    def recommend_next_steps(
        project_type: str,
        current_structure: Dict[str, List[str]]
    ) -> List[Dict[str, str]]:
        """Recommend next steps based on project state."""
        steps = []
        
        screens = current_structure.get("screens", [])
        pages = current_structure.get("pages", [])
        models = current_structure.get("data_models", [])
        flows = current_structure.get("flows", [])
        
        if project_type in ["app", "both"]:
            # Check for missing essential screens
            essential_screens = ["Dashboard", "Profile", "Settings"]
            missing_screens = [s for s in essential_screens if s not in screens]
            
            for screen in missing_screens[:2]:
                steps.append({
                    "step": f"Create {screen} screen",
                    "prompt": f"Create a {screen.lower()} screen",
                    "reason": f"Most apps need a {screen.lower()} for users"
                })
            
            # Check for auth flow
            if "Login" not in screens and "Authentication" not in flows:
                steps.append({
                    "step": "Add authentication",
                    "prompt": "Generate an authentication flow with login and signup",
                    "reason": "Users need to be able to log in to your app"
                })
        
        if project_type in ["website", "both"]:
            # Check for missing essential pages
            essential_pages = ["Home", "About", "Contact"]
            missing_pages = [p for p in essential_pages if p not in pages]
            
            for page in missing_pages[:2]:
                steps.append({
                    "step": f"Create {page} page",
                    "prompt": f"Create a {page.lower()} page",
                    "reason": f"Websites typically need a {page.lower()} page"
                })
        
        # Check for data models
        if len(models) < 2:
            steps.append({
                "step": "Add data models",
                "prompt": "Create a User data model with email and name fields",
                "reason": "Data models define how your app stores information"
            })
        
        return steps[:5]  # Return top 5 recommendations
    
    @staticmethod
    def optimize_prompt(original_prompt: str, context: UserContext) -> str:
        """Optimize a generation prompt for better results."""
        optimized = original_prompt.strip()
        
        # Add specificity if prompt is too vague
        if len(optimized.split()) < 5:
            # Try to add context
            if context.current_screen:
                optimized = f"{optimized} for {context.current_screen}"
        
        # Ensure action verb is present
        action_verbs = ["create", "add", "build", "generate", "make"]
        has_verb = any(verb in optimized.lower() for verb in action_verbs)
        
        if not has_verb:
            # Detect what type of thing is being requested
            if any(kw in optimized.lower() for kw in ["screen", "view", "dashboard"]):
                optimized = f"Create a {optimized}"
            elif any(kw in optimized.lower() for kw in ["page", "landing"]):
                optimized = f"Create a {optimized}"
            elif any(kw in optimized.lower() for kw in ["model", "data"]):
                optimized = f"Create a {optimized}"
        
        return optimized
    
    @staticmethod
    def detect_stalled_workflow(
        recent_actions: List[Dict[str, Any]],
        time_window_minutes: int = 10
    ) -> Tuple[bool, Optional[str]]:
        """Detect if user is stuck in their workflow."""
        if not recent_actions:
            return False, None
        
        # Check for repeated failed actions
        recent_errors = [
            a for a in recent_actions[-10:]
            if a.get("success") is False
        ]
        
        if len(recent_errors) >= 3:
            return True, "Multiple recent actions failed. Need help?"
        
        # Check for same action repeated
        action_types = [a.get("type") for a in recent_actions[-5:]]
        if len(set(action_types)) == 1 and len(action_types) >= 3:
            return True, f"Seems like you're trying to {action_types[0]} repeatedly. Let me help."
        
        return False, None
