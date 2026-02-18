# Test file for validating 31 engines in Blue Lotus
# Tests: Health check, engine count, voice engine presence

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestHealthCheck31Engines:
    """Validate all 31 engines are present in health check."""
    
    def test_health_endpoint_returns_200(self):
        """Health endpoint should return 200."""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print(f"✅ Health check: {data['status']}")
    
    def test_database_connected(self):
        """Database should be connected."""
        response = requests.get(f"{BASE_URL}/api/health")
        data = response.json()
        assert data["database"] == "connected"
        print(f"✅ Database: {data['database']}")
    
    def test_total_engine_count_is_31(self):
        """Should have exactly 31 engines."""
        response = requests.get(f"{BASE_URL}/api/health")
        data = response.json()
        engines = data.get("engines", {})
        assert len(engines) == 31, f"Expected 31 engines, got {len(engines)}"
        print(f"✅ Total engines: {len(engines)}")
    
    def test_core_engines_present(self):
        """Core engines (5) should be present."""
        response = requests.get(f"{BASE_URL}/api/health")
        engines = response.json().get("engines", {})
        
        core_engines = [
            "credit_engine",
            "plan_enforcement",
            "generation_engine",
            "publishing_engine",
            "export_engine"
        ]
        
        for engine in core_engines:
            assert engine in engines, f"Missing core engine: {engine}"
            print(f"✅ Core: {engine}")
    
    def test_build_engines_present(self):
        """Build engines (4) should be present."""
        response = requests.get(f"{BASE_URL}/api/health")
        engines = response.json().get("engines", {})
        
        build_engines = [
            "project_engine",
            "data_model_engine",
            "navigation_engine",
            "ai_instruction_engine"
        ]
        
        for engine in build_engines:
            assert engine in engines, f"Missing build engine: {engine}"
            print(f"✅ Build: {engine}")
    
    def test_advanced_engines_present(self):
        """Advanced engines (4) should be present."""
        response = requests.get(f"{BASE_URL}/api/health")
        engines = response.json().get("engines", {})
        
        advanced_engines = [
            "orchestration_engine",
            "runtime_intelligence_engine",
            "canvas_engine",
            "component_library_engine"
        ]
        
        for engine in advanced_engines:
            assert engine in engines, f"Missing advanced engine: {engine}"
            print(f"✅ Advanced: {engine}")
    
    def test_control_engines_present(self):
        """Control engines (4) should be present."""
        response = requests.get(f"{BASE_URL}/api/health")
        engines = response.json().get("engines", {})
        
        control_engines = [
            "ai_orchestration_engine",
            "blueprint_generation_engine",
            "system_diagnostics_engine",
            "platform_settings_engine"
        ]
        
        for engine in control_engines:
            assert engine in engines, f"Missing control engine: {engine}"
            print(f"✅ Control: {engine}")
    
    def test_voice_core_engines_present(self):
        """Voice Core engines (6) should be present."""
        response = requests.get(f"{BASE_URL}/api/health")
        engines = response.json().get("engines", {})
        
        voice_core_engines = [
            "voice_input_engine",
            "speech_to_intent_engine",
            "voice_orchestration_engine",
            "voice_feedback_engine",
            "voice_safety_layer",
            "voice_settings_engine"
        ]
        
        for engine in voice_core_engines:
            assert engine in engines, f"Missing voice core engine: {engine}"
            print(f"✅ Voice Core: {engine}")
    
    def test_voice_experience_engines_present(self):
        """Voice Experience engines (3) should be present."""
        response = requests.get(f"{BASE_URL}/api/health")
        engines = response.json().get("engines", {})
        
        voice_experience_engines = [
            "voice_error_handling_engine",
            "voice_accessibility_engine",
            "voice_onboarding_engine"
        ]
        
        for engine in voice_experience_engines:
            assert engine in engines, f"Missing voice experience engine: {engine}"
            print(f"✅ Voice Experience: {engine}")
    
    def test_voice_intelligence_engines_present(self):
        """Voice Intelligence engines (5) should be present."""
        response = requests.get(f"{BASE_URL}/api/health")
        engines = response.json().get("engines", {})
        
        voice_intelligence_engines = [
            "voice_help_guidance_engine",
            "voice_multistep_workflow_engine",
            "voice_component_placement_engine",
            "voice_debugging_engine",
            "extended_voice_intelligence_engine"
        ]
        
        for engine in voice_intelligence_engines:
            assert engine in engines, f"Missing voice intelligence engine: {engine}"
            print(f"✅ Voice Intelligence: {engine}")
    
    def test_all_engines_operational(self):
        """All engines should be operational."""
        response = requests.get(f"{BASE_URL}/api/health")
        engines = response.json().get("engines", {})
        
        for engine_name, status in engines.items():
            assert "operational" in status.lower(), f"Engine {engine_name} not operational: {status}"
        
        print(f"✅ All {len(engines)} engines are operational")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
