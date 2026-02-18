# Intent Interpretation Engine - Analyzes user descriptions and extracts app structure
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum
import os
import json
from dotenv import load_dotenv

load_dotenv()


class AppPurpose(str, Enum):
    ECOMMERCE = "ecommerce"
    SOCIAL = "social"
    PRODUCTIVITY = "productivity"
    CONTENT = "content"
    UTILITY = "utility"
    BUSINESS = "business"
    EDUCATION = "education"
    HEALTH = "health"
    ENTERTAINMENT = "entertainment"
    OTHER = "other"


class InterpretedScreen(BaseModel):
    """A screen extracted from user description."""
    name: str
    purpose: str
    components: List[str] = []
    data_bindings: List[str] = []
    priority: int = 1  # 1 = core, 2 = secondary, 3 = optional


class InterpretedFlow(BaseModel):
    """A user flow extracted from description."""
    name: str
    steps: List[str] = []
    trigger: str = "user_action"
    purpose: str = ""


class InterpretedDataModel(BaseModel):
    """A data model extracted from description."""
    name: str
    fields: List[Dict[str, str]] = []  # [{name, type, required}]
    relationships: List[Dict[str, str]] = []  # [{target, type}]


class InterpretedNavigation(BaseModel):
    """Navigation structure extracted from description."""
    type: str = "tabs"  # tabs, drawer, stack
    root_screen: str = ""
    menu_items: List[str] = []
    protected_screens: List[str] = []  # require auth


class InterpretedProject(BaseModel):
    """Complete interpreted project structure."""
    app_name: str
    app_purpose: AppPurpose = AppPurpose.OTHER
    description: str
    target_audience: str = ""
    screens: List[InterpretedScreen] = []
    flows: List[InterpretedFlow] = []
    data_models: List[InterpretedDataModel] = []
    navigation: InterpretedNavigation = InterpretedNavigation()
    features: List[str] = []
    estimated_credits: int = 5
    confidence: float = 0.8


