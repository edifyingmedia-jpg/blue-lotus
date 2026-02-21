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

# Import intelligent builder engine
try:
    from engines.intelligent_builder_engine import IntelligentBuilderEngine
    INTELLIGENT_ENGINE_AVAILABLE = True
except ImportError:
    INTELLIGENT_ENGINE_AVAILABLE = False
    print("[Builder AI] Intelligent engine not available, using basic mode")

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")


class GenerateComponentsRequest(BaseModel):
    prompt: str
    current_screen: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    mode: Optional[str] = "intelligent"  # "intelligent", "quick", "expand"
    existing_components: Optional[List[Dict[str, Any]]] = None


class GenerateComponentsResponse(BaseModel):
    success: bool
    components: List[Dict[str, Any]]
    message: str
    thinking: Optional[List[Any]] = None
    suggestions: Optional[List[Any]] = None
    errors_fixed: Optional[List[str]] = None
    blueprint: Optional[Dict[str, Any]] = None


class FixErrorsRequest(BaseModel):
    components: List[Dict[str, Any]]
    error_description: str


class SuggestImprovementsRequest(BaseModel):
    components: List[Dict[str, Any]]
    user_goal: str


class ExpandFeatureRequest(BaseModel):
    existing_components: List[Dict[str, Any]]
    feature_request: str

TWIN_BUILDER_PROMPT = """You are TWIN-Builder, the primary app-building intelligence inside Blue Lotus.

CORE IDENTITY:
- You are an app architect and implementation engine
- Focus: structure, logic, data, flows, and UI for applications
- No emotions, no empathy, no personal opinions
- Every response must move the build forward

COMMUNICATION STYLE:
- Direct, technical, concise, structured
- No fluff, no filler, no motivational language
- Use headings, bullet points, clear sections
- Lead with structure, make it easy to implement

PRIMARY RESPONSIBILITIES:
1. App structure - architecture, modules, navigation
2. Screens/pages - layouts, components, props
3. User flows - step-by-step, state transitions
4. Data models - tables, fields, relationships
5. Logic and behavior - conditions, validation, state
6. APIs and integrations - endpoints, request/response
7. Refinement - simplify, normalize, reduce redundancy

OUTPUT FORMAT:
1. App overview - summary, user types, core features
2. Screens - name, purpose, components, data, actions
3. Data model - tables, fields, relationships
4. User flows - trigger, steps, conditions, outcomes
5. Logic/rules - validation, conditions, edge cases

BEHAVIOR RULES:
- NO emotional language
- NO apologies unless functional limitation
- NO coaching, therapy, or life advice
- Every sentence must add new information or move build forward

OPTIMIZATION PRIORITIES:
1. Clarity - implementable without guessing
2. Simplicity - fewer screens, flows, tables when possible
3. Extensibility - structures that grow without rewrites
4. Consistency - naming patterns, structures
5. Speed - provide concrete output quickly

You exist to: Design apps, Structure data, Define flows, Specify logic, Refine architecture.
You do not comfort, emote, or coach. You build."""

SYSTEM_PROMPT = """You are TWIN-Builder, the app-building AI inside Blue Lotus. Generate UI components as JSON.

RULES:
1. Return ONLY valid JSON array of components
2. Each component: id, type, name, relevant properties
3. Be comprehensive - create full interfaces
4. No explanations, only JSON

COMPONENT TYPES:
- header: {id, type, name, content}
- text: {id, type, name, content}
- button: {id, type, name, label, variant: "primary"|"secondary"|"outline"}
- input: {id, type, name, placeholder, inputType}
- textarea: {id, type, name, placeholder, rows}
- form: {id, type, name, fields: [{label, type, placeholder}], submitLabel}
- card: {id, type, name, title, content}
- list: {id, type, name, items: [{text, id}]}
- tree: {id, type, name, items: [{text, id, children}]}
- image: {id, type, name, src, alt}
- stats: {id, type, name, items: [{label, value}]}
- table: {id, type, name, columns, rows}
- nav: {id, type, name, items: []}
- tabs: {id, type, name, tabs: []}
- video: {id, type, name, src, controls}
- container: {id, type, name, title, children: []}
- grid: {id, type, name, columns, children: []}
- modal: {id, type, name, title, content}
- progress: {id, type, name, value, max}
- slider: {id, type, name, min, max, value}
- toggle: {id, type, name, label, checked}
- dropdown: {id, type, name, options: [], placeholder}
- colorpicker: {id, type, name, label}
- timeline: {id, type, name, duration, currentTime}
- upload: {id, type, name, accept, multiple}

RESPOND WITH ONLY JSON ARRAY."""

