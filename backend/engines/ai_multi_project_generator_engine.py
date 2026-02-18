# AI Multi-Project Generator Engine - Generate multiple project variations
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid

from engines.ai_project_generation_engine import AIProjectGenerationEngine, GenerationRequest, GenerationMode


class VariationMode(str, Enum):
    COMPLEXITY = "complexity"  # Simple, Medium, Advanced
    AUDIENCE = "audience"  # Consumer, Business, Enterprise
    BRAND = "brand"  # Different brand styles
    NICHE = "niche"  # Different market niches
    FEATURE_SET = "feature_set"  # Different feature combinations


class ProjectVariation(BaseModel):
    """A single project variation."""
    variation_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    label: str
    description: str
    blueprint: Optional[Dict[str, Any]] = None
    screens_count: int = 0
    models_count: int = 0
    credits_used: int = 0
    status: str = "pending"


class MultiProjectResult(BaseModel):
    """Result of multi-project generation."""
    batch_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    base_description: str
    variation_mode: VariationMode
    variations: List[ProjectVariation] = []
    comparison_summary: str = ""
    comparison_voice: str = ""
    total_credits: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AIMultiProjectGeneratorEngine:
    """
    AI Multi-Project Generator Engine.
    
    Responsibilities:
    - Generate multiple projects from a single description
    - Create variations of the same concept
    - Support multi-brand or multi-niche strategies
    - Allow users to compare generated projects
    - Support batch generation for agencies or creators
    
    Generation modes:
    - single_description_multiple_projects
    - niche_variation_generation
    - brand_variation_generation
    - feature_variation_generation
    
    Supported Commands:
    - "Generate three versions of this app idea"
    - "Create variations for different audiences"
    - "Make a simple, medium, and advanced version"
    - "Generate multiple apps from this concept"
    """
    
    # Variation templates
    VARIATION_TEMPLATES = {
        VariationMode.COMPLEXITY: [
            {
                "label": "Simple",
                "suffix": "Keep it minimal with only essential screens and features. Focus on core functionality only.",
                "credit_multiplier": 0.7
            },
            {
                "label": "Standard",
                "suffix": "Include all common features and a complete user experience. Balance between simplicity and features.",
                "credit_multiplier": 1.0
            },
            {
                "label": "Advanced",
                "suffix": "Include all features plus admin panel, analytics, and advanced settings. Full-featured version.",
                "credit_multiplier": 1.5
            }
        ],
        VariationMode.AUDIENCE: [
            {
                "label": "Consumer",
                "suffix": "Optimize for end consumers. Simple interface, focus on user experience and engagement.",
                "credit_multiplier": 0.9
            },
            {
                "label": "Business",
                "suffix": "Optimize for business users. Add professional features, team collaboration, and reporting.",
                "credit_multiplier": 1.2
            },
            {
                "label": "Enterprise",
                "suffix": "Optimize for enterprise. Add SSO, audit logs, role-based access, and compliance features.",
                "credit_multiplier": 1.5
            }
        ],
        VariationMode.BRAND: [
            {
                "label": "Modern Minimal",
                "suffix": "Clean, minimal design with lots of whitespace. Modern typography and subtle animations.",
                "credit_multiplier": 1.0
            },
            {
                "label": "Bold & Vibrant",
                "suffix": "Bold colors, strong typography, and eye-catching visuals. High energy design.",
                "credit_multiplier": 1.0
            },
            {
                "label": "Professional Classic",
                "suffix": "Professional, trustworthy design. Conservative colors, traditional layout, corporate feel.",
                "credit_multiplier": 1.0
            }
        ],
        VariationMode.NICHE: [
            {
                "label": "Tech Startup",
                "suffix": "Target tech-savvy users. Include integrations, API access, and developer-friendly features.",
                "credit_multiplier": 1.1
            },
            {
                "label": "Small Business",
                "suffix": "Target small business owners. Focus on simplicity, cost-effectiveness, and quick setup.",
                "credit_multiplier": 0.9
            },
            {
                "label": "Creative Agency",
                "suffix": "Target creative professionals. Include portfolio features, client management, and visual tools.",
                "credit_multiplier": 1.1
            }
        ],
        VariationMode.FEATURE_SET: [
            {
                "label": "Core Only",
                "suffix": "Only the absolute essential features. Minimum viable product.",
                "credit_multiplier": 0.6
            },
            {
                "label": "With Social",
                "suffix": "Core features plus social features: profiles, comments, sharing, and community.",
                "credit_multiplier": 1.2
            },
            {
                "label": "With Commerce",
                "suffix": "Core features plus commerce: payments, subscriptions, and marketplace.",
                "credit_multiplier": 1.3
            }
        ]
    }
    
    @classmethod
    async def generate_variations(
        cls,
        description: str,
        user_id: str,
        mode: VariationMode = VariationMode.COMPLEXITY,
        count: Optional[int] = None
    ) -> MultiProjectResult:
        """Generate multiple project variations from a single description."""
        templates = cls.VARIATION_TEMPLATES.get(mode, cls.VARIATION_TEMPLATES[VariationMode.COMPLEXITY])
        
        if count:
            templates = templates[:count]
        
        variations = []
        total_credits = 0
        
        for template in templates:
            variation_desc = f"{description}. {template['suffix']}"
            
            # Create generation request
            request = GenerationRequest(
                user_id=user_id,
                description=variation_desc,
                mode=GenerationMode.VARIATION,
                options={"variation_label": template["label"]}
            )
            
            # Generate
            result = await AIProjectGenerationEngine.generate(request, use_llm=True)
            
            # Calculate credits
            base_credits = result.credits_used
            credits = int(base_credits * template["credit_multiplier"])
            total_credits += credits
            
            # Create variation record
            variation = ProjectVariation(
                label=template["label"],
                description=template["suffix"],
                blueprint=result.blueprint.model_dump() if result.blueprint else None,
                screens_count=len(result.blueprint.screens) if result.blueprint else 0,
                models_count=len(result.blueprint.data_models) if result.blueprint else 0,
                credits_used=credits,
                status=result.status.value
            )
            variations.append(variation)
        
        # Generate comparison summary
        comparison_text = cls._generate_comparison_text(variations, mode)
        comparison_voice = cls._generate_comparison_voice(variations, mode)
        
        return MultiProjectResult(
            base_description=description,
            variation_mode=mode,
            variations=variations,
            comparison_summary=comparison_text,
            comparison_voice=comparison_voice,
            total_credits=total_credits
        )
    
    @classmethod
    def _generate_comparison_text(cls, variations: List[ProjectVariation], mode: VariationMode) -> str:
        """Generate text comparison of variations."""
        if not variations:
            return "No variations generated."
        
        text = f"## {mode.value.replace('_', ' ').title()} Comparison\n\n"
        text += "| Version | Screens | Data Models | Credits |\n"
        text += "|---------|---------|-------------|--------|\n"
        
        for v in variations:
            text += f"| **{v.label}** | {v.screens_count} | {v.models_count} | {v.credits_used} |\n"
        
        text += "\n### Recommendations\n\n"
        
        # Find best value
        if len(variations) >= 2:
            mid = variations[len(variations) // 2]
            text += f"- **Best Balance:** {mid.label} - Good feature set without overcomplication\n"
        
        if variations:
            text += f"- **Quick Start:** {variations[0].label} - Get started fast with essentials\n"
        
        if len(variations) >= 3:
            text += f"- **Full Featured:** {variations[-1].label} - All features for serious use\n"
        
        return text
    
    @classmethod
    def _generate_comparison_voice(cls, variations: List[ProjectVariation], mode: VariationMode) -> str:
        """Generate voice comparison of variations."""
        if not variations:
            return "No variations were generated."
        
        mode_name = mode.value.replace("_", " ")
        voice = f"I've generated {len(variations)} {mode_name} variations of your app idea. "
        
        for v in variations:
            voice += f"The {v.label} version has {v.screens_count} screens and uses {v.credits_used} credits. "
        
        if len(variations) >= 2:
            mid = variations[len(variations) // 2]
            voice += f"I recommend starting with the {mid.label} version for the best balance. "
        
        voice += "Which version would you like to use?"
        
        return voice
    
    @classmethod
    def detect_variation_mode(cls, command: str) -> VariationMode:
        """Detect which variation mode from user command."""
        command_lower = command.lower()
        
        if any(x in command_lower for x in ["simple", "medium", "advanced", "complexity", "version"]):
            return VariationMode.COMPLEXITY
        elif any(x in command_lower for x in ["audience", "consumer", "business", "enterprise"]):
            return VariationMode.AUDIENCE
        elif any(x in command_lower for x in ["brand", "style", "design", "look"]):
            return VariationMode.BRAND
        elif any(x in command_lower for x in ["niche", "market", "target"]):
            return VariationMode.NICHE
        elif any(x in command_lower for x in ["feature", "core", "social", "commerce"]):
            return VariationMode.FEATURE_SET
        
        return VariationMode.COMPLEXITY
    
    @classmethod
    def get_available_modes(cls) -> List[Dict[str, Any]]:
        """Get available variation modes."""
        return [
            {
                "mode": mode.value,
                "description": f"Generate {len(templates)} variations: {', '.join(t['label'] for t in templates)}",
                "variations": [t["label"] for t in templates]
            }
            for mode, templates in cls.VARIATION_TEMPLATES.items()
        ]
    
    @classmethod
    def get_supported_commands(cls) -> List[Dict[str, Any]]:
        """Get supported multi-project commands."""
        return [
            {
                "command": "generate_variations",
                "examples": [
                    "Generate three versions of this app idea",
                    "Make a simple, medium, and advanced version",
                    "Create variations for different audiences"
                ],
                "description": "Generate multiple variations of a project"
            },
            {
                "command": "compare_variations",
                "examples": [
                    "Compare these variations",
                    "Which version is best?",
                    "Help me choose between these"
                ],
                "description": "Compare generated variations"
            },
            {
                "command": "batch_generate",
                "examples": [
                    "Generate apps for multiple niches",
                    "Create apps for different markets",
                    "Batch generate projects"
                ],
                "description": "Batch generate for multiple targets"
            }
        ]
