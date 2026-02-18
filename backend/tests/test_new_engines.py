"""
Test Suite for Blue Lotus New Backend Engines
==============================================
Tests for:
- Blueprint Generation Engine (POST /api/blueprints/generate, GET /api/blueprints, etc.)
- System Diagnostics Engine (GET /api/diagnostics/health, /integrity, /logs, /errors, /metrics)
- Platform Settings Engine (GET /api/settings/user, PUT /api/settings/user/{key}, etc.)
- Health Check (GET /api/health showing all 17 engines)
"""

import pytest
import requests
import os
import uuid
from datetime import datetime

# Get BASE_URL from environment
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test user credentials
TEST_EMAIL = f"test_engines_{uuid.uuid4().hex[:8]}@example.com"
TEST_PASSWORD = "TestPassword123!"
TEST_NAME = "Test User"


class TestSetup:
    """Setup fixtures for all tests."""
    
    @pytest.fixture(scope="class")
    def api_client(self):
        """Shared requests session."""
        session = requests.Session()
        session.headers.update({"Content-Type": "application/json"})
        return session
    
    @pytest.fixture(scope="class")
    def auth_token(self, api_client):
        """Get authentication token by signing up a new user."""
        response = api_client.post(f"{BASE_URL}/api/auth/signup", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
            "name": TEST_NAME
        })
        
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token")
        elif response.status_code == 400 and "already registered" in response.text:
            # User exists, try login
            login_response = api_client.post(f"{BASE_URL}/api/auth/login", json={
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD
            })
            if login_response.status_code == 200:
                return login_response.json().get("access_token")
        
        pytest.skip(f"Authentication failed - status: {response.status_code}, response: {response.text}")
    
    @pytest.fixture(scope="class")
    def authenticated_client(self, api_client, auth_token):
        """Session with auth header."""
        api_client.headers.update({"Authorization": f"Bearer {auth_token}"})
        return api_client


class TestHealthCheck(TestSetup):
    """Test /api/health endpoint showing all 17 engines."""
    
    def test_health_check_returns_200(self, api_client):
        """Test health check endpoint returns 200."""
        response = api_client.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        print(f"✅ Health check returned 200")
    
    def test_health_check_shows_all_engines(self, api_client):
        """Test health check shows all 17 engines."""
        response = api_client.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        
        data = response.json()
        assert "status" in data
        assert data["status"] == "healthy"
        assert "database" in data
        assert "engines" in data
        
        engines = data["engines"]
        expected_engines = [
            "credit_engine",
            "plan_enforcement",
            "project_engine",
            "data_model_engine",
            "navigation_engine",
            "ai_instruction_engine",
            "orchestration_engine",
            "runtime_intelligence_engine",
            "canvas_engine",
            "component_library_engine",
            "ai_orchestration_engine",
            "blueprint_generation_engine",
            "system_diagnostics_engine",
            "platform_settings_engine",
            "generation_engine",
            "publishing_engine",
            "export_engine"
        ]
        
        for engine in expected_engines:
            assert engine in engines, f"Missing engine: {engine}"
            assert "operational" in engines[engine], f"Engine {engine} not operational"
        
        print(f"✅ All 17 engines present and operational")
        print(f"   Database status: {data['database']}")


