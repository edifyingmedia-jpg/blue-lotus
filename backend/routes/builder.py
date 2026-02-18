# Builder Routes - AI-powered building operations
from fastapi import APIRouter, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional, List
from datetime import datetime, timezone
from pydantic import BaseModel

from routes.auth import get_current_user
from engines.ai_instruction_engine import AIInstructionEngine, ParsedInstruction, InstructionType
from engines.credit_engine import CreditEngine
from engines.project_engine import ProjectEngine

router = APIRouter(prefix="/builder", tags=["Builder"])


class BuildRequest(BaseModel):
    project_id: str
    prompt: str


class BuildResponse(BaseModel):
    success: bool
    instruction_type: str
    target: Optional[str]
    credits_used: int
    credits_remaining: int
    output: dict
    message: str
    warnings: List[str] = []
    requires_confirmation: bool = False


class ConfirmRequest(BaseModel):
    project_id: str
    instruction: dict
    confirmed: bool


def create_builder_routes(db: AsyncIOMotorDatabase):
    """Create builder routes with database dependency."""
    
    @router.post("/interpret")
    async def interpret_prompt(
        request: BuildRequest,
        authorization: Optional[str] = Header(None)
    ):
        """
        Interpret a natural language prompt without executing.
        Returns the parsed instruction for preview/confirmation.
        """
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Parse the instruction
        instruction = AIInstructionEngine.parse_instruction(request.prompt)
        
        # Get project to check existing items
        project = await db.projects.find_one(
            {"id": request.project_id, "user_id": user.id},
            {"_id": 0}
        )
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Get existing items for validation
        existing_items = (
            project.get("structure", {}).get("screens", []) +
            project.get("structure", {}).get("pages", []) +
            project.get("structure", {}).get("data_models", []) +
            project.get("structure", {}).get("flows", [])
        )
        
        # Check credits
        user.credits = CreditEngine.check_bonus_refresh(user.credits, user.plan)
        available_credits = CreditEngine.get_total_credits(user.credits)
        
        # Validate instruction
        is_valid, warnings = AIInstructionEngine.validate_instruction(
            instruction,
            existing_items,
            available_credits
        )
        
        return {
            "instruction_type": instruction.instruction_type.value,
            "target": instruction.target,
            "parameters": instruction.parameters,
            "credits_required": instruction.credits_required,
            "credits_available": available_credits,
            "confidence": instruction.confidence,
            "requires_confirmation": instruction.requires_confirmation or not is_valid,
            "is_valid": is_valid,
            "warnings": warnings,
            "original_prompt": instruction.original_prompt
        }
    
    @router.post("/execute", response_model=BuildResponse)
    async def execute_build(
        request: BuildRequest,
        authorization: Optional[str] = Header(None)
    ):
        """
        Execute a build instruction (create screen, page, flow, etc.)
        """
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
        
        # Parse instruction
        instruction = AIInstructionEngine.parse_instruction(request.prompt)
        
        # Check and refresh credits
        user.credits = CreditEngine.check_bonus_refresh(user.credits, user.plan)
        
        # Validate credits
        if not CreditEngine.can_afford(user.credits, instruction.credits_required):
            raise HTTPException(
                status_code=402,
                detail={
                    "error": "Insufficient credits",
                    "required": instruction.credits_required,
                    "available": CreditEngine.get_total_credits(user.credits)
                }
            )
        
        # Check for confirmation required
        if instruction.requires_confirmation:
            return BuildResponse(
                success=False,
                instruction_type=instruction.instruction_type.value,
                target=instruction.target,
                credits_used=0,
                credits_remaining=CreditEngine.get_total_credits(user.credits),
                output={},
                message="This action requires confirmation",
                warnings=[],
                requires_confirmation=True
            )
        
        # Execute based on instruction type
        output = {}
        warnings = []
        structure = project.get("structure", {})
        
        if instruction.instruction_type == InstructionType.CREATE_SCREEN:
            screen_name = instruction.target or "New Screen"
            if screen_name not in structure.get("screens", []):
                structure.setdefault("screens", []).append(screen_name)
                output = {"screen": screen_name, "components": instruction.parameters.get("components", [])}
        
        elif instruction.instruction_type == InstructionType.CREATE_PAGE:
            page_name = instruction.target or "New Page"
            if page_name not in structure.get("pages", []):
                structure.setdefault("pages", []).append(page_name)
                output = {"page": page_name, "sections": instruction.parameters.get("sections", [])}
        
        elif instruction.instruction_type == InstructionType.GENERATE_FLOW:
            flow_name = instruction.target or "New Flow"
            if flow_name not in structure.get("flows", []):
                structure.setdefault("flows", []).append(flow_name)
                output = {"flow": flow_name, "steps": instruction.parameters.get("steps", [])}
        
        elif instruction.instruction_type == InstructionType.UPDATE_DATA_MODEL:
            model_name = instruction.target or "New Model"
            if model_name not in structure.get("data_models", []):
                structure.setdefault("data_models", []).append(model_name)
                output = {"model": model_name, "fields": instruction.parameters.get("fields", [])}
        
        elif instruction.instruction_type == InstructionType.ADD_FEATURE:
            output = {"feature": instruction.target, "description": instruction.parameters.get("description", "")}
        
        elif instruction.instruction_type == InstructionType.REFINE_CONTENT:
            output = {"refined": True, "target": instruction.target}
        
        elif instruction.instruction_type == InstructionType.MODIFY_NAVIGATION:
            output = {"navigation_updated": True}
        
        elif instruction.instruction_type == InstructionType.EXPLAIN_PROJECT:
            # No credits for explanations
            from engines.project_engine import ProjectEngine
            from models.schemas import Project
            
            if isinstance(project.get("created_at"), str):
                project["created_at"] = datetime.fromisoformat(project["created_at"])
            if isinstance(project.get("updated_at"), str):
                project["updated_at"] = datetime.fromisoformat(project["updated_at"])
            
            proj = Project(**project)
            output = {"explanation": ProjectEngine.get_project_summary(proj)}
        
        else:
            warnings.append("Unknown instruction type")
        
        # Deduct credits if action uses credits
        credits_used = 0
        if instruction.credits_required > 0 and instruction.instruction_type != InstructionType.EXPLAIN_PROJECT:
            user.credits, success = CreditEngine.deduct_credits(user.credits, instruction.credits_required)
            if success:
                credits_used = instruction.credits_required
                
                # Update user credits
                await db.users.update_one(
                    {"id": user.id},
                    {"$set": {
                        "credits": {
                            **user.credits.model_dump(),
                            "last_bonus_refresh": user.credits.last_bonus_refresh.isoformat()
                        }
                    }}
                )
        
        # Update project structure
        await db.projects.update_one(
            {"id": request.project_id},
            {"$set": {
                "structure": structure,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        # Generate response message
        message = AIInstructionEngine.generate_response(instruction, output)
        
        return BuildResponse(
            success=True,
            instruction_type=instruction.instruction_type.value,
            target=instruction.target,
            credits_used=credits_used,
            credits_remaining=CreditEngine.get_total_credits(user.credits),
            output=output,
            message=message,
            warnings=warnings,
            requires_confirmation=False
        )
    
    @router.get("/suggestions/{project_id}")
    async def get_suggestions(
        project_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Get AI-suggested prompts based on project state."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        project = await db.projects.find_one(
            {"id": project_id, "user_id": user.id},
            {"_id": 0}
        )
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        suggestions = AIInstructionEngine.get_suggested_prompts(
            project.get("type", "app"),
            project.get("structure", {})
        )
        
        return {"suggestions": suggestions}
    
    @router.post("/duplicate/{project_id}")
    async def duplicate_project(
        project_id: str,
        new_name: Optional[str] = None,
        authorization: Optional[str] = Header(None)
    ):
        """Duplicate a project."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Check project limits
        project_count = await db.projects.count_documents({"user_id": user.id})
        can_create, message = ProjectEngine.can_create_project(user.plan, project_count)
        
        if not can_create:
            raise HTTPException(status_code=403, detail=message)
        
        # Get original project
        original = await db.projects.find_one(
            {"id": project_id, "user_id": user.id},
            {"_id": 0}
        )
        
        if not original:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Convert dates
        if isinstance(original.get("created_at"), str):
            original["created_at"] = datetime.fromisoformat(original["created_at"])
        if isinstance(original.get("updated_at"), str):
            original["updated_at"] = datetime.fromisoformat(original["updated_at"])
        
        from models.schemas import Project
        orig_project = Project(**original)
        
        # Duplicate
        new_project = ProjectEngine.duplicate_project(orig_project, new_name)
        
        # Save to database
        project_doc = new_project.model_dump()
        project_doc["created_at"] = project_doc["created_at"].isoformat()
        project_doc["updated_at"] = project_doc["updated_at"].isoformat()
        
        await db.projects.insert_one(project_doc)
        
        return {
            "success": True,
            "message": f"Project duplicated as '{new_project.name}'",
            "project_id": new_project.id
        }
    
    return router
