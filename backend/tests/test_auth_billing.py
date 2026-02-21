# Test Auth and Billing APIs for Blue Lotus App
# Testing: Login, Signup, Billing Plans, Credit Packages, Checkout
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestAuthEndpoints:
    """Test authentication endpoints"""
    
    def test_health_endpoint(self):
        """Verify API is healthy"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["database"] == "connected"
        print(f"Health check passed: {data['total_engines']} engines operational")
    
    def test_login_with_valid_credentials(self):
        """Test login with owner@bluelotus.ai"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "owner@bluelotus.ai", "password": "owner123"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify token structure
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        
        # Verify user data
        assert "user" in data
        user = data["user"]
        assert user["email"] == "owner@bluelotus.ai"
        assert user["role"] == "owner"
        assert "credits" in user
        assert "id" in user
        print(f"Login successful for {user['email']} with role={user['role']}, plan={user['plan']}")
    
    def test_login_with_invalid_password(self):
        """Test login fails with wrong password"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "owner@bluelotus.ai", "password": "wrongpassword"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"Invalid login correctly rejected: {data['detail']}")
    
    def test_login_with_nonexistent_user(self):
        """Test login fails for non-existent user"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "nonexistent@test.com", "password": "anypass"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 401
        print("Non-existent user login correctly rejected")
    
    def test_signup_new_user(self):
        """Test creating a new user"""
        unique_email = f"testuser_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(
            f"{BASE_URL}/api/auth/signup",
            json={
                "name": "Test User",
                "email": unique_email,
                "password": "testpass123"
            },
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify token returned
        assert "access_token" in data
        
        # Verify user created with free plan
        assert "user" in data
        user = data["user"]
        assert user["email"] == unique_email
        assert user["plan"] == "free"
        assert user["role"] == "user"
        assert "credits" in user
        
        # Free plan should have starter credits
        print(f"Signup successful: {user['email']}, plan={user['plan']}, credits={user['credits']}")
    
    def test_signup_duplicate_email(self):
        """Test signup fails for duplicate email"""
        response = requests.post(
            f"{BASE_URL}/api/auth/signup",
            json={
                "name": "Duplicate",
                "email": "owner@bluelotus.ai",
                "password": "testpass"
            },
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 400
        data = response.json()
        assert "already registered" in data["detail"].lower() or "detail" in data
        print("Duplicate email signup correctly rejected")
    
    def test_get_me_with_token(self):
        """Test getting current user profile with valid token"""
        # First login
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "owner@bluelotus.ai", "password": "owner123"},
            headers={"Content-Type": "application/json"}
        )
        token = login_response.json()["access_token"]
        
        # Then get profile
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        user = response.json()
        assert user["email"] == "owner@bluelotus.ai"
        assert "credits" in user
        print(f"Get me successful: {user['name']}, credits={user['credits']}")
    
    def test_get_me_without_token(self):
        """Test getting profile without token fails"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("Get me without token correctly rejected")


class TestBillingEndpoints:
    """Test billing and Stripe integration endpoints"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token for authenticated requests"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "owner@bluelotus.ai", "password": "owner123"},
            headers={"Content-Type": "application/json"}
        )
        return response.json()["access_token"]
    
    def test_get_billing_plans(self):
        """Test getting all billing plans"""
        response = requests.get(f"{BASE_URL}/api/billing/plans")
        assert response.status_code == 200
        data = response.json()
        
        assert "plans" in data
        plans = data["plans"]
        
        # Should have 4 plans: free, creator, pro, elite
        plan_names = [p["plan"] for p in plans]
        assert "free" in plan_names
        assert "creator" in plan_names
        assert "pro" in plan_names
        assert "elite" in plan_names
        
        # Verify pricing
        for plan in plans:
            if plan["plan"] == "free":
                assert plan["price"] == 0.0
            elif plan["plan"] == "creator":
                assert plan["price"] == 9.99
            elif plan["plan"] == "pro":
                assert plan["price"] == 19.99
            elif plan["plan"] == "elite":
                assert plan["price"] == 29.99
        
        print(f"All 4 billing plans verified: {plan_names}")
    
    def test_get_credit_packages(self):
        """Test getting credit packages"""
        response = requests.get(f"{BASE_URL}/api/billing/credits/packages")
        assert response.status_code == 200
        data = response.json()
        
        assert "packages" in data
        packages = data["packages"]
        assert len(packages) > 0
        
        for pkg in packages:
            assert "package_id" in pkg
            assert "credits" in pkg
            assert "price" in pkg
            assert pkg["credits"] > 0
            assert pkg["price"] > 0
        
        print(f"Credit packages available: {len(packages)} packages")
    
    def test_get_plans_compare(self):
        """Test plan comparison endpoint"""
        response = requests.get(f"{BASE_URL}/api/billing/plans/compare")
        assert response.status_code == 200
        data = response.json()
        assert "comparison" in data
        print("Plan comparison data available")
    
    def test_create_subscription_checkout_requires_auth(self):
        """Test subscribe endpoint requires authentication"""
        response = requests.post(
            f"{BASE_URL}/api/billing/subscribe",
            json={"plan": "creator", "origin_url": "https://test.com"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 401
        print("Subscribe without auth correctly rejected")
    
    def test_create_subscription_checkout(self, auth_token):
        """Test creating Stripe checkout session for subscription"""
        response = requests.post(
            f"{BASE_URL}/api/billing/subscribe",
            json={"plan": "creator", "origin_url": "https://blue-lotus-app.preview.emergentagent.com"},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {auth_token}"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        # Should return checkout URL and session ID
        assert "checkout_url" in data
        assert "session_id" in data
        assert data["checkout_url"].startswith("https://checkout.stripe.com")
        print(f"Stripe checkout session created: session_id={data['session_id'][:20]}...")
    
    def test_create_subscription_checkout_invalid_plan(self, auth_token):
        """Test subscribe with invalid plan fails"""
        response = requests.post(
            f"{BASE_URL}/api/billing/subscribe",
            json={"plan": "invalid_plan", "origin_url": "https://test.com"},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {auth_token}"
            }
        )
        assert response.status_code == 400
        print("Invalid plan subscription correctly rejected")
    
    def test_create_subscription_checkout_free_plan(self, auth_token):
        """Test cannot subscribe to free plan"""
        response = requests.post(
            f"{BASE_URL}/api/billing/subscribe",
            json={"plan": "free", "origin_url": "https://test.com"},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {auth_token}"
            }
        )
        assert response.status_code == 400
        print("Free plan subscription correctly rejected")
    
    def test_credit_purchase_checkout(self, auth_token):
        """Test creating checkout session for credit purchase"""
        # First get available packages
        pkg_response = requests.get(f"{BASE_URL}/api/billing/credits/packages")
        packages = pkg_response.json()["packages"]
        package_id = packages[0]["package_id"]
        
        response = requests.post(
            f"{BASE_URL}/api/billing/credits/purchase",
            json={"package_id": package_id, "origin_url": "https://blue-lotus-app.preview.emergentagent.com"},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {auth_token}"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "checkout_url" in data
        assert "session_id" in data
        print(f"Credit purchase checkout created: session_id={data['session_id'][:20]}...")
    
    def test_get_billing_info(self, auth_token):
        """Test getting user billing info"""
        response = requests.get(
            f"{BASE_URL}/api/billing/info",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "current_plan" in data
        assert "credits" in data
        print(f"Billing info: plan={data['current_plan']}")
    
    def test_get_transactions(self, auth_token):
        """Test getting transaction history"""
        response = requests.get(
            f"{BASE_URL}/api/billing/transactions",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "transactions" in data
        print(f"Transaction history: {len(data['transactions'])} transactions")


class TestProtectedRoutes:
    """Test protected routes require authentication"""
    
    def test_billing_info_requires_auth(self):
        """Billing info requires authentication"""
        response = requests.get(f"{BASE_URL}/api/billing/info")
        assert response.status_code == 401
        print("Billing info without auth correctly rejected")
    
    def test_transactions_requires_auth(self):
        """Transactions requires authentication"""
        response = requests.get(f"{BASE_URL}/api/billing/transactions")
        assert response.status_code == 401
        print("Transactions without auth correctly rejected")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
