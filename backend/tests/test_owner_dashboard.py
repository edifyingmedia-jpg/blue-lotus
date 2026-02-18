"""
Owner Dashboard Backend Tests
Tests for billing and admin endpoints
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://voice-powered-apps.preview.emergentagent.com')

# Test credentials
OWNER_EMAIL = "owner@bluelotus.ai"
OWNER_PASSWORD = "owner123"
REGULAR_EMAIL = "test2@test.com"
REGULAR_PASSWORD = "test123"


class TestHealthCheck:
    """Health check endpoint tests"""
    
    def test_health_returns_50_engines(self):
        """Verify health check returns 50 engines"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["total_engines"] == 50
        assert len(data["engines"]) == 50
    
    def test_health_includes_billing_engine(self):
        """Verify billing_engine is in health check"""
        response = requests.get(f"{BASE_URL}/api/health")
        data = response.json()
        assert "billing_engine" in data["engines"]
        assert "Stripe" in data["engines"]["billing_engine"]
    
    def test_health_includes_admin_engine(self):
        """Verify admin_engine is in health check"""
        response = requests.get(f"{BASE_URL}/api/health")
        data = response.json()
        assert "admin_engine" in data["engines"]
        assert "Owner Dashboard" in data["engines"]["admin_engine"]


class TestBillingPlans:
    """Billing plans endpoint tests"""
    
    def test_get_plans_returns_4_plans(self):
        """Verify /api/billing/plans returns 4 subscription plans"""
        response = requests.get(f"{BASE_URL}/api/billing/plans")
        assert response.status_code == 200
        data = response.json()
        assert "plans" in data
        assert len(data["plans"]) == 4
    
    def test_plans_include_free_creator_pro_elite(self):
        """Verify all plan types are present"""
        response = requests.get(f"{BASE_URL}/api/billing/plans")
        data = response.json()
        plan_names = [p["name"] for p in data["plans"]]
        assert "Free" in plan_names
        assert "Creator" in plan_names
        assert "Pro" in plan_names
        assert "Elite" in plan_names
    
    def test_plans_have_correct_prices(self):
        """Verify plan prices are correct"""
        response = requests.get(f"{BASE_URL}/api/billing/plans")
        data = response.json()
        prices = {p["name"]: p["price"] for p in data["plans"]}
        assert prices["Free"] == 0.0
        assert prices["Creator"] == 9.99
        assert prices["Pro"] == 19.99
        assert prices["Elite"] == 29.99


class TestCreditPackages:
    """Credit packages endpoint tests"""
    
    def test_get_packages_returns_4_packages(self):
        """Verify /api/billing/credits/packages returns 4 packages"""
        response = requests.get(f"{BASE_URL}/api/billing/credits/packages")
        assert response.status_code == 200
        data = response.json()
        assert "packages" in data
        assert len(data["packages"]) == 4
    
    def test_packages_have_correct_structure(self):
        """Verify package structure"""
        response = requests.get(f"{BASE_URL}/api/billing/credits/packages")
        data = response.json()
        for pkg in data["packages"]:
            assert "package_id" in pkg
            assert "name" in pkg
            assert "credits" in pkg
            assert "price" in pkg


