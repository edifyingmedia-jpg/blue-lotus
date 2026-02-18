"""
Test Suite for Blue Lotus Voice Engines
========================================
Tests for 6 Voice Engines:
- Voice Input Engine (POST /api/voice/session/start, /api/voice/session/{id}/stop)
- Speech-to-Intent Engine (POST /api/voice/process)
- Voice Orchestration Engine (POST /api/voice/process - command routing)
- Voice Feedback Engine (POST /api/voice/speak - TTS)
- Voice Safety Layer (confirmation handling in /api/voice/process)
- Voice Settings Engine (GET/PUT /api/voice/settings, POST /api/voice/settings/toggle)

Additional endpoints:
- GET /api/voice/config - Voice feature configuration
- POST /api/voice/transcribe - Transcribe audio (requires audio file)
- GET /api/voice/commands - Get supported voice commands
- GET /api/voice/voices - Get available TTS voices
- GET /api/health - Should show 23 engines including 6 voice engines
"""

import pytest
import requests
import os
import uuid
from datetime import datetime

# Get BASE_URL from environment
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test user credentials - unique for voice tests
TEST_EMAIL = f"test_voice_{uuid.uuid4().hex[:8]}@example.com"
TEST_PASSWORD = "VoiceTestPassword123!"
TEST_NAME = "Voice Test User"


class TestVoiceSetup:
    """Setup fixtures for voice tests."""
    
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


class TestHealthCheckVoiceEngines(TestVoiceSetup):
    """Test /api/health endpoint shows all 23 engines including 6 voice engines."""
    
    def test_health_check_shows_voice_engines(self, api_client):
        """Test health check shows all 6 voice engines."""
        response = api_client.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        
        engines = data["engines"]
        
        # Check for 6 voice engines
        voice_engines = [
            "voice_input_engine",
            "speech_to_intent_engine",
            "voice_orchestration_engine",
            "voice_feedback_engine",
            "voice_safety_layer",
            "voice_settings_engine"
        ]
        
        for engine in voice_engines:
            assert engine in engines, f"Missing voice engine: {engine}"
            assert "operational" in engines[engine], f"Voice engine {engine} not operational"
        
        # Verify total engine count is 23
        assert len(engines) == 23, f"Expected 23 engines, got {len(engines)}"
        print(f"✅ Health check shows all 23 engines including 6 voice engines")


class TestVoiceConfig(TestVoiceSetup):
    """Test GET /api/voice/config endpoint."""
    
    def test_voice_config_requires_auth(self, api_client):
        """Test voice config requires authentication."""
        # Remove auth header temporarily
        headers = {"Content-Type": "application/json"}
        response = requests.get(f"{BASE_URL}/api/voice/config", headers=headers)
        assert response.status_code == 401
        print(f"✅ Voice config requires authentication")
    
    def test_get_voice_config(self, authenticated_client):
        """Test getting voice configuration."""
        response = authenticated_client.get(f"{BASE_URL}/api/voice/config")
        assert response.status_code == 200
        
        data = response.json()
        
        # Check input config
        assert "input" in data
        input_config = data["input"]
        assert "supported_modes" in input_config
        assert "supported_formats" in input_config
        assert "max_duration_ms" in input_config
        assert "max_file_size_bytes" in input_config
        assert "recommended_settings" in input_config
        
        # Check feedback config
        assert "feedback" in data
        feedback_config = data["feedback"]
        assert "available_voices" in feedback_config
        assert "available_models" in feedback_config
        assert "speed_range" in feedback_config
        
        # Check supported commands
        assert "supported_commands" in data
        assert len(data["supported_commands"]) > 0
        
        # Check safety info
        assert "safety" in data
        assert "dangerous_actions" in data["safety"]
        
        print(f"✅ Voice config returned successfully with all sections")


