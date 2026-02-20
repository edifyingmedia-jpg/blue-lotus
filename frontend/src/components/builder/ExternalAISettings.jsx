import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import {
  X, Check, Loader2, Settings, Zap, Eye, EyeOff,
  Server, Key, Brain, Sparkles, AlertCircle, CheckCircle2
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    logo: '🤖',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-3.5-turbo'],
    description: 'GPT-4 and other OpenAI models'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    logo: '🧠',
    models: ['claude-sonnet-4-20250514', 'claude-3-opus-latest', 'claude-3-sonnet-latest', 'claude-3-haiku-latest'],
    description: 'Claude models'
  },
  {
    id: 'google',
    name: 'Google',
    logo: '✨',
    models: ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    description: 'Gemini models'
  },
  {
    id: 'custom',
    name: 'Custom',
    logo: '⚙️',
    models: [],
    description: 'OpenAI-compatible endpoint'
  }
];

const ExternalAISettings = ({ isOpen, onClose }) => {
  const { getAuthToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const loadedRef = useRef(false);
  const abortControllerRef = useRef(null);
  
  const [config, setConfig] = useState({
    provider: 'openai',
    api_key: '',
    model: 'gpt-4',
    endpoint: '',
    max_tokens: 4096,
    temperature: 0.7,
    enabled: true
  });
  
  const [hasExisting, setHasExisting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (isOpen && !loadedRef.current) {
      loadedRef.current = true;
      loadConfig();
    }
    
    if (!isOpen) {
      loadedRef.current = false;
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isOpen]);

  const loadConfig = async () => {
    setLoading(true);
    
    abortControllerRef.current = new AbortController();
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/external-ai/config`, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: abortControllerRef.current.signal
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          setConfig(prev => ({ ...prev, ...data.config, api_key: '' }));
          setHasExisting(data.config.has_api_key);
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to load config:', err);
      }
    }
    setLoading(false);
  };

  const handleProviderChange = (providerId) => {
    const provider = PROVIDERS.find(p => p.id === providerId);
    setConfig(prev => ({
      ...prev,
      provider: providerId,
      model: provider?.models[0] || '',
      endpoint: ''
    }));
    setTestResult(null);
  };

  const handleTest = useCallback(async () => {
    if (!config.api_key && !hasExisting) {
      toast.error('Please enter an API key');
      return;
    }
    
    if (testing) return;
    
    setTesting(true);
    setTestResult(null);
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/external-ai/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ config })
      });
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: false, message: text || 'Invalid response' };
      }
      
      setTestResult(data);
      
      if (data.success) {
        toast.success('Connection successful!');
      } else {
        toast.error(data.message || 'Connection failed');
      }
    } catch (err) {
      const errorMsg = err.message || 'Connection test failed';
      setTestResult({ success: false, message: errorMsg });
      toast.error('Test failed: ' + errorMsg);
    } finally {
      setTesting(false);
    }
  }, [config, hasExisting, testing, getAuthToken]);

  const handleSave = useCallback(async () => {
    if (!config.api_key && !hasExisting) {
      toast.error('Please enter an API key');
      return;
    }
    
    if (config.provider === 'custom' && !config.endpoint) {
      toast.error('Please enter a custom endpoint URL');
      return;
    }
    
    if (saving) return;
    
    setSaving(true);
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/external-ai/config`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ config })
      });
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { detail: text || 'Invalid response' };
      }
      
      if (response.ok) {
        toast.success('External AI configuration saved!');
        setHasExisting(true);
        onClose();
      } else {
        toast.error(data.detail || 'Failed to save configuration');
      }
    } catch (err) {
      toast.error('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  }, [config, hasExisting, saving, getAuthToken, onClose]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove your external AI configuration?')) {
      return;
    }
    
    try {
      const token = getAuthToken();
      await fetch(`${API_URL}/api/external-ai/config`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setConfig({
        provider: 'openai',
        api_key: '',
        model: 'gpt-4',
        endpoint: '',
        max_tokens: 4096,
        temperature: 0.7,
        enabled: true
      });
      setHasExisting(false);
      toast.success('Configuration removed');
    } catch (err) {
      toast.error('Failed to remove configuration');
    }
  };

  if (!isOpen) return null;

  const selectedProvider = PROVIDERS.find(p => p.id === config.provider);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Brain className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">External AI Provider</h2>
              <p className="text-sm text-gray-400">Connect your own AI model for app generation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {/* Provider Selection */}
            <div>
              <Label className="text-gray-300 mb-3 block">AI Provider</Label>
              <div className="grid grid-cols-2 gap-3">
                {PROVIDERS.map(provider => (
                  <button
                    key={provider.id}
                    onClick={() => handleProviderChange(provider.id)}
                    className={`p-3 rounded-lg border transition-all text-left ${
                      config.provider === provider.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{provider.logo}</span>
                      <span className="font-medium text-white">{provider.name}</span>
                    </div>
                    <p className="text-xs text-gray-400">{provider.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* API Key */}
            <div>
              <Label className="text-gray-300">API Key</Label>
              <div className="relative mt-1">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type={showKey ? 'text' : 'password'}
                  value={config.api_key}
                  onChange={(e) => setConfig(prev => ({ ...prev, api_key: e.target.value }))}
                  placeholder={hasExisting ? '••••••••••••••••' : 'Enter your API key'}
                  className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {hasExisting && (
                <p className="text-xs text-gray-500 mt-1">Leave blank to keep existing key</p>
              )}
            </div>

            {/* Model Selection */}
            <div>
              <Label className="text-gray-300">Model</Label>
              {config.provider === 'custom' ? (
                <Input
                  value={config.model}
                  onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="Enter model name"
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              ) : (
                <select
                  value={config.model}
                  onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
                  className="mt-1 w-full h-10 px-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {selectedProvider?.models.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Custom Endpoint */}
            {config.provider === 'custom' && (
              <div>
                <Label className="text-gray-300">Custom Endpoint</Label>
                <div className="relative mt-1">
                  <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    value={config.endpoint}
                    onChange={(e) => setConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                    placeholder="https://your-api.com/v1/chat/completions"
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Max Tokens</Label>
                <Input
                  type="number"
                  value={config.max_tokens}
                  onChange={(e) => setConfig(prev => ({ ...prev, max_tokens: parseInt(e.target.value) || 4096 }))}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Temperature</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={config.temperature}
                  onChange={(e) => setConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) || 0.7 }))}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            {/* Enable Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="font-medium text-white">Enable External AI</p>
                <p className="text-sm text-gray-400">Use this provider for app generation</p>
              </div>
              <button
                onClick={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  config.enabled ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  config.enabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Test Result */}
            {testResult && (
              <div className={`p-3 rounded-lg flex items-start gap-2 ${
                testResult.success 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium ${testResult.success ? 'text-green-400' : 'text-red-400'}`}>
                    {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">{testResult.message}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-800">
          <div>
            {hasExisting && (
              <Button
                variant="ghost"
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                Remove Configuration
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={testing || loading}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalAISettings;