class TestOwnerAuth:
    """Owner authentication tests"""
    
    def test_owner_login_success(self):
        """Verify owner can login"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": OWNER_EMAIL, "password": OWNER_PASSWORD}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == OWNER_EMAIL
    
    def test_owner_email_in_owner_emails_env(self):
        """Verify owner email grants admin access"""
        # Login as owner
        login_resp = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": OWNER_EMAIL, "password": OWNER_PASSWORD}
        )
        token = login_resp.json()["access_token"]
        
        # Access admin endpoint
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200


class TestAdminStats:
    """Admin stats endpoint tests"""
    
    @pytest.fixture
    def owner_token(self):
        """Get owner auth token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": OWNER_EMAIL, "password": OWNER_PASSWORD}
        )
        return response.json()["access_token"]
    
    def test_admin_stats_requires_auth(self):
        """Verify /api/admin/stats requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        assert response.status_code == 401
    
    def test_admin_stats_requires_owner(self):
        """Verify /api/admin/stats requires owner privileges"""
        # Login as regular user
        login_resp = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": REGULAR_EMAIL, "password": REGULAR_PASSWORD}
        )
        token = login_resp.json()["access_token"]
        
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 403
        assert "Owner privileges required" in response.json()["detail"]
    
    def test_admin_stats_returns_platform_stats(self, owner_token):
        """Verify /api/admin/stats returns platform statistics"""
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_users" in data
        assert "total_projects" in data
        assert "active_sessions" in data
        assert "total_credits_used" in data
        assert "total_revenue" in data
        assert "system_status" in data


class TestAdminUsers:
    """Admin users endpoint tests"""
    
    @pytest.fixture
    def owner_token(self):
        """Get owner auth token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": OWNER_EMAIL, "password": OWNER_PASSWORD}
        )
        return response.json()["access_token"]
    
    def test_admin_users_requires_owner(self):
        """Verify /api/admin/users requires owner privileges"""
        # Login as regular user
        login_resp = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": REGULAR_EMAIL, "password": REGULAR_PASSWORD}
        )
        token = login_resp.json()["access_token"]
        
        response = requests.get(
            f"{BASE_URL}/api/admin/users",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 403
    
    def test_admin_users_returns_user_list(self, owner_token):
        """Verify /api/admin/users returns user list with pagination"""
        response = requests.get(
            f"{BASE_URL}/api/admin/users?limit=10",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "users" in data
        assert "total" in data
        assert "skip" in data
        assert "limit" in data
    
    def test_admin_users_have_required_fields(self, owner_token):
        """Verify user objects have role, plan, status columns"""
        response = requests.get(
            f"{BASE_URL}/api/admin/users?limit=5",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        data = response.json()
        for user in data["users"]:
            assert "id" in user
            assert "email" in user
            assert "role" in user
            assert "plan" in user
            assert "status" in user
            assert "projects_count" in user


class TestAdminProjects:
    """Admin projects endpoint tests"""
    
    @pytest.fixture
    def owner_token(self):
        """Get owner auth token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": OWNER_EMAIL, "password": OWNER_PASSWORD}
        )
        return response.json()["access_token"]
    
    def test_admin_projects_requires_owner(self):
        """Verify /api/admin/projects requires owner privileges"""
        # Login as regular user
        login_resp = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": REGULAR_EMAIL, "password": REGULAR_PASSWORD}
        )
        token = login_resp.json()["access_token"]
        
        response = requests.get(
            f"{BASE_URL}/api/admin/projects",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 403
    
    def test_admin_projects_returns_project_list(self, owner_token):
        """Verify /api/admin/projects returns project list with pagination"""
        response = requests.get(
            f"{BASE_URL}/api/admin/projects?limit=10",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "projects" in data
        assert "total" in data
        assert "skip" in data
        assert "limit" in data
    
    def test_admin_projects_have_required_fields(self, owner_token):
        """Verify project objects have owner, type, status columns"""
        response = requests.get(
            f"{BASE_URL}/api/admin/projects?limit=5",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        data = response.json()
        for project in data["projects"]:
            assert "id" in project
            assert "name" in project
            assert "user_id" in project
            assert "user_email" in project
            assert "type" in project
            assert "status" in project


class TestAdminBillingOverview:
    """Admin billing overview endpoint tests"""
    
    @pytest.fixture
    def owner_token(self):
        """Get owner auth token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": OWNER_EMAIL, "password": OWNER_PASSWORD}
        )
        return response.json()["access_token"]
    
    def test_admin_billing_requires_owner(self):
        """Verify /api/admin/billing/overview requires owner privileges"""
        # Login as regular user
        login_resp = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": REGULAR_EMAIL, "password": REGULAR_PASSWORD}
        )
        token = login_resp.json()["access_token"]
        
        response = requests.get(
            f"{BASE_URL}/api/admin/billing/overview",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 403
    
    def test_admin_billing_returns_overview(self, owner_token):
        """Verify /api/admin/billing/overview returns revenue and user breakdown"""
        response = requests.get(
            f"{BASE_URL}/api/admin/billing/overview",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "revenue_by_plan" in data
        assert "credit_purchases" in data
        assert "users_by_plan" in data
        assert "recent_transactions" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
