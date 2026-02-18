# Platform Settings Engine - Manages global and user-specific platform settings
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class SettingScope(str, Enum):
    GLOBAL = "global"
    USER = "user"
    PROJECT = "project"
    TEAM = "team"


class SettingCategory(str, Enum):
    GENERAL = "general"
    APPEARANCE = "appearance"
    NOTIFICATIONS = "notifications"
    PRIVACY = "privacy"
    SECURITY = "security"
    BILLING = "billing"
    AI = "ai"
    BUILDER = "builder"
    EXPORT = "export"
    PUBLISHING = "publishing"
    INTEGRATIONS = "integrations"


class SettingType(str, Enum):
    STRING = "string"
    NUMBER = "number"
    BOOLEAN = "boolean"
    SELECT = "select"
    MULTI_SELECT = "multi_select"
    COLOR = "color"
    JSON = "json"


class SettingDefinition(BaseModel):
    """Definition of a platform setting."""
    key: str
    label: str
    description: Optional[str] = None
    category: SettingCategory
    scope: SettingScope
    type: SettingType
    default_value: Any
    options: List[Dict[str, Any]] = []  # For select/multi_select types
    validation: Dict[str, Any] = {}  # min, max, pattern, etc.
    requires_restart: bool = False
    sensitive: bool = False
    visible: bool = True


class SettingValue(BaseModel):
    """Stored setting value."""
    key: str
    value: Any
    scope: SettingScope
    scope_id: Optional[str] = None  # user_id, project_id, or team_id
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_by: Optional[str] = None


