# Project Generation Safety Layer - Validates and prevents accidental overwrites
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class SafetyCheckResult(str, Enum):
    PASSED = "passed"
    WARNING = "warning"
    BLOCKED = "blocked"


class SafetyIssue(BaseModel):
    """A safety issue detected during validation."""
    issue_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    severity: SafetyCheckResult
    category: str
    message: str
    suggestion: str = ""
    auto_fixable: bool = False


class SafetyValidationResult(BaseModel):
    """Result of safety validation."""
    passed: bool
    overall_status: SafetyCheckResult
    issues: List[SafetyIssue] = []
    confirmation_required: bool = False
    confirmation_message: str = ""
    voice_message: str = ""


class ProjectGenerationSafetyLayer:
    """
    Project Generation Safety Layer.
    
    Responsibilities:
    - Prevent accidental overwrites
    - Validate generated structures
    - Detect missing or invalid components
    - Ensure navigation integrity
    - Ensure data model consistency
    
    Rules:
    - must_confirm_before_overwriting: true
    - must_run_integrity_checks: true
    - must_provide_fix_suggestions: true
    """
    
    @classmethod
    async def validate_generation(
        cls,
        blueprint: Dict[str, Any],
        existing_project: Optional[Dict[str, Any]] = None
    ) -> SafetyValidationResult:
        """Validate a generated blueprint before applying."""
        issues = []
        
        # Check for overwrites
        if existing_project:
            overwrite_issues = cls._check_overwrites(blueprint, existing_project)
            issues.extend(overwrite_issues)
        
        # Validate structure
        structure_issues = cls._validate_structure(blueprint)
        issues.extend(structure_issues)
        
        # Validate navigation integrity
        nav_issues = cls._validate_navigation(blueprint)
        issues.extend(nav_issues)
        
        # Validate data model consistency
        model_issues = cls._validate_data_models(blueprint)
        issues.extend(model_issues)
        
        # Determine overall status
        blocked = any(i.severity == SafetyCheckResult.BLOCKED for i in issues)
        warnings = any(i.severity == SafetyCheckResult.WARNING for i in issues)
        
        if blocked:
            overall_status = SafetyCheckResult.BLOCKED
            confirmation_required = False
            confirmation_message = "Generation blocked due to critical issues. Please fix the issues first."
            voice_message = f"I found {len(issues)} critical issues that need to be fixed before generating."
        elif warnings:
            overall_status = SafetyCheckResult.WARNING
            confirmation_required = True
            confirmation_message = f"Found {len(issues)} warning(s). Would you like to proceed anyway?"
            voice_message = f"I found {len(issues)} potential issues, but nothing critical. Should I continue?"
        else:
            overall_status = SafetyCheckResult.PASSED
            confirmation_required = False
            confirmation_message = "All safety checks passed!"
            voice_message = "All safety checks passed. Ready to generate."
        
        return SafetyValidationResult(
            passed=not blocked,
            overall_status=overall_status,
            issues=issues,
            confirmation_required=confirmation_required,
            confirmation_message=confirmation_message,
            voice_message=voice_message
        )
    
    @classmethod
    def _check_overwrites(
        cls,
        blueprint: Dict[str, Any],
        existing: Dict[str, Any]
    ) -> List[SafetyIssue]:
        """Check for potential overwrites of existing content."""
        issues = []
        
        # Check screen overwrites
        new_screens = blueprint.get("screens", [])
        existing_screens = existing.get("structure", {}).get("screens", [])
        
        new_names = [s.get("name", "") for s in new_screens if isinstance(s, dict)]
        existing_names = [s.get("name", "") if isinstance(s, dict) else s for s in existing_screens]
        
        overlapping = set(new_names) & set(existing_names)
        if overlapping:
            issues.append(SafetyIssue(
                severity=SafetyCheckResult.WARNING,
                category="overwrite",
                message=f"Screens will be overwritten: {', '.join(overlapping)}",
                suggestion="Consider renaming new screens to avoid conflicts",
                auto_fixable=False
            ))
        
        # Check data model overwrites
        new_models = blueprint.get("data_models", [])
        existing_models = existing.get("structure", {}).get("data_models", [])
        
        new_model_names = [m.get("name", "") for m in new_models if isinstance(m, dict)]
        existing_model_names = [m.get("name", "") if isinstance(m, dict) else m for m in existing_models]
        
        overlapping_models = set(new_model_names) & set(existing_model_names)
        if overlapping_models:
            issues.append(SafetyIssue(
                severity=SafetyCheckResult.WARNING,
                category="overwrite",
                message=f"Data models will be overwritten: {', '.join(overlapping_models)}",
                suggestion="Existing data may be affected. Back up your project first.",
                auto_fixable=False
            ))
        
        return issues
    
    @classmethod
    def _validate_structure(cls, blueprint: Dict[str, Any]) -> List[SafetyIssue]:
        """Validate the generated structure."""
        issues = []
        
        # Check for empty project
        screens = blueprint.get("screens", [])
        if not screens:
            issues.append(SafetyIssue(
                severity=SafetyCheckResult.BLOCKED,
                category="structure",
                message="Generated project has no screens",
                suggestion="The description may be too vague. Try being more specific.",
                auto_fixable=False
            ))
        
        # Check for screens without components
        for screen in screens:
            if isinstance(screen, dict):
                components = screen.get("components", [])
                if not components:
                    issues.append(SafetyIssue(
                        severity=SafetyCheckResult.WARNING,
                        category="structure",
                        message=f"Screen '{screen.get('name', 'Unknown')}' has no components",
                        suggestion="Add components to this screen or remove it",
                        auto_fixable=True
                    ))
        
        # Check for too many screens (complexity warning)
        if len(screens) > 15:
            issues.append(SafetyIssue(
                severity=SafetyCheckResult.WARNING,
                category="complexity",
                message=f"Project has {len(screens)} screens, which may be complex to manage",
                suggestion="Consider splitting into multiple projects or reducing scope",
                auto_fixable=False
            ))
        
        return issues
    
    @classmethod
    def _validate_navigation(cls, blueprint: Dict[str, Any]) -> List[SafetyIssue]:
        """Validate navigation integrity."""
        issues = []
        
        navigation = blueprint.get("navigation", {})
        screens = blueprint.get("screens", [])
        screen_names = [s.get("name", "") if isinstance(s, dict) else s for s in screens]
        
        # Check root screen exists
        root = navigation.get("root_screen", "")
        if root and root not in screen_names:
            issues.append(SafetyIssue(
                severity=SafetyCheckResult.BLOCKED,
                category="navigation",
                message=f"Root screen '{root}' does not exist",
                suggestion=f"Change root_screen to one of: {', '.join(screen_names[:5])}",
                auto_fixable=True
            ))
        
        # Check routes point to valid screens
        routes = navigation.get("routes", [])
        for route in routes:
            if isinstance(route, dict):
                screen = route.get("screen", "")
                if screen and screen not in screen_names:
                    issues.append(SafetyIssue(
                        severity=SafetyCheckResult.WARNING,
                        category="navigation",
                        message=f"Route '{route.get('path', '/')}' points to non-existent screen '{screen}'",
                        suggestion="Remove this route or create the missing screen",
                        auto_fixable=True
                    ))
        
        return issues
    
    @classmethod
    def _validate_data_models(cls, blueprint: Dict[str, Any]) -> List[SafetyIssue]:
        """Validate data model consistency."""
        issues = []
        
        data_models = blueprint.get("data_models", [])
        model_names = [m.get("name", "") for m in data_models if isinstance(m, dict)]
        
        # Check for duplicate model names
        seen = set()
        for name in model_names:
            if name in seen:
                issues.append(SafetyIssue(
                    severity=SafetyCheckResult.BLOCKED,
                    category="data_model",
                    message=f"Duplicate data model name: '{name}'",
                    suggestion="Each data model must have a unique name",
                    auto_fixable=False
                ))
            seen.add(name)
        
        # Check relationships reference valid models
        for model in data_models:
            if isinstance(model, dict):
                relationships = model.get("relationships", [])
                for rel in relationships:
                    if isinstance(rel, dict):
                        target = rel.get("target", "")
                        if target and target not in model_names:
                            issues.append(SafetyIssue(
                                severity=SafetyCheckResult.WARNING,
                                category="data_model",
                                message=f"Model '{model.get('name', '')}' references unknown model '{target}'",
                                suggestion=f"Create the '{target}' model or remove this relationship",
                                auto_fixable=True
                            ))
        
        # Check for models without ID field
        for model in data_models:
            if isinstance(model, dict):
                fields = model.get("fields", [])
                field_names = [f.get("name", "") if isinstance(f, dict) else f for f in fields]
                if "id" not in field_names:
                    issues.append(SafetyIssue(
                        severity=SafetyCheckResult.WARNING,
                        category="data_model",
                        message=f"Model '{model.get('name', '')}' has no 'id' field",
                        suggestion="Add an 'id' field for proper identification",
                        auto_fixable=True
                    ))
        
        return issues
    
    @classmethod
    async def auto_fix_issues(
        cls,
        blueprint: Dict[str, Any],
        issues: List[SafetyIssue]
    ) -> Tuple[Dict[str, Any], List[str]]:
        """Attempt to auto-fix fixable issues."""
        fixed = []
        
        for issue in issues:
            if not issue.auto_fixable:
                continue
            
            if issue.category == "structure" and "has no components" in issue.message:
                # Add placeholder component
                screen_name = issue.message.split("'")[1]
                for screen in blueprint.get("screens", []):
                    if isinstance(screen, dict) and screen.get("name") == screen_name:
                        screen["components"] = [{"type": "text", "name": "placeholder", "props": {"content": "Add content here"}}]
                        fixed.append(f"Added placeholder to '{screen_name}'")
            
            elif issue.category == "navigation" and "does not exist" in issue.message:
                # Set root to first screen
                screens = blueprint.get("screens", [])
                if screens:
                    first_screen = screens[0].get("name", "") if isinstance(screens[0], dict) else screens[0]
                    blueprint["navigation"]["root_screen"] = first_screen
                    fixed.append(f"Set root_screen to '{first_screen}'")
            
            elif issue.category == "data_model" and "has no 'id' field" in issue.message:
                # Add ID field
                model_name = issue.message.split("'")[1]
                for model in blueprint.get("data_models", []):
                    if isinstance(model, dict) and model.get("name") == model_name:
                        fields = model.get("fields", [])
                        fields.insert(0, {"name": "id", "type": "text", "required": True})
                        fixed.append(f"Added 'id' field to '{model_name}'")
        
        return blueprint, fixed
    
    @classmethod
    def get_safety_summary(cls, result: SafetyValidationResult) -> str:
        """Get a summary of safety validation."""
        if result.passed and not result.issues:
            return "✅ All safety checks passed"
        
        blocked = [i for i in result.issues if i.severity == SafetyCheckResult.BLOCKED]
        warnings = [i for i in result.issues if i.severity == SafetyCheckResult.WARNING]
        
        summary = ""
        if blocked:
            summary += f"🛑 **{len(blocked)} Critical Issues:**\n"
            for i in blocked:
                summary += f"  • {i.message}\n"
        
        if warnings:
            summary += f"⚠️ **{len(warnings)} Warnings:**\n"
            for i in warnings:
                summary += f"  • {i.message}\n"
        
        return summary
