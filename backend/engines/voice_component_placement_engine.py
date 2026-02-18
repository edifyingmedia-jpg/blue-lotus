# Voice Component Placement Engine - Place UI components using voice commands
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
import uuid


class ComponentType(str, Enum):
    BUTTON = "button"
    TEXT = "text"
    IMAGE = "image"
    INPUT = "input"
    FORM = "form"
    LIST = "list"
    CARD = "card"
    HEADER = "header"
    FOOTER = "footer"
    NAVBAR = "navbar"
    CONTAINER = "container"
    DIVIDER = "divider"
    ICON = "icon"
    AVATAR = "avatar"
    BADGE = "badge"
    TOGGLE = "toggle"
    CHECKBOX = "checkbox"
    RADIO = "radio"
    SELECT = "select"
    TEXTAREA = "textarea"
    DATE_PICKER = "date_picker"
    CHART = "chart"
    TABLE = "table"


class Position(str, Enum):
    ABOVE = "above"
    BELOW = "below"
    LEFT_OF = "left_of"
    RIGHT_OF = "right_of"
    INSIDE = "inside"
    AT_TOP = "at_top"
    AT_BOTTOM = "at_bottom"
    CENTERED = "centered"
    START = "start"
    END = "end"


class ComponentPlacement(BaseModel):
    """Component placement specification."""
    component_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    component_type: ComponentType
    position: Position = Position.AT_BOTTOM
    relative_to: Optional[str] = None  # ID of reference component
    properties: Dict[str, Any] = {}
    data_binding: Optional[str] = None  # Data model to bind
    screen_id: Optional[str] = None


class PlacementResult(BaseModel):
    """Result of component placement."""
    success: bool
    placement: Optional[ComponentPlacement] = None
    message: str
    voice_confirmation: str = ""


