# Voice Debugging & Explanation Engine - Explain errors and suggest fixes
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class IssueType(str, Enum):
    NAVIGATION = "navigation"
    DATA_BINDING = "data_binding"
    COMPONENT = "component"
    MISSING_MODEL = "missing_model"
    BROKEN_FLOW = "broken_flow"
    LAYOUT = "layout"
    VALIDATION = "validation"
    PERFORMANCE = "performance"


class IssueSeverity(str, Enum):
    ERROR = "error"
    WARNING = "warning"
    INFO = "info"


class ExplanationMode(str, Enum):
    SIMPLE_VOICE = "simple_voice_summary"
    DETAILED_VOICE = "detailed_voice_explanation"
    TEXT_ONLY = "text_only_explanation"
    STEP_BY_STEP = "step_by_step_fix_instructions"


class ProjectIssue(BaseModel):
    """Detected issue in the project."""
    issue_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    issue_type: IssueType
    severity: IssueSeverity
    title: str
    description: str
    voice_description: str
    location: Dict[str, Any] = {}  # screen, component, model, etc.
    suggested_fix: Optional[str] = None
    fix_steps: List[str] = []
    auto_fixable: bool = False


class DebugResult(BaseModel):
    """Result of debugging analysis."""
    has_issues: bool
    issues: List[ProjectIssue] = []
    summary: str
    voice_summary: str
    overall_health: str = "healthy"


