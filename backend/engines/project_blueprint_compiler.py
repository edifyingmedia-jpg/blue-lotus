# Project Blueprint Compiler - Converts interpreted intent into structured blueprints
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid

from engines.intent_interpretation_engine import (
    InterpretedProject, InterpretedScreen, InterpretedFlow, 
    InterpretedDataModel, InterpretedNavigation, AppPurpose
)


class ComponentType(str, Enum):
    BUTTON = "button"
    TEXT = "text"
    INPUT = "input"
    IMAGE = "image"
    LIST = "list"
    CARD = "card"
    FORM = "form"
    HEADER = "header"
    FOOTER = "footer"
    NAV = "nav"
    GRID = "grid"
    MODAL = "modal"
    TAB = "tab"
    CHART = "chart"
    TABLE = "table"
    SEARCH = "search"
    FILTER = "filter"
    AVATAR = "avatar"
    BADGE = "badge"
    DIVIDER = "divider"


class BlueprintComponent(BaseModel):
    """A component in a screen blueprint."""
    component_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    type: ComponentType
    name: str
    props: Dict[str, Any] = {}
    data_binding: Optional[str] = None
    children: List['BlueprintComponent'] = []
    position: Dict[str, Any] = {"row": 0, "col": 0}


class ScreenBlueprint(BaseModel):
    """Blueprint for a single screen."""
    screen_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    purpose: str
    layout: str = "column"  # column, row, grid
    components: List[BlueprintComponent] = []
    data_sources: List[str] = []
    actions: List[Dict[str, Any]] = []
    styles: Dict[str, Any] = {}


class FlowBlueprint(BaseModel):
    """Blueprint for a user flow."""
    flow_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    steps: List[Dict[str, Any]] = []  # [{screen, action, next}]
    trigger: str = "user_action"
    conditions: List[Dict[str, Any]] = []


class DataModelBlueprint(BaseModel):
    """Blueprint for a data model."""
    model_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    fields: List[Dict[str, Any]] = []
    relationships: List[Dict[str, Any]] = []
    indexes: List[str] = []
    sample_data: List[Dict[str, Any]] = []


class NavigationBlueprint(BaseModel):
    """Blueprint for navigation structure."""
    type: str = "tabs"
    root_screen: str = ""
    routes: List[Dict[str, Any]] = []  # [{path, screen, icon}]
    protected_routes: List[str] = []
    default_route: str = "/"


class ProjectBlueprint(BaseModel):
    """Complete project blueprint ready for generation."""
    blueprint_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_name: str
    project_type: str = "app"
    description: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    screens: List[ScreenBlueprint] = []
    flows: List[FlowBlueprint] = []
    data_models: List[DataModelBlueprint] = []
    navigation: NavigationBlueprint = NavigationBlueprint()
    
    theme: Dict[str, Any] = {}
    metadata: Dict[str, Any] = {}
    estimated_credits: int = 5
    is_valid: bool = True
    validation_errors: List[str] = []


