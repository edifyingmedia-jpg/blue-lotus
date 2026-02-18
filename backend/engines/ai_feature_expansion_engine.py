# AI Feature Expansion Engine - Add new features to existing projects
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class FeatureType(str, Enum):
    AUTHENTICATION = "authentication_system"
    SHOPPING_CART = "shopping_cart"
    CHECKOUT = "checkout_flow"
    PROFILE_MANAGEMENT = "profile_management"
    ADMIN_DASHBOARD = "admin_dashboard"
    SEARCH_FILTER = "search_and_filter_system"
    NOTIFICATIONS = "notifications"
    MESSAGING = "messaging"
    ANALYTICS = "analytics"
    PAYMENTS = "payments"
    SOCIAL_SHARING = "social_sharing"
    FILE_UPLOAD = "file_upload"
    DARK_MODE = "dark_mode"
    MULTI_LANGUAGE = "multi_language"
    RATINGS_REVIEWS = "ratings_reviews"


class FeatureRequirement(BaseModel):
    """Requirements for a feature."""
    screens_needed: List[str] = []
    data_models_needed: List[str] = []
    flows_needed: List[str] = []
    dependencies: List[str] = []
    estimated_credits: int = 2


class FeatureBlueprint(BaseModel):
    """Blueprint for a feature to be added."""
    feature_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    feature_type: FeatureType
    name: str
    description: str
    screens: List[Dict[str, Any]] = []
    data_models: List[Dict[str, Any]] = []
    flows: List[Dict[str, Any]] = []
    navigation_changes: List[Dict[str, Any]] = []
    credits_required: int = 2


class FeatureExpansionResult(BaseModel):
    """Result of feature expansion."""
    project_id: str
    feature_blueprint: FeatureBlueprint
    conflicts: List[str] = []
    dependencies_met: bool = True
    missing_dependencies: List[str] = []
    message_text: str = ""
    message_voice: str = ""


