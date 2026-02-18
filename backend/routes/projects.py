# Project Routes
from fastapi import APIRouter, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional, List
from datetime import datetime, timezone

from models.schemas import (
    Project, ProjectCreate, ProjectResponse, ProjectStatus,
    User, PlanType
)
from routes.auth import get_current_user
from engines.plan_enforcement import PlanEnforcementEngine
from engines.generation_engine import GenerationEngine

router = APIRouter(prefix="/projects", tags=["Projects"])


def create_project_routes(db: AsyncIOMotorDatabase):
    """Create project routes with database dependency."""
    
    @router.get("/", response_model=List[ProjectResponse])
    async def get_projects(authorization: Optional[str] = Header(None)):
        """Get all projects for current user."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        projects = await db.projects.find(
            {"user_id": user.id},
            {"_id": 0}
        ).to_list(100)
        
        # Convert dates
        for project in projects:
            if isinstance(project.get("created_at"), str):
                project["created_at"] = datetime.fromisoformat(project["created_at"])
            if isinstance(project.get("updated_at"), str):
                project["updated_at"] = datetime.fromisoformat(project["updated_at"])
        
        return projects
    
    @router.post("/", response_model=ProjectResponse)
    async def create_project(
        project_data: ProjectCreate,
        authorization: Optional[str] = Header(None)
    ):
        """Create a new project."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Check project limit
        project_count = await db.projects.count_documents({"user_id": user.id})
        can_create, message = PlanEnforcementEngine.can_create_project(user.plan, project_count)
        
        if not can_create:
            raise HTTPException(status_code=403, detail=message)
        
        # Generate initial structure
        structure = GenerationEngine.generate_initial_structure(
            project_data.type,
            project_data.description or ""
        )
        
        project = Project(
            user_id=user.id,
            name=project_data.name,
            description=project_data.description,
            type=project_data.type,
            structure=structure
        )
        
        # Prepare for MongoDB
        project_doc = project.model_dump()
        project_doc["created_at"] = project_doc["created_at"].isoformat()
        project_doc["updated_at"] = project_doc["updated_at"].isoformat()
        
        await db.projects.insert_one(project_doc)
        
        return ProjectResponse(**project.model_dump())
    
    @router.get("/{project_id}", response_model=ProjectResponse)
    async def get_project(
        project_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Get a specific project."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        project = await db.projects.find_one(
            {"id": project_id, "user_id": user.id},
            {"_id": 0}
        )
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Convert dates
        if isinstance(project.get("created_at"), str):
            project["created_at"] = datetime.fromisoformat(project["created_at"])
        if isinstance(project.get("updated_at"), str):
            project["updated_at"] = datetime.fromisoformat(project["updated_at"])
        
        return project
    
    @router.put("/{project_id}", response_model=ProjectResponse)
    async def update_project(
        project_id: str,
        project_data: ProjectCreate,
        authorization: Optional[str] = Header(None)
    ):
        """Update a project."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        project = await db.projects.find_one(
            {"id": project_id, "user_id": user.id},
            {"_id": 0}
        )
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        update_data = {
            "name": project_data.name,
            "description": project_data.description,
            "type": project_data.type.value,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.projects.update_one(
            {"id": project_id},
            {"$set": update_data}
        )
        
        updated = await db.projects.find_one({"id": project_id}, {"_id": 0})
        
        if isinstance(updated.get("created_at"), str):
            updated["created_at"] = datetime.fromisoformat(updated["created_at"])
        if isinstance(updated.get("updated_at"), str):
            updated["updated_at"] = datetime.fromisoformat(updated["updated_at"])
        
        return updated
    
    @router.delete("/{project_id}")
    async def delete_project(
        project_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Delete a project."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        result = await db.projects.delete_one({"id": project_id, "user_id": user.id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return {"message": "Project deleted successfully"}
    
    return router
