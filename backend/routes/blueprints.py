# Blueprint Routes - API endpoints for blueprint generation
from fastapi import APIRouter, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional, List
from pydantic import BaseModel

from routes.auth import get_current_user
from engines.blueprint_generation_engine import (
    BlueprintGenerationEngine, BlueprintType, BlueprintStatus, Blueprint
)
from engines.credit_engine import CreditEngine

router = APIRouter(prefix="/blueprints", tags=["Blueprints"])


class GenerateBlueprintRequest(BaseModel):
    specification: str
    blueprint_type: str  # screen, page, flow, data_model, navigation, full_app, component
    project_id: Optional[str] = None
    options: Optional[dict] = None


class ApplyBlueprintRequest(BaseModel):
    blueprint_id: str


def create_blueprint_routes(db: AsyncIOMotorDatabase):
    """Create blueprint routes with database dependency."""
    
    @router.post("/generate")
    async def generate_blueprint(
        request: GenerateBlueprintRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Generate a new blueprint from specification."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Parse blueprint type
        try:
            bp_type = BlueprintType(request.blueprint_type)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid blueprint type: {request.blueprint_type}")
        
        # Get credit cost
        credit_cost = BlueprintGenerationEngine.CREDIT_COSTS.get(bp_type, 1)
        total_credits = CreditEngine.get_total_credits(user.credits)
        
        if total_credits < credit_cost:
            raise HTTPException(
                status_code=402,
                detail=f"Insufficient credits. Required: {credit_cost}, Available: {total_credits}"
            )
        
        # Get project context if project_id provided
        project_context = {}
        if request.project_id:
            project = await db.projects.find_one(
                {"id": request.project_id, "user_id": user.id},
                {"_id": 0}
            )
            if project:
                project_context = project
        
        # Generate blueprint
        result = await BlueprintGenerationEngine.generate(
            specification=request.specification,
            blueprint_type=bp_type,
            project_context=project_context,
            options=request.options
        )
        
        if not result.success:
            raise HTTPException(status_code=400, detail=result.message)
        
        # Deduct credits
        if result.credits_used > 0:
            user.credits, _ = CreditEngine.deduct_credits(user.credits, result.credits_used)
            await db.users.update_one(
                {"id": user.id},
                {"$set": {"credits": user.credits.model_dump()}}
            )
        
        return {
            "success": True,
            "blueprint": result.blueprint.model_dump() if result.blueprint else None,
            "message": result.message,
            "warnings": result.warnings,
            "credits_used": result.credits_used,
            "credits_remaining": CreditEngine.get_total_credits(user.credits),
            "generation_time_ms": result.generation_time_ms
        }
    
    @router.get("/")
    async def list_blueprints(
        blueprint_type: Optional[str] = None,
        status: Optional[str] = None,
        authorization: Optional[str] = Header(None)
    ):
        """List all blueprints."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        bp_type = BlueprintType(blueprint_type) if blueprint_type else None
        bp_status = BlueprintStatus(status) if status else None
        
        blueprints = BlueprintGenerationEngine.list_blueprints(bp_type, bp_status)
        
        return {
            "blueprints": [bp.model_dump() for bp in blueprints],
            "count": len(blueprints)
        }
    
    @router.get("/{blueprint_id}")
    async def get_blueprint(
        blueprint_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Get a specific blueprint."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        blueprint = BlueprintGenerationEngine.get_blueprint(blueprint_id)
        if not blueprint:
            raise HTTPException(status_code=404, detail="Blueprint not found")
        
        return {"blueprint": blueprint.model_dump()}
    
    @router.post("/{blueprint_id}/validate")
    async def validate_blueprint(
        blueprint_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Validate a blueprint."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        blueprint = BlueprintGenerationEngine.get_blueprint(blueprint_id)
        if not blueprint:
            raise HTTPException(status_code=404, detail="Blueprint not found")
        
        result = BlueprintGenerationEngine.validate(blueprint)
        
        return {
            "valid": result.valid,
            "errors": result.errors,
            "warnings": result.warnings,
            "suggestions": result.suggestions
        }
    
    @router.post("/{blueprint_id}/apply")
    async def apply_blueprint(
        blueprint_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Apply a blueprint to the project."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        success, message = BlueprintGenerationEngine.apply_blueprint(blueprint_id)
        
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        return {"success": True, "message": message}
    
    @router.delete("/{blueprint_id}")
    async def delete_blueprint(
        blueprint_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Delete a blueprint."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        success, message = BlueprintGenerationEngine.delete_blueprint(blueprint_id)
        
        if not success:
            raise HTTPException(status_code=404, detail=message)
        
        return {"success": True, "message": message}
    
    return router
