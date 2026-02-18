# AI Project Refinement Engine - Analyze and improve existing projects
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid
import os
from dotenv import load_dotenv

load_dotenv()


class RefinementType(str, Enum):
    UI_LAYOUT = "ui_layout_optimization"
    COMPONENT_REPLACEMENT = "component_replacement_suggestions"
    DATA_MODEL_NORMALIZATION = "data_model_normalization"
    NAVIGATION_SIMPLIFICATION = "navigation_simplification"
    FLOW_EFFICIENCY = "flow_efficiency_improvements"
    FULL_REVIEW = "full_review"


class RefinementSuggestion(BaseModel):
    """A single refinement suggestion."""
    suggestion_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    type: RefinementType
    target: str  # Screen/model/flow name
    current_state: str
    suggested_state: str
    reason: str
    impact: str = "medium"  # low, medium, high
    auto_applicable: bool = False


class RefinementResult(BaseModel):
    """Result of project refinement analysis."""
    project_id: str
    suggestions: List[RefinementSuggestion] = []
    summary_text: str = ""
    summary_voice: str = ""
    health_score_before: int = 0
    health_score_after: int = 0
    total_suggestions: int = 0


class AIProjectRefinementEngine:
    """
    AI Project Refinement Engine.
    
    Responsibilities:
    - Analyze existing project structure
    - Identify inconsistencies or inefficiencies
    - Suggest improvements to screens, flows, and data models
    - Refine UI layouts and component usage
    - Optimize navigation and user experience
    - Provide voice or text explanations of refinements
    
    Supported Commands:
    - "Refine this project"
    - "Improve the layout of this screen"
    - "Optimize my data models"
    - "Make this flow smoother"
    """
    
    @classmethod
    async def analyze_project(
        cls,
        project: Dict[str, Any],
        focus: Optional[RefinementType] = None
    ) -> RefinementResult:
        """Analyze project and generate refinement suggestions."""
        suggestions = []
        
        # Get project structure
        screens = project.get("structure", {}).get("screens", [])
        data_models = project.get("structure", {}).get("data_models", [])
        flows = project.get("structure", {}).get("flows", [])
        navigation = project.get("structure", {}).get("navigation", {})
        
        # Calculate initial health score
        health_before = cls._calculate_health_score(project)
        
        # Analyze based on focus or do full review
        if focus == RefinementType.UI_LAYOUT or focus == RefinementType.FULL_REVIEW:
            suggestions.extend(cls._analyze_layouts(screens))
        
        if focus == RefinementType.DATA_MODEL_NORMALIZATION or focus == RefinementType.FULL_REVIEW:
            suggestions.extend(cls._analyze_data_models(data_models))
        
        if focus == RefinementType.NAVIGATION_SIMPLIFICATION or focus == RefinementType.FULL_REVIEW:
            suggestions.extend(cls._analyze_navigation(navigation, screens))
        
        if focus == RefinementType.FLOW_EFFICIENCY or focus == RefinementType.FULL_REVIEW:
            suggestions.extend(cls._analyze_flows(flows, screens))
        
        # Calculate potential health after applying suggestions
        health_after = health_before + (len(suggestions) * 2)  # Each suggestion adds ~2 points
        health_after = min(100, health_after)
        
        # Generate summary
        summary_text = cls._generate_summary_text(suggestions, health_before, health_after)
        summary_voice = cls._generate_summary_voice(suggestions, health_before, health_after)
        
        return RefinementResult(
            project_id=project.get("id", ""),
            suggestions=suggestions,
            summary_text=summary_text,
            summary_voice=summary_voice,
            health_score_before=health_before,
            health_score_after=health_after,
            total_suggestions=len(suggestions)
        )
    
    @classmethod
    def _calculate_health_score(cls, project: Dict[str, Any]) -> int:
        """Calculate project health score (0-100)."""
        score = 100
        structure = project.get("structure", {})
        
        # Deduct for missing elements
        if not structure.get("screens") and not structure.get("pages"):
            score -= 30
        if not structure.get("data_models"):
            score -= 15
        if not structure.get("flows"):
            score -= 10
        if not structure.get("navigation"):
            score -= 10
        
        # Deduct for empty screens
        for screen in structure.get("screens", []):
            if isinstance(screen, str):
                score -= 2  # Simple string screens have no components
        
        return max(0, score)
    
    @classmethod
    def _analyze_layouts(cls, screens: List) -> List[RefinementSuggestion]:
        """Analyze UI layouts for optimization opportunities."""
        suggestions = []
        
        # Check for too many screens
        if len(screens) > 10:
            suggestions.append(RefinementSuggestion(
                type=RefinementType.UI_LAYOUT,
                target="Project Structure",
                current_state=f"{len(screens)} screens",
                suggested_state="Consider combining related screens",
                reason="Too many screens can confuse users and increase complexity",
                impact="medium"
            ))
        
        # Check for missing common screens
        screen_names = [s.lower() if isinstance(s, str) else s.get("name", "").lower() for s in screens]
        
        if not any("home" in s or "dashboard" in s for s in screen_names):
            suggestions.append(RefinementSuggestion(
                type=RefinementType.UI_LAYOUT,
                target="Navigation",
                current_state="No clear home screen",
                suggested_state="Add a Home or Dashboard screen",
                reason="Users need a clear starting point",
                impact="high"
            ))
        
        if not any("settings" in s or "profile" in s for s in screen_names):
            suggestions.append(RefinementSuggestion(
                type=RefinementType.UI_LAYOUT,
                target="User Experience",
                current_state="No settings or profile screen",
                suggested_state="Add a Settings or Profile screen",
                reason="Users expect to manage their account",
                impact="medium"
            ))
        
        return suggestions
    
    @classmethod
    def _analyze_data_models(cls, data_models: List) -> List[RefinementSuggestion]:
        """Analyze data models for normalization opportunities."""
        suggestions = []
        
        model_names = [m.lower() if isinstance(m, str) else m.get("name", "").lower() for m in data_models]
        
        # Check for missing User model
        if not any("user" in m for m in model_names):
            suggestions.append(RefinementSuggestion(
                type=RefinementType.DATA_MODEL_NORMALIZATION,
                target="Data Models",
                current_state="No User model",
                suggested_state="Add a User data model",
                reason="Most apps need user management",
                impact="high"
            ))
        
        # Check for potential duplication
        if len(model_names) > 5:
            suggestions.append(RefinementSuggestion(
                type=RefinementType.DATA_MODEL_NORMALIZATION,
                target="Data Models",
                current_state=f"{len(data_models)} models",
                suggested_state="Review for potential consolidation",
                reason="Many models may have overlapping fields",
                impact="low"
            ))
        
        return suggestions
    
    @classmethod
    def _analyze_navigation(cls, navigation: Any, screens: List) -> List[RefinementSuggestion]:
        """Analyze navigation structure."""
        suggestions = []
        
        if not navigation:
            suggestions.append(RefinementSuggestion(
                type=RefinementType.NAVIGATION_SIMPLIFICATION,
                target="Navigation",
                current_state="No navigation defined",
                suggested_state="Add navigation structure (tabs or drawer)",
                reason="Users need a way to navigate between screens",
                impact="high"
            ))
        
        # Check navigation depth
        if len(screens) > 5 and isinstance(navigation, dict):
            nav_type = navigation.get("type", "")
            if nav_type == "stack":
                suggestions.append(RefinementSuggestion(
                    type=RefinementType.NAVIGATION_SIMPLIFICATION,
                    target="Navigation",
                    current_state="Stack navigation with many screens",
                    suggested_state="Consider tabs or drawer navigation",
                    reason="Stack navigation can be confusing with many screens",
                    impact="medium"
                ))
        
        return suggestions
    
    @classmethod
    def _analyze_flows(cls, flows: List, screens: List) -> List[RefinementSuggestion]:
        """Analyze user flows for efficiency."""
        suggestions = []
        
        if not flows:
            suggestions.append(RefinementSuggestion(
                type=RefinementType.FLOW_EFFICIENCY,
                target="User Flows",
                current_state="No flows defined",
                suggested_state="Add key user flows (e.g., onboarding, checkout)",
                reason="Flows help guide users through key actions",
                impact="medium"
            ))
        
        # Check for overly long flows
        for flow in flows:
            if isinstance(flow, dict):
                steps = flow.get("steps", [])
                if len(steps) > 5:
                    suggestions.append(RefinementSuggestion(
                        type=RefinementType.FLOW_EFFICIENCY,
                        target=flow.get("name", "Flow"),
                        current_state=f"{len(steps)} steps",
                        suggested_state="Consider reducing to 3-5 steps",
                        reason="Long flows have higher abandonment rates",
                        impact="medium"
                    ))
        
        return suggestions
    
    @classmethod
    def _generate_summary_text(cls, suggestions: List[RefinementSuggestion], before: int, after: int) -> str:
        """Generate text summary of refinement analysis."""
        if not suggestions:
            return f"**Project Health: {before}/100**\n\n✅ No refinements needed! Your project structure looks good."
        
        high_impact = [s for s in suggestions if s.impact == "high"]
        medium_impact = [s for s in suggestions if s.impact == "medium"]
        low_impact = [s for s in suggestions if s.impact == "low"]
        
        text = f"**Project Health: {before}/100 → {after}/100 (potential)**\n\n"
        text += f"Found **{len(suggestions)} refinement suggestions**:\n\n"
        
        if high_impact:
            text += f"🔴 **High Priority ({len(high_impact)})**\n"
            for s in high_impact[:3]:
                text += f"• {s.target}: {s.suggested_state}\n"
            text += "\n"
        
        if medium_impact:
            text += f"🟡 **Medium Priority ({len(medium_impact)})**\n"
            for s in medium_impact[:3]:
                text += f"• {s.target}: {s.suggested_state}\n"
            text += "\n"
        
        if low_impact:
            text += f"🟢 **Low Priority ({len(low_impact)})**\n"
            for s in low_impact[:2]:
                text += f"• {s.target}: {s.suggested_state}\n"
        
        return text
    
    @classmethod
    def _generate_summary_voice(cls, suggestions: List[RefinementSuggestion], before: int, after: int) -> str:
        """Generate voice summary of refinement analysis."""
        if not suggestions:
            return f"Your project health score is {before} out of 100. No refinements needed, your project structure looks good!"
        
        high_impact = [s for s in suggestions if s.impact == "high"]
        
        voice = f"I analyzed your project and found {len(suggestions)} improvement suggestions. "
        voice += f"Your current health score is {before}, which could improve to {after}. "
        
        if high_impact:
            voice += f"The most important thing to address is: {high_impact[0].suggested_state}. "
        
        voice += "Would you like me to apply any of these suggestions?"
        
        return voice
    
    @classmethod
    async def apply_suggestion(
        cls,
        project: Dict[str, Any],
        suggestion: RefinementSuggestion
    ) -> Dict[str, Any]:
        """Apply a refinement suggestion to a project (placeholder for real implementation)."""
        # This would modify the project structure based on the suggestion
        # For now, return the project unchanged
        return project
    
    @classmethod
    def get_supported_commands(cls) -> List[Dict[str, Any]]:
        """Get supported refinement commands."""
        return [
            {
                "command": "refine_project",
                "examples": ["Refine this project", "Review my project", "How can I improve this?"],
                "description": "Get suggestions to improve your project"
            },
            {
                "command": "optimize_layout",
                "examples": ["Improve the layout of this screen", "Optimize my UI"],
                "description": "Get UI layout optimization suggestions"
            },
            {
                "command": "optimize_data_models",
                "examples": ["Optimize my data models", "Review my database structure"],
                "description": "Get data model optimization suggestions"
            },
            {
                "command": "simplify_navigation",
                "examples": ["Make navigation simpler", "Improve my nav structure"],
                "description": "Get navigation simplification suggestions"
            }
        ]
