# Navigation Engine - Manages navigation structures and flows
from typing import Dict, List, Optional, Tuple, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class NavigationType(str, Enum):
    STACK = "stack"
    TABS = "tabs"
    DRAWER = "drawer"
    MODAL = "modal"
    CUSTOM_FLOW = "custom_flow"


class NavigationNode(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    screen_id: str
    screen_name: str
    children: List[str] = []  # List of child node IDs
    navigation_type: NavigationType = NavigationType.STACK
    is_root: bool = False
    is_modal: bool = False
    params: Dict[str, Any] = {}


class NavigationStructure(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    root_node_id: Optional[str] = None
    nodes: Dict[str, NavigationNode] = {}  # node_id -> NavigationNode
    tab_bar: List[str] = []  # List of node IDs for tab bar
    drawer_items: List[str] = []  # List of node IDs for drawer
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class NavigationEngine:
    """
    Navigation Engine handles navigation structure generation and management.
    
    Rules:
    - Must have a root screen
    - No dead-end routes
    - No orphan screens
    - Max navigation depth of 10
    """
    
    MAX_NAVIGATION_DEPTH = 10
    
    @staticmethod
    def create_structure(project_id: str) -> NavigationStructure:
        """Create a new navigation structure for a project."""
        return NavigationStructure(project_id=project_id)
    
    @staticmethod
    def add_node(
        structure: NavigationStructure,
        screen_id: str,
        screen_name: str,
        navigation_type: NavigationType = NavigationType.STACK,
        is_root: bool = False,
        is_modal: bool = False,
        parent_id: Optional[str] = None
    ) -> Tuple[NavigationStructure, NavigationNode, str]:
        """
        Add a navigation node to the structure.
        Returns: (updated_structure, new_node, message)
        """
        node = NavigationNode(
            screen_id=screen_id,
            screen_name=screen_name,
            navigation_type=navigation_type,
            is_root=is_root,
            is_modal=is_modal
        )
        
        structure.nodes[node.id] = node
        
        if is_root:
            structure.root_node_id = node.id
        
        # Add to parent's children if parent specified
        if parent_id and parent_id in structure.nodes:
            structure.nodes[parent_id].children.append(node.id)
        
        structure.updated_at = datetime.now(timezone.utc)
        
        return structure, node, f"Added navigation node for '{screen_name}'"
    
    @staticmethod
    def remove_node(
        structure: NavigationStructure,
        node_id: str
    ) -> Tuple[NavigationStructure, bool, str]:
        """Remove a navigation node."""
        if node_id not in structure.nodes:
            return structure, False, "Node not found"
        
        node = structure.nodes[node_id]
        
        # Cannot remove root node
        if node.is_root:
            return structure, False, "Cannot remove root node"
        
        # Remove from parent's children
        for n in structure.nodes.values():
            if node_id in n.children:
                n.children.remove(node_id)
        
        # Remove from tab bar and drawer
        if node_id in structure.tab_bar:
            structure.tab_bar.remove(node_id)
        if node_id in structure.drawer_items:
            structure.drawer_items.remove(node_id)
        
        # Delete the node
        del structure.nodes[node_id]
        structure.updated_at = datetime.now(timezone.utc)
        
        return structure, True, f"Removed navigation node"
    
    @staticmethod
    def link_screens(
        structure: NavigationStructure,
        from_node_id: str,
        to_node_id: str
    ) -> Tuple[NavigationStructure, bool, str]:
        """Create a navigation link between two screens."""
        if from_node_id not in structure.nodes:
            return structure, False, "Source node not found"
        if to_node_id not in structure.nodes:
            return structure, False, "Target node not found"
        
        if to_node_id not in structure.nodes[from_node_id].children:
            structure.nodes[from_node_id].children.append(to_node_id)
            structure.updated_at = datetime.now(timezone.utc)
        
        return structure, True, "Screens linked"
    
    @staticmethod
    def set_tab_bar(
        structure: NavigationStructure,
        node_ids: List[str]
    ) -> Tuple[NavigationStructure, bool, str]:
        """Set the tab bar items."""
        # Validate all node IDs exist
        for node_id in node_ids:
            if node_id not in structure.nodes:
                return structure, False, f"Node {node_id} not found"
        
        structure.tab_bar = node_ids
        
        # Update navigation type for tab bar items
        for node_id in node_ids:
            structure.nodes[node_id].navigation_type = NavigationType.TABS
        
        structure.updated_at = datetime.now(timezone.utc)
        return structure, True, f"Tab bar set with {len(node_ids)} items"
    
    @staticmethod
    def set_drawer(
        structure: NavigationStructure,
        node_ids: List[str]
    ) -> Tuple[NavigationStructure, bool, str]:
        """Set the drawer/sidebar items."""
        for node_id in node_ids:
            if node_id not in structure.nodes:
                return structure, False, f"Node {node_id} not found"
        
        structure.drawer_items = node_ids
        
        for node_id in node_ids:
            structure.nodes[node_id].navigation_type = NavigationType.DRAWER
        
        structure.updated_at = datetime.now(timezone.utc)
        return structure, True, f"Drawer set with {len(node_ids)} items"
    
    @staticmethod
    def validate_structure(structure: NavigationStructure) -> Tuple[bool, List[str]]:
        """
        Validate the navigation structure.
        Returns: (is_valid, list_of_errors)
        """
        errors = []
        
        # Must have root screen
        if not structure.root_node_id:
            errors.append("Navigation must have a root screen")
        elif structure.root_node_id not in structure.nodes:
            errors.append("Root node not found in structure")
        
        if not structure.nodes:
            errors.append("Navigation has no screens")
            return False, errors
        
        # Check for orphan screens (not reachable from root)
        if structure.root_node_id:
            reachable = set()
            
            def traverse(node_id, depth=0):
                if depth > NavigationEngine.MAX_NAVIGATION_DEPTH:
                    return
                if node_id in reachable:
                    return
                reachable.add(node_id)
                if node_id in structure.nodes:
                    for child_id in structure.nodes[node_id].children:
                        traverse(child_id, depth + 1)
            
            traverse(structure.root_node_id)
            
            # Add tab bar and drawer items to reachable
            reachable.update(structure.tab_bar)
            reachable.update(structure.drawer_items)
            
            orphans = set(structure.nodes.keys()) - reachable
            if orphans:
                orphan_names = [structure.nodes[oid].screen_name for oid in orphans if oid in structure.nodes]
                errors.append(f"Orphan screens detected: {', '.join(orphan_names)}")
        
        # Check navigation depth
        def check_depth(node_id, current_depth=0):
            if current_depth > NavigationEngine.MAX_NAVIGATION_DEPTH:
                return current_depth
            max_depth = current_depth
            if node_id in structure.nodes:
                for child_id in structure.nodes[node_id].children:
                    child_depth = check_depth(child_id, current_depth + 1)
                    max_depth = max(max_depth, child_depth)
            return max_depth
        
        if structure.root_node_id:
            depth = check_depth(structure.root_node_id)
            if depth > NavigationEngine.MAX_NAVIGATION_DEPTH:
                errors.append(f"Navigation depth ({depth}) exceeds maximum ({NavigationEngine.MAX_NAVIGATION_DEPTH})")
        
        return len(errors) == 0, errors
    
    @staticmethod
    def get_navigation_schema(structure: NavigationStructure) -> Dict[str, Any]:
        """Get JSON schema representation of navigation structure."""
        return {
            "id": structure.id,
            "project_id": structure.project_id,
            "root": structure.root_node_id,
            "tab_bar": [
                {"id": nid, "name": structure.nodes[nid].screen_name}
                for nid in structure.tab_bar if nid in structure.nodes
            ],
            "drawer": [
                {"id": nid, "name": structure.nodes[nid].screen_name}
                for nid in structure.drawer_items if nid in structure.nodes
            ],
            "nodes": [
                {
                    "id": node.id,
                    "screen_id": node.screen_id,
                    "screen_name": node.screen_name,
                    "type": node.navigation_type.value,
                    "is_root": node.is_root,
                    "is_modal": node.is_modal,
                    "children": node.children
                }
                for node in structure.nodes.values()
            ]
        }
    
    @staticmethod
    def generate_default_navigation(
        project_type: str,
        screens: List[str]
    ) -> NavigationStructure:
        """Generate default navigation structure based on project type."""
        structure = NavigationStructure(project_id="")
        
        if not screens:
            return structure
        
        # Create nodes for all screens
        nodes = []
        for i, screen_name in enumerate(screens):
            node = NavigationNode(
                screen_id=str(uuid.uuid4()),
                screen_name=screen_name,
                is_root=(i == 0)
            )
            structure.nodes[node.id] = node
            nodes.append(node)
            
            if i == 0:
                structure.root_node_id = node.id
        
        # Set up tab bar for apps
        if project_type == "app" and len(nodes) >= 3:
            # Common app tabs: Home, Dashboard/Search, Profile
            tab_nodes = nodes[:min(4, len(nodes))]
            structure.tab_bar = [n.id for n in tab_nodes]
            for n in tab_nodes:
                n.navigation_type = NavigationType.TABS
        
        # Link screens in sequence
        for i in range(len(nodes) - 1):
            nodes[i].children.append(nodes[i + 1].id)
        
        return structure
