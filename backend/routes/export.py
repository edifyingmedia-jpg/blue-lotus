# Export Routes
from fastapi import APIRouter, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional
from datetime import datetime

from models.schemas import ExportRequest, ExportResponse, User
from routes.auth import get_current_user
from engines.export_engine import ExportEngine

router = APIRouter(prefix="/export", tags=["Export"])


def create_export_routes(db: AsyncIOMotorDatabase):
    """Create export routes with database dependency."""
    
    @router.post("/", response_model=ExportResponse)
    async def export_project(
        request: ExportRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Export a project."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Get project
        project_doc = await db.projects.find_one(
            {"id": request.project_id, "user_id": user.id},
            {"_id": 0}
        )
        
        if not project_doc:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Check export permission
        can_export, message = ExportEngine.can_export(user.plan, request.export_type)
        
        if not can_export:
            raise HTTPException(status_code=403, detail=message)
        
        # Convert to Project model
        from models.schemas import Project
        if isinstance(project_doc.get("created_at"), str):
            project_doc["created_at"] = datetime.fromisoformat(project_doc["created_at"])
        if isinstance(project_doc.get("updated_at"), str):
            project_doc["updated_at"] = datetime.fromisoformat(project_doc["updated_at"])
        
        project = Project(**project_doc)
        
        # Perform export
        success, message, download_url = await ExportEngine.export(project, request.export_type)
        
        return ExportResponse(
            success=success,
            download_url=download_url,
            message=message
        )
    
    @router.get("/types")
    async def get_export_types():
        """Get available export types."""
        return {
            "types": ExportEngine.EXPORT_TYPES,
            "descriptions": {
                "full_app": "Complete app with all code and assets",
                "full_website": "Complete website with all pages",
                "code_package": "Source code only",
                "static_assets": "Images, fonts, and styles only"
            }
        }
    
    return router
