# Voice Error Handling Engine - Robust error handling and recovery for voice features
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class VoiceErrorType(str, Enum):
    UNCLEAR_SPEECH = "unclear_speech"
    BACKGROUND_NOISE = "background_noise"
    PARTIAL_COMMAND = "partial_command"
    AMBIGUOUS_INTENT = "ambiguous_intent"
    STT_FAILURE = "stt_failure"
    TTS_FAILURE = "tts_failure"
    MICROPHONE_DENIED = "microphone_permission_denied"
    NETWORK_ERROR = "network_error"
    RATE_LIMITED = "rate_limited"
    INSUFFICIENT_CREDITS = "insufficient_credits"
    SESSION_EXPIRED = "session_expired"
    UNKNOWN = "unknown"


class RecoveryAction(str, Enum):
    ASK_CLARIFICATION = "ask_for_clarification"
    REPEAT_PROMPT = "repeat_last_prompt"
    FALLBACK_TEXT = "fallback_to_text_input"
    DISPLAY_ERROR = "display_error_message"
    OFFER_ALTERNATIVES = "offer_safe_alternatives"
    RETRY = "retry_operation"
    CANCEL = "cancel_operation"


class VoiceError(BaseModel):
    """Voice error with context and recovery options."""
    error_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    error_type: VoiceErrorType
    message: str
    user_message: str  # Friendly message for the user
    voice_message: Optional[str] = None  # TTS-friendly message
    recovery_actions: List[RecoveryAction] = []
    context: Dict[str, Any] = {}
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    recoverable: bool = True


class ErrorRecoveryResult(BaseModel):
    """Result of attempting error recovery."""
    success: bool
    action_taken: RecoveryAction
    message: str
    next_prompt: Optional[str] = None
    fallback_mode: bool = False


