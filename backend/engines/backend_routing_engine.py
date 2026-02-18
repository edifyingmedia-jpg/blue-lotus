# Backend Routing Engine - Route API calls and bind to components
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class RouteType(str, Enum):
    DATA_FETCH = "data_fetch"  # Load data into component
    DATA_SUBMIT = "data_submit"  # Submit form data
    ACTION = "action"  # Trigger an action
    NAVIGATION = "navigation"  # Navigate based on response


class TriggerType(str, Enum):
    ON_LOAD = "on_load"  # When screen loads
    ON_CLICK = "on_click"  # When button clicked
    ON_SUBMIT = "on_submit"  # When form submitted
    ON_CHANGE = "on_change"  # When value changes
    ON_INTERVAL = "on_interval"  # Periodic refresh
    MANUAL = "manual"  # Triggered programmatically


class DataBinding(BaseModel):
    """Binding between API response and component."""
    binding_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    source_path: str  # Path in API response (e.g., "data.users")
    target_component: str  # Component ID
    target_property: str  # Property to bind (e.g., "items", "value")
    transform: Optional[str] = None  # Optional transform expression


class ApiRoute(BaseModel):
    """A route binding an endpoint to components."""
    route_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    screen_id: str
    name: str
    endpoint_id: str
    route_type: RouteType
    trigger: TriggerType
    trigger_config: Dict[str, Any] = {}  # e.g., {"component_id": "submit_btn"} for ON_CLICK
    bindings: List[DataBinding] = []
    error_handler: Optional[str] = None  # Component to show on error
    loading_indicator: Optional[str] = None  # Component to show while loading
    success_action: Optional[Dict[str, Any]] = None  # Action on success
    is_active: bool = True


class RouteExecutionContext(BaseModel):
    """Context for executing a route."""
    route_id: str
    screen_id: str
    user_id: str
    params: Dict[str, Any] = {}  # URL params, form data, etc.
    local_state: Dict[str, Any] = {}  # Screen local state


class BackendRoutingEngine:
    """
    Backend Routing Engine.
    
    Responsibilities:
    - Route API calls to the right endpoints
    - Bind API responses to components
    - Handle loading states
    - Handle error states
    - Support various triggers (on_load, on_click, etc.)
    """
    
    @classmethod
    def create_route(
        cls,
        project_id: str,
        screen_id: str,
        name: str,
        endpoint_id: str,
        route_type: RouteType,
        trigger: TriggerType,
        bindings: List[Dict[str, str]] = None,
        trigger_config: Dict[str, Any] = None
    ) -> ApiRoute:
        """Create a new API route."""
        binding_objects = []
        if bindings:
            for b in bindings:
                binding_objects.append(DataBinding(
                    source_path=b.get("source", ""),
                    target_component=b.get("component", ""),
                    target_property=b.get("property", "value")
                ))
        
        return ApiRoute(
            project_id=project_id,
            screen_id=screen_id,
            name=name,
            endpoint_id=endpoint_id,
            route_type=route_type,
            trigger=trigger,
            trigger_config=trigger_config or {},
            bindings=binding_objects
        )
    
    @classmethod
    def get_routes_for_screen(
        cls,
        routes: List[ApiRoute],
        screen_id: str
    ) -> List[ApiRoute]:
        """Get all routes for a specific screen."""
        return [r for r in routes if r.screen_id == screen_id and r.is_active]
    
    @classmethod
    def get_on_load_routes(cls, routes: List[ApiRoute], screen_id: str) -> List[ApiRoute]:
        """Get routes that should execute on screen load."""
        screen_routes = cls.get_routes_for_screen(routes, screen_id)
        return [r for r in screen_routes if r.trigger == TriggerType.ON_LOAD]
    
    @classmethod
    def get_routes_for_component(
        cls,
        routes: List[ApiRoute],
        screen_id: str,
        component_id: str
    ) -> List[ApiRoute]:
        """Get routes triggered by a specific component."""
        screen_routes = cls.get_routes_for_screen(routes, screen_id)
        return [
            r for r in screen_routes
            if r.trigger_config.get("component_id") == component_id
        ]
    
    @classmethod
    def apply_bindings(
        cls,
        response_data: Any,
        bindings: List[DataBinding]
    ) -> Dict[str, Dict[str, Any]]:
        """Apply bindings to extract data for components."""
        result = {}
        
        for binding in bindings:
            value = cls._extract_value(response_data, binding.source_path)
            
            if binding.transform:
                value = cls._apply_transform(value, binding.transform)
            
            if binding.target_component not in result:
                result[binding.target_component] = {}
            
            result[binding.target_component][binding.target_property] = value
        
        return result
    
    @classmethod
    def _extract_value(cls, data: Any, path: str) -> Any:
        """Extract value from nested data using dot notation."""
        if not path:
            return data
        
        keys = path.split('.')
        value = data
        
        for key in keys:
            if value is None:
                return None
            if isinstance(value, dict):
                value = value.get(key)
            elif isinstance(value, list):
                if key.isdigit():
                    idx = int(key)
                    value = value[idx] if idx < len(value) else None
                elif key == '*':
                    # Return all items
                    return value
            else:
                return None
        
        return value
    
    @classmethod
    def _apply_transform(cls, value: Any, transform: str) -> Any:
        """Apply a transform expression to a value."""
        # Simple transform expressions
        if transform == "count":
            return len(value) if isinstance(value, (list, dict, str)) else 0
        elif transform == "first":
            return value[0] if isinstance(value, list) and value else None
        elif transform == "last":
            return value[-1] if isinstance(value, list) and value else None
        elif transform == "keys":
            return list(value.keys()) if isinstance(value, dict) else []
        elif transform == "values":
            return list(value.values()) if isinstance(value, dict) else []
        elif transform == "string":
            return str(value) if value is not None else ""
        elif transform == "json":
            import json
            return json.dumps(value) if value is not None else "{}"
        
        return value
    
    @classmethod
    def build_screen_routes(
        cls,
        project_id: str,
        screen_id: str,
        data_source: str,
        list_component: str,
        detail_component: Optional[str] = None
    ) -> List[ApiRoute]:
        """Build standard routes for a data-driven screen."""
        routes = [
            ApiRoute(
                project_id=project_id,
                screen_id=screen_id,
                name=f"Load {data_source}",
                endpoint_id=f"{data_source}_list",
                route_type=RouteType.DATA_FETCH,
                trigger=TriggerType.ON_LOAD,
                bindings=[
                    DataBinding(
                        source_path="data",
                        target_component=list_component,
                        target_property="items"
                    )
                ]
            )
        ]
        
        if detail_component:
            routes.append(ApiRoute(
                project_id=project_id,
                screen_id=screen_id,
                name=f"Load {data_source} Detail",
                endpoint_id=f"{data_source}_get",
                route_type=RouteType.DATA_FETCH,
                trigger=TriggerType.ON_CLICK,
                trigger_config={"component_id": list_component},
                bindings=[
                    DataBinding(
                        source_path="data",
                        target_component=detail_component,
                        target_property="data"
                    )
                ]
            ))
        
        return routes
    
    @classmethod
    def get_route_summary(cls, route: ApiRoute) -> Dict[str, Any]:
        """Get a summary of a route for display."""
        return {
            "id": route.route_id,
            "name": route.name,
            "type": route.route_type.value,
            "trigger": route.trigger.value,
            "bindings_count": len(route.bindings),
            "is_active": route.is_active
        }