class VoiceComponentPlacementEngine:
    """
    Voice-Driven Component Placement Engine.
    
    Responsibilities:
    - Place UI components on screens using voice commands
    - Modify component properties via speech
    - Bind components to data models
    - Insert components into layouts intelligently
    - Support relative placement commands
    
    Supported Commands:
    - "Add a button at the bottom of the screen"
    - "Place an image above the title"
    - "Add a list bound to the Product model"
    - "Insert a form with name, email, and phone fields"
    
    Placement Logic:
    - Relative positions: above, below, left_of, right_of, inside, at_top, at_bottom, centered
    
    Rules:
    - Must respect layout structure
    - Must use component library
    - Must not break responsive layout
    """
    
    # Component synonyms for voice recognition
    COMPONENT_SYNONYMS = {
        ComponentType.BUTTON: ["button", "btn", "click", "action button", "submit button"],
        ComponentType.TEXT: ["text", "label", "paragraph", "heading", "title"],
        ComponentType.IMAGE: ["image", "picture", "photo", "img", "graphic"],
        ComponentType.INPUT: ["input", "text field", "text box", "field"],
        ComponentType.FORM: ["form", "input form", "data entry"],
        ComponentType.LIST: ["list", "items", "collection", "listing"],
        ComponentType.CARD: ["card", "panel", "box", "tile"],
        ComponentType.HEADER: ["header", "top bar", "app bar"],
        ComponentType.FOOTER: ["footer", "bottom bar"],
        ComponentType.NAVBAR: ["navbar", "navigation", "nav", "menu"],
        ComponentType.CONTAINER: ["container", "section", "div", "wrapper"],
        ComponentType.DIVIDER: ["divider", "separator", "line"],
        ComponentType.ICON: ["icon", "symbol"],
        ComponentType.AVATAR: ["avatar", "profile picture", "user image"],
        ComponentType.BADGE: ["badge", "tag", "chip", "label"],
        ComponentType.TOGGLE: ["toggle", "switch", "on off"],
        ComponentType.CHECKBOX: ["checkbox", "check box", "tick box"],
        ComponentType.RADIO: ["radio", "radio button", "option"],
        ComponentType.SELECT: ["select", "dropdown", "picker", "combo box"],
        ComponentType.TEXTAREA: ["textarea", "text area", "multiline", "description field"],
        ComponentType.DATE_PICKER: ["date picker", "calendar", "date field"],
        ComponentType.CHART: ["chart", "graph", "visualization"],
        ComponentType.TABLE: ["table", "grid", "data table"],
    }
    
    # Position synonyms
    POSITION_SYNONYMS = {
        Position.ABOVE: ["above", "over", "on top of", "before"],
        Position.BELOW: ["below", "under", "beneath", "after"],
        Position.LEFT_OF: ["left of", "to the left", "before"],
        Position.RIGHT_OF: ["right of", "to the right", "after"],
        Position.INSIDE: ["inside", "within", "in"],
        Position.AT_TOP: ["at the top", "at top", "top of", "beginning"],
        Position.AT_BOTTOM: ["at the bottom", "at bottom", "bottom of", "end"],
        Position.CENTERED: ["centered", "center", "middle", "in the middle"],
        Position.START: ["start", "beginning", "first"],
        Position.END: ["end", "last", "final"],
    }
    
    # Default properties by component type
    DEFAULT_PROPERTIES = {
        ComponentType.BUTTON: {"variant": "primary", "size": "md"},
        ComponentType.TEXT: {"size": "base", "weight": "normal"},
        ComponentType.IMAGE: {"fit": "cover", "rounded": True},
        ComponentType.INPUT: {"placeholder": "Enter text...", "type": "text"},
        ComponentType.FORM: {"layout": "vertical", "submitButton": True},
        ComponentType.LIST: {"layout": "vertical", "showDividers": True},
        ComponentType.CARD: {"shadow": True, "rounded": True},
        ComponentType.TOGGLE: {"defaultValue": False},
    }
    
    @classmethod
    def parse_placement_command(cls, command: str) -> Tuple[Optional[ComponentType], Optional[Position], Dict[str, Any]]:
        """Parse a voice command to extract component type, position, and properties."""
        command_lower = command.lower()
        
        # Detect component type
        component_type = None
        for comp_type, synonyms in cls.COMPONENT_SYNONYMS.items():
            if any(syn in command_lower for syn in synonyms):
                component_type = comp_type
                break
        
        # Detect position
        position = Position.AT_BOTTOM  # Default
        for pos, synonyms in cls.POSITION_SYNONYMS.items():
            if any(syn in command_lower for syn in synonyms):
                position = pos
                break
        
        # Extract properties
        properties = {}
        
        # Detect data binding
        if "bound to" in command_lower or "connected to" in command_lower or "from" in command_lower:
            # Extract model name
            import re
            model_match = re.search(r'(?:bound to|connected to|from)(?: the)?\s+(\w+)', command_lower)
            if model_match:
                properties["data_binding"] = model_match.group(1).title()
        
        # Detect form fields
        if component_type == ComponentType.FORM:
            field_keywords = ["name", "email", "phone", "password", "address", "city", "state", "zip", "country", "message", "description", "title"]
            detected_fields = [kw for kw in field_keywords if kw in command_lower]
            if detected_fields:
                properties["fields"] = detected_fields
        
        # Detect list items
        if "items" in command_lower or "elements" in command_lower:
            import re
            items_match = re.search(r'(\d+)\s*items?', command_lower)
            if items_match:
                properties["itemCount"] = int(items_match.group(1))
        
        return component_type, position, properties
    
    @classmethod
    def place_component(
        cls,
        command: str,
        screen_id: str,
        current_components: List[Dict[str, Any]] = None
    ) -> PlacementResult:
        """Place a component based on voice command."""
        component_type, position, extra_props = cls.parse_placement_command(command)
        
        if not component_type:
            return PlacementResult(
                success=False,
                message="I couldn't understand what component you want to add. Try saying 'Add a button' or 'Add a form'.",
                voice_confirmation="I didn't understand the component type. What would you like to add?"
            )
        
        # Get default properties
        properties = cls.DEFAULT_PROPERTIES.get(component_type, {}).copy()
        properties.update(extra_props)
        
        # Handle data binding
        data_binding = properties.pop("data_binding", None)
        
        placement = ComponentPlacement(
            component_type=component_type,
            position=position,
            properties=properties,
            data_binding=data_binding,
            screen_id=screen_id
        )
        
        # Generate confirmation message
        position_text = position.value.replace("_", " ")
        component_name = component_type.value.replace("_", " ")
        
        text_msg = f"Added a {component_name} {position_text}."
        voice_msg = f"Done! I've added a {component_name} {position_text}."
        
        if data_binding:
            text_msg += f" Bound to {data_binding} model."
            voice_msg += f" It's bound to the {data_binding} model."
        
        if "fields" in properties:
            fields_str = ", ".join(properties["fields"])
            text_msg += f" Fields: {fields_str}."
            voice_msg += f" With fields for {fields_str}."
        
        return PlacementResult(
            success=True,
            placement=placement,
            message=text_msg,
            voice_confirmation=voice_msg
        )
    
    @classmethod
    def modify_component(
        cls,
        command: str,
        component_id: str,
        current_properties: Dict[str, Any]
    ) -> PlacementResult:
        """Modify an existing component based on voice command."""
        command_lower = command.lower()
        updated_props = current_properties.copy()
        changes = []
        
        # Size modifications
        if "bigger" in command_lower or "larger" in command_lower:
            updated_props["size"] = "lg"
            changes.append("made it larger")
        elif "smaller" in command_lower:
            updated_props["size"] = "sm"
            changes.append("made it smaller")
        
        # Color modifications
        colors = ["red", "blue", "green", "yellow", "purple", "orange", "black", "white", "gray"]
        for color in colors:
            if color in command_lower:
                updated_props["color"] = color
                changes.append(f"changed color to {color}")
                break
        
        # Style modifications
        if "rounded" in command_lower or "round" in command_lower:
            updated_props["rounded"] = True
            changes.append("made it rounded")
        elif "square" in command_lower or "sharp" in command_lower:
            updated_props["rounded"] = False
            changes.append("made it square")
        
        # Visibility
        if "hide" in command_lower or "hidden" in command_lower:
            updated_props["visible"] = False
            changes.append("hidden it")
        elif "show" in command_lower or "visible" in command_lower:
            updated_props["visible"] = True
            changes.append("made it visible")
        
        if not changes:
            return PlacementResult(
                success=False,
                message="I couldn't understand what changes you want to make.",
                voice_confirmation="What would you like to change about this component?"
            )
        
        placement = ComponentPlacement(
            component_id=component_id,
            component_type=ComponentType.BUTTON,  # Placeholder
            properties=updated_props
        )
        
        changes_str = " and ".join(changes)
        return PlacementResult(
            success=True,
            placement=placement,
            message=f"Updated component: {changes_str}.",
            voice_confirmation=f"Done! I've {changes_str}."
        )
    
    @classmethod
    def get_available_components(cls) -> List[Dict[str, Any]]:
        """Get list of available components."""
        return [
            {
                "type": comp_type.value,
                "name": comp_type.value.replace("_", " ").title(),
                "keywords": cls.COMPONENT_SYNONYMS.get(comp_type, [])
            }
            for comp_type in ComponentType
        ]
    
    @classmethod
    def get_placement_options(cls) -> List[Dict[str, str]]:
        """Get available placement positions."""
        return [
            {
                "position": pos.value,
                "description": pos.value.replace("_", " "),
                "keywords": cls.POSITION_SYNONYMS.get(pos, [])
            }
            for pos in Position
        ]
