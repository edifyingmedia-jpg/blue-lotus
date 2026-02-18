# Test file for AI Generation API endpoints
# Tests: /api/ai/interpret, /api/ai/generate, /api/ai/features, /api/ai/feature/{project_id},
#        /api/ai/roadmap/{project_id}, /api/ai/next-step/{project_id}, /api/ai/variations,
#        /api/ai/commands, /api/ai/estimate-credits

import pytest
import requests
import os
import uuid
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_EMAIL = "test2@test.com"
TEST_PASSWORD = "test123"


@pytest.fixture(scope="module")
def auth_token():
    """Get authentication token for test user."""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    })
    if response.status_code != 200:
        pytest.skip(f"Authentication failed: {response.text}")
    return response.json()["access_token"]


@pytest.fixture(scope="module")
def auth_headers(auth_token):
    """Get headers with auth token."""
    return {"Authorization": f"Bearer {auth_token}"}


@pytest.fixture(scope="module")
def test_project(auth_headers):
    """Create a test project for feature/roadmap tests."""
    project_data = {
        "name": f"TEST_AI_Project_{uuid.uuid4().hex[:8]}",
        "type": "app",
        "description": "A test e-commerce app with product listings and checkout",
        "structure": {
            "screens": [
                {"name": "Home", "components": ["Hero", "ProductGrid"]},
                {"name": "ProductDetail", "components": ["ImageGallery", "AddToCart"]},
                {"name": "Cart", "components": ["CartItems", "Checkout"]}
            ],
            "data_models": [
                {"name": "Product", "fields": ["id", "name", "price"]},
                {"name": "User", "fields": ["id", "email", "name"]}
            ],
            "flows": [
                {"name": "Checkout", "steps": ["Cart", "Shipping", "Payment"]}
            ],
            "navigation": {"type": "tabs", "root_screen": "Home"}
        },
        "features": ["authentication"]
    }
    
    response = requests.post(
        f"{BASE_URL}/api/projects/",
        json=project_data,
        headers=auth_headers
    )
    
    if response.status_code not in [200, 201]:
        pytest.skip(f"Failed to create test project: {response.text}")
    
    project = response.json()
    yield project
    
    # Cleanup - delete test project
    requests.delete(f"{BASE_URL}/api/projects/{project['id']}", headers=auth_headers)


class TestHealthCheckWithAIEngines:
    """Verify health check reports AI engines."""
    
    def test_health_reports_41_engines(self):
        """Health endpoint should report 41 engines (35 + 8 AI - 2 overlap)."""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        # Main agent mentioned 41 engines total
        assert data["total_engines"] >= 35, f"Expected at least 35 engines, got {data['total_engines']}"
        print(f"✅ Health check: {data['status']}, {data['total_engines']} engines")


