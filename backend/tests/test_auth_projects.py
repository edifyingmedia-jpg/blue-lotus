# Test file for Auth and Projects API endpoints
# Tests: Login, Signup, Dashboard data, Projects CRUD

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestHealthCheck:
    """Validate health endpoint returns 35 engines."""
    
    def test_health_endpoint_returns_200(self):
        """Health endpoint should return 200 with 35 engines."""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["database"] == "connected"
        assert data["total_engines"] == 35
        print(f"✅ Health check: {data['status']}, {data['total_engines']} engines")


class TestAuthLogin:
    """Test login flow via /api/auth/login."""
    
    def test_login_with_valid_credentials(self):
        """Login with test2@test.com should succeed."""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "test2@test.com",
            "password": "test123"
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert "access_token" in data, "Missing access_token in response"
        assert "user" in data, "Missing user in response"
        assert isinstance(data["access_token"], str)
        assert len(data["access_token"]) > 0
        
        # Validate user data
        user = data["user"]
        assert user["email"] == "test2@test.com"
        assert "id" in user
        assert "name" in user
        assert "plan" in user
        assert "credits" in user
        
        print(f"✅ Login successful: {user['email']}, plan: {user['plan']}")
    
    def test_login_with_invalid_password(self):
        """Login with wrong password should return 401."""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "test2@test.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"✅ Invalid password rejected: {data['detail']}")
    
    def test_login_with_nonexistent_email(self):
        """Login with non-existent email should return 401."""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "nonexistent@test.com",
            "password": "test123"
        })
        assert response.status_code == 401
        print("✅ Non-existent email rejected")
    
    def test_login_returns_credits_data(self):
        """Login should return user credits for dashboard."""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "test2@test.com",
            "password": "test123"
        })
        assert response.status_code == 200
        data = response.json()
        
        credits = data["user"]["credits"]
        assert "monthly" in credits
        assert "monthly_total" in credits
        assert "bonus" in credits
        assert "bonus_total" in credits
        assert "purchased" in credits
        
        print(f"✅ Credits returned: monthly={credits['monthly']}, bonus={credits['bonus']}")


class TestAuthSignup:
    """Test signup flow via /api/auth/signup."""
    
    def test_signup_new_user(self):
        """Signup with new email should succeed."""
        unique_email = f"test_signup_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/signup", json={
            "name": "Test Signup User",
            "email": unique_email,
            "password": "testpass123"
        })
        assert response.status_code == 200, f"Signup failed: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert "access_token" in data
        assert "user" in data
        
        user = data["user"]
        assert user["email"] == unique_email
        assert user["name"] == "Test Signup User"
        assert user["plan"] == "free"  # New users get free plan
        
        # Validate starter credits
        credits = user["credits"]
        assert credits["starter"] == 20  # Free plan starter credits
        
        print(f"✅ Signup successful: {user['email']}, starter credits: {credits['starter']}")
    
    def test_signup_duplicate_email(self):
        """Signup with existing email should return 400."""
        response = requests.post(f"{BASE_URL}/api/auth/signup", json={
            "name": "Duplicate User",
            "email": "test2@test.com",  # Already exists
            "password": "testpass123"
        })
        assert response.status_code == 400
        data = response.json()
        assert "already registered" in data["detail"].lower()
        print(f"✅ Duplicate email rejected: {data['detail']}")


