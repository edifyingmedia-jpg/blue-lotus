# AI Generation Routes - API endpoints for AI-powered project generation
from fastapi import APIRouter, HTTPException, Header, Depends, Body
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from datetime import datetime, timezone
import uuid

from routes.auth import get_current_user
from engines.ai_project_generation_engine import (
    AIProjectGenerationEngine, GenerationRequest, GenerationMode, GenerationResult
)
from engines.intent_interpretation_engine import IntentInterpretationEngine, InterpretedProject
from engines.project_blueprint_compiler import ProjectBlueprintCompiler, ProjectBlueprint
from engines.ai_project_refinement_engine import AIProjectRefinementEngine, RefinementType
from engines.ai_feature_expansion_engine import AIFeatureExpansionEngine, FeatureType
from engines.ai_app_evolution_engine import AIAppEvolutionEngine
from engines.ai_multi_project_generator_engine import AIMultiProjectGeneratorEngine, VariationMode
from engines.project_generation_safety_layer import ProjectGenerationSafetyLayer
from engines.credit_engine import CreditEngine


class GenerateProjectRequest(BaseModel):
    description: str
    mode: str = "full_project"
    use_llm: bool = True
    options: Dict[str, Any] = {}


class InterpretRequest(BaseModel):
    description: str
    use_llm: bool = True


class RefineProjectRequest(BaseModel):
    focus: Optional[str] = None


class AddFeatureRequest(BaseModel):
    feature_type: str
    options: Dict[str, Any] = {}


class GenerateVariationsRequest(BaseModel):
    description: str
    mode: str = "complexity"
    count: int = 3


