# Voice Orchestration Engine - Routes voice commands to correct subsystems
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class VoiceCommandStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    AWAITING_CONFIRMATION = "awaiting_confirmation"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class VoiceCommand(BaseModel):
    """Processed voice command ready for execution."""
    command_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    user_id: str
    project_id: Optional[str] = None
    original_text: str
    intent_type: str
    target_name: Optional[str] = None
    parameters: Dict[str, Any] = {}
    status: VoiceCommandStatus = VoiceCommandStatus.PENDING
    requires_confirmation: bool = False
    credits_required: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    executed_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class VoiceConversationContext(BaseModel):
    """Maintains context across multi-step voice sessions."""
    context_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    project_id: Optional[str] = None
    current_screen: Optional[str] = None
    command_history: List[str] = []
    pending_command: Optional[VoiceCommand] = None
    last_response: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class VoiceOrchestrationResult(BaseModel):
    """Result of voice command orchestration."""
    success: bool
    command: Optional[VoiceCommand] = None
    response_text: str
    response_audio_needed: bool = False
    next_action: Optional[str] = None
    credits_used: int = 0
    updated_context: Optional[Dict[str, Any]] = None


class VoiceOrchestrationEngine:
    """
    Voice Orchestration Engine routes voice commands to correct subsystems.
    
    Responsibilities:
    - Route interpreted intent to correct subsystem
    - Coordinate with AI Orchestration Engine
    - Trigger generation, navigation, or data model updates
    - Provide voice or text feedback
    - Maintain context across multi-step voice sessions
    
    Flow:
    1. User speaks
    2. Voice Input Engine captures audio
    3. Speech-to-Intent Engine interprets
    4. Voice Orchestration routes intent
    5. AI Instruction Engine generates structured output
    6. Canvas Engine renders results
    7. Credit Engine deducts credits
    8. Voice Feedback Engine responds (if enabled)
    """
    
    # Active contexts
    _contexts: Dict[str, VoiceConversationContext] = {}
    
    # Command queue
    _commands: Dict[str, VoiceCommand] = {}
    
    # Subsystem routing map
    INTENT_TO_ENGINE = {
        "create_screen": "generation_engine",
        "create_page": "generation_engine",
        "generate_flow": "generation_engine",
        "modify_navigation": "navigation_engine",
        "update_data_model": "data_model_engine",
        "refine_content": "generation_engine",
        "explain_project": "ai_orchestration_engine",
        "ask_for_help": "runtime_intelligence_engine",
        "delete_screen": "project_engine",
        "delete_page": "project_engine",
        "delete_data_model": "data_model_engine",
    }
    
    # Response templates
    RESPONSE_TEMPLATES = {
        "create_screen": "Creating a {target_name} screen for you.",
        "create_page": "Building a {target_name} page now.",
        "generate_flow": "Generating a {target_name} flow with {steps} steps.",
        "modify_navigation": "Updating navigation to connect to {target_name}.",
        "update_data_model": "Creating a {target_name} data model.",
        "refine_content": "Making those changes for you.",
        "explain_project": "Let me explain this project.",
        "ask_for_help": "Here's how you can do that.",
        "confirmation_needed": "Are you sure you want to {action}? Say 'yes' to confirm or 'no' to cancel.",
        "success": "Done! {result}",
        "error": "Sorry, something went wrong: {error}",
        "low_credits": "You need {required} credits for this. You have {available}.",
        "unknown": "I didn't quite catch that. Try saying something like 'Create a dashboard screen' or 'Add a login page'.",
    }
    
    @classmethod
    def get_or_create_context(
        cls,
        user_id: str,
        project_id: Optional[str] = None
    ) -> VoiceConversationContext:
        """Get or create a conversation context for a user."""
        context_key = f"{user_id}:{project_id or 'global'}"
        
        if context_key not in cls._contexts:
            cls._contexts[context_key] = VoiceConversationContext(
                user_id=user_id,
                project_id=project_id
            )
        
        return cls._contexts[context_key]
    
    @classmethod
    def clear_context(cls, user_id: str, project_id: Optional[str] = None):
        """Clear a conversation context."""
        context_key = f"{user_id}:{project_id or 'global'}"
        cls._contexts.pop(context_key, None)
    
    @classmethod
    async def process_voice_command(
        cls,
        session_id: str,
        user_id: str,
        intent_type: str,
        original_text: str,
        target_name: Optional[str] = None,
        parameters: Dict[str, Any] = None,
        project_id: Optional[str] = None,
        available_credits: int = 0,
        voice_output_enabled: bool = True
    ) -> VoiceOrchestrationResult:
        """
        Process a voice command and route to appropriate subsystem.
        
        Args:
            session_id: Voice session ID
            user_id: User ID
            intent_type: Detected intent type
            original_text: Original transcribed text
            target_name: Extracted target name
            parameters: Intent parameters
            project_id: Current project ID
            available_credits: User's available credits
            voice_output_enabled: Whether to generate voice response
        """
        parameters = parameters or {}
        
        # Get or create context
        context = cls.get_or_create_context(user_id, project_id)
        
        # Check for pending confirmation
        if context.pending_command:
            return await cls._handle_confirmation_response(
                context, original_text, voice_output_enabled
            )
        
        # Create command
        command = VoiceCommand(
            session_id=session_id,
            user_id=user_id,
            project_id=project_id,
            original_text=original_text,
            intent_type=intent_type,
            target_name=target_name,
            parameters=parameters,
            requires_confirmation=cls._requires_confirmation(intent_type),
            credits_required=cls._get_credits_required(intent_type)
        )
        
        # Store command
        cls._commands[command.command_id] = command
        
        # Check credits
        if command.credits_required > available_credits:
            return VoiceOrchestrationResult(
                success=False,
                command=command,
                response_text=cls.RESPONSE_TEMPLATES["low_credits"].format(
                    required=command.credits_required,
                    available=available_credits
                ),
                response_audio_needed=voice_output_enabled
            )
        
        # Handle confirmation if needed
        if command.requires_confirmation:
            context.pending_command = command
            context.updated_at = datetime.now(timezone.utc)
            
            action_text = f"delete the {target_name or 'selected'} {intent_type.split('_')[1]}"
            return VoiceOrchestrationResult(
                success=True,
                command=command,
                response_text=cls.RESPONSE_TEMPLATES["confirmation_needed"].format(action=action_text),
                response_audio_needed=voice_output_enabled,
                next_action="await_confirmation"
            )
        
        # Execute command
        return await cls._execute_command(command, context, voice_output_enabled)
    
    @classmethod
    async def _handle_confirmation_response(
        cls,
        context: VoiceConversationContext,
        response_text: str,
        voice_output_enabled: bool
    ) -> VoiceOrchestrationResult:
        """Handle user's response to a confirmation prompt."""
        response_lower = response_text.lower().strip()
        command = context.pending_command
        
        # Check for confirmation
        is_confirmed = any(word in response_lower for word in ["yes", "confirm", "do it", "proceed", "okay", "ok", "sure"])
        is_cancelled = any(word in response_lower for word in ["no", "cancel", "stop", "don't", "abort", "never mind"])
        
        if is_confirmed:
            # Clear pending and execute
            context.pending_command = None
            return await cls._execute_command(command, context, voice_output_enabled)
        
        elif is_cancelled:
            # Clear pending and cancel
            context.pending_command = None
            command.status = VoiceCommandStatus.CANCELLED
            
            return VoiceOrchestrationResult(
                success=True,
                command=command,
                response_text="Okay, I've cancelled that action.",
                response_audio_needed=voice_output_enabled,
                next_action=None
            )
        
        else:
            # Unclear response, ask again
            return VoiceOrchestrationResult(
                success=True,
                command=command,
                response_text="Please say 'yes' to confirm or 'no' to cancel.",
                response_audio_needed=voice_output_enabled,
                next_action="await_confirmation"
            )
    
    @classmethod
    async def _execute_command(
        cls,
        command: VoiceCommand,
        context: VoiceConversationContext,
        voice_output_enabled: bool
    ) -> VoiceOrchestrationResult:
        """Execute a voice command by routing to the appropriate engine."""
        command.status = VoiceCommandStatus.EXECUTING
        
        # Get target engine
        target_engine = cls.INTENT_TO_ENGINE.get(command.intent_type, "ai_orchestration_engine")
        
        # Route to engine (mocked for now)
        try:
            result = await cls._route_to_engine(command, target_engine)
            
            command.status = VoiceCommandStatus.COMPLETED
            command.executed_at = datetime.now(timezone.utc)
            command.result = result
            
            # Generate response
            template = cls.RESPONSE_TEMPLATES.get(command.intent_type, cls.RESPONSE_TEMPLATES["success"])
            response_text = template.format(
                target_name=command.target_name or "new item",
                steps=command.parameters.get("steps", 3),
                result=result.get("message", "Your request has been processed.")
            )
            
            # Update context
            context.command_history.append(command.original_text)
            context.last_response = response_text
            context.updated_at = datetime.now(timezone.utc)
            
            return VoiceOrchestrationResult(
                success=True,
                command=command,
                response_text=response_text,
                response_audio_needed=voice_output_enabled,
                credits_used=command.credits_required,
                updated_context={
                    "current_screen": command.target_name,
                    "last_action": command.intent_type
                }
            )
            
        except Exception as e:
            command.status = VoiceCommandStatus.FAILED
            command.error = str(e)
            
            return VoiceOrchestrationResult(
                success=False,
                command=command,
                response_text=cls.RESPONSE_TEMPLATES["error"].format(error=str(e)),
                response_audio_needed=voice_output_enabled
            )
    
    @classmethod
    async def _route_to_engine(cls, command: VoiceCommand, engine_name: str) -> Dict[str, Any]:
        """Route command to target engine and get result."""
        # This is a mock implementation
        # In real implementation, this would call the actual engines
        
        if command.intent_type in ["create_screen", "create_page", "generate_flow"]:
            return {
                "success": True,
                "message": f"Created {command.target_name or 'new item'} successfully.",
                "item_id": str(uuid.uuid4()),
                "type": command.intent_type.replace("create_", "").replace("generate_", "")
            }
        
        elif command.intent_type == "modify_navigation":
            return {
                "success": True,
                "message": f"Navigation updated to include {command.target_name}.",
                "navigation_updated": True
            }
        
        elif command.intent_type == "update_data_model":
            fields = command.parameters.get("fields", ["id", "name"])
            return {
                "success": True,
                "message": f"Created {command.target_name} model with fields: {', '.join(fields)}.",
                "model_id": str(uuid.uuid4()),
                "fields": fields
            }
        
        elif command.intent_type in ["delete_screen", "delete_page", "delete_data_model"]:
            return {
                "success": True,
                "message": f"Deleted {command.target_name} successfully.",
                "deleted": True
            }
        
        elif command.intent_type == "explain_project":
            return {
                "success": True,
                "message": "This project contains screens, pages, and data models that work together to create your application.",
                "explanation": True
            }
        
        elif command.intent_type == "ask_for_help":
            return {
                "success": True,
                "message": "You can create screens by saying 'Create a dashboard screen', add pages with 'Add a landing page', or manage data with 'Create a User model'.",
                "help": True
            }
        
        return {
            "success": True,
            "message": "Command processed.",
            "result": "mocked"
        }
    
    @classmethod
    def _requires_confirmation(cls, intent_type: str) -> bool:
        """Check if intent requires user confirmation."""
        return intent_type in ["delete_screen", "delete_page", "delete_data_model"]
    
    @classmethod
    def _get_credits_required(cls, intent_type: str) -> int:
        """Get credits required for an intent."""
        credits_map = {
            "create_screen": 3,
            "create_page": 5,
            "generate_flow": 8,
            "modify_navigation": 1,
            "update_data_model": 2,
            "refine_content": 1,
            "explain_project": 0,
            "ask_for_help": 0,
            "delete_screen": 0,
            "delete_page": 0,
            "delete_data_model": 0,
        }
        return credits_map.get(intent_type, 0)
    
    @classmethod
    def get_command(cls, command_id: str) -> Optional[VoiceCommand]:
        """Get a command by ID."""
        return cls._commands.get(command_id)
    
    @classmethod
    def get_command_history(cls, user_id: str, limit: int = 20) -> List[VoiceCommand]:
        """Get command history for a user."""
        commands = [c for c in cls._commands.values() if c.user_id == user_id]
        commands.sort(key=lambda c: c.created_at, reverse=True)
        return commands[:limit]
