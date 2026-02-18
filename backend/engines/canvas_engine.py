# Builder Canvas Engine - Renders screens and pages in the builder
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class PreviewType(str, Enum):
    SCREEN = "screen"
    PAGE = "page"
    COMPONENT = "component"
    FLOW = "flow"


class ViewportSize(str, Enum):
    MOBILE = "mobile"       # 375px
    TABLET = "tablet"       # 768px
    DESKTOP = "desktop"     # 1280px
    WIDE = "wide"           # 1920px


class CanvasNode(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str  # Component type
    name: str
    props: Dict[str, Any] = {}
    children: List["CanvasNode"] = []
    data_binding: Optional[Dict[str, str]] = None  # field -> model.field mapping
    styles: Dict[str, str] = {}
    parent_id: Optional[str] = None


class CanvasState(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    screen_id: str
    screen_name: str
    root_node: Optional[CanvasNode] = None
    viewport: ViewportSize = ViewportSize.DESKTOP
    zoom: float = 1.0
    selected_node_id: Optional[str] = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CanvasPreview(BaseModel):
    preview_type: PreviewType
    name: str
    structure: Dict[str, Any]
    responsive_breakpoints: Dict[str, Any] = {}


class BuilderCanvasEngine:
    """
    Builder Canvas Engine renders screens and pages in the builder.
    
    Responsibilities:
    - Render screens and pages in the builder
    - Handle drag-free, no-code editing
    - Display component hierarchy
    - Manage real-time updates
    - Bind data models to UI components
    - Preview navigation flows
    - Preview responsive layouts
    
    Rules:
    - No drag required
    - No code exposed
    - Always render structured output
    - Prevent invalid layouts
    - Respect navigation engine
    """
    
    # Viewport dimensions
    VIEWPORT_DIMENSIONS = {
        ViewportSize.MOBILE: {"width": 375, "height": 812},
        ViewportSize.TABLET: {"width": 768, "height": 1024},
        ViewportSize.DESKTOP: {"width": 1280, "height": 800},
        ViewportSize.WIDE: {"width": 1920, "height": 1080},
    }
    
    @staticmethod
    def create_canvas_state(
        project_id: str,
        screen_id: str,
        screen_name: str
    ) -> CanvasState:
        """Create a new canvas state for a screen."""
        root_node = CanvasNode(
            type="Container",
            name="Root",
            props={"layout": "vertical"},
            styles={"padding": "16px"}
        )
        
        return CanvasState(
            project_id=project_id,
            screen_id=screen_id,
            screen_name=screen_name,
            root_node=root_node
        )
    
    @staticmethod
    def add_component(
        canvas: CanvasState,
        parent_id: str,
        component_type: str,
        component_name: str,
        props: Dict[str, Any] = None,
        styles: Dict[str, str] = None
    ) -> Tuple[CanvasState, CanvasNode, str]:
        """Add a component to the canvas."""
        if not canvas.root_node:
            return canvas, None, "Canvas has no root node"
        
        new_node = CanvasNode(
            type=component_type,
            name=component_name,
            props=props or {},
            styles=styles or {},
            parent_id=parent_id
        )
        
        # Find parent and add child
        def add_to_parent(node: CanvasNode) -> bool:
            if node.id == parent_id:
                node.children.append(new_node)
                return True
            for child in node.children:
                if add_to_parent(child):
                    return True
            return False
        
        if not add_to_parent(canvas.root_node):
            return canvas, None, f"Parent node {parent_id} not found"
        
        canvas.updated_at = datetime.now(timezone.utc)
        return canvas, new_node, f"Added {component_name} component"
    
    @staticmethod
    def remove_component(
        canvas: CanvasState,
        node_id: str
    ) -> Tuple[CanvasState, bool, str]:
        """Remove a component from the canvas."""
        if not canvas.root_node:
            return canvas, False, "Canvas has no root node"
        
        if canvas.root_node.id == node_id:
            return canvas, False, "Cannot remove root node"
        
        def remove_from_parent(node: CanvasNode) -> bool:
            for i, child in enumerate(node.children):
                if child.id == node_id:
                    node.children.pop(i)
                    return True
                if remove_from_parent(child):
                    return True
            return False
        
        if not remove_from_parent(canvas.root_node):
            return canvas, False, f"Node {node_id} not found"
        
        canvas.updated_at = datetime.now(timezone.utc)
        return canvas, True, "Component removed"
    
    @staticmethod
    def update_component_props(
        canvas: CanvasState,
        node_id: str,
        props: Dict[str, Any]
    ) -> Tuple[CanvasState, bool, str]:
        """Update component properties."""
        def find_and_update(node: CanvasNode) -> bool:
            if node.id == node_id:
                node.props.update(props)
                return True
            for child in node.children:
                if find_and_update(child):
                    return True
            return False
        
        if not canvas.root_node or not find_and_update(canvas.root_node):
            return canvas, False, f"Node {node_id} not found"
        
        canvas.updated_at = datetime.now(timezone.utc)
        return canvas, True, "Properties updated"
    
    @staticmethod
    def bind_data(
        canvas: CanvasState,
        node_id: str,
        binding: Dict[str, str]
    ) -> Tuple[CanvasState, bool, str]:
        """Bind data model fields to a component."""
        def find_and_bind(node: CanvasNode) -> bool:
            if node.id == node_id:
                node.data_binding = binding
                return True
            for child in node.children:
                if find_and_bind(child):
                    return True
            return False
        
        if not canvas.root_node or not find_and_bind(canvas.root_node):
            return canvas, False, f"Node {node_id} not found"
        
        canvas.updated_at = datetime.now(timezone.utc)
        return canvas, True, f"Data binding set: {binding}"
    
    @staticmethod
    def set_viewport(
        canvas: CanvasState,
        viewport: ViewportSize
    ) -> CanvasState:
        """Set the preview viewport size."""
        canvas.viewport = viewport
        canvas.updated_at = datetime.now(timezone.utc)
        return canvas
    
    @staticmethod
    def set_zoom(
        canvas: CanvasState,
        zoom: float
    ) -> CanvasState:
        """Set the canvas zoom level."""
        canvas.zoom = max(0.25, min(2.0, zoom))  # Clamp between 25% and 200%
        canvas.updated_at = datetime.now(timezone.utc)
        return canvas
    
    @staticmethod
    def generate_preview(
        canvas: CanvasState,
        preview_type: PreviewType = PreviewType.SCREEN
    ) -> CanvasPreview:
        """Generate a preview structure for rendering."""
        def node_to_dict(node: CanvasNode) -> Dict[str, Any]:
            return {
                "id": node.id,
                "type": node.type,
                "name": node.name,
                "props": node.props,
                "styles": node.styles,
                "data_binding": node.data_binding,
                "children": [node_to_dict(c) for c in node.children]
            }
        
        structure = {}
        if canvas.root_node:
            structure = node_to_dict(canvas.root_node)
        
        # Generate responsive breakpoints
        breakpoints = {}
        for viewport, dims in BuilderCanvasEngine.VIEWPORT_DIMENSIONS.items():
            breakpoints[viewport.value] = dims
        
        return CanvasPreview(
            preview_type=preview_type,
            name=canvas.screen_name,
            structure=structure,
            responsive_breakpoints=breakpoints
        )
    
    @staticmethod
    def get_component_tree(canvas: CanvasState) -> List[Dict[str, Any]]:
        """Get a flat tree representation for the component panel."""
        tree = []
        
        def traverse(node: CanvasNode, depth: int = 0):
            tree.append({
                "id": node.id,
                "type": node.type,
                "name": node.name,
                "depth": depth,
                "has_children": len(node.children) > 0,
                "parent_id": node.parent_id
            })
            for child in node.children:
                traverse(child, depth + 1)
        
        if canvas.root_node:
            traverse(canvas.root_node)
        
        return tree
    
    @staticmethod
    def generate_default_screen_layout(screen_type: str) -> CanvasNode:
        """Generate a default layout for common screen types."""
        layouts = {
            "dashboard": CanvasNode(
                type="Container",
                name="DashboardRoot",
                props={"layout": "vertical"},
                children=[
                    CanvasNode(type="Header", name="DashboardHeader", props={"title": "Dashboard"}),
                    CanvasNode(
                        type="Grid",
                        name="StatsGrid",
                        props={"columns": 4},
                        children=[
                            CanvasNode(type="StatsCard", name="Stat1", props={"label": "Total Users"}),
                            CanvasNode(type="StatsCard", name="Stat2", props={"label": "Revenue"}),
                            CanvasNode(type="StatsCard", name="Stat3", props={"label": "Orders"}),
                            CanvasNode(type="StatsCard", name="Stat4", props={"label": "Growth"}),
                        ]
                    ),
                    CanvasNode(type="Chart", name="MainChart", props={"type": "line"}),
                    CanvasNode(type="DataTable", name="RecentActivity", props={"title": "Recent Activity"}),
                ]
            ),
            "profile": CanvasNode(
                type="Container",
                name="ProfileRoot",
                props={"layout": "vertical"},
                children=[
                    CanvasNode(type="Header", name="ProfileHeader", props={"title": "Profile"}),
                    CanvasNode(type="Avatar", name="UserAvatar", props={"size": "large"}),
                    CanvasNode(type="Text", name="UserName", props={"variant": "h2"}),
                    CanvasNode(type="Text", name="UserEmail", props={"variant": "body"}),
                    CanvasNode(type="Button", name="EditButton", props={"label": "Edit Profile"}),
                ]
            ),
            "login": CanvasNode(
                type="Container",
                name="LoginRoot",
                props={"layout": "vertical", "align": "center"},
                children=[
                    CanvasNode(type="Logo", name="AppLogo"),
                    CanvasNode(type="Text", name="Title", props={"text": "Welcome Back", "variant": "h1"}),
                    CanvasNode(type="Input", name="EmailInput", props={"type": "email", "label": "Email"}),
                    CanvasNode(type="Input", name="PasswordInput", props={"type": "password", "label": "Password"}),
                    CanvasNode(type="Button", name="LoginButton", props={"label": "Log In", "variant": "primary"}),
                    CanvasNode(type="Link", name="ForgotPassword", props={"text": "Forgot Password?"}),
                ]
            ),
            "landing": CanvasNode(
                type="Container",
                name="LandingRoot",
                props={"layout": "vertical"},
                children=[
                    CanvasNode(type="Hero", name="HeroSection", props={"title": "Welcome"}),
                    CanvasNode(type="Features", name="FeaturesSection", props={"columns": 3}),
                    CanvasNode(type="Testimonials", name="TestimonialsSection"),
                    CanvasNode(type="CTA", name="CTASection", props={"title": "Get Started"}),
                    CanvasNode(type="Footer", name="FooterSection"),
                ]
            ),
        }
        
        screen_lower = screen_type.lower()
        for key, layout in layouts.items():
            if key in screen_lower:
                return layout
        
        # Default layout
        return CanvasNode(
            type="Container",
            name="Root",
            props={"layout": "vertical"},
            children=[
                CanvasNode(type="Header", name="Header", props={"title": screen_type}),
                CanvasNode(type="Content", name="MainContent"),
            ]
        )
