# Publishing Routes
from fastapi import APIRouter, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional
from datetime import datetime, timezone

from models.schemas import (
    PublishRequest, PublishResponse, ProjectStatus, User
)
from routes.auth import get_current_user
from engines.publishing_engine import PublishingEngine

router = APIRouter(prefix="/publish", tags=["Publishing"])


def create_publishing_routes(db: AsyncIOMotorDatabase):
    """Create publishing routes with database dependency."""
    
    @router.post("/", response_model=PublishResponse)
    async def publish_project(
        request: PublishRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Publish a project to staging or production."""
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
        
        # Count published projects
        published_count = await db.projects.count_documents({
            "user_id": user.id,
            "production_url": {"$ne": None}
        })
        
        # Check permissions
        can_publish, message = PublishingEngine.can_publish(
            user.plan,
            request.environment,
            published_count
        )
        
        if not can_publish:
            raise HTTPException(status_code=403, detail=message)
        
        # Import Project model for type conversion
        from models.schemas import Project
        if isinstance(project_doc.get("created_at"), str):
            project_doc["created_at"] = datetime.fromisoformat(project_doc["created_at"])
        if isinstance(project_doc.get("updated_at"), str):
            project_doc["updated_at"] = datetime.fromisoformat(project_doc["updated_at"])
        
        project = Project(**project_doc)
        
        # Publish
        if request.environment == "staging":
            success, msg, url = await PublishingEngine.publish_to_staging(project)
            update_field = "staging_url"
            new_status = ProjectStatus.STAGED
        else:
            success, msg, url = await PublishingEngine.publish_to_production(project)
            update_field = "production_url"
            new_status = ProjectStatus.PUBLISHED
        
        if success:
            await db.projects.update_one(
                {"id": request.project_id},
                {"$set": {
                    update_field: url,
                    "status": new_status.value,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
        
        return PublishResponse(
            success=success,
            url=url,
            message=msg
        )
    
    @router.delete("/{project_id}")
    async def unpublish_project(
        project_id: str,
        environment: str,
        authorization: Optional[str] = Header(None)
    ):
        """Unpublish a project from staging or production."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        project = await db.projects.find_one(
            {"id": project_id, "user_id": user.id},
            {"_id": 0}
        )
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        if environment == "staging":
            update_field = "staging_url"
        elif environment == "production":
            update_field = "production_url"
        else:
            raise HTTPException(status_code=400, detail="Invalid environment")
        
        await db.projects.update_one(
            {"id": project_id},
            {"$set": {
                update_field: None,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        return {"message": f"Successfully unpublished from {environment}"}
    
    @router.get("/status/{project_id}")
    async def get_publish_status(
        project_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Get publishing status for a project."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        project = await db.projects.find_one(
            {"id": project_id, "user_id": user.id},
            {"_id": 0, "status": 1, "staging_url": 1, "production_url": 1}
        )
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return {
            "status": project.get("status", "draft"),
            "staging_url": project.get("staging_url"),
            "production_url": project.get("production_url"),
            "is_staged": project.get("staging_url") is not None,
            "is_published": project.get("production_url") is not None
        }
    
    return router
