# Speech-to-Intent Engine - Convert transcribed speech to actionable intents
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import re


class VoiceIntentType(str, Enum):
    CREATE_SCREEN = "create_screen"
    CREATE_PAGE = "create_page"
    GENERATE_FLOW = "generate_flow"
    MODIFY_NAVIGATION = "modify_navigation"
    UPDATE_DATA_MODEL = "update_data_model"
    REFINE_CONTENT = "refine_content"
    EXPLAIN_PROJECT = "explain_project"
    ASK_FOR_HELP = "ask_for_help"
    DELETE_SCREEN = "delete_screen"
    DELETE_PAGE = "delete_page"
    DELETE_DATA_MODEL = "delete_data_model"
    UNKNOWN = "unknown"


class IntentConfidence(str, Enum):
    HIGH = "high"       # > 0.8
    MEDIUM = "medium"   # 0.5 - 0.8
    LOW = "low"         # < 0.5


class ExtractedIntent(BaseModel):
    """Structured intent extracted from speech."""
    intent_type: VoiceIntentType
    confidence: float
    confidence_level: IntentConfidence
    target_name: Optional[str] = None
    parameters: Dict[str, Any] = {}
    original_text: str
    requires_confirmation: bool = False
    clarification_needed: bool = False
    clarification_message: Optional[str] = None


class SpeechToIntentResult(BaseModel):
    """Result of speech-to-intent processing."""
    success: bool
    intent: Optional[ExtractedIntent] = None
    alternatives: List[ExtractedIntent] = []
    message: str
    credits_required: int = 0