class PlatformSettingsEngine:
    """
    Platform Settings Engine manages all platform configuration.
    
    Responsibilities:
    - Define and manage global platform settings
    - Manage user-specific preferences
    - Manage project-specific settings
    - Manage team settings
    - Provide settings UI configuration
    - Handle settings migrations
    - Validate setting values
    
    Rules:
    - Never expose sensitive settings to unauthorized users
    - Always validate setting values before storage
    - Maintain backwards compatibility
    - Respect setting scopes
    - Log all setting changes
    """
    
    # Setting definitions registry
    _definitions: Dict[str, SettingDefinition] = {}
    
    # Setting values storage (in-memory, will be DB-backed)
    _values: Dict[str, SettingValue] = {}
    
    # Setting change history
    _history: List[Dict[str, Any]] = []
    
    @classmethod
    def initialize_default_settings(cls):
        """Initialize all default platform settings."""
        defaults = [
            # General settings
            SettingDefinition(
                key="platform.name",
                label="Platform Name",
                description="Name displayed throughout the application",
                category=SettingCategory.GENERAL,
                scope=SettingScope.GLOBAL,
                type=SettingType.STRING,
                default_value="Blue Lotus"
            ),
            SettingDefinition(
                key="platform.tagline",
                label="Platform Tagline",
                category=SettingCategory.GENERAL,
                scope=SettingScope.GLOBAL,
                type=SettingType.STRING,
                default_value="Build beautiful apps without code"
            ),
            SettingDefinition(
                key="platform.maintenance_mode",
                label="Maintenance Mode",
                description="Enable to put the platform in maintenance mode",
                category=SettingCategory.GENERAL,
                scope=SettingScope.GLOBAL,
                type=SettingType.BOOLEAN,
                default_value=False,
                requires_restart=False
            ),
            
            # Appearance settings
            SettingDefinition(
                key="appearance.theme",
                label="Theme",
                description="Color theme for the platform",
                category=SettingCategory.APPEARANCE,
                scope=SettingScope.USER,
                type=SettingType.SELECT,
                default_value="dark",
                options=[
                    {"value": "dark", "label": "Dark"},
                    {"value": "light", "label": "Light"},
                    {"value": "system", "label": "System"}
                ]
            ),
            SettingDefinition(
                key="appearance.accent_color",
                label="Accent Color",
                description="Primary accent color",
                category=SettingCategory.APPEARANCE,
                scope=SettingScope.USER,
                type=SettingType.COLOR,
                default_value="#3b82f6"
            ),
            SettingDefinition(
                key="appearance.compact_mode",
                label="Compact Mode",
                description="Use compact UI layout",
                category=SettingCategory.APPEARANCE,
                scope=SettingScope.USER,
                type=SettingType.BOOLEAN,
                default_value=False
            ),
            SettingDefinition(
                key="appearance.animations",
                label="Enable Animations",
                description="Enable UI animations and transitions",
                category=SettingCategory.APPEARANCE,
                scope=SettingScope.USER,
                type=SettingType.BOOLEAN,
                default_value=True
            ),
            
            # Notification settings
            SettingDefinition(
                key="notifications.email_enabled",
                label="Email Notifications",
                description="Receive notifications via email",
                category=SettingCategory.NOTIFICATIONS,
                scope=SettingScope.USER,
                type=SettingType.BOOLEAN,
                default_value=True
            ),
            SettingDefinition(
                key="notifications.marketing_enabled",
                label="Marketing Emails",
                description="Receive marketing and promotional emails",
                category=SettingCategory.NOTIFICATIONS,
                scope=SettingScope.USER,
                type=SettingType.BOOLEAN,
                default_value=False
            ),
            SettingDefinition(
                key="notifications.project_updates",
                label="Project Updates",
                description="Notifications about project status changes",
                category=SettingCategory.NOTIFICATIONS,
                scope=SettingScope.USER,
                type=SettingType.BOOLEAN,
                default_value=True
            ),
            SettingDefinition(
                key="notifications.credit_alerts",
                label="Credit Alerts",
                description="Alert when credits are running low",
                category=SettingCategory.NOTIFICATIONS,
                scope=SettingScope.USER,
                type=SettingType.BOOLEAN,
                default_value=True
            ),
            SettingDefinition(
                key="notifications.credit_threshold",
                label="Credit Alert Threshold",
                description="Credit amount to trigger low credit alert",
                category=SettingCategory.NOTIFICATIONS,
                scope=SettingScope.USER,
                type=SettingType.NUMBER,
                default_value=10,
                validation={"min": 1, "max": 100}
            ),
            
            # Privacy settings
            SettingDefinition(
                key="privacy.profile_visible",
                label="Public Profile",
                description="Make your profile visible to others",
                category=SettingCategory.PRIVACY,
                scope=SettingScope.USER,
                type=SettingType.BOOLEAN,
                default_value=False
            ),
            SettingDefinition(
                key="privacy.projects_visible",
                label="Public Projects",
                description="Allow others to see your published projects",
                category=SettingCategory.PRIVACY,
                scope=SettingScope.USER,
                type=SettingType.BOOLEAN,
                default_value=True
            ),
            SettingDefinition(
                key="privacy.analytics_enabled",
                label="Usage Analytics",
                description="Help improve Blue Lotus by sharing anonymous usage data",
                category=SettingCategory.PRIVACY,
                scope=SettingScope.USER,
                type=SettingType.BOOLEAN,
                default_value=True
            ),
            
            # Security settings
            SettingDefinition(
                key="security.two_factor_enabled",
                label="Two-Factor Authentication",
                description="Require 2FA for login",
                category=SettingCategory.SECURITY,
                scope=SettingScope.USER,
                type=SettingType.BOOLEAN,
                default_value=False
            ),
            SettingDefinition(
                key="security.session_timeout",
                label="Session Timeout",
                description="Auto-logout after inactivity (minutes)",
                category=SettingCategory.SECURITY,
                scope=SettingScope.USER,
                type=SettingType.NUMBER,
                default_value=60,
                validation={"min": 5, "max": 1440}
            ),
            
            # AI settings
            SettingDefinition(
                key="ai.auto_suggestions",
                label="AI Auto-Suggestions",
                description="Show AI-powered suggestions while building",
                category=SettingCategory.AI,
                scope=SettingScope.USER,
                type=SettingType.BOOLEAN,
                default_value=True
            ),
            SettingDefinition(
                key="ai.explanation_detail",
                label="Explanation Detail Level",
                description="How detailed should AI explanations be",
                category=SettingCategory.AI,
                scope=SettingScope.USER,
                type=SettingType.SELECT,
                default_value="normal",
                options=[
                    {"value": "brief", "label": "Brief"},
                    {"value": "normal", "label": "Normal"},
                    {"value": "detailed", "label": "Detailed"}
                ]
            ),
            SettingDefinition(
                key="ai.confirmation_prompts",
                label="Confirmation Prompts",
                description="Ask for confirmation before major AI actions",
                category=SettingCategory.AI,
                scope=SettingScope.USER,
                type=SettingType.BOOLEAN,
                default_value=True
            ),
            
            # Builder settings
            SettingDefinition(
                key="builder.auto_save",
                label="Auto-Save",
                description="Automatically save project changes",
                category=SettingCategory.BUILDER,
                scope=SettingScope.USER,
                type=SettingType.BOOLEAN,
                default_value=True
            ),
            SettingDefinition(
                key="builder.auto_save_interval",
                label="Auto-Save Interval",
                description="Seconds between auto-saves",
                category=SettingCategory.BUILDER,
                scope=SettingScope.USER,
                type=SettingType.NUMBER,
                default_value=30,
                validation={"min": 10, "max": 300}
            ),
            SettingDefinition(
                key="builder.show_grid",
                label="Show Grid",
                description="Display alignment grid in the builder",
                category=SettingCategory.BUILDER,
                scope=SettingScope.USER,
                type=SettingType.BOOLEAN,
                default_value=True
            ),
            SettingDefinition(
                key="builder.snap_to_grid",
                label="Snap to Grid",
                description="Snap components to grid when moving",
                category=SettingCategory.BUILDER,
                scope=SettingScope.USER,
                type=SettingType.BOOLEAN,
                default_value=True
            ),
            SettingDefinition(
                key="builder.preview_device",
                label="Default Preview Device",
                description="Default device for preview",
                category=SettingCategory.BUILDER,
                scope=SettingScope.USER,
                type=SettingType.SELECT,
                default_value="mobile",
                options=[
                    {"value": "mobile", "label": "Mobile"},
                    {"value": "tablet", "label": "Tablet"},
                    {"value": "desktop", "label": "Desktop"}
                ]
            ),
            
            # Export settings
            SettingDefinition(
                key="export.default_format",
                label="Default Export Format",
                description="Default code format for exports",
                category=SettingCategory.EXPORT,
                scope=SettingScope.USER,
                type=SettingType.SELECT,
                default_value="react",
                options=[
                    {"value": "react", "label": "React"},
                    {"value": "react_native", "label": "React Native"},
                    {"value": "flutter", "label": "Flutter"},
                    {"value": "html", "label": "HTML/CSS"}
                ]
            ),
            SettingDefinition(
                key="export.include_assets",
                label="Include Assets",
                description="Include images and fonts in export",
                category=SettingCategory.EXPORT,
                scope=SettingScope.USER,
                type=SettingType.BOOLEAN,
                default_value=True
            ),
            
            # Publishing settings
            SettingDefinition(
                key="publishing.auto_ssl",
                label="Auto SSL",
                description="Automatically provision SSL certificates",
                category=SettingCategory.PUBLISHING,
                scope=SettingScope.GLOBAL,
                type=SettingType.BOOLEAN,
                default_value=True
            ),
            SettingDefinition(
                key="publishing.custom_domain_enabled",
                label="Custom Domains",
                description="Allow custom domains for published apps",
                category=SettingCategory.PUBLISHING,
                scope=SettingScope.GLOBAL,
                type=SettingType.BOOLEAN,
                default_value=True
            ),
            
            # Project-level settings
            SettingDefinition(
                key="project.is_public",
                label="Public Project",
                description="Make this project publicly accessible",
                category=SettingCategory.PRIVACY,
                scope=SettingScope.PROJECT,
                type=SettingType.BOOLEAN,
                default_value=False
            ),
            SettingDefinition(
                key="project.allow_comments",
                label="Allow Comments",
                description="Allow visitors to comment on published project",
                category=SettingCategory.GENERAL,
                scope=SettingScope.PROJECT,
                type=SettingType.BOOLEAN,
                default_value=False
            )
        ]
        
        for setting in defaults:
            cls._definitions[setting.key] = setting
    
    @classmethod
    def get_definition(cls, key: str) -> Optional[SettingDefinition]:
        """Get a setting definition by key."""
        return cls._definitions.get(key)
    
    @classmethod
    def get_definitions_by_category(cls, category: SettingCategory) -> List[SettingDefinition]:
        """Get all setting definitions in a category."""
        return [d for d in cls._definitions.values() if d.category == category]
    
    @classmethod
    def get_definitions_by_scope(cls, scope: SettingScope) -> List[SettingDefinition]:
        """Get all setting definitions for a scope."""
        return [d for d in cls._definitions.values() if d.scope == scope]
    
    @classmethod
    def get_all_definitions(cls) -> List[SettingDefinition]:
        """Get all setting definitions."""
        return list(cls._definitions.values())
    
    @classmethod
    def validate_value(cls, key: str, value: Any) -> Tuple[bool, Optional[str]]:
        """Validate a setting value against its definition."""
        definition = cls._definitions.get(key)
        if not definition:
            return False, f"Unknown setting: {key}"
        
        # Type validation
        if definition.type == SettingType.STRING:
            if not isinstance(value, str):
                return False, "Value must be a string"
        
        elif definition.type == SettingType.NUMBER:
            if not isinstance(value, (int, float)):
                return False, "Value must be a number"
            
            # Range validation
            validation = definition.validation
            if "min" in validation and value < validation["min"]:
                return False, f"Value must be at least {validation['min']}"
            if "max" in validation and value > validation["max"]:
                return False, f"Value must be at most {validation['max']}"
        
        elif definition.type == SettingType.BOOLEAN:
            if not isinstance(value, bool):
                return False, "Value must be a boolean"
        
        elif definition.type == SettingType.SELECT:
            valid_values = [opt["value"] for opt in definition.options]
            if value not in valid_values:
                return False, f"Value must be one of: {', '.join(valid_values)}"
        
        elif definition.type == SettingType.MULTI_SELECT:
            if not isinstance(value, list):
                return False, "Value must be a list"
            valid_values = [opt["value"] for opt in definition.options]
            for v in value:
                if v not in valid_values:
                    return False, f"Invalid option: {v}"
        
        elif definition.type == SettingType.COLOR:
            if not isinstance(value, str) or not value.startswith("#"):
                return False, "Value must be a hex color (e.g., #3b82f6)"
        
        return True, None
    
    @classmethod
    def get_value(
        cls,
        key: str,
        scope: SettingScope = SettingScope.GLOBAL,
        scope_id: Optional[str] = None
    ) -> Any:
        """Get a setting value, falling back to default if not set."""
        storage_key = cls._make_storage_key(key, scope, scope_id)
        
        if storage_key in cls._values:
            return cls._values[storage_key].value
        
        # Fall back to definition default
        definition = cls._definitions.get(key)
        if definition:
            return definition.default_value
        
        return None
    
    @classmethod
    def set_value(
        cls,
        key: str,
        value: Any,
        scope: SettingScope = SettingScope.GLOBAL,
        scope_id: Optional[str] = None,
        updated_by: Optional[str] = None
    ) -> Tuple[bool, Optional[str]]:
        """Set a setting value."""
        # Validate the value
        is_valid, error = cls.validate_value(key, value)
        if not is_valid:
            return False, error
        
        storage_key = cls._make_storage_key(key, scope, scope_id)
        
        # Get old value for history
        old_value = cls._values.get(storage_key)
        
        # Store the new value
        cls._values[storage_key] = SettingValue(
            key=key,
            value=value,
            scope=scope,
            scope_id=scope_id,
            updated_by=updated_by
        )
        
        # Record in history
        cls._history.append({
            "key": key,
            "old_value": old_value.value if old_value else None,
            "new_value": value,
            "scope": scope.value,
            "scope_id": scope_id,
            "updated_by": updated_by,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
        return True, None
    
    @classmethod
    def reset_to_default(
        cls,
        key: str,
        scope: SettingScope = SettingScope.GLOBAL,
        scope_id: Optional[str] = None
    ) -> Tuple[bool, Optional[str]]:
        """Reset a setting to its default value."""
        storage_key = cls._make_storage_key(key, scope, scope_id)
        
        if storage_key in cls._values:
            del cls._values[storage_key]
            return True, "Setting reset to default"
        
        return True, "Setting was already at default"
    
    @classmethod
    def get_user_settings(cls, user_id: str) -> Dict[str, Any]:
        """Get all settings for a user, with defaults applied."""
        settings = {}
        
        for definition in cls._definitions.values():
            if definition.scope == SettingScope.USER:
                settings[definition.key] = cls.get_value(
                    definition.key,
                    SettingScope.USER,
                    user_id
                )
        
        return settings
    
    @classmethod
    def get_project_settings(cls, project_id: str) -> Dict[str, Any]:
        """Get all settings for a project, with defaults applied."""
        settings = {}
        
        for definition in cls._definitions.values():
            if definition.scope == SettingScope.PROJECT:
                settings[definition.key] = cls.get_value(
                    definition.key,
                    SettingScope.PROJECT,
                    project_id
                )
        
        return settings
    
    @classmethod
    def get_global_settings(cls) -> Dict[str, Any]:
        """Get all global settings."""
        settings = {}
        
        for definition in cls._definitions.values():
            if definition.scope == SettingScope.GLOBAL:
                settings[definition.key] = cls.get_value(definition.key)
        
        return settings
    
    @classmethod
    def bulk_update(
        cls,
        updates: Dict[str, Any],
        scope: SettingScope = SettingScope.USER,
        scope_id: Optional[str] = None,
        updated_by: Optional[str] = None
    ) -> Dict[str, Tuple[bool, Optional[str]]]:
        """Update multiple settings at once."""
        results = {}
        
        for key, value in updates.items():
            success, error = cls.set_value(key, value, scope, scope_id, updated_by)
            results[key] = (success, error)
        
        return results
    
    @classmethod
    def export_settings(
        cls,
        scope: SettingScope,
        scope_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Export settings for backup/transfer."""
        settings = {}
        
        for storage_key, setting_value in cls._values.items():
            if setting_value.scope == scope and setting_value.scope_id == scope_id:
                settings[setting_value.key] = setting_value.value
        
        return settings
    
    @classmethod
    def import_settings(
        cls,
        settings: Dict[str, Any],
        scope: SettingScope,
        scope_id: Optional[str] = None,
        updated_by: Optional[str] = None
    ) -> Dict[str, Tuple[bool, Optional[str]]]:
        """Import settings from backup."""
        return cls.bulk_update(settings, scope, scope_id, updated_by)
    
    @classmethod
    def get_settings_ui_config(
        cls,
        scope: SettingScope,
        user_id: Optional[str] = None
    ) -> Dict[str, List[Dict[str, Any]]]:
        """Get settings organized by category for UI rendering."""
        config = {}
        
        definitions = cls.get_definitions_by_scope(scope)
        
        for definition in definitions:
            if not definition.visible:
                continue
            
            category = definition.category.value
            if category not in config:
                config[category] = []
            
            # Get current value
            current_value = cls.get_value(
                definition.key,
                scope,
                user_id if scope == SettingScope.USER else None
            )
            
            config[category].append({
                "key": definition.key,
                "label": definition.label,
                "description": definition.description,
                "type": definition.type.value,
                "value": current_value,
                "default": definition.default_value,
                "options": definition.options,
                "validation": definition.validation,
                "requires_restart": definition.requires_restart
            })
        
        return config
    
    @classmethod
    def _make_storage_key(cls, key: str, scope: SettingScope, scope_id: Optional[str]) -> str:
        """Create a unique storage key for a setting."""
        if scope_id:
            return f"{scope.value}:{scope_id}:{key}"
        return f"{scope.value}:{key}"
    
    @classmethod
    def get_change_history(cls, limit: int = 100) -> List[Dict[str, Any]]:
        """Get recent setting changes."""
        return cls._history[-limit:]


# Initialize default settings on module load
PlatformSettingsEngine.initialize_default_settings()
