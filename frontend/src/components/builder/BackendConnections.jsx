import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import {
  X,
  Database,
  Server,
  Cloud,
  Globe,
  Key,
  Plus,
  Check,
  AlertCircle,
  Loader2,
  Trash2,
  RefreshCw,
  ChevronRight,
  Zap,
  Shield,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Settings,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Backend Providers
const PROVIDERS = [
  {
    id: 'firebase',
    name: 'Firebase',
    description: 'Google Firebase - Auth, Firestore, Storage',
    icon: '🔥',
    color: 'from-orange-500 to-yellow-500',
    fields: [
      { key: 'api_key', label: 'API Key', type: 'password', required: true },
      { key: 'project_id', label: 'Project ID', type: 'text', required: true },
      { key: 'auth_domain', label: 'Auth Domain', type: 'text', required: false },
    ],
    features: ['Authentication', 'Firestore Database', 'Cloud Storage', 'Cloud Functions'],
  },
  {
    id: 'supabase',
    name: 'Supabase',
    description: 'Open source Firebase alternative with PostgreSQL',
    icon: '⚡',
    color: 'from-green-500 to-emerald-500',
    fields: [
      { key: 'url', label: 'Project URL', type: 'text', required: true, placeholder: 'https://xxx.supabase.co' },
      { key: 'anon_key', label: 'Anon/Public Key', type: 'password', required: true },
      { key: 'service_key', label: 'Service Key (optional)', type: 'password', required: false },
    ],
    features: ['PostgreSQL Database', 'Authentication', 'Storage', 'Edge Functions'],
  },
  {
    id: 'rest_api',
    name: 'REST API',
    description: 'Connect to any REST API endpoint',
    icon: '🌐',
    color: 'from-blue-500 to-cyan-500',
    fields: [
      { key: 'base_url', label: 'Base URL', type: 'text', required: true, placeholder: 'https://api.example.com' },
      { key: 'api_key', label: 'API Key (optional)', type: 'password', required: false },
      { key: 'auth_header', label: 'Auth Header Name', type: 'text', required: false, placeholder: 'Authorization' },
    ],
    features: ['Custom Endpoints', 'GET/POST/PUT/DELETE', 'Custom Headers', 'Query Parameters'],
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    description: 'Connect to GraphQL APIs',
    icon: '◈',
    color: 'from-pink-500 to-purple-500',
    fields: [
      { key: 'endpoint', label: 'GraphQL Endpoint', type: 'text', required: true, placeholder: 'https://api.example.com/graphql' },
      { key: 'api_key', label: 'API Key (optional)', type: 'password', required: false },
      { key: 'auth_header', label: 'Auth Header Name', type: 'text', required: false },
    ],
    features: ['Queries', 'Mutations', 'Subscriptions', 'Schema Introspection'],
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'Direct MongoDB Atlas connection',
    icon: '🍃',
    color: 'from-green-600 to-green-400',
    fields: [
      { key: 'connection_string', label: 'Connection String', type: 'password', required: true, placeholder: 'mongodb+srv://...' },
      { key: 'database', label: 'Database Name', type: 'text', required: true },
    ],
    features: ['Document Database', 'Aggregation', 'Real-time Sync', 'Full-text Search'],
  },
];

const BackendConnections = ({ isOpen, onClose, projectId }) => {
  const { getAuthToken } = useAuth();
  const [view, setView] = useState('list'); // list, add, details
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [formData, setFormData] = useState({});
  const [connectionName, setConnectionName] = useState('');
  const [showSecrets, setShowSecrets] = useState({});
  const [selectedConnection, setSelectedConnection] = useState(null);

  // Fetch existing connections
  const fetchConnections = useCallback(async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/backend/connections?project_id=${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setConnections(data.connections || []);
      }
    } catch (err) {
      console.error('Failed to fetch connections:', err);
    }
  }, [getAuthToken, projectId]);

  useEffect(() => {
    if (isOpen) {
      fetchConnections();
    }
  }, [isOpen, fetchConnections]);

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setConnectionName(`My ${provider.name}`);
    setFormData({});
    setTestResult(null);
    setView('add');
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/backend/connections/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider: selectedProvider.id,
          credentials: formData
        })
      });

      const data = await response.json();
      setTestResult({
        success: response.ok,
        message: data.message || (response.ok ? 'Connection successful!' : 'Connection failed')
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: 'Failed to test connection: ' + err.message
      });
    } finally {
      setTesting(false);
    }
  };

  const handleCreateConnection = async () => {
    setLoading(true);

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/backend/connections`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          project_id: projectId,
          provider: selectedProvider.id,
          name: connectionName,
          credentials: formData
        })
      });

      if (response.ok) {
        await fetchConnections();
        setView('list');
        setSelectedProvider(null);
        setFormData({});
      }
    } catch (err) {
      console.error('Failed to create connection:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConnection = async (connectionId) => {
    if (!window.confirm('Are you sure you want to delete this connection?')) return;

    try {
      const token = getAuthToken();
      await fetch(`${API_URL}/api/backend/connections/${connectionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchConnections();
    } catch (err) {
      console.error('Failed to delete connection:', err);
    }
  };

  const toggleShowSecret = (key) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getProviderById = (id) => PROVIDERS.find(p => p.id === id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Backend Connections</h2>
              <p className="text-gray-400 text-sm">Connect your app to external services</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <ScrollArea className="h-[calc(85vh-80px)]">
          {view === 'list' && (
            <div className="p-6 space-y-6">
              {/* Active Connections */}
              {connections.length > 0 && (
                <div>
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Active Connections ({connections.length})
                  </h3>
                  <div className="space-y-3">
                    {connections.map((conn) => {
                      const provider = getProviderById(conn.provider);
                      return (
                        <div
                          key={conn.id}
                          className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 bg-gradient-to-br ${provider?.color || 'from-gray-500 to-gray-600'} rounded-lg flex items-center justify-center text-xl`}>
                                {provider?.icon || '🔗'}
                              </div>
                              <div>
                                <p className="text-white font-medium">{conn.name}</p>
                                <p className="text-gray-400 text-sm">{provider?.name || conn.provider}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                conn.status === 'active' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {conn.status || 'active'}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedConnection(conn);
                                  setView('details');
                                }}
                                className="text-gray-400 hover:text-white"
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteConnection(conn.id)}
                                className="text-gray-400 hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Available Providers */}
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-400" />
                  Add New Connection
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {PROVIDERS.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => handleProviderSelect(provider)}
                      className="bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700 hover:border-gray-600 rounded-xl p-4 text-left transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${provider.color} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                          {provider.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                            {provider.name}
                          </p>
                          <p className="text-gray-400 text-sm mt-0.5">{provider.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-medium">Secure Connections</p>
                    <p className="text-blue-300/70 text-sm mt-1">
                      All credentials are encrypted and stored securely. Your API keys never leave our servers unencrypted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'add' && selectedProvider && (
            <div className="p-6 space-y-6">
              {/* Back Button */}
              <button
                onClick={() => {
                  setView('list');
                  setSelectedProvider(null);
                  setTestResult(null);
                }}
                className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
              >
                ← Back to providers
              </button>

              {/* Provider Header */}
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${selectedProvider.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                  {selectedProvider.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedProvider.name}</h3>
                  <p className="text-gray-400">{selectedProvider.description}</p>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {selectedProvider.features.map((feature, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full">
                    {feature}
                  </span>
                ))}
              </div>

              {/* Connection Name */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Connection Name
                </label>
                <Input
                  value={connectionName}
                  onChange={(e) => setConnectionName(e.target.value)}
                  placeholder="My Firebase Backend"
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
              </div>

              {/* Credential Fields */}
              <div className="space-y-4">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <Key className="w-4 h-4 text-yellow-400" />
                  Credentials
                </h4>
                {selectedProvider.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      {field.label}
                      {field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <div className="relative">
                      <Input
                        type={field.type === 'password' && !showSecrets[field.key] ? 'password' : 'text'}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={field.placeholder || ''}
                        className="bg-gray-800/50 border-gray-700 text-white pr-10"
                      />
                      {field.type === 'password' && (
                        <button
                          type="button"
                          onClick={() => toggleShowSecret(field.key)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showSecrets[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Test Result */}
              {testResult && (
                <div className={`p-4 rounded-xl border ${
                  testResult.success 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <div className="flex items-center gap-2">
                    {testResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className={testResult.success ? 'text-green-400' : 'text-red-400'}>
                      {testResult.message}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  {testing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Test Connection
                </Button>
                <Button
                  onClick={handleCreateConnection}
                  disabled={loading || !connectionName}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Create Connection
                </Button>
              </div>

              {/* Help Link */}
              <a
                href={`https://docs.bluelotus.ai/backends/${selectedProvider.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View {selectedProvider.name} setup guide
              </a>
            </div>
          )}

          {view === 'details' && selectedConnection && (
            <div className="p-6 space-y-6">
              {/* Back Button */}
              <button
                onClick={() => {
                  setView('list');
                  setSelectedConnection(null);
                }}
                className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
              >
                ← Back to connections
              </button>

              {/* Connection Details */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${getProviderById(selectedConnection.provider)?.color || 'from-gray-500 to-gray-600'} rounded-xl flex items-center justify-center text-2xl`}>
                    {getProviderById(selectedConnection.provider)?.icon || '🔗'}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{selectedConnection.name}</h3>
                    <p className="text-gray-400">{getProviderById(selectedConnection.provider)?.name}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-700">
                    <span className="text-gray-400">Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedConnection.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {selectedConnection.status || 'Active'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-700">
                    <span className="text-gray-400">Created</span>
                    <span className="text-white">
                      {new Date(selectedConnection.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-400">Connection ID</span>
                    <div className="flex items-center gap-2">
                      <code className="text-gray-300 bg-gray-800 px-2 py-1 rounded text-sm">
                        {selectedConnection.id}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedConnection.id)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Example */}
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
                <h4 className="text-white font-medium mb-3">Usage in your app</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Use this connection by saying commands like:
                </p>
                <div className="space-y-2">
                  <code className="block bg-gray-800 text-green-400 p-3 rounded-lg text-sm">
                    "Fetch users from {selectedConnection.name}"
                  </code>
                  <code className="block bg-gray-800 text-green-400 p-3 rounded-lg text-sm">
                    "Save form data to {selectedConnection.name}"
                  </code>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDeleteConnection(selectedConnection.id)}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Connection
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default BackendConnections;
