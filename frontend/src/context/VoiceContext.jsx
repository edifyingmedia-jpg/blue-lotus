import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const VoiceContext = createContext(null);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

export const VoiceProvider = ({ children }) => {
  const { token } = useAuth();
  
  // State
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [lastResponse, setLastResponse] = useState(null);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [pendingConfirmation, setPendingConfirmation] = useState(null);
  
  // Settings
  const [settings, setSettings] = useState({
    voice_mode: 'voice_on',
    voice_input_enabled: true,
    voice_output_enabled: true,
    input_mode: 'push_to_talk',
    preferred_voice: 'nova',
    speech_speed: 1.0,
    auto_send_on_silence: true,
    silence_threshold_ms: 1500,
    show_transcription: true,
    play_sound_effects: true,
  });
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const audioPlayerRef = useRef(null);
  
  // Audio level for visualization
  const [audioLevel, setAudioLevel] = useState(0);
  
  // Load settings on mount
  useEffect(() => {
    if (token) {
      loadSettings();
    }
  }, [token]);
  
  const loadSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/voice/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.text().then(t => t ? JSON.parse(t) : null);
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to load voice settings:', err);
    }
  };
  
  const updateSettings = async (newSettings) => {
    try {
      const response = await fetch(`${API_URL}/api/voice/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ settings: newSettings })
      });
      if (response.ok) {
        const data = await response.text().then(t => t ? JSON.parse(t) : null);
        setSettings(data.settings);
        return { success: true };
      }
      return { success: false, error: 'Failed to update settings' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  const toggleVoiceMode = async () => {
    try {
      const response = await fetch(`${API_URL}/api/voice/settings/toggle`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.text().then(t => t ? JSON.parse(t) : null);
        setSettings(prev => ({
          ...prev,
          voice_mode: data.voice_mode,
          voice_input_enabled: data.voice_input_enabled,
          voice_output_enabled: data.voice_output_enabled
        }));
      }
    } catch (err) {
      console.error('Failed to toggle voice mode:', err);
    }
  };
  
  const startSession = async () => {
    if (!settings.voice_input_enabled) {
      setError('Voice input is disabled');
      return null;
    }
    
    try {
      const response = await fetch(
        `${API_URL}/api/voice/session/start?mode=${settings.input_mode}`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      if (response.ok) {
        const data = await response.text().then(t => t ? JSON.parse(t) : null);
        setSessionId(data.session_id);
        return data.session_id;
      }
    } catch (err) {
      setError('Failed to start voice session');
    }
    return null;
  };
  
  const startListening = useCallback(async () => {
    if (isListening || !settings.voice_input_enabled) return;
    
    setError(null);
    setTranscription('');
    audioChunksRef.current = [];
    
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      });
      
      streamRef.current = stream;
      
      // Set up audio context for visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      // Start level monitoring
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      const updateLevel = () => {
        if (!isListening) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255);
        requestAnimationFrame(updateLevel);
      };
      
      // Set up MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await processAudio(audioBlob);
      };
      
      mediaRecorderRef.current.start(100); // Collect in 100ms chunks
      setIsListening(true);
      
      // Start level monitoring
      updateLevel();
      
      // Auto-stop on silence if enabled
      if (settings.auto_send_on_silence) {
        startSilenceDetection();
      }
      
      // Play start sound if enabled
      if (settings.play_sound_effects) {
        playSound('start');
      }
      
    } catch (err) {
      setError('Microphone access denied');
      console.error('Microphone error:', err);
    }
  }, [isListening, settings, token]);
  
  const stopListening = useCallback(async () => {
    if (!isListening) return;
    
    // Clear silence timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    
    // Stop recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsListening(false);
    setAudioLevel(0);
    
    // Play stop sound if enabled
    if (settings.play_sound_effects) {
      playSound('stop');
    }
  }, [isListening, settings]);
  
  const startSilenceDetection = () => {
    const checkSilence = () => {
      if (!analyserRef.current || !isListening) return;
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      
      if (average < 10) {
        // Silence detected, start countdown
        if (!silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(() => {
            stopListening();
          }, settings.silence_threshold_ms);
        }
      } else {
        // Sound detected, reset countdown
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      }
      
      if (isListening) {
        requestAnimationFrame(checkSilence);
      }
    };
    
    checkSilence();
  };
  
  const processAudio = async (audioBlob) => {
    setIsProcessing(true);
    
    try {
      // Transcribe audio
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      if (sessionId) {
        formData.append('session_id', sessionId);
      }
      
      const transcribeResponse = await fetch(`${API_URL}/api/voice/transcribe`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (!transcribeResponse.ok) {
        throw new Error('Transcription failed');
      }
      
      const transcribeData = await transcribeResponse.text().then(t => t ? JSON.parse(t) : null);
      
      if (!transcribeData.success || !transcribeData.text) {
        setError('Could not understand speech');
        setIsProcessing(false);
        return;
      }
      
      setTranscription(transcribeData.text);
      
      // Process the command
      await processCommand(transcribeData.text);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const processCommand = async (text, projectId = null) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/voice/process`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          project_id: projectId,
          session_id: sessionId
        })
      });
      
      if (!response.ok) {
        throw new Error('Command processing failed');
      }
      
      const data = await response.text().then(t => t ? JSON.parse(t) : null);
      setLastResponse(data);
      
      // Handle confirmation required
      if (data.type === 'confirmation_required') {
        setPendingConfirmation({
          prompt: data.prompt,
          warnings: data.warnings,
          intent: data.intent
        });
      } else {
        setPendingConfirmation(null);
      }
      
      // Speak the response if enabled
      if (data.voice_output_enabled && data.response_text) {
        await speakText(data.response_text);
      }
      
      return data;
      
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const speakText = async (text) => {
    if (!settings.voice_output_enabled || !text) return;
    
    setIsSpeaking(true);
    
    try {
      const response = await fetch(`${API_URL}/api/voice/speak`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          voice: settings.preferred_voice,
          speed: settings.speech_speed
        })
      });
      
      if (!response.ok) {
        throw new Error('TTS failed');
      }
      
      const data = await response.text().then(t => t ? JSON.parse(t) : null);
      
      if (data.audio_base64) {
        // Play the audio
        const audio = new Audio(`data:audio/mp3;base64,${data.audio_base64}`);
        audioPlayerRef.current = audio;
        
        audio.onended = () => {
          setIsSpeaking(false);
        };
        
        await audio.play();
      }
      
    } catch (err) {
      console.error('TTS error:', err);
      setIsSpeaking(false);
    }
  };
  
  const stopSpeaking = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    setIsSpeaking(false);
  };
  
  const playSound = (type) => {
    // Simple beep sounds for feedback
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    if (type === 'start') {
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.1;
    } else {
      oscillator.frequency.value = 600;
      gainNode.gain.value = 0.1;
    }
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
  };
  
  const cancelPendingConfirmation = async () => {
    if (pendingConfirmation) {
      await processCommand('no');
      setPendingConfirmation(null);
    }
  };
  
  const value = {
    // State
    isListening,
    isProcessing,
    isSpeaking,
    transcription,
    lastResponse,
    error,
    audioLevel,
    pendingConfirmation,
    settings,
    
    // Actions
    startListening,
    stopListening,
    processCommand,
    speakText,
    stopSpeaking,
    updateSettings,
    toggleVoiceMode,
    cancelPendingConfirmation,
    
    // Computed
    isVoiceEnabled: settings.voice_input_enabled || settings.voice_output_enabled,
    isVoiceInputEnabled: settings.voice_input_enabled,
    isVoiceOutputEnabled: settings.voice_output_enabled,
  };
  
  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};

export default VoiceContext;
