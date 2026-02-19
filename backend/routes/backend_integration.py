# Backend Integration Routes - API endpoints for external backend connections
from fastapi import APIRouter, HTTPException, Header, Body
from typing import Optional, Dict, Any, List
from pydantic import BaseModel

from routes.auth import get_current_user
from engines.backend_integration_engine import (
    BackendIntegrationEngine, BackendConnection, BackendProviderType, AuthenticationType
)
from engines.api_connector_engine import (
    APIConnectorEngine, ApiRequestConfig, HttpMethod, GraphQLRequest
)
from engines.backend_routing_engine import (
    BackendRoutingEngine, ApiRoute, RouteType, TriggerType, DataBinding
)
from engines.data_sync_engine import DataSyncEngine, SyncConfig, SyncMode
from engines.backend_security_engine import BackendSecurityEngine, SecurityConfig, SecurityLevel


class CreateConnectionRequest(BaseModel):
    project_id: str
    name: str
    provider: str
    credentials: Dict[str, Any] = {}


class TestConnectionRequest(BaseModel):
    provider: str
    credentials: Dict[str, Any] = {}


class ExecuteRequestRequest(BaseModel):
    method: str = "GET"
    endpoint: str
    headers: Dict[str, str] = {}
    query_params: Dict[str, Any] = {}
    body: Optional[Dict[str, Any]] = None


class ExecuteGraphQLRequest(BaseModel):
    query: str
    variables: Dict[str, Any] = {}
    operation_name: Optional[str] = None


class CreateRouteRequest(BaseModel):
    screen_id: str
    name: str
    endpoint_id: str
    route_type: str
    trigger: str
    bindings: List[Dict[str, str]] = []
    trigger_config: Dict[str, Any] = {}


