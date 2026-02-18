# System Settings Engine - Platform configuration and settings
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timezone
from pydantic import BaseModel
import os


class FeatureFlag(BaseModel):
    """A feature toggle."""
    key: str
    name: str
    enabled: bool
    description: str = ""


class GlobalLimit(BaseModel):
    """A global platform limit."""
    key: str
    name: str
    value: int
    description: str = ""


class SystemSettingsEngine:
    """
    System Settings Engine for Owner Dashboard.
    
    Manages:
    - Branding (logo, favicon)
    - Feature toggles
    - Global limits
    - Email templates
    - Notification settings
    """
    
    # Default feature flags
    DEFAULT_FEATURES = {
        "voice_commands": FeatureFlag(key="voice_commands", name="Voice Commands", enabled=True, description="Allow voice control in builder"),
        "ai_generation": FeatureFlag(key="ai_generation", name="AI Generation", enabled=True, description="AI-powered project generation"),
        "publishing": FeatureFlag(key="publishing", name="Publishing", enabled=True, description="Allow users to publish projects"),
        "export": FeatureFlag(key="export", name="Export", enabled=True, description="Allow code export"),
        "team_features": FeatureFlag(key="team_features", name="Team Features", enabled=False, description="Team collaboration features"),
        "beta_features": FeatureFlag(key="beta_features", name="Beta Features", enabled=False, description="Experimental features"),
    }
    
    # Default global limits
    DEFAULT_LIMITS = {
        "max_free_projects": GlobalLimit(key="max_free_projects", name="Max Free Projects", value=3, description="Maximum projects for free users"),
        "max_file_upload_mb": GlobalLimit(key="max_file_upload_mb", name="Max File Upload (MB)", value=10, description="Maximum file upload size"),
        "session_timeout_minutes": GlobalLimit(key="session_timeout_minutes", name="Session Timeout (min)", value=60, description="Owner session timeout"),
        "api_rate_limit": GlobalLimit(key="api_rate_limit", name="API Rate Limit", value=100, description="API calls per minute"),
    }
    
    @classmethod
    async def get_branding(cls, db) -> Dict[str, Any]:
        """Get current branding settings."""
        settings = await db.system_settings.find_one({"type": "branding"}, {"_id": 0})
        
        if not settings:
            # Return defaults
            return {
                "logo_url": "/blue-lotus-transparent.png",
                "favicon_url": "/favicon.ico",
                "app_name": "Blue Lotus",
                "tagline": "Build apps with AI",
                "primary_color": "#4CC3FF",
                "secondary_color": "#003A66"
            }
        
        return settings.get("data", {})
    
    @classmethod
    async def update_branding(cls, db, branding: Dict[str, Any]) -> Tuple[bool, str]:
        """Update branding settings."""
        result = await db.system_settings.update_one(
            {"type": "branding"},
            {"$set": {
                "type": "branding",
                "data": branding,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }},
            upsert=True
        )
        
        return True, "Branding updated successfully"
    
    @classmethod
    async def get_feature_flags(cls, db) -> List[Dict[str, Any]]:
        """Get all feature flags."""
        stored = await db.system_settings.find_one({"type": "feature_flags"}, {"_id": 0})
        
        if stored and stored.get("data"):
            return stored["data"]
        
        # Return defaults
        return [f.model_dump() for f in cls.DEFAULT_FEATURES.values()]
    
    @classmethod
    async def toggle_feature(cls, db, feature_key: str, enabled: bool) -> Tuple[bool, str]:
        """Toggle a feature flag."""
        flags = await cls.get_feature_flags(db)
        
        updated = False
        for flag in flags:
            if flag["key"] == feature_key:
                flag["enabled"] = enabled
                updated = True
                break
        
        if not updated:
            return False, f"Feature '{feature_key}' not found"
        
        await db.system_settings.update_one(
            {"type": "feature_flags"},
            {"$set": {
                "type": "feature_flags",
                "data": flags,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }},
            upsert=True
        )
        
        return True, f"Feature '{feature_key}' {'enabled' if enabled else 'disabled'}"
    
    @classmethod
    async def get_global_limits(cls, db) -> List[Dict[str, Any]]:
        """Get all global limits."""
        stored = await db.system_settings.find_one({"type": "global_limits"}, {"_id": 0})
        
        if stored and stored.get("data"):
            return stored["data"]
        
        return [l.model_dump() for l in cls.DEFAULT_LIMITS.values()]
    
    @classmethod
    async def set_global_limit(cls, db, limit_key: str, value: int) -> Tuple[bool, str]:
        """Set a global limit value."""
        limits = await cls.get_global_limits(db)
        
        updated = False
        for limit in limits:
            if limit["key"] == limit_key:
                limit["value"] = value
                updated = True
                break
        
        if not updated:
            return False, f"Limit '{limit_key}' not found"
        
        await db.system_settings.update_one(
            {"type": "global_limits"},
            {"$set": {
                "type": "global_limits",
                "data": limits,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }},
            upsert=True
        )
        
        return True, f"Limit '{limit_key}' set to {value}"
    
    @classmethod
    async def get_email_templates(cls, db) -> List[Dict[str, Any]]:
        """Get email templates."""
        stored = await db.system_settings.find_one({"type": "email_templates"}, {"_id": 0})
        
        if stored and stored.get("data"):
            return stored["data"]
        
        # Default templates
        return [
            {"key": "welcome", "name": "Welcome Email", "subject": "Welcome to Blue Lotus!", "enabled": True},
            {"key": "password_reset", "name": "Password Reset", "subject": "Reset Your Password", "enabled": True},
            {"key": "subscription", "name": "Subscription Confirmation", "subject": "Your subscription is active!", "enabled": True},
            {"key": "project_published", "name": "Project Published", "subject": "Your project is live!", "enabled": True},
        ]
    
    @classmethod
    async def update_email_template(cls, db, template_key: str, updates: Dict[str, Any]) -> Tuple[bool, str]:
        """Update an email template."""
        templates = await cls.get_email_templates(db)
        
        updated = False
        for template in templates:
            if template["key"] == template_key:
                template.update(updates)
                updated = True
                break
        
        if not updated:
            return False, f"Template '{template_key}' not found"
        
        await db.system_settings.update_one(
            {"type": "email_templates"},
            {"$set": {
                "type": "email_templates",
                "data": templates,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }},
            upsert=True
        )
        
        return True, "Template updated successfully"
    
    @classmethod
    async def get_notification_settings(cls, db) -> Dict[str, Any]:
        """Get notification settings."""
        stored = await db.system_settings.find_one({"type": "notifications"}, {"_id": 0})
        
        if stored and stored.get("data"):
            return stored["data"]
        
        return {
            "email_notifications": True,
            "slack_webhook": "",
            "notify_on_signup": True,
            "notify_on_payment": True,
            "notify_on_error": True,
            "daily_digest": False
        }
    
    @classmethod
    async def update_notification_settings(cls, db, settings: Dict[str, Any]) -> Tuple[bool, str]:
        """Update notification settings."""
        await db.system_settings.update_one(
            {"type": "notifications"},
            {"$set": {
                "type": "notifications",
                "data": settings,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }},
            upsert=True
        )
        
        return True, "Notification settings updated"