class VoiceDebuggingEngine:
    """
    Voice-Driven Debugging & Explanation Engine.
    
    Responsibilities:
    - Explain errors or issues in the project
    - Describe why something is not working
    - Suggest fixes using voice or text
    - Analyze navigation, data models, and bindings
    - Provide spoken debugging summaries
    
    Debugging Capabilities:
    - navigation_issue_detection
    - data_binding_validation
    - component_property_validation
    - missing_model_detection
    - broken_flow_detection
    
    Explanation Modes:
    - simple_voice_summary
    - detailed_voice_explanation
    - text_only_explanation
    - step_by_step_fix_instructions
    
    Rules:
    - Never modify project automatically
    - Always request confirmation before fixing
    - Always provide text fallback
    """
    
    @classmethod
    def analyze_project(cls, project: Dict[str, Any]) -> DebugResult:
        """Analyze entire project for issues."""
        issues = []
        
        # Check navigation issues
        nav_issues = cls._check_navigation(project)
        issues.extend(nav_issues)
        
        # Check data binding issues
        binding_issues = cls._check_data_bindings(project)
        issues.extend(binding_issues)
        
        # Check missing models
        model_issues = cls._check_missing_models(project)
        issues.extend(model_issues)
        
        # Check flow issues
        flow_issues = cls._check_flows(project)
        issues.extend(flow_issues)
        
        # Check component issues
        component_issues = cls._check_components(project)
        issues.extend(component_issues)
        
        # Generate summary
        has_issues = len(issues) > 0
        error_count = sum(1 for i in issues if i.severity == IssueSeverity.ERROR)
        warning_count = sum(1 for i in issues if i.severity == IssueSeverity.WARNING)
        
        if error_count > 0:
            overall_health = "unhealthy"
            summary = f"Found {error_count} error(s) and {warning_count} warning(s) in your project."
            voice_summary = f"I found {error_count} errors and {warning_count} warnings. Would you like me to explain them?"
        elif warning_count > 0:
            overall_health = "warnings"
            summary = f"Your project has {warning_count} warning(s) but no errors."
            voice_summary = f"Your project has {warning_count} warnings but no errors. Want me to explain?"
        else:
            overall_health = "healthy"
            summary = "Your project looks good! No issues detected."
            voice_summary = "Your project looks good! I didn't find any issues."
        
        return DebugResult(
            has_issues=has_issues,
            issues=issues,
            summary=summary,
            voice_summary=voice_summary,
            overall_health=overall_health
        )
    
    @classmethod
    def _check_navigation(cls, project: Dict[str, Any]) -> List[ProjectIssue]:
        """Check for navigation issues."""
        issues = []
        screens = project.get("screens", [])
        navigation = project.get("navigation", {})
        
        # Check for orphan screens (no navigation to them)
        linked_screens = set()
        for link in navigation.get("links", []):
            linked_screens.add(link.get("destination"))
        
        for screen in screens:
            screen_id = screen.get("id")
            if screen_id not in linked_screens and screen.get("name") != "Home":
                issues.append(ProjectIssue(
                    issue_type=IssueType.NAVIGATION,
                    severity=IssueSeverity.WARNING,
                    title=f"Orphan screen: {screen.get('name')}",
                    description=f"The screen '{screen.get('name')}' has no navigation links pointing to it. Users won't be able to reach it.",
                    voice_description=f"The {screen.get('name')} screen isn't linked from anywhere. Users can't navigate to it.",
                    location={"screen_id": screen_id, "screen_name": screen.get("name")},
                    suggested_fix=f"Add a navigation link to '{screen.get('name')}' from another screen or the menu.",
                    fix_steps=[
                        f"Go to a screen with a button or menu",
                        f"Add a link to '{screen.get('name')}'",
                        f"Or add it to the main navigation menu"
                    ],
                    auto_fixable=False
                ))
        
        return issues
    
    @classmethod
    def _check_data_bindings(cls, project: Dict[str, Any]) -> List[ProjectIssue]:
        """Check for data binding issues."""
        issues = []
        screens = project.get("screens", [])
        models = {m.get("name"): m for m in project.get("data_models", [])}
        
        for screen in screens:
            for component in screen.get("components", []):
                binding = component.get("data_binding")
                if binding:
                    model_name = binding.get("model")
                    if model_name and model_name not in models:
                        issues.append(ProjectIssue(
                            issue_type=IssueType.DATA_BINDING,
                            severity=IssueSeverity.ERROR,
                            title=f"Missing data model: {model_name}",
                            description=f"Component '{component.get('name')}' is bound to model '{model_name}' which doesn't exist.",
                            voice_description=f"A component on {screen.get('name')} is trying to use a data model called {model_name}, but that model doesn't exist.",
                            location={"screen": screen.get("name"), "component": component.get("name")},
                            suggested_fix=f"Create a data model named '{model_name}' or remove the binding.",
                            fix_steps=[
                                f"Create a new data model named '{model_name}'",
                                f"Add the required fields to the model",
                                f"The binding will work automatically"
                            ],
                            auto_fixable=True
                        ))
        
        return issues
    
    @classmethod
    def _check_missing_models(cls, project: Dict[str, Any]) -> List[ProjectIssue]:
        """Check for missing or incomplete data models."""
        issues = []
        models = project.get("data_models", [])
        
        for model in models:
            fields = model.get("fields", [])
            if not fields:
                issues.append(ProjectIssue(
                    issue_type=IssueType.MISSING_MODEL,
                    severity=IssueSeverity.WARNING,
                    title=f"Empty data model: {model.get('name')}",
                    description=f"The data model '{model.get('name')}' has no fields defined.",
                    voice_description=f"The {model.get('name')} data model is empty. It needs some fields.",
                    location={"model": model.get("name")},
                    suggested_fix=f"Add fields to '{model.get('name')}' like id, name, or description.",
                    fix_steps=[
                        f"Edit the {model.get('name')} model",
                        f"Add at least an 'id' field",
                        f"Add other fields your app needs"
                    ],
                    auto_fixable=False
                ))
        
        return issues
    
    @classmethod
    def _check_flows(cls, project: Dict[str, Any]) -> List[ProjectIssue]:
        """Check for broken or incomplete flows."""
        issues = []
        flows = project.get("flows", [])
        
        for flow in flows:
            steps = flow.get("steps", [])
            if len(steps) < 2:
                issues.append(ProjectIssue(
                    issue_type=IssueType.BROKEN_FLOW,
                    severity=IssueSeverity.WARNING,
                    title=f"Incomplete flow: {flow.get('name')}",
                    description=f"The flow '{flow.get('name')}' has fewer than 2 steps. Flows need at least a start and end.",
                    voice_description=f"The {flow.get('name')} flow only has {len(steps)} step. Flows need at least 2 steps.",
                    location={"flow": flow.get("name")},
                    suggested_fix=f"Add more steps to '{flow.get('name')}'.",
                    fix_steps=[
                        f"Edit the {flow.get('name')} flow",
                        f"Add at least one more step",
                        f"Make sure the flow has a clear beginning and end"
                    ],
                    auto_fixable=False
                ))
        
        return issues
    
    @classmethod
    def _check_components(cls, project: Dict[str, Any]) -> List[ProjectIssue]:
        """Check for component issues."""
        issues = []
        screens = project.get("screens", [])
        
        for screen in screens:
            components = screen.get("components", [])
            
            # Check for empty screens
            if not components:
                issues.append(ProjectIssue(
                    issue_type=IssueType.COMPONENT,
                    severity=IssueSeverity.INFO,
                    title=f"Empty screen: {screen.get('name')}",
                    description=f"The screen '{screen.get('name')}' has no components.",
                    voice_description=f"The {screen.get('name')} screen is empty. You might want to add some components.",
                    location={"screen": screen.get("name")},
                    suggested_fix=f"Add components to '{screen.get('name')}' using voice or the builder.",
                    fix_steps=[
                        f"Say 'Add a button to {screen.get('name')}'",
                        f"Or describe what the screen should show"
                    ],
                    auto_fixable=False
                ))
        
        return issues
    
    @classmethod
    def explain_issue(
        cls,
        issue: ProjectIssue,
        mode: ExplanationMode = ExplanationMode.SIMPLE_VOICE
    ) -> Dict[str, str]:
        """Generate explanation for an issue."""
        if mode == ExplanationMode.SIMPLE_VOICE:
            return {
                "text": issue.title,
                "voice": issue.voice_description
            }
        elif mode == ExplanationMode.DETAILED_VOICE:
            detailed = f"{issue.voice_description} {issue.suggested_fix}"
            return {
                "text": f"{issue.title}\n\n{issue.description}\n\nSuggested fix: {issue.suggested_fix}",
                "voice": detailed
            }
        elif mode == ExplanationMode.STEP_BY_STEP:
            steps_text = "\n".join(f"{i+1}. {step}" for i, step in enumerate(issue.fix_steps))
            steps_voice = ". ".join(f"Step {i+1}: {step}" for i, step in enumerate(issue.fix_steps))
            return {
                "text": f"{issue.title}\n\nHow to fix:\n{steps_text}",
                "voice": f"{issue.voice_description}. Here's how to fix it: {steps_voice}"
            }
        else:
            return {
                "text": f"{issue.title}\n\n{issue.description}",
                "voice": None
            }
    
    @classmethod
    def explain_error(cls, error_message: str, context: Dict[str, Any] = None) -> Dict[str, str]:
        """Explain a specific error in user-friendly terms."""
        error_lower = error_message.lower()
        
        explanations = {
            "not found": {
                "text": "The item you're looking for doesn't exist. It may have been deleted or the name is incorrect.",
                "voice": "I couldn't find that item. It might have been deleted or the name might be wrong."
            },
            "permission": {
                "text": "You don't have permission to do this. This might be restricted to certain user roles.",
                "voice": "You don't have permission for this action. It might be restricted."
            },
            "invalid": {
                "text": "The input provided is invalid. Please check the format and try again.",
                "voice": "That input isn't valid. Please check what you entered and try again."
            },
            "connection": {
                "text": "There's a connection problem. Please check your internet and try again.",
                "voice": "There seems to be a connection issue. Please check your internet."
            },
            "timeout": {
                "text": "The operation took too long and timed out. Please try again.",
                "voice": "That took too long. Please try again."
            }
        }
        
        for keyword, explanation in explanations.items():
            if keyword in error_lower:
                return explanation
        
        return {
            "text": f"An error occurred: {error_message}",
            "voice": "Something went wrong. Please try again or ask for help."
        }
    
    @classmethod
    def get_health_summary(cls, project: Dict[str, Any]) -> Dict[str, Any]:
        """Get a quick health summary of the project."""
        result = cls.analyze_project(project)
        
        return {
            "status": result.overall_health,
            "error_count": sum(1 for i in result.issues if i.severity == IssueSeverity.ERROR),
            "warning_count": sum(1 for i in result.issues if i.severity == IssueSeverity.WARNING),
            "info_count": sum(1 for i in result.issues if i.severity == IssueSeverity.INFO),
            "text_summary": result.summary,
            "voice_summary": result.voice_summary,
            "has_issues": result.has_issues
        }
