"""
Owner Dashboard Complete Test Suite
Tests all 54 engines and Owner Dashboard endpoints including:
- Analytics (retention, funnel, AI usage, signups)
- Settings (features, limits, branding)
- Compliance (documents, third-party)
- Support (tickets, stats, articles, feedback)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://blue-lotus-dev.preview.emergentagent.com').rstrip('/')

# Test credentials
OWNER_EMAIL = "owner@bluelotus.ai"
OWNER_PASSWORD = "owner123"
REGULAR_EMAIL = "test@test.com"
REGULAR_PASSWORD = "test123"


@pytest.fixture(scope="module")
def owner_token():
    """Get owner authentication token."""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": OWNER_EMAIL,
        "password": OWNER_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("access_token")
    pytest.skip("Owner authentication failed")


@pytest.fixture(scope="module")
def regular_token():
    """Get regular user authentication token."""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": REGULAR_EMAIL,
        "password": REGULAR_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("access_token")
    pytest.skip("Regular user authentication failed")


class TestHealthCheck:
    """Health check and engine count tests."""
    
    def test_health_returns_54_engines(self):
        """Verify health check returns 54 engines."""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["total_engines"] == 54
        assert data["status"] == "healthy"
    
    def test_health_includes_analytics_engine(self):
        """Verify analytics_engine is operational."""
        response = requests.get(f"{BASE_URL}/api/health")
        data = response.json()
        assert data["engines"]["analytics_engine"] == "operational"
    
    def test_health_includes_system_settings_engine(self):
        """Verify system_settings_engine is operational."""
        response = requests.get(f"{BASE_URL}/api/health")
        data = response.json()
        assert data["engines"]["system_settings_engine"] == "operational"
    
    def test_health_includes_compliance_engine(self):
        """Verify compliance_engine is operational."""
        response = requests.get(f"{BASE_URL}/api/health")
        data = response.json()
        assert data["engines"]["compliance_engine"] == "operational"
    
    def test_health_includes_support_engine(self):
        """Verify support_engine is operational."""
        response = requests.get(f"{BASE_URL}/api/health")
        data = response.json()
        assert data["engines"]["support_engine"] == "operational"


class TestAdminStats:
    """Admin stats endpoint tests."""
    
    def test_admin_stats_returns_data(self, owner_token):
        """Verify /api/admin/stats returns platform statistics."""
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_users" in data
        assert "total_projects" in data
        assert "total_revenue" in data
        assert "system_status" in data
    
    def test_admin_stats_requires_owner(self, regular_token):
        """Verify regular users cannot access admin stats."""
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {regular_token}"}
        )
        assert response.status_code == 403


class TestAnalyticsEndpoints:
    """Analytics endpoints tests."""
    
    def test_retention_returns_metrics(self, owner_token):
        """Verify /api/admin/analytics/retention returns user retention metrics."""
        response = requests.get(
            f"{BASE_URL}/api/admin/analytics/retention",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_users" in data
        assert "retention_rate_7d" in data
        assert "retention_rate_30d" in data
        assert "churn_rate" in data
        assert "new_users_7d" in data
    
    def test_project_funnel_returns_data(self, owner_token):
        """Verify /api/admin/analytics/project-funnel returns funnel data."""
        response = requests.get(
            f"{BASE_URL}/api/admin/analytics/project-funnel",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_users" in data
        assert "users_with_projects" in data
        assert "conversion_to_project" in data
        assert "funnel" in data
        assert "draft" in data["funnel"]
        assert "published" in data["funnel"]
    
    def test_ai_usage_returns_stats(self, owner_token):
        """Verify /api/admin/analytics/ai-usage returns AI usage stats."""
        response = requests.get(
            f"{BASE_URL}/api/admin/analytics/ai-usage",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_generations" in data
        assert "recent_generations" in data
        assert "daily_usage" in data
        assert "by_type" in data
    
    def test_signups_returns_daily_counts(self, owner_token):
        """Verify /api/admin/analytics/signups returns daily signup counts."""
        response = requests.get(
            f"{BASE_URL}/api/admin/analytics/signups?days=7",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "signups" in data
        assert isinstance(data["signups"], list)
    
    def test_analytics_requires_owner(self, regular_token):
        """Verify regular users cannot access analytics."""
        response = requests.get(
            f"{BASE_URL}/api/admin/analytics/retention",
            headers={"Authorization": f"Bearer {regular_token}"}
        )
        assert response.status_code == 403


class TestSettingsEndpoints:
    """Settings endpoints tests."""
    
    def test_features_returns_flags(self, owner_token):
        """Verify /api/admin/settings/features returns feature flags."""
        response = requests.get(
            f"{BASE_URL}/api/admin/settings/features",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "features" in data
        assert isinstance(data["features"], list)
        # Check feature structure
        if len(data["features"]) > 0:
            feature = data["features"][0]
            assert "key" in feature
            assert "name" in feature
            assert "enabled" in feature
            assert "description" in feature
    
    def test_limits_returns_global_limits(self, owner_token):
        """Verify /api/admin/settings/limits returns global limits."""
        response = requests.get(
            f"{BASE_URL}/api/admin/settings/limits",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "limits" in data
        assert isinstance(data["limits"], list)
        # Check limit structure
        if len(data["limits"]) > 0:
            limit = data["limits"][0]
            assert "key" in limit
            assert "name" in limit
            assert "value" in limit
    
    def test_branding_returns_config(self, owner_token):
        """Verify /api/admin/settings/branding returns branding config."""
        response = requests.get(
            f"{BASE_URL}/api/admin/settings/branding",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "app_name" in data
        assert "tagline" in data
        assert "primary_color" in data
    
    def test_settings_requires_owner(self, regular_token):
        """Verify regular users cannot access settings."""
        response = requests.get(
            f"{BASE_URL}/api/admin/settings/features",
            headers={"Authorization": f"Bearer {regular_token}"}
        )
        assert response.status_code == 403


class TestComplianceEndpoints:
    """Compliance endpoints tests."""
    
    def test_documents_returns_list(self, owner_token):
        """Verify /api/admin/compliance/documents returns legal docs."""
        response = requests.get(
            f"{BASE_URL}/api/admin/compliance/documents",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "documents" in data
        assert isinstance(data["documents"], list)
    
    def test_third_party_returns_services(self, owner_token):
        """Verify /api/admin/compliance/third-party returns third-party services."""
        response = requests.get(
            f"{BASE_URL}/api/admin/compliance/third-party",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "services" in data
        assert isinstance(data["services"], list)
        # Check service structure
        if len(data["services"]) > 0:
            service = data["services"][0]
            assert "name" in service
            assert "purpose" in service
            assert "data_types" in service
    
    def test_compliance_requires_owner(self, regular_token):
        """Verify regular users cannot access compliance."""
        response = requests.get(
            f"{BASE_URL}/api/admin/compliance/documents",
            headers={"Authorization": f"Bearer {regular_token}"}
        )
        assert response.status_code == 403


class TestSupportEndpoints:
    """Support endpoints tests."""
    
    def test_tickets_returns_list(self, owner_token):
        """Verify /api/admin/support/tickets returns tickets list."""
        response = requests.get(
            f"{BASE_URL}/api/admin/support/tickets",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "tickets" in data
        assert "total" in data
        assert isinstance(data["tickets"], list)
    
    def test_ticket_stats_returns_counts(self, owner_token):
        """Verify /api/admin/support/tickets/stats returns ticket stats."""
        response = requests.get(
            f"{BASE_URL}/api/admin/support/tickets/stats",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "open" in data
        assert "in_progress" in data
        assert "resolved" in data
    
    def test_articles_returns_list(self, owner_token):
        """Verify /api/admin/support/articles returns help articles."""
        response = requests.get(
            f"{BASE_URL}/api/admin/support/articles",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "articles" in data
        assert isinstance(data["articles"], list)
    
    def test_feedback_returns_list(self, owner_token):
        """Verify /api/admin/support/feedback returns user feedback."""
        response = requests.get(
            f"{BASE_URL}/api/admin/support/feedback",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "feedback" in data
        assert "total" in data
    
    def test_support_requires_owner(self, regular_token):
        """Verify regular users cannot access support."""
        response = requests.get(
            f"{BASE_URL}/api/admin/support/tickets",
            headers={"Authorization": f"Bearer {regular_token}"}
        )
        assert response.status_code == 403


class TestExistingAdminEndpoints:
    """Tests for existing admin endpoints (users, projects, billing)."""
    
    def test_users_returns_list(self, owner_token):
        """Verify /api/admin/users returns user list."""
        response = requests.get(
            f"{BASE_URL}/api/admin/users",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "users" in data
        assert "total" in data
    
    def test_projects_returns_list(self, owner_token):
        """Verify /api/admin/projects returns project list."""
        response = requests.get(
            f"{BASE_URL}/api/admin/projects",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "projects" in data
        assert "total" in data
    
    def test_billing_overview_returns_data(self, owner_token):
        """Verify /api/admin/billing/overview returns billing data."""
        response = requests.get(
            f"{BASE_URL}/api/admin/billing/overview",
            headers={"Authorization": f"Bearer {owner_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "revenue_by_plan" in data or "users_by_plan" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
