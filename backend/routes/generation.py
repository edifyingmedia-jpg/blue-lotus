# Generation Routes
from fastapi import APIRouter, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional
from datetime import datetime, timezone

from models.schemas import (
    GenerationRequest, GenerationResponse, GenerationType,
    User, Project
)
from routes.auth import get_current_user
from engines.credit_engine import CreditEngine
from engines.generation_engine import GenerationEngine

router = APIRouter(prefix="/generate", tags=["Generation"])


def create_generation_routes(db: AsyncIOMotorDatabase):
    """Create generation routes with database dependency."""
    
    @router.post("/", response_model=GenerationResponse)
    async def generate(
        request: GenerationRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Generate content using AI (deducts credits)."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Get project
        project = await db.projects.find_one(
            {"id": request.project_id, "user_id": user.id},
            {"_id": 0}
        )
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Get cost for this generation type
        cost = CreditEngine.get_generation_cost(request.type)
        
        # Check and refresh bonus credits first
        user.credits = CreditEngine.check_bonus_refresh(user.credits, user.plan)
        
        # Check if user can afford
        if not CreditEngine.can_afford(user.credits, cost):
            raise HTTPException(
                status_code=402,
                detail={
                    "error": "Insufficient credits",
                    "required": cost,
                    "available": CreditEngine.get_total_credits(user.credits)
                }
            )
        
        # Deduct credits
        user.credits, success = CreditEngine.deduct_credits(user.credits, cost)
        
        if not success:
            raise HTTPException(status_code=402, detail="Failed to deduct credits")
        
        # Update user credits in database
        await db.users.update_one(
            {"id": user.id},
            {"$set": {
                "credits": {
                    **user.credits.model_dump(),
                    "last_bonus_refresh": user.credits.last_bonus_refresh.isoformat()
                }
            }}
        )
        
        # Generate content
        output = await GenerationEngine.generate(request, project.get("type", "app"))
        
        return GenerationResponse(
            success=True,
            credits_used=cost,
            credits_remaining=CreditEngine.get_total_credits(user.credits),
            output=output
        )
    
    @router.get("/costs")
    async def get_generation_costs():
        """Get credit costs for different generation types."""
        return {
            "screen": CreditEngine.get_generation_cost(GenerationType.SCREEN),
            "page": CreditEngine.get_generation_cost(GenerationType.PAGE),
            "flow": CreditEngine.get_generation_cost(GenerationType.FLOW),
            "refinement": CreditEngine.get_generation_cost(GenerationType.REFINEMENT)
        }
    
    return router