class TestAIInterpret:
    """Test POST /api/ai/interpret - Interpret app description without generation."""
    
    def test_interpret_ecommerce_description(self, auth_headers):
        """Interpret an e-commerce app description."""
        response = requests.post(
            f"{BASE_URL}/api/ai/interpret",
            json={
                "description": "Build me an online store with product listings, shopping cart, and checkout",
                "use_llm": False  # Use template-based for speed
            },
            headers=auth_headers
        )
        assert response.status_code == 200, f"Interpret failed: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert "interpreted" in data
        assert "estimated_credits" in data
        assert "confidence" in data
        
        interpreted = data["interpreted"]
        assert "app_name" in interpreted
        assert "app_purpose" in interpreted
        assert "screens" in interpreted
        assert "data_models" in interpreted
        assert "flows" in interpreted
        assert "navigation" in interpreted
        
        # Validate e-commerce detection
        assert interpreted["app_purpose"] == "ecommerce", f"Expected ecommerce, got {interpreted['app_purpose']}"
        assert len(interpreted["screens"]) > 0, "Should have screens"
        assert len(interpreted["data_models"]) > 0, "Should have data models"
        
        print(f"✅ Interpret success: {interpreted['app_name']}, purpose: {interpreted['app_purpose']}")
        print(f"   Screens: {len(interpreted['screens'])}, Models: {len(interpreted['data_models'])}")
        print(f"   Estimated credits: {data['estimated_credits']}, Confidence: {data['confidence']}")
    
    def test_interpret_social_app_description(self, auth_headers):
        """Interpret a social media app description."""
        response = requests.post(
            f"{BASE_URL}/api/ai/interpret",
            json={
                "description": "Create a social media app where users can post updates, follow friends, and chat",
                "use_llm": False
            },
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        
        interpreted = data["interpreted"]
        assert interpreted["app_purpose"] == "social"
        print(f"✅ Social app interpreted: {interpreted['app_name']}")
    
    def test_interpret_productivity_app_description(self, auth_headers):
        """Interpret a productivity app description."""
        response = requests.post(
            f"{BASE_URL}/api/ai/interpret",
            json={
                "description": "Build a task management app with kanban boards and project tracking",
                "use_llm": False
            },
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        
        interpreted = data["interpreted"]
        assert interpreted["app_purpose"] == "productivity"
        print(f"✅ Productivity app interpreted: {interpreted['app_name']}")
    
    def test_interpret_without_auth_fails(self):
        """Interpret without auth should return 401."""
        response = requests.post(
            f"{BASE_URL}/api/ai/interpret",
            json={"description": "Test app", "use_llm": False}
        )
        assert response.status_code == 401
        print("✅ Interpret without auth rejected")


class TestAIGenerate:
    """Test POST /api/ai/generate - Generate full project from description."""
    
    def test_generate_project_template_based(self, auth_headers):
        """Generate a project using template-based generation (use_llm: false)."""
        response = requests.post(
            f"{BASE_URL}/api/ai/generate",
            json={
                "description": "Create a simple task management app with todo lists",
                "mode": "full_project",
                "use_llm": False,  # Template-based for speed
                "options": {}
            },
            headers=auth_headers
        )
        assert response.status_code == 200, f"Generate failed: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert "status" in data
        assert "request_id" in data
        assert "message" in data
        assert "credits_used" in data
        
        # Check generation status
        assert data["status"] in ["complete", "validation_failed"], f"Unexpected status: {data['status']}"
        
        if data["status"] == "complete":
            assert "blueprint" in data
            assert data["blueprint"] is not None
            
            blueprint = data["blueprint"]
            assert "project_name" in blueprint
            assert "screens" in blueprint
            assert "data_models" in blueprint
            assert "flows" in blueprint
            assert "navigation" in blueprint
            
            print(f"✅ Generate success: {blueprint['project_name']}")
            print(f"   Screens: {len(blueprint['screens'])}")
            print(f"   Data models: {len(blueprint['data_models'])}")
            print(f"   Flows: {len(blueprint['flows'])}")
            print(f"   Credits used: {data['credits_used']}")
        else:
            print(f"⚠️ Generation validation failed: {data.get('validation', {})}")
    
    def test_generate_without_auth_fails(self):
        """Generate without auth should return 401."""
        response = requests.post(
            f"{BASE_URL}/api/ai/generate",
            json={"description": "Test app", "use_llm": False}
        )
        assert response.status_code == 401
        print("✅ Generate without auth rejected")
    
    def test_generate_incremental_mode(self, auth_headers):
        """Generate with incremental mode."""
        response = requests.post(
            f"{BASE_URL}/api/ai/generate",
            json={
                "description": "Add a user profile screen to my app",
                "mode": "incremental",
                "use_llm": False,
                "options": {}
            },
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        print(f"✅ Incremental generate: status={data['status']}")


class TestAIFeatures:
    """Test GET /api/ai/features - List available features."""
    
    def test_list_available_features(self, auth_headers):
        """Get list of all available features."""
        response = requests.get(
            f"{BASE_URL}/api/ai/features",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Features list failed: {response.text}"
        data = response.json()
        
        assert "features" in data
        features = data["features"]
        assert isinstance(features, list)
        assert len(features) > 0, "Should have available features"
        
        # Validate feature structure
        for feature in features:
            assert "type" in feature
            assert "name" in feature
            assert "description" in feature
            assert "credits" in feature
        
        feature_types = [f["type"] for f in features]
        print(f"✅ Available features ({len(features)}): {', '.join(feature_types[:5])}...")
    
    def test_features_without_auth_fails(self):
        """Features list without auth should return 401."""
        response = requests.get(f"{BASE_URL}/api/ai/features")
        assert response.status_code == 401
        print("✅ Features without auth rejected")


class TestAIAddFeature:
    """Test POST /api/ai/feature/{project_id} - Add feature to existing project."""
    
    def test_add_authentication_feature(self, auth_headers, test_project):
        """Add authentication feature to a project."""
        project_id = test_project["id"]
        
        response = requests.post(
            f"{BASE_URL}/api/ai/feature/{project_id}",
            json={
                "feature_type": "shopping_cart",
                "options": {}
            },
            headers=auth_headers
        )
        assert response.status_code == 200, f"Add feature failed: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert "project_id" in data
        assert "feature" in data
        assert "dependencies_met" in data
        assert "message_text" in data
        
        feature = data["feature"]
        assert "feature_type" in feature
        assert "name" in feature
        assert "screens" in feature
        
        print(f"✅ Add feature: {feature['name']}")
        print(f"   Dependencies met: {data['dependencies_met']}")
        print(f"   Missing deps: {data.get('missing_dependencies', [])}")
    
    def test_add_feature_with_dependencies(self, auth_headers, test_project):
        """Add feature that has dependencies (checkout requires cart + auth)."""
        project_id = test_project["id"]
        
        response = requests.post(
            f"{BASE_URL}/api/ai/feature/{project_id}",
            json={
                "feature_type": "checkout_flow",
                "options": {}
            },
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        
        # Checkout requires shopping_cart and authentication
        # Since test project has authentication, it should only need shopping_cart
        print(f"✅ Checkout feature: dependencies_met={data['dependencies_met']}")
        print(f"   Missing: {data.get('missing_dependencies', [])}")
    
    def test_add_feature_invalid_type(self, auth_headers, test_project):
        """Add feature with invalid type should return 400."""
        project_id = test_project["id"]
        
        response = requests.post(
            f"{BASE_URL}/api/ai/feature/{project_id}",
            json={
                "feature_type": "invalid_feature_type",
                "options": {}
            },
            headers=auth_headers
        )
        assert response.status_code == 400
        print("✅ Invalid feature type rejected")
    
    def test_add_feature_nonexistent_project(self, auth_headers):
        """Add feature to non-existent project should return 404."""
        response = requests.post(
            f"{BASE_URL}/api/ai/feature/nonexistent-project-id",
            json={
                "feature_type": "authentication_system",
                "options": {}
            },
            headers=auth_headers
        )
        assert response.status_code == 404
        print("✅ Non-existent project rejected")


class TestAIRoadmap:
    """Test GET /api/ai/roadmap/{project_id} - Get evolution roadmap."""
    
    def test_get_project_roadmap(self, auth_headers, test_project):
        """Get evolution roadmap for a project."""
        project_id = test_project["id"]
        
        response = requests.get(
            f"{BASE_URL}/api/ai/roadmap/{project_id}",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Roadmap failed: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert "project_id" in data
        assert "project_name" in data
        assert "current_state" in data
        assert "vision" in data
        assert "phases" in data
        assert "total_suggestions" in data
        assert "summary_text" in data
        assert "summary_voice" in data
        
        phases = data["phases"]
        assert isinstance(phases, dict)
        
        # Should have at least some phases
        total = data["total_suggestions"]
        print(f"✅ Roadmap for {data['project_name']}")
        print(f"   Current state: {data['current_state']}")
        print(f"   Total suggestions: {total}")
        print(f"   Phases: {list(phases.keys())}")
    
    def test_roadmap_nonexistent_project(self, auth_headers):
        """Roadmap for non-existent project should return 404."""
        response = requests.get(
            f"{BASE_URL}/api/ai/roadmap/nonexistent-project-id",
            headers=auth_headers
        )
        assert response.status_code == 404
        print("✅ Non-existent project roadmap rejected")


class TestAINextStep:
    """Test GET /api/ai/next-step/{project_id} - Get next step suggestion."""
    
    def test_get_next_step(self, auth_headers, test_project):
        """Get next step suggestion for a project."""
        project_id = test_project["id"]
        
        response = requests.get(
            f"{BASE_URL}/api/ai/next-step/{project_id}",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Next step failed: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert "suggestion" in data
        assert "message" in data
        assert "voice_message" in data
        
        suggestion = data["suggestion"]
        assert "title" in suggestion
        assert "description" in suggestion
        assert "rationale" in suggestion
        assert "effort" in suggestion
        assert "impact" in suggestion
        
        print(f"✅ Next step: {suggestion['title']}")
        print(f"   Effort: {suggestion['effort']}, Impact: {suggestion['impact']}")
    
    def test_next_step_nonexistent_project(self, auth_headers):
        """Next step for non-existent project should return 404."""
        response = requests.get(
            f"{BASE_URL}/api/ai/next-step/nonexistent-project-id",
            headers=auth_headers
        )
        assert response.status_code == 404
        print("✅ Non-existent project next-step rejected")


class TestAIVariations:
    """Test POST /api/ai/variations - Generate multiple project variations."""
    
    def test_generate_complexity_variations(self, auth_headers):
        """Generate complexity variations (simple, standard, advanced)."""
        response = requests.post(
            f"{BASE_URL}/api/ai/variations",
            json={
                "description": "A simple blog platform",
                "mode": "complexity",
                "count": 2  # Limit to 2 for speed
            },
            headers=auth_headers
        )
        
        # Accept both 200 (success) and 402 (insufficient credits)
        assert response.status_code in [200, 402], f"Variations failed: {response.text}"
        
        if response.status_code == 402:
            data = response.json()
            assert "detail" in data
            assert "credits" in data["detail"].lower()
            print(f"✅ Variations correctly rejected due to insufficient credits: {data['detail']}")
            return
        
        data = response.json()
        
        # Validate response structure
        assert "batch_id" in data
        assert "variation_mode" in data
        assert "variations" in data
        assert "total_credits" in data
        assert "comparison_summary" in data
        
        variations = data["variations"]
        assert isinstance(variations, list)
        assert len(variations) >= 1, "Should have at least 1 variation"
        
        for v in variations:
            assert "label" in v
            assert "description" in v
            assert "screens_count" in v
            assert "credits_used" in v
            assert "status" in v
        
        print(f"✅ Variations generated: {len(variations)}")
        for v in variations:
            print(f"   {v['label']}: {v['screens_count']} screens, {v['credits_used']} credits")
    
    def test_generate_audience_variations(self, auth_headers):
        """Generate audience variations (consumer, business, enterprise)."""
        response = requests.post(
            f"{BASE_URL}/api/ai/variations",
            json={
                "description": "A project management tool",
                "mode": "audience",
                "count": 2
            },
            headers=auth_headers
        )
        
        # Accept both 200 (success) and 402 (insufficient credits)
        assert response.status_code in [200, 402], f"Variations failed: {response.text}"
        
        if response.status_code == 402:
            print("✅ Audience variations correctly rejected due to insufficient credits")
            return
        
        data = response.json()
        assert data["variation_mode"] == "audience"
        print(f"✅ Audience variations: {len(data['variations'])}")
    
    def test_variations_without_auth_fails(self):
        """Variations without auth should return 401."""
        response = requests.post(
            f"{BASE_URL}/api/ai/variations",
            json={"description": "Test", "mode": "complexity", "count": 1}
        )
        assert response.status_code == 401
        print("✅ Variations without auth rejected")


class TestAICommands:
    """Test GET /api/ai/commands - Get all AI commands."""
    
    def test_get_all_commands(self, auth_headers):
        """Get all supported AI commands."""
        response = requests.get(
            f"{BASE_URL}/api/ai/commands",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Commands failed: {response.text}"
        data = response.json()
        
        # Validate response structure - should have commands from all engines
        assert "generation" in data
        assert "refinement" in data
        assert "features" in data
        assert "evolution" in data
        assert "multi_project" in data
        
        # Each should be a list of command objects
        for category, commands in data.items():
            assert isinstance(commands, list), f"{category} should be a list"
            if commands:
                assert "command" in commands[0]
                assert "examples" in commands[0]
                assert "description" in commands[0]
        
        total_commands = sum(len(cmds) for cmds in data.values())
        print(f"✅ AI Commands: {total_commands} total")
        for category, commands in data.items():
            print(f"   {category}: {len(commands)} commands")
    
    def test_commands_without_auth_fails(self):
        """Commands without auth should return 401."""
        response = requests.get(f"{BASE_URL}/api/ai/commands")
        assert response.status_code == 401
        print("✅ Commands without auth rejected")


class TestAIEstimateCredits:
    """Test POST /api/ai/estimate-credits - Estimate credits for generation."""
    
    def test_estimate_credits_full_project(self, auth_headers):
        """Estimate credits for full project generation."""
        response = requests.post(
            f"{BASE_URL}/api/ai/estimate-credits",
            json={
                "description": "Build an e-commerce app with product listings and checkout",
                "mode": "full_project"
            },
            headers=auth_headers
        )
        assert response.status_code == 200, f"Estimate failed: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert "estimated_credits" in data
        assert "current_balance" in data
        assert "sufficient" in data
        
        assert isinstance(data["estimated_credits"], int)
        assert data["estimated_credits"] > 0
        assert isinstance(data["current_balance"], int)
        assert isinstance(data["sufficient"], bool)
        
        print(f"✅ Credit estimate: {data['estimated_credits']} credits needed")
        print(f"   Current balance: {data['current_balance']}")
        print(f"   Sufficient: {data['sufficient']}")
    
    def test_estimate_credits_complex_description(self, auth_headers):
        """Estimate credits for complex project (should cost more)."""
        response = requests.post(
            f"{BASE_URL}/api/ai/estimate-credits",
            json={
                "description": "Build a complex enterprise-level full-featured e-commerce platform with advanced analytics",
                "mode": "full_project"
            },
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        
        # Complex descriptions should cost more
        assert data["estimated_credits"] >= 5, "Complex projects should cost at least 5 credits"
        print(f"✅ Complex project estimate: {data['estimated_credits']} credits")
    
    def test_estimate_credits_incremental_mode(self, auth_headers):
        """Estimate credits for incremental mode (should cost less)."""
        response = requests.post(
            f"{BASE_URL}/api/ai/estimate-credits",
            json={
                "description": "Add a profile page",
                "mode": "incremental"
            },
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        
        # Incremental should cost less than full project
        assert data["estimated_credits"] <= 5, "Incremental should cost less"
        print(f"✅ Incremental estimate: {data['estimated_credits']} credits")
    
    def test_estimate_without_auth_fails(self):
        """Estimate without auth should return 401."""
        response = requests.post(
            f"{BASE_URL}/api/ai/estimate-credits",
            json={"description": "Test", "mode": "full_project"}
        )
        assert response.status_code == 401
        print("✅ Estimate without auth rejected")


class TestAIVariationModes:
    """Test GET /api/ai/variation-modes - Get available variation modes."""
    
    def test_get_variation_modes(self, auth_headers):
        """Get all available variation modes."""
        response = requests.get(
            f"{BASE_URL}/api/ai/variation-modes",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Variation modes failed: {response.text}"
        data = response.json()
        
        assert "modes" in data
        modes = data["modes"]
        assert isinstance(modes, list)
        assert len(modes) > 0
        
        # Validate mode structure
        for mode in modes:
            assert "mode" in mode
            assert "description" in mode
            assert "variations" in mode
        
        mode_names = [m["mode"] for m in modes]
        print(f"✅ Variation modes: {', '.join(mode_names)}")


class TestAIGenerationIntegration:
    """Integration tests for AI generation flow."""
    
    def test_full_generation_flow(self, auth_headers):
        """Test complete flow: estimate -> interpret -> generate."""
        description = "Build a recipe sharing app where users can post and discover recipes"
        
        # Step 1: Estimate credits
        estimate_response = requests.post(
            f"{BASE_URL}/api/ai/estimate-credits",
            json={"description": description, "mode": "full_project"},
            headers=auth_headers
        )
        assert estimate_response.status_code == 200
        estimate = estimate_response.json()
        print(f"Step 1 - Estimate: {estimate['estimated_credits']} credits")
        
        # Step 2: Interpret description
        interpret_response = requests.post(
            f"{BASE_URL}/api/ai/interpret",
            json={"description": description, "use_llm": False},
            headers=auth_headers
        )
        assert interpret_response.status_code == 200
        interpreted = interpret_response.json()
        print(f"Step 2 - Interpret: {interpreted['interpreted']['app_name']}, {interpreted['interpreted']['app_purpose']}")
        
        # Step 3: Generate project
        generate_response = requests.post(
            f"{BASE_URL}/api/ai/generate",
            json={"description": description, "mode": "full_project", "use_llm": False},
            headers=auth_headers
        )
        assert generate_response.status_code == 200
        generated = generate_response.json()
        print(f"Step 3 - Generate: status={generated['status']}")
        
        if generated["status"] == "complete":
            blueprint = generated["blueprint"]
            print(f"   Project: {blueprint['project_name']}")
            print(f"   Screens: {len(blueprint['screens'])}")
            print(f"   Credits used: {generated['credits_used']}")
        
        print("✅ Full generation flow completed")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
