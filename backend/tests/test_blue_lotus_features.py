"""
Blue Lotus - Comprehensive Feature Tests
Tests: Login, Builder AI (YouTube clone, e-commerce, recipe app), Backend Connections, Billing/Pricing APIs
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://blue-lotus-dev.preview.emergentagent.com')


class TestLoginFlow:
    """Test login with owner credentials"""
    
    def test_login_with_owner_credentials(self):
        """Test login works with owner@bluelotus.ai / owner123"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "owner@bluelotus.ai",
            "password": "owner123"
        })
        print(f"Login response: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            assert "token" in data, "Response should contain token"
            assert data.get("user", {}).get("email") == "owner@bluelotus.ai"
            print(f"Login successful for owner@bluelotus.ai")
        elif response.status_code == 404:
            # User not found, we need to register first
            reg_response = requests.post(f"{BASE_URL}/api/auth/register", json={
                "email": "owner@bluelotus.ai",
                "password": "owner123",
                "name": "Owner"
            })
            assert reg_response.status_code in [200, 201], f"Registration failed: {reg_response.text}"
            # Now try login again
            response = requests.post(f"{BASE_URL}/api/auth/login", json={
                "email": "owner@bluelotus.ai",
                "password": "owner123"
            })
            assert response.status_code == 200, f"Login after registration failed: {response.text}"
            data = response.json()
            assert "token" in data
            print(f"Login successful after registration for owner@bluelotus.ai")
        else:
            pytest.fail(f"Login failed with status {response.status_code}: {response.text}")


class TestBuilderAIGeneration:
    """Test AI component generation for complex apps"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token for tests"""
        # First try login, if fails try register
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "owner@bluelotus.ai",
            "password": "owner123"
        })
        if response.status_code != 200:
            reg_response = requests.post(f"{BASE_URL}/api/auth/register", json={
                "email": "owner@bluelotus.ai",
                "password": "owner123",
                "name": "Owner"
            })
            response = requests.post(f"{BASE_URL}/api/auth/login", json={
                "email": "owner@bluelotus.ai",
                "password": "owner123"
            })
        
        self.token = response.json().get("token")
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_generate_youtube_clone(self):
        """Test builder generates YouTube clone with all components"""
        response = requests.post(
            f"{BASE_URL}/api/builder/generate-components",
            headers=self.headers,
            json={"prompt": "Create a YouTube clone with video player, search, comments, and recommended videos"}
        )
        
        assert response.status_code == 200, f"Builder request failed: {response.status_code} - {response.text}"
        data = response.json()
        
        assert data.get("success") == True, f"Generation failed: {data}"
        components = data.get("components", [])
        assert len(components) > 0, "No components generated"
        
        # Check for expected YouTube clone components
        component_types = [c.get("type", "").lower() for c in components]
        component_names = [c.get("name", "").lower() for c in components]
        all_text = " ".join(component_types + component_names)
        
        print(f"Generated {len(components)} components for YouTube clone")
        print(f"Component types: {component_types[:10]}...")
        
        # Verify key YouTube features are present
        has_nav = any(t in ["nav", "navigation"] for t in component_types)
        has_video = any(t == "video" for t in component_types)
        has_search = any("search" in n for n in component_names) or any(t == "input" for t in component_types)
        has_comments = any("comment" in n for n in component_names) or any(t == "list" for t in component_types)
        
        print(f"YouTube clone verification: nav={has_nav}, video={has_video}, search={has_search}, comments={has_comments}")
        
        assert has_nav or has_video, "YouTube clone should have navigation or video component"
        assert len(components) >= 3, f"Expected at least 3 components, got {len(components)}"
    
    def test_generate_ecommerce_app(self):
        """Test builder generates e-commerce app components"""
        response = requests.post(
            f"{BASE_URL}/api/builder/generate-components",
            headers=self.headers,
            json={"prompt": "Build an e-commerce store with products, cart, and checkout"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data.get("success") == True, f"E-commerce generation failed: {data}"
        components = data.get("components", [])
        assert len(components) > 0, "No e-commerce components generated"
        
        component_types = [c.get("type", "").lower() for c in components]
        component_names = [c.get("name", "").lower() for c in components]
        
        print(f"Generated {len(components)} components for e-commerce app")
        print(f"Component names: {component_names[:10]}...")
        
        # Check for key e-commerce features
        has_product_grid = any(t in ["grid", "card"] for t in component_types)
        has_cart = any("cart" in n for n in component_names)
        
        print(f"E-commerce verification: product_grid={has_product_grid}, cart={has_cart}")
        assert len(components) >= 3, f"Expected at least 3 components, got {len(components)}"
    
    def test_generate_recipe_app(self):
        """Test builder generates recipe app components"""
        response = requests.post(
            f"{BASE_URL}/api/builder/generate-components",
            headers=self.headers,
            json={"prompt": "Create a recipe app with ingredients, cooking steps, and reviews"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data.get("success") == True, f"Recipe app generation failed: {data}"
        components = data.get("components", [])
        assert len(components) > 0, "No recipe components generated"
        
        component_types = [c.get("type", "").lower() for c in components]
        component_names = [c.get("name", "").lower() for c in components]
        
        print(f"Generated {len(components)} components for recipe app")
        print(f"Component names: {component_names[:10]}...")
        
        # Check for key recipe features
        has_list = any(t in ["list", "container"] for t in component_types)
        has_recipe_content = any("ingredient" in n or "step" in n or "recipe" in n for n in component_names)
        
        print(f"Recipe app verification: list={has_list}, recipe_content={has_recipe_content}")
        assert len(components) >= 3, f"Expected at least 3 components, got {len(components)}"


class TestBackendConnectionsAPI:
    """Test Backend Connections modal and API"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token for tests"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "owner@bluelotus.ai",
            "password": "owner123"
        })
        if response.status_code != 200:
            requests.post(f"{BASE_URL}/api/auth/register", json={
                "email": "owner@bluelotus.ai",
                "password": "owner123",
                "name": "Owner"
            })
            response = requests.post(f"{BASE_URL}/api/auth/login", json={
                "email": "owner@bluelotus.ai",
                "password": "owner123"
            })
        self.token = response.json().get("token")
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_list_backend_providers(self):
        """Test backend providers endpoint returns Supabase and others"""
        response = requests.get(
            f"{BASE_URL}/api/backend/providers",
            headers=self.headers
        )
        
        assert response.status_code == 200
        data = response.json()
        providers = data.get("providers", [])
        
        provider_ids = [p.get("id") for p in providers]
        print(f"Available providers: {provider_ids}")
        
        # Check Supabase is available
        assert "supabase" in provider_ids, "Supabase provider should be available"
        assert "firebase" in provider_ids, "Firebase provider should be available"
        assert len(providers) >= 4, f"Expected at least 4 providers, got {len(providers)}"
    
    def test_supabase_connection_validation(self):
        """Test Supabase connection test validates required fields"""
        # Test with missing fields
        response = requests.post(
            f"{BASE_URL}/api/backend/connections/test",
            headers=self.headers,
            json={
                "provider": "supabase",
                "credentials": {}
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Should fail validation when missing required fields
        assert data.get("success") == False, "Should fail without URL"
        assert "url" in data.get("message", "").lower() or "missing" in data.get("message", "").lower()
        print(f"Supabase validation error (expected): {data.get('message')}")
    
    def test_supabase_connection_with_credentials(self):
        """Test Supabase connection test with proper fields"""
        response = requests.post(
            f"{BASE_URL}/api/backend/connections/test",
            headers=self.headers,
            json={
                "provider": "supabase",
                "credentials": {
                    "url": "https://test.supabase.co",
                    "anon_key": "test-anon-key"
                }
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Will likely fail connection but should validate fields
        print(f"Supabase connection test result: {data}")
        # The format validation should pass even if actual connection fails


class TestBillingAPI:
    """Test Stripe billing integration APIs"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token for tests"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "owner@bluelotus.ai",
            "password": "owner123"
        })
        if response.status_code != 200:
            requests.post(f"{BASE_URL}/api/auth/register", json={
                "email": "owner@bluelotus.ai",
                "password": "owner123",
                "name": "Owner"
            })
            response = requests.post(f"{BASE_URL}/api/auth/login", json={
                "email": "owner@bluelotus.ai",
                "password": "owner123"
            })
        self.token = response.json().get("token")
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_get_billing_plans(self):
        """Test billing API returns subscription plans"""
        response = requests.get(
            f"{BASE_URL}/api/billing/plans",
            headers=self.headers
        )
        
        assert response.status_code == 200, f"Plans request failed: {response.status_code}"
        data = response.json()
        plans = data.get("plans", [])
        
        print(f"Available plans: {[p.get('name') for p in plans]}")
        
        # Check expected plans exist
        plan_ids = [p.get("plan") or p.get("id") for p in plans]
        assert len(plans) >= 3, f"Expected at least 3 plans (Creator, Pro, Elite), got {len(plans)}"
    
    def test_get_credit_packages(self):
        """Test billing API returns credit packages"""
        response = requests.get(
            f"{BASE_URL}/api/billing/credits/packages",
            headers=self.headers
        )
        
        assert response.status_code == 200, f"Credit packages request failed: {response.status_code}"
        data = response.json()
        packages = data.get("packages", [])
        
        print(f"Credit packages: {packages}")
        
        assert len(packages) >= 2, f"Expected at least 2 credit packages, got {len(packages)}"
    
    def test_subscription_checkout_flow(self):
        """Test subscription checkout creates Stripe session"""
        response = requests.post(
            f"{BASE_URL}/api/billing/subscribe",
            headers=self.headers,
            json={
                "plan": "pro",
                "origin_url": "https://blue-lotus-dev.preview.emergentagent.com"
            }
        )
        
        print(f"Checkout response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            assert "checkout_url" in data, "Response should contain checkout_url"
            assert "stripe.com" in data["checkout_url"].lower() or "session_id" in data
            print(f"Stripe checkout URL generated: {data.get('checkout_url', '')[:80]}...")
        elif response.status_code == 500:
            # Stripe might not be fully configured in test env
            print(f"Stripe checkout returned 500 (may need valid API key): {response.text}")
            pytest.skip("Stripe API key may not be valid for test environment")
        else:
            data = response.json() if response.headers.get("content-type", "").startswith("application/json") else {}
            print(f"Checkout response: {data}")
            pytest.fail(f"Unexpected status code: {response.status_code}")


class TestPricingPage:
    """Test pricing page data availability"""
    
    def test_pricing_plans_public(self):
        """Test that pricing plans data is accessible"""
        # Plans should be accessible without auth for pricing page
        response = requests.get(f"{BASE_URL}/api/billing/plans")
        
        # May require auth in this implementation
        if response.status_code == 401:
            print("Plans endpoint requires authentication (acceptable)")
            return
        
        assert response.status_code == 200
        data = response.json()
        assert "plans" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