class IntentInterpretationEngine:
    """
    Intent Interpretation Layer.
    
    Analyzes user descriptions and extracts:
    - App purpose and features
    - Required screens and their components
    - User flows and journeys
    - Data models and relationships
    - Navigation patterns
    
    Uses LLM to understand natural language and convert to structured output.
    """
    
    # Screen templates for common app types
    SCREEN_TEMPLATES = {
        AppPurpose.ECOMMERCE: [
            InterpretedScreen(name="Home", purpose="Landing with featured products", components=["Hero", "ProductGrid", "Categories"], priority=1),
            InterpretedScreen(name="ProductList", purpose="Browse products", components=["SearchBar", "FilterBar", "ProductGrid", "Pagination"], priority=1),
            InterpretedScreen(name="ProductDetail", purpose="View product details", components=["ImageGallery", "ProductInfo", "AddToCart", "Reviews"], priority=1),
            InterpretedScreen(name="Cart", purpose="Shopping cart", components=["CartItems", "Summary", "Checkout"], priority=1),
            InterpretedScreen(name="Checkout", purpose="Complete purchase", components=["ShippingForm", "PaymentForm", "OrderSummary"], priority=1),
            InterpretedScreen(name="Profile", purpose="User account", components=["UserInfo", "OrderHistory", "Settings"], priority=2),
        ],
        AppPurpose.SOCIAL: [
            InterpretedScreen(name="Feed", purpose="Content feed", components=["PostList", "CreatePost", "Stories"], priority=1),
            InterpretedScreen(name="Profile", purpose="User profile", components=["Avatar", "Bio", "PostGrid", "FollowButton"], priority=1),
            InterpretedScreen(name="Messages", purpose="Direct messages", components=["ConversationList", "ChatWindow"], priority=1),
            InterpretedScreen(name="Notifications", purpose="Activity alerts", components=["NotificationList"], priority=2),
            InterpretedScreen(name="Search", purpose="Find users/content", components=["SearchBar", "Results", "Suggestions"], priority=2),
        ],
        AppPurpose.PRODUCTIVITY: [
            InterpretedScreen(name="Dashboard", purpose="Overview", components=["Stats", "RecentItems", "QuickActions"], priority=1),
            InterpretedScreen(name="TaskList", purpose="Manage tasks", components=["TaskList", "Filters", "CreateTask"], priority=1),
            InterpretedScreen(name="TaskDetail", purpose="View/edit task", components=["TaskInfo", "Comments", "Attachments"], priority=1),
            InterpretedScreen(name="Calendar", purpose="Schedule view", components=["CalendarView", "EventList"], priority=2),
            InterpretedScreen(name="Settings", purpose="Preferences", components=["SettingsForm"], priority=2),
        ],
        AppPurpose.CONTENT: [
            InterpretedScreen(name="Home", purpose="Content discovery", components=["FeaturedContent", "Categories", "Trending"], priority=1),
            InterpretedScreen(name="Browse", purpose="Browse content", components=["ContentGrid", "Filters", "Search"], priority=1),
            InterpretedScreen(name="Detail", purpose="View content", components=["ContentViewer", "Comments", "Related"], priority=1),
            InterpretedScreen(name="Create", purpose="Create content", components=["Editor", "Preview", "Publish"], priority=1),
            InterpretedScreen(name="Profile", purpose="User profile", components=["UserInfo", "ContentList"], priority=2),
        ],
    }
    
    # Flow templates
    FLOW_TEMPLATES = {
        "authentication": InterpretedFlow(name="Authentication", steps=["Login/Signup", "Verify", "Dashboard"], trigger="app_start", purpose="User authentication"),
        "onboarding": InterpretedFlow(name="Onboarding", steps=["Welcome", "Features", "Setup", "Complete"], trigger="first_launch", purpose="New user onboarding"),
        "checkout": InterpretedFlow(name="Checkout", steps=["Cart", "Shipping", "Payment", "Confirmation"], trigger="user_action", purpose="Purchase flow"),
        "content_creation": InterpretedFlow(name="Content Creation", steps=["New", "Edit", "Preview", "Publish"], trigger="user_action", purpose="Create content"),
        "profile_setup": InterpretedFlow(name="Profile Setup", steps=["Basic Info", "Preferences", "Avatar", "Complete"], trigger="user_action", purpose="Setup profile"),
    }
    
    # Data model templates
    DATA_MODEL_TEMPLATES = {
        "User": InterpretedDataModel(
            name="User",
            fields=[
                {"name": "id", "type": "text", "required": "true"},
                {"name": "email", "type": "text", "required": "true"},
                {"name": "name", "type": "text", "required": "true"},
                {"name": "avatar", "type": "image", "required": "false"},
                {"name": "created_at", "type": "date", "required": "true"},
            ]
        ),
        "Product": InterpretedDataModel(
            name="Product",
            fields=[
                {"name": "id", "type": "text", "required": "true"},
                {"name": "name", "type": "text", "required": "true"},
                {"name": "price", "type": "number", "required": "true"},
                {"name": "description", "type": "text", "required": "false"},
                {"name": "image", "type": "image", "required": "false"},
                {"name": "category", "type": "text", "required": "false"},
            ]
        ),
        "Post": InterpretedDataModel(
            name="Post",
            fields=[
                {"name": "id", "type": "text", "required": "true"},
                {"name": "content", "type": "text", "required": "true"},
                {"name": "author", "type": "reference", "required": "true"},
                {"name": "created_at", "type": "date", "required": "true"},
                {"name": "likes", "type": "number", "required": "false"},
            ],
            relationships=[{"target": "User", "type": "many_to_one"}]
        ),
        "Task": InterpretedDataModel(
            name="Task",
            fields=[
                {"name": "id", "type": "text", "required": "true"},
                {"name": "title", "type": "text", "required": "true"},
                {"name": "description", "type": "text", "required": "false"},
                {"name": "status", "type": "text", "required": "true"},
                {"name": "due_date", "type": "date", "required": "false"},
                {"name": "assignee", "type": "reference", "required": "false"},
            ]
        ),
    }
    
    @classmethod
    def detect_app_purpose(cls, description: str) -> AppPurpose:
        """Detect app purpose from description."""
        desc_lower = description.lower()
        
        keywords = {
            AppPurpose.ECOMMERCE: ["shop", "store", "product", "cart", "checkout", "buy", "sell", "ecommerce", "marketplace"],
            AppPurpose.SOCIAL: ["social", "friend", "follow", "post", "share", "feed", "message", "chat", "community"],
            AppPurpose.PRODUCTIVITY: ["task", "project", "todo", "productivity", "manage", "organize", "workflow", "kanban"],
            AppPurpose.CONTENT: ["blog", "article", "video", "content", "media", "publish", "write", "read"],
            AppPurpose.UTILITY: ["tool", "utility", "calculator", "converter", "tracker", "monitor"],
            AppPurpose.BUSINESS: ["business", "crm", "dashboard", "analytics", "report", "invoice", "client"],
            AppPurpose.EDUCATION: ["learn", "course", "education", "quiz", "study", "lesson", "student", "teacher"],
            AppPurpose.HEALTH: ["health", "fitness", "workout", "diet", "medical", "wellness", "exercise"],
            AppPurpose.ENTERTAINMENT: ["game", "music", "movie", "entertainment", "fun", "play"],
        }
        
        for purpose, kws in keywords.items():
            if any(kw in desc_lower for kw in kws):
                return purpose
        
        return AppPurpose.OTHER
    
    @classmethod
    def extract_features(cls, description: str) -> List[str]:
        """Extract requested features from description."""
        features = []
        desc_lower = description.lower()
        
        feature_keywords = {
            "authentication": ["login", "signup", "auth", "register", "account"],
            "user_profiles": ["profile", "user info", "account settings"],
            "search": ["search", "find", "lookup"],
            "filters": ["filter", "sort", "category"],
            "notifications": ["notification", "alert", "push"],
            "payments": ["payment", "checkout", "buy", "stripe", "pay"],
            "messaging": ["message", "chat", "inbox", "dm"],
            "social_sharing": ["share", "social", "post"],
            "analytics": ["analytics", "stats", "dashboard", "report"],
            "admin_panel": ["admin", "manage", "moderate"],
            "file_upload": ["upload", "file", "image", "photo"],
            "dark_mode": ["dark mode", "theme", "night mode"],
        }
        
        for feature, keywords in feature_keywords.items():
            if any(kw in desc_lower for kw in keywords):
                features.append(feature)
        
        return features
    
    @classmethod
    async def interpret_with_llm(cls, description: str, api_key: str = None) -> InterpretedProject:
        """Use LLM to interpret description and generate structured output."""
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        
        key = api_key or os.getenv("EMERGENT_LLM_KEY")
        if not key:
            # Fallback to template-based interpretation
            return cls.interpret_with_templates(description)
        
        try:
            chat = LlmChat(
                api_key=key,
                session_id=f"interpret-{hash(description)}",
                system_message="""You are an expert app architect. Analyze the user's app description and extract:
1. App name and purpose
2. Required screens with their components
3. User flows
4. Data models with fields
5. Navigation structure

Respond with valid JSON matching this structure:
{
    "app_name": "string",
    "app_purpose": "ecommerce|social|productivity|content|utility|business|education|health|entertainment|other",
    "description": "string",
    "target_audience": "string",
    "screens": [{"name": "string", "purpose": "string", "components": ["string"], "priority": 1-3}],
    "flows": [{"name": "string", "steps": ["string"], "purpose": "string"}],
    "data_models": [{"name": "string", "fields": [{"name": "string", "type": "text|number|boolean|date|image|reference", "required": "true|false"}]}],
    "navigation": {"type": "tabs|drawer|stack", "root_screen": "string", "menu_items": ["string"]},
    "features": ["string"],
    "estimated_credits": number
}"""
            ).with_model("openai", "gpt-5.2")
            
            user_message = UserMessage(
                text=f"Analyze this app description and provide the structured output:\n\n{description}"
            )
            
            response = await chat.send_message(user_message)
            
            # Parse JSON response
            # Try to extract JSON from response
            json_str = response
            if "```json" in response:
                json_str = response.split("```json")[1].split("```")[0]
            elif "```" in response:
                json_str = response.split("```")[1].split("```")[0]
            
            data = json.loads(json_str.strip())
            
            return InterpretedProject(
                app_name=data.get("app_name", "My App"),
                app_purpose=AppPurpose(data.get("app_purpose", "other")),
                description=data.get("description", description),
                target_audience=data.get("target_audience", ""),
                screens=[InterpretedScreen(**s) for s in data.get("screens", [])],
                flows=[InterpretedFlow(**f) for f in data.get("flows", [])],
                data_models=[InterpretedDataModel(**m) for m in data.get("data_models", [])],
                navigation=InterpretedNavigation(**data.get("navigation", {})),
                features=data.get("features", []),
                estimated_credits=data.get("estimated_credits", 5),
                confidence=0.9
            )
            
        except Exception as e:
            print(f"LLM interpretation failed: {e}")
            # Fallback to template-based
            return cls.interpret_with_templates(description)
    
    @classmethod
    def interpret_with_templates(cls, description: str) -> InterpretedProject:
        """Interpret description using templates (no LLM)."""
        purpose = cls.detect_app_purpose(description)
        features = cls.extract_features(description)
        
        # Get screens for this app type
        screens = cls.SCREEN_TEMPLATES.get(purpose, cls.SCREEN_TEMPLATES[AppPurpose.PRODUCTIVITY])
        
        # Determine flows
        flows = []
        if "authentication" in features:
            flows.append(cls.FLOW_TEMPLATES["authentication"])
        flows.append(cls.FLOW_TEMPLATES["onboarding"])
        
        if purpose == AppPurpose.ECOMMERCE:
            flows.append(cls.FLOW_TEMPLATES["checkout"])
        if purpose in [AppPurpose.CONTENT, AppPurpose.SOCIAL]:
            flows.append(cls.FLOW_TEMPLATES["content_creation"])
        
        # Determine data models
        data_models = [cls.DATA_MODEL_TEMPLATES["User"]]
        if purpose == AppPurpose.ECOMMERCE:
            data_models.append(cls.DATA_MODEL_TEMPLATES["Product"])
        if purpose in [AppPurpose.CONTENT, AppPurpose.SOCIAL]:
            data_models.append(cls.DATA_MODEL_TEMPLATES["Post"])
        if purpose == AppPurpose.PRODUCTIVITY:
            data_models.append(cls.DATA_MODEL_TEMPLATES["Task"])
        
        # Navigation
        nav_type = "tabs" if purpose in [AppPurpose.SOCIAL, AppPurpose.ECOMMERCE] else "drawer"
        navigation = InterpretedNavigation(
            type=nav_type,
            root_screen=screens[0].name if screens else "Home",
            menu_items=[s.name for s in screens[:4]]
        )
        
        # Extract app name from description
        words = description.split()
        app_name = " ".join(words[:3]).title() if len(words) >= 3 else "My App"
        
        return InterpretedProject(
            app_name=app_name,
            app_purpose=purpose,
            description=description,
            screens=screens,
            flows=flows,
            data_models=data_models,
            navigation=navigation,
            features=features,
            estimated_credits=3 + len(screens),
            confidence=0.7
        )
    
    @classmethod
    async def interpret(cls, description: str, use_llm: bool = True) -> InterpretedProject:
        """Main interpretation method."""
        if use_llm:
            return await cls.interpret_with_llm(description)
        return cls.interpret_with_templates(description)
