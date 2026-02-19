# Builder AI Routes - Smart component generation using GPT
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import json
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/builder", tags=["builder-ai"])

# Import emergent integrations
from emergentintegrations.llm.chat import LlmChat, UserMessage

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")

class GenerateComponentsRequest(BaseModel):
    prompt: str
    current_screen: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class GenerateComponentsResponse(BaseModel):
    success: bool
    components: List[Dict[str, Any]]
    message: str

SYSTEM_PROMPT = """You are a UI component generator for a no-code app builder. When the user describes what they want to build, you generate JSON components.

IMPORTANT RULES:
1. Always return ONLY valid JSON array of components
2. Each component must have: id, type, name, and relevant properties
3. Generate components that match what the user actually asked for
4. Be creative and comprehensive - if they ask for a "video creator", create a full video creation interface

AVAILABLE COMPONENT TYPES:
- header: {id, type: "header", name, content}
- text: {id, type: "text", name, content}
- button: {id, type: "button", name, label, variant: "primary"|"secondary"}
- input: {id, type: "input", name, placeholder, inputType: "text"|"email"|"password"|"number"}
- form: {id, type: "form", name, fields: [{label, type, placeholder}], submitLabel}
- card: {id, type: "card", name, title, content}
- list: {id, type: "list", name, items: [{text, id}]}
- image: {id, type: "image", name, src, alt}
- stats: {id, type: "stats", name, items: [{label, value}]}
- table: {id, type: "table", name, columns: [], rows: [[]]}
- nav: {id, type: "nav", name, items: []}
- video: {id, type: "video", name, src, controls: true}
- container: {id, type: "container", name, title, children: []}
- grid: {id, type: "grid", name, columns: 2, children: []}
- tabs: {id, type: "tabs", name, tabs: [{label, content}]}
- modal: {id, type: "modal", name, title, content}
- progress: {id, type: "progress", name, value, max}
- slider: {id, type: "slider", name, min, max, value}
- toggle: {id, type: "toggle", name, label, checked}
- dropdown: {id, type: "dropdown", name, options: [], placeholder}
- timeline: {id, type: "timeline", name, duration, currentTime}
- upload: {id, type: "upload", name, accept, multiple}

EXAMPLE - User asks "Create a video creator":
[
  {"id": "vc-1", "type": "header", "name": "Video Creator", "content": "Create Your Video"},
  {"id": "vc-2", "type": "upload", "name": "Video Upload", "accept": "video/*", "label": "Upload Video or Drag & Drop"},
  {"id": "vc-3", "type": "container", "name": "Preview", "title": "Video Preview", "children": [
    {"id": "vc-3a", "type": "video", "name": "Preview Player", "src": "", "controls": true}
  ]},
  {"id": "vc-4", "type": "timeline", "name": "Timeline", "duration": 100, "currentTime": 0},
  {"id": "vc-5", "type": "grid", "name": "Controls", "columns": 4, "children": [
    {"id": "vc-5a", "type": "button", "name": "Play", "label": "▶ Play", "variant": "primary"},
    {"id": "vc-5b", "type": "button", "name": "Pause", "label": "⏸ Pause", "variant": "secondary"},
    {"id": "vc-5c", "type": "button", "name": "Trim", "label": "✂ Trim", "variant": "secondary"},
    {"id": "vc-5d", "type": "button", "name": "Export", "label": "📤 Export", "variant": "primary"}
  ]},
  {"id": "vc-6", "type": "container", "name": "Settings", "title": "Export Settings", "children": [
    {"id": "vc-6a", "type": "dropdown", "name": "Format", "options": ["MP4", "WebM", "AVI"], "placeholder": "Select format"},
    {"id": "vc-6b", "type": "dropdown", "name": "Quality", "options": ["720p", "1080p", "4K"], "placeholder": "Select quality"}
  ]}
]

RESPOND WITH ONLY THE JSON ARRAY. NO EXPLANATIONS."""

@router.post("/generate-components", response_model=GenerateComponentsResponse)
async def generate_components(
    request: GenerateComponentsRequest,
    authorization: Optional[str] = Header(None)
):
    """Generate UI components using GPT based on user's natural language prompt"""
    
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")
    
    try:
        # Initialize LLM chat
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"builder-{id(request)}",
            system_message=SYSTEM_PROMPT
        ).with_model("openai", "gpt-5.2")
        
        # Build the prompt
        user_prompt = f"User request: {request.prompt}"
        if request.current_screen:
            user_prompt += f"\nCurrent screen: {request.current_screen}"
        if request.context:
            user_prompt += f"\nContext: {json.dumps(request.context)}"
        
        user_prompt += "\n\nGenerate the JSON array of components:"
        
        # Send to GPT
        user_message = UserMessage(text=user_prompt)
        response = await chat.send_message(user_message)
        
        # Parse the response
        # Clean up the response (remove markdown code blocks if present)
        cleaned = response.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        try:
            components = json.loads(cleaned)
            if not isinstance(components, list):
                components = [components]
        except json.JSONDecodeError:
            # If JSON parsing fails, return error
            return GenerateComponentsResponse(
                success=False,
                components=[],
                message=f"Failed to parse AI response: {response[:200]}"
            )
        
        return GenerateComponentsResponse(
            success=True,
            components=components,
            message=f"Generated {len(components)} component(s)"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

def create_builder_ai_routes():
    return router
