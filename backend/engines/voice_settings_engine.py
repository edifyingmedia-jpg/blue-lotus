# Voice Settings Engine - User preferences for voice features
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone


class VoiceMode(str, Enum):
    VOICE_ON = "voice_on"                    # Full voice input and output
    VOICE_OFF = "voice_off"                  # No voice features
    VOICE_INPUT_ONLY = "voice_input_only"    # Voice input, text output
    VOICE_OUTPUT_ONLY = "voice_output_only"  # Text input, voice output


class InputMode(str, Enum):
    PUSH_TO_TALK = "push_to_talk"
    HOLD_TO_RECORD = "hold_to_record"
    CONTINUOUS = "continuous"


class VoiceUserSettings(BaseModel):
    """User's voice feature settings."""
    user_id: str
    voice_mode: VoiceMode = VoiceMode.VOICE_ON
    voice_input_enabled: bool = True
    voice_output_enabled: bool = True
    input_mode: InputMode = InputMode.PUSH_TO_TALK
    preferred_voice: str = "nova"
    speech_speed: float = 1.0
    auto_send_on_silence: bool = True
    silence_threshold_ms: int = 1500
    show_transcription: bool = True
    play_sound_effects: bool = True
    microphone_device_id: Optional[str] = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class VoiceSettingsEngine:
    """
    Voice Settings Engine manages user voice preferences.
    
    Responsibilities:
    - Store user voice preferences
    - Enable/disable voice input
    - Enable/disable voice output
    - Manage microphone permissions
    - Manage TTS preferences
    
    Settings:
    - voice_input_enabled: true/false
    - voice_output_enabled: true/false
    - default_mode: voice_on/voice_off/voice_input_only/voice_output_only
    - user_override_allowed: true
    """
    
    # Settings storage (in-memory, will be DB-backed)
    _settings: Dict[str, VoiceUserSettings] = {}
    
    # Default settings
    DEFAULT_SETTINGS = {
        "voice_mode": VoiceMode.VOICE_ON,
        "voice_input_enabled": True,
        "voice_output_enabled": True,
        "input_mode": InputMode.PUSH_TO_TALK,
        "preferred_voice": "nova",
        "speech_speed": 1.0,
        "auto_send_on_silence": True,
        "silence_threshold_ms": 1500,
        "show_transcription": True,
        "play_sound_effects": True,
    }
    
    # Available voices
    AVAILABLE_VOICES = [
        "alloy", "ash", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer"
    ]
    
    @classmethod
    def get_settings(cls, user_id: str) -> VoiceUserSettings:
        """Get voice settings for a user, creating defaults if needed."""
        if user_id not in cls._settings:
            cls._settings[user_id] = VoiceUserSettings(
                user_id=user_id,
                **cls.DEFAULT_SETTINGS
            )
        return cls._settings[user_id]
    
    @classmethod
    def update_settings(
        cls,
        user_id: str,
        updates: Dict[str, Any]
    ) -> Tuple[VoiceUserSettings, List[str]]:
        """
        Update voice settings for a user.
        
        Args:
            user_id: User ID
            updates: Dictionary of settings to update
            
        Returns:
            Tuple of (updated_settings, validation_errors)
        """
        settings = cls.get_settings(user_id)
        errors = []
        
        for key, value in updates.items():
            # Validate and apply each setting
            if key == "voice_mode":
                try:
                    settings.voice_mode = VoiceMode(value)
                    # Update derived settings
                    settings.voice_input_enabled = value in [VoiceMode.VOICE_ON.value, VoiceMode.VOICE_INPUT_ONLY.value]
                    settings.voice_output_enabled = value in [VoiceMode.VOICE_ON.value, VoiceMode.VOICE_OUTPUT_ONLY.value]
                except ValueError:
                    errors.append(f"Invalid voice_mode: {value}")
                    
            elif key == "voice_input_enabled":
                if isinstance(value, bool):
                    settings.voice_input_enabled = value
                else:
                    errors.append("voice_input_enabled must be boolean")
                    
            elif key == "voice_output_enabled":
                if isinstance(value, bool):
                    settings.voice_output_enabled = value
                else:
                    errors.append("voice_output_enabled must be boolean")
                    
            elif key == "input_mode":
                try:
                    settings.input_mode = InputMode(value)
                except ValueError:
                    errors.append(f"Invalid input_mode: {value}")
                    
            elif key == "preferred_voice":
                if value in cls.AVAILABLE_VOICES:
                    settings.preferred_voice = value
                else:
                    errors.append(f"Invalid voice: {value}. Available: {cls.AVAILABLE_VOICES}")
                    
            elif key == "speech_speed":
                if isinstance(value, (int, float)) and 0.25 <= value <= 4.0:
                    settings.speech_speed = float(value)
                else:
                    errors.append("speech_speed must be between 0.25 and 4.0")
                    
            elif key == "auto_send_on_silence":
                if isinstance(value, bool):
                    settings.auto_send_on_silence = value
                else:
                    errors.append("auto_send_on_silence must be boolean")
                    
            elif key == "silence_threshold_ms":
                if isinstance(value, int) and 500 <= value <= 5000:
                    settings.silence_threshold_ms = value
                else:
                    errors.append("silence_threshold_ms must be between 500 and 5000")
                    
            elif key == "show_transcription":
                if isinstance(value, bool):
                    settings.show_transcription = value
                else:
                    errors.append("show_transcription must be boolean")
                    
            elif key == "play_sound_effects":
                if isinstance(value, bool):
                    settings.play_sound_effects = value
                else:
                    errors.append("play_sound_effects must be boolean")
                    
            elif key == "microphone_device_id":
                settings.microphone_device_id = value if value else None
                
            else:
                errors.append(f"Unknown setting: {key}")
        
        if not errors:
            settings.updated_at = datetime.now(timezone.utc)
        
        return settings, errors
    
    @classmethod
    def reset_to_defaults(cls, user_id: str) -> VoiceUserSettings:
        """Reset user's voice settings to defaults."""
        cls._settings[user_id] = VoiceUserSettings(
            user_id=user_id,
            **cls.DEFAULT_SETTINGS
        )
        return cls._settings[user_id]
    
    @classmethod
    def toggle_voice_mode(cls, user_id: str) -> VoiceUserSettings:
        """Toggle between voice_on and voice_off."""
        settings = cls.get_settings(user_id)
        
        if settings.voice_mode == VoiceMode.VOICE_ON:
            settings.voice_mode = VoiceMode.VOICE_OFF
            settings.voice_input_enabled = False
            settings.voice_output_enabled = False
        else:
            settings.voice_mode = VoiceMode.VOICE_ON
            settings.voice_input_enabled = True
            settings.voice_output_enabled = True
        
        settings.updated_at = datetime.now(timezone.utc)
        return settings
    
    @classmethod
    def is_voice_input_enabled(cls, user_id: str) -> bool:
        """Check if voice input is enabled for a user."""
        return cls.get_settings(user_id).voice_input_enabled
    
    @classmethod
    def is_voice_output_enabled(cls, user_id: str) -> bool:
        """Check if voice output is enabled for a user."""
        return cls.get_settings(user_id).voice_output_enabled
    
    @classmethod
    def get_settings_schema(cls) -> Dict[str, Any]:
        """Get the settings schema for UI rendering."""
        return {
            "voice_mode": {
                "type": "select",
                "label": "Voice Mode",
                "description": "Control how voice features work",
                "options": [
                    {"value": VoiceMode.VOICE_ON.value, "label": "Voice On (Input & Output)"},
                    {"value": VoiceMode.VOICE_OFF.value, "label": "Voice Off"},
                    {"value": VoiceMode.VOICE_INPUT_ONLY.value, "label": "Voice Input Only"},
                    {"value": VoiceMode.VOICE_OUTPUT_ONLY.value, "label": "Voice Output Only"},
                ],
                "default": cls.DEFAULT_SETTINGS["voice_mode"].value
            },
            "input_mode": {
                "type": "select",
                "label": "Input Mode",
                "description": "How to activate voice recording",
                "options": [
                    {"value": InputMode.PUSH_TO_TALK.value, "label": "Push to Talk"},
                    {"value": InputMode.HOLD_TO_RECORD.value, "label": "Hold to Record"},
                    {"value": InputMode.CONTINUOUS.value, "label": "Continuous Listening"},
                ],
                "default": cls.DEFAULT_SETTINGS["input_mode"].value
            },
            "preferred_voice": {
                "type": "select",
                "label": "AI Voice",
                "description": "Voice for AI responses",
                "options": [
                    {"value": v, "label": v.title()} for v in cls.AVAILABLE_VOICES
                ],
                "default": cls.DEFAULT_SETTINGS["preferred_voice"]
            },
            "speech_speed": {
                "type": "slider",
                "label": "Speech Speed",
                "description": "Speed of AI voice responses",
                "min": 0.25,
                "max": 4.0,
                "step": 0.25,
                "default": cls.DEFAULT_SETTINGS["speech_speed"]
            },
            "auto_send_on_silence": {
                "type": "toggle",
                "label": "Auto-send on Silence",
                "description": "Automatically send when you stop speaking",
                "default": cls.DEFAULT_SETTINGS["auto_send_on_silence"]
            },
            "silence_threshold_ms": {
                "type": "slider",
                "label": "Silence Threshold",
                "description": "How long to wait before auto-sending (ms)",
                "min": 500,
                "max": 5000,
                "step": 250,
                "default": cls.DEFAULT_SETTINGS["silence_threshold_ms"]
            },
            "show_transcription": {
                "type": "toggle",
                "label": "Show Transcription",
                "description": "Display text while speaking",
                "default": cls.DEFAULT_SETTINGS["show_transcription"]
            },
            "play_sound_effects": {
                "type": "toggle",
                "label": "Sound Effects",
                "description": "Play sounds for recording start/stop",
                "default": cls.DEFAULT_SETTINGS["play_sound_effects"]
            }
        }
    
    @classmethod
    def export_settings(cls, user_id: str) -> Dict[str, Any]:
        """Export user's voice settings."""
        settings = cls.get_settings(user_id)
        return {
            "voice_mode": settings.voice_mode.value,
            "voice_input_enabled": settings.voice_input_enabled,
            "voice_output_enabled": settings.voice_output_enabled,
            "input_mode": settings.input_mode.value,
            "preferred_voice": settings.preferred_voice,
            "speech_speed": settings.speech_speed,
            "auto_send_on_silence": settings.auto_send_on_silence,
            "silence_threshold_ms": settings.silence_threshold_ms,
            "show_transcription": settings.show_transcription,
            "play_sound_effects": settings.play_sound_effects,
        }
    
    @classmethod
    def import_settings(cls, user_id: str, data: Dict[str, Any]) -> Tuple[VoiceUserSettings, List[str]]:
        """Import voice settings for a user."""
        return cls.update_settings(user_id, data)