def create_ai_generation_routes(db):
    """Create AI generation API routes."""
    router = APIRouter(prefix="/api/ai", tags=["AI Generation"])
    
    # ============ Project Generation ============
    
    @router.post("/generate")
    async def generate_project(
        request: GenerateProjectRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Generate a complete project from natural language description."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Estimate credits
        estimated_credits = AIProjectGenerationEngine.estimate_credits(
            request.description,
            GenerationMode(request.mode)
        )
        
        # Check credit balance
        has_credits = await CreditEngine.has_sufficient_credits(db, user.id, estimated_credits)
        if not has_credits:
            raise HTTPException(
                status_code=402,
                detail=f"Insufficient credits. Need {estimated_credits} credits for this generation."
            )
        
        # Create generation request
        gen_request = GenerationRequest(
            user_id=user.id,
            description=request.description,
            mode=GenerationMode(request.mode),
            options=request.options
        )
        
        # Generate
        result = await AIProjectGenerationEngine.generate(gen_request, use_llm=request.use_llm)
        
        # If successful, validate with safety layer
        if result.blueprint:
            safety_result = await ProjectGenerationSafetyLayer.validate_generation(
                result.blueprint.model_dump()
            )
            
            if not safety_result.passed:
                return {
                    "status": "validation_failed",
                    "request_id": result.request_id,
                    "validation": {
                        "passed": safety_result.passed,
                        "issues": [i.model_dump() for i in safety_result.issues],
                        "message": safety_result.confirmation_message,
                        "voice_message": safety_result.voice_message
                    }
                }
            
            # Deduct credits on success
            await CreditEngine.deduct_credits(db, user.id, result.credits_used, "ai_generation")
        
        return {
            "status": result.status.value,
            "request_id": result.request_id,
            "message": result.message,
            "voice_message": result.voice_message,
            "credits_used": result.credits_used,
            "blueprint": ProjectBlueprintCompiler.to_dict(result.blueprint) if result.blueprint else None,
            "interpreted": result.interpreted.model_dump() if result.interpreted else None,
            "errors": result.errors
        }
    
    @router.post("/interpret")
    async def interpret_description(
        request: InterpretRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Preview interpreted structure without generating (no credits)."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        interpreted = await IntentInterpretationEngine.interpret(
            request.description,
            use_llm=request.use_llm
        )
        
        return {
            "interpreted": interpreted.model_dump(),
            "estimated_credits": interpreted.estimated_credits,
            "confidence": interpreted.confidence
        }
    
    @router.get("/status/{request_id}")
    async def get_generation_status(
        request_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Check status of a generation request."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        result = AIProjectGenerationEngine.get_generation_status(request_id)
        if not result:
            raise HTTPException(status_code=404, detail="Generation request not found")
        
        return {
            "request_id": request_id,
            "status": result.status.value,
            "message": result.message,
            "voice_message": result.voice_message
        }
    
    @router.post("/apply/{request_id}")
    async def apply_generation(
        request_id: str,
        project_name: Optional[str] = Body(None, embed=True),
        authorization: Optional[str] = Header(None)
    ):
        """Apply a generated blueprint as a new project."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        result = AIProjectGenerationEngine.get_generation_status(request_id)
        if not result or not result.blueprint:
            raise HTTPException(status_code=404, detail="Generation not found or incomplete")
        
        # Create project from blueprint
        project = {
            "id": str(uuid.uuid4()),
            "user_id": user.id,
            "name": project_name or result.blueprint.project_name,
            "type": result.blueprint.project_type,
            "description": result.blueprint.description,
            "status": "draft",
            "structure": {
                "screens": [s.model_dump() for s in result.blueprint.screens],
                "flows": [f.model_dump() for f in result.blueprint.flows],
                "data_models": [m.model_dump() for m in result.blueprint.data_models],
                "navigation": result.blueprint.navigation.model_dump(),
            },
            "theme": result.blueprint.theme,
            "metadata": result.blueprint.metadata,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        
        await db.projects.insert_one(project)
        project.pop("_id", None)
        
        return {
            "message": "Project created successfully",
            "project": project
        }
    
    # ============ Project Refinement ============
    
    @router.post("/refine/{project_id}")
    async def refine_project(
        project_id: str,
        request: RefineProjectRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Get refinement suggestions for a project."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        project = await db.projects.find_one({"id": project_id, "user_id": user.id}, {"_id": 0})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        focus = RefinementType(request.focus) if request.focus else None
        result = await AIProjectRefinementEngine.analyze_project(project, focus)
        
        return {
            "project_id": result.project_id,
            "health_score_before": result.health_score_before,
            "health_score_after": result.health_score_after,
            "total_suggestions": result.total_suggestions,
            "suggestions": [s.model_dump() for s in result.suggestions],
            "summary_text": result.summary_text,
            "summary_voice": result.summary_voice
        }
    
    # ============ Feature Expansion ============
    
    @router.post("/feature/{project_id}")
    async def add_feature_to_project(
        project_id: str,
        request: AddFeatureRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Add a new feature to an existing project."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        project = await db.projects.find_one({"id": project_id, "user_id": user.id}, {"_id": 0})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        try:
            feature_type = FeatureType(request.feature_type)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Unknown feature type: {request.feature_type}")
        
        result = await AIFeatureExpansionEngine.add_feature(project, feature_type, request.options)
        
        return {
            "project_id": result.project_id,
            "feature": result.feature_blueprint.model_dump(),
            "dependencies_met": result.dependencies_met,
            "missing_dependencies": result.missing_dependencies,
            "conflicts": result.conflicts,
            "message_text": result.message_text,
            "message_voice": result.message_voice
        }
    
    @router.get("/features")
    async def list_available_features(
        authorization: Optional[str] = Header(None)
    ):
        """List all available features that can be added."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        return {
            "features": AIFeatureExpansionEngine.get_available_features()
        }
    
    # ============ Evolution & Roadmap ============
    
    @router.get("/roadmap/{project_id}")
    async def get_project_roadmap(
        project_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Get evolution roadmap for a project."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        project = await db.projects.find_one({"id": project_id, "user_id": user.id}, {"_id": 0})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        roadmap = await AIAppEvolutionEngine.generate_roadmap(project)
        
        # Convert phases to serializable format
        phases = {}
        for phase_name, suggestions in roadmap.phases.items():
            phases[phase_name] = [s.model_dump() for s in suggestions]
        
        return {
            "project_id": roadmap.project_id,
            "project_name": roadmap.project_name,
            "current_state": roadmap.current_state,
            "vision": roadmap.vision,
            "phases": phases,
            "total_suggestions": roadmap.total_suggestions,
            "summary_text": roadmap.summary_text,
            "summary_voice": roadmap.summary_voice
        }
    
    @router.get("/next-step/{project_id}")
    async def get_next_step(
        project_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Get the single best next step for a project."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        project = await db.projects.find_one({"id": project_id, "user_id": user.id}, {"_id": 0})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        suggestion = await AIAppEvolutionEngine.suggest_next_step(project)
        
        return {
            "suggestion": suggestion.model_dump(),
            "message": f"Next step: {suggestion.title}\n\n{suggestion.description}",
            "voice_message": f"I suggest your next step should be: {suggestion.title}. {suggestion.rationale}"
        }
    
    # ============ Multi-Project Generation ============
    
    @router.post("/variations")
    async def generate_variations(
        request: GenerateVariationsRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Generate multiple project variations."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        try:
            mode = VariationMode(request.mode)
        except ValueError:
            mode = VariationMode.COMPLEXITY
        
        # Check credits (estimate for all variations)
        estimated_credits = request.count * 4  # ~4 credits per variation
        has_credits = await CreditEngine.has_sufficient_credits(db, user.id, estimated_credits)
        if not has_credits:
            raise HTTPException(
                status_code=402,
                detail=f"Insufficient credits. Need ~{estimated_credits} credits for {request.count} variations."
            )
        
        result = await AIMultiProjectGeneratorEngine.generate_variations(
            description=request.description,
            user_id=user.id,
            mode=mode,
            count=request.count
        )
        
        # Deduct credits
        await CreditEngine.deduct_credits(db, user.id, result.total_credits, "ai_variations")
        
        return {
            "batch_id": result.batch_id,
            "variation_mode": result.variation_mode.value,
            "variations": [v.model_dump() for v in result.variations],
            "total_credits": result.total_credits,
            "comparison_summary": result.comparison_summary,
            "comparison_voice": result.comparison_voice
        }
    
    @router.get("/variation-modes")
    async def get_variation_modes(
        authorization: Optional[str] = Header(None)
    ):
        """Get available variation modes."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        return {
            "modes": AIMultiProjectGeneratorEngine.get_available_modes()
        }
    
    # ============ Utility Endpoints ============
    
    @router.get("/commands")
    async def get_all_commands(
        authorization: Optional[str] = Header(None)
    ):
        """Get all supported AI commands."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        return {
            "generation": AIProjectGenerationEngine.get_supported_commands(),
            "refinement": AIProjectRefinementEngine.get_supported_commands(),
            "features": AIFeatureExpansionEngine.get_supported_commands(),
            "evolution": AIAppEvolutionEngine.get_supported_commands(),
            "multi_project": AIMultiProjectGeneratorEngine.get_supported_commands()
        }
    
    @router.post("/estimate-credits")
    async def estimate_generation_credits(
        description: str = Body(..., embed=True),
        mode: str = Body("full_project", embed=True),
        authorization: Optional[str] = Header(None)
    ):
        """Estimate credits needed for a generation."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        try:
            gen_mode = GenerationMode(mode)
        except ValueError:
            gen_mode = GenerationMode.FULL_PROJECT
        
        credits = AIProjectGenerationEngine.estimate_credits(description, gen_mode)
        
        # Get user's current balance
        user_doc = await db.users.find_one({"id": user.id}, {"_id": 0})
        current_credits = 0
        if user_doc and user_doc.get("credits"):
            creds = user_doc["credits"]
            current_credits = (
                creds.get("monthly", 0) +
                creds.get("bonus", 0) +
                creds.get("purchased", 0) +
                creds.get("starter", 0)
            )
        
        return {
            "estimated_credits": credits,
            "current_balance": current_credits,
            "sufficient": current_credits >= credits
        }
    
    return router