class TestBlueprintGeneration(TestSetup):
    """Test Blueprint Generation Engine endpoints."""
    
    generated_blueprint_id = None
    
    @pytest.fixture(scope="class")
    def api_client(self):
        """Shared requests session."""
        session = requests.Session()
        session.headers.update({"Content-Type": "application/json"})
        return session
    
    @pytest.fixture(scope="class")
    def auth_token(self, api_client):
        """Get authentication token by signing up a new user."""
        unique_email = f"test_blueprint_{uuid.uuid4().hex[:8]}@example.com"
        response = api_client.post(f"{BASE_URL}/api/auth/signup", json={
            "email": unique_email,
            "password": TEST_PASSWORD,
            "name": TEST_NAME
        })
        
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token")
        
        pytest.skip(f"Authentication failed - status: {response.status_code}")
    
    @pytest.fixture(scope="class")
    def authenticated_client(self, api_client, auth_token):
        """Session with auth header."""
        api_client.headers.update({"Authorization": f"Bearer {auth_token}"})
        return api_client
    
    def test_generate_screen_blueprint(self, authenticated_client):
        """Test POST /api/blueprints/generate for screen type."""
        response = authenticated_client.post(f"{BASE_URL}/api/blueprints/generate", json={
            "specification": "Create a dashboard screen with stats and charts",
            "blueprint_type": "screen",
            "options": {}
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["success"] == True
        assert "blueprint" in data
        assert data["blueprint"]["type"] == "screen"
        assert "credits_used" in data
        assert "generation_time_ms" in data
        
        # Store blueprint ID for later tests
        TestBlueprintGeneration.generated_blueprint_id = data["blueprint"]["id"]
        
        print(f"✅ Screen blueprint generated successfully")
        print(f"   Blueprint ID: {data['blueprint']['id']}")
        print(f"   Credits used: {data['credits_used']}")
    
    def test_generate_page_blueprint(self, authenticated_client):
        """Test POST /api/blueprints/generate for page type."""
        response = authenticated_client.post(f"{BASE_URL}/api/blueprints/generate", json={
            "specification": "Create a home page with hero section and features",
            "blueprint_type": "page",
            "options": {}
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["success"] == True
        assert data["blueprint"]["type"] == "page"
        
        print(f"✅ Page blueprint generated successfully")
    
    def test_generate_flow_blueprint(self, authenticated_client):
        """Test POST /api/blueprints/generate for flow type."""
        response = authenticated_client.post(f"{BASE_URL}/api/blueprints/generate", json={
            "specification": "Create a user registration flow",
            "blueprint_type": "flow",
            "options": {}
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["success"] == True
        assert data["blueprint"]["type"] == "flow"
        
        print(f"✅ Flow blueprint generated successfully")
    
    def test_generate_data_model_blueprint(self, authenticated_client):
        """Test POST /api/blueprints/generate for data_model type."""
        response = authenticated_client.post(f"{BASE_URL}/api/blueprints/generate", json={
            "specification": "Create a User data model with name and email",
            "blueprint_type": "data_model",
            "options": {}
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["success"] == True
        assert data["blueprint"]["type"] == "data_model"
        
        print(f"✅ Data model blueprint generated successfully")
    
    def test_generate_invalid_blueprint_type(self, authenticated_client):
        """Test POST /api/blueprints/generate with invalid type returns 400."""
        response = authenticated_client.post(f"{BASE_URL}/api/blueprints/generate", json={
            "specification": "Test",
            "blueprint_type": "invalid_type",
            "options": {}
        })
        
        assert response.status_code == 400
        print(f"✅ Invalid blueprint type correctly rejected with 400")
    
    def test_list_blueprints(self, authenticated_client):
        """Test GET /api/blueprints/."""
        # Note: FastAPI requires trailing slash for this route
        response = authenticated_client.get(f"{BASE_URL}/api/blueprints/")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "blueprints" in data
        assert "count" in data
        assert isinstance(data["blueprints"], list)
        
        print(f"✅ Listed {data['count']} blueprints")
    
    def test_list_blueprints_with_filter(self, authenticated_client):
        """Test GET /api/blueprints/ with type filter."""
        # Note: FastAPI requires trailing slash for this route
        response = authenticated_client.get(f"{BASE_URL}/api/blueprints/?blueprint_type=screen")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        for bp in data["blueprints"]:
            assert bp["type"] == "screen"
        
        print(f"✅ Filtered blueprints by type correctly")
    
    def test_get_specific_blueprint(self, authenticated_client):
        """Test GET /api/blueprints/{id}."""
        if not TestBlueprintGeneration.generated_blueprint_id:
            pytest.skip("No blueprint ID available")
        
        response = authenticated_client.get(
            f"{BASE_URL}/api/blueprints/{TestBlueprintGeneration.generated_blueprint_id}"
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "blueprint" in data
        assert data["blueprint"]["id"] == TestBlueprintGeneration.generated_blueprint_id
        
        print(f"✅ Retrieved specific blueprint successfully")
    
    def test_get_nonexistent_blueprint(self, authenticated_client):
        """Test GET /api/blueprints/{id} with invalid ID returns 404."""
        response = authenticated_client.get(f"{BASE_URL}/api/blueprints/nonexistent-id-12345")
        
        assert response.status_code == 404
        print(f"✅ Nonexistent blueprint correctly returns 404")
    
    def test_validate_blueprint(self, authenticated_client):
        """Test POST /api/blueprints/{id}/validate."""
        if not TestBlueprintGeneration.generated_blueprint_id:
            pytest.skip("No blueprint ID available")
        
        response = authenticated_client.post(
            f"{BASE_URL}/api/blueprints/{TestBlueprintGeneration.generated_blueprint_id}/validate"
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "valid" in data
        assert "errors" in data
        assert "warnings" in data
        assert "suggestions" in data
        
        print(f"✅ Blueprint validation returned: valid={data['valid']}")
    
    def test_apply_blueprint(self, authenticated_client):
        """Test POST /api/blueprints/{id}/apply."""
        if not TestBlueprintGeneration.generated_blueprint_id:
            pytest.skip("No blueprint ID available")
        
        response = authenticated_client.post(
            f"{BASE_URL}/api/blueprints/{TestBlueprintGeneration.generated_blueprint_id}/apply"
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["success"] == True
        
        print(f"✅ Blueprint applied successfully")
    
    def test_delete_blueprint(self, authenticated_client):
        """Test DELETE /api/blueprints/{id}."""
        # First create a blueprint to delete
        create_response = authenticated_client.post(f"{BASE_URL}/api/blueprints/generate", json={
            "specification": "Temporary blueprint for deletion test",
            "blueprint_type": "component",
            "options": {}
        })
        
        if create_response.status_code != 200:
            pytest.skip("Could not create blueprint for deletion test")
        
        blueprint_id = create_response.json()["blueprint"]["id"]
        
        # Now delete it
        response = authenticated_client.delete(f"{BASE_URL}/api/blueprints/{blueprint_id}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["success"] == True
        
        # Verify it's deleted
        get_response = authenticated_client.get(f"{BASE_URL}/api/blueprints/{blueprint_id}")
        assert get_response.status_code == 404
        
        print(f"✅ Blueprint deleted successfully")
    
    def test_blueprint_requires_auth(self, api_client):
        """Test blueprint endpoints require authentication."""
        # Remove auth header temporarily
        original_auth = api_client.headers.pop("Authorization", None)
        
        response = api_client.get(f"{BASE_URL}/api/blueprints")
        assert response.status_code == 401
        
        # Restore auth header
        if original_auth:
            api_client.headers["Authorization"] = original_auth
        
        print(f"✅ Blueprint endpoints correctly require authentication")


class TestSystemDiagnostics(TestSetup):
    """Test System Diagnostics Engine endpoints."""
    
    @pytest.fixture(scope="class")
    def api_client(self):
        """Shared requests session."""
        session = requests.Session()
        session.headers.update({"Content-Type": "application/json"})
        return session
    
    @pytest.fixture(scope="class")
    def auth_token(self, api_client):
        """Get authentication token by signing up a new user."""
        unique_email = f"test_diagnostics_{uuid.uuid4().hex[:8]}@example.com"
        response = api_client.post(f"{BASE_URL}/api/auth/signup", json={
            "email": unique_email,
            "password": TEST_PASSWORD,
            "name": TEST_NAME
        })
        
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token")
        
        pytest.skip(f"Authentication failed - status: {response.status_code}")
    
    @pytest.fixture(scope="class")
    def authenticated_client(self, api_client, auth_token):
        """Session with auth header."""
        api_client.headers.update({"Authorization": f"Bearer {auth_token}"})
        return api_client
    
    def test_get_system_health(self, authenticated_client):
        """Test GET /api/diagnostics/health."""
        response = authenticated_client.get(f"{BASE_URL}/api/diagnostics/health")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "overall_status" in data
        assert "timestamp" in data
        assert "components" in data
        assert "diagnostics" in data
        assert "metrics" in data
        assert "recommendations" in data
        
        print(f"✅ System health report retrieved")
        print(f"   Overall status: {data['overall_status']}")
        print(f"   Components: {list(data['components'].keys())}")
    
    def test_check_data_integrity(self, authenticated_client):
        """Test GET /api/diagnostics/integrity."""
        response = authenticated_client.get(f"{BASE_URL}/api/diagnostics/integrity?check_type=quick")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "passed" in data
        assert "check_type" in data
        assert data["check_type"] == "quick"
        assert "details" in data
        assert "issues_found" in data
        assert "auto_fixed" in data
        assert "manual_fixes_needed" in data
        
        print(f"✅ Data integrity check completed: passed={data['passed']}")
    
    def test_check_data_integrity_full(self, authenticated_client):
        """Test GET /api/diagnostics/integrity with full check."""
        response = authenticated_client.get(f"{BASE_URL}/api/diagnostics/integrity?check_type=full")
        
        assert response.status_code == 200
        
        data = response.json()
        assert data["check_type"] == "full"
        
        print(f"✅ Full data integrity check completed")
    
    def test_check_data_integrity_invalid_type(self, authenticated_client):
        """Test GET /api/diagnostics/integrity with invalid check_type."""
        response = authenticated_client.get(f"{BASE_URL}/api/diagnostics/integrity?check_type=invalid")
        
        assert response.status_code == 400
        print(f"✅ Invalid check_type correctly rejected")
    
    def test_get_diagnostic_logs(self, authenticated_client):
        """Test GET /api/diagnostics/logs."""
        response = authenticated_client.get(f"{BASE_URL}/api/diagnostics/logs")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "diagnostics" in data
        assert "count" in data
        assert isinstance(data["diagnostics"], list)
        
        print(f"✅ Retrieved {data['count']} diagnostic logs")
    
    def test_get_diagnostic_logs_with_filters(self, authenticated_client):
        """Test GET /api/diagnostics/logs with filters."""
        response = authenticated_client.get(
            f"{BASE_URL}/api/diagnostics/logs?category=system&limit=10"
        )
        
        assert response.status_code == 200
        
        data = response.json()
        assert data["count"] <= 10
        
        print(f"✅ Filtered diagnostic logs retrieved")
    
    def test_get_recent_errors(self, authenticated_client):
        """Test GET /api/diagnostics/errors."""
        response = authenticated_client.get(f"{BASE_URL}/api/diagnostics/errors")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "errors" in data
        assert "count" in data
        assert isinstance(data["errors"], list)
        
        print(f"✅ Retrieved {data['count']} recent errors")
    
    def test_get_recent_errors_with_limit(self, authenticated_client):
        """Test GET /api/diagnostics/errors with limit."""
        response = authenticated_client.get(f"{BASE_URL}/api/diagnostics/errors?limit=5")
        
        assert response.status_code == 200
        
        data = response.json()
        assert data["count"] <= 5
        
        print(f"✅ Limited errors retrieved correctly")
    
    def test_get_metrics(self, authenticated_client):
        """Test GET /api/diagnostics/metrics."""
        response = authenticated_client.get(f"{BASE_URL}/api/diagnostics/metrics")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "metrics" in data
        
        print(f"✅ Performance metrics retrieved")
    
    def test_diagnostics_requires_auth(self, api_client):
        """Test diagnostics endpoints require authentication."""
        # Remove auth header temporarily
        original_auth = api_client.headers.pop("Authorization", None)
        
        response = api_client.get(f"{BASE_URL}/api/diagnostics/health")
        assert response.status_code == 401
        
        # Restore auth header
        if original_auth:
            api_client.headers["Authorization"] = original_auth
        
        print(f"✅ Diagnostics endpoints correctly require authentication")


class TestPlatformSettings(TestSetup):
    """Test Platform Settings Engine endpoints."""
    
    @pytest.fixture(scope="class")
    def api_client(self):
        """Shared requests session."""
        session = requests.Session()
        session.headers.update({"Content-Type": "application/json"})
        return session
    
    @pytest.fixture(scope="class")
    def auth_token(self, api_client):
        """Get authentication token by signing up a new user."""
        unique_email = f"test_settings_{uuid.uuid4().hex[:8]}@example.com"
        response = api_client.post(f"{BASE_URL}/api/auth/signup", json={
            "email": unique_email,
            "password": TEST_PASSWORD,
            "name": TEST_NAME
        })
        
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token")
        
        pytest.skip(f"Authentication failed - status: {response.status_code}")
    
    @pytest.fixture(scope="class")
    def authenticated_client(self, api_client, auth_token):
        """Session with auth header."""
        api_client.headers.update({"Authorization": f"Bearer {auth_token}"})
        return api_client
    
    def test_get_user_settings(self, authenticated_client):
        """Test GET /api/settings/user."""
        response = authenticated_client.get(f"{BASE_URL}/api/settings/user")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "settings" in data
        assert isinstance(data["settings"], dict)
        
        # Check some expected user settings exist
        settings = data["settings"]
        expected_keys = [
            "appearance.theme",
            "notifications.email_enabled",
            "ai.auto_suggestions",
            "builder.auto_save"
        ]
        
        for key in expected_keys:
            assert key in settings, f"Missing expected setting: {key}"
        
        print(f"✅ User settings retrieved: {len(settings)} settings")
    
    def test_get_user_settings_ui(self, authenticated_client):
        """Test GET /api/settings/user/ui."""
        response = authenticated_client.get(f"{BASE_URL}/api/settings/user/ui")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "categories" in data
        
        # Check categories are organized correctly
        categories = data["categories"]
        expected_categories = ["appearance", "notifications", "ai", "builder"]
        
        for cat in expected_categories:
            assert cat in categories, f"Missing category: {cat}"
        
        print(f"✅ User settings UI config retrieved: {list(categories.keys())}")
    
    def test_update_single_user_setting(self, authenticated_client):
        """Test PUT /api/settings/user/{key}."""
        # Update theme setting
        response = authenticated_client.put(
            f"{BASE_URL}/api/settings/user/appearance.theme",
            json={"value": "light"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["success"] == True
        assert data["key"] == "appearance.theme"
        assert data["value"] == "light"
        
        # Verify the change persisted
        get_response = authenticated_client.get(f"{BASE_URL}/api/settings/user")
        settings = get_response.json()["settings"]
        assert settings["appearance.theme"] == "light"
        
        # Reset to dark
        authenticated_client.put(
            f"{BASE_URL}/api/settings/user/appearance.theme",
            json={"value": "dark"}
        )
        
        print(f"✅ Single user setting updated and verified")
    
    def test_update_boolean_setting(self, authenticated_client):
        """Test updating a boolean setting."""
        response = authenticated_client.put(
            f"{BASE_URL}/api/settings/user/notifications.email_enabled",
            json={"value": False}
        )
        
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert data["value"] == False
        
        # Reset
        authenticated_client.put(
            f"{BASE_URL}/api/settings/user/notifications.email_enabled",
            json={"value": True}
        )
        
        print(f"✅ Boolean setting updated correctly")
    
    def test_update_number_setting(self, authenticated_client):
        """Test updating a number setting."""
        response = authenticated_client.put(
            f"{BASE_URL}/api/settings/user/builder.auto_save_interval",
            json={"value": 60}
        )
        
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert data["value"] == 60
        
        # Reset
        authenticated_client.put(
            f"{BASE_URL}/api/settings/user/builder.auto_save_interval",
            json={"value": 30}
        )
        
        print(f"✅ Number setting updated correctly")
    
    def test_update_setting_validation_error(self, authenticated_client):
        """Test PUT /api/settings/user/{key} with invalid value."""
        # Try to set theme to invalid value
        response = authenticated_client.put(
            f"{BASE_URL}/api/settings/user/appearance.theme",
            json={"value": "invalid_theme"}
        )
        
        assert response.status_code == 400
        print(f"✅ Invalid setting value correctly rejected")
    
    def test_update_number_setting_out_of_range(self, authenticated_client):
        """Test number setting validation (min/max)."""
        # Try to set auto_save_interval below minimum
        response = authenticated_client.put(
            f"{BASE_URL}/api/settings/user/builder.auto_save_interval",
            json={"value": 1}  # Min is 10
        )
        
        assert response.status_code == 400
        print(f"✅ Out of range number correctly rejected")
    
    def test_bulk_update_user_settings(self, authenticated_client):
        """Test PUT /api/settings/user (bulk update)."""
        response = authenticated_client.put(
            f"{BASE_URL}/api/settings/user",
            json={
                "settings": {
                    "appearance.compact_mode": True,
                    "appearance.animations": False
                }
            }
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["success"] == True
        assert "updated" in data
        
        # Reset
        authenticated_client.put(
            f"{BASE_URL}/api/settings/user",
            json={
                "settings": {
                    "appearance.compact_mode": False,
                    "appearance.animations": True
                }
            }
        )
        
        print(f"✅ Bulk settings update successful")
    
    def test_get_global_settings(self, authenticated_client):
        """Test GET /api/settings/global."""
        response = authenticated_client.get(f"{BASE_URL}/api/settings/global")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "settings" in data
        
        # Check some expected global settings
        settings = data["settings"]
        expected_keys = ["platform.name", "platform.maintenance_mode"]
        
        for key in expected_keys:
            assert key in settings, f"Missing global setting: {key}"
        
        print(f"✅ Global settings retrieved: {len(settings)} settings")
        print(f"   Platform name: {settings.get('platform.name')}")
    
    def test_settings_requires_auth(self, api_client):
        """Test settings endpoints require authentication."""
        # Remove auth header temporarily
        original_auth = api_client.headers.pop("Authorization", None)
        
        response = api_client.get(f"{BASE_URL}/api/settings/user")
        assert response.status_code == 401
        
        # Restore auth header
        if original_auth:
            api_client.headers["Authorization"] = original_auth
        
        print(f"✅ Settings endpoints correctly require authentication")


class TestAuthenticationFlow(TestSetup):
    """Test authentication endpoints work correctly."""
    
    def test_signup_creates_user(self, api_client):
        """Test POST /api/auth/signup creates a new user."""
        unique_email = f"test_signup_{uuid.uuid4().hex[:8]}@example.com"
        
        response = api_client.post(f"{BASE_URL}/api/auth/signup", json={
            "email": unique_email,
            "password": "TestPassword123!",
            "name": "Signup Test User"
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == unique_email
        assert "credits" in data["user"]
        
        print(f"✅ User signup successful")
    
    def test_signup_duplicate_email_fails(self, api_client):
        """Test POST /api/auth/signup with duplicate email fails."""
        # First create a user
        unique_email = f"test_dup_{uuid.uuid4().hex[:8]}@example.com"
        first_response = api_client.post(f"{BASE_URL}/api/auth/signup", json={
            "email": unique_email,
            "password": TEST_PASSWORD,
            "name": TEST_NAME
        })
        assert first_response.status_code == 200, "First signup should succeed"
        
        # Try to create another user with the same email
        response = api_client.post(f"{BASE_URL}/api/auth/signup", json={
            "email": unique_email,
            "password": TEST_PASSWORD,
            "name": TEST_NAME
        })
        
        # Should fail because user already exists
        assert response.status_code == 400
        assert "already registered" in response.text.lower()
        
        print(f"✅ Duplicate email correctly rejected")
    
    def test_login_returns_token(self, api_client):
        """Test POST /api/auth/login returns token."""
        # First create a user to login with
        unique_email = f"test_login_{uuid.uuid4().hex[:8]}@example.com"
        signup_response = api_client.post(f"{BASE_URL}/api/auth/signup", json={
            "email": unique_email,
            "password": TEST_PASSWORD,
            "name": TEST_NAME
        })
        assert signup_response.status_code == 200, "Signup should succeed"
        
        # Now login with the same credentials
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": unique_email,
            "password": TEST_PASSWORD
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        
        print(f"✅ Login successful, token received")
    
    def test_login_invalid_credentials(self, api_client):
        """Test POST /api/auth/login with invalid credentials fails."""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": "WrongPassword123!"
        })
        
        assert response.status_code == 401
        print(f"✅ Invalid credentials correctly rejected")


# Run tests if executed directly
if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
