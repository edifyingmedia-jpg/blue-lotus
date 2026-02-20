# External AI Provider Integration
# Allows users to connect their own AI models for app generation

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import os
import json
import httpx
from enum import Enum

router = APIRouter(prefix="/external-ai", tags=["external-ai"])

# Database reference
from motor.motor_asyncio import AsyncIOMotorClient
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME", "bluelotus")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Auth helper - import from auth route
from routes.auth import get_current_user


class AIProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"
    CUSTOM = "custom"


class ExternalAIConfig(BaseModel):
    provider: AIProvider
    api_key: str
    model: str = "gpt-4"
    endpoint: Optional[str] = None  # For custom providers
    max_tokens: int = 4096
    temperature: float = 0.7
    enabled: bool = True


class SaveConfigRequest(BaseModel):
    config: ExternalAIConfig


class GenerateWithExternalAIRequest(BaseModel):
    prompt: str
    project_context: Optional[Dict[str, Any]] = None
    output_type: str = "components"  # components, workflow, navigation, backend


# Provider-specific configurations
PROVIDER_CONFIGS = {
    AIProvider.OPENAI: {
        "endpoint": "https://api.openai.com/v1/chat/completions",
        "models": ["gpt-4", "gpt-4-turbo", "gpt-4o", "gpt-3.5-turbo"],
        "auth_header": "Authorization",
        "auth_prefix": "Bearer "
    },
    AIProvider.ANTHROPIC: {
        "endpoint": "https://api.anthropic.com/v1/messages",
        "models": ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
        "auth_header": "x-api-key",
        "auth_prefix": ""
    },
    AIProvider.GOOGLE: {
        "endpoint": "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
        "models": ["gemini-pro", "gemini-1.5-pro", "gemini-1.5-flash"],
        "auth_header": "x-goog-api-key",
        "auth_prefix": ""
    }
}


# System prompts for different output types
SYSTEM_PROMPTS = {
    "components": """You are an expert UI component generator for a no-code app builder.
Generate JSON arrays of UI components based on user requests.

COMPONENT TYPES:
- header: {id, type:"header", name, content}
- text: {id, type:"text", name, content}
- button: {id, type:"button", name, label, variant:"primary"|"secondary"|"danger"}
- input: {id, type:"input", name, placeholder, inputType}
- form: {id, type:"form", name, fields:[{label, type, placeholder}], submitLabel}
- card: {id, type:"card", name, title, content}
- list: {id, type:"list", name, items:[{text, id}]}
- container: {id, type:"container", name, title, children:[]}
- grid: {id, type:"grid", name, columns, children:[]}
- nav: {id, type:"nav", name, items:[]}
- stats: {id, type:"stats", name, items:[{label, value}]}
- table: {id, type:"table", name, columns:[], rows:[]}
- image: {id, type:"image", name, src, alt}
- video: {id, type:"video", name, src, controls}

OUTPUT only a valid JSON array of components. Be comprehensive.""",

    "workflow": """You are an expert workflow designer for a no-code app builder.
Generate JSON workflow definitions based on user requests.

WORKFLOW SCHEMA:
{
    "name": "Workflow Name",
    "trigger": {"type": "button_click|form_submit|page_load|schedule", "source": "component_id"},
    "steps": [
        {"id": "step_1", "type": "action|condition|loop", "action": "api_call|update_state|navigate|show_modal", "config": {}},
        ...
    ],
    "error_handling": {"on_error": "retry|skip|abort", "max_retries": 3}
}

OUTPUT only valid JSON.""",

    "navigation": """You are an expert app navigation designer.
Generate JSON navigation structures based on user requests.

NAVIGATION SCHEMA:
{
    "screens": [
        {"id": "screen_1", "name": "Screen Name", "path": "/path", "components": [], "transitions": []}
    ],
    "routes": [{"from": "screen_1", "to": "screen_2", "trigger": "button_click", "params": {}}],
    "default_screen": "screen_1"
}

OUTPUT only valid JSON.""",

    "backend": """You are an expert backend architect for a no-code app builder.
Generate JSON backend call definitions based on user requests.

BACKEND CALL SCHEMA:
{
    "calls": [
        {
            "id": "call_1",
            "name": "API Call Name",
            "method": "GET|POST|PUT|DELETE",
            "endpoint": "/api/resource",
            "headers": {},
            "body_template": {},
            "response_mapping": {"field": "path.to.data"},
            "error_handling": {}
        }
    ],
    "authentication": {"type": "bearer|api_key|oauth", "config": {}}
}

OUTPUT only valid JSON."""
}