@router.post("/generate-components", response_model=GenerateComponentsResponse)
async def generate_components(
    request: GenerateComponentsRequest,
    authorization: Optional[str] = Header(None)
):
    """Generate UI components using pattern matching or intelligent AI"""
    
    prompt_lower = request.prompt.lower()
    mode = request.mode or "intelligent"
    
    # FIRST: Try fast pattern matching for common apps
    components = generate_components_locally(prompt_lower, request.prompt)
    
    if components:
        return GenerateComponentsResponse(
            success=True,
            components=components,
            message=f"Generated {len(components)} component(s)",
            thinking=["🚀 Using optimized pattern matching"]
        )
    
    # SECOND: Use intelligent AI engine for complex/custom requests
    if INTELLIGENT_ENGINE_AVAILABLE and EMERGENT_LLM_KEY:
        try:
            print(f"[Builder AI] Using intelligent engine for: {request.prompt[:50]}...")
            engine = IntelligentBuilderEngine(api_key=EMERGENT_LLM_KEY)
            
            result = await engine.generate_app(
                prompt=request.prompt,
                context=request.context,
                quick_mode=(mode == "quick")
            )
            
            if result.success and result.components:
                # Convert thinking to simple strings
                thinking_strings = []
                for t in result.thinking:
                    if isinstance(t, dict):
                        thinking_strings.append(t.get('message', str(t)))
                    else:
                        thinking_strings.append(str(t))
                
                return GenerateComponentsResponse(
                    success=True,
                    components=result.components,
                    message=result.message,
                    thinking=thinking_strings,
                    suggestions=result.suggestions,
                    errors_fixed=result.errors_fixed,
                    blueprint=result.blueprint
                )
        except Exception as e:
            print(f"[Builder AI] Intelligent engine error: {e}")
            import traceback
            traceback.print_exc()
    
    # Fallback to basic GPT for complex requests
    if EMERGENT_LLM_KEY:
        try:
            print(f"[Builder AI] Using basic GPT for: {request.prompt[:50]}...")
            chat = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=f"builder-{id(request)}",
                system_message=SYSTEM_PROMPT
            ).with_model("openai", "gpt-5.2")
            
            user_prompt = f"User request: {request.prompt}\n\nGenerate the JSON array of components:"
            user_message = UserMessage(text=user_prompt)
            response = await chat.send_message(user_message)
            
            print(f"[Builder AI] GPT response received: {len(response)} chars")
            
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
            except json.JSONDecodeError as je:
                print(f"[Builder AI] JSON parse error: {je}")
                print(f"[Builder AI] Raw response: {cleaned[:200]}")
        except Exception as e:
            print(f"[Builder AI] GPT error: {e}")
            import traceback
            traceback.print_exc()
    
    # Ultimate fallback - generate a basic app structure
    import uuid
    fallback_components = [
        {"id": f"app-{uuid.uuid4().hex[:8]}", "type": "header", "name": "App Header", "content": "Your App"},
        {"id": f"app-{uuid.uuid4().hex[:8]}", "type": "text", "name": "Welcome", "content": "Welcome to your app! Start customizing it."},
        {"id": f"app-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Get Started", "label": "Get Started", "variant": "primary"}
    ]
    
    return GenerateComponentsResponse(
        success=True,
        components=fallback_components,
        message="Generated basic app structure"
    )

