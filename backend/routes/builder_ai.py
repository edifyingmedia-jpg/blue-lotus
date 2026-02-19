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
    """Generate UI components using smart template matching (fast) or GPT (for complex requests)"""
    
    prompt_lower = request.prompt.lower()
    
    # Fast local generation for common patterns
    components = generate_components_locally(prompt_lower, request.prompt)
    
    if components:
        return GenerateComponentsResponse(
            success=True,
            components=components,
            message=f"Generated {len(components)} component(s)"
        )
    
    # Fallback to GPT for complex requests (if key available)
    if EMERGENT_LLM_KEY:
        try:
            chat = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=f"builder-{id(request)}",
                system_message=SYSTEM_PROMPT
            ).with_model("openai", "gpt-5.2")
            
            user_prompt = f"User request: {request.prompt}\n\nGenerate the JSON array of components:"
            user_message = UserMessage(text=user_prompt)
            response = await chat.send_message(user_message)
            
            cleaned = response.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()
            
            try:
                gpt_components = json.loads(cleaned)
                if not isinstance(gpt_components, list):
                    gpt_components = [gpt_components]
                return GenerateComponentsResponse(
                    success=True,
                    components=gpt_components,
                    message=f"Generated {len(gpt_components)} component(s) with AI"
                )
            except json.JSONDecodeError:
                pass
        except Exception as e:
            print(f"GPT error: {e}")
    
    # Ultimate fallback
    return GenerateComponentsResponse(
        success=False,
        components=[],
        message="Could not generate components for this request"
    )