@router.get("/providers")
async def get_available_providers():
    """Get list of supported AI providers"""
    return {
        "providers": [
            {
                "id": "openai",
                "name": "OpenAI",
                "models": PROVIDER_CONFIGS[AIProvider.OPENAI]["models"],
                "requires": ["api_key"]
            },
            {
                "id": "anthropic",
                "name": "Anthropic (Claude)",
                "models": PROVIDER_CONFIGS[AIProvider.ANTHROPIC]["models"],
                "requires": ["api_key"]
            },
            {
                "id": "google",
                "name": "Google (Gemini)",
                "models": PROVIDER_CONFIGS[AIProvider.GOOGLE]["models"],
                "requires": ["api_key"]
            },
            {
                "id": "custom",
                "name": "Custom Endpoint",
                "models": [],
                "requires": ["api_key", "endpoint", "model"]
            }
        ]
    }


@router.get("/config")
async def get_user_config(authorization: Optional[str] = Header(None)):
    """Get user's external AI configuration"""
    user = await get_current_user(authorization, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    config = await db.external_ai_configs.find_one(
        {"user_id": user["user_id"]},
        {"_id": 0, "api_key": 0}  # Don't return the actual API key
    )
    
    if config:
        config["has_api_key"] = True
        return {"config": config}
    
    return {"config": None}


@router.post("/config")
async def save_user_config(
    request: SaveConfigRequest,
    authorization: Optional[str] = Header(None)
):
    """Save user's external AI configuration"""
    user = await get_current_user(authorization, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    config_data = request.config.dict()
    config_data["user_id"] = user["user_id"]
    
    # Validate the API key by making a test request
    test_result = await test_external_connection(request.config)
    if not test_result["success"]:
        raise HTTPException(status_code=400, detail=test_result["message"])
    
    await db.external_ai_configs.update_one(
        {"user_id": user["user_id"]},
        {"$set": config_data},
        upsert=True
    )
    
    return {"success": True, "message": "External AI configuration saved"}


@router.delete("/config")
async def delete_user_config(authorization: Optional[str] = Header(None)):
    """Delete user's external AI configuration"""
    user = await get_current_user(authorization, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    await db.external_ai_configs.delete_one({"user_id": user["user_id"]})
    return {"success": True, "message": "External AI configuration deleted"}


@router.post("/test")
async def test_connection(
    request: SaveConfigRequest,
    authorization: Optional[str] = Header(None)
):
    """Test external AI connection"""
    user = await get_current_user(authorization, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    return await test_external_connection(request.config)


async def test_external_connection(config: ExternalAIConfig) -> Dict[str, Any]:
    """Test connection to external AI provider"""
    try:
        response = await call_external_ai(
            config=config,
            prompt="Say 'Connection successful' in exactly those words.",
            system_prompt="You are a test assistant. Respond briefly."
        )
        
        if response:
            return {"success": True, "message": "Connection successful", "response_preview": response[:100]}
        return {"success": False, "message": "No response from AI provider"}
    except Exception as e:
        return {"success": False, "message": str(e)}


async def call_external_ai(
    config: ExternalAIConfig,
    prompt: str,
    system_prompt: str
) -> Optional[str]:
    """Make a request to the external AI provider"""
    
    provider = config.provider
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        if provider == AIProvider.OPENAI:
            response = await client.post(
                PROVIDER_CONFIGS[AIProvider.OPENAI]["endpoint"],
                headers={
                    "Authorization": f"Bearer {config.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": config.model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": config.max_tokens,
                    "temperature": config.temperature
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                raise Exception(f"OpenAI API error: {response.status_code} - {response.text}")
        
        elif provider == AIProvider.ANTHROPIC:
            response = await client.post(
                PROVIDER_CONFIGS[AIProvider.ANTHROPIC]["endpoint"],
                headers={
                    "x-api-key": config.api_key,
                    "Content-Type": "application/json",
                    "anthropic-version": "2023-06-01"
                },
                json={
                    "model": config.model,
                    "max_tokens": config.max_tokens,
                    "system": system_prompt,
                    "messages": [
                        {"role": "user", "content": prompt}
                    ]
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["content"][0]["text"]
            else:
                raise Exception(f"Anthropic API error: {response.status_code} - {response.text}")
        
        elif provider == AIProvider.GOOGLE:
            endpoint = PROVIDER_CONFIGS[AIProvider.GOOGLE]["endpoint"].format(model=config.model)
            response = await client.post(
                f"{endpoint}?key={config.api_key}",
                headers={"Content-Type": "application/json"},
                json={
                    "contents": [
                        {"role": "user", "parts": [{"text": f"{system_prompt}\n\n{prompt}"}]}
                    ],
                    "generationConfig": {
                        "maxOutputTokens": config.max_tokens,
                        "temperature": config.temperature
                    }
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
            else:
                raise Exception(f"Google API error: {response.status_code} - {response.text}")
        
        elif provider == AIProvider.CUSTOM:
            if not config.endpoint:
                raise Exception("Custom endpoint URL is required")
            
            # Generic OpenAI-compatible format for custom endpoints
            response = await client.post(
                config.endpoint,
                headers={
                    "Authorization": f"Bearer {config.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": config.model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": config.max_tokens,
                    "temperature": config.temperature
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                # Try OpenAI format first
                if "choices" in data:
                    return data["choices"][0]["message"]["content"]
                # Try Anthropic format
                elif "content" in data:
                    return data["content"][0]["text"]
                # Try raw text
                elif "text" in data:
                    return data["text"]
                else:
                    return str(data)
            else:
                raise Exception(f"Custom API error: {response.status_code} - {response.text}")
    
    return None


@router.post("/generate")
async def generate_with_external_ai(
    request: GenerateWithExternalAIRequest,
    authorization: Optional[str] = Header(None)
):
    """Generate content using user's external AI provider"""
    user = await get_current_user(authorization, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Get user's external AI config
    config_doc = await db.external_ai_configs.find_one({"user_id": user["user_id"]})
    if not config_doc:
        raise HTTPException(status_code=400, detail="No external AI configured. Please set up your AI provider in settings.")
    
    if not config_doc.get("enabled", True):
        raise HTTPException(status_code=400, detail="External AI is disabled. Enable it in settings.")
    
    config = ExternalAIConfig(**{k: v for k, v in config_doc.items() if k != "_id" and k != "user_id"})
    
    # Get appropriate system prompt
    system_prompt = SYSTEM_PROMPTS.get(request.output_type, SYSTEM_PROMPTS["components"])
    
    # Build the full prompt with context
    full_prompt = request.prompt
    if request.project_context:
        context_str = json.dumps(request.project_context, indent=2)
        full_prompt = f"Project Context:\n{context_str}\n\nUser Request:\n{request.prompt}"
    
    try:
        response = await call_external_ai(
            config=config,
            prompt=full_prompt,
            system_prompt=system_prompt
        )
        
        if not response:
            raise Exception("No response from AI provider")
        
        # Parse the JSON response
        parsed = parse_ai_response(response)
        
        return {
            "success": True,
            "output_type": request.output_type,
            "result": parsed,
            "raw_response": response[:500] if len(response) > 500 else response,
            "provider": config.provider,
            "model": config.model
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"External AI error: {str(e)}")


def parse_ai_response(response: str) -> Any:
    """Parse AI response, extracting JSON if present"""
    # Clean up the response
    cleaned = response.strip()
    
    # Remove markdown code blocks
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()
    
    # Try to parse as JSON
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Try to find JSON in the response
        start_array = cleaned.find('[')
        start_obj = cleaned.find('{')
        
        start = -1
        if start_array >= 0 and start_obj >= 0:
            start = min(start_array, start_obj)
        elif start_array >= 0:
            start = start_array
        elif start_obj >= 0:
            start = start_obj
        
        if start >= 0:
            end = max(cleaned.rfind(']'), cleaned.rfind('}')) + 1
            if end > start:
                try:
                    return json.loads(cleaned[start:end])
                except json.JSONDecodeError:
                    pass
    
    # Return as-is if parsing fails
    return {"raw": cleaned}


def create_external_ai_routes():
    return router