class ProjectBlueprintCompiler:
    """
    Project Blueprint Compiler.
    
    Converts interpreted intent into structured blueprints that can be:
    - Rendered by the Canvas Engine
    - Stored in the database
    - Modified by the Builder
    - Exported as code
    """
    
    # Component mappings for common UI elements
    COMPONENT_MAPPING = {
        "Hero": [
            BlueprintComponent(type=ComponentType.IMAGE, name="hero_image", props={"width": "100%", "height": "300px"}),
            BlueprintComponent(type=ComponentType.TEXT, name="hero_title", props={"variant": "h1"}),
            BlueprintComponent(type=ComponentType.TEXT, name="hero_subtitle", props={"variant": "body1"}),
            BlueprintComponent(type=ComponentType.BUTTON, name="hero_cta", props={"variant": "primary"}),
        ],
        "ProductGrid": [
            BlueprintComponent(type=ComponentType.GRID, name="product_grid", props={"columns": 3, "gap": 16}),
        ],
        "SearchBar": [
            BlueprintComponent(type=ComponentType.SEARCH, name="search", props={"placeholder": "Search..."}),
        ],
        "FilterBar": [
            BlueprintComponent(type=ComponentType.FILTER, name="filters", props={"options": []}),
        ],
        "UserInfo": [
            BlueprintComponent(type=ComponentType.AVATAR, name="avatar", props={"size": "lg"}),
            BlueprintComponent(type=ComponentType.TEXT, name="user_name", props={"variant": "h2"}),
            BlueprintComponent(type=ComponentType.TEXT, name="user_email", props={"variant": "caption"}),
        ],
        "Header": [
            BlueprintComponent(type=ComponentType.HEADER, name="header", props={"sticky": True}),
        ],
        "Footer": [
            BlueprintComponent(type=ComponentType.FOOTER, name="footer", props={}),
        ],
        "CartItems": [
            BlueprintComponent(type=ComponentType.LIST, name="cart_list", props={"item_type": "cart_item"}),
        ],
        "PostList": [
            BlueprintComponent(type=ComponentType.LIST, name="post_list", props={"item_type": "post"}),
        ],
        "TaskList": [
            BlueprintComponent(type=ComponentType.LIST, name="task_list", props={"item_type": "task", "sortable": True}),
        ],
        "Stats": [
            BlueprintComponent(type=ComponentType.GRID, name="stats_grid", props={"columns": 4}),
        ],
        "Form": [
            BlueprintComponent(type=ComponentType.FORM, name="form", props={}),
        ],
        "SettingsForm": [
            BlueprintComponent(type=ComponentType.FORM, name="settings_form", props={"sections": True}),
        ],
    }
    
    # Default theme
    DEFAULT_THEME = {
        "colors": {
            "primary": "#4CC3FF",
            "secondary": "#003A66",
            "background": "#020B14",
            "surface": "#0a1929",
            "text": "#ffffff",
            "textSecondary": "#94a3b8",
        },
        "fonts": {
            "heading": "Inter",
            "body": "Inter",
        },
        "borderRadius": "8px",
        "spacing": 16,
    }
    
    @classmethod
    def compile(cls, interpreted: InterpretedProject) -> ProjectBlueprint:
        """Compile interpreted project into blueprint."""
        screens = cls._compile_screens(interpreted.screens)
        flows = cls._compile_flows(interpreted.flows, screens)
        data_models = cls._compile_data_models(interpreted.data_models)
        navigation = cls._compile_navigation(interpreted.navigation, screens)
        
        blueprint = ProjectBlueprint(
            project_name=interpreted.app_name,
            project_type="app" if interpreted.app_purpose in [AppPurpose.SOCIAL, AppPurpose.PRODUCTIVITY] else "website",
            description=interpreted.description,
            screens=screens,
            flows=flows,
            data_models=data_models,
            navigation=navigation,
            theme=cls.DEFAULT_THEME,
            metadata={
                "purpose": interpreted.app_purpose.value,
                "features": interpreted.features,
                "target_audience": interpreted.target_audience,
            },
            estimated_credits=interpreted.estimated_credits,
        )
        
        # Validate
        errors = cls._validate_blueprint(blueprint)
        blueprint.validation_errors = errors
        blueprint.is_valid = len(errors) == 0
        
        return blueprint
    
    @classmethod
    def _compile_screens(cls, interpreted_screens: List[InterpretedScreen]) -> List[ScreenBlueprint]:
        """Compile screen interpretations into blueprints."""
        screens = []
        
        for screen in interpreted_screens:
            components = []
            data_sources = []
            
            for comp_name in screen.components:
                if comp_name in cls.COMPONENT_MAPPING:
                    components.extend(cls.COMPONENT_MAPPING[comp_name])
                else:
                    # Create generic component
                    comp_type = cls._infer_component_type(comp_name)
                    components.append(BlueprintComponent(
                        type=comp_type,
                        name=comp_name.lower().replace(" ", "_"),
                        props={}
                    ))
            
            # Data sources from data bindings
            for binding in screen.data_bindings:
                if binding not in data_sources:
                    data_sources.append(binding)
            
            screens.append(ScreenBlueprint(
                name=screen.name,
                purpose=screen.purpose,
                components=components,
                data_sources=data_sources,
                styles={
                    "padding": "16px",
                    "background": "var(--background)",
                }
            ))
        
        return screens
    
    @classmethod
    def _compile_flows(cls, interpreted_flows: List[InterpretedFlow], screens: List[ScreenBlueprint]) -> List[FlowBlueprint]:
        """Compile flow interpretations into blueprints."""
        flows = []
        screen_names = [s.name for s in screens]
        
        for flow in interpreted_flows:
            steps = []
            for i, step in enumerate(flow.steps):
                # Try to match step to screen
                matching_screen = None
                for screen_name in screen_names:
                    if step.lower() in screen_name.lower() or screen_name.lower() in step.lower():
                        matching_screen = screen_name
                        break
                
                steps.append({
                    "step_number": i + 1,
                    "name": step,
                    "screen": matching_screen,
                    "action": "navigate" if i < len(flow.steps) - 1 else "complete",
                    "next": flow.steps[i + 1] if i < len(flow.steps) - 1 else None,
                })
            
            flows.append(FlowBlueprint(
                name=flow.name,
                steps=steps,
                trigger=flow.trigger,
            ))
        
        return flows
    
    @classmethod
    def _compile_data_models(cls, interpreted_models: List[InterpretedDataModel]) -> List[DataModelBlueprint]:
        """Compile data model interpretations into blueprints."""
        models = []
        
        for model in interpreted_models:
            fields = []
            for field in model.fields:
                fields.append({
                    "name": field.get("name", ""),
                    "type": field.get("type", "text"),
                    "required": field.get("required", "false") == "true",
                    "default": None,
                })
            
            relationships = []
            for rel in model.relationships:
                relationships.append({
                    "target": rel.get("target", ""),
                    "type": rel.get("type", "one_to_many"),
                    "field": f"{rel.get('target', '').lower()}_id",
                })
            
            # Add id and timestamps if not present
            field_names = [f["name"] for f in fields]
            if "id" not in field_names:
                fields.insert(0, {"name": "id", "type": "text", "required": True})
            if "created_at" not in field_names:
                fields.append({"name": "created_at", "type": "date", "required": True})
            if "updated_at" not in field_names:
                fields.append({"name": "updated_at", "type": "date", "required": True})
            
            models.append(DataModelBlueprint(
                name=model.name,
                fields=fields,
                relationships=relationships,
                indexes=["id"],
            ))
        
        return models
    
    @classmethod
    def _compile_navigation(cls, interpreted_nav: InterpretedNavigation, screens: List[ScreenBlueprint]) -> NavigationBlueprint:
        """Compile navigation interpretation into blueprint."""
        routes = []
        
        for screen in screens:
            path = f"/{screen.name.lower().replace(' ', '-')}"
            if screen.name == interpreted_nav.root_screen or (not interpreted_nav.root_screen and screen == screens[0]):
                path = "/"
            
            routes.append({
                "path": path,
                "screen": screen.name,
                "icon": cls._get_icon_for_screen(screen.name),
                "in_menu": screen.name in interpreted_nav.menu_items or len(interpreted_nav.menu_items) == 0,
            })
        
        return NavigationBlueprint(
            type=interpreted_nav.type,
            root_screen=interpreted_nav.root_screen or (screens[0].name if screens else ""),
            routes=routes,
            protected_routes=interpreted_nav.protected_screens,
            default_route="/",
        )
    
    @classmethod
    def _infer_component_type(cls, name: str) -> ComponentType:
        """Infer component type from name."""
        name_lower = name.lower()
        
        if any(x in name_lower for x in ["button", "btn", "cta", "action"]):
            return ComponentType.BUTTON
        elif any(x in name_lower for x in ["input", "field", "text"]):
            return ComponentType.INPUT
        elif any(x in name_lower for x in ["image", "photo", "picture", "avatar"]):
            return ComponentType.IMAGE
        elif any(x in name_lower for x in ["list", "items"]):
            return ComponentType.LIST
        elif any(x in name_lower for x in ["card"]):
            return ComponentType.CARD
        elif any(x in name_lower for x in ["form"]):
            return ComponentType.FORM
        elif any(x in name_lower for x in ["grid"]):
            return ComponentType.GRID
        elif any(x in name_lower for x in ["chart", "graph"]):
            return ComponentType.CHART
        elif any(x in name_lower for x in ["table"]):
            return ComponentType.TABLE
        elif any(x in name_lower for x in ["search"]):
            return ComponentType.SEARCH
        elif any(x in name_lower for x in ["filter"]):
            return ComponentType.FILTER
        elif any(x in name_lower for x in ["nav", "menu"]):
            return ComponentType.NAV
        elif any(x in name_lower for x in ["header"]):
            return ComponentType.HEADER
        elif any(x in name_lower for x in ["footer"]):
            return ComponentType.FOOTER
        else:
            return ComponentType.TEXT
    
    @classmethod
    def _get_icon_for_screen(cls, screen_name: str) -> str:
        """Get an icon name for a screen."""
        name_lower = screen_name.lower()
        
        icons = {
            "home": "Home",
            "dashboard": "LayoutDashboard",
            "profile": "User",
            "settings": "Settings",
            "cart": "ShoppingCart",
            "checkout": "CreditCard",
            "product": "Package",
            "feed": "Newspaper",
            "messages": "MessageSquare",
            "notifications": "Bell",
            "search": "Search",
            "calendar": "Calendar",
            "task": "CheckSquare",
            "analytics": "BarChart",
        }
        
        for key, icon in icons.items():
            if key in name_lower:
                return icon
        
        return "FileText"
    
    @classmethod
    def _validate_blueprint(cls, blueprint: ProjectBlueprint) -> List[str]:
        """Validate blueprint integrity."""
        errors = []
        
        # Check for empty project
        if not blueprint.screens:
            errors.append("Project has no screens")
        
        # Check navigation has valid root
        if blueprint.navigation.root_screen:
            screen_names = [s.name for s in blueprint.screens]
            if blueprint.navigation.root_screen not in screen_names:
                errors.append(f"Root screen '{blueprint.navigation.root_screen}' not found in screens")
        
        # Check flow references
        for flow in blueprint.flows:
            for step in flow.steps:
                if step.get("screen") and step["screen"] not in [s.name for s in blueprint.screens]:
                    errors.append(f"Flow '{flow.name}' references unknown screen '{step['screen']}'")
        
        # Check data model references
        model_names = [m.name for m in blueprint.data_models]
        for model in blueprint.data_models:
            for rel in model.relationships:
                if rel.get("target") and rel["target"] not in model_names:
                    errors.append(f"Model '{model.name}' references unknown model '{rel['target']}'")
        
        return errors
    
    @classmethod
    def to_dict(cls, blueprint: ProjectBlueprint) -> Dict[str, Any]:
        """Convert blueprint to dictionary for storage."""
        return {
            "blueprint_id": blueprint.blueprint_id,
            "project_name": blueprint.project_name,
            "project_type": blueprint.project_type,
            "description": blueprint.description,
            "created_at": blueprint.created_at.isoformat(),
            "screens": [s.model_dump() for s in blueprint.screens],
            "flows": [f.model_dump() for f in blueprint.flows],
            "data_models": [m.model_dump() for m in blueprint.data_models],
            "navigation": blueprint.navigation.model_dump(),
            "theme": blueprint.theme,
            "metadata": blueprint.metadata,
            "estimated_credits": blueprint.estimated_credits,
            "is_valid": blueprint.is_valid,
            "validation_errors": blueprint.validation_errors,
        }
