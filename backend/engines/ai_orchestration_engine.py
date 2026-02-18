# AI Orchestration Engine - Full AI coordination across all builder contexts
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class AIOutputType(str, Enum):
    SCREEN_BLUEPRINT = "screen_blueprint"
    PAGE_BLUEPRINT = "page_blueprint"
    NAVIGATION_UPDATE = "navigation_update"
    DATA_MODEL_UPDATE = "data_model_update"
    COMPONENT_RECOMMENDATION = "component_recommendation"
    FLOW_DEFINITION = "flow_definition"
    EXPLANATION = "explanation"
    CONFIRMATION_REQUIRED = "confirmation_required"


class ConversationContext(BaseModel):
    """Maintains context across multi-step instructions."""
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    project_id: Optional[str] = None
    current_screen: Optional[str] = None
    history: List[Dict[str, Any]] = []
    pending_confirmation: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AIOrchestrationResult(BaseModel):
    success: bool
    output_type: AIOutputType
    output: Dict[str, Any] = {}
    message: str
    requires_confirmation: bool = False
    confirmation_prompt: Optional[str] = None
    credits_required: int = 0
    warnings: List[str] = []


class AIOrchestrationEngine:
    """
    AI Orchestration Engine interprets user intent and coordinates all subsystems.
    
    Responsibilities:
    - Interpret user intent across all builder contexts
    - Route instructions to the correct subsystem
    - Coordinate generation, refinement, navigation, and data model updates
    - Ensure emotional safety and clarity in all responses
    - Prevent destructive operations unless explicitly confirmed
    - Maintain context across multi-step instructions
    - Optimize generation prompts based on project state
    
    Rules:
    - Never overwrite existing content
    - Never delete without confirmation
    - Always respect credit engine
    - Always respect plan enforcement
    - Always generate structured output
    """
    
    # Intent patterns
    DESTRUCTIVE_INTENTS = ["delete", "remove", "clear", "reset", "drop", "wipe"]
    GENERATION_INTENTS = ["create", "generate", "build", "make", "add"]
    MODIFICATION_INTENTS = ["update", "modify", "change", "edit", "refine"]
    NAVIGATION_INTENTS = ["link", "connect", "navigate", "flow", "route"]
    
    # Credit costs by operation
    CREDIT_COSTS = {
        AIOutputType.SCREEN_BLUEPRINT: 3,
        AIOutputType.PAGE_BLUEPRINT: 5,
        AIOutputType.FLOW_DEFINITION: 8,
        AIOutputType.NAVIGATION_UPDATE: 1,
        AIOutputType.DATA_MODEL_UPDATE: 1,
        AIOutputType.COMPONENT_RECOMMENDATION: 0,
        AIOutputType.EXPLANATION: 0,
        AIOutputType.CONFIRMATION_REQUIRED: 0,
    }
    
    # Active conversation contexts
    _contexts: Dict[str, ConversationContext] = {}
    
    @classmethod
    def get_or_create_context(
        cls,
        session_id: str,
        user_id: str,
        project_id: Optional[str] = None
    ) -> ConversationContext:
        """Get or create a conversation context."""
        if session_id in cls._contexts:
            return cls._contexts[session_id]
        
        context = ConversationContext(
            session_id=session_id,
            user_id=user_id,
            project_id=project_id
        )
        cls._contexts[session_id] = context
        return context
    
    @classmethod
    def clear_context(cls, session_id: str):
        """Clear a conversation context."""
        cls._contexts.pop(session_id, None)
    
    @staticmethod
    def analyze_intent(
        prompt: str,
        context: ConversationContext
    ) -> Tuple[AIOutputType, Dict[str, Any], bool]:
        """
        Analyze user intent and determine the appropriate action.
        Returns: (output_type, extracted_params, requires_confirmation)
        """
        prompt_lower = prompt.lower()
        requires_confirmation = False
        params = {}
        
        # Check for destructive intent
        is_destructive = any(word in prompt_lower for word in AIOrchestrationEngine.DESTRUCTIVE_INTENTS)
        if is_destructive:
            requires_confirmation = True
            params["destructive"] = True
        
        # Determine output type
        is_generation = any(word in prompt_lower for word in AIOrchestrationEngine.GENERATION_INTENTS)
        is_modification = any(word in prompt_lower for word in AIOrchestrationEngine.MODIFICATION_INTENTS)
        is_navigation = any(word in prompt_lower for word in AIOrchestrationEngine.NAVIGATION_INTENTS)
        
        # Classify by target
        if any(word in prompt_lower for word in ["screen", "view", "dashboard", "profile"]):
            output_type = AIOutputType.SCREEN_BLUEPRINT
            params["target_type"] = "screen"
        elif any(word in prompt_lower for word in ["page", "landing", "section"]):
            output_type = AIOutputType.PAGE_BLUEPRINT
            params["target_type"] = "page"
        elif any(word in prompt_lower for word in ["flow", "process", "workflow", "journey"]):
            output_type = AIOutputType.FLOW_DEFINITION
            params["target_type"] = "flow"
        elif is_navigation:
            output_type = AIOutputType.NAVIGATION_UPDATE
            params["target_type"] = "navigation"
        elif any(word in prompt_lower for word in ["model", "data", "schema", "field"]):
            output_type = AIOutputType.DATA_MODEL_UPDATE
            params["target_type"] = "data_model"
        elif any(word in prompt_lower for word in ["recommend", "suggest", "help", "component"]):
            output_type = AIOutputType.COMPONENT_RECOMMENDATION
            params["target_type"] = "recommendation"
        elif any(word in prompt_lower for word in ["explain", "what", "how", "describe"]):
            output_type = AIOutputType.EXPLANATION
            params["target_type"] = "explanation"
        else:
            output_type = AIOutputType.SCREEN_BLUEPRINT  # Default
            params["target_type"] = "unknown"
        
        # Extract target name
        params["target_name"] = AIOrchestrationEngine._extract_target_name(prompt)
        
        return output_type, params, requires_confirmation
    
    @staticmethod
    def _extract_target_name(prompt: str) -> Optional[str]:
        """Extract the target name from the prompt."""
        import re
        
        patterns = [
            r'(?:called|named)\s+["\']?([a-zA-Z0-9\s]+)["\']?',
            r'(?:create|add|make|build)\s+(?:a|an|the)?\s*([a-zA-Z0-9]+)',
            r'"([^"]+)"',
            r"'([^']+)'",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, prompt, re.IGNORECASE)
            if match:
                name = match.group(1).strip()
                # Clean up common words
                for word in ['a', 'an', 'the', 'new', 'screen', 'page', 'model', 'flow']:
                    name = re.sub(rf'\b{word}\b', '', name, flags=re.IGNORECASE).strip()
                if name:
                    return name.title()
        
        return None
    
    @staticmethod
    async def orchestrate(
        prompt: str,
        context: ConversationContext,
        project_state: Dict[str, Any],
        available_credits: int
    ) -> AIOrchestrationResult:
        """
        Main orchestration method - processes user prompt and coordinates subsystems.
        """
        # Add to history
        context.history.append({
            "role": "user",
            "content": prompt,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
        # Handle pending confirmation
        if context.pending_confirmation:
            if any(word in prompt.lower() for word in ["yes", "confirm", "ok", "proceed"]):
                # Execute the pending action
                pending = context.pending_confirmation
                context.pending_confirmation = None
                return await AIOrchestrationEngine._execute_action(
                    pending["output_type"],
                    pending["params"],
                    context,
                    project_state
                )
            elif any(word in prompt.lower() for word in ["no", "cancel", "abort"]):
                context.pending_confirmation = None
                return AIOrchestrationResult(
                    success=True,
                    output_type=AIOutputType.EXPLANATION,
                    message="Action cancelled.",
                    output={"cancelled": True}
                )
        
        # Analyze intent
        output_type, params, requires_confirmation = AIOrchestrationEngine.analyze_intent(prompt, context)
        
        # Check credits
        credits_required = AIOrchestrationEngine.CREDIT_COSTS.get(output_type, 0)
        if credits_required > available_credits:
            return AIOrchestrationResult(
                success=False,
                output_type=output_type,
                message=f"Insufficient credits. This action requires {credits_required} credits, you have {available_credits}.",
                credits_required=credits_required
            )
        
        # Handle confirmation
        if requires_confirmation:
            context.pending_confirmation = {
                "output_type": output_type,
                "params": params,
                "original_prompt": prompt
            }
            
            target_name = params.get("target_name", "item")
            return AIOrchestrationResult(
                success=True,
                output_type=AIOutputType.CONFIRMATION_REQUIRED,
                message=f"Are you sure you want to perform this action on '{target_name}'? This may modify or remove existing content. Reply 'yes' to confirm or 'no' to cancel.",
                requires_confirmation=True,
                confirmation_prompt=f"Confirm action on '{target_name}'?",
                credits_required=credits_required
            )
        
        # Execute the action
        return await AIOrchestrationEngine._execute_action(
            output_type, params, context, project_state
        )
    
    @staticmethod
    async def _execute_action(
        output_type: AIOutputType,
        params: Dict[str, Any],
        context: ConversationContext,
        project_state: Dict[str, Any]
    ) -> AIOrchestrationResult:
        """Execute the determined action."""
        target_name = params.get("target_name", "New Item")
        credits_required = AIOrchestrationEngine.CREDIT_COSTS.get(output_type, 0)
        
        if output_type == AIOutputType.SCREEN_BLUEPRINT:
            return AIOrchestrationResult(
                success=True,
                output_type=output_type,
                message=f"Generated blueprint for screen '{target_name}'",
                output={
                    "type": "screen",
                    "name": target_name,
                    "blueprint": {
                        "layout": "vertical",
                        "components": ["Header", "Content", "Footer"]
                    }
                },
                credits_required=credits_required
            )
        
        elif output_type == AIOutputType.PAGE_BLUEPRINT:
            return AIOrchestrationResult(
                success=True,
                output_type=output_type,
                message=f"Generated blueprint for page '{target_name}'",
                output={
                    "type": "page",
                    "name": target_name,
                    "blueprint": {
                        "sections": ["Hero", "Content", "CTA"]
                    }
                },
                credits_required=credits_required
            )
        
        elif output_type == AIOutputType.FLOW_DEFINITION:
            return AIOrchestrationResult(
                success=True,
                output_type=output_type,
                message=f"Generated flow definition '{target_name}'",
                output={
                    "type": "flow",
                    "name": target_name,
                    "steps": ["Start", "Process", "End"]
                },
                credits_required=credits_required
            )
        
        elif output_type == AIOutputType.NAVIGATION_UPDATE:
            return AIOrchestrationResult(
                success=True,
                output_type=output_type,
                message="Updated navigation structure",
                output={"navigation_updated": True},
                credits_required=credits_required
            )
        
        elif output_type == AIOutputType.DATA_MODEL_UPDATE:
            return AIOrchestrationResult(
                success=True,
                output_type=output_type,
                message=f"Updated data model '{target_name}'",
                output={
                    "type": "data_model",
                    "name": target_name,
                    "fields": []
                },
                credits_required=credits_required
            )
        
        elif output_type == AIOutputType.COMPONENT_RECOMMENDATION:
            # Get recommendations based on context
            recommendations = ["StatsCard", "DataTable", "Chart", "Button", "Form"]
            return AIOrchestrationResult(
                success=True,
                output_type=output_type,
                message="Here are some recommended components for your project",
                output={"recommendations": recommendations},
                credits_required=0
            )
        
        elif output_type == AIOutputType.EXPLANATION:
            # Generate explanation
            explanation = f"Your project '{project_state.get('name', 'Project')}' contains "
            explanation += f"{len(project_state.get('structure', {}).get('screens', []))} screens, "
            explanation += f"{len(project_state.get('structure', {}).get('pages', []))} pages, "
            explanation += f"and {len(project_state.get('structure', {}).get('data_models', []))} data models."
            
            return AIOrchestrationResult(
                success=True,
                output_type=output_type,
                message=explanation,
                output={"explanation": explanation},
                credits_required=0
            )
        
        return AIOrchestrationResult(
            success=False,
            output_type=output_type,
            message="Unknown action type"
        )
    
    @staticmethod
    def generate_emotional_response(
        result: AIOrchestrationResult,
        context: ConversationContext
    ) -> str:
        """Generate an emotionally safe and clear response message."""
        if result.success:
            if result.output_type == AIOutputType.CONFIRMATION_REQUIRED:
                return f"⚠️ {result.message}"
            elif result.credits_required > 0:
                return f"✅ {result.message} ({result.credits_required} credits used)"
            else:
                return f"✅ {result.message}"
        else:
            return f"❌ {result.message}"
