# AI Project Generation Engine - Main engine that orchestrates AI-powered project generation
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

from engines.intent_interpretation_engine import IntentInterpretationEngine, InterpretedProject
from engines.project_blueprint_compiler import ProjectBlueprintCompiler, ProjectBlueprint


class GenerationMode(str, Enum):
    FULL_PROJECT = "full_project"
    INCREMENTAL = "incremental"
    VARIATION = "variation"
    REFINEMENT = "refinement"


class GenerationStatus(str, Enum):
    PENDING = "pending"
    INTERPRETING = "interpreting"
    COMPILING = "compiling"
    GENERATING = "generating"
    COMPLETE = "complete"
    FAILED = "failed"


class GenerationRequest(BaseModel):
    """Request to generate a project."""
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    description: str
    mode: GenerationMode = GenerationMode.FULL_PROJECT
    existing_project_id: Optional[str] = None
    options: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class GenerationResult(BaseModel):
    """Result of project generation."""
    request_id: str
    status: GenerationStatus
    blueprint: Optional[ProjectBlueprint] = None
    interpreted: Optional[InterpretedProject] = None
    message: str = ""
    voice_message: str = ""
    credits_used: int = 0
    errors: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AIProjectGenerationEngine:
    """
    AI-Powered Project Generation Engine.
    
    Responsibilities:
    - Interpret user descriptions of apps/websites
    - Generate full project structures end-to-end
    - Create screens, pages, flows, and components
    - Generate data models and relationships
    - Generate navigation structure
    - Bind data models to UI components
    - Produce functional starting projects
    
    Input modes:
    - text_input: Natural language description
    - voice_input: Transcribed voice command (via Voice Orchestration)
    
    Output types:
    - screen_blueprints
    - page_blueprints
    - flow_blueprints
    - data_models
    - navigation_structure
    - component_layouts
    """
    
    # Cost per generation type
    GENERATION_COSTS = {
        GenerationMode.FULL_PROJECT: 5,
        GenerationMode.INCREMENTAL: 2,
        GenerationMode.VARIATION: 3,
        GenerationMode.REFINEMENT: 2,
    }
    
    # In-memory tracking of generation requests
    _generations: Dict[str, GenerationResult] = {}
    
    @classmethod
    async def generate(
        cls,
        request: GenerationRequest,
        use_llm: bool = True
    ) -> GenerationResult:
        """
        Generate a project from description.
        
        Flow:
        1. Interpret user description
        2. Compile into blueprint
        3. Validate blueprint
        4. Return result
        """
        result = GenerationResult(
            request_id=request.request_id,
            status=GenerationStatus.INTERPRETING,
            message="Analyzing your description...",
            voice_message="I'm analyzing your description. Just a moment."
        )
        cls._generations[request.request_id] = result
        
        try:
            # Step 1: Interpret the description
            result.status = GenerationStatus.INTERPRETING
            interpreted = await IntentInterpretationEngine.interpret(
                request.description,
                use_llm=use_llm
            )
            result.interpreted = interpreted
            
            # Step 2: Compile into blueprint
            result.status = GenerationStatus.COMPILING
            result.message = "Building your project structure..."
            result.voice_message = "I understand what you want. Now building your project structure."
            
            blueprint = ProjectBlueprintCompiler.compile(interpreted)
            result.blueprint = blueprint
            
            # Step 3: Validate
            if not blueprint.is_valid:
                result.status = GenerationStatus.FAILED
                result.errors = blueprint.validation_errors
                result.message = f"Generation failed: {', '.join(blueprint.validation_errors)}"
                result.voice_message = f"I found some issues: {', '.join(blueprint.validation_errors[:2])}"
                return result
            
            # Step 4: Calculate credits
            result.credits_used = cls.GENERATION_COSTS.get(request.mode, 5)
            
            # Success
            result.status = GenerationStatus.COMPLETE
            screen_count = len(blueprint.screens)
            model_count = len(blueprint.data_models)
            flow_count = len(blueprint.flows)
            
            result.message = f"✅ Generated **{interpreted.app_name}**!\n\n" \
                           f"• {screen_count} screens\n" \
                           f"• {model_count} data models\n" \
                           f"• {flow_count} flows\n\n" \
                           f"Credits used: {result.credits_used}"
            
            result.voice_message = f"Done! I created {interpreted.app_name} with {screen_count} screens, " \
                                  f"{model_count} data models, and {flow_count} flows. " \
                                  f"Would you like me to explain anything or make changes?"
            
            cls._generations[request.request_id] = result
            return result
            
        except Exception as e:
            result.status = GenerationStatus.FAILED
            result.errors = [str(e)]
            result.message = f"Generation failed: {str(e)}"
            result.voice_message = "Sorry, I encountered an error while generating your project. Please try again."
            cls._generations[request.request_id] = result
            return result
    
    @classmethod
    async def generate_variations(
        cls,
        description: str,
        user_id: str,
        count: int = 3,
        variation_type: str = "complexity"
    ) -> List[GenerationResult]:
        """
        Generate multiple variations of a project.
        
        Variation types:
        - complexity: Simple, Medium, Advanced versions
        - audience: Different target audiences
        - style: Different UI styles
        """
        results = []
        
        if variation_type == "complexity":
            variations = [
                (f"Simple version: {description}. Keep it minimal with only essential screens.", "Simple"),
                (f"Standard version: {description}. Include all common features.", "Standard"),
                (f"Advanced version: {description}. Include all features plus admin panel and analytics.", "Advanced"),
            ]
        elif variation_type == "audience":
            variations = [
                (f"Consumer-focused: {description}. Optimize for end users.", "Consumer"),
                (f"Business-focused: {description}. Add professional features.", "Business"),
                (f"Enterprise-focused: {description}. Add team management and admin.", "Enterprise"),
            ]
        else:
            variations = [(description, f"Variation {i+1}") for i in range(count)]
        
        for desc, label in variations[:count]:
            request = GenerationRequest(
                user_id=user_id,
                description=desc,
                mode=GenerationMode.VARIATION,
                options={"variation_label": label}
            )
            result = await cls.generate(request)
            if result.blueprint:
                result.blueprint.metadata["variation_label"] = label
            results.append(result)
        
        return results
    
    @classmethod
    def get_generation_status(cls, request_id: str) -> Optional[GenerationResult]:
        """Get status of a generation request."""
        return cls._generations.get(request_id)
    
    @classmethod
    def get_supported_commands(cls) -> List[Dict[str, Any]]:
        """Get list of supported generation commands."""
        return [
            {
                "command": "generate_full_project",
                "examples": [
                    "Build me an e-commerce app with product listings and checkout",
                    "Create a task management app with kanban boards",
                    "Generate a social media app like Instagram"
                ],
                "description": "Generate a complete project from description"
            },
            {
                "command": "generate_variations",
                "examples": [
                    "Generate three versions of this app idea",
                    "Create variations for different audiences",
                    "Make a simple, medium, and advanced version"
                ],
                "description": "Generate multiple variations of a project concept"
            },
        ]
    
    @classmethod
    def estimate_credits(cls, description: str, mode: GenerationMode = GenerationMode.FULL_PROJECT) -> int:
        """Estimate credits needed for generation."""
        base_cost = cls.GENERATION_COSTS.get(mode, 5)
        
        # Adjust based on complexity indicators
        complexity_keywords = ["complex", "advanced", "enterprise", "full-featured", "comprehensive"]
        if any(kw in description.lower() for kw in complexity_keywords):
            base_cost += 2
        
        return base_cost