def create_backend_integration_routes(db):
    """Create backend integration API routes."""
    router = APIRouter(prefix="/backend", tags=["Backend Integration"])
    
    # ============ Connection Management ============
    
    @router.get("/providers")
    async def list_providers(
        authorization: Optional[str] = Header(None)
    ):
        """List supported backend providers."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        return {
            "providers": BackendIntegrationEngine.get_supported_providers()
        }
    
    @router.post("/connections")
    async def create_connection(
        project_id: str,
        request: CreateConnectionRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Create a new backend connection."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Verify project ownership
        project = await db.projects.find_one({"id": project_id, "user_id": user.id}, {"_id": 0})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        try:
            provider = BackendProviderType(request.provider)
            auth_type = AuthenticationType(request.auth_type)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        
        connection = await BackendIntegrationEngine.create_connection(
            project_id=project_id,
            name=request.name,
            provider=provider,
            base_url=request.base_url,
            auth_type=auth_type,
            auth_config=request.auth_config,
            headers=request.headers
        )
        
        # Store in database
        await db.backend_connections.insert_one(connection.model_dump())
        
        return {
            "connection_id": connection.connection_id,
            "message": "Connection created successfully"
        }
    
    @router.get("/connections/{project_id}")
    async def list_connections(
        project_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """List all backend connections for a project."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Verify project ownership
        project = await db.projects.find_one({"id": project_id, "user_id": user.id}, {"_id": 0})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        connections = await db.backend_connections.find(
            {"project_id": project_id},
            {"_id": 0}
        ).to_list(100)
        
        # Mask sensitive data
        for conn in connections:
            if conn.get("auth_config"):
                conn["auth_config"] = BackendSecurityEngine.mask_sensitive_data(
                    conn["auth_config"],
                    ["api_key", "token", "secret", "password"]
                )
        
        return {"connections": connections}
    
    @router.post("/connections/{connection_id}/test")
    async def test_connection(
        connection_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Test a backend connection."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        conn_doc = await db.backend_connections.find_one(
            {"connection_id": connection_id},
            {"_id": 0}
        )
        if not conn_doc:
            raise HTTPException(status_code=404, detail="Connection not found")
        
        # Verify project ownership
        project = await db.projects.find_one({"id": conn_doc["project_id"], "user_id": user.id})
        if not project:
            raise HTTPException(status_code=403, detail="Access denied")
        
        connection = BackendConnection(**conn_doc)
        result = await BackendIntegrationEngine.test_connection(connection)
        
        # Update test status
        await db.backend_connections.update_one(
            {"connection_id": connection_id},
            {"$set": {
                "test_status": "success" if result.success else "failed",
                "last_tested": result.message
            }}
        )
        
        return {
            "success": result.success,
            "status_code": result.status_code,
            "response_time_ms": result.response_time_ms,
            "message": result.message,
            "error": result.error
        }
    
    @router.delete("/connections/{connection_id}")
    async def delete_connection(
        connection_id: str,
        authorization: Optional[str] = Header(None)
    ):
        """Delete a backend connection."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        conn_doc = await db.backend_connections.find_one({"connection_id": connection_id})
        if not conn_doc:
            raise HTTPException(status_code=404, detail="Connection not found")
        
        # Verify project ownership
        project = await db.projects.find_one({"id": conn_doc["project_id"], "user_id": user.id})
        if not project:
            raise HTTPException(status_code=403, detail="Access denied")
        
        await db.backend_connections.delete_one({"connection_id": connection_id})
        
        return {"message": "Connection deleted successfully"}
    
    # ============ API Execution ============
    
    @router.post("/execute/{connection_id}")
    async def execute_api_request(
        connection_id: str,
        request: ExecuteRequestRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Execute an API request through a connection."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        conn_doc = await db.backend_connections.find_one(
            {"connection_id": connection_id},
            {"_id": 0}
        )
        if not conn_doc:
            raise HTTPException(status_code=404, detail="Connection not found")
        
        # Verify project ownership
        project = await db.projects.find_one({"id": conn_doc["project_id"], "user_id": user.id})
        if not project:
            raise HTTPException(status_code=403, detail="Access denied")
        
        connection = BackendConnection(**conn_doc)
        
        # Security scan the request
        if request.body:
            security_config = SecurityConfig(connection_id=connection_id)
            scan_result = BackendSecurityEngine.scan_request(request.body, security_config)
            if not scan_result.is_safe:
                raise HTTPException(
                    status_code=400,
                    detail=f"Security threat detected: {scan_result.threats[0].description}"
                )
        
        # Build auth headers
        auth_headers = BackendIntegrationEngine._build_headers(connection)
        
        # Execute request
        config = ApiRequestConfig(
            method=HttpMethod(request.method),
            endpoint=request.endpoint,
            headers=request.headers,
            query_params=request.query_params,
            body=request.body
        )
        
        result = await APIConnectorEngine.execute_rest(
            connection.base_url,
            config,
            auth_headers
        )
        
        return {
            "success": result.success,
            "status_code": result.status_code,
            "data": result.data,
            "error": result.error,
            "response_time_ms": result.response_time_ms
        }
    
    @router.post("/graphql/{connection_id}")
    async def execute_graphql(
        connection_id: str,
        request: ExecuteGraphQLRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Execute a GraphQL query through a connection."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        conn_doc = await db.backend_connections.find_one(
            {"connection_id": connection_id},
            {"_id": 0}
        )
        if not conn_doc:
            raise HTTPException(status_code=404, detail="Connection not found")
        
        connection = BackendConnection(**conn_doc)
        auth_headers = BackendIntegrationEngine._build_headers(connection)
        
        gql_request = GraphQLRequest(
            query=request.query,
            variables=request.variables,
            operation_name=request.operation_name
        )
        
        result = await APIConnectorEngine.execute_graphql(
            connection.base_url,
            gql_request,
            auth_headers
        )
        
        return {
            "success": result.success,
            "data": result.data,
            "error": result.error,
            "response_time_ms": result.response_time_ms
        }
    
    # ============ Route Management ============
    
    @router.post("/routes/{project_id}")
    async def create_api_route(
        project_id: str,
        request: CreateRouteRequest,
        authorization: Optional[str] = Header(None)
    ):
        """Create an API route for a screen."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        project = await db.projects.find_one({"id": project_id, "user_id": user.id}, {"_id": 0})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        route = BackendRoutingEngine.create_route(
            project_id=project_id,
            screen_id=request.screen_id,
            name=request.name,
            endpoint_id=request.endpoint_id,
            route_type=RouteType(request.route_type),
            trigger=TriggerType(request.trigger),
            bindings=request.bindings,
            trigger_config=request.trigger_config
        )
        
        await db.api_routes.insert_one(route.model_dump())
        
        return {
            "route_id": route.route_id,
            "message": "Route created successfully"
        }
    
    @router.get("/routes/{project_id}")
    async def list_routes(
        project_id: str,
        screen_id: Optional[str] = None,
        authorization: Optional[str] = Header(None)
    ):
        """List API routes for a project."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        query = {"project_id": project_id}
        if screen_id:
            query["screen_id"] = screen_id
        
        routes = await db.api_routes.find(query, {"_id": 0}).to_list(100)
        
        return {"routes": routes}
    
    # ============ Security ============
    
    @router.post("/security/scan")
    async def scan_for_threats(
        data: Dict[str, Any] = Body(...),
        authorization: Optional[str] = Header(None)
    ):
        """Scan data for security threats."""
        user = await get_current_user(authorization, db)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        config = SecurityConfig(connection_id="manual_scan")
        result = BackendSecurityEngine.scan_request(data, config)
        
        return {
            "is_safe": result.is_safe,
            "threats": [t.model_dump() for t in result.threats],
            "warnings": result.warnings
        }
    
    return router
