# Voice Routes - API endpoints for voice features
from fastapi import APIRouter, HTTPException, Header, UploadFile, File, Form
from fastapi.responses import Response
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional, List
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

from routes.auth import get_current_user
from engines.voice_input_engine import VoiceInputEngine, VoiceInputMode, AudioFormat
from engines.speech_to_intent_engine import SpeechToIntentEngine
from engines.voice_orchestration_engine import VoiceOrchestrationEngine
from engines.voice_feedback_engine import VoiceFeedbackEngine, TTSVoice, TTSModel
from engines.voice_safety_layer import VoiceSafetyLayer
from engines.voice_settings_engine import VoiceSettingsEngine
from engines.credit_engine import CreditEngine

router = APIRouter(prefix="/voice", tags=["Voice"])


class TranscribeResponse(BaseModel):
    success: bool
    text: str = ""
    language: Optional[str] = None
    duration_ms: int = 0
    error: Optional[str] = None


class ProcessCommandRequest(BaseModel):
    text: str
    project_id: Optional[str] = None
    session_id: Optional[str] = None


class SpeakRequest(BaseModel):
    text: str
    voice: Optional[str] = None
    speed: Optional[float] = None


class UpdateSettingsRequest(BaseModel):
    settings: dict


def create_voice_routes(db: AsyncIOMotorDatabase):
    """Create voice routes with database dependency."""
    
    @router.get("/config")
    async def get_voice_config(
        authorization: Optional[str] = Header(None)
    ):
        """Get voice feature configuration for the client."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        return {
            "input": VoiceInputEngine.get_client_config(),
            "feedback": VoiceFeedbackEngine.get_client_config(),
            "supported_commands": SpeechToIntentEngine.get_supported_commands(),
            "safety": VoiceSafetyLayer.get_safety_info()
        }
    
    @router.post("/session/start")
    async def start_voice_session(
        mode: str = "push_to_talk",
        authorization: Optional[str] = Header(None)
    ):
        """Start a new voice input session."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Check if voice input is enabled
        settings = VoiceSettingsEngine.get_settings(user.id)
        if not settings.voice_input_enabled:
            raise HTTPException(status_code=403, detail="Voice input is disabled")
        
        try:
            input_mode = VoiceInputMode(mode)
        except ValueError:
            input_mode = VoiceInputMode.PUSH_TO_TALK
        
        session = VoiceInputEngine.create_session(
            user_id=user.id,
            mode=input_mode
        )
        
        return {
            "session_id": session.session_id,
            "mode": session.mode.value,
            "state": session.state.value,
            "config": VoiceInputEngine.get_client_config()
        }
    
    @router.post("/session/{session_id}/stop")
    async def stop_voice_session(
        session_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Stop and close a voice session."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        session = VoiceInputEngine.get_session(session_id)
        if not session or session.user_id != user.id:
            raise HTTPException(status_code=404, detail="Session not found")
        
        success, message = VoiceInputEngine.close_session(session_id)
        return {"success": success, "message": message}
    
    @router.post("/transcribe")
    async def transcribe_audio(
        audio: UploadFile = File(...),
        session_id: Optional[str] = Form(None),
        language: Optional[str] = Form(None),
        authorization: Optional[str] = Header(None)
    ):
        """Transcribe audio to text using OpenAI Whisper."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Check settings
        settings = VoiceSettingsEngine.get_settings(user.id)
        if not settings.voice_input_enabled:
            raise HTTPException(status_code=403, detail="Voice input is disabled")
        
        # Read audio data
        audio_data = await audio.read()
        
        # Validate audio
        audio_format = AudioFormat.WEBM  # Default, could detect from content-type
        if audio.content_type:
            if "mp3" in audio.content_type:
                audio_format = AudioFormat.MP3
            elif "wav" in audio.content_type:
                audio_format = AudioFormat.WAV
        
        is_valid, error = VoiceInputEngine.validate_audio(audio_data, audio_format)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)
        
        try:
            from emergentintegrations.llm.openai import OpenAISpeechToText
            import io
            
            api_key = os.getenv("EMERGENT_LLM_KEY")
            if not api_key:
                raise HTTPException(status_code=500, detail="STT not configured")
            
            stt = OpenAISpeechToText(api_key=api_key)
            
            # Create file-like object
            audio_file = io.BytesIO(audio_data)
            audio_file.name = f"audio.{audio_format.value}"
            
            response = await stt.transcribe(
                file=audio_file,
                model="whisper-1",
                response_format="json",
                language=language
            )
            
            return TranscribeResponse(
                success=True,
                text=response.text,
                language=language,
                duration_ms=len(audio_data) // 16  # Rough estimate
            )
            
        except ImportError:
            raise HTTPException(status_code=500, detail="STT library not available")
        except Exception as e:
            return TranscribeResponse(
                success=False,
                error=str(e)
            )
    
    @router.post("/process")
    async def process_voice_command(
        request: ProcessCommandRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Process transcribed text as a voice command."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Get user settings
        settings = VoiceSettingsEngine.get_settings(user.id)
        
        # Check for pending confirmation
        pending = VoiceSafetyLayer.get_pending_confirmation(user.id)
        if pending and VoiceSafetyLayer.is_confirmation_response(request.text):
            conf, confirmed, message = VoiceSafetyLayer.process_confirmation_response(
                user.id, request.text
            )
            if conf:
                if confirmed:
                    # Execute the pending command
                    pass  # Would route back to orchestration
                return {
                    "type": "confirmation_response",
                    "confirmed": confirmed,
                    "message": message,
                    "voice_output_enabled": settings.voice_output_enabled
                }
        
        # Extract intent from text
        intent_result = SpeechToIntentEngine.extract_intent(request.text)
        
        if not intent_result.success or not intent_result.intent:
            return {
                "success": False,
                "message": intent_result.message,
                "voice_output_enabled": settings.voice_output_enabled
            }
        
        intent = intent_result.intent
        
        # Check safety
        safety_check = VoiceSafetyLayer.check_safety(
            intent_type=intent.intent_type.value,
            original_command=request.text,
            target_name=intent.target_name
        )
        
        if safety_check.requires_confirmation and not safety_check.is_safe:
            # Create pending confirmation
            VoiceSafetyLayer.create_confirmation(
                user_id=user.id,
                action_type=intent.intent_type.value,
                original_command=request.text,
                prompt=safety_check.confirmation_prompt,
                target_name=intent.target_name
            )
            
            return {
                "type": "confirmation_required",
                "prompt": safety_check.confirmation_prompt,
                "warnings": safety_check.warnings,
                "intent": intent.model_dump(),
                "voice_output_enabled": settings.voice_output_enabled
            }
        
        # Get credits
        user.credits = CreditEngine.check_bonus_refresh(user.credits, user.plan)
        available_credits = CreditEngine.get_total_credits(user.credits)
        
        # Process through orchestration
        result = await VoiceOrchestrationEngine.process_voice_command(
            session_id=request.session_id or "direct",
            user_id=user.id,
            intent_type=intent.intent_type.value,
            original_text=request.text,
            target_name=intent.target_name,
            parameters=intent.parameters,
            project_id=request.project_id,
            available_credits=available_credits,
            voice_output_enabled=settings.voice_output_enabled
        )
        
        # Deduct credits if successful
        if result.success and result.credits_used > 0:
            user.credits, _ = CreditEngine.deduct_credits(user.credits, result.credits_used)
            await db.users.update_one(
                {"id": user.id},
                {"$set": {"credits": user.credits.model_dump()}}
            )
        
        return {
            "success": result.success,
            "type": "command_result",
            "response_text": result.response_text,
            "command": result.command.model_dump() if result.command else None,
            "credits_used": result.credits_used,
            "credits_remaining": CreditEngine.get_total_credits(user.credits),
            "voice_output_enabled": settings.voice_output_enabled,
            "next_action": result.next_action
        }
    
    @router.post("/speak")
    async def generate_speech(
        request: SpeakRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Generate speech from text using OpenAI TTS."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Get user settings
        settings = VoiceSettingsEngine.get_settings(user.id)
        if not settings.voice_output_enabled:
            raise HTTPException(status_code=403, detail="Voice output is disabled")
        
        # Use user's preferred voice if not specified
        voice = request.voice or settings.preferred_voice
        speed = request.speed or settings.speech_speed
        
        try:
            voice_enum = TTSVoice(voice)
        except ValueError:
            voice_enum = TTSVoice.NOVA
        
        result = await VoiceFeedbackEngine.generate_speech(
            text=request.text,
            voice=voice_enum,
            speed=speed
        )
        
        if not result.success:
            raise HTTPException(status_code=500, detail=result.error)
        
        return {
            "success": True,
            "audio_base64": result.audio_base64,
            "format": result.format.value,
            "voice": result.voice_used.value,
            "duration_estimate_ms": result.duration_estimate_ms
        }
    
    @router.post("/speak/stream")
    async def generate_speech_stream(
        request: SpeakRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Generate speech and return as audio stream."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        settings = VoiceSettingsEngine.get_settings(user.id)
        if not settings.voice_output_enabled:
            raise HTTPException(status_code=403, detail="Voice output is disabled")
        
        voice = request.voice or settings.preferred_voice
        speed = request.speed or settings.speech_speed
        
        try:
            voice_enum = TTSVoice(voice)
        except ValueError:
            voice_enum = TTSVoice.NOVA
        
        result = await VoiceFeedbackEngine.generate_speech(
            text=request.text,
            voice=voice_enum,
            speed=speed
        )
        
        if not result.success or not result.audio_data:
            raise HTTPException(status_code=500, detail=result.error or "Failed to generate audio")
        
        return Response(
            content=result.audio_data,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=speech.mp3"
            }
        )
    
    @router.get("/settings")
    async def get_voice_settings(
        authorization: Optional[str] = Header(None)
    ):
        """Get user's voice settings."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        settings = VoiceSettingsEngine.get_settings(user.id)
        schema = VoiceSettingsEngine.get_settings_schema()
        
        return {
            "settings": VoiceSettingsEngine.export_settings(user.id),
            "schema": schema
        }
    
    @router.put("/settings")
    async def update_voice_settings(
        request: UpdateSettingsRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Update user's voice settings."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        settings, errors = VoiceSettingsEngine.update_settings(user.id, request.settings)
        
        if errors:
            raise HTTPException(status_code=400, detail={"errors": errors})
        
        return {
            "success": True,
            "settings": VoiceSettingsEngine.export_settings(user.id)
        }
    
    @router.post("/settings/toggle")
    async def toggle_voice_mode(
        authorization: Optional[str] = Header(None)
    ):
        """Toggle voice mode on/off."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        settings = VoiceSettingsEngine.toggle_voice_mode(user.id)
        
        return {
            "success": True,
            "voice_mode": settings.voice_mode.value,
            "voice_input_enabled": settings.voice_input_enabled,
            "voice_output_enabled": settings.voice_output_enabled
        }
    
    @router.get("/commands")
    async def get_supported_commands(
        authorization: Optional[str] = Header(None)
    ):
        """Get list of supported voice commands."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        return {
            "commands": SpeechToIntentEngine.get_supported_commands()
        }
    
    @router.get("/voices")
    async def get_available_voices(
        authorization: Optional[str] = Header(None)
    ):
        """Get list of available TTS voices."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        return {
            "voices": VoiceFeedbackEngine.get_available_voices()
        }
    
    return router