class VoiceErrorHandlingEngine:
    """
    Voice Error Handling & Recovery Engine.
    
    Responsibilities:
    - Detect unclear or incomplete voice commands
    - Provide spoken and visual clarification prompts
    - Recover gracefully from STT/TTS failures
    - Offer fallback to text input
    - Prevent accidental destructive actions
    
    Error Types:
    - unclear_speech, background_noise, partial_command
    - ambiguous_intent, stt_failure, tts_failure
    - microphone_permission_denied
    
    Recovery Actions:
    - ask_for_clarification, repeat_last_prompt
    - fallback_to_text_input, display_error_message
    - offer_safe_alternatives
    
    Rules:
    - Never execute unclear commands
    - Always request confirmation for destructive actions
    - Always provide text fallback
    - Never repeat sensitive information in voice output
    """
    
    # Error history for analytics
    _error_history: List[VoiceError] = []
    _max_history = 1000
    
    # Retry counts per session
    _retry_counts: Dict[str, int] = {}
    _max_retries = 3
    
    # Error message templates
    ERROR_MESSAGES = {
        VoiceErrorType.UNCLEAR_SPEECH: {
            "user": "I couldn't understand that clearly. Could you please try again?",
            "voice": "Sorry, I didn't catch that. Could you please repeat?",
            "recovery": [RecoveryAction.ASK_CLARIFICATION, RecoveryAction.FALLBACK_TEXT]
        },
        VoiceErrorType.BACKGROUND_NOISE: {
            "user": "There's too much background noise. Please try in a quieter environment or use text input.",
            "voice": "I'm having trouble hearing you. Please try again or type your request.",
            "recovery": [RecoveryAction.REPEAT_PROMPT, RecoveryAction.FALLBACK_TEXT]
        },
        VoiceErrorType.PARTIAL_COMMAND: {
            "user": "Your command was cut off. Please try again with your full request.",
            "voice": "It seems your message was incomplete. Please repeat your full request.",
            "recovery": [RecoveryAction.ASK_CLARIFICATION, RecoveryAction.REPEAT_PROMPT]
        },
        VoiceErrorType.AMBIGUOUS_INTENT: {
            "user": "I'm not sure what you want to do. Could you be more specific?",
            "voice": "I need a bit more detail. What exactly would you like me to do?",
            "recovery": [RecoveryAction.ASK_CLARIFICATION, RecoveryAction.OFFER_ALTERNATIVES]
        },
        VoiceErrorType.STT_FAILURE: {
            "user": "Voice recognition is temporarily unavailable. Please use text input.",
            "voice": None,  # Can't speak if TTS might be down too
            "recovery": [RecoveryAction.FALLBACK_TEXT, RecoveryAction.RETRY]
        },
        VoiceErrorType.TTS_FAILURE: {
            "user": "Voice response is unavailable. Showing text response instead.",
            "voice": None,
            "recovery": [RecoveryAction.DISPLAY_ERROR, RecoveryAction.RETRY]
        },
        VoiceErrorType.MICROPHONE_DENIED: {
            "user": "Microphone access was denied. Please enable it in your browser settings or use text input.",
            "voice": None,
            "recovery": [RecoveryAction.FALLBACK_TEXT, RecoveryAction.DISPLAY_ERROR]
        },
        VoiceErrorType.NETWORK_ERROR: {
            "user": "Connection issue. Please check your internet and try again.",
            "voice": "I'm having trouble connecting. Please check your internet.",
            "recovery": [RecoveryAction.RETRY, RecoveryAction.FALLBACK_TEXT]
        },
        VoiceErrorType.RATE_LIMITED: {
            "user": "Too many requests. Please wait a moment and try again.",
            "voice": "Please wait a moment before your next request.",
            "recovery": [RecoveryAction.RETRY, RecoveryAction.DISPLAY_ERROR]
        },
        VoiceErrorType.INSUFFICIENT_CREDITS: {
            "user": "You don't have enough credits for this action.",
            "voice": "You need more credits to complete this action.",
            "recovery": [RecoveryAction.DISPLAY_ERROR, RecoveryAction.OFFER_ALTERNATIVES]
        },
        VoiceErrorType.SESSION_EXPIRED: {
            "user": "Your voice session has expired. Starting a new session.",
            "voice": "Session expired. Let me start a new one for you.",
            "recovery": [RecoveryAction.RETRY, RecoveryAction.CANCEL]
        },
        VoiceErrorType.UNKNOWN: {
            "user": "Something went wrong. Please try again.",
            "voice": "Something went wrong. Please try again.",
            "recovery": [RecoveryAction.RETRY, RecoveryAction.FALLBACK_TEXT]
        }
    }
    
    # Clarification prompts for different contexts
    CLARIFICATION_PROMPTS = {
        "create": "What would you like to create? You can say things like 'a login screen' or 'a product data model'.",
        "modify": "What would you like to modify? Please specify the item and the change.",
        "delete": "What would you like to delete? Please name the specific item.",
        "navigation": "Where would you like to navigate? Please specify the screen or page.",
        "general": "I'm ready to help. What would you like to do? You can create screens, pages, data models, or flows."
    }
    
    # Sensitive words that should not be spoken
    SENSITIVE_PATTERNS = [
        r"\b(?:password|secret|api[_-]?key|token|credential|ssn|social\s*security)\b",
        r"\b(?:\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4})\b",  # Credit card
        r"\b(?:\d{3}[-\s]?\d{2}[-\s]?\d{4})\b",  # SSN pattern
    ]
    
    @classmethod
    def create_error(
        cls,
        error_type: VoiceErrorType,
        context: Dict[str, Any] = None
    ) -> VoiceError:
        """Create a standardized voice error with recovery options."""
        config = cls.ERROR_MESSAGES.get(error_type, cls.ERROR_MESSAGES[VoiceErrorType.UNKNOWN])
        
        error = VoiceError(
            error_type=error_type,
            message=config["user"],
            user_message=config["user"],
            voice_message=config.get("voice"),
            recovery_actions=config["recovery"],
            context=context or {},
            recoverable=error_type not in [VoiceErrorType.MICROPHONE_DENIED]
        )
        
        # Store in history
        cls._error_history.append(error)
        if len(cls._error_history) > cls._max_history:
            cls._error_history = cls._error_history[-cls._max_history:]
        
        return error
    
    @classmethod
    def handle_stt_error(cls, exception: Exception, session_id: str = None) -> VoiceError:
        """Handle speech-to-text errors."""
        error_str = str(exception).lower()
        
        if "timeout" in error_str or "connection" in error_str:
            error_type = VoiceErrorType.NETWORK_ERROR
        elif "rate" in error_str or "limit" in error_str:
            error_type = VoiceErrorType.RATE_LIMITED
        elif "permission" in error_str or "denied" in error_str:
            error_type = VoiceErrorType.MICROPHONE_DENIED
        else:
            error_type = VoiceErrorType.STT_FAILURE
        
        return cls.create_error(error_type, {"exception": str(exception), "session_id": session_id})
    
    @classmethod
    def handle_tts_error(cls, exception: Exception) -> VoiceError:
        """Handle text-to-speech errors."""
        error_str = str(exception).lower()
        
        if "timeout" in error_str or "connection" in error_str:
            error_type = VoiceErrorType.NETWORK_ERROR
        elif "rate" in error_str or "limit" in error_str:
            error_type = VoiceErrorType.RATE_LIMITED
        else:
            error_type = VoiceErrorType.TTS_FAILURE
        
        return cls.create_error(error_type, {"exception": str(exception)})
    
    @classmethod
    def handle_unclear_speech(
        cls,
        transcription: str,
        confidence: float = 0.0
    ) -> VoiceError:
        """Handle unclear or low-confidence transcription."""
        if not transcription or len(transcription.strip()) < 3:
            error_type = VoiceErrorType.UNCLEAR_SPEECH
        elif confidence < 0.3:
            error_type = VoiceErrorType.BACKGROUND_NOISE
        elif transcription.endswith("...") or len(transcription.split()) < 2:
            error_type = VoiceErrorType.PARTIAL_COMMAND
        else:
            error_type = VoiceErrorType.AMBIGUOUS_INTENT
        
        return cls.create_error(error_type, {
            "transcription": transcription,
            "confidence": confidence
        })
    
    @classmethod
    def handle_ambiguous_intent(
        cls,
        transcription: str,
        detected_intents: List[str],
        context: str = "general"
    ) -> VoiceError:
        """Handle ambiguous command with multiple possible intents."""
        error = cls.create_error(VoiceErrorType.AMBIGUOUS_INTENT, {
            "transcription": transcription,
            "detected_intents": detected_intents,
            "context": context
        })
        
        # Add contextual clarification prompt
        clarification = cls.CLARIFICATION_PROMPTS.get(context, cls.CLARIFICATION_PROMPTS["general"])
        error.voice_message = clarification
        
        return error
    
    @classmethod
    def attempt_recovery(
        cls,
        error: VoiceError,
        session_id: str = None
    ) -> ErrorRecoveryResult:
        """Attempt to recover from an error."""
        if not error.recoverable:
            return ErrorRecoveryResult(
                success=False,
                action_taken=RecoveryAction.DISPLAY_ERROR,
                message=error.user_message,
                fallback_mode=True
            )
        
        # Check retry count
        retry_key = f"{session_id}:{error.error_type.value}" if session_id else error.error_type.value
        current_retries = cls._retry_counts.get(retry_key, 0)
        
        if current_retries >= cls._max_retries:
            # Max retries reached, fallback to text
            return ErrorRecoveryResult(
                success=False,
                action_taken=RecoveryAction.FALLBACK_TEXT,
                message="Voice input isn't working reliably. Please use text input instead.",
                fallback_mode=True
            )
        
        # Get first available recovery action
        action = error.recovery_actions[0] if error.recovery_actions else RecoveryAction.FALLBACK_TEXT
        
        if action == RecoveryAction.ASK_CLARIFICATION:
            cls._retry_counts[retry_key] = current_retries + 1
            context = error.context.get("context", "general")
            return ErrorRecoveryResult(
                success=True,
                action_taken=action,
                message=error.user_message,
                next_prompt=cls.CLARIFICATION_PROMPTS.get(context, cls.CLARIFICATION_PROMPTS["general"])
            )
        
        elif action == RecoveryAction.REPEAT_PROMPT:
            cls._retry_counts[retry_key] = current_retries + 1
            return ErrorRecoveryResult(
                success=True,
                action_taken=action,
                message="Let me try that again.",
                next_prompt="Please repeat your request."
            )
        
        elif action == RecoveryAction.RETRY:
            cls._retry_counts[retry_key] = current_retries + 1
            return ErrorRecoveryResult(
                success=True,
                action_taken=action,
                message=error.user_message,
                next_prompt="Please try again."
            )
        
        elif action == RecoveryAction.OFFER_ALTERNATIVES:
            return ErrorRecoveryResult(
                success=True,
                action_taken=action,
                message=error.user_message,
                next_prompt="You can: create a screen, create a page, add a data model, or generate a flow. What would you like?"
            )
        
        else:
            return ErrorRecoveryResult(
                success=False,
                action_taken=RecoveryAction.FALLBACK_TEXT,
                message=error.user_message,
                fallback_mode=True
            )
    
    @classmethod
    def sanitize_for_voice(cls, text: str) -> str:
        """Remove sensitive information before speaking."""
        import re
        
        sanitized = text
        for pattern in cls.SENSITIVE_PATTERNS:
            sanitized = re.sub(pattern, "[redacted]", sanitized, flags=re.IGNORECASE)
        
        return sanitized
    
    @classmethod
    def reset_retry_count(cls, session_id: str = None):
        """Reset retry count for a session."""
        if session_id:
            keys_to_remove = [k for k in cls._retry_counts.keys() if k.startswith(f"{session_id}:")]
            for key in keys_to_remove:
                del cls._retry_counts[key]
        else:
            cls._retry_counts.clear()
    
    @classmethod
    def get_error_stats(cls) -> Dict[str, Any]:
        """Get error statistics for monitoring."""
        if not cls._error_history:
            return {"total_errors": 0, "by_type": {}}
        
        by_type = {}
        for error in cls._error_history:
            error_type = error.error_type.value
            by_type[error_type] = by_type.get(error_type, 0) + 1
        
        return {
            "total_errors": len(cls._error_history),
            "by_type": by_type,
            "most_common": max(by_type.items(), key=lambda x: x[1])[0] if by_type else None,
            "recoverable_rate": sum(1 for e in cls._error_history if e.recoverable) / len(cls._error_history)
        }
    
    @classmethod
    def get_recovery_suggestions(cls, error_type: VoiceErrorType) -> List[str]:
        """Get user-friendly recovery suggestions."""
        suggestions = {
            VoiceErrorType.UNCLEAR_SPEECH: [
                "Speak clearly and at a moderate pace",
                "Hold the microphone closer",
                "Try using text input instead"
            ],
            VoiceErrorType.BACKGROUND_NOISE: [
                "Move to a quieter location",
                "Use headphones with a microphone",
                "Close windows or doors",
                "Try using text input"
            ],
            VoiceErrorType.PARTIAL_COMMAND: [
                "Wait for the listening indicator before speaking",
                "Complete your sentence before stopping",
                "Speak your full command in one go"
            ],
            VoiceErrorType.AMBIGUOUS_INTENT: [
                "Be more specific about what you want",
                "Use phrases like 'Create a...' or 'Add a...'",
                "Mention the type of item (screen, page, model)"
            ],
            VoiceErrorType.MICROPHONE_DENIED: [
                "Click the microphone icon in your browser's address bar",
                "Go to browser settings and allow microphone access",
                "Use text input as an alternative"
            ],
            VoiceErrorType.NETWORK_ERROR: [
                "Check your internet connection",
                "Try again in a few moments",
                "Use text input if the issue persists"
            ]
        }
        
        return suggestions.get(error_type, ["Please try again or use text input."])
