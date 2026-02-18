# Intelligence Routes - AI-powered assistance and recommendations
from fastapi import APIRouter, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional, List
from datetime import datetime, timezone
from pydantic import BaseModel

from routes.auth import get_current_user
from engines.runtime_intelligence_engine import (
    RuntimeIntelligenceEngine, UserContext, IntelligenceOutput, IntentType
)
from engines.credit_engine import CreditEngine

router = APIRouter(prefix="/intelligence", tags=["Intelligence"])


class PromptAnalysis(BaseModel):
    prompt: str
    project_id: Optional[str] = None


class ContextAnalysis(BaseModel):
    project_id: Optional[str] = None
    current_screen: Optional[str] = None
    recent_actions: List[str] = []


def create_intelligence_routes(db: AsyncIOMotorDatabase):
    """Create intelligence routes with database dependency."""
    
    @router.post("/analyze-prompt")
    async def analyze_prompt(
        analysis: PromptAnalysis,
        authorization: Optional[str] = Header(None)
    ):
        """Analyze a prompt and detect user intent."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        intent, confidence = RuntimeIntelligenceEngine.detect_intent(analysis.prompt)
        
        # Build context
        context = UserContext(
            user_id=user.id,
            project_id=analysis.project_id,
            credits_remaining=CreditEngine.get_total_credits(user.credits),
            plan=user.plan.value
        )
        
        # Get optimized prompt
        optimized = RuntimeIntelligenceEngine.optimize_prompt(analysis.prompt, context)
        
        return {
            "original_prompt": analysis.prompt,
            "optimized_prompt": optimized,
            "detected_intent": intent.value,
            "confidence": confidence,
            "requires_clarification": confidence < 0.6
        }
    
    @router.post("/analyze-context")
    async def analyze_context(
        context_data: ContextAnalysis,
        authorization: Optional[str] = Header(None)
    ):
        """Analyze user context and provide recommendations."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Check bonus refresh
        user.credits = CreditEngine.check_bonus_refresh(user.credits, user.plan)
        
        context = UserContext(
            user_id=user.id,
            project_id=context_data.project_id,
            current_screen=context_data.current_screen,
            recent_actions=context_data.recent_actions,
            credits_remaining=CreditEngine.get_total_credits(user.credits),
            plan=user.plan.value
        )
        
        output = RuntimeIntelligenceEngine.analyze_context(context)
        
        return {
            "detected_intent": output.detected_intent.value,
            "confidence": output.confidence,
            "suggested_actions": output.suggested_actions,
            "recommended_components": output.recommended_components,
            "recommended_screens": output.recommended_screens,
            "contextual_explanations": output.contextual_explanations,
            "guided_steps": output.guided_steps
        }
    
    @router.get("/next-steps/{project_id}")
    async def get_next_steps(
        project_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Get recommended next steps for a project."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        project = await db.projects.find_one(
            {"id": project_id, "user_id": user.id},
            {"_id": 0}
        )
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        steps = RuntimeIntelligenceEngine.recommend_next_steps(
            project.get("type", "app"),
            project.get("structure", {})
        )
        
        return {"next_steps": steps}
    
    @router.post("/check-workflow")
    async def check_workflow(
        recent_actions: List[dict],
        authorization: Optional[str] = Header(None)
    ):
        """Check if user is stuck in their workflow."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        is_stalled, message = RuntimeIntelligenceEngine.detect_stalled_workflow(recent_actions)
        
        return {
            "is_stalled": is_stalled,
            "message": message,
            "help_available": is_stalled
        }
    
    return router
