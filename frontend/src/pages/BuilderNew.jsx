import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { toast } from 'sonner';
import BackendConnections from '../components/builder/BackendConnections';
import {
  Send, ArrowLeft, Smartphone, Monitor, Tablet, RefreshCw, Trash2,
  Plus, Loader2, Check, Layout, Home, User, Settings, Bell, Server
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const BuilderNew = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getAuthToken } = useAuth();
  const inputRef = useRef(null);

  // Core state
  const [project, setProject] = useState(null);
  const [components, setComponents] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [deviceView, setDeviceView] = useState('mobile');
  const [messages, setMessages] = useState([]);
  
  // Backend connections modal state
  const [showBackendConnections, setShowBackendConnections] = useState(false);
  
  // Check for URL parameter to auto-open backend connections modal
  useEffect(() => {
    if (searchParams.get('openBackend') === 'true') {
      setShowBackendConnections(true);
    }
  }, [searchParams]);

  // Fetch project on mount
  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProject(data);
        // Load existing components from structure
        const existingComponents = data.structure?.screens?.[0]?.components || [];
        setComponents(existingComponents);
        addMessage('system', `Project "${data.name}" loaded. Start building!`);
      } else {
        setProject({ id, name: 'New Project' });
        addMessage('system', 'New project created. Describe what you want to build.');
      }
    } catch (err) {
      console.error('Failed to fetch project:', err);
      setProject({ id, name: 'New Project' });
      addMessage('system', 'Ready to build. Describe what you want to create.');
    }
    setLoading(false);
  };

  const addMessage = (type, content) => {
    setMessages(prev => [...prev, { id: Date.now(), type, content, time: new Date() }]);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!prompt.trim() || generating) return;

    const userPrompt = prompt.trim();
    setPrompt('');
    addMessage('user', userPrompt);
    setGenerating(true);

    try {
      addMessage('ai', 'Understanding your request...');
      
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/builder/generate-components`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: userPrompt })
      });

      const data = await response.json();
      
      if (data.success && data.components?.length > 0) {
        // Add components to canvas
        setComponents(prev => [...prev, ...data.components]);
        addMessage('ai', `✅ Created ${data.components.length} component(s): ${data.components.map(c => c.name || c.type).join(', ')}`);
        toast.success(`Added ${data.components.length} component(s)`);
        
        // Save to backend
        saveProject([...components, ...data.components]);
      } else {
        addMessage('ai', '❌ Could not generate components. Try being more specific.');
        toast.error('Could not generate components');
      }
    } catch (err) {
      console.error('Generation error:', err);
      addMessage('ai', `❌ Error: ${err.message}`);
      toast.error('Generation failed');
    }
    
    setGenerating(false);
  };

  const saveProject = async (newComponents) => {
    try {
      const token = getAuthToken();
      await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          structure: {
            screens: [{ id: 's1', name: 'Main', components: newComponents }]
          }
        })
      });
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const clearCanvas = () => {
    if (window.confirm('Clear all components from the canvas?')) {
      setComponents([]);
      saveProject([]);
      toast.success('Canvas cleared');
      addMessage('system', 'Canvas cleared. Start fresh!');
    }
  };

  const removeComponent = (index) => {
    const newComponents = components.filter((_, i) => i !== index);
    setComponents(newComponents);
    saveProject(newComponents);
    toast.success('Component removed');
  };

  const deviceSizes = {
    mobile: 'w-[375px]',
    tablet: 'w-[768px]',
    desktop: 'w-full max-w-[1200px]'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left Panel - Chat */}
      <div className="w-96 border-r border-gray-800 flex flex-col bg-gray-900">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-white font-medium">{project?.name || 'Builder'}</h1>
          <button onClick={clearCanvas} className="text-gray-400 hover:text-red-400" title="Clear canvas">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`${msg.type === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block max-w-[90%] rounded-lg px-4 py-2 ${
                  msg.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : msg.type === 'system'
                    ? 'bg-gray-800 text-gray-300'
                    : 'bg-gray-800 text-gray-200'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {generating && (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what to build..."
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-blue-500 focus:outline-none"
              disabled={generating}
            />
            <Button type="submit" disabled={generating || !prompt.trim()} className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {['Add a button', 'Create a form', 'Build login', 'Add stats'].map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onClick={() => { setPrompt(suggestion); inputRef.current?.focus(); }}
                className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded hover:bg-gray-700 hover:text-white"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Right Panel - Canvas */}
      <div className="flex-1 flex flex-col bg-gray-950">
        {/* Canvas Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Components: {components.length}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Device Switcher */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              {[
                { id: 'mobile', icon: Smartphone },
                { id: 'tablet', icon: Tablet },
                { id: 'desktop', icon: Monitor }
              ].map(device => (
                <button
                  key={device.id}
                  onClick={() => setDeviceView(device.id)}
                  className={`p-2 rounded ${deviceView === device.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <device.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            
            <button onClick={fetchProject} className="p-2 text-gray-400 hover:text-white" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-8 flex justify-center">
          <div className={`${deviceSizes[deviceView]} bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300`}>
            {/* App Header */}
            <div className="h-14 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between px-4">
              <span className="text-white font-medium">{project?.name || 'My App'}</span>
              <User className="w-6 h-6 text-white/70" />
            </div>

            {/* Canvas Content */}
            <div className="p-4 min-h-[500px] bg-gray-50">
              {components.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
                  <Layout className="w-16 h-16 mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-500">Your canvas is empty</p>
                  <p className="text-sm mt-1">Type something like "Create a video creator"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {components.map((component, index) => (
                    <ComponentRenderer 
                      key={component.id || index} 
                      component={component} 
                      onRemove={() => removeComponent(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Nav */}
            <div className="h-16 bg-white border-t border-gray-200 flex items-center justify-around">
              {[Home, Layout, Plus, Bell, User].map((Icon, i) => (
                <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  i === 2 ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-100'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple, reliable component renderer
const ComponentRenderer = ({ component, onRemove }) => {
  const type = (component.type || 'container').toLowerCase();
  const name = component.name || component.title || type;

  const Wrapper = ({ children, className = '' }) => (
    <div className={`relative group ${className}`}>
      {children}
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
        title="Remove"
      >
        ×
      </button>
    </div>
  );

  switch (type) {
    case 'header':
    case 'heading':
      return (
        <Wrapper>
          <h2 className="text-2xl font-bold text-gray-800">{component.content || name}</h2>
        </Wrapper>
      );

    case 'text':
    case 'paragraph':
      return (
        <Wrapper>
          <p className="text-gray-600">{component.content || 'Text content here'}</p>
        </Wrapper>
      );

    case 'button':
      return (
        <Wrapper className="inline-block">
          <button className={`px-6 py-3 rounded-lg font-medium ${
            component.variant === 'secondary' 
              ? 'bg-gray-200 text-gray-800' 
              : 'bg-blue-600 text-white'
          }`}>
            {component.label || name}
          </button>
        </Wrapper>
      );

    case 'input':
      return (
        <Wrapper>
          <input
            type={component.inputType || 'text'}
            placeholder={component.placeholder || 'Enter text...'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </Wrapper>
      );

    case 'form':
      return (
        <Wrapper>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{name}</h3>
            <div className="space-y-4">
              {(component.fields || []).map((field, i) => (
                <div key={i}>
                  <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    placeholder={field.placeholder || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              ))}
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium">
                {component.submitLabel || 'Submit'}
              </button>
            </div>
          </div>
        </Wrapper>
      );

    case 'card':
      return (
        <Wrapper>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-800">{component.title || name}</h4>
            {component.content && <p className="text-gray-600 mt-2">{component.content}</p>}
          </div>
        </Wrapper>
      );

    case 'list':
      return (
        <Wrapper>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-3">{name}</h4>
            <div className="space-y-2">
              {(component.items || []).map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                    {i + 1}
                  </div>
                  <span className="text-gray-700">{typeof item === 'string' ? item : item.text || `Item ${i + 1}`}</span>
                </div>
              ))}
            </div>
          </div>
        </Wrapper>
      );

    case 'stats':
      return (
        <Wrapper>
          <div className="grid grid-cols-2 gap-3">
            {(component.items || [
              { label: 'Users', value: '1,234' },
              { label: 'Revenue', value: '$5,678' },
              { label: 'Orders', value: '890' },
              { label: 'Growth', value: '+15%' }
            ]).map((stat, i) => (
              <div key={i} className={`p-4 rounded-xl ${
                ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100'][i % 4]
              }`}>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </Wrapper>
      );

    case 'table':
      return (
        <Wrapper>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {(component.columns || ['Col 1', 'Col 2']).map((col, i) => (
                    <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(component.rows || [['Data 1', 'Data 2']]).map((row, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-3 text-gray-700">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Wrapper>
      );

    case 'nav':
    case 'navigation':
      return (
        <Wrapper>
          <nav className="flex gap-2 p-2 bg-white rounded-xl shadow-sm border border-gray-200">
            {(component.items || ['Home', 'About', 'Contact']).map((item, i) => (
              <button key={i} className={`px-4 py-2 rounded-lg text-sm font-medium ${
                i === 0 ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}>
                {typeof item === 'string' ? item : item.label}
              </button>
            ))}
          </nav>
        </Wrapper>
      );

    case 'video':
      return (
        <Wrapper>
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl text-white">▶</span>
                </div>
                <p className="text-gray-400 mt-2">{name}</p>
              </div>
            </div>
          </div>
        </Wrapper>
      );

    case 'upload':
      return (
        <Wrapper>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:border-blue-400 transition-colors">
            <div className="text-4xl mb-2">📤</div>
            <p className="text-gray-700 font-medium">{component.label || 'Upload File'}</p>
            <p className="text-gray-500 text-sm mt-1">Drag & drop or click</p>
          </div>
        </Wrapper>
      );

    case 'timeline':
      return (
        <Wrapper>
          <div className="bg-gray-100 rounded-xl p-4">
            <p className="text-gray-600 text-sm mb-2">{name}</p>
            <div className="h-8 bg-gray-200 rounded relative">
              <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-blue-600"></div>
              <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-blue-500/30 rounded-l"></div>
            </div>
          </div>
        </Wrapper>
      );

    case 'progress':
      return (
        <Wrapper>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 font-medium">{name}</span>
              <span className="text-gray-500">{component.value || 60}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${component.value || 60}%` }}></div>
            </div>
          </div>
        </Wrapper>
      );

    case 'dropdown':
    case 'select':
      return (
        <Wrapper>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <label className="block text-gray-700 font-medium mb-2">{name}</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
              <option>{component.placeholder || 'Select option'}</option>
              {(component.options || []).map((opt, i) => (
                <option key={i}>{typeof opt === 'string' ? opt : opt.label}</option>
              ))}
            </select>
          </div>
        </Wrapper>
      );

    case 'toggle':
      return (
        <Wrapper>
          <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <span className="text-gray-700 font-medium">{component.label || name}</span>
            <div className={`w-12 h-6 rounded-full ${component.checked ? 'bg-blue-600' : 'bg-gray-300'} relative`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${component.checked ? 'right-0.5' : 'left-0.5'}`}></div>
            </div>
          </div>
        </Wrapper>
      );

    case 'grid':
      return (
        <Wrapper>
          <div className="grid grid-cols-2 gap-3">
            {(component.children || []).map((child, i) => (
              <ComponentRenderer key={child.id || i} component={child} onRemove={() => {}} />
            ))}
          </div>
        </Wrapper>
      );

    case 'container':
    case 'section':
    default:
      return (
        <Wrapper>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">{component.title || name}</h4>
            {component.content && <p className="text-gray-600">{component.content}</p>}
            {(component.children || []).map((child, i) => (
              <div key={i} className="mt-3">
                <ComponentRenderer component={child} onRemove={() => {}} />
              </div>
            ))}
          </div>
        </Wrapper>
      );
  }
};

export default BuilderNew;
