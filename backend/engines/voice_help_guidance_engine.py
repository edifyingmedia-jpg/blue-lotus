# Voice Help & Guidance Engine - Provide spoken and text-based guidance
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class HelpCategory(str, Enum):
    GETTING_STARTED = "getting_started"
    SCREENS = "screens"
    PAGES = "pages"
    DATA_MODELS = "data_models"
    NAVIGATION = "navigation"
    FLOWS = "flows"
    VOICE_COMMANDS = "voice_commands"
    CREDITS = "credits"
    PUBLISHING = "publishing"
    GENERAL = "general"


class HelpMode(str, Enum):
    SIMPLE = "simple"
    DETAILED = "detailed"
    WALKTHROUGH = "walkthrough"


class HelpResponse(BaseModel):
    """Help response with text and voice versions."""
    topic: str
    category: HelpCategory
    text_response: str
    voice_response: str
    follow_up_suggestions: List[str] = []
    related_topics: List[str] = []


class VoiceHelpGuidanceEngine:
    """
    Voice-Driven Help & Guidance Engine.
    
    Responsibilities:
    - Provide spoken and text-based guidance to users
    - Explain features, screens, components, and workflows
    - Offer step-by-step instructions when requested
    - Answer questions about the builder, data models, and navigation
    - Detect when users appear confused and offer help
    
    Capabilities:
    - contextual_help
    - feature_explanations
    - guided_walkthroughs
    - voice_activated_tips
    - project_state_explanations
    
    Rules:
    - Always provide text equivalent
    - Never assume user intent
    - Never modify project during help
    """
    
    # Help content database
    HELP_CONTENT = {
        "getting_started": {
            "title": "Getting Started",
            "text": "Welcome to Blue Lotus! You can build apps and websites by simply describing what you want. Try saying 'Create a dashboard screen' or 'Add a login page'. I'll generate everything for you.",
            "voice": "Welcome to Blue Lotus! Just describe what you want to build, and I'll create it for you. Try saying create a dashboard screen, or add a login page.",
            "follow_up": ["How do I create a screen?", "What can I build?", "How do credits work?"]
        },
        "screens": {
            "title": "About Screens",
            "text": "Screens are the main views in your app. Each screen can have components like buttons, forms, and lists. Say 'Create a [name] screen' to add one, or describe what you want on it.",
            "voice": "Screens are the main views in your app. To create one, just say create a screen and describe what you want. For example, create a profile screen with a photo and bio section.",
            "follow_up": ["Create a screen", "What components can I add?", "How do I connect screens?"]
        },
        "pages": {
            "title": "About Pages",
            "text": "Pages are for your website - like landing pages, about pages, and pricing pages. Say 'Create a landing page' or 'Add an about page' to get started.",
            "voice": "Pages are for your website. You can create landing pages, about pages, pricing pages, and more. Just say create a landing page to get started.",
            "follow_up": ["Create a page", "What's the difference between screens and pages?"]
        },
        "data_models": {
            "title": "About Data Models",
            "text": "Data models define the structure of your data - like Users, Products, or Orders. Say 'Create a Product model with name, price, and image' to add one.",
            "voice": "Data models define your data structure. For example, you might have a User model with name and email, or a Product model with name and price. Just describe what you need.",
            "follow_up": ["Create a data model", "How do I connect models to screens?"]
        },
        "navigation": {
            "title": "About Navigation",
            "text": "Navigation connects your screens and pages. Say 'Connect this button to the dashboard' or 'Add navigation to the settings screen' to set up links.",
            "voice": "Navigation connects your screens together. You can say things like connect this button to the dashboard, or add a link to settings.",
            "follow_up": ["Connect screens", "Add a navigation menu"]
        },
        "flows": {
            "title": "About Flows",
            "text": "Flows are multi-step processes like checkout, onboarding, or signup. Say 'Create a checkout flow with 3 steps' to generate one.",
            "voice": "Flows are multi-step processes. You can create checkout flows, onboarding wizards, or signup sequences. Just describe the flow you need.",
            "follow_up": ["Create a flow", "How many steps can a flow have?"]
        },
        "voice_commands": {
            "title": "Voice Commands",
            "text": "You can control everything with your voice:\n• 'Create a [screen/page/model]'\n• 'Add a [component]'\n• 'Connect [item] to [destination]'\n• 'Delete [item]' (requires confirmation)\n• 'Explain [topic]'",
            "voice": "Here are some voice commands you can use: Create a screen or page. Add a component. Connect items together. Delete items, which requires confirmation. Or ask me to explain anything.",
            "follow_up": ["What else can I say?", "How do I delete things safely?"]
        },
        "credits": {
            "title": "About Credits",
            "text": "Credits power AI generation. Creating screens costs 3 credits, pages cost 5, flows cost 8. You get daily bonus credits, and can purchase more if needed.",
            "voice": "Credits power AI generation. Screens cost 3 credits, pages cost 5, and flows cost 8. You get free daily bonus credits, and can buy more anytime.",
            "follow_up": ["Check my credit balance", "How do I get more credits?"]
        },
        "publishing": {
            "title": "About Publishing",
            "text": "When you're ready, you can publish your project to share it with the world. Say 'Publish my project' to deploy it. You can publish to staging first to test.",
            "voice": "When you're ready, say publish my project to deploy it. You can publish to staging first to test, then go live when you're happy.",
            "follow_up": ["Publish to staging", "What's the difference between staging and production?"]
        }
    }
    
    # Contextual help triggers
    CONFUSION_INDICATORS = [
        "i don't know",
        "what do i",
        "how do i",
        "i'm confused",
        "help",
        "what is",
        "explain",
        "not sure",
        "stuck",
        "lost"
    ]
    
    @classmethod
    def get_help(
        cls,
        topic: str,
        mode: HelpMode = HelpMode.SIMPLE,
        context: Dict[str, Any] = None
    ) -> HelpResponse:
        """Get help content for a topic."""
        topic_lower = topic.lower().strip()
        
        # Find matching help content
        matched_key = None
        for key in cls.HELP_CONTENT.keys():
            if key in topic_lower or topic_lower in key:
                matched_key = key
                break
        
        # Check for keyword matches
        if not matched_key:
            keyword_map = {
                "getting_started": ["start", "begin", "new", "first"],
                "screens": ["screen", "view", "app"],
                "pages": ["page", "website", "site", "landing"],
                "data_models": ["data", "model", "database", "field"],
                "navigation": ["navigation", "nav", "link", "connect", "menu"],
                "flows": ["flow", "process", "step", "wizard", "checkout"],
                "voice_commands": ["voice", "command", "say", "speak"],
                "credits": ["credit", "cost", "price", "buy"],
                "publishing": ["publish", "deploy", "live", "share"]
            }
            
            for key, keywords in keyword_map.items():
                if any(kw in topic_lower for kw in keywords):
                    matched_key = key
                    break
        
        if not matched_key:
            matched_key = "getting_started"
        
        content = cls.HELP_CONTENT[matched_key]
        category = HelpCategory(matched_key) if matched_key in [c.value for c in HelpCategory] else HelpCategory.GENERAL
        
        return HelpResponse(
            topic=content["title"],
            category=category,
            text_response=content["text"],
            voice_response=content["voice"],
            follow_up_suggestions=content.get("follow_up", []),
            related_topics=list(cls.HELP_CONTENT.keys())[:3]
        )
    
    @classmethod
    def detect_confusion(cls, text: str) -> bool:
        """Detect if user seems confused and might need help."""
        text_lower = text.lower()
        return any(indicator in text_lower for indicator in cls.CONFUSION_INDICATORS)
    
    @classmethod
    def get_proactive_help(cls, context: Dict[str, Any]) -> Optional[HelpResponse]:
        """Generate proactive help based on context."""
        current_screen = context.get("current_screen")
        recent_actions = context.get("recent_actions", [])
        time_idle = context.get("time_idle_seconds", 0)
        
        # If user has been idle for a while
        if time_idle > 60:
            return HelpResponse(
                topic="Need Help?",
                category=HelpCategory.GENERAL,
                text_response="It looks like you might be thinking. Need any help? Just ask me anything!",
                voice_response="Need any help? Just ask me anything or say help to get started.",
                follow_up_suggestions=["What can I do here?", "Show me examples"]
            )
        
        # If user is on a new screen with no components
        if current_screen and not context.get("has_components"):
            return HelpResponse(
                topic="Empty Screen",
                category=HelpCategory.SCREENS,
                text_response=f"Your {current_screen} screen is ready! Try adding components by saying 'Add a button' or 'Add a form'.",
                voice_response=f"Your {current_screen} screen is ready. Try saying add a button or add a form to get started.",
                follow_up_suggestions=["Add a form", "Add a button", "What components are available?"]
            )
        
        return None
    
    @classmethod
    def explain_project_state(cls, project: Dict[str, Any]) -> HelpResponse:
        """Explain the current state of a project."""
        screens = project.get("screens", [])
        pages = project.get("pages", [])
        models = project.get("data_models", [])
        flows = project.get("flows", [])
        
        text = f"Your project has:\n"
        voice = "Your project currently has "
        parts = []
        
        if screens:
            text += f"• {len(screens)} screens: {', '.join(s.get('name', 'Unnamed') for s in screens[:3])}\n"
            parts.append(f"{len(screens)} screens")
        if pages:
            text += f"• {len(pages)} pages: {', '.join(p.get('name', 'Unnamed') for p in pages[:3])}\n"
            parts.append(f"{len(pages)} pages")
        if models:
            text += f"• {len(models)} data models: {', '.join(m.get('name', 'Unnamed') for m in models[:3])}\n"
            parts.append(f"{len(models)} data models")
        if flows:
            text += f"• {len(flows)} flows: {', '.join(f.get('name', 'Unnamed') for f in flows[:3])}\n"
            parts.append(f"{len(flows)} flows")
        
        if not parts:
            text = "Your project is empty. Start by saying 'Create a screen' or describing what you want to build."
            voice = "Your project is empty. Start by creating a screen or describing what you want to build."
        else:
            voice += ", ".join(parts) + "."
        
        return HelpResponse(
            topic="Project Overview",
            category=HelpCategory.GENERAL,
            text_response=text,
            voice_response=voice,
            follow_up_suggestions=["Add more screens", "Create a data model", "Explain navigation"]
        )
    
    @classmethod
    def get_feature_explanation(cls, feature: str) -> HelpResponse:
        """Get detailed explanation of a specific feature."""
        return cls.get_help(feature, HelpMode.DETAILED)
    
    @classmethod
    def get_walkthrough(cls, topic: str) -> List[Dict[str, str]]:
        """Get step-by-step walkthrough for a topic."""
        walkthroughs = {
            "create_screen": [
                {"step": 1, "text": "Say 'Create a screen' followed by what you want", "voice": "First, say create a screen, then describe what you want."},
                {"step": 2, "text": "I'll generate the screen structure", "voice": "I'll generate the screen for you."},
                {"step": 3, "text": "Add components by describing them", "voice": "Then add components by describing what you need."},
                {"step": 4, "text": "Connect to other screens if needed", "voice": "Finally, connect it to other screens."}
            ],
            "create_flow": [
                {"step": 1, "text": "Say 'Create a flow' with the name and steps", "voice": "Say create a flow and describe the steps."},
                {"step": 2, "text": "I'll generate the flow structure", "voice": "I'll create the flow structure."},
                {"step": 3, "text": "Review and modify each step", "voice": "Review each step and ask for changes."},
                {"step": 4, "text": "Connect to your screens", "voice": "Then connect the flow to your screens."}
            ]
        }
        
        topic_key = topic.lower().replace(" ", "_")
        return walkthroughs.get(topic_key, walkthroughs["create_screen"])
    
    @classmethod
    def get_all_topics(cls) -> List[Dict[str, str]]:
        """Get all available help topics."""
        return [
            {"key": key, "title": content["title"]}
            for key, content in cls.HELP_CONTENT.items()
        ]
