# Voice Input Engine - Capture and manage voice input from users
from typing import Dict, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class VoiceInputMode(str, Enum):
    PUSH_TO_TALK = "push_to_talk"
    HOLD_TO_RECORD = "hold_to_record"
    CONTINUOUS_LISTENING = "continuous_listening"


class RecordingState(str, Enum):
    IDLE = "idle"
    LISTENING = "listening"
    PROCESSING = "processing"
    ERROR = "error"


class AudioFormat(str, Enum):
    WEBM = "webm"
    MP3 = "mp3"
    WAV = "wav"
    M4A = "m4a"
    OGG = "ogg"


class VoiceSession(BaseModel):
    """Active voice recording session."""
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    mode: VoiceInputMode = VoiceInputMode.PUSH_TO_TALK
    state: RecordingState = RecordingState.IDLE
    started_at: Optional[datetime] = None
    duration_ms: int = 0
    audio_format: AudioFormat = AudioFormat.WEBM
    sample_rate: int = 16000
    channels: int = 1


class VoiceInputResult(BaseModel):
    """Result of voice input processing."""
    success: bool
    session_id: str
    audio_data: Optional[bytes] = None
    duration_ms: int = 0
    format: AudioFormat = AudioFormat.WEBM
    message: str = ""
    error: Optional[str] = None


class VoiceInputEngine:
    """
    Voice Input Engine manages microphone capture and audio processing.
    
    Responsibilities:
    - Capture microphone audio
    - Stream audio to STT processor
    - Handle start/stop listening events
    - Provide real-time transcription feedback
    - Support push-to-talk and continuous modes
    
    Rules:
    - No recording without user action
    - No background listening
    - User can cancel recording at any time
    - Respect browser permissions
    """
    
    # Active sessions
    _sessions: Dict[str, VoiceSession] = {}
    
    # Configuration limits
    MAX_RECORDING_DURATION_MS = 120000  # 2 minutes max
    MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB (Whisper limit)
    SUPPORTED_FORMATS = [AudioFormat.WEBM, AudioFormat.MP3, AudioFormat.WAV, AudioFormat.M4A]
    
    @classmethod
    def create_session(
        cls,
        user_id: str,
        mode: VoiceInputMode = VoiceInputMode.PUSH_TO_TALK,
        audio_format: AudioFormat = AudioFormat.WEBM
    ) -> VoiceSession:
        """Create a new voice input session."""
        session = VoiceSession(
            user_id=user_id,
            mode=mode,
            state=RecordingState.IDLE,
            audio_format=audio_format
        )
        cls._sessions[session.session_id] = session
        return session
    
    @classmethod
    def get_session(cls, session_id: str) -> Optional[VoiceSession]:
        """Get an active session by ID."""
        return cls._sessions.get(session_id)
    
    @classmethod
    def start_recording(cls, session_id: str) -> Tuple[bool, str]:
        """Start recording for a session."""
        session = cls._sessions.get(session_id)
        if not session:
            return False, "Session not found"
        
        if session.state == RecordingState.LISTENING:
            return False, "Already recording"
        
        session.state = RecordingState.LISTENING
        session.started_at = datetime.now(timezone.utc)
        session.duration_ms = 0
        
        return True, "Recording started"
    
    @classmethod
    def stop_recording(cls, session_id: str, duration_ms: int = 0) -> Tuple[bool, str]:
        """Stop recording for a session."""
        session = cls._sessions.get(session_id)
        if not session:
            return False, "Session not found"
        
        if session.state != RecordingState.LISTENING:
            return False, "Not currently recording"
        
        session.state = RecordingState.PROCESSING
        session.duration_ms = duration_ms
        
        return True, "Recording stopped"
    
    @classmethod
    def cancel_recording(cls, session_id: str) -> Tuple[bool, str]:
        """Cancel an active recording."""
        session = cls._sessions.get(session_id)
        if not session:
            return False, "Session not found"
        
        session.state = RecordingState.IDLE
        session.started_at = None
        session.duration_ms = 0
        
        return True, "Recording cancelled"
    
    @classmethod
    def complete_processing(cls, session_id: str) -> Tuple[bool, str]:
        """Mark session processing as complete."""
        session = cls._sessions.get(session_id)
        if not session:
            return False, "Session not found"
        
        session.state = RecordingState.IDLE
        return True, "Processing complete"
    
    @classmethod
    def set_error(cls, session_id: str, error: str) -> Tuple[bool, str]:
        """Set session to error state."""
        session = cls._sessions.get(session_id)
        if not session:
            return False, "Session not found"
        
        session.state = RecordingState.ERROR
        return True, error
    
    @classmethod
    def close_session(cls, session_id: str) -> Tuple[bool, str]:
        """Close and remove a session."""
        if session_id in cls._sessions:
            del cls._sessions[session_id]
            return True, "Session closed"
        return False, "Session not found"
    
    @classmethod
    def validate_audio(
        cls,
        audio_data: bytes,
        audio_format: AudioFormat
    ) -> Tuple[bool, Optional[str]]:
        """Validate audio data before processing."""
        # Check format
        if audio_format not in cls.SUPPORTED_FORMATS:
            return False, f"Unsupported format: {audio_format}. Use: {[f.value for f in cls.SUPPORTED_FORMATS]}"
        
        # Check size
        if len(audio_data) > cls.MAX_FILE_SIZE_BYTES:
            return False, f"Audio too large ({len(audio_data)} bytes). Max: {cls.MAX_FILE_SIZE_BYTES} bytes"
        
        # Check not empty
        if len(audio_data) < 1000:  # Less than 1KB is likely invalid
            return False, "Audio data too small - likely invalid recording"
        
        return True, None
    
    @classmethod
    def get_active_sessions(cls, user_id: str) -> list:
        """Get all active sessions for a user."""
        return [
            s for s in cls._sessions.values()
            if s.user_id == user_id and s.state != RecordingState.IDLE
        ]
    
    @classmethod
    def get_client_config(cls) -> Dict[str, Any]:
        """Get configuration for client-side voice input."""
        return {
            "supported_modes": [m.value for m in VoiceInputMode],
            "supported_formats": [f.value for f in cls.SUPPORTED_FORMATS],
            "max_duration_ms": cls.MAX_RECORDING_DURATION_MS,
            "max_file_size_bytes": cls.MAX_FILE_SIZE_BYTES,
            "recommended_settings": {
                "sample_rate": 16000,
                "channels": 1,
                "format": AudioFormat.WEBM.value,
                "mime_type": "audio/webm;codecs=opus"
            }
        }
