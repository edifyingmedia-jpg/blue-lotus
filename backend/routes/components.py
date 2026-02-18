# Component Library Routes - Access to component definitions
from fastapi import APIRouter, HTTPException
from typing import Optional, List

from engines.component_library_engine import (
    ComponentLibraryEngine, ComponentCategory, ComponentDefinition
)

router = APIRouter(prefix="/components", tags=["Components"])


@router.get("/")
async def get_all_components():
    """Get all available components."""
    components = ComponentLibraryEngine.get_all_components()
    return {
        "count": len(components),
        "components": [
            ComponentLibraryEngine.get_component_schema(c.type)
            for c in components
        ]
    }


@router.get("/categories")
async def get_categories():
    """Get all component categories."""
    return {
        "categories": [
            {"id": cat.value, "name": cat.value.replace("_", " ").title()}
            for cat in ComponentCategory
        ]
    }


@router.get("/category/{category}")
async def get_components_by_category(category: str):
    """Get all components in a category."""
    try:
        cat = ComponentCategory(category)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid category: {category}")
    
    components = ComponentLibraryEngine.get_components_by_category(cat)
    return {
        "category": category,
        "count": len(components),
        "components": [
            ComponentLibraryEngine.get_component_schema(c.type)
            for c in components
        ]
    }


@router.get("/type/{component_type}")
async def get_component(component_type: str):
    """Get a specific component definition."""
    schema = ComponentLibraryEngine.get_component_schema(component_type)
    if not schema:
        raise HTTPException(status_code=404, detail=f"Component not found: {component_type}")
    return schema


@router.get("/theme")
async def get_theme_tokens():
    """Get Blue Lotus theme tokens."""
    return {
        "tokens": ComponentLibraryEngine.get_theme_tokens(),
        "brand": {
            "name": "Blue Lotus",
            "primary": "#4CC3FF",
            "font": "Inter, sans-serif"
        }
    }


@router.post("/validate")
async def validate_component(component_type: str, properties: dict):
    """Validate component properties."""
    is_valid, errors = ComponentLibraryEngine.validate_component_props(
        component_type, properties
    )
    return {
        "valid": is_valid,
        "errors": errors
    }
