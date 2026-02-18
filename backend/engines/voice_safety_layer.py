# Voice Safety Layer - Confirmation and safety checks for voice commands
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid
import re


class SafetyLevel(str, Enum):
    SAFE = "safe"
    CAUTION = "caution"
    DANGEROUS = "dangerous"


class ConfirmationStatus(str, Enum):
    NOT_REQUIRED = "not_required"
    PENDING = "pending"
    CONFIRMED = "confirmed"
    DENIED = "denied"
    EXPIRED = "expired"


class SafetyCheckResult(BaseModel):
    """Result of a safety check on a voice command."""
    is_safe: bool
    safety_level: SafetyLevel
    requires_confirmation: bool
    confirmation_prompt: Optional[str] = None
    warnings: List[str] = []
    blocked_reason: Optional[str] = None


class PendingConfirmation(BaseModel):
    """Pending confirmation for a dangerous action."""
    confirmation_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    action_type: str
    target_name: Optional[str] = None
    original_command: str
    prompt: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime = None
    status: ConfirmationStatus = ConfirmationStatus.PENDING


class VoiceSafetyLayer:
    """
    Voice Safety & Confirmation Layer prevents accidental destructive actions.
    
    Responsibilities:
    - Prevent accidental destructive actions
    - Require confirmation for deletes or overwrites
    - Detect unclear or risky commands
    - Ask for clarification when needed
    
    Confirmation Required For:
    - delete_screen
    - delete_page
    - delete_data_model
    - overwrite_existing_content
    - reset_project
    
    Rules:
    - Never execute destructive actions without confirmation
    - Always show visual confirmation prompt
    - Voice confirmation is allowed
    """
    
    # Pending confirmations
    _pending: Dict[str, PendingConfirmation] = {}
    
    # Confirmation timeout in seconds
    CONFIRMATION_TIMEOUT = 60
    
    # Dangerous action patterns
    DANGEROUS_ACTIONS = [
        "delete_screen",
        "delete_page",
        "delete_data_model",
        "delete_flow",
        "delete_navigation",
        "reset_project",
        "clear_all",
        "remove_all",
    ]
    
    # Overwrite patterns
    OVERWRITE_PATTERNS = [
        r"overwrite",
        r"replace\s+(?:all|everything)",
        r"reset",
        r"clear\s+(?:all|everything)",
        r"wipe",
        r"start\s+over",
    ]
    
    # Ambiguous patterns that need clarification
    AMBIGUOUS_PATTERNS = [
        r"^(?:delete|remove)\s*$",  # Just "delete" with no target
        r"^(?:change|modify)\s+(?:it|that|this)\s*$",  # Unclear reference
        r"^(?:do)\s+(?:it|that|this)\s*$",
    ]
    
    # Confirmation phrases
    CONFIRM_PHRASES = ["yes", "confirm", "do it", "proceed", "okay", "ok", "sure", "go ahead", "affirmative"]
    DENY_PHRASES = ["no", "cancel", "stop", "don't", "abort", "never mind", "wait", "negative"]
    
    @classmethod
    def check_safety(
        cls,
        intent_type: str,
        original_command: str,
        target_name: Optional[str] = None,
        has_existing_content: bool = False
    ) -> SafetyCheckResult:
        """
        Check the safety level of a voice command.
        
        Args:
            intent_type: The detected intent type
            original_command: The original transcribed command
            target_name: Target of the action
            has_existing_content: Whether the action affects existing content
            
        Returns:
            SafetyCheckResult with safety assessment
        """
        warnings = []
        
        # Check if action is dangerous
        is_dangerous = intent_type in cls.DANGEROUS_ACTIONS
        
        # Check for overwrite patterns
        is_overwrite = any(
            re.search(pattern, original_command.lower())
            for pattern in cls.OVERWRITE_PATTERNS
        )
        
        # Check for ambiguous commands
        is_ambiguous = any(
            re.match(pattern, original_command.lower().strip())
            for pattern in cls.AMBIGUOUS_PATTERNS
        )
        
        # Determine safety level
        if is_dangerous:
            safety_level = SafetyLevel.DANGEROUS
            requires_confirmation = True
            
            action_word = intent_type.split("_")[0]
            item_type = "_".join(intent_type.split("_")[1:])
            target = target_name or "this item"
            
            confirmation_prompt = f"⚠️ Are you sure you want to {action_word} the {item_type} '{target}'? This cannot be undone. Say 'yes' to confirm or 'no' to cancel."
            warnings.append(f"This will permanently {action_word} the {item_type}.")
            
        elif is_overwrite and has_existing_content:
            safety_level = SafetyLevel.DANGEROUS
            requires_confirmation = True
            confirmation_prompt = "⚠️ This will overwrite existing content. Are you sure? Say 'yes' to confirm or 'no' to cancel."
            warnings.append("Existing content will be replaced.")
            
        elif is_ambiguous:
            safety_level = SafetyLevel.CAUTION
            requires_confirmation = True
            confirmation_prompt = "I'm not sure what you want to modify. Can you be more specific?"
            warnings.append("Command is ambiguous.")
            
        else:
            safety_level = SafetyLevel.SAFE
            requires_confirmation = False
            confirmation_prompt = None
        
        return SafetyCheckResult(
            is_safe=safety_level == SafetyLevel.SAFE,
            safety_level=safety_level,
            requires_confirmation=requires_confirmation,
            confirmation_prompt=confirmation_prompt,
            warnings=warnings
        )
    
    @classmethod
    def create_confirmation(
        cls,
        user_id: str,
        action_type: str,
        original_command: str,
        prompt: str,
        target_name: Optional[str] = None
    ) -> PendingConfirmation:
        """Create a pending confirmation for a dangerous action."""
        from datetime import timedelta
        
        confirmation = PendingConfirmation(
            user_id=user_id,
            action_type=action_type,
            target_name=target_name,
            original_command=original_command,
            prompt=prompt,
            expires_at=datetime.now(timezone.utc) + timedelta(seconds=cls.CONFIRMATION_TIMEOUT)
        )
        
        cls._pending[confirmation.confirmation_id] = confirmation
        return confirmation
    
    @classmethod
    def get_pending_confirmation(cls, user_id: str) -> Optional[PendingConfirmation]:
        """Get the pending confirmation for a user."""
        for conf in cls._pending.values():
            if conf.user_id == user_id and conf.status == ConfirmationStatus.PENDING:
                # Check expiration
                if datetime.now(timezone.utc) > conf.expires_at:
                    conf.status = ConfirmationStatus.EXPIRED
                    continue
                return conf
        return None
    
    @classmethod
    def process_confirmation_response(
        cls,
        user_id: str,
        response_text: str
    ) -> Tuple[Optional[PendingConfirmation], bool, str]:
        """
        Process a user's response to a confirmation prompt.
        
        Args:
            user_id: User ID
            response_text: User's response
            
        Returns:
            Tuple of (confirmation, is_confirmed, message)
        """
        pending = cls.get_pending_confirmation(user_id)
        
        if not pending:
            return None, False, "No pending confirmation found."
        
        response_lower = response_text.lower().strip()
        
        # Check for confirmation
        if any(phrase in response_lower for phrase in cls.CONFIRM_PHRASES):
            pending.status = ConfirmationStatus.CONFIRMED
            return pending, True, "Action confirmed."
        
        # Check for denial
        if any(phrase in response_lower for phrase in cls.DENY_PHRASES):
            pending.status = ConfirmationStatus.DENIED
            return pending, False, "Action cancelled."
        
        # Unclear response
        return pending, False, "Please say 'yes' to confirm or 'no' to cancel."
    
    @classmethod
    def cancel_pending(cls, user_id: str) -> bool:
        """Cancel any pending confirmation for a user."""
        pending = cls.get_pending_confirmation(user_id)
        if pending:
            pending.status = ConfirmationStatus.DENIED
            return True
        return False
    
    @classmethod
    def clear_expired(cls):
        """Clear all expired confirmations."""
        now = datetime.now(timezone.utc)
        expired_ids = [
            conf_id for conf_id, conf in cls._pending.items()
            if conf.expires_at and now > conf.expires_at
        ]
        for conf_id in expired_ids:
            del cls._pending[conf_id]
        return len(expired_ids)
    
    @classmethod
    def is_confirmation_response(cls, text: str) -> bool:
        """Check if text appears to be a confirmation response."""
        text_lower = text.lower().strip()
        
        # Check if it's a simple yes/no response
        is_confirm = any(phrase in text_lower for phrase in cls.CONFIRM_PHRASES)
        is_deny = any(phrase in text_lower for phrase in cls.DENY_PHRASES)
        
        # Also check if it's a very short response (likely confirmation)
        is_short = len(text.split()) <= 3
        
        return (is_confirm or is_deny) and is_short
    
    @classmethod
    def get_safety_info(cls) -> Dict[str, Any]:
        """Get information about safety rules."""
        return {
            "dangerous_actions": cls.DANGEROUS_ACTIONS,
            "confirmation_timeout_seconds": cls.CONFIRMATION_TIMEOUT,
            "confirm_phrases": cls.CONFIRM_PHRASES,
            "deny_phrases": cls.DENY_PHRASES,
            "rules": [
                "Destructive actions always require confirmation",
                "Confirmations expire after 60 seconds",
                "Voice or text confirmation accepted",
                "Ambiguous commands trigger clarification",
                "Multiple pending confirmations not allowed"
            ]
        }
