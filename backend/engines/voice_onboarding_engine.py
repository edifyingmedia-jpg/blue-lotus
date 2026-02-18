# Voice Onboarding Engine - Voice-driven onboarding flow
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class OnboardingStepId(str, Enum):
    WELCOME = "welcome_voice"
    PROJECT_TYPE = "project_type_voice"
    PROJECT_DESCRIPTION = "project_description_voice"
    STRUCTURE_READY = "structure_ready_voice"


class InputMode(str, Enum):
    VOICE = "voice"
    TEXT = "text"


class OnboardingStep(BaseModel):
    """Voice onboarding step definition."""
    id: OnboardingStepId
    title: str
    message: str  # What the AI says
    voice_message: str  # TTS-optimized version
    input_modes: List[InputMode] = [InputMode.VOICE, InputMode.TEXT]
    expected_responses: List[str] = []
    next_step: Optional[OnboardingStepId] = None
    is_final: bool = False


class OnboardingSession(BaseModel):
    """User's voice onboarding session."""
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    current_step: OnboardingStepId = OnboardingStepId.WELCOME
    input_mode: InputMode = InputMode.VOICE
    responses: Dict[str, Any] = {}
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed: bool = False


class VoiceOnboardingEngine:
    """
    Voice-Driven Onboarding Flow Engine.
    
    Responsibilities:
    - Guide new users through onboarding using voice prompts
    - Allow users to respond via speech or text
    - Provide spoken explanations of features
    - Support hands-free onboarding
    
    Steps:
    1. Welcome - Choose voice or text mode
    2. Project Type - App, website, or both
    3. Project Description - Describe the project
    4. Structure Ready - Review generated structure
    
    Rules:
    - Fallback to text if voice unavailable
    - TTS enabled if user selected voice mode
    """
    
    # Active sessions
    _sessions: Dict[str, OnboardingSession] = {}
    
    # Step definitions
    STEPS = {
        OnboardingStepId.WELCOME: OnboardingStep(
            id=OnboardingStepId.WELCOME,
            title="Welcome to Blue Lotus",
            message="Welcome to Blue Lotus! I'm your AI assistant. Would you like to set up your first project using your voice, or would you prefer to type?",
            voice_message="Welcome to Blue Lotus! I'm your AI assistant. Would you like to set up your first project using your voice, or would you prefer to type? Say voice or text.",
            expected_responses=["voice", "text", "speak", "type"],
            next_step=OnboardingStepId.PROJECT_TYPE
        ),
        OnboardingStepId.PROJECT_TYPE: OnboardingStep(
            id=OnboardingStepId.PROJECT_TYPE,
            title="Choose Project Type",
            message="What type of project would you like to create? You can choose:\n• **App** - Mobile or desktop application\n• **Website** - Marketing or content site\n• **Both** - Full platform with app and website",
            voice_message="What type of project would you like to create? You can say: app, for a mobile or desktop application. Website, for a marketing site. Or both, for a full platform.",
            expected_responses=["app", "website", "both", "application", "site"],
            next_step=OnboardingStepId.PROJECT_DESCRIPTION
        ),
        OnboardingStepId.PROJECT_DESCRIPTION: OnboardingStep(
            id=OnboardingStepId.PROJECT_DESCRIPTION,
            title="Describe Your Project",
            message="Please describe your project. Speak naturally - tell me what you want to build, who it's for, and any key features you need. I'll generate the structure for you.",
            voice_message="Please describe your project. Speak naturally and tell me what you want to build. I'll listen and generate the perfect structure for you.",
            expected_responses=[],  # Free-form input
            next_step=OnboardingStepId.STRUCTURE_READY
        ),
        OnboardingStepId.STRUCTURE_READY: OnboardingStep(
            id=OnboardingStepId.STRUCTURE_READY,
            title="Your Project Structure",
            message="Your project structure is ready! I've created screens, pages, data models, and flows based on your description. Would you like me to walk you through it?",
            voice_message="Your project structure is ready! I've created everything based on your description. Would you like me to explain what I built? Say yes to hear a walkthrough, or say start building to begin.",
            expected_responses=["yes", "no", "explain", "walkthrough", "start", "build"],
            is_final=True
        )
    }
    
    # Response interpretations
    RESPONSE_MAPPINGS = {
        OnboardingStepId.WELCOME: {
            "voice": ["voice", "speak", "talking", "speech", "verbal"],
            "text": ["text", "type", "typing", "keyboard", "written"]
        },
        OnboardingStepId.PROJECT_TYPE: {
            "app": ["app", "application", "mobile", "desktop", "native"],
            "website": ["website", "site", "web", "page", "pages", "marketing"],
            "both": ["both", "all", "everything", "full", "complete", "platform"]
        },
        OnboardingStepId.STRUCTURE_READY: {
            "walkthrough": ["yes", "explain", "walkthrough", "show", "tell", "please"],
            "start": ["no", "skip", "start", "build", "begin", "go"]
        }
    }
    
    @classmethod
    def create_session(cls, user_id: str, input_mode: InputMode = InputMode.VOICE) -> OnboardingSession:
        """Create a new onboarding session."""
        session = OnboardingSession(
            user_id=user_id,
            input_mode=input_mode
        )
        cls._sessions[session.session_id] = session
        return session
    
    @classmethod
    def get_session(cls, session_id: str) -> Optional[OnboardingSession]:
        """Get an onboarding session."""
        return cls._sessions.get(session_id)
    
    @classmethod
    def get_current_step(cls, session_id: str) -> Optional[OnboardingStep]:
        """Get the current step for a session."""
        session = cls._sessions.get(session_id)
        if not session:
            return None
        return cls.STEPS.get(session.current_step)
    
    @classmethod
    def process_response(
        cls,
        session_id: str,
        response: str,
        was_voice: bool = True
    ) -> Tuple[bool, Dict[str, Any]]:
        """
        Process user's response to current step.
        
        Returns:
            Tuple of (success, result_dict)
        """
        session = cls._sessions.get(session_id)
        if not session:
            return False, {"error": "Session not found"}
        
        current_step = cls.STEPS.get(session.current_step)
        if not current_step:
            return False, {"error": "Invalid step"}
        
        response_lower = response.lower().strip()
        
        # Interpret the response
        interpreted = cls._interpret_response(session.current_step, response_lower)
        
        # Store response
        session.responses[current_step.id.value] = {
            "raw": response,
            "interpreted": interpreted,
            "was_voice": was_voice,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Handle step-specific logic
        if current_step.id == OnboardingStepId.WELCOME:
            if interpreted == "voice":
                session.input_mode = InputMode.VOICE
            else:
                session.input_mode = InputMode.TEXT
        
        # Move to next step
        if current_step.next_step:
            session.current_step = current_step.next_step
            next_step_obj = cls.STEPS.get(current_step.next_step)
            
            return True, {
                "next_step": next_step_obj.model_dump() if next_step_obj else None,
                "interpreted": interpreted,
                "session": session.model_dump()
            }
        else:
            # Final step
            session.completed = True
            return True, {
                "completed": True,
                "interpreted": interpreted,
                "responses": session.responses,
                "session": session.model_dump()
            }
    
    @classmethod
    def _interpret_response(cls, step_id: OnboardingStepId, response: str) -> str:
        """Interpret user response for a step."""
        mappings = cls.RESPONSE_MAPPINGS.get(step_id, {})
        
        for category, keywords in mappings.items():
            if any(kw in response for kw in keywords):
                return category
        
        # For free-form steps, return the original response
        return response
    
    @classmethod
    def get_step_prompt(
        cls,
        step_id: OnboardingStepId,
        use_voice: bool = True
    ) -> Dict[str, str]:
        """Get the prompt for a step."""
        step = cls.STEPS.get(step_id)
        if not step:
            return {}
        
        return {
            "text": step.message,
            "voice": step.voice_message if use_voice else None,
            "title": step.title
        }
    
    @classmethod
    def generate_walkthrough(cls, project_type: str, description: str) -> Dict[str, Any]:
        """Generate a walkthrough explanation of the created structure."""
        # This would be generated by AI in production
        structure = {
            "screens": [],
            "pages": [],
            "data_models": [],
            "flows": []
        }
        
        if project_type in ["app", "both"]:
            structure["screens"] = [
                {"name": "Home", "description": "Main dashboard showing key information"},
                {"name": "Profile", "description": "User profile and settings"},
                {"name": "Activity", "description": "Recent activity and notifications"}
            ]
        
        if project_type in ["website", "both"]:
            structure["pages"] = [
                {"name": "Landing", "description": "Marketing hero with call-to-action"},
                {"name": "Features", "description": "Product features showcase"},
                {"name": "Pricing", "description": "Pricing plans and comparison"}
            ]
        
        structure["data_models"] = [
            {"name": "User", "fields": ["id", "name", "email", "avatar"]}
        ]
        
        structure["flows"] = [
            {"name": "Onboarding", "steps": ["Welcome", "Setup", "Complete"]}
        ]
        
        # Generate voice-friendly walkthrough
        walkthrough_text = f"I've created your {project_type} with the following structure: "
        
        if structure["screens"]:
            walkthrough_text += f"{len(structure['screens'])} app screens including {', '.join(s['name'] for s in structure['screens'])}. "
        
        if structure["pages"]:
            walkthrough_text += f"{len(structure['pages'])} website pages including {', '.join(p['name'] for p in structure['pages'])}. "
        
        walkthrough_text += f"I also set up a User data model and an Onboarding flow to get you started."
        
        return {
            "structure": structure,
            "walkthrough_text": walkthrough_text,
            "walkthrough_voice": walkthrough_text
        }
    
    @classmethod
    def get_onboarding_config(cls) -> Dict[str, Any]:
        """Get configuration for client-side onboarding."""
        return {
            "steps": [
                {
                    "id": step.id.value,
                    "title": step.title,
                    "message": step.message,
                    "voice_message": step.voice_message,
                    "input_modes": [m.value for m in step.input_modes],
                    "is_final": step.is_final
                }
                for step in cls.STEPS.values()
            ],
            "total_steps": len(cls.STEPS),
            "supports_voice": True,
            "supports_text": True
        }
