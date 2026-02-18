# Backend Integration Engine - Connect to external backends and APIs
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid
import httpx
import asyncio


class BackendProviderType(str, Enum):
    CUSTOM_REST = "custom_rest"
    CUSTOM_GRAPHQL = "custom_graphql"
    FIREBASE = "firebase"
    SUPABASE = "supabase"
    AIRTABLE = "airtable"
    MONGODB_ATLAS = "mongodb_atlas"
    POSTGRES = "postgres"
    NOTION = "notion"


class AuthenticationType(str, Enum):
    NONE = "none"
    API_KEY = "api_key"
    BEARER_TOKEN = "bearer_token"
    BASIC_AUTH = "basic_auth"
    OAUTH2 = "oauth2"
    CUSTOM_HEADER = "custom_header"


class BackendConnection(BaseModel):
    """A connection to an external backend."""
    connection_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    name: str
    provider: BackendProviderType
    base_url: str
    auth_type: AuthenticationType = AuthenticationType.NONE
    auth_config: Dict[str, Any] = {}  # API keys, tokens, etc.
    headers: Dict[str, str] = {}
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_tested: Optional[datetime] = None
    test_status: str = "untested"


class ConnectionTestResult(BaseModel):
    """Result of testing a backend connection."""
    success: bool
    status_code: Optional[int] = None
    response_time_ms: int = 0
    error: Optional[str] = None
    message: str = ""


class BackendIntegrationEngine:
    """
    Backend Integration Engine.
    
    Responsibilities:
    - Connect to external backends
    - Support user-provided APIs
    - Support multiple backend providers
    - Manage connection configurations
    - Test and validate connections
    """
    
    # Provider-specific configurations
    PROVIDER_CONFIGS = {
        BackendProviderType.FIREBASE: {
            "default_base_url": "https://firestore.googleapis.com/v1",
            "auth_type": AuthenticationType.BEARER_TOKEN,
            "requires": ["project_id", "api_key"]
        },
        BackendProviderType.SUPABASE: {
            "default_base_url": "https://{project_ref}.supabase.co/rest/v1",
            "auth_type": AuthenticationType.API_KEY,
            "headers": {"apikey": "{api_key}"},
            "requires": ["project_ref", "api_key"]
        },
        BackendProviderType.AIRTABLE: {
            "default_base_url": "https://api.airtable.com/v0",
            "auth_type": AuthenticationType.BEARER_TOKEN,
            "requires": ["api_key", "base_id"]
        },
        BackendProviderType.NOTION: {
            "default_base_url": "https://api.notion.com/v1",
            "auth_type": AuthenticationType.BEARER_TOKEN,
            "headers": {"Notion-Version": "2022-06-28"},
            "requires": ["integration_token"]
        },
    }
    
    @classmethod
    async def create_connection(
        cls,
        project_id: str,
        name: str,
        provider: BackendProviderType,
        base_url: str,
        auth_type: AuthenticationType = AuthenticationType.NONE,
        auth_config: Dict[str, Any] = None,
        headers: Dict[str, str] = None
    ) -> BackendConnection:
        """Create a new backend connection."""
        connection = BackendConnection(
            project_id=project_id,
            name=name,
            provider=provider,
            base_url=base_url.rstrip('/'),
            auth_type=auth_type,
            auth_config=auth_config or {},
            headers=headers or {}
        )
        
        return connection
    
    @classmethod
    async def test_connection(cls, connection: BackendConnection) -> ConnectionTestResult:
        """Test if a backend connection is working."""
        start_time = asyncio.get_event_loop().time()
        
        try:
            # Build headers with authentication
            headers = cls._build_headers(connection)
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                # Try a simple GET request to the base URL
                response = await client.get(connection.base_url, headers=headers)
                
                elapsed_ms = int((asyncio.get_event_loop().time() - start_time) * 1000)
                
                if response.status_code < 400:
                    return ConnectionTestResult(
                        success=True,
                        status_code=response.status_code,
                        response_time_ms=elapsed_ms,
                        message=f"Connection successful ({response.status_code})"
                    )
                else:
                    return ConnectionTestResult(
                        success=False,
                        status_code=response.status_code,
                        response_time_ms=elapsed_ms,
                        error=f"HTTP {response.status_code}",
                        message=f"Server returned error: {response.status_code}"
                    )
                    
        except httpx.TimeoutException:
            elapsed_ms = int((asyncio.get_event_loop().time() - start_time) * 1000)
            return ConnectionTestResult(
                success=False,
                response_time_ms=elapsed_ms,
                error="Connection timeout",
                message="The server did not respond in time"
            )
        except httpx.ConnectError as e:
            return ConnectionTestResult(
                success=False,
                error="Connection failed",
                message=f"Could not connect to {connection.base_url}"
            )
        except Exception as e:
            return ConnectionTestResult(
                success=False,
                error=str(type(e).__name__),
                message=str(e)
            )
    
    @classmethod
    def _build_headers(cls, connection: BackendConnection) -> Dict[str, str]:
        """Build request headers including authentication."""
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            **connection.headers
        }
        
        if connection.auth_type == AuthenticationType.API_KEY:
            api_key = connection.auth_config.get("api_key", "")
            header_name = connection.auth_config.get("header_name", "X-API-Key")
            headers[header_name] = api_key
            
        elif connection.auth_type == AuthenticationType.BEARER_TOKEN:
            token = connection.auth_config.get("token", "")
            headers["Authorization"] = f"Bearer {token}"
            
        elif connection.auth_type == AuthenticationType.BASIC_AUTH:
            import base64
            username = connection.auth_config.get("username", "")
            password = connection.auth_config.get("password", "")
            credentials = base64.b64encode(f"{username}:{password}".encode()).decode()
            headers["Authorization"] = f"Basic {credentials}"
            
        elif connection.auth_type == AuthenticationType.CUSTOM_HEADER:
            custom_headers = connection.auth_config.get("headers", {})
            headers.update(custom_headers)
        
        return headers
    
    @classmethod
    def get_provider_config(cls, provider: BackendProviderType) -> Dict[str, Any]:
        """Get configuration template for a provider."""
        return cls.PROVIDER_CONFIGS.get(provider, {
            "default_base_url": "",
            "auth_type": AuthenticationType.API_KEY,
            "requires": ["base_url", "api_key"]
        })
    
    @classmethod
    def get_supported_providers(cls) -> List[Dict[str, Any]]:
        """Get list of supported backend providers."""
        return [
            {
                "provider": BackendProviderType.CUSTOM_REST.value,
                "name": "Custom REST API",
                "description": "Connect to any REST API"
            },
            {
                "provider": BackendProviderType.CUSTOM_GRAPHQL.value,
                "name": "Custom GraphQL",
                "description": "Connect to any GraphQL endpoint"
            },
            {
                "provider": BackendProviderType.FIREBASE.value,
                "name": "Firebase / Firestore",
                "description": "Google Firebase backend"
            },
            {
                "provider": BackendProviderType.SUPABASE.value,
                "name": "Supabase",
                "description": "Open source Firebase alternative"
            },
            {
                "provider": BackendProviderType.AIRTABLE.value,
                "name": "Airtable",
                "description": "Spreadsheet-database hybrid"
            },
            {
                "provider": BackendProviderType.NOTION.value,
                "name": "Notion",
                "description": "Notion as a backend"
            },
        ]
