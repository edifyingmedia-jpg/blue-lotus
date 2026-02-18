# Canvas Routes - Builder canvas operations
from fastapi import APIRouter, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional
from datetime import datetime, timezone
from pydantic import BaseModel

from routes.auth import get_current_user
from engines.canvas_engine import (
    BuilderCanvasEngine, CanvasState, ViewportSize, PreviewType
)

router = APIRouter(prefix="/canvas", tags=["Canvas"])


class AddComponentRequest(BaseModel):
    screen_id: str
    parent_id: str
    component_type: str
    component_name: str
    props: dict = {}
    styles: dict = {}


class UpdatePropsRequest(BaseModel):
    screen_id: str
    node_id: str
    props: dict


class DataBindingRequest(BaseModel):
    screen_id: str
    node_id: str
    binding: dict


def create_canvas_routes(db: AsyncIOMotorDatabase):
    """Create canvas routes with database dependency."""
    
    @router.get("/{project_id}/{screen_name}")
    async def get_canvas(
        project_id: str,
        screen_name: str,
        authorization: Optional[str] = Header(None)
    ):
        """Get or create canvas state for a screen."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Check project ownership
        project = await db.projects.find_one(
            {"id": project_id, "user_id": user.id},
            {"_id": 0}
        )
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Check if canvas exists
        canvas_doc = await db.canvas_states.find_one(
            {"project_id": project_id, "screen_name": screen_name},
            {"_id": 0}
        )
        
        if canvas_doc:
            return canvas_doc
        
        # Create new canvas with default layout
        screen_id = f"{project_id}_{screen_name}"
        canvas = BuilderCanvasEngine.create_canvas_state(
            project_id, screen_id, screen_name
        )
        
        # Generate default layout based on screen type
        default_root = BuilderCanvasEngine.generate_default_screen_layout(screen_name)
        canvas.root_node = default_root
        
        # Save to database
        canvas_doc = canvas.model_dump()
        canvas_doc["updated_at"] = canvas_doc["updated_at"].isoformat()
        await db.canvas_states.insert_one(canvas_doc)
        
        return canvas_doc
    
    @router.post("/component/add")
    async def add_component(
        request: AddComponentRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Add a component to the canvas."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Get canvas state
        canvas_doc = await db.canvas_states.find_one(
            {"screen_id": request.screen_id},
            {"_id": 0}
        )
        
        if not canvas_doc:
            raise HTTPException(status_code=404, detail="Canvas not found")
        
        # Convert to CanvasState
        if isinstance(canvas_doc.get("updated_at"), str):
            canvas_doc["updated_at"] = datetime.fromisoformat(canvas_doc["updated_at"])
        
        canvas = CanvasState(**canvas_doc)
        
        # Add component
        canvas, new_node, message = BuilderCanvasEngine.add_component(
            canvas,
            request.parent_id,
            request.component_type,
            request.component_name,
            request.props,
            request.styles
        )
        
        if not new_node:
            raise HTTPException(status_code=400, detail=message)
        
        # Update database
        canvas_update = canvas.model_dump()
        canvas_update["updated_at"] = canvas_update["updated_at"].isoformat()
        
        await db.canvas_states.update_one(
            {"screen_id": request.screen_id},
            {"$set": canvas_update}
        )
        
        return {
            "success": True,
            "message": message,
            "node": {
                "id": new_node.id,
                "type": new_node.type,
                "name": new_node.name
            }
        }
    
    @router.post("/component/update-props")
    async def update_component_props(
        request: UpdatePropsRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Update component properties."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        canvas_doc = await db.canvas_states.find_one(
            {"screen_id": request.screen_id},
            {"_id": 0}
        )
        
        if not canvas_doc:
            raise HTTPException(status_code=404, detail="Canvas not found")
        
        if isinstance(canvas_doc.get("updated_at"), str):
            canvas_doc["updated_at"] = datetime.fromisoformat(canvas_doc["updated_at"])
        
        canvas = CanvasState(**canvas_doc)
        canvas, success, message = BuilderCanvasEngine.update_component_props(
            canvas, request.node_id, request.props
        )
        
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        canvas_update = canvas.model_dump()
        canvas_update["updated_at"] = canvas_update["updated_at"].isoformat()
        
        await db.canvas_states.update_one(
            {"screen_id": request.screen_id},
            {"$set": canvas_update}
        )
        
        return {"success": True, "message": message}
    
    @router.post("/component/bind-data")
    async def bind_data(
        request: DataBindingRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Bind data model fields to a component."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        canvas_doc = await db.canvas_states.find_one(
            {"screen_id": request.screen_id},
            {"_id": 0}
        )
        
        if not canvas_doc:
            raise HTTPException(status_code=404, detail="Canvas not found")
        
        if isinstance(canvas_doc.get("updated_at"), str):
            canvas_doc["updated_at"] = datetime.fromisoformat(canvas_doc["updated_at"])
        
        canvas = CanvasState(**canvas_doc)
        canvas, success, message = BuilderCanvasEngine.bind_data(
            canvas, request.node_id, request.binding
        )
        
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        canvas_update = canvas.model_dump()
        canvas_update["updated_at"] = canvas_update["updated_at"].isoformat()
        
        await db.canvas_states.update_one(
            {"screen_id": request.screen_id},
            {"$set": canvas_update}
        )
        
        return {"success": True, "message": message}
    
    @router.get("/preview/{screen_id}")
    async def get_preview(
        screen_id: str,
        viewport: str = "desktop",
        authorization: Optional[str] = Header(None)
    ):
        """Get a preview of the canvas."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        canvas_doc = await db.canvas_states.find_one(
            {"screen_id": screen_id},
            {"_id": 0}
        )
        
        if not canvas_doc:
            raise HTTPException(status_code=404, detail="Canvas not found")
        
        if isinstance(canvas_doc.get("updated_at"), str):
            canvas_doc["updated_at"] = datetime.fromisoformat(canvas_doc["updated_at"])
        
        canvas = CanvasState(**canvas_doc)
        
        # Set viewport
        try:
            vp = ViewportSize(viewport)
            canvas = BuilderCanvasEngine.set_viewport(canvas, vp)
        except ValueError:
            pass
        
        preview = BuilderCanvasEngine.generate_preview(canvas)
        
        return {
            "preview_type": preview.preview_type.value,
            "name": preview.name,
            "structure": preview.structure,
            "viewport": canvas.viewport.value,
            "dimensions": BuilderCanvasEngine.VIEWPORT_DIMENSIONS.get(canvas.viewport),
            "responsive_breakpoints": preview.responsive_breakpoints
        }
    
    @router.get("/tree/{screen_id}")
    async def get_component_tree(
        screen_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Get the component tree for the canvas."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        canvas_doc = await db.canvas_states.find_one(
            {"screen_id": screen_id},
            {"_id": 0}
        )
        
        if not canvas_doc:
            raise HTTPException(status_code=404, detail="Canvas not found")
        
        if isinstance(canvas_doc.get("updated_at"), str):
            canvas_doc["updated_at"] = datetime.fromisoformat(canvas_doc["updated_at"])
        
        canvas = CanvasState(**canvas_doc)
        tree = BuilderCanvasEngine.get_component_tree(canvas)
        
        return {"tree": tree}
    
    return router
