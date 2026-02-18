# Voice Feedback Engine - Text-to-Speech responses using OpenAI TTS
from typing import Dict, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid
import os
import base64
from dotenv import load_dotenv

load_dotenv()


class TTSVoice(str, Enum):
    ALLOY = "alloy"       # Neutral, balanced
    ASH = "ash"           # Clear, articulate
    CORAL = "coral"       # Warm, friendly
    ECHO = "echo"         # Smooth, calm
    FABLE = "fable"       # Expressive, storytelling
    NOVA = "nova"         # Energetic, upbeat
    ONYX = "onyx"         # Deep, authoritative
    SAGE = "sage"         # Wise, measured
    SHIMMER = "shimmer"   # Bright, cheerful


class TTSModel(str, Enum):
    TTS_1 = "tts-1"       # Standard quality, faster
    TTS_1_HD = "tts-1-hd" # HD quality, slower


class AudioFormat(str, Enum):
    MP3 = "mp3"
    OPUS = "opus"
    AAC = "aac"
    FLAC = "flac"
    WAV = "wav"
    PCM = "pcm"


class VoiceFeedbackRequest(BaseModel):
    """Request for voice feedback generation."""
    text: str
    voice: TTSVoice = TTSVoice.NOVA
    model: TTSModel = TTSModel.TTS_1
    speed: float = 1.0
    format: AudioFormat = AudioFormat.MP3


class VoiceFeedbackResult(BaseModel):
    """Result of voice feedback generation."""
    success: bool
    audio_data: Optional[bytes] = None
    audio_base64: Optional[str] = None
    duration_estimate_ms: int = 0
    format: AudioFormat = AudioFormat.MP3
    voice_used: TTSVoice = TTSVoice.NOVA
    message: str = ""
    error: Optional[str] = None