class TestAuthMe:
    """Test /api/auth/me endpoint for dashboard data."""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token for test user."""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "test2@test.com",
            "password": "test123"
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Login failed - skipping authenticated tests")
    
    def test_get_me_with_valid_token(self, auth_token):
        """GET /api/auth/me should return user data."""
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        
        assert "id" in data
        assert "email" in data
        assert "name" in data
        assert "plan" in data
        assert "credits" in data
        
        print(f"✅ GET /me: {data['email']}, plan: {data['plan']}")
    
    def test_get_me_without_token(self):
        """GET /api/auth/me without token should return 401."""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("✅ Unauthenticated /me rejected")
    
    def test_get_me_with_invalid_token(self):
        """GET /api/auth/me with invalid token should return 401."""
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": "Bearer invalid_token_here"
        })
        assert response.status_code == 401
        print("✅ Invalid token rejected")


class TestProjectsList:
    """Test GET /api/projects/ for dashboard."""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token for test user."""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "test2@test.com",
            "password": "test123"
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Login failed")
    
    def test_get_projects_list(self, auth_token):
        """GET /api/projects/ should return list of projects."""
        response = requests.get(f"{BASE_URL}/api/projects/", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        print(f"✅ Projects list: {len(data)} projects")
        
        # If projects exist, validate structure
        if len(data) > 0:
            project = data[0]
            assert "id" in project
            assert "name" in project
            assert "description" in project
            assert "type" in project
            assert "status" in project
            print(f"✅ First project: {project['name']}, type: {project['type']}")
    
    def test_get_projects_without_auth(self):
        """GET /api/projects/ without auth should return 401."""
        response = requests.get(f"{BASE_URL}/api/projects/")
        assert response.status_code == 401
        print("✅ Unauthenticated projects list rejected")


class TestProjectCRUD:
    """Test Project CRUD operations."""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token for test user."""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "test2@test.com",
            "password": "test123"
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Login failed")
    
    def test_create_project(self, auth_token):
        """POST /api/projects/ should create a new project."""
        project_name = f"TEST_Project_{uuid.uuid4().hex[:6]}"
        response = requests.post(f"{BASE_URL}/api/projects/", 
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "name": project_name,
                "description": "Test project for API testing",
                "type": "app"
            }
        )
        assert response.status_code == 200, f"Create failed: {response.text}"
        data = response.json()
        
        assert data["name"] == project_name
        assert data["description"] == "Test project for API testing"
        assert data["type"] == "app"
        assert "id" in data
        assert data["status"] == "draft"
        
        print(f"✅ Project created: {data['name']}, id: {data['id']}")
        return data["id"]
    
    def test_create_and_get_project(self, auth_token):
        """Create project then GET to verify persistence."""
        # Create
        project_name = f"TEST_GetProject_{uuid.uuid4().hex[:6]}"
        create_response = requests.post(f"{BASE_URL}/api/projects/",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "name": project_name,
                "description": "Test persistence",
                "type": "website"
            }
        )
        assert create_response.status_code == 200
        project_id = create_response.json()["id"]
        
        # GET to verify
        get_response = requests.get(f"{BASE_URL}/api/projects/{project_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert get_response.status_code == 200
        data = get_response.json()
        
        assert data["id"] == project_id
        assert data["name"] == project_name
        assert data["type"] == "website"
        
        print(f"✅ Project persisted and retrieved: {data['name']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/projects/{project_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
    
    def test_delete_project(self, auth_token):
        """DELETE /api/projects/{id} should delete project."""
        # First create a project
        project_name = f"TEST_DeleteProject_{uuid.uuid4().hex[:6]}"
        create_response = requests.post(f"{BASE_URL}/api/projects/",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "name": project_name,
                "description": "To be deleted",
                "type": "app"
            }
        )
        assert create_response.status_code == 200
        project_id = create_response.json()["id"]
        
        # Delete
        delete_response = requests.delete(f"{BASE_URL}/api/projects/{project_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 200
        
        # Verify deleted
        get_response = requests.get(f"{BASE_URL}/api/projects/{project_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert get_response.status_code == 404
        
        print(f"✅ Project deleted: {project_id}")
    
    def test_delete_nonexistent_project(self, auth_token):
        """DELETE non-existent project should return 404."""
        response = requests.delete(f"{BASE_URL}/api/projects/nonexistent_id_12345",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 404
        print("✅ Delete non-existent project returns 404")
    
    def test_get_nonexistent_project(self, auth_token):
        """GET non-existent project should return 404."""
        response = requests.get(f"{BASE_URL}/api/projects/nonexistent_id_12345",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 404
        print("✅ Get non-existent project returns 404")


class TestDashboardIntegration:
    """Test full dashboard data flow."""
    
    def test_full_login_and_dashboard_flow(self):
        """Test complete login -> get user -> get projects flow."""
        # Step 1: Login
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "test2@test.com",
            "password": "test123"
        })
        assert login_response.status_code == 200
        token = login_response.json()["access_token"]
        user = login_response.json()["user"]
        
        print(f"✅ Step 1 - Login: {user['email']}")
        
        # Step 2: Get user data (for credits/plan)
        me_response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {token}"
        })
        assert me_response.status_code == 200
        me_data = me_response.json()
        
        assert "credits" in me_data
        assert "plan" in me_data
        print(f"✅ Step 2 - User data: plan={me_data['plan']}, credits={me_data['credits']}")
        
        # Step 3: Get projects
        projects_response = requests.get(f"{BASE_URL}/api/projects/", headers={
            "Authorization": f"Bearer {token}"
        })
        assert projects_response.status_code == 200
        projects = projects_response.json()
        
        print(f"✅ Step 3 - Projects: {len(projects)} projects loaded")
        
        # Validate dashboard has all required data
        assert me_data["credits"]["monthly"] is not None
        assert me_data["credits"]["bonus"] is not None
        assert me_data["plan"] in ["free", "creator", "pro", "team"]
        
        print("✅ Full dashboard flow completed successfully")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