def generate_components_locally(prompt_lower: str, original_prompt: str) -> List[Dict[str, Any]]:
    """Fast local component generation based on pattern matching"""
    import uuid
    
    components = []
    
    # Video creator/editor
    if 'video' in prompt_lower and ('creator' in prompt_lower or 'editor' in prompt_lower or 'maker' in prompt_lower):
        components = [
            {"id": f"vc-{uuid.uuid4().hex[:8]}", "type": "header", "name": "Video Creator", "content": "Create Your Video"},
            {"id": f"vc-{uuid.uuid4().hex[:8]}", "type": "upload", "name": "Upload Video", "accept": "video/*", "label": "Upload Video or Drag & Drop"},
            {"id": f"vc-{uuid.uuid4().hex[:8]}", "type": "video", "name": "Preview Player", "src": "", "controls": True},
            {"id": f"vc-{uuid.uuid4().hex[:8]}", "type": "timeline", "name": "Video Timeline", "duration": 100, "currentTime": 0},
            {"id": f"vc-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Video Controls", "columns": 4, "children": [
                {"id": f"btn-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Play", "label": "▶ Play", "variant": "primary"},
                {"id": f"btn-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Pause", "label": "⏸ Pause", "variant": "secondary"},
                {"id": f"btn-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Trim", "label": "✂ Trim", "variant": "secondary"},
                {"id": f"btn-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Export", "label": "📤 Export", "variant": "primary"}
            ]},
            {"id": f"vc-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Export Settings", "title": "Export Options", "children": [
                {"id": f"dd-{uuid.uuid4().hex[:8]}", "type": "dropdown", "name": "Format", "options": ["MP4", "WebM", "AVI", "MOV"], "placeholder": "Select format"},
                {"id": f"dd-{uuid.uuid4().hex[:8]}", "type": "dropdown", "name": "Quality", "options": ["480p", "720p", "1080p", "4K"], "placeholder": "Select quality"}
            ]}
        ]
        return components
    
    # Dashboard
    if 'dashboard' in prompt_lower or 'analytics' in prompt_lower or 'metrics' in prompt_lower:
        components = [
            {"id": f"dash-{uuid.uuid4().hex[:8]}", "type": "header", "name": "Dashboard", "content": "Dashboard Overview"},
            {"id": f"dash-{uuid.uuid4().hex[:8]}", "type": "stats", "name": "Key Metrics", "items": [
                {"label": "Total Users", "value": "12,345"},
                {"label": "Revenue", "value": "$54,321"},
                {"label": "Orders", "value": "1,234"},
                {"label": "Growth", "value": "+15%"}
            ]},
            {"id": f"dash-{uuid.uuid4().hex[:8]}", "type": "table", "name": "Recent Activity", "columns": ["User", "Action", "Date"], "rows": [
                ["John Doe", "Signed up", "Today"],
                ["Jane Smith", "Made purchase", "Yesterday"]
            ]}
        ]
        return components
    
    # Login/Signup form
    if 'login' in prompt_lower or 'signin' in prompt_lower:
        components = [
            {"id": f"auth-{uuid.uuid4().hex[:8]}", "type": "header", "name": "Login", "content": "Welcome Back"},
            {"id": f"auth-{uuid.uuid4().hex[:8]}", "type": "form", "name": "Login Form", "fields": [
                {"label": "Email", "type": "email", "placeholder": "Enter your email"},
                {"label": "Password", "type": "password", "placeholder": "Enter your password"}
            ], "submitLabel": "Sign In"},
            {"id": f"auth-{uuid.uuid4().hex[:8]}", "type": "text", "name": "Forgot Password", "content": "Forgot your password?"}
        ]
        return components
    
    if 'signup' in prompt_lower or 'register' in prompt_lower:
        components = [
            {"id": f"auth-{uuid.uuid4().hex[:8]}", "type": "header", "name": "Sign Up", "content": "Create Account"},
            {"id": f"auth-{uuid.uuid4().hex[:8]}", "type": "form", "name": "Signup Form", "fields": [
                {"label": "Full Name", "type": "text", "placeholder": "Enter your name"},
                {"label": "Email", "type": "email", "placeholder": "Enter your email"},
                {"label": "Password", "type": "password", "placeholder": "Create a password"},
                {"label": "Confirm Password", "type": "password", "placeholder": "Confirm password"}
            ], "submitLabel": "Create Account"}
        ]
        return components
    
    # Contact form
    if 'contact' in prompt_lower:
        fields = []
        if 'name' in prompt_lower:
            fields.append({"label": "Name", "type": "text", "placeholder": "Your name"})
        if 'email' in prompt_lower:
            fields.append({"label": "Email", "type": "email", "placeholder": "Your email"})
        if 'phone' in prompt_lower:
            fields.append({"label": "Phone", "type": "tel", "placeholder": "Your phone"})
        if 'message' in prompt_lower or len(fields) < 2:
            fields.append({"label": "Message", "type": "textarea", "placeholder": "Your message"})
        
        if not fields:
            fields = [
                {"label": "Name", "type": "text", "placeholder": "Your name"},
                {"label": "Email", "type": "email", "placeholder": "Your email"},
                {"label": "Message", "type": "textarea", "placeholder": "Your message"}
            ]
        
        components = [
            {"id": f"contact-{uuid.uuid4().hex[:8]}", "type": "header", "name": "Contact", "content": "Get in Touch"},
            {"id": f"contact-{uuid.uuid4().hex[:8]}", "type": "form", "name": "Contact Form", "fields": fields, "submitLabel": "Send Message"}
        ]
        return components
    
    # Generic form
    if 'form' in prompt_lower:
        fields = []
        if 'name' in prompt_lower:
            fields.append({"label": "Name", "type": "text", "placeholder": "Enter name"})
        if 'email' in prompt_lower:
            fields.append({"label": "Email", "type": "email", "placeholder": "Enter email"})
        if 'password' in prompt_lower:
            fields.append({"label": "Password", "type": "password", "placeholder": "Enter password"})
        if 'phone' in prompt_lower:
            fields.append({"label": "Phone", "type": "tel", "placeholder": "Enter phone"})
        if 'message' in prompt_lower or 'comment' in prompt_lower:
            fields.append({"label": "Message", "type": "textarea", "placeholder": "Enter message"})
        if 'address' in prompt_lower:
            fields.append({"label": "Address", "type": "text", "placeholder": "Enter address"})
        
        if not fields:
            fields = [
                {"label": "Field 1", "type": "text", "placeholder": "Enter value"},
                {"label": "Field 2", "type": "text", "placeholder": "Enter value"}
            ]
        
        components = [
            {"id": f"form-{uuid.uuid4().hex[:8]}", "type": "form", "name": "Form", "fields": fields, "submitLabel": "Submit"}
        ]
        return components
    
    # Buttons
    if 'button' in prompt_lower:
        btn_label = "Click Me"
        if 'submit' in prompt_lower:
            btn_label = "Submit"
        elif 'save' in prompt_lower:
            btn_label = "Save"
        elif 'cancel' in prompt_lower:
            btn_label = "Cancel"
        elif 'delete' in prompt_lower:
            btn_label = "Delete"
        elif 'add' in prompt_lower:
            btn_label = "Add"
        
        components = [
            {"id": f"btn-{uuid.uuid4().hex[:8]}", "type": "button", "name": btn_label, "label": btn_label, "variant": "primary"}
        ]
        return components
    
    # List
    if 'list' in prompt_lower:
        import re
        match = re.search(r'(\d+)\s*(items?)?', prompt_lower)
        count = int(match.group(1)) if match else 5
        items = [{"text": f"Item {i+1}", "id": i+1} for i in range(count)]
        
        components = [
            {"id": f"list-{uuid.uuid4().hex[:8]}", "type": "list", "name": "Item List", "items": items}
        ]
        return components
    
    # Table
    if 'table' in prompt_lower:
        components = [
            {"id": f"table-{uuid.uuid4().hex[:8]}", "type": "table", "name": "Data Table", 
             "columns": ["Name", "Value", "Status"],
             "rows": [["Item 1", "100", "Active"], ["Item 2", "200", "Pending"]]}
        ]
        return components
    
    # Navigation
    if 'nav' in prompt_lower or 'menu' in prompt_lower:
        components = [
            {"id": f"nav-{uuid.uuid4().hex[:8]}", "type": "nav", "name": "Navigation", 
             "items": ["Home", "About", "Services", "Contact"]}
        ]
        return components
    
    # Card
    if 'card' in prompt_lower:
        components = [
            {"id": f"card-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Card", 
             "title": "Card Title", "content": "This is the card content."}
        ]
        return components
    
    # Header/Title
    if 'header' in prompt_lower or 'title' in prompt_lower or 'heading' in prompt_lower:
        content = "Page Title"
        if 'welcome' in prompt_lower:
            content = "Welcome"
        components = [
            {"id": f"header-{uuid.uuid4().hex[:8]}", "type": "header", "name": "Header", "content": content}
        ]
        return components
    
    # Image
    if 'image' in prompt_lower or 'picture' in prompt_lower or 'photo' in prompt_lower:
        components = [
            {"id": f"img-{uuid.uuid4().hex[:8]}", "type": "image", "name": "Image", "src": "", "alt": "Image"}
        ]
        return components
    
    # Progress
    if 'progress' in prompt_lower:
        components = [
            {"id": f"progress-{uuid.uuid4().hex[:8]}", "type": "progress", "name": "Progress", "value": 60, "max": 100}
        ]
        return components
    
    # Slider
    if 'slider' in prompt_lower:
        components = [
            {"id": f"slider-{uuid.uuid4().hex[:8]}", "type": "slider", "name": "Slider", "min": 0, "max": 100, "value": 50}
        ]
        return components
    
    # Toggle
    if 'toggle' in prompt_lower or 'switch' in prompt_lower:
        components = [
            {"id": f"toggle-{uuid.uuid4().hex[:8]}", "type": "toggle", "name": "Toggle", "label": "Enable feature", "checked": False}
        ]
        return components
    
    # Dropdown
    if 'dropdown' in prompt_lower or 'select' in prompt_lower:
        components = [
            {"id": f"dropdown-{uuid.uuid4().hex[:8]}", "type": "dropdown", "name": "Dropdown", 
             "options": ["Option 1", "Option 2", "Option 3"], "placeholder": "Select an option"}
        ]
        return components
    
    # Tabs
    if 'tabs' in prompt_lower:
        components = [
            {"id": f"tabs-{uuid.uuid4().hex[:8]}", "type": "tabs", "name": "Tabs",
             "tabs": [{"label": "Tab 1", "content": "Content 1"}, {"label": "Tab 2", "content": "Content 2"}]}
        ]
        return components
    
    # Modal
    if 'modal' in prompt_lower or 'popup' in prompt_lower or 'dialog' in prompt_lower:
        components = [
            {"id": f"modal-{uuid.uuid4().hex[:8]}", "type": "modal", "name": "Modal",
             "title": "Modal Title", "content": "Modal content goes here."}
        ]
        return components
    
    return []  # Return empty to trigger GPT fallback

def create_builder_ai_routes():
    return router
