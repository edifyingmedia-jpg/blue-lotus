"""
Backend Connections API Tests
Tests all CRUD operations for /api/backend/connections endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_EMAIL = "backendtest2@test.com"
TEST_PASSWORD = "testpass123"


class TestBackendConnectionsAPI:
    """Test suite for Backend Connections API endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures - get auth token"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        # Login to get token
        response = self.session.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        self.token = data.get("access_token")
        self.user_id = data.get("user", {}).get("id")
        self.session.headers.update({"Authorization": f"Bearer {self.token}"})
        
        # Generate unique project ID for tests
        self.test_project_id = f"test-project-{uuid.uuid4().hex[:8]}"
        
        # Track created connections for cleanup
        self.created_connections = []
        
        yield
        
        # Cleanup: Delete all test connections
        for conn_id in self.created_connections:
            try:
                self.session.delete(f"{BASE_URL}/api/backend/connections/{conn_id}")
            except:
                pass
    
    # ============ Provider Tests ============
    
    def test_list_providers_returns_all_five(self):
        """GET /api/backend/providers - Should return all 5 backend providers"""
        response = self.session.get(f"{BASE_URL}/api/backend/providers")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "providers" in data, "Response should contain 'providers' key"
        
        providers = data["providers"]
        assert len(providers) == 5, f"Expected 5 providers, got {len(providers)}"
        
        # Verify all expected providers are present
        provider_ids = [p["id"] for p in providers]
        expected_ids = ["firebase", "supabase", "rest_api", "graphql", "mongodb"]
        for expected_id in expected_ids:
            assert expected_id in provider_ids, f"Missing provider: {expected_id}"
        
        # Verify provider structure
        for provider in providers:
            assert "id" in provider, "Provider should have 'id'"
            assert "name" in provider, "Provider should have 'name'"
            assert "description" in provider, "Provider should have 'description'"
    
    def test_list_providers_requires_auth(self):
        """GET /api/backend/providers - Should require authentication"""
        session = requests.Session()
        response = session.get(f"{BASE_URL}/api/backend/providers")
        
        assert response.status_code == 401, f"Expected 401 without auth, got {response.status_code}"
    
    # ============ Connection CRUD Tests ============
    
    def test_create_firebase_connection(self):
        """POST /api/backend/connections - Create Firebase connection"""
        payload = {
            "project_id": self.test_project_id,
            "name": "TEST_Firebase Connection",
            "provider": "firebase",
            "credentials": {
                "api_key": "test-api-key-12345",
                "project_id": "test-firebase-project"
            }
        }
        
        response = self.session.post(f"{BASE_URL}/api/backend/connections", json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data, "Response should contain connection 'id'"
        assert "message" in data, "Response should contain 'message'"
        
        self.created_connections.append(data["id"])
        
        # Verify connection was created by fetching it
        list_response = self.session.get(f"{BASE_URL}/api/backend/connections?project_id={self.test_project_id}")
        assert list_response.status_code == 200
        connections = list_response.json().get("connections", [])
        assert len(connections) >= 1, "Should have at least 1 connection"
        
        # Find our connection
        created_conn = next((c for c in connections if c["id"] == data["id"]), None)
        assert created_conn is not None, "Created connection should be in list"
        assert created_conn["name"] == "TEST_Firebase Connection"
        assert created_conn["provider"] == "firebase"
    
    def test_create_supabase_connection(self):
        """POST /api/backend/connections - Create Supabase connection"""
        payload = {
            "project_id": self.test_project_id,
            "name": "TEST_Supabase Connection",
            "provider": "supabase",
            "credentials": {
                "url": "https://test.supabase.co",
                "anon_key": "test-anon-key-12345"
            }
        }
        
        response = self.session.post(f"{BASE_URL}/api/backend/connections", json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data
        self.created_connections.append(data["id"])
    
    def test_create_rest_api_connection(self):
        """POST /api/backend/connections - Create REST API connection"""
        payload = {
            "project_id": self.test_project_id,
            "name": "TEST_REST API Connection",
            "provider": "rest_api",
            "credentials": {
                "base_url": "https://api.example.com"
            }
        }
        
        response = self.session.post(f"{BASE_URL}/api/backend/connections", json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data
        self.created_connections.append(data["id"])
    
    def test_create_graphql_connection(self):
        """POST /api/backend/connections - Create GraphQL connection"""
        payload = {
            "project_id": self.test_project_id,
            "name": "TEST_GraphQL Connection",
            "provider": "graphql",
            "credentials": {
                "endpoint": "https://api.example.com/graphql"
            }
        }
        
        response = self.session.post(f"{BASE_URL}/api/backend/connections", json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data
        self.created_connections.append(data["id"])
    
    def test_create_mongodb_connection(self):
        """POST /api/backend/connections - Create MongoDB connection"""
        payload = {
            "project_id": self.test_project_id,
            "name": "TEST_MongoDB Connection",
            "provider": "mongodb",
            "credentials": {
                "connection_string": "mongodb+srv://test:test@cluster.mongodb.net",
                "database": "test_db"
            }
        }
        
        response = self.session.post(f"{BASE_URL}/api/backend/connections", json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data
        self.created_connections.append(data["id"])
    
    def test_list_connections_for_project(self):
        """GET /api/backend/connections - List connections for a project"""
        # First create a connection
        create_payload = {
            "project_id": self.test_project_id,
            "name": "TEST_List Test Connection",
            "provider": "firebase",
            "credentials": {"api_key": "test", "project_id": "test"}
        }
        create_response = self.session.post(f"{BASE_URL}/api/backend/connections", json=create_payload)
        assert create_response.status_code == 200
        conn_id = create_response.json()["id"]
        self.created_connections.append(conn_id)
        
        # List connections
        response = self.session.get(f"{BASE_URL}/api/backend/connections?project_id={self.test_project_id}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "connections" in data, "Response should contain 'connections' key"
        
        connections = data["connections"]
        assert isinstance(connections, list), "Connections should be a list"
        
        # Verify credentials are masked
        for conn in connections:
            if conn.get("credentials"):
                for key, value in conn["credentials"].items():
                    assert value == "***", f"Credential '{key}' should be masked"
    
    def test_delete_connection(self):
        """DELETE /api/backend/connections/{id} - Delete a connection"""
        # First create a connection
        create_payload = {
            "project_id": self.test_project_id,
            "name": "TEST_Delete Test Connection",
            "provider": "rest_api",
            "credentials": {"base_url": "https://api.test.com"}
        }
        create_response = self.session.post(f"{BASE_URL}/api/backend/connections", json=create_payload)
        assert create_response.status_code == 200
        conn_id = create_response.json()["id"]
        
        # Delete the connection
        delete_response = self.session.delete(f"{BASE_URL}/api/backend/connections/{conn_id}")
        
        assert delete_response.status_code == 200, f"Expected 200, got {delete_response.status_code}: {delete_response.text}"
        
        data = delete_response.json()
        assert "message" in data, "Response should contain 'message'"
        
        # Verify connection is deleted
        list_response = self.session.get(f"{BASE_URL}/api/backend/connections?project_id={self.test_project_id}")
        connections = list_response.json().get("connections", [])
        deleted_conn = next((c for c in connections if c["id"] == conn_id), None)
        assert deleted_conn is None, "Deleted connection should not be in list"
    
    def test_delete_nonexistent_connection(self):
        """DELETE /api/backend/connections/{id} - Should return 404 for non-existent connection"""
        fake_id = str(uuid.uuid4())
        response = self.session.delete(f"{BASE_URL}/api/backend/connections/{fake_id}")
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
    
    # ============ Test Connection Validation Tests ============
    
    def test_connection_firebase_valid(self):
        """POST /api/backend/connections/test - Firebase with valid credentials"""
        payload = {
            "provider": "firebase",
            "credentials": {
                "api_key": "test-api-key",
                "project_id": "test-project"
            }
        }
        
        response = self.session.post(f"{BASE_URL}/api/backend/connections/test", json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data.get("success") == True, f"Expected success=True, got {data}"
        assert "message" in data
    
    def test_connection_firebase_missing_api_key(self):
        """POST /api/backend/connections/test - Firebase missing api_key"""
        payload = {
            "provider": "firebase",
            "credentials": {
                "project_id": "test-project"
            }
        }
        
        response = self.session.post(f"{BASE_URL}/api/backend/connections/test", json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") == False, "Should fail without api_key"
        assert "api_key" in data.get("message", "").lower() or "missing" in data.get("message", "").lower()
    
    def test_connection_firebase_missing_project_id(self):
        """POST /api/backend/connections/test - Firebase missing project_id"""
        payload = {
            "provider": "firebase",
            "credentials": {
                "api_key": "test-api-key"
            }
        }
        
        response = self.session.post(f"{BASE_URL}/api/backend/connections/test", json=payload)
        
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") == False, "Should fail without project_id"
    
    def test_connection_supabase_valid(self):
        """POST /api/backend/connections/test - Supabase with valid credentials"""
        payload = {
            "provider": "supabase",
            "credentials": {
                "url": "https://test.supabase.co",
                "anon_key": "test-anon-key"
            }
        }
        
        response = self.session.post(f"{BASE_URL}/api/backend/connections/test", json=payload)
        
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") == True, f"Expected success=True, got {data}"
    
    def test_connection_supabase_missing_url(self):
        """POST /api/backend/connections/test - Supabase missing url"""
        payload = {
            "provider": "supabase",
            "credentials": {
                "anon_key": "test-anon-key"
            }
        }
        
        response = self.session.post(f"{BASE_URL}/api/backend/connections/test", json=payload)
        
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") == False, "Should fail without url"
    
    def test_connection_rest_api_valid(self):
        """POST /api/backend/connections/test - REST API with valid credentials"""
        payload = {
            "provider": "rest_api",
            "credentials": {
                "base_url": "https://api.example.com"
            }
        }
        
        response = self.session.post(f"{BASE_URL}/api/backend/connections/test", json=payload)
        
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") == True, f"Expected success=True, got {data}"
    
    def test_connection_rest_api_missing_base_url(self):
        """POST /api/backend/connections/test - REST API missing base_url"""
        payload = {
            "provider": "rest_api",
            "credentials": {}
        }
        
        response = self.session.post(f"{BASE_URL}/api/backend/connections/test", json=payload)
        
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") == False, "Should fail without base_url"
    
    def test_connection_graphql_valid(self):
        """POST /api/backend/connections/test - GraphQL with valid credentials"""
        payload = {
            "provider": "graphql",
            "credentials": {
                "endpoint": "https://api.example.com/graphql"
            }
        }
        
        response = self.session.post(f"{BASE_URL}/api/backend/connections/test", json=payload)
        
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") == True, f"Expected success=True, got {data}"
    
    def test_connection_graphql_missing_endpoint(self):
        """POST /api/backend/connections/test - GraphQL missing endpoint"""
        payload = {
            "provider": "graphql",
            "credentials": {}
        }
        
        response = self.session.post(f"{BASE_URL}/api/backend/connections/test", json=payload)
        
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") == False, "Should fail without endpoint"
    
    def test_connection_mongodb_valid(self):
        """POST /api/backend/connections/test - MongoDB with valid credentials"""
        payload = {
            "provider": "mongodb",
            "credentials": {
                "connection_string": "mongodb+srv://test:test@cluster.mongodb.net",
                "database": "test_db"
            }
        }
        
        response = self.session.post(f"{BASE_URL}/api/backend/connections/test", json=payload)
        
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") == True, f"Expected success=True, got {data}"
    
    def test_connection_mongodb_missing_connection_string(self):
        """POST /api/backend/connections/test - MongoDB missing connection_string"""
        payload = {
            "provider": "mongodb",
            "credentials": {
                "database": "test_db"
            }
        }
        
        response = self.session.post(f"{BASE_URL}/api/backend/connections/test", json=payload)
        
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") == False, "Should fail without connection_string"
    
    def test_connection_mongodb_missing_database(self):
        """POST /api/backend/connections/test - MongoDB missing database"""
        payload = {
            "provider": "mongodb",
            "credentials": {
                "connection_string": "mongodb+srv://test:test@cluster.mongodb.net"
            }
        }
        
        response = self.session.post(f"{BASE_URL}/api/backend/connections/test", json=payload)
        
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") == False, "Should fail without database"
    
    # ============ Auth Tests ============
    
    def test_create_connection_requires_auth(self):
        """POST /api/backend/connections - Should require authentication"""
        session = requests.Session()
        session.headers.update({"Content-Type": "application/json"})
        
        payload = {
            "project_id": "test",
            "name": "Test",
            "provider": "firebase",
            "credentials": {}
        }
        
        response = session.post(f"{BASE_URL}/api/backend/connections", json=payload)
        
        assert response.status_code == 401, f"Expected 401 without auth, got {response.status_code}"
    
    def test_list_connections_requires_auth(self):
        """GET /api/backend/connections - Should require authentication"""
        session = requests.Session()
        response = session.get(f"{BASE_URL}/api/backend/connections")
        
        assert response.status_code == 401, f"Expected 401 without auth, got {response.status_code}"
    
    def test_delete_connection_requires_auth(self):
        """DELETE /api/backend/connections/{id} - Should require authentication"""
        session = requests.Session()
        response = session.delete(f"{BASE_URL}/api/backend/connections/test-id")
        
        assert response.status_code == 401, f"Expected 401 without auth, got {response.status_code}"
    
    def test_test_connection_requires_auth(self):
        """POST /api/backend/connections/test - Should require authentication"""
        session = requests.Session()
        session.headers.update({"Content-Type": "application/json"})
        
        payload = {"provider": "firebase", "credentials": {}}
        response = session.post(f"{BASE_URL}/api/backend/connections/test", json=payload)
        
        assert response.status_code == 401, f"Expected 401 without auth, got {response.status_code}"


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
