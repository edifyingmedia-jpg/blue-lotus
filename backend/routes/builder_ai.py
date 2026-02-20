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
    thinking: Optional[List[Dict[str, Any]]] = None
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
    """Generate UI components using intelligent multi-phase AI or fast pattern matching"""
    
    prompt_lower = request.prompt.lower()
    mode = request.mode or "intelligent"
    
    # Use intelligent engine for complex generation
    if mode == "intelligent" and INTELLIGENT_ENGINE_AVAILABLE and EMERGENT_LLM_KEY:
        try:
            print(f"[Builder AI] Using intelligent engine for: {request.prompt[:50]}...")
            engine = IntelligentBuilderEngine(api_key=EMERGENT_LLM_KEY)
            
            result = await engine.generate_app(
                prompt=request.prompt,
                context=request.context,
                quick_mode=(mode == "quick")
            )
            
            if result.success and result.components:
                return GenerateComponentsResponse(
                    success=True,
                    components=result.components,
                    message=result.message,
                    thinking=[t if isinstance(t, dict) else {"message": str(t)} for t in result.thinking],
                    suggestions=result.suggestions,
                    errors_fixed=result.errors_fixed,
                    blueprint=result.blueprint
                )
        except Exception as e:
            print(f"[Builder AI] Intelligent engine error: {e}")
            import traceback
            traceback.print_exc()
    
    # Fast local generation for common patterns (fallback or quick mode)
    components = generate_components_locally(prompt_lower, request.prompt)
    
    if components:
        return GenerateComponentsResponse(
            success=True,
            components=components,
            message=f"Generated {len(components)} component(s)"
        )
    
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

def create_builder_ai_routes():
    return router