class SpeechToIntentEngine:
    """
    Speech-to-Intent Engine interprets spoken instructions.
    
    Responsibilities:
    - Interpret spoken instructions
    - Extract actionable intent
    - Map voice commands to AI Instruction Engine
    - Handle natural, conversational phrasing
    - Detect multi-step instructions
    
    Rules:
    - Must confirm destructive actions
    - Must respect credit engine
    - Must respect plan enforcement
    - Never execute ambiguous commands without clarification
    """
    
    # Intent patterns - keywords that map to intents
    INTENT_PATTERNS = {
        VoiceIntentType.CREATE_SCREEN: [
            r"create\s+(?:a\s+)?(?:new\s+)?screen",
            r"add\s+(?:a\s+)?(?:new\s+)?screen",
            r"build\s+(?:a\s+)?(?:new\s+)?screen",
            r"make\s+(?:a\s+)?(?:new\s+)?screen",
            r"generate\s+(?:a\s+)?(?:new\s+)?screen",
            r"(?:dashboard|profile|settings|login|signup|home)\s+screen",
        ],
        VoiceIntentType.CREATE_PAGE: [
            r"create\s+(?:a\s+)?(?:new\s+)?page",
            r"add\s+(?:a\s+)?(?:new\s+)?page",
            r"build\s+(?:a\s+)?(?:new\s+)?page",
            r"make\s+(?:a\s+)?(?:new\s+)?page",
            r"generate\s+(?:a\s+)?(?:new\s+)?page",
            r"(?:landing|about|contact|pricing|blog)\s+page",
        ],
        VoiceIntentType.GENERATE_FLOW: [
            r"create\s+(?:a\s+)?(?:new\s+)?flow",
            r"generate\s+(?:a\s+)?(?:new\s+)?flow",
            r"build\s+(?:a\s+)?(?:new\s+)?flow",
            r"(?:checkout|onboarding|authentication|signup|login)\s+flow",
            r"(?:with\s+)?(\d+)\s+steps?",
        ],
        VoiceIntentType.MODIFY_NAVIGATION: [
            r"connect\s+(?:this\s+)?button",
            r"link\s+(?:this\s+)?(?:screen|page)",
            r"add\s+(?:a\s+)?(?:navigation|nav|menu)",
            r"(?:go\s+to|navigate\s+to)",
            r"connect.*to.*(?:screen|page|dashboard)",
        ],
        VoiceIntentType.UPDATE_DATA_MODEL: [
            r"add\s+(?:a\s+)?(?:new\s+)?(?:data\s+)?model",
            r"create\s+(?:a\s+)?(?:new\s+)?(?:data\s+)?model",
            r"add\s+(?:a\s+)?field",
            r"(?:called|named)\s+\w+\s+with",
            r"(?:name|price|email|image|photo|text|number|date)\s+(?:field|fields)",
        ],
        VoiceIntentType.REFINE_CONTENT: [
            r"change\s+(?:the\s+)?",
            r"update\s+(?:the\s+)?",
            r"modify\s+(?:the\s+)?",
            r"edit\s+(?:the\s+)?",
            r"make\s+(?:it\s+)?(?:bigger|smaller|darker|lighter|blue|red)",
        ],
        VoiceIntentType.EXPLAIN_PROJECT: [
            r"explain\s+(?:this\s+)?(?:project)?",
            r"what\s+does\s+this",
            r"describe\s+(?:this\s+)?(?:project)?",
            r"tell\s+me\s+about",
            r"how\s+does\s+this\s+work",
        ],
        VoiceIntentType.ASK_FOR_HELP: [
            r"help\s+(?:me)?",
            r"how\s+(?:do\s+i|can\s+i)",
            r"what\s+(?:can\s+i|should\s+i)",
            r"i\s+(?:don't\s+know|need\s+help)",
            r"show\s+me\s+how",
        ],
        VoiceIntentType.DELETE_SCREEN: [
            r"delete\s+(?:the\s+)?(?:this\s+)?screen",
            r"remove\s+(?:the\s+)?(?:this\s+)?screen",
        ],
        VoiceIntentType.DELETE_PAGE: [
            r"delete\s+(?:the\s+)?(?:this\s+)?page",
            r"remove\s+(?:the\s+)?(?:this\s+)?page",
        ],
        VoiceIntentType.DELETE_DATA_MODEL: [
            r"delete\s+(?:the\s+)?(?:this\s+)?(?:data\s+)?model",
            r"remove\s+(?:the\s+)?(?:this\s+)?(?:data\s+)?model",
        ],
    }
    
    # Destructive intents requiring confirmation
    DESTRUCTIVE_INTENTS = [
        VoiceIntentType.DELETE_SCREEN,
        VoiceIntentType.DELETE_PAGE,
        VoiceIntentType.DELETE_DATA_MODEL,
    ]
    
    # Credit costs by intent
    CREDIT_COSTS = {
        VoiceIntentType.CREATE_SCREEN: 3,
        VoiceIntentType.CREATE_PAGE: 5,
        VoiceIntentType.GENERATE_FLOW: 8,
        VoiceIntentType.MODIFY_NAVIGATION: 1,
        VoiceIntentType.UPDATE_DATA_MODEL: 2,
        VoiceIntentType.REFINE_CONTENT: 1,
        VoiceIntentType.EXPLAIN_PROJECT: 0,
        VoiceIntentType.ASK_FOR_HELP: 0,
        VoiceIntentType.DELETE_SCREEN: 0,
        VoiceIntentType.DELETE_PAGE: 0,
        VoiceIntentType.DELETE_DATA_MODEL: 0,
        VoiceIntentType.UNKNOWN: 0,
    }
    
    @classmethod
    def extract_intent(cls, transcribed_text: str) -> SpeechToIntentResult:
        """
        Extract actionable intent from transcribed speech.
        
        Args:
            transcribed_text: Text from speech-to-text engine
            
        Returns:
            SpeechToIntentResult with extracted intent
        """
        text_lower = transcribed_text.lower().strip()
        
        if not text_lower:
            return SpeechToIntentResult(
                success=False,
                message="No speech detected"
            )
        
        # Find matching intents with confidence scores
        matches = []
        for intent_type, patterns in cls.INTENT_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    # Calculate confidence based on match specificity
                    confidence = cls._calculate_confidence(pattern, text_lower)
                    matches.append((intent_type, confidence))
                    break
        
        if not matches:
            # Try to provide helpful response for unknown intent
            return SpeechToIntentResult(
                success=True,
                intent=ExtractedIntent(
                    intent_type=VoiceIntentType.UNKNOWN,
                    confidence=0.0,
                    confidence_level=IntentConfidence.LOW,
                    original_text=transcribed_text,
                    clarification_needed=True,
                    clarification_message="I didn't understand that command. Try saying things like 'Create a dashboard screen' or 'Add a login page'."
                ),
                message="Could not determine intent"
            )
        
        # Sort by confidence
        matches.sort(key=lambda x: x[1], reverse=True)
        best_match = matches[0]
        
        # Extract target name and parameters
        target_name = cls._extract_target_name(transcribed_text)
        parameters = cls._extract_parameters(transcribed_text, best_match[0])
        
        # Determine confidence level
        if best_match[1] >= 0.8:
            confidence_level = IntentConfidence.HIGH
        elif best_match[1] >= 0.5:
            confidence_level = IntentConfidence.MEDIUM
        else:
            confidence_level = IntentConfidence.LOW
        
        # Check if confirmation needed
        requires_confirmation = best_match[0] in cls.DESTRUCTIVE_INTENTS
        
        # Check if clarification needed (low confidence or ambiguous)
        clarification_needed = confidence_level == IntentConfidence.LOW
        clarification_message = None
        if clarification_needed:
            clarification_message = f"I think you want to {best_match[0].value.replace('_', ' ')}. Is that correct?"
        
        intent = ExtractedIntent(
            intent_type=best_match[0],
            confidence=best_match[1],
            confidence_level=confidence_level,
            target_name=target_name,
            parameters=parameters,
            original_text=transcribed_text,
            requires_confirmation=requires_confirmation,
            clarification_needed=clarification_needed,
            clarification_message=clarification_message
        )
        
        # Build alternatives list
        alternatives = []
        for match in matches[1:3]:  # Top 2 alternatives
            alternatives.append(ExtractedIntent(
                intent_type=match[0],
                confidence=match[1],
                confidence_level=IntentConfidence.MEDIUM if match[1] >= 0.5 else IntentConfidence.LOW,
                original_text=transcribed_text
            ))
        
        return SpeechToIntentResult(
            success=True,
            intent=intent,
            alternatives=alternatives,
            message=f"Detected intent: {best_match[0].value}",
            credits_required=cls.CREDIT_COSTS.get(best_match[0], 0)
        )
    
    @classmethod
    def _calculate_confidence(cls, pattern: str, text: str) -> float:
        """Calculate confidence score based on pattern match quality."""
        match = re.search(pattern, text)
        if not match:
            return 0.0
        
        # Longer matches = higher confidence
        match_length = len(match.group())
        text_length = len(text)
        
        # Base confidence from match coverage
        base_confidence = min(match_length / max(text_length, 1), 1.0)
        
        # Bonus for specific keywords
        specificity_bonus = 0.0
        specific_keywords = ["screen", "page", "flow", "model", "navigation", "field"]
        for keyword in specific_keywords:
            if keyword in text:
                specificity_bonus += 0.1
        
        return min(base_confidence + specificity_bonus, 1.0)
    
    @classmethod
    def _extract_target_name(cls, text: str) -> Optional[str]:
        """Extract the target name from the command."""
        patterns = [
            r'(?:called|named)\s+["\']?([a-zA-Z0-9\s]+)["\']?',
            r'(?:a|an|the)\s+([a-zA-Z]+)\s+(?:screen|page|flow|model)',
            r'"([^"]+)"',
            r"'([^']+)'",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                name = match.group(1).strip()
                # Clean up common words
                for word in ['a', 'an', 'the', 'new']:
                    name = re.sub(rf'^\s*{word}\s+', '', name, flags=re.IGNORECASE)
                if name:
                    return name.title()
        
        # Try to extract type-based names
        type_patterns = {
            "dashboard": "Dashboard",
            "profile": "Profile",
            "settings": "Settings",
            "login": "Login",
            "signup": "Signup",
            "home": "Home",
            "about": "About",
            "contact": "Contact",
            "pricing": "Pricing",
            "checkout": "Checkout",
        }
        
        text_lower = text.lower()
        for keyword, name in type_patterns.items():
            if keyword in text_lower:
                return name
        
        return None
    
    @classmethod
    def _extract_parameters(cls, text: str, intent_type: VoiceIntentType) -> Dict[str, Any]:
        """Extract parameters specific to the intent type."""
        params = {}
        text_lower = text.lower()
        
        if intent_type == VoiceIntentType.GENERATE_FLOW:
            # Extract number of steps
            step_match = re.search(r'(\d+)\s+steps?', text_lower)
            if step_match:
                params["steps"] = int(step_match.group(1))
        
        elif intent_type == VoiceIntentType.UPDATE_DATA_MODEL:
            # Extract field names
            fields = []
            field_patterns = [
                r'(?:with\s+)?(\w+)(?:\s+and\s+(\w+))*\s+fields?',
                r'(?:name|price|email|image|photo|description|title|date|number|text)',
            ]
            for pattern in field_patterns:
                matches = re.findall(pattern, text_lower)
                if matches:
                    if isinstance(matches[0], tuple):
                        fields.extend([m for m in matches[0] if m])
                    else:
                        fields.extend(matches)
            if fields:
                params["fields"] = fields
        
        elif intent_type == VoiceIntentType.CREATE_SCREEN:
            # Extract screen components mentioned
            components = []
            component_keywords = ["button", "form", "input", "chart", "table", "card", "list", "image", "photo"]
            for comp in component_keywords:
                if comp in text_lower:
                    components.append(comp)
            if components:
                params["components"] = components
        
        return params
    
    @classmethod
    def get_supported_commands(cls) -> List[Dict[str, Any]]:
        """Get list of supported voice commands with examples."""
        return [
            {
                "intent": VoiceIntentType.CREATE_SCREEN.value,
                "description": "Create a new screen",
                "examples": [
                    "Create a login screen with email and password fields",
                    "Add a dashboard screen",
                    "Build a profile screen with a photo section"
                ],
                "credits": cls.CREDIT_COSTS[VoiceIntentType.CREATE_SCREEN]
            },
            {
                "intent": VoiceIntentType.CREATE_PAGE.value,
                "description": "Create a new page",
                "examples": [
                    "Create a landing page",
                    "Add an about page",
                    "Generate a pricing page"
                ],
                "credits": cls.CREDIT_COSTS[VoiceIntentType.CREATE_PAGE]
            },
            {
                "intent": VoiceIntentType.GENERATE_FLOW.value,
                "description": "Generate a multi-step flow",
                "examples": [
                    "Create a checkout flow with 3 steps",
                    "Generate an onboarding flow",
                    "Build an authentication flow"
                ],
                "credits": cls.CREDIT_COSTS[VoiceIntentType.GENERATE_FLOW]
            },
            {
                "intent": VoiceIntentType.MODIFY_NAVIGATION.value,
                "description": "Modify navigation",
                "examples": [
                    "Connect this button to the dashboard",
                    "Link this screen to the profile page"
                ],
                "credits": cls.CREDIT_COSTS[VoiceIntentType.MODIFY_NAVIGATION]
            },
            {
                "intent": VoiceIntentType.UPDATE_DATA_MODEL.value,
                "description": "Create or update data models",
                "examples": [
                    "Add a Product model with name, price, and image",
                    "Create a User model with email and name fields"
                ],
                "credits": cls.CREDIT_COSTS[VoiceIntentType.UPDATE_DATA_MODEL]
            },
            {
                "intent": VoiceIntentType.EXPLAIN_PROJECT.value,
                "description": "Get project explanation",
                "examples": [
                    "Explain what this project does",
                    "Tell me about this app"
                ],
                "credits": 0
            },
            {
                "intent": VoiceIntentType.ASK_FOR_HELP.value,
                "description": "Get help",
                "examples": [
                    "Help me create a screen",
                    "How do I add a button?"
                ],
                "credits": 0
            }
        ]
