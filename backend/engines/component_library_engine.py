# Component Library Engine - Manages reusable UI components
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class ComponentCategory(str, Enum):
    LAYOUT = "layout"
    TEXT = "text"
    MEDIA = "media"
    FORMS = "forms"
    NAVIGATION = "navigation"
    DATA_DISPLAY = "data_display"
    ACTIONS = "actions"
    CONTAINERS = "containers"


class ComponentProperty(BaseModel):
    name: str
    type: str  # string, number, boolean, select, color
    default: Any = None
    required: bool = False
    options: Optional[List[str]] = None  # For select type
    description: Optional[str] = None


class ComponentDefinition(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str
    category: ComponentCategory
    description: Optional[str] = None
    properties: List[ComponentProperty] = []
    accepts_children: bool = False
    icon: Optional[str] = None
    theme_tokens: Dict[str, str] = {}  # CSS variable mappings
    responsive: bool = True
    accessible: bool = True


class ComponentInstance(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    component_type: str
    properties: Dict[str, Any] = {}
    bindings: Dict[str, str] = {}
    children: List["ComponentInstance"] = []
    theme_overrides: Dict[str, str] = {}


class ComponentLibraryEngine:
    """
    Component Library Engine stores and manages reusable UI components.
    
    Responsibilities:
    - Store reusable UI components
    - Provide categorized component sets
    - Expose components to generation engine
    - Allow component configuration
    - Ensure components follow Blue Lotus theme
    - Support responsive behavior
    
    Rules:
    - Theme enforced
    - Brand identity locked
    - No external branding
    - Responsive by default
    - Accessible by default
    """
    
    # Blue Lotus theme tokens
    THEME_TOKENS = {
        "primary": "#4CC3FF",
        "primary-dark": "#003A66",
        "primary-light": "#7FDBFF",
        "background": "#020B14",
        "background-panel": "#03121F",
        "text-primary": "#FFFFFF",
        "text-secondary": "#9CA3AF",
        "border": "#003A66",
        "success": "#10B981",
        "warning": "#F59E0B",
        "error": "#EF4444",
        "font-family": "Inter, sans-serif",
    }
    
    # Component library
    _components: Dict[str, ComponentDefinition] = {}
    
    @classmethod
    def initialize_library(cls):
        """Initialize the component library with default components."""
        components = [
            # Layout components
            ComponentDefinition(
                name="Container",
                type="Container",
                category=ComponentCategory.LAYOUT,
                description="A flexible container for grouping elements",
                properties=[
                    ComponentProperty(name="layout", type="select", default="vertical", options=["vertical", "horizontal", "grid"]),
                    ComponentProperty(name="padding", type="string", default="16px"),
                    ComponentProperty(name="gap", type="string", default="8px"),
                    ComponentProperty(name="align", type="select", options=["start", "center", "end", "stretch"]),
                ],
                accepts_children=True,
                icon="layout",
                theme_tokens={"background": "background-panel", "border": "border"}
            ),
            ComponentDefinition(
                name="Grid",
                type="Grid",
                category=ComponentCategory.LAYOUT,
                description="A responsive grid layout",
                properties=[
                    ComponentProperty(name="columns", type="number", default=3),
                    ComponentProperty(name="gap", type="string", default="16px"),
                    ComponentProperty(name="responsive", type="boolean", default=True),
                ],
                accepts_children=True,
                icon="grid"
            ),
            ComponentDefinition(
                name="Card",
                type="Card",
                category=ComponentCategory.CONTAINERS,
                description="A card container with optional header and footer",
                properties=[
                    ComponentProperty(name="title", type="string"),
                    ComponentProperty(name="padding", type="string", default="16px"),
                    ComponentProperty(name="shadow", type="boolean", default=True),
                ],
                accepts_children=True,
                icon="square",
                theme_tokens={"background": "background-panel", "border": "border"}
            ),
            
            # Text components
            ComponentDefinition(
                name="Heading",
                type="Heading",
                category=ComponentCategory.TEXT,
                description="A heading element (h1-h6)",
                properties=[
                    ComponentProperty(name="text", type="string", required=True),
                    ComponentProperty(name="level", type="select", default="h2", options=["h1", "h2", "h3", "h4", "h5", "h6"]),
                    ComponentProperty(name="align", type="select", options=["left", "center", "right"]),
                ],
                icon="type",
                theme_tokens={"color": "text-primary"}
            ),
            ComponentDefinition(
                name="Text",
                type="Text",
                category=ComponentCategory.TEXT,
                description="A paragraph or span of text",
                properties=[
                    ComponentProperty(name="text", type="string", required=True),
                    ComponentProperty(name="variant", type="select", default="body", options=["body", "caption", "label"]),
                ],
                icon="align-left",
                theme_tokens={"color": "text-secondary"}
            ),
            
            # Media components
            ComponentDefinition(
                name="Image",
                type="Image",
                category=ComponentCategory.MEDIA,
                description="An image element",
                properties=[
                    ComponentProperty(name="src", type="string", required=True),
                    ComponentProperty(name="alt", type="string", required=True),
                    ComponentProperty(name="width", type="string"),
                    ComponentProperty(name="height", type="string"),
                    ComponentProperty(name="fit", type="select", default="cover", options=["cover", "contain", "fill"]),
                ],
                icon="image"
            ),
            ComponentDefinition(
                name="Avatar",
                type="Avatar",
                category=ComponentCategory.MEDIA,
                description="A user avatar image",
                properties=[
                    ComponentProperty(name="src", type="string"),
                    ComponentProperty(name="name", type="string"),
                    ComponentProperty(name="size", type="select", default="medium", options=["small", "medium", "large"]),
                ],
                icon="user"
            ),
            ComponentDefinition(
                name="Icon",
                type="Icon",
                category=ComponentCategory.MEDIA,
                description="An icon element",
                properties=[
                    ComponentProperty(name="name", type="string", required=True),
                    ComponentProperty(name="size", type="number", default=24),
                    ComponentProperty(name="color", type="color"),
                ],
                icon="star",
                theme_tokens={"color": "primary"}
            ),
            
            # Form components
            ComponentDefinition(
                name="Input",
                type="Input",
                category=ComponentCategory.FORMS,
                description="A text input field",
                properties=[
                    ComponentProperty(name="label", type="string"),
                    ComponentProperty(name="placeholder", type="string"),
                    ComponentProperty(name="type", type="select", default="text", options=["text", "email", "password", "number", "tel"]),
                    ComponentProperty(name="required", type="boolean", default=False),
                ],
                icon="text-cursor",
                theme_tokens={"background": "background-panel", "border": "border", "focus": "primary"}
            ),
            ComponentDefinition(
                name="TextArea",
                type="TextArea",
                category=ComponentCategory.FORMS,
                description="A multi-line text input",
                properties=[
                    ComponentProperty(name="label", type="string"),
                    ComponentProperty(name="placeholder", type="string"),
                    ComponentProperty(name="rows", type="number", default=4),
                ],
                icon="file-text",
                theme_tokens={"background": "background-panel", "border": "border"}
            ),
            ComponentDefinition(
                name="Select",
                type="Select",
                category=ComponentCategory.FORMS,
                description="A dropdown select input",
                properties=[
                    ComponentProperty(name="label", type="string"),
                    ComponentProperty(name="options", type="string", description="Comma-separated options"),
                    ComponentProperty(name="placeholder", type="string"),
                ],
                icon="chevron-down",
                theme_tokens={"background": "background-panel", "border": "border"}
            ),
            ComponentDefinition(
                name="Checkbox",
                type="Checkbox",
                category=ComponentCategory.FORMS,
                description="A checkbox input",
                properties=[
                    ComponentProperty(name="label", type="string", required=True),
                    ComponentProperty(name="checked", type="boolean", default=False),
                ],
                icon="check-square",
                theme_tokens={"checked": "primary"}
            ),
            ComponentDefinition(
                name="Toggle",
                type="Toggle",
                category=ComponentCategory.FORMS,
                description="A toggle switch",
                properties=[
                    ComponentProperty(name="label", type="string"),
                    ComponentProperty(name="checked", type="boolean", default=False),
                ],
                icon="toggle-right",
                theme_tokens={"active": "primary"}
            ),
            
            # Navigation components
            ComponentDefinition(
                name="NavBar",
                type="NavBar",
                category=ComponentCategory.NAVIGATION,
                description="A navigation bar",
                properties=[
                    ComponentProperty(name="logo", type="boolean", default=True),
                    ComponentProperty(name="sticky", type="boolean", default=True),
                ],
                accepts_children=True,
                icon="menu",
                theme_tokens={"background": "background", "border": "border"}
            ),
            ComponentDefinition(
                name="Link",
                type="Link",
                category=ComponentCategory.NAVIGATION,
                description="A navigation link",
                properties=[
                    ComponentProperty(name="text", type="string", required=True),
                    ComponentProperty(name="href", type="string"),
                    ComponentProperty(name="target", type="select", options=["_self", "_blank"]),
                ],
                icon="link",
                theme_tokens={"color": "primary"}
            ),
            ComponentDefinition(
                name="TabBar",
                type="TabBar",
                category=ComponentCategory.NAVIGATION,
                description="A tab navigation bar",
                properties=[
                    ComponentProperty(name="tabs", type="string", description="Comma-separated tab names"),
                    ComponentProperty(name="activeTab", type="number", default=0),
                ],
                icon="folder",
                theme_tokens={"active": "primary", "background": "background-panel"}
            ),
            
            # Data display components
            ComponentDefinition(
                name="DataTable",
                type="DataTable",
                category=ComponentCategory.DATA_DISPLAY,
                description="A data table for displaying lists",
                properties=[
                    ComponentProperty(name="title", type="string"),
                    ComponentProperty(name="columns", type="string", description="Comma-separated column names"),
                    ComponentProperty(name="pagination", type="boolean", default=True),
                ],
                icon="table",
                theme_tokens={"background": "background-panel", "border": "border"}
            ),
            ComponentDefinition(
                name="StatsCard",
                type="StatsCard",
                category=ComponentCategory.DATA_DISPLAY,
                description="A card displaying a statistic",
                properties=[
                    ComponentProperty(name="label", type="string", required=True),
                    ComponentProperty(name="value", type="string"),
                    ComponentProperty(name="change", type="string"),
                    ComponentProperty(name="icon", type="string"),
                ],
                icon="trending-up",
                theme_tokens={"background": "background-panel"}
            ),
            ComponentDefinition(
                name="Chart",
                type="Chart",
                category=ComponentCategory.DATA_DISPLAY,
                description="A chart visualization",
                properties=[
                    ComponentProperty(name="type", type="select", default="line", options=["line", "bar", "pie", "donut"]),
                    ComponentProperty(name="title", type="string"),
                ],
                icon="bar-chart",
                theme_tokens={"primary": "primary", "secondary": "primary-light"}
            ),
            
            # Action components
            ComponentDefinition(
                name="Button",
                type="Button",
                category=ComponentCategory.ACTIONS,
                description="A clickable button",
                properties=[
                    ComponentProperty(name="label", type="string", required=True),
                    ComponentProperty(name="variant", type="select", default="primary", options=["primary", "secondary", "outline", "ghost"]),
                    ComponentProperty(name="size", type="select", default="medium", options=["small", "medium", "large"]),
                    ComponentProperty(name="disabled", type="boolean", default=False),
                    ComponentProperty(name="icon", type="string"),
                ],
                icon="mouse-pointer",
                theme_tokens={"primary-bg": "primary", "primary-text": "background"}
            ),
            ComponentDefinition(
                name="IconButton",
                type="IconButton",
                category=ComponentCategory.ACTIONS,
                description="A button with only an icon",
                properties=[
                    ComponentProperty(name="icon", type="string", required=True),
                    ComponentProperty(name="size", type="select", default="medium", options=["small", "medium", "large"]),
                    ComponentProperty(name="variant", type="select", default="ghost", options=["primary", "ghost"]),
                ],
                icon="circle",
                theme_tokens={"hover": "primary"}
            ),
        ]
        
        for component in components:
            cls._components[component.type] = component
    
    @classmethod
    def get_all_components(cls) -> List[ComponentDefinition]:
        """Get all available components."""
        if not cls._components:
            cls.initialize_library()
        return list(cls._components.values())
    
    @classmethod
    def get_component(cls, component_type: str) -> Optional[ComponentDefinition]:
        """Get a specific component definition."""
        if not cls._components:
            cls.initialize_library()
        return cls._components.get(component_type)
    
    @classmethod
    def get_components_by_category(cls, category: ComponentCategory) -> List[ComponentDefinition]:
        """Get all components in a category."""
        if not cls._components:
            cls.initialize_library()
        return [c for c in cls._components.values() if c.category == category]
    
    @classmethod
    def get_theme_tokens(cls) -> Dict[str, str]:
        """Get the Blue Lotus theme tokens."""
        return cls.THEME_TOKENS.copy()
    
    @classmethod
    def create_instance(
        cls,
        component_type: str,
        properties: Dict[str, Any] = None,
        bindings: Dict[str, str] = None
    ) -> Optional[ComponentInstance]:
        """Create an instance of a component."""
        definition = cls.get_component(component_type)
        if not definition:
            return None
        
        # Apply defaults
        props = {}
        for prop in definition.properties:
            if prop.default is not None:
                props[prop.name] = prop.default
        
        # Override with provided properties
        if properties:
            props.update(properties)
        
        return ComponentInstance(
            component_type=component_type,
            properties=props,
            bindings=bindings or {}
        )
    
    @classmethod
    def validate_component_props(
        cls,
        component_type: str,
        properties: Dict[str, Any]
    ) -> tuple[bool, List[str]]:
        """Validate component properties against the definition."""
        definition = cls.get_component(component_type)
        if not definition:
            return False, [f"Unknown component type: {component_type}"]
        
        errors = []
        
        # Check required properties
        for prop in definition.properties:
            if prop.required and prop.name not in properties:
                errors.append(f"Missing required property: {prop.name}")
        
        # Validate property types and options
        for prop in definition.properties:
            if prop.name in properties:
                value = properties[prop.name]
                
                if prop.type == "select" and prop.options:
                    if value not in prop.options:
                        errors.append(f"Invalid value for {prop.name}: {value}. Must be one of: {prop.options}")
                
                if prop.type == "number" and not isinstance(value, (int, float)):
                    errors.append(f"Property {prop.name} must be a number")
                
                if prop.type == "boolean" and not isinstance(value, bool):
                    errors.append(f"Property {prop.name} must be a boolean")
        
        return len(errors) == 0, errors
    
    @classmethod
    def get_component_schema(cls, component_type: str) -> Optional[Dict[str, Any]]:
        """Get JSON schema for a component."""
        definition = cls.get_component(component_type)
        if not definition:
            return None
        
        return {
            "id": definition.id,
            "name": definition.name,
            "type": definition.type,
            "category": definition.category.value,
            "description": definition.description,
            "properties": [
                {
                    "name": p.name,
                    "type": p.type,
                    "default": p.default,
                    "required": p.required,
                    "options": p.options,
                    "description": p.description
                }
                for p in definition.properties
            ],
            "accepts_children": definition.accepts_children,
            "icon": definition.icon,
            "theme_tokens": definition.theme_tokens,
            "responsive": definition.responsive,
            "accessible": definition.accessible
        }


# Initialize the library on module load
ComponentLibraryEngine.initialize_library()