class VoiceFeedbackEngine:
    """
    Voice Feedback Engine converts AI responses to speech using OpenAI TTS.
    
    Responsibilities:
    - Convert AI responses to speech
    - Stream audio back to user
    - Respect user voice/text mode preferences
    - Provide fallback to text if TTS unavailable
    
    TTS Provider: OpenAI TTS via Emergent LLM Key
    
    Rules:
    - Voice output only if enabled by user
    - Text output always available
    - No audio without user permission
    """
    
    # Cache for frequently used responses
    _response_cache: Dict[str, bytes] = {}
    _max_cache_size = 100
    
    # Default settings
    DEFAULT_VOICE = TTSVoice.NOVA
    DEFAULT_MODEL = TTSModel.TTS_1
    DEFAULT_SPEED = 1.0
    DEFAULT_FORMAT = AudioFormat.MP3
    MAX_TEXT_LENGTH = 4096
    
    # Common response templates (for caching)
    COMMON_RESPONSES = [
        "Done! Your screen has been created.",
        "Done! Your page has been created.",
        "I've made those changes for you.",
        "Please say yes to confirm or no to cancel.",
        "Okay, I've cancelled that action.",
    ]
    
    @classmethod
    async def generate_speech(
        cls,
        text: str,
        voice: TTSVoice = DEFAULT_VOICE,
        model: TTSModel = DEFAULT_MODEL,
        speed: float = DEFAULT_SPEED,
        response_format: AudioFormat = DEFAULT_FORMAT
    ) -> VoiceFeedbackResult:
        """
        Generate speech from text using OpenAI TTS.
        
        Args:
            text: Text to convert to speech
            voice: Voice to use
            model: TTS model (tts-1 or tts-1-hd)
            speed: Speech speed (0.25 to 4.0)
            response_format: Audio format
            
        Returns:
            VoiceFeedbackResult with audio data
        """
        # Validate text length
        if len(text) > cls.MAX_TEXT_LENGTH:
            text = text[:cls.MAX_TEXT_LENGTH]
        
        if not text.strip():
            return VoiceFeedbackResult(
                success=False,
                message="No text provided",
                error="Text cannot be empty"
            )
        
        # Validate speed
        speed = max(0.25, min(4.0, speed))
        
        # Check cache first
        cache_key = f"{text}:{voice}:{model}:{speed}:{response_format}"
        if cache_key in cls._response_cache:
            return VoiceFeedbackResult(
                success=True,
                audio_data=cls._response_cache[cache_key],
                audio_base64=base64.b64encode(cls._response_cache[cache_key]).decode(),
                format=response_format,
                voice_used=voice,
                message="Speech generated (cached)"
            )
        
        try:
            from emergentintegrations.llm.openai import OpenAITextToSpeech
            
            api_key = os.getenv("EMERGENT_LLM_KEY")
            if not api_key:
                return VoiceFeedbackResult(
                    success=False,
                    message="TTS not available",
                    error="API key not configured"
                )
            
            tts = OpenAITextToSpeech(api_key=api_key)
            
            audio_bytes = await tts.generate_speech(
                text=text,
                model=model.value,
                voice=voice.value,
                speed=speed,
                response_format=response_format.value
            )
            
            # Cache the result
            cls._cache_response(cache_key, audio_bytes)
            
            # Estimate duration (rough: ~150 words per minute at speed 1.0)
            word_count = len(text.split())
            duration_estimate = int((word_count / 150) * 60 * 1000 / speed)
            
            return VoiceFeedbackResult(
                success=True,
                audio_data=audio_bytes,
                audio_base64=base64.b64encode(audio_bytes).decode(),
                duration_estimate_ms=duration_estimate,
                format=response_format,
                voice_used=voice,
                message="Speech generated successfully"
            )
            
        except ImportError:
            return VoiceFeedbackResult(
                success=False,
                message="TTS library not available",
                error="emergentintegrations not installed"
            )
        except Exception as e:
            return VoiceFeedbackResult(
                success=False,
                message="Failed to generate speech",
                error=str(e)
            )
    
    @classmethod
    async def generate_speech_base64(
        cls,
        text: str,
        voice: TTSVoice = DEFAULT_VOICE,
        model: TTSModel = DEFAULT_MODEL,
        speed: float = DEFAULT_SPEED,
        response_format: AudioFormat = DEFAULT_FORMAT
    ) -> Tuple[Optional[str], Optional[str]]:
        """
        Generate speech and return as base64 string.
        
        Returns:
            Tuple of (base64_audio, error_message)
        """
        result = await cls.generate_speech(text, voice, model, speed, response_format)
        
        if result.success:
            return result.audio_base64, None
        return None, result.error
    
    @classmethod
    def _cache_response(cls, cache_key: str, audio_data: bytes):
        """Cache a TTS response."""
        # Manage cache size
        if len(cls._response_cache) >= cls._max_cache_size:
            # Remove oldest entries (first 10)
            keys_to_remove = list(cls._response_cache.keys())[:10]
            for key in keys_to_remove:
                cls._response_cache.pop(key, None)
        
        cls._response_cache[cache_key] = audio_data
    
    @classmethod
    def clear_cache(cls):
        """Clear the TTS response cache."""
        cls._response_cache.clear()
    
    @classmethod
    def get_available_voices(cls) -> list:
        """Get list of available voices with descriptions."""
        return [
            {"id": TTSVoice.ALLOY.value, "name": "Alloy", "description": "Neutral, balanced"},
            {"id": TTSVoice.ASH.value, "name": "Ash", "description": "Clear, articulate"},
            {"id": TTSVoice.CORAL.value, "name": "Coral", "description": "Warm, friendly"},
            {"id": TTSVoice.ECHO.value, "name": "Echo", "description": "Smooth, calm"},
            {"id": TTSVoice.FABLE.value, "name": "Fable", "description": "Expressive, storytelling"},
            {"id": TTSVoice.NOVA.value, "name": "Nova", "description": "Energetic, upbeat"},
            {"id": TTSVoice.ONYX.value, "name": "Onyx", "description": "Deep, authoritative"},
            {"id": TTSVoice.SAGE.value, "name": "Sage", "description": "Wise, measured"},
            {"id": TTSVoice.SHIMMER.value, "name": "Shimmer", "description": "Bright, cheerful"},
        ]
    
    @classmethod
    def get_client_config(cls) -> Dict[str, Any]:
        """Get configuration for client-side voice feedback."""
        return {
            "available_voices": cls.get_available_voices(),
            "available_models": [
                {"id": TTSModel.TTS_1.value, "name": "Standard", "description": "Faster, lower cost"},
                {"id": TTSModel.TTS_1_HD.value, "name": "HD", "description": "Higher quality"},
            ],
            "available_formats": [f.value for f in AudioFormat],
            "speed_range": {"min": 0.25, "max": 4.0, "default": 1.0},
            "max_text_length": cls.MAX_TEXT_LENGTH,
            "default_settings": {
                "voice": cls.DEFAULT_VOICE.value,
                "model": cls.DEFAULT_MODEL.value,
                "speed": cls.DEFAULT_SPEED,
                "format": cls.DEFAULT_FORMAT.value
            }
        }
