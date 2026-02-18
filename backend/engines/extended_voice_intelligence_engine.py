# Extended Voice Intelligence Layer - Enhanced voice understanding
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid
import re


class UserState(str, Enum):
    FOCUSED = "focused"
    EXPLORING = "exploring"
    CONFUSED = "confused"
    FRUSTRATED = "frustrated"
    COMPLETING = "completing"


class IntentRefinement(BaseModel):
    """Refined intent with confidence and alternatives."""
    original_text: str
    refined_intent: str
    confidence: float
    alternatives: List[str] = []
    needs_clarification: bool = False
    clarification_prompt: Optional[str] = None


class WorkflowPrediction(BaseModel):
    """Predicted next workflow step."""
    prediction: str
    confidence: float
    suggestion_text: str
    suggestion_voice: str


class ExtendedVoiceIntelligenceEngine:
    """
    Extended Voice Intelligence Layer.
    
    Responsibilities:
    - Enhance voice understanding across all engines
    - Detect user frustration or confusion
    - Offer proactive help when needed
    - Optimize voice command interpretation
    - Support natural conversational phrasing
    
    Capabilities:
    - contextual_intent_refinement
    - voice_pattern_learning
    - workflow_prediction
    - command_disambiguation
    - voice_safety_monitoring
    
    Rules:
    - No emotional analysis
    - No personal voice storage
    - No background listening
    """
    
    # User interaction patterns (session-only, not persisted)
    _session_patterns: Dict[str, List[Dict[str, Any]]] = {}
    
    # Confusion indicators
    CONFUSION_PATTERNS = [
        r"\bi\s*don'?t\s*(know|understand)\b",
        r"\bwhat\s*(do|does|is|are)\b.*\?",
        r"\bhow\s*(do|does|can)\s*i\b",
        r"\bhelp\b",
        r"\bconfus(ed|ing)\b",
        r"\bstuck\b",
        r"\blost\b",
        r"\bum+\b",
        r"\buh+\b",
        r"\bwait\b",
    ]
    
    # Frustration indicators
    FRUSTRATION_PATTERNS = [
        r"\bthis\s*is\s*(not|isn'?t)\s*working\b",
        r"\bwhy\s*(won'?t|doesn'?t|isn'?t)\b",
        r"\bi\s*(already|just)\s*(said|told)\b",
        r"\bagain\??\b",
        r"\bstill\s*(not|doesn'?t)\b",
        r"\bforget\s*it\b",
        r"\bnever\s*mind\b",
    ]
    
    # Command improvement patterns
    COMMAND_IMPROVEMENTS = {
        # Vague to specific
        r"add\s*(?:a\s*)?thing": "What would you like to add? A screen, page, button, or form?",
        r"make\s*(?:a\s*)?change": "What would you like to change? Please be more specific.",
        r"do\s*(?:that|it)": "I'm not sure what 'that' refers to. Could you be more specific?",
        r"fix\s*(?:it|this)": "What would you like me to fix? Please describe the issue.",
        # Incomplete commands
        r"^create\s*$": "Create what? You can create a screen, page, data model, or flow.",
        r"^add\s*$": "Add what? Try 'add a button' or 'add a form'.",
        r"^delete\s*$": "Delete what? Please specify the item to delete.",
    }
    
    # Conversational to command mappings
    CONVERSATIONAL_MAPPINGS = {
        r"i\s*want\s*(?:to\s*)?(create|make|build)\s+(.+)": r"create \2",
        r"can\s*you\s*(create|make|build|add)\s+(.+)": r"\1 \2",
        r"let'?s\s*(create|make|build|add)\s+(.+)": r"\1 \2",
        r"i\s*need\s*(?:a\s*)?(.+)": r"create \1",
        r"give\s*me\s*(?:a\s*)?(.+)": r"create \1",
        r"how\s*about\s*(?:a\s*)?(.+)": r"create \1",
    }
    
    @classmethod
    def analyze_user_state(cls, recent_interactions: List[Dict[str, Any]]) -> UserState:
        """Analyze user's current state based on recent interactions."""
        if not recent_interactions:
            return UserState.EXPLORING
        
        # Count indicators
        confusion_count = 0
        frustration_count = 0
        success_count = 0
        
        for interaction in recent_interactions[-5:]:  # Look at last 5
            text = interaction.get("text", "").lower()
            success = interaction.get("success", True)
            
            # Check for confusion
            for pattern in cls.CONFUSION_PATTERNS:
                if re.search(pattern, text):
                    confusion_count += 1
                    break
            
            # Check for frustration
            for pattern in cls.FRUSTRATION_PATTERNS:
                if re.search(pattern, text):
                    frustration_count += 1
                    break
            
            if success:
                success_count += 1
        
        # Determine state
        if frustration_count >= 2:
            return UserState.FRUSTRATED
        elif confusion_count >= 2:
            return UserState.CONFUSED
        elif success_count >= 4:
            return UserState.COMPLETING
        elif success_count >= 2:
            return UserState.FOCUSED
        else:
            return UserState.EXPLORING
    
    @classmethod
    def refine_intent(
        cls,
        raw_text: str,
        context: Dict[str, Any] = None
    ) -> IntentRefinement:
        """Refine and improve voice command interpretation."""
        text_lower = raw_text.lower().strip()
        refined = text_lower
        needs_clarification = False
        clarification_prompt = None
        alternatives = []
        confidence = 0.8
        
        # Convert conversational to command
        for pattern, replacement in cls.CONVERSATIONAL_MAPPINGS.items():
            match = re.match(pattern, text_lower)
            if match:
                refined = re.sub(pattern, replacement, text_lower)
                break
        
        # Check for vague commands that need clarification
        for pattern, prompt in cls.COMMAND_IMPROVEMENTS.items():
            if re.search(pattern, refined):
                needs_clarification = True
                clarification_prompt = prompt
                confidence = 0.3
                break
        
        # Add context-aware refinements
        if context:
            current_screen = context.get("current_screen")
            if current_screen and "here" in refined:
                refined = refined.replace("here", f"on {current_screen}")
            
            last_created = context.get("last_created_item")
            if last_created and ("it" in refined or "that" in refined):
                refined = refined.replace("it", last_created).replace("that", last_created)
        
        # Generate alternatives for ambiguous commands
        if "screen" in refined and "page" not in refined:
            alternatives.append(refined.replace("screen", "page"))
        if "button" in refined:
            alternatives.append(refined.replace("button", "link"))
        
        return IntentRefinement(
            original_text=raw_text,
            refined_intent=refined,
            confidence=confidence,
            alternatives=alternatives,
            needs_clarification=needs_clarification,
            clarification_prompt=clarification_prompt
        )
    
    @classmethod
    def predict_next_action(
        cls,
        recent_actions: List[str],
        project_state: Dict[str, Any]
    ) -> Optional[WorkflowPrediction]:
        """Predict what the user might want to do next."""
        if not recent_actions:
            return None
        
        last_action = recent_actions[-1].lower() if recent_actions else ""
        
        predictions = {
            "create_screen": WorkflowPrediction(
                prediction="add_components",
                confidence=0.7,
                suggestion_text="Would you like to add components to your new screen?",
                suggestion_voice="I can add buttons, forms, or other components to your new screen. What would you like?"
            ),
            "create_page": WorkflowPrediction(
                prediction="add_content",
                confidence=0.7,
                suggestion_text="Would you like to add content sections to your page?",
                suggestion_voice="Would you like to add sections like a hero, features, or contact form?"
            ),
            "create_data_model": WorkflowPrediction(
                prediction="create_screen_with_model",
                confidence=0.6,
                suggestion_text="Would you like to create a screen that displays this data?",
                suggestion_voice="Would you like me to create a screen to display this data?"
            ),
            "add_navigation": WorkflowPrediction(
                prediction="test_navigation",
                confidence=0.5,
                suggestion_text="Would you like to preview the navigation?",
                suggestion_voice="Would you like to see how the navigation looks?"
            ),
        }
        
        # Find matching prediction
        for action_key, prediction in predictions.items():
            if action_key in last_action:
                return prediction
        
        # Default suggestion based on project state
        screens = project_state.get("screens", [])
        if len(screens) == 1:
            return WorkflowPrediction(
                prediction="add_more_screens",
                confidence=0.5,
                suggestion_text="Would you like to add more screens to your app?",
                suggestion_voice="Your app has one screen. Would you like to add more?"
            )
        
        return None
    
    @classmethod
    def disambiguate_command(
        cls,
        text: str,
        possible_intents: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Disambiguate between multiple possible intents."""
        if len(possible_intents) <= 1:
            return possible_intents[0] if possible_intents else {}
        
        # Score each intent
        scored = []
        for intent in possible_intents:
            score = intent.get("confidence", 0.5)
            
            # Boost score for more specific matches
            if "specific_match" in intent:
                score += 0.2
            
            # Boost score if intent matches recent context
            if intent.get("matches_context"):
                score += 0.1
            
            scored.append((score, intent))
        
        # Sort by score
        scored.sort(key=lambda x: x[0], reverse=True)
        
        best = scored[0][1]
        
        # If scores are close, ask for clarification
        if len(scored) > 1 and scored[0][0] - scored[1][0] < 0.2:
            options = [s[1].get("name", "unknown") for s in scored[:3]]
            best["needs_clarification"] = True
            best["clarification_options"] = options
            best["clarification_prompt"] = f"Did you mean: {', '.join(options[:-1])}, or {options[-1]}?"
        
        return best
    
    @classmethod
    def get_proactive_suggestion(
        cls,
        user_state: UserState,
        context: Dict[str, Any]
    ) -> Optional[Dict[str, str]]:
        """Generate proactive suggestions based on user state."""
        if user_state == UserState.CONFUSED:
            return {
                "text": "It looks like you might need some help. Would you like me to explain what you can do here?",
                "voice": "Need some help? I can explain what you can do. Just say 'help' anytime."
            }
        elif user_state == UserState.FRUSTRATED:
            return {
                "text": "I'm sorry things aren't working as expected. Would you like to try a different approach or get help?",
                "voice": "I'm sorry about that. Would you like to try something different or get some help?"
            }
        elif user_state == UserState.COMPLETING:
            return {
                "text": "You're making great progress! Would you like to preview or publish your project?",
                "voice": "Great progress! Would you like to preview what you've built?"
            }
        
        return None
    
    @classmethod
    def record_interaction(cls, user_id: str, text: str, success: bool):
        """Record an interaction for pattern analysis (session only)."""
        if user_id not in cls._session_patterns:
            cls._session_patterns[user_id] = []
        
        cls._session_patterns[user_id].append({
            "text": text,
            "success": success,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
        # Keep only last 20 interactions
        if len(cls._session_patterns[user_id]) > 20:
            cls._session_patterns[user_id] = cls._session_patterns[user_id][-20:]
    
    @classmethod
    def clear_session_data(cls, user_id: str):
        """Clear session data for a user (privacy compliance)."""
        cls._session_patterns.pop(user_id, None)
    
    @classmethod
    def get_command_suggestions(cls, partial_text: str) -> List[str]:
        """Get command suggestions based on partial input."""
        suggestions = [
            "Create a screen",
            "Create a page",
            "Add a button",
            "Add a form",
            "Create a data model",
            "Generate a flow",
            "Connect screens",
            "Explain this screen",
            "Help me get started",
            "What can I do here?",
        ]
        
        if not partial_text:
            return suggestions[:5]
        
        partial_lower = partial_text.lower()
        matching = [s for s in suggestions if partial_lower in s.lower()]
        
        return matching[:5] if matching else suggestions[:5]
