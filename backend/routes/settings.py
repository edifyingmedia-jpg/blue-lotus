# Settings Routes - API endpoints for platform settings
from fastapi import APIRouter, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional, Dict, Any
from pydantic import BaseModel

from routes.auth import get_current_user
from engines.platform_settings_engine import (
    PlatformSettingsEngine, SettingScope, SettingCategory
)

router = APIRouter(prefix="/settings", tags=["Settings"])


class UpdateSettingRequest(BaseModel):
    value: Any


class BulkUpdateRequest(BaseModel):
    settings: Dict[str, Any]


def create_settings_routes(db: AsyncIOMotorDatabase):
    """Create settings routes with database dependency."""
    
    @router.get("/definitions")
    async def get_setting_definitions(
        scope: Optional[str] = None,
        category: Optional[str] = None,
        authorization: Optional[str] = Header(None)
    ):
        """Get setting definitions."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        if scope:
            try:
                s = SettingScope(scope)
                definitions = PlatformSettingsEngine.get_definitions_by_scope(s)
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Invalid scope: {scope}")
        elif category:
            try:
                c = SettingCategory(category)
                definitions = PlatformSettingsEngine.get_definitions_by_category(c)
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Invalid category: {category}")
        else:
            definitions = PlatformSettingsEngine.get_all_definitions()
        
        return {
            "definitions": [d.model_dump() for d in definitions],
            "count": len(definitions)
        }
    
    @router.get("/user")
    async def get_user_settings(
        authorization: Optional[str] = Header(None)
    ):
        """Get all settings for the current user."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        settings = PlatformSettingsEngine.get_user_settings(user.id)
        
        return {"settings": settings}
    
    @router.get("/user/ui")
    async def get_user_settings_ui(
        authorization: Optional[str] = Header(None)
    ):
        """Get user settings organized for UI rendering."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        config = PlatformSettingsEngine.get_settings_ui_config(
            SettingScope.USER,
            user.id
        )
        
        return {"categories": config}
    
    @router.put("/user/{key}")
    async def update_user_setting(
        key: str,
        request: UpdateSettingRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Update a single user setting."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        success, error = PlatformSettingsEngine.set_value(
            key=key,
            value=request.value,
            scope=SettingScope.USER,
            scope_id=user.id,
            updated_by=user.id
        )
        
        if not success:
            raise HTTPException(status_code=400, detail=error)
        
        return {
            "success": True,
            "key": key,
            "value": request.value
        }
    
    @router.put("/user")
    async def bulk_update_user_settings(
        request: BulkUpdateRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Update multiple user settings at once."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        results = PlatformSettingsEngine.bulk_update(
            updates=request.settings,
            scope=SettingScope.USER,
            scope_id=user.id,
            updated_by=user.id
        )
        
        successes = {k: v for k, (success, v) in results.items() if success}
        failures = {k: v for k, (success, v) in results.items() if not success}
        
        return {
            "success": len(failures) == 0,
            "updated": successes,
            "failed": failures
        }
    
    @router.delete("/user/{key}")
    async def reset_user_setting(
        key: str,
        authorization: Optional[str] = Header(None)
    ):
        """Reset a user setting to its default value."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        success, message = PlatformSettingsEngine.reset_to_default(
            key=key,
            scope=SettingScope.USER,
            scope_id=user.id
        )
        
        return {"success": success, "message": message}
    
    @router.get("/project/{project_id}")
    async def get_project_settings(
        project_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Get all settings for a project."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Verify project ownership
        project = await db.projects.find_one(
            {"id": project_id, "user_id": user.id},
            {"_id": 0, "id": 1}
        )
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        settings = PlatformSettingsEngine.get_project_settings(project_id)
        
        return {"settings": settings}
    
    @router.put("/project/{project_id}/{key}")
    async def update_project_setting(
        project_id: str,
        key: str,
        request: UpdateSettingRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Update a project setting."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Verify project ownership
        project = await db.projects.find_one(
            {"id": project_id, "user_id": user.id},
            {"_id": 0, "id": 1}
        )
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        success, error = PlatformSettingsEngine.set_value(
            key=key,
            value=request.value,
            scope=SettingScope.PROJECT,
            scope_id=project_id,
            updated_by=user.id
        )
        
        if not success:
            raise HTTPException(status_code=400, detail=error)
        
        return {
            "success": True,
            "key": key,
            "value": request.value
        }
    
    @router.get("/global")
    async def get_global_settings(
        authorization: Optional[str] = Header(None)
    ):
        """Get all global platform settings."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        settings = PlatformSettingsEngine.get_global_settings()
        
        return {"settings": settings}
    
    @router.get("/export")
    async def export_user_settings(
        authorization: Optional[str] = Header(None)
    ):
        """Export user settings for backup."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        settings = PlatformSettingsEngine.export_settings(
            SettingScope.USER,
            user.id
        )
        
        return {"settings": settings}
    
    @router.post("/import")
    async def import_user_settings(
        request: BulkUpdateRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Import user settings from backup."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        results = PlatformSettingsEngine.import_settings(
            settings=request.settings,
            scope=SettingScope.USER,
            scope_id=user.id,
            updated_by=user.id
        )
        
        successes = sum(1 for success, _ in results.values() if success)
        
        return {
            "success": successes == len(results),
            "imported": successes,
            "total": len(results)
        }
    
    @router.get("/history")
    async def get_settings_history(
        limit: int = 100,
        authorization: Optional[str] = Header(None)
    ):
        """Get recent setting changes."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        history = PlatformSettingsEngine.get_change_history(min(limit, 500))
        
        return {
            "history": history,
            "count": len(history)
        }
    
    return router