class AIFeatureExpansionEngine:
    """
    AI Feature Expansion Engine.
    
    Responsibilities:
    - Add new features to existing projects
    - Generate new screens, flows, and data models
    - Integrate new features into navigation
    - Bind new components to existing data
    - Explain how new features fit into the project
    
    Supported Commands:
    - "Add a shopping cart to my app"
    - "Create a profile management system"
    - "Add an admin dashboard"
    - "Add a search bar with filters"
    """
    
    # Feature templates
    FEATURE_TEMPLATES = {
        FeatureType.AUTHENTICATION: FeatureBlueprint(
            feature_type=FeatureType.AUTHENTICATION,
            name="Authentication System",
            description="User login, signup, and password reset",
            screens=[
                {"name": "Login", "components": ["EmailInput", "PasswordInput", "LoginButton", "ForgotPassword", "SignupLink"]},
                {"name": "Signup", "components": ["NameInput", "EmailInput", "PasswordInput", "ConfirmPassword", "SignupButton"]},
                {"name": "ForgotPassword", "components": ["EmailInput", "ResetButton", "BackToLogin"]},
            ],
            data_models=[
                {"name": "User", "fields": ["id", "email", "password_hash", "name", "avatar", "created_at", "last_login"]}
            ],
            flows=[
                {"name": "Login Flow", "steps": ["Enter Credentials", "Validate", "Redirect to Home"]},
                {"name": "Signup Flow", "steps": ["Enter Details", "Validate", "Create Account", "Welcome Email", "Redirect"]},
            ],
            navigation_changes=[
                {"action": "add_protected_routes", "routes": ["Profile", "Settings", "Dashboard"]}
            ],
            credits_required=3
        ),
        FeatureType.SHOPPING_CART: FeatureBlueprint(
            feature_type=FeatureType.SHOPPING_CART,
            name="Shopping Cart",
            description="Add products to cart and manage cart items",
            screens=[
                {"name": "Cart", "components": ["CartItemList", "CartSummary", "UpdateQuantity", "RemoveItem", "CheckoutButton"]},
                {"name": "CartBadge", "components": ["CartIcon", "ItemCount"]},
            ],
            data_models=[
                {"name": "Cart", "fields": ["id", "user_id", "items", "total", "created_at", "updated_at"]},
                {"name": "CartItem", "fields": ["product_id", "quantity", "price", "options"]}
            ],
            flows=[
                {"name": "Add to Cart", "steps": ["Select Product", "Choose Options", "Add to Cart", "Show Confirmation"]},
            ],
            navigation_changes=[
                {"action": "add_cart_badge", "location": "header"}
            ],
            credits_required=2
        ),
        FeatureType.CHECKOUT: FeatureBlueprint(
            feature_type=FeatureType.CHECKOUT,
            name="Checkout Flow",
            description="Complete purchase with shipping and payment",
            screens=[
                {"name": "Shipping", "components": ["AddressForm", "ShippingOptions", "ContinueButton"]},
                {"name": "Payment", "components": ["PaymentMethods", "CardForm", "BillingAddress", "PayButton"]},
                {"name": "OrderConfirmation", "components": ["OrderSummary", "TrackingInfo", "ContinueShopping"]},
            ],
            data_models=[
                {"name": "Order", "fields": ["id", "user_id", "items", "shipping_address", "payment_method", "status", "total", "created_at"]},
                {"name": "ShippingAddress", "fields": ["id", "user_id", "street", "city", "state", "zip", "country"]}
            ],
            flows=[
                {"name": "Checkout Flow", "steps": ["Review Cart", "Shipping", "Payment", "Confirmation"]},
            ],
            credits_required=3
        ),
        FeatureType.ADMIN_DASHBOARD: FeatureBlueprint(
            feature_type=FeatureType.ADMIN_DASHBOARD,
            name="Admin Dashboard",
            description="Manage users, content, and system settings",
            screens=[
                {"name": "AdminDashboard", "components": ["StatsCards", "RecentActivity", "QuickActions"]},
                {"name": "UserManagement", "components": ["UserTable", "UserSearch", "UserFilters", "UserActions"]},
                {"name": "ContentManagement", "components": ["ContentTable", "ContentFilters", "BulkActions"]},
                {"name": "SystemSettings", "components": ["SettingsSections", "SaveButton"]},
            ],
            data_models=[
                {"name": "AdminLog", "fields": ["id", "admin_id", "action", "target", "details", "timestamp"]}
            ],
            flows=[
                {"name": "Admin Login", "steps": ["Admin Credentials", "2FA", "Dashboard"]},
            ],
            navigation_changes=[
                {"action": "add_admin_nav", "location": "sidebar", "role_required": "admin"}
            ],
            credits_required=4
        ),
        FeatureType.SEARCH_FILTER: FeatureBlueprint(
            feature_type=FeatureType.SEARCH_FILTER,
            name="Search & Filter System",
            description="Search content with filters and sorting",
            screens=[
                {"name": "SearchResults", "components": ["SearchBar", "FilterPanel", "SortDropdown", "ResultsList", "Pagination"]},
            ],
            data_models=[
                {"name": "SearchIndex", "fields": ["id", "content_type", "content_id", "text", "keywords", "updated_at"]}
            ],
            flows=[
                {"name": "Search Flow", "steps": ["Enter Query", "Apply Filters", "View Results", "Select Item"]},
            ],
            credits_required=2
        ),
        FeatureType.PROFILE_MANAGEMENT: FeatureBlueprint(
            feature_type=FeatureType.PROFILE_MANAGEMENT,
            name="Profile Management",
            description="User profile editing and preferences",
            screens=[
                {"name": "Profile", "components": ["Avatar", "ProfileInfo", "EditButton", "ActivityFeed"]},
                {"name": "EditProfile", "components": ["AvatarUpload", "ProfileForm", "SaveButton", "CancelButton"]},
                {"name": "Preferences", "components": ["NotificationSettings", "PrivacySettings", "ThemeSelector"]},
            ],
            data_models=[
                {"name": "UserProfile", "fields": ["user_id", "bio", "location", "website", "social_links"]},
                {"name": "UserPreferences", "fields": ["user_id", "notifications", "privacy", "theme"]}
            ],
            flows=[
                {"name": "Edit Profile", "steps": ["Open Edit", "Make Changes", "Save", "View Updated"]},
            ],
            credits_required=2
        ),
        FeatureType.NOTIFICATIONS: FeatureBlueprint(
            feature_type=FeatureType.NOTIFICATIONS,
            name="Notifications System",
            description="In-app and push notifications",
            screens=[
                {"name": "Notifications", "components": ["NotificationList", "FilterTabs", "MarkAllRead"]},
                {"name": "NotificationBadge", "components": ["BellIcon", "UnreadCount"]},
            ],
            data_models=[
                {"name": "Notification", "fields": ["id", "user_id", "type", "title", "message", "read", "action_url", "created_at"]}
            ],
            flows=[
                {"name": "View Notification", "steps": ["Tap Notification", "Mark Read", "Navigate to Target"]},
            ],
            credits_required=2
        ),
        FeatureType.MESSAGING: FeatureBlueprint(
            feature_type=FeatureType.MESSAGING,
            name="Messaging System",
            description="Direct messages between users",
            screens=[
                {"name": "Inbox", "components": ["ConversationList", "SearchConversations", "NewMessage"]},
                {"name": "Conversation", "components": ["MessageList", "MessageInput", "SendButton", "AttachFile"]},
            ],
            data_models=[
                {"name": "Conversation", "fields": ["id", "participants", "last_message", "unread_count", "updated_at"]},
                {"name": "Message", "fields": ["id", "conversation_id", "sender_id", "content", "attachments", "read", "created_at"]}
            ],
            flows=[
                {"name": "Send Message", "steps": ["Open Conversation", "Type Message", "Send", "Delivered"]},
            ],
            credits_required=3
        ),
    }
    
    # Feature dependencies
    FEATURE_DEPENDENCIES = {
        FeatureType.CHECKOUT: [FeatureType.SHOPPING_CART, FeatureType.AUTHENTICATION],
        FeatureType.ADMIN_DASHBOARD: [FeatureType.AUTHENTICATION],
        FeatureType.PROFILE_MANAGEMENT: [FeatureType.AUTHENTICATION],
        FeatureType.MESSAGING: [FeatureType.AUTHENTICATION],
        FeatureType.NOTIFICATIONS: [FeatureType.AUTHENTICATION],
    }
    
    @classmethod
    async def add_feature(
        cls,
        project: Dict[str, Any],
        feature_type: FeatureType,
        custom_options: Optional[Dict[str, Any]] = None
    ) -> FeatureExpansionResult:
        """Add a feature to a project."""
        project_id = project.get("id", "")
        existing_features = project.get("features", [])
        
        # Get feature blueprint
        blueprint = cls.FEATURE_TEMPLATES.get(feature_type)
        if not blueprint:
            return FeatureExpansionResult(
                project_id=project_id,
                feature_blueprint=FeatureBlueprint(feature_type=feature_type, name=str(feature_type)),
                conflicts=[f"Unknown feature type: {feature_type}"],
                dependencies_met=False,
                message_text=f"Feature type '{feature_type}' is not supported.",
                message_voice=f"Sorry, I don't know how to add that feature yet."
            )
        
        # Check dependencies
        dependencies = cls.FEATURE_DEPENDENCIES.get(feature_type, [])
        missing = [d.value for d in dependencies if d.value not in existing_features]
        dependencies_met = len(missing) == 0
        
        # Check for conflicts
        conflicts = cls._check_conflicts(project, blueprint)
        
        # Generate messages
        if not dependencies_met:
            message_text = f"Cannot add **{blueprint.name}** yet.\n\nMissing dependencies:\n" + \
                          "\n".join([f"• {m}" for m in missing])
            message_voice = f"I can't add {blueprint.name} yet because you first need: {', '.join(missing)}"
        elif conflicts:
            message_text = f"**{blueprint.name}** has conflicts:\n" + "\n".join([f"• {c}" for c in conflicts])
            message_voice = f"Adding {blueprint.name} would conflict with existing features. {conflicts[0]}"
        else:
            screen_count = len(blueprint.screens)
            model_count = len(blueprint.data_models)
            message_text = f"Ready to add **{blueprint.name}**!\n\n" \
                          f"This will add:\n" \
                          f"• {screen_count} screens\n" \
                          f"• {model_count} data models\n\n" \
                          f"**Credits required:** {blueprint.credits_required}\n\n" \
                          f"Confirm to proceed?"
            message_voice = f"I'll add {blueprint.name} to your project. This includes {screen_count} new screens " \
                           f"and costs {blueprint.credits_required} credits. Should I proceed?"
        
        return FeatureExpansionResult(
            project_id=project_id,
            feature_blueprint=blueprint,
            conflicts=conflicts,
            dependencies_met=dependencies_met,
            missing_dependencies=missing,
            message_text=message_text,
            message_voice=message_voice
        )
    
    @classmethod
    def _check_conflicts(cls, project: Dict[str, Any], blueprint: FeatureBlueprint) -> List[str]:
        """Check for conflicts between new feature and existing project."""
        conflicts = []
        
        # Get existing screens
        existing_screens = project.get("structure", {}).get("screens", [])
        existing_screen_names = [s if isinstance(s, str) else s.get("name", "") for s in existing_screens]
        
        # Check for duplicate screens
        for screen in blueprint.screens:
            screen_name = screen.get("name", "")
            if screen_name in existing_screen_names:
                conflicts.append(f"Screen '{screen_name}' already exists")
        
        # Get existing models
        existing_models = project.get("structure", {}).get("data_models", [])
        existing_model_names = [m if isinstance(m, str) else m.get("name", "") for m in existing_models]
        
        # Check for duplicate models
        for model in blueprint.data_models:
            model_name = model.get("name", "")
            if model_name in existing_model_names:
                # Not always a conflict - might be an extension
                pass
        
        return conflicts
    
    @classmethod
    def detect_feature_from_command(cls, command: str) -> Optional[FeatureType]:
        """Detect which feature the user wants from their command."""
        command_lower = command.lower()
        
        keyword_mapping = {
            FeatureType.AUTHENTICATION: ["login", "signup", "auth", "authentication", "sign in", "register"],
            FeatureType.SHOPPING_CART: ["cart", "shopping cart", "add to cart", "basket"],
            FeatureType.CHECKOUT: ["checkout", "payment", "purchase", "buy"],
            FeatureType.PROFILE_MANAGEMENT: ["profile", "account settings", "edit profile", "my account"],
            FeatureType.ADMIN_DASHBOARD: ["admin", "dashboard", "manage users", "admin panel"],
            FeatureType.SEARCH_FILTER: ["search", "filter", "find", "search bar"],
            FeatureType.NOTIFICATIONS: ["notification", "alerts", "push notification"],
            FeatureType.MESSAGING: ["message", "chat", "inbox", "dm", "direct message"],
            FeatureType.ANALYTICS: ["analytics", "stats", "statistics", "reports"],
            FeatureType.PAYMENTS: ["payment", "stripe", "billing", "subscription"],
            FeatureType.SOCIAL_SHARING: ["share", "social sharing", "post to"],
            FeatureType.FILE_UPLOAD: ["upload", "file upload", "image upload"],
            FeatureType.DARK_MODE: ["dark mode", "theme", "night mode"],
            FeatureType.RATINGS_REVIEWS: ["review", "rating", "stars", "feedback"],
        }
        
        for feature_type, keywords in keyword_mapping.items():
            if any(kw in command_lower for kw in keywords):
                return feature_type
        
        return None
    
    @classmethod
    def get_available_features(cls) -> List[Dict[str, Any]]:
        """Get list of available features that can be added."""
        return [
            {
                "type": ft.value,
                "name": blueprint.name,
                "description": blueprint.description,
                "credits": blueprint.credits_required,
                "screens_count": len(blueprint.screens),
            }
            for ft, blueprint in cls.FEATURE_TEMPLATES.items()
        ]
    
    @classmethod
    def get_supported_commands(cls) -> List[Dict[str, Any]]:
        """Get supported feature expansion commands."""
        return [
            {
                "command": "add_feature",
                "examples": [
                    "Add a shopping cart to my app",
                    "Create a profile management system",
                    "Add an admin dashboard",
                    "Add a search bar with filters"
                ],
                "description": "Add a new feature to your project"
            },
            {
                "command": "list_features",
                "examples": ["What features can I add?", "Show available features"],
                "description": "List all available features"
            }
        ]
