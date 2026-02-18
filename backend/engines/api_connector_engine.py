# API Connector Engine - Handle REST and GraphQL API requests
from typing import Dict, List, Optional, Any, Union
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid
import httpx
import json


class HttpMethod(str, Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    PATCH = "PATCH"
    DELETE = "DELETE"


class ApiRequestConfig(BaseModel):
    """Configuration for an API request."""
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    method: HttpMethod
    endpoint: str
    headers: Dict[str, str] = {}
    query_params: Dict[str, Any] = {}
    body: Optional[Dict[str, Any]] = None
    timeout: int = 30


class ApiResponse(BaseModel):
    """Response from an API request."""
    success: bool
    status_code: int
    headers: Dict[str, str] = {}
    data: Optional[Any] = None
    error: Optional[str] = None
    response_time_ms: int = 0


class GraphQLRequest(BaseModel):
    """GraphQL request configuration."""
    query: str
    variables: Dict[str, Any] = {}
    operation_name: Optional[str] = None


class EndpointDefinition(BaseModel):
    """Definition of a saved API endpoint."""
    endpoint_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    connection_id: str
    name: str
    description: str = ""
    method: HttpMethod
    path: str
    default_headers: Dict[str, str] = {}
    default_params: Dict[str, Any] = {}
    body_template: Optional[Dict[str, Any]] = None
    response_mapping: Dict[str, str] = {}  # Maps response fields to component bindings


class APIConnectorEngine:
    """
    API Connector Engine.
    
    Responsibilities:
    - Execute REST API requests
    - Execute GraphQL requests
    - Handle authentication headers
    - Error handling and retries
    - Response transformation
    """
    
    @classmethod
    async def execute_rest(
        cls,
        base_url: str,
        config: ApiRequestConfig,
        auth_headers: Dict[str, str] = None
    ) -> ApiResponse:
        """Execute a REST API request."""
        import asyncio
        start_time = asyncio.get_event_loop().time()
        
        # Build full URL
        url = f"{base_url.rstrip('/')}/{config.endpoint.lstrip('/')}"
        
        # Merge headers
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            **(auth_headers or {}),
            **config.headers
        }
        
        try:
            async with httpx.AsyncClient(timeout=float(config.timeout)) as client:
                response = await client.request(
                    method=config.method.value,
                    url=url,
                    headers=headers,
                    params=config.query_params or None,
                    json=config.body if config.body else None
                )
                
                elapsed_ms = int((asyncio.get_event_loop().time() - start_time) * 1000)
                
                # Parse response
                try:
                    data = response.json()
                except:
                    data = response.text if response.text else None
                
                return ApiResponse(
                    success=response.status_code < 400,
                    status_code=response.status_code,
                    headers=dict(response.headers),
                    data=data,
                    response_time_ms=elapsed_ms,
                    error=None if response.status_code < 400 else f"HTTP {response.status_code}"
                )
                
        except httpx.TimeoutException:
            return ApiResponse(
                success=False,
                status_code=0,
                error="Request timeout",
                response_time_ms=config.timeout * 1000
            )
        except httpx.ConnectError:
            return ApiResponse(
                success=False,
                status_code=0,
                error="Connection failed"
            )
        except Exception as e:
            return ApiResponse(
                success=False,
                status_code=0,
                error=str(e)
            )
    
    @classmethod
    async def execute_graphql(
        cls,
        endpoint_url: str,
        request: GraphQLRequest,
        auth_headers: Dict[str, str] = None
    ) -> ApiResponse:
        """Execute a GraphQL request."""
        import asyncio
        start_time = asyncio.get_event_loop().time()
        
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            **(auth_headers or {})
        }
        
        body = {
            "query": request.query,
            "variables": request.variables
        }
        if request.operation_name:
            body["operationName"] = request.operation_name
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    endpoint_url,
                    headers=headers,
                    json=body
                )
                
                elapsed_ms = int((asyncio.get_event_loop().time() - start_time) * 1000)
                
                data = response.json()
                
                # Check for GraphQL errors
                has_errors = "errors" in data and data["errors"]
                
                return ApiResponse(
                    success=response.status_code == 200 and not has_errors,
                    status_code=response.status_code,
                    headers=dict(response.headers),
                    data=data.get("data") if not has_errors else data,
                    response_time_ms=elapsed_ms,
                    error=str(data["errors"]) if has_errors else None
                )
                
        except Exception as e:
            return ApiResponse(
                success=False,
                status_code=0,
                error=str(e)
            )
    
    @classmethod
    def create_endpoint_definition(
        cls,
        connection_id: str,
        name: str,
        method: HttpMethod,
        path: str,
        description: str = "",
        body_template: Dict[str, Any] = None
    ) -> EndpointDefinition:
        """Create a reusable endpoint definition."""
        return EndpointDefinition(
            connection_id=connection_id,
            name=name,
            description=description,
            method=method,
            path=path,
            body_template=body_template
        )
    
    @classmethod
    async def execute_endpoint(
        cls,
        endpoint: EndpointDefinition,
        base_url: str,
        auth_headers: Dict[str, str] = None,
        params: Dict[str, Any] = None,
        body_override: Dict[str, Any] = None
    ) -> ApiResponse:
        """Execute a saved endpoint definition."""
        config = ApiRequestConfig(
            method=endpoint.method,
            endpoint=endpoint.path,
            headers=endpoint.default_headers,
            query_params={**endpoint.default_params, **(params or {})},
            body=body_override or endpoint.body_template
        )
        
        return await cls.execute_rest(base_url, config, auth_headers)
    
    @classmethod
    def transform_response(
        cls,
        response_data: Any,
        mapping: Dict[str, str]
    ) -> Dict[str, Any]:
        """Transform API response using field mapping."""
        if not mapping or not response_data:
            return response_data if isinstance(response_data, dict) else {"data": response_data}
        
        result = {}
        for target_field, source_path in mapping.items():
            value = cls._get_nested_value(response_data, source_path)
            result[target_field] = value
        
        return result
    
    @classmethod
    def _get_nested_value(cls, data: Any, path: str) -> Any:
        """Get a nested value from data using dot notation."""
        keys = path.split('.')
        value = data
        
        for key in keys:
            if isinstance(value, dict):
                value = value.get(key)
            elif isinstance(value, list) and key.isdigit():
                idx = int(key)
                value = value[idx] if idx < len(value) else None
            else:
                return None
        
        return value
    
    @classmethod
    def build_crud_endpoints(
        cls,
        connection_id: str,
        resource_name: str,
        base_path: str
    ) -> List[EndpointDefinition]:
        """Generate standard CRUD endpoints for a resource."""
        return [
            EndpointDefinition(
                connection_id=connection_id,
                name=f"List {resource_name}",
                description=f"Get all {resource_name}",
                method=HttpMethod.GET,
                path=base_path
            ),
            EndpointDefinition(
                connection_id=connection_id,
                name=f"Get {resource_name}",
                description=f"Get single {resource_name} by ID",
                method=HttpMethod.GET,
                path=f"{base_path}/{{id}}"
            ),
            EndpointDefinition(
                connection_id=connection_id,
                name=f"Create {resource_name}",
                description=f"Create new {resource_name}",
                method=HttpMethod.POST,
                path=base_path
            ),
            EndpointDefinition(
                connection_id=connection_id,
                name=f"Update {resource_name}",
                description=f"Update existing {resource_name}",
                method=HttpMethod.PUT,
                path=f"{base_path}/{{id}}"
            ),
            EndpointDefinition(
                connection_id=connection_id,
                name=f"Delete {resource_name}",
                description=f"Delete {resource_name}",
                method=HttpMethod.DELETE,
                path=f"{base_path}/{{id}}"
            ),
        ]