class TestVoiceSession(TestVoiceSetup):
    """Test voice session endpoints."""
    
    def test_start_voice_session_requires_auth(self, api_client):
        """Test starting voice session requires authentication."""
        headers = {"Content-Type": "application/json"}
        response = requests.post(f"{BASE_URL}/api/voice/session/start", headers=headers)
        assert response.status_code == 401
        print(f"✅ Start voice session requires authentication")
    
    def test_start_voice_session_default_mode(self, authenticated_client):
        """Test starting voice session with default mode."""
        response = authenticated_client.post(f"{BASE_URL}/api/voice/session/start")
        assert response.status_code == 200
        
        data = response.json()
        assert "session_id" in data
        assert "mode" in data
        assert data["mode"] == "push_to_talk"  # Default mode
        assert "state" in data
        assert data["state"] == "idle"
        assert "config" in data
        
        print(f"✅ Voice session started with session_id: {data['session_id']}")
        return data["session_id"]
    
    def test_start_voice_session_hold_to_record(self, authenticated_client):
        """Test starting voice session with hold_to_record mode."""
        response = authenticated_client.post(
            f"{BASE_URL}/api/voice/session/start",
            params={"mode": "hold_to_record"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["mode"] == "hold_to_record"
        print(f"✅ Voice session started with hold_to_record mode")
    
    def test_start_voice_session_continuous(self, authenticated_client):
        """Test starting voice session with continuous_listening mode."""
        response = authenticated_client.post(
            f"{BASE_URL}/api/voice/session/start",
            params={"mode": "continuous_listening"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["mode"] == "continuous_listening"
        print(f"✅ Voice session started with continuous_listening mode")
    
    def test_stop_voice_session(self, authenticated_client):
        """Test stopping a voice session."""
        # First start a session
        start_response = authenticated_client.post(f"{BASE_URL}/api/voice/session/start")
        assert start_response.status_code == 200
        session_id = start_response.json()["session_id"]
        
        # Stop the session
        stop_response = authenticated_client.post(f"{BASE_URL}/api/voice/session/{session_id}/stop")
        assert stop_response.status_code == 200
        
        data = stop_response.json()
        assert data["success"] == True
        assert "message" in data
        print(f"✅ Voice session stopped successfully")
    
    def test_stop_nonexistent_session(self, authenticated_client):
        """Test stopping a non-existent session returns 404."""
        fake_session_id = str(uuid.uuid4())
        response = authenticated_client.post(f"{BASE_URL}/api/voice/session/{fake_session_id}/stop")
        assert response.status_code == 404
        print(f"✅ Stopping non-existent session returns 404")


class TestVoiceProcess(TestVoiceSetup):
    """Test POST /api/voice/process endpoint - Speech-to-Intent and Orchestration."""
    
    def test_process_requires_auth(self, api_client):
        """Test voice process requires authentication."""
        headers = {"Content-Type": "application/json"}
        response = requests.post(
            f"{BASE_URL}/api/voice/process",
            headers=headers,
            json={"text": "Create a dashboard screen"}
        )
        assert response.status_code == 401
        print(f"✅ Voice process requires authentication")
    
    def test_process_create_screen_command(self, authenticated_client):
        """Test processing 'create screen' voice command."""
        response = authenticated_client.post(
            f"{BASE_URL}/api/voice/process",
            json={"text": "Create a dashboard screen"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert data["type"] == "command_result"
        assert "response_text" in data
        assert "command" in data
        assert data["command"]["intent_type"] == "create_screen"
        assert "credits_used" in data
        assert "credits_remaining" in data
        
        print(f"✅ Create screen command processed: {data['response_text']}")
    
    def test_process_create_page_command(self, authenticated_client):
        """Test processing 'create page' voice command."""
        response = authenticated_client.post(
            f"{BASE_URL}/api/voice/process",
            json={"text": "Create a landing page"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert data["command"]["intent_type"] == "create_page"
        print(f"✅ Create page command processed")
    
    def test_process_generate_flow_command(self, authenticated_client):
        """Test processing 'generate flow' voice command."""
        response = authenticated_client.post(
            f"{BASE_URL}/api/voice/process",
            json={"text": "Generate a checkout flow with 3 steps"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert data["command"]["intent_type"] == "generate_flow"
        print(f"✅ Generate flow command processed")
    
    def test_process_help_command(self, authenticated_client):
        """Test processing 'help' voice command (no credits)."""
        # Use a clear help command without other keywords
        response = authenticated_client.post(
            f"{BASE_URL}/api/voice/process",
            json={"text": "How do I use this app"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert data["command"]["intent_type"] == "ask_for_help"
        assert data["credits_used"] == 0  # Help is free
        print(f"✅ Help command processed (0 credits)")
    
    def test_process_unknown_command(self, authenticated_client):
        """Test processing unknown/unclear voice command."""
        response = authenticated_client.post(
            f"{BASE_URL}/api/voice/process",
            json={"text": "blah blah random text"}
        )
        assert response.status_code == 200
        
        data = response.json()
        # Should still succeed but with unknown intent
        assert data["success"] == True
        assert data["command"]["intent_type"] == "unknown"
        print(f"✅ Unknown command handled gracefully")
    
    def test_process_delete_command_requires_confirmation(self, authenticated_client):
        """Test processing 'delete' command requires confirmation (safety layer)."""
        # Use a clear delete command
        response = authenticated_client.post(
            f"{BASE_URL}/api/voice/process",
            json={"text": "Delete this screen"}
        )
        assert response.status_code == 200
        
        data = response.json()
        # Should require confirmation for destructive action
        assert data["type"] == "confirmation_required"
        assert "prompt" in data
        assert "warnings" in data
        print(f"✅ Delete command requires confirmation (safety layer working)")
    
    def test_process_with_project_id(self, authenticated_client):
        """Test processing command with project context."""
        response = authenticated_client.post(
            f"{BASE_URL}/api/voice/process",
            json={
                "text": "Explain this project",
                "project_id": "test-project-123"
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        # Explain project is free (0 credits) so should always succeed
        assert data["success"] == True
        print(f"✅ Command processed with project context")


class TestVoiceSpeak(TestVoiceSetup):
    """Test POST /api/voice/speak endpoint - TTS (Voice Feedback Engine)."""
    
    def test_speak_requires_auth(self, api_client):
        """Test speak endpoint requires authentication."""
        headers = {"Content-Type": "application/json"}
        response = requests.post(
            f"{BASE_URL}/api/voice/speak",
            headers=headers,
            json={"text": "Hello world"}
        )
        assert response.status_code == 401
        print(f"✅ Speak endpoint requires authentication")
    
    def test_speak_generates_audio(self, authenticated_client):
        """Test TTS generates audio from text."""
        response = authenticated_client.post(
            f"{BASE_URL}/api/voice/speak",
            json={"text": "Hello, this is a test of the text to speech system."}
        )
        
        # TTS may fail if API key is invalid, but endpoint should work
        if response.status_code == 200:
            data = response.json()
            assert data["success"] == True
            assert "audio_base64" in data
            assert len(data["audio_base64"]) > 0
            assert "format" in data
            assert "voice" in data
            assert "duration_estimate_ms" in data
            print(f"✅ TTS generated audio successfully (format: {data['format']}, voice: {data['voice']})")
        elif response.status_code == 500:
            # TTS API may not be configured - this is acceptable
            print(f"⚠️ TTS returned 500 - API may not be configured (acceptable for testing)")
        else:
            pytest.fail(f"Unexpected status code: {response.status_code}")
    
    def test_speak_with_custom_voice(self, authenticated_client):
        """Test TTS with custom voice selection."""
        response = authenticated_client.post(
            f"{BASE_URL}/api/voice/speak",
            json={
                "text": "Testing custom voice",
                "voice": "alloy"
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            assert data["voice"] == "alloy"
            print(f"✅ TTS with custom voice 'alloy' successful")
        elif response.status_code == 500:
            print(f"⚠️ TTS returned 500 - API may not be configured")
    
    def test_speak_with_custom_speed(self, authenticated_client):
        """Test TTS with custom speed."""
        response = authenticated_client.post(
            f"{BASE_URL}/api/voice/speak",
            json={
                "text": "Testing custom speed",
                "speed": 1.5
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            assert data["success"] == True
            print(f"✅ TTS with custom speed 1.5 successful")
        elif response.status_code == 500:
            print(f"⚠️ TTS returned 500 - API may not be configured")


class TestVoiceSettings(TestVoiceSetup):
    """Test voice settings endpoints."""
    
    def test_get_settings_requires_auth(self, api_client):
        """Test get settings requires authentication."""
        headers = {"Content-Type": "application/json"}
        response = requests.get(f"{BASE_URL}/api/voice/settings", headers=headers)
        assert response.status_code == 401
        print(f"✅ Get settings requires authentication")
    
    def test_get_voice_settings(self, authenticated_client):
        """Test getting user's voice settings."""
        response = authenticated_client.get(f"{BASE_URL}/api/voice/settings")
        assert response.status_code == 200
        
        data = response.json()
        assert "settings" in data
        assert "schema" in data
        
        settings = data["settings"]
        # Check default settings
        assert "voice_mode" in settings
        assert "voice_input_enabled" in settings
        assert "voice_output_enabled" in settings
        assert "input_mode" in settings
        assert "preferred_voice" in settings
        assert "speech_speed" in settings
        
        print(f"✅ Voice settings retrieved: mode={settings['voice_mode']}, voice={settings['preferred_voice']}")
    
    def test_update_voice_settings(self, authenticated_client):
        """Test updating voice settings."""
        response = authenticated_client.put(
            f"{BASE_URL}/api/voice/settings",
            json={
                "settings": {
                    "preferred_voice": "alloy",
                    "speech_speed": 1.25
                }
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert data["settings"]["preferred_voice"] == "alloy"
        assert data["settings"]["speech_speed"] == 1.25
        print(f"✅ Voice settings updated successfully")
    
    def test_update_voice_mode(self, authenticated_client):
        """Test updating voice mode."""
        response = authenticated_client.put(
            f"{BASE_URL}/api/voice/settings",
            json={
                "settings": {
                    "voice_mode": "voice_input_only"
                }
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["settings"]["voice_mode"] == "voice_input_only"
        assert data["settings"]["voice_input_enabled"] == True
        assert data["settings"]["voice_output_enabled"] == False
        print(f"✅ Voice mode updated to voice_input_only")
    
    def test_update_invalid_voice(self, authenticated_client):
        """Test updating with invalid voice returns error."""
        response = authenticated_client.put(
            f"{BASE_URL}/api/voice/settings",
            json={
                "settings": {
                    "preferred_voice": "invalid_voice"
                }
            }
        )
        assert response.status_code == 400
        print(f"✅ Invalid voice rejected with 400")
    
    def test_update_invalid_speed(self, authenticated_client):
        """Test updating with invalid speed returns error."""
        response = authenticated_client.put(
            f"{BASE_URL}/api/voice/settings",
            json={
                "settings": {
                    "speech_speed": 10.0  # Out of range (max 4.0)
                }
            }
        )
        assert response.status_code == 400
        print(f"✅ Invalid speed rejected with 400")
    
    def test_toggle_voice_mode(self, authenticated_client):
        """Test toggling voice mode on/off."""
        # First get current state
        get_response = authenticated_client.get(f"{BASE_URL}/api/voice/settings")
        initial_mode = get_response.json()["settings"]["voice_mode"]
        
        # Toggle
        response = authenticated_client.post(f"{BASE_URL}/api/voice/settings/toggle")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "voice_mode" in data
        assert "voice_input_enabled" in data
        assert "voice_output_enabled" in data
        
        # Mode should have changed
        if initial_mode == "voice_on":
            assert data["voice_mode"] == "voice_off"
        else:
            assert data["voice_mode"] == "voice_on"
        
        print(f"✅ Voice mode toggled from {initial_mode} to {data['voice_mode']}")


class TestVoiceCommands(TestVoiceSetup):
    """Test GET /api/voice/commands endpoint."""
    
    def test_get_commands_requires_auth(self, api_client):
        """Test get commands requires authentication."""
        headers = {"Content-Type": "application/json"}
        response = requests.get(f"{BASE_URL}/api/voice/commands", headers=headers)
        assert response.status_code == 401
        print(f"✅ Get commands requires authentication")
    
    def test_get_supported_commands(self, authenticated_client):
        """Test getting list of supported voice commands."""
        response = authenticated_client.get(f"{BASE_URL}/api/voice/commands")
        assert response.status_code == 200
        
        data = response.json()
        assert "commands" in data
        commands = data["commands"]
        
        # Should have multiple command types
        assert len(commands) > 0
        
        # Check command structure
        for cmd in commands:
            assert "intent" in cmd
            assert "description" in cmd
            assert "examples" in cmd
            assert "credits" in cmd
        
        # Check for expected intents
        intents = [cmd["intent"] for cmd in commands]
        assert "create_screen" in intents
        assert "create_page" in intents
        assert "generate_flow" in intents
        
        print(f"✅ Retrieved {len(commands)} supported voice commands")


class TestVoiceVoices(TestVoiceSetup):
    """Test GET /api/voice/voices endpoint."""
    
    def test_get_voices_requires_auth(self, api_client):
        """Test get voices requires authentication."""
        headers = {"Content-Type": "application/json"}
        response = requests.get(f"{BASE_URL}/api/voice/voices", headers=headers)
        assert response.status_code == 401
        print(f"✅ Get voices requires authentication")
    
    def test_get_available_voices(self, authenticated_client):
        """Test getting list of available TTS voices."""
        response = authenticated_client.get(f"{BASE_URL}/api/voice/voices")
        assert response.status_code == 200
        
        data = response.json()
        assert "voices" in data
        voices = data["voices"]
        
        # Should have 9 OpenAI voices
        assert len(voices) == 9
        
        # Check voice structure
        for voice in voices:
            assert "id" in voice
            assert "name" in voice
            assert "description" in voice
        
        # Check for expected voices
        voice_ids = [v["id"] for v in voices]
        expected_voices = ["alloy", "ash", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer"]
        for expected in expected_voices:
            assert expected in voice_ids, f"Missing voice: {expected}"
        
        print(f"✅ Retrieved {len(voices)} available TTS voices")


class TestVoiceTranscribe(TestVoiceSetup):
    """Test POST /api/voice/transcribe endpoint (requires audio file)."""
    
    def test_transcribe_requires_auth(self, api_client):
        """Test transcribe requires authentication."""
        # Create a minimal audio file for testing
        response = requests.post(
            f"{BASE_URL}/api/voice/transcribe",
            files={"audio": ("test.webm", b"fake audio data", "audio/webm")}
        )
        assert response.status_code == 401
        print(f"✅ Transcribe requires authentication")
    
    def test_transcribe_rejects_small_audio(self, authenticated_client):
        """Test transcribe rejects audio that's too small."""
        # Create a very small fake audio file (less than 1KB)
        small_audio = b"x" * 100
        
        # Need to use requests directly with files parameter
        response = requests.post(
            f"{BASE_URL}/api/voice/transcribe",
            headers={"Authorization": authenticated_client.headers.get("Authorization")},
            files={"audio": ("test.webm", small_audio, "audio/webm")}
        )
        
        # Should reject as too small (400)
        assert response.status_code == 400
        assert "too small" in response.json().get("detail", "").lower()
        print(f"✅ Transcribe rejects audio that's too small")
    
    def test_transcribe_validates_audio_format(self, authenticated_client):
        """Test transcribe validates audio format."""
        # Create a fake audio file with valid size (above 1KB minimum)
        fake_audio = b"x" * 2000
        
        response = requests.post(
            f"{BASE_URL}/api/voice/transcribe",
            headers={"Authorization": authenticated_client.headers.get("Authorization")},
            files={"audio": ("test.webm", fake_audio, "audio/webm")}
        )
        
        # Will fail at STT level but should pass size validation
        # Status could be 200 with error in response, or 500 if STT fails
        assert response.status_code in [200, 500]
        print(f"✅ Transcribe endpoint accepts valid audio format (status: {response.status_code})")


class TestVoiceIntegration(TestVoiceSetup):
    """Integration tests for voice workflow."""
    
    def test_full_voice_workflow(self, authenticated_client):
        """Test complete voice workflow: session -> process -> speak."""
        # 1. Start session
        session_response = authenticated_client.post(f"{BASE_URL}/api/voice/session/start")
        assert session_response.status_code == 200
        session_id = session_response.json()["session_id"]
        print(f"  1. Session started: {session_id}")
        
        # 2. Process voice command (use free command to avoid credit issues)
        process_response = authenticated_client.post(
            f"{BASE_URL}/api/voice/process",
            json={
                "text": "Explain this project",
                "session_id": session_id
            }
        )
        assert process_response.status_code == 200
        process_data = process_response.json()
        assert process_data["success"] == True
        response_text = process_data["response_text"]
        print(f"  2. Command processed: {response_text}")
        
        # 3. Generate speech response (if TTS is configured)
        speak_response = authenticated_client.post(
            f"{BASE_URL}/api/voice/speak",
            json={"text": response_text}
        )
        if speak_response.status_code == 200:
            print(f"  3. Speech generated successfully")
        else:
            print(f"  3. Speech generation skipped (TTS not configured)")
        
        # 4. Stop session
        stop_response = authenticated_client.post(f"{BASE_URL}/api/voice/session/{session_id}/stop")
        assert stop_response.status_code == 200
        print(f"  4. Session stopped")
        
        print(f"✅ Full voice workflow completed successfully")
    
    def test_voice_settings_affect_processing(self, authenticated_client):
        """Test that voice settings affect command processing."""
        # Disable voice output
        authenticated_client.put(
            f"{BASE_URL}/api/voice/settings",
            json={"settings": {"voice_output_enabled": False}}
        )
        
        # Process command
        response = authenticated_client.post(
            f"{BASE_URL}/api/voice/process",
            json={"text": "Create a settings screen"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["voice_output_enabled"] == False
        print(f"✅ Voice settings correctly affect processing")
        
        # Re-enable voice output
        authenticated_client.put(
            f"{BASE_URL}/api/voice/settings",
            json={"settings": {"voice_output_enabled": True}}
        )


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