def generate_components_locally(prompt_lower: str, original_prompt: str) -> List[Dict[str, Any]]:
    """Fast local component generation based on pattern matching"""
    import uuid
    
    components = []
    
    # App Builder / No-Code Builder / Builder Platform - COMPREHENSIVE VERSION
    if ('app builder' in prompt_lower or 'no-code' in prompt_lower or 'nocode' in prompt_lower or 
        ('builder' in prompt_lower and ('create' in prompt_lower or 'build' in prompt_lower or 'make' in prompt_lower or 'platform' in prompt_lower))):
        components = [
            # Main Navigation Bar
            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "nav", "name": "Main Navigation", "items": ["Dashboard", "Projects", "Templates", "AI Studio", "Integrations", "Deploy", "Settings"]},
            
            # Top Action Bar
            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Action Bar", "title": "", "children": [
                {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Top Actions", "columns": 4, "children": [
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "New Project", "label": "+ New Project", "variant": "primary"},
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Search", "placeholder": "Search projects, templates...", "inputType": "text"},
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "dropdown", "name": "Workspace", "options": ["Personal", "Team", "Enterprise"], "placeholder": "Workspace"},
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Account", "label": "👤 Account", "variant": "secondary"}
                ]}
            ]},
            
            # Main Builder Interface - 3 Column Layout
            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Builder Interface", "columns": 3, "children": [
                
                # LEFT SIDEBAR - Component Library & Layers
                {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Left Sidebar", "title": "", "children": [
                    # AI Generation Section
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "container", "name": "AI Generation", "title": "🤖 AI Builder", "children": [
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "textarea", "name": "AI Prompt", "placeholder": "Describe what you want to build...\n\nExample: 'Create a todo app with categories, due dates, and dark mode'", "rows": 4},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "AI Actions", "columns": 2, "children": [
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Generate", "label": "✨ Generate", "variant": "primary"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Enhance", "label": "🔮 Enhance", "variant": "secondary"}
                        ]},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "dropdown", "name": "AI Model", "options": ["GPT-4 (Powerful)", "GPT-3.5 (Fast)", "Claude 3", "Gemini Pro"], "placeholder": "Select AI Model"}
                    ]},
                    
                    # Component Library
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Components", "title": "📦 Components", "children": [
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "tabs", "name": "Component Tabs", "tabs": ["Basic", "Forms", "Data", "Layout", "Media"]},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Basic Components", "columns": 2, "children": [
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Text", "label": "📝 Text", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Button", "label": "🔘 Button", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Image", "label": "🖼️ Image", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Icon", "label": "⭐ Icon", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Link", "label": "🔗 Link", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Video", "label": "🎬 Video", "variant": "outline"}
                        ]},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Form Components", "columns": 2, "children": [
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Input", "label": "✏️ Input", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Select", "label": "📋 Select", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Checkbox", "label": "☑️ Checkbox", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Radio", "label": "🔘 Radio", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Textarea", "label": "📄 Textarea", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Form", "label": "📑 Form", "variant": "outline"}
                        ]},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Layout Components", "columns": 2, "children": [
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Container", "label": "📦 Container", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Grid", "label": "🔲 Grid", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Card", "label": "🃏 Card", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Modal", "label": "💬 Modal", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Tabs", "label": "📑 Tabs", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Nav", "label": "🧭 Nav", "variant": "outline"}
                        ]},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Data Components", "columns": 2, "children": [
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Table", "label": "📊 Table", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Chart", "label": "📈 Chart", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add List", "label": "📋 List", "variant": "outline"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Add Stats", "label": "📉 Stats", "variant": "outline"}
                        ]}
                    ]},
                    
                    # Layers Panel
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Layers", "title": "🗂️ Layers", "children": [
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "tree", "name": "Layer Tree", "items": [
                            {"text": "📱 App Root", "id": 1, "children": [
                                {"text": "🧭 Navigation", "id": 2},
                                {"text": "📄 Page: Home", "id": 3, "children": [
                                    {"text": "📦 Header Section", "id": 4},
                                    {"text": "📦 Content Section", "id": 5},
                                    {"text": "📦 Footer Section", "id": 6}
                                ]},
                                {"text": "📄 Page: About", "id": 7},
                                {"text": "📄 Page: Contact", "id": 8}
                            ]}
                        ]}
                    ]}
                ]},
                
                # CENTER - Canvas/Preview Area
                {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Canvas Area", "title": "", "children": [
                    # Device & View Controls
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Canvas Controls", "columns": 6, "children": [
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Desktop View", "label": "🖥️", "variant": "primary"},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Tablet View", "label": "📱", "variant": "secondary"},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Mobile View", "label": "📲", "variant": "secondary"},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "dropdown", "name": "Zoom", "options": ["50%", "75%", "100%", "125%", "150%"], "placeholder": "100%"},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Undo", "label": "↩️", "variant": "secondary"},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Redo", "label": "↪️", "variant": "secondary"}
                    ]},
                    
                    # Main Canvas
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Canvas Frame", "title": "Canvas", "children": [
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "container", "name": "App Preview", "title": "", "children": [
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "nav", "name": "Preview Nav", "items": ["Home", "Features", "Pricing", "Contact"]},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "header", "name": "Hero Title", "content": "Build Amazing Apps"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "text", "name": "Hero Subtitle", "content": "Create powerful applications with our AI-powered builder"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "CTA Buttons", "columns": 2, "children": [
                                {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Get Started", "label": "Get Started Free", "variant": "primary"},
                                {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Watch Demo", "label": "Watch Demo", "variant": "secondary"}
                            ]},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "text", "name": "Drag Hint", "content": "👆 Click any element to select and edit"}
                        ]}
                    ]},
                    
                    # Page Tabs
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "tabs", "name": "Page Tabs", "tabs": ["Home", "Features", "Pricing", "Contact", "+ Add Page"]}
                ]},
                
                # RIGHT SIDEBAR - Properties & Styling
                {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Right Sidebar", "title": "", "children": [
                    # Properties Panel
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Properties", "title": "⚙️ Properties", "children": [
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Element ID", "placeholder": "Element ID", "inputType": "text"},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Element Name", "placeholder": "Element name", "inputType": "text"},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "textarea", "name": "Content", "placeholder": "Content / Text", "rows": 3},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "dropdown", "name": "Component Type", "options": ["Text", "Button", "Input", "Container", "Image", "Card", "Grid"], "placeholder": "Type"}
                    ]},
                    
                    # Style Panel
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Styling", "title": "🎨 Styling", "children": [
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Dimensions", "columns": 2, "children": [
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Width", "placeholder": "Width", "inputType": "text"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Height", "placeholder": "Height", "inputType": "text"}
                        ]},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Spacing", "columns": 4, "children": [
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Margin Top", "placeholder": "MT", "inputType": "number"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Margin Right", "placeholder": "MR", "inputType": "number"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Margin Bottom", "placeholder": "MB", "inputType": "number"},
                            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Margin Left", "placeholder": "ML", "inputType": "number"}
                        ]},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "colorpicker", "name": "Background", "label": "Background Color"},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "colorpicker", "name": "Text Color", "label": "Text Color"},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "dropdown", "name": "Font Size", "options": ["12px", "14px", "16px", "18px", "24px", "32px", "48px"], "placeholder": "Font Size"},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "dropdown", "name": "Font Weight", "options": ["Normal", "Medium", "Semi-Bold", "Bold"], "placeholder": "Font Weight"}
                    ]},
                    
                    # Actions Panel
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Actions", "title": "⚡ Actions", "children": [
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "dropdown", "name": "On Click", "options": ["None", "Navigate to Page", "Open Modal", "Submit Form", "Call API", "Run Custom Code"], "placeholder": "On Click Action"},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Action Value", "placeholder": "Action value / URL", "inputType": "text"},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "toggle", "name": "Visible", "label": "Visible", "checked": True},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "toggle", "name": "Enabled", "label": "Enabled", "checked": True}
                    ]},
                    
                    # Data Binding
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Data Binding", "title": "🔗 Data Binding", "children": [
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "dropdown", "name": "Data Source", "options": ["None", "API Endpoint", "Database", "Local State", "URL Params"], "placeholder": "Data Source"},
                        {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Data Path", "placeholder": "data.items[0].name", "inputType": "text"}
                    ]}
                ]}
            ]},
            
            # Bottom Action Bar
            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Bottom Actions", "title": "", "children": [
                {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Project Actions", "columns": 6, "children": [
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Save", "label": "💾 Save", "variant": "secondary"},
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Preview", "label": "👁️ Preview", "variant": "secondary"},
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Export HTML", "label": "📄 Export HTML", "variant": "secondary"},
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Export React", "label": "⚛️ Export React", "variant": "secondary"},
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Connect API", "label": "🔌 Connect API", "variant": "secondary"},
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Deploy", "label": "🚀 Deploy Live", "variant": "primary"}
                ]}
            ]},
            
            # Backend & Database Section
            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Backend Section", "title": "🔧 Backend & Database", "children": [
                {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Backend Options", "columns": 4, "children": [
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "card", "name": "API Builder", "title": "API Builder", "content": "Create REST APIs with visual editor"},
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Database", "title": "Database", "content": "Connect to MongoDB, PostgreSQL, MySQL"},
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Authentication", "title": "Auth", "content": "Add login, signup, OAuth"},
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Storage", "title": "File Storage", "content": "Upload and manage files"}
                ]}
            ]},
            
            # Templates Gallery
            {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Templates", "title": "📚 Templates", "children": [
                {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Template Cards", "columns": 5, "children": [
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Blank", "title": "Blank Project", "content": "Start from scratch"},
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Landing Page", "title": "Landing Page", "content": "Marketing landing page"},
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Dashboard", "title": "Dashboard", "content": "Admin dashboard"},
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "card", "name": "E-commerce", "title": "E-commerce", "content": "Online store"},
                    {"id": f"builder-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Blog", "title": "Blog", "content": "Blog platform"}
                ]}
            ]}
        ]
        return components
    
    # YouTube/Video streaming clone
    if ('youtube' in prompt_lower or 'video' in prompt_lower and ('feed' in prompt_lower or 'stream' in prompt_lower or 'watch' in prompt_lower or 'clone' in prompt_lower)):
        components = [
            {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "nav", "name": "Top Navigation", "items": ["Home", "Trending", "Subscriptions", "Library"]},
            {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Search Bar", "title": "", "children": [
                {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Search", "placeholder": "Search videos...", "inputType": "text"},
                {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Search Button", "label": "🔍 Search", "variant": "primary"}
            ]},
            {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Main Content", "columns": 3, "children": [
                {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Video Player Section", "title": "", "children": [
                    {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "video", "name": "Main Video Player", "src": "", "controls": True},
                    {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "header", "name": "Video Title", "content": "Amazing Video Title - Watch Now!"},
                    {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "stats", "name": "Video Stats", "items": [
                        {"label": "Views", "value": "1.2M"},
                        {"label": "Likes", "value": "45K"},
                        {"label": "Date", "value": "2 days ago"}
                    ]},
                    {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Action Buttons", "columns": 5, "children": [
                        {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Like", "label": "👍 Like", "variant": "secondary"},
                        {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Dislike", "label": "👎 Dislike", "variant": "secondary"},
                        {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Share", "label": "↗️ Share", "variant": "secondary"},
                        {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Save", "label": "📥 Save", "variant": "secondary"},
                        {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Subscribe", "label": "Subscribe", "variant": "primary"}
                    ]},
                    {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Channel Info", "title": "Channel Name", "content": "2.5M subscribers • 500 videos"},
                    {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "text", "name": "Description", "content": "Video description goes here. This is an amazing video about interesting topics."},
                    {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "header", "name": "Comments Header", "content": "Comments (1,234)"},
                    {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Add Comment", "placeholder": "Add a comment...", "inputType": "text"},
                    {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "list", "name": "Comments List", "items": [
                        {"text": "Great video! Very informative.", "id": 1},
                        {"text": "Thanks for sharing this!", "id": 2},
                        {"text": "Subscribed! Keep up the good work.", "id": 3}
                    ]}
                ]},
                {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Recommended Videos", "title": "Up Next", "children": [
                    {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Recommended 1", "title": "Related Video 1", "content": "200K views • 1 day ago"},
                    {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Recommended 2", "title": "Related Video 2", "content": "150K views • 3 days ago"},
                    {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Recommended 3", "title": "Related Video 3", "content": "300K views • 1 week ago"},
                    {"id": f"yt-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Recommended 4", "title": "Related Video 4", "content": "500K views • 2 weeks ago"}
                ]}
            ]}
        ]
        return components
    
    # E-commerce / Shopping app
    if 'ecommerce' in prompt_lower or 'shop' in prompt_lower or 'store' in prompt_lower or 'cart' in prompt_lower or 'product' in prompt_lower:
        components = [
            {"id": f"shop-{uuid.uuid4().hex[:8]}", "type": "nav", "name": "Store Navigation", "items": ["Home", "Products", "Categories", "Cart", "Account"]},
            {"id": f"shop-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Search Products", "placeholder": "Search products...", "inputType": "text"},
            {"id": f"shop-{uuid.uuid4().hex[:8]}", "type": "header", "name": "Featured Products", "content": "Featured Products"},
            {"id": f"shop-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Product Grid", "columns": 4, "children": [
                {"id": f"shop-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Product 1", "title": "Product Name", "content": "$29.99 - ⭐⭐⭐⭐⭐"},
                {"id": f"shop-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Product 2", "title": "Product Name", "content": "$49.99 - ⭐⭐⭐⭐"},
                {"id": f"shop-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Product 3", "title": "Product Name", "content": "$19.99 - ⭐⭐⭐⭐⭐"},
                {"id": f"shop-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Product 4", "title": "Product Name", "content": "$39.99 - ⭐⭐⭐⭐"}
            ]},
            {"id": f"shop-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Cart Summary", "title": "Shopping Cart", "children": [
                {"id": f"shop-{uuid.uuid4().hex[:8]}", "type": "list", "name": "Cart Items", "items": [
                    {"text": "Product 1 x 2 - $59.98", "id": 1},
                    {"text": "Product 3 x 1 - $19.99", "id": 2}
                ]},
                {"id": f"shop-{uuid.uuid4().hex[:8]}", "type": "stats", "name": "Cart Total", "items": [
                    {"label": "Subtotal", "value": "$79.97"},
                    {"label": "Shipping", "value": "$5.00"},
                    {"label": "Total", "value": "$84.97"}
                ]},
                {"id": f"shop-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Checkout", "label": "Proceed to Checkout", "variant": "primary"}
            ]}
        ]
        return components
    
    # Social Media / Twitter clone
    if 'twitter' in prompt_lower or 'social' in prompt_lower or 'feed' in prompt_lower or 'post' in prompt_lower:
        components = [
            {"id": f"social-{uuid.uuid4().hex[:8]}", "type": "nav", "name": "Social Navigation", "items": ["Home", "Explore", "Notifications", "Messages", "Profile"]},
            {"id": f"social-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Compose Post", "title": "What's happening?", "children": [
                {"id": f"social-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Post Input", "placeholder": "What's on your mind?", "inputType": "text"},
                {"id": f"social-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Post Actions", "columns": 4, "children": [
                    {"id": f"social-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Photo", "label": "📷 Photo", "variant": "secondary"},
                    {"id": f"social-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Video", "label": "🎥 Video", "variant": "secondary"},
                    {"id": f"social-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Poll", "label": "📊 Poll", "variant": "secondary"},
                    {"id": f"social-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Post Button", "label": "Post", "variant": "primary"}
                ]}
            ]},
            {"id": f"social-{uuid.uuid4().hex[:8]}", "type": "header", "name": "Feed", "content": "Your Feed"},
            {"id": f"social-{uuid.uuid4().hex[:8]}", "type": "list", "name": "Posts", "items": [
                {"text": "@user1: Just posted something amazing! 🎉 (5 min ago)", "id": 1},
                {"text": "@user2: Check out my new project! 🚀 (15 min ago)", "id": 2},
                {"text": "@user3: Happy to announce... 📣 (1 hour ago)", "id": 3}
            ]},
            {"id": f"social-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Trending", "title": "Trending Topics", "children": [
                {"id": f"social-{uuid.uuid4().hex[:8]}", "type": "list", "name": "Trending List", "items": [
                    {"text": "#Technology - 25K posts", "id": 1},
                    {"text": "#Design - 18K posts", "id": 2},
                    {"text": "#Startup - 12K posts", "id": 3}
                ]}
            ]}
        ]
        return components
    
    # Chat/Messaging app
    if 'chat' in prompt_lower or 'messag' in prompt_lower or 'conversation' in prompt_lower:
        components = [
            {"id": f"chat-{uuid.uuid4().hex[:8]}", "type": "header", "name": "Chat Header", "content": "Messages"},
            {"id": f"chat-{uuid.uuid4().hex[:8]}", "type": "list", "name": "Conversations", "items": [
                {"text": "John Doe - Hey, how are you?", "id": 1},
                {"text": "Jane Smith - Meeting at 3pm", "id": 2},
                {"text": "Team Chat - New update available", "id": 3}
            ]},
            {"id": f"chat-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Chat Window", "title": "John Doe", "children": [
                {"id": f"chat-{uuid.uuid4().hex[:8]}", "type": "list", "name": "Messages", "items": [
                    {"text": "John: Hey, how are you?", "id": 1},
                    {"text": "You: I'm good, thanks!", "id": 2},
                    {"text": "John: Great! Want to grab coffee?", "id": 3}
                ]},
                {"id": f"chat-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Message Input", "placeholder": "Type a message...", "inputType": "text"},
                {"id": f"chat-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Send", "label": "Send", "variant": "primary"}
            ]}
        ]
        return components
    
    # Recipe/Cooking app
    if 'recipe' in prompt_lower or 'cooking' in prompt_lower or 'food' in prompt_lower or 'ingredient' in prompt_lower:
        components = [
            {"id": f"recipe-{uuid.uuid4().hex[:8]}", "type": "nav", "name": "Recipe Navigation", "items": ["Home", "Recipes", "Favorites", "Shopping List"]},
            {"id": f"recipe-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Search Recipes", "placeholder": "Search recipes...", "inputType": "text"},
            {"id": f"recipe-{uuid.uuid4().hex[:8]}", "type": "header", "name": "Featured Recipe", "content": "Delicious Pasta Carbonara"},
            {"id": f"recipe-{uuid.uuid4().hex[:8]}", "type": "image", "name": "Recipe Image", "src": "", "alt": "Pasta Carbonara"},
            {"id": f"recipe-{uuid.uuid4().hex[:8]}", "type": "stats", "name": "Recipe Info", "items": [
                {"label": "Prep Time", "value": "15 min"},
                {"label": "Cook Time", "value": "20 min"},
                {"label": "Servings", "value": "4"},
                {"label": "Rating", "value": "⭐ 4.8"}
            ]},
            {"id": f"recipe-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Ingredients", "title": "Ingredients", "children": [
                {"id": f"recipe-{uuid.uuid4().hex[:8]}", "type": "list", "name": "Ingredient List", "items": [
                    {"text": "400g spaghetti", "id": 1},
                    {"text": "200g pancetta", "id": 2},
                    {"text": "4 egg yolks", "id": 3},
                    {"text": "100g Pecorino cheese", "id": 4},
                    {"text": "Black pepper", "id": 5}
                ]}
            ]},
            {"id": f"recipe-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Instructions", "title": "Cooking Steps", "children": [
                {"id": f"recipe-{uuid.uuid4().hex[:8]}", "type": "list", "name": "Steps", "items": [
                    {"text": "1. Cook pasta in salted water", "id": 1},
                    {"text": "2. Fry pancetta until crispy", "id": 2},
                    {"text": "3. Mix egg yolks with cheese", "id": 3},
                    {"text": "4. Combine all ingredients", "id": 4},
                    {"text": "5. Serve with pepper", "id": 5}
                ]},
                {"id": f"recipe-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Start Timer", "label": "⏱ Start Timer", "variant": "primary"}
            ]},
            {"id": f"recipe-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Reviews", "title": "Reviews & Ratings", "children": [
                {"id": f"recipe-{uuid.uuid4().hex[:8]}", "type": "list", "name": "Review List", "items": [
                    {"text": "⭐⭐⭐⭐⭐ Amazing recipe! - John", "id": 1},
                    {"text": "⭐⭐⭐⭐ Very tasty! - Sarah", "id": 2}
                ]},
                {"id": f"recipe-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Add Review", "placeholder": "Write a review...", "inputType": "text"},
                {"id": f"recipe-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Submit Review", "label": "Submit Review", "variant": "primary"}
            ]}
        ]
        return components
    
    # Music/Spotify clone
    if 'music' in prompt_lower or 'spotify' in prompt_lower or 'playlist' in prompt_lower or 'audio' in prompt_lower:
        components = [
            {"id": f"music-{uuid.uuid4().hex[:8]}", "type": "nav", "name": "Music Navigation", "items": ["Home", "Search", "Library", "Playlists"]},
            {"id": f"music-{uuid.uuid4().hex[:8]}", "type": "input", "name": "Search Music", "placeholder": "Search songs, artists...", "inputType": "text"},
            {"id": f"music-{uuid.uuid4().hex[:8]}", "type": "header", "name": "Now Playing", "content": "Now Playing"},
            {"id": f"music-{uuid.uuid4().hex[:8]}", "type": "card", "name": "Current Track", "title": "Song Title - Artist Name", "content": "Album Name • 2024"},
            {"id": f"music-{uuid.uuid4().hex[:8]}", "type": "progress", "name": "Progress Bar", "value": 45, "max": 100},
            {"id": f"music-{uuid.uuid4().hex[:8]}", "type": "grid", "name": "Playback Controls", "columns": 5, "children": [
                {"id": f"music-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Shuffle", "label": "🔀", "variant": "secondary"},
                {"id": f"music-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Previous", "label": "⏮", "variant": "secondary"},
                {"id": f"music-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Play/Pause", "label": "▶", "variant": "primary"},
                {"id": f"music-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Next", "label": "⏭", "variant": "secondary"},
                {"id": f"music-{uuid.uuid4().hex[:8]}", "type": "button", "name": "Repeat", "label": "🔁", "variant": "secondary"}
            ]},
            {"id": f"music-{uuid.uuid4().hex[:8]}", "type": "slider", "name": "Volume", "min": 0, "max": 100, "value": 75},
            {"id": f"music-{uuid.uuid4().hex[:8]}", "type": "container", "name": "Playlist", "title": "Up Next", "children": [
                {"id": f"music-{uuid.uuid4().hex[:8]}", "type": "list", "name": "Queue", "items": [
                    {"text": "Song 2 - Artist B (3:45)", "id": 1},
                    {"text": "Song 3 - Artist C (4:12)", "id": 2},
                    {"text": "Song 4 - Artist D (3:30)", "id": 3}
                ]}
            ]}
        ]
        return components
    
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


# ============ ADVANCED AI ENDPOINTS ============

@router.post("/fix-errors")
async def fix_errors(
    request: FixErrorsRequest,
    authorization: Optional[str] = Header(None)
):
    """Self-correct component errors based on description"""
    if not INTELLIGENT_ENGINE_AVAILABLE or not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=503, detail="Intelligent engine not available")
    
    try:
        engine = IntelligentBuilderEngine(api_key=EMERGENT_LLM_KEY)
        fixed_components, explanation = await engine.fix_component_errors(
            request.components,
            request.error_description
        )
        
        return {
            "success": True,
            "components": fixed_components,
            "explanation": explanation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/suggest-improvements")
async def suggest_improvements(
    request: SuggestImprovementsRequest,
    authorization: Optional[str] = Header(None)
):
    """Get AI-powered improvement suggestions for existing components"""
    if not INTELLIGENT_ENGINE_AVAILABLE or not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=503, detail="Intelligent engine not available")
    
    try:
        engine = IntelligentBuilderEngine(api_key=EMERGENT_LLM_KEY)
        suggestions = await engine.suggest_improvements(
            request.components,
            request.user_goal
        )
        
        return {
            "success": True,
            "suggestions": suggestions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/expand-feature")
async def expand_feature(
    request: ExpandFeatureRequest,
    authorization: Optional[str] = Header(None)
):
    """Add new features to an existing app while maintaining consistency"""
    if not INTELLIGENT_ENGINE_AVAILABLE or not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=503, detail="Intelligent engine not available")
    
    try:
        engine = IntelligentBuilderEngine(api_key=EMERGENT_LLM_KEY)
        new_components = await engine.expand_feature(
            request.existing_components,
            request.feature_request
        )
        
        return {
            "success": True,
            "components": new_components,
            "message": f"Added {len(new_components)} new components for '{request.feature_request}'"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/ai-status")
async def get_ai_status():
    """Check the status of AI capabilities"""
    return {
        "intelligent_engine": INTELLIGENT_ENGINE_AVAILABLE,
        "llm_key_configured": bool(EMERGENT_LLM_KEY),
        "capabilities": {
            "multi_phase_generation": INTELLIGENT_ENGINE_AVAILABLE and bool(EMERGENT_LLM_KEY),
            "self_correction": INTELLIGENT_ENGINE_AVAILABLE and bool(EMERGENT_LLM_KEY),
            "suggestions": INTELLIGENT_ENGINE_AVAILABLE and bool(EMERGENT_LLM_KEY),
            "feature_expansion": INTELLIGENT_ENGINE_AVAILABLE and bool(EMERGENT_LLM_KEY),
            "pattern_matching": True,
            "supported_apps": [
                "YouTube clone", "E-commerce", "Social media", "Chat/Messaging",
                "Recipe/Cooking", "Music player", "Video editor", "Dashboard",
                "Login/Signup", "Contact forms", "Generic forms"
            ]
        }
    }


def create_builder_ai_routes():
    return router
