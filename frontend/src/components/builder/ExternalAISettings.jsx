import React, { useState, useEffect } from 'react';
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
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/external-ai/config`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          setConfig(prev => ({ ...prev, ...data.config, api_key: '' }));
          setHasExisting(data.config.has_api_key);
        }
      }
    } catch (err) {
      console.error('Failed to load config:', err);
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

  const handleTest = async () => {
    if (!config.api_key && !hasExisting) {
      toast.error('Please enter an API key');
      return;
    }
    
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
      
      const data = await response.json();
      setTestResult(data);
      
      if (data.success) {
        toast.success('Connection successful!');
      } else {
        toast.error(data.message || 'Connection failed');
      }
    } catch (err) {
      setTestResult({ success: false, message: err.message });
      toast.error('Test failed: ' + err.message);
    }
    
    setTesting(false);
  };

  const handleSave = async () => {
    if (!config.api_key && !hasExisting) {
      toast.error('Please enter an API key');
      return;
    }
    
    if (config.provider === 'custom' && !config.endpoint) {
      toast.error('Please enter a custom endpoint URL');
      return;
    }
    
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
      
      if (response.ok) {
        toast.success('External AI configuration saved!');
        setHasExisting(true);
        onClose();
      } else {
        const data = await response.json();
        toast.error(data.detail || 'Failed to save configuration');
      }
    } catch (err) {
      toast.error('Failed to save: ' + err.message);
    }
    
    setSaving(false);
  };

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

  const selectedProvider = PROVIDERS.find(p => p.id === config.provider);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">External AI Provider</h2>
              <p className="text-gray-400 text-sm">Connect your own AI model for app generation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Provider Selection */}
              <div>
                <Label className="text-gray-300 mb-3 block">AI Provider</Label>
                <div className="grid grid-cols-2 gap-3">
                  {PROVIDERS.map(provider => (
                    <button
                      key={provider.id}
                      onClick={() => handleProviderChange(provider.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        config.provider === provider.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{provider.logo}</span>
                        <div>
                          <p className="text-white font-medium">{provider.name}</p>
                          <p className="text-gray-400 text-xs">{provider.description}</p>
                        </div>
                      </div>
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
                    className="pl-10 pr-10 h-12 bg-gray-800 border-gray-700 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {hasExisting && (
                  <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> API key saved
                  </p>
                )}
              </div>

              {/* Model Selection */}
              <div>
                <Label className="text-gray-300">Model</Label>
                {selectedProvider?.models.length > 0 ? (
                  <select
                    value={config.model}
                    onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full mt-1 h-12 px-4 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  >
                    {selectedProvider.models.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    value={config.model}
                    onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="Enter model name"
                    className="mt-1 h-12 bg-gray-800 border-gray-700 text-white"
                  />
                )}
              </div>

              {/* Custom Endpoint (for custom provider) */}
              {config.provider === 'custom' && (
                <div>
                  <Label className="text-gray-300">Custom Endpoint URL</Label>
                  <div className="relative mt-1">
                    <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      value={config.endpoint}
                      onChange={(e) => setConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                      placeholder="https://your-api-endpoint.com/v1/chat/completions"
                      className="pl-10 h-12 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Must be OpenAI-compatible</p>
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
                    className="mt-1 h-12 bg-gray-800 border-gray-700 text-white"
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
                    className="mt-1 h-12 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              {/* Enable/Disable Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                <div>
                  <p className="text-white font-medium">Enable External AI</p>
                  <p className="text-gray-400 text-sm">Use this provider for app generation</p>
                </div>
                <button
                  onClick={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`w-12 h-7 rounded-full transition-colors ${
                    config.enabled ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    config.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Test Result */}
              {testResult && (
                <div className={`p-4 rounded-xl ${
                  testResult.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
                }`}>
                  <div className="flex items-center gap-2">
                    {testResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className={testResult.success ? 'text-green-400' : 'text-red-400'}>
                      {testResult.message}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex items-center justify-between">
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
              disabled={testing || (!config.api_key && !hasExisting)}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
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
              disabled={saving || (!config.api_key && !hasExisting)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
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
