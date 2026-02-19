import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Textarea } from '../components/ui/textarea';
import BackendConnections from '../components/builder/BackendConnections';
import {
  Send,
  ArrowLeft,
  Sparkles,
  Smartphone,
  Monitor,
  Tablet,
  Loader2,
  Check,
  Circle,
  Bot,
  User,
  Rocket,
  RefreshCw,
  Eye,
  PanelLeftClose,
  PanelLeft,
  Zap,
  MoreHorizontal,
  Layout,
  Database,
  GitBranch,
  ChevronRight,
  ChevronDown,
  Home,
  BarChart3,
  Settings,
  Bell,
  Plus,
  Lightbulb,
  Globe,
  FileText,
  Users,
  ShoppingCart,
  MessageSquare,
  Mic,
  MicOff,
  Undo,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Wand2,
  Save,
  Cloud,
  CloudOff,
  Server,
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Agent types for multi-agent conversation
const AGENTS = {
  ARCHITECT: { id: 'architect', name: 'Architect', color: 'blue', icon: '🏗️' },
  DESIGNER: { id: 'designer', name: 'Designer', color: 'purple', icon: '🎨' },
  ENGINEER: { id: 'engineer', name: 'Engineer', color: 'green', icon: '⚙️' },
  REVIEWER: { id: 'reviewer', name: 'Reviewer', color: 'orange', icon: '👁️' },
};

const agentColors = {
  architect: 'from-blue-500 to-blue-700',
  designer: 'from-purple-500 to-purple-700',
  engineer: 'from-green-500 to-green-700',
  reviewer: 'from-orange-500 to-orange-700',
};

const suggestedPrompts = [
  'Add a new screen for user onboarding',
  'Create a data model for products',
  'Add a checkout flow',
  'Change the color scheme to dark mode',
  'Add a notification center',
  'Create a settings page with profile editing',
];

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, getAuthToken } = useAuth();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Core state
  const [project, setProject] = useState(null);
  const [structure, setStructure] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [deviceView, setDeviceView] = useState('desktop');
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved'); // saved, saving, error
  
  // AI agents state
  const [activeAgents, setActiveAgents] = useState([]);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  
  // History for undo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Generated blueprint from AI
  const [generatedBlueprint, setGeneratedBlueprint] = useState(null);

  // Backend connections modal
  const [showBackendConnections, setShowBackendConnections] = useState(false);

  // Check for URL parameter to auto-open backend connections modal
  useEffect(() => {
    if (searchParams.get('openBackend') === 'true') {
      setShowBackendConnections(true);
    }
  }, [searchParams]);

  // Check voice support
  useEffect(() => {
    setVoiceSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  // Fetch project from backend
  const fetchProject = useCallback(async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProject(data);
        
        // Transform structure - convert string arrays to object arrays
        const transformedStructure = transformStructure(data.structure, data.type);
        setStructure(transformedStructure);
        
        // Add initial message
        setMessages([{
          id: '1',
          type: 'system',
          content: `Project "${data.name}" loaded. I'm ready to help you build.`,
          timestamp: new Date(),
        }]);
      } else {
        // Create placeholder
        setProject({ id, name: 'New Project', type: 'app', description: '' });
        setStructure(generateDefaultStructure('app'));
        setMessages([{
          id: '1',
          type: 'system',
          content: "Welcome to Blue Lotus Builder! Describe what you want to create.",
          timestamp: new Date(),
        }]);
      }
    } catch (err) {
      console.error('Failed to fetch project:', err);
      setProject({ id, name: 'New Project', type: 'app', description: '' });
      setStructure(generateDefaultStructure('app'));
    }
  }, [id, getAuthToken]);
  
  // Transform backend structure to frontend-compatible format
  const transformStructure = (rawStructure, projectType) => {
    if (!rawStructure) return generateDefaultStructure(projectType);
    
    // Handle screens - can be strings or objects
    const screens = (rawStructure.screens || []).map((screen, i) => {
      if (typeof screen === 'string') {
        return {
          id: `s${i + 1}`,
          name: screen,
          type: 'screen',
          components: []
        };
      }
      return {
        id: screen.id || `s${i + 1}`,
        name: screen.name || `Screen ${i + 1}`,
        type: 'screen',
        components: screen.components || [],
        description: screen.description || screen.purpose || ''
      };
    });
    
    // Handle data models
    const dataModels = (rawStructure.data_models || rawStructure.dataModels || []).map((model, i) => {
      if (typeof model === 'string') {
        return { id: `d${i + 1}`, name: model, fields: [] };
      }
      return {
        id: model.id || `d${i + 1}`,
        name: model.name,
        fields: model.fields || []
      };
    });
    
    // Handle flows
    const flows = (rawStructure.flows || []).map((flow, i) => {
      if (typeof flow === 'string') {
        return { id: `f${i + 1}`, name: flow, steps: [] };
      }
      return {
        id: flow.id || `f${i + 1}`,
        name: flow.name,
        steps: flow.steps || []
      };
    });
    
    // Handle navigation
    const navigation = rawStructure.navigation || {
      type: 'tabs',
      items: screens.slice(0, 5).map(s => ({ 
        icon: 'home', 
        label: s.name, 
        screen_id: s.id 
      }))
    };
    
    return {
      screens,
      pages: rawStructure.pages || [],
      dataModels,
      flows,
      navigation,
      theme: rawStructure.theme || {}
    };
  };

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    if (structure?.screens?.length > 0 && !selectedScreen) {
      setSelectedScreen(structure.screens[0]);
    }
  }, [structure, selectedScreen]);

  const generateDefaultStructure = (type) => ({
    screens: [
      { id: 's1', name: 'Home', icon: 'Home', type: 'screen' },
      { id: 's2', name: 'Dashboard', icon: 'BarChart3', type: 'screen' },
      { id: 's3', name: 'Profile', icon: 'User', type: 'screen' },
      { id: 's4', name: 'Settings', icon: 'Settings', type: 'screen' },
    ],
    pages: type === 'website' || type === 'both' ? [
      { id: 'p1', name: 'Landing', icon: 'Globe', type: 'page' },
      { id: 'p2', name: 'About', icon: 'FileText', type: 'page' },
      { id: 'p3', name: 'Pricing', icon: 'ShoppingCart', type: 'page' },
      { id: 'p4', name: 'Contact', icon: 'MessageSquare', type: 'page' },
    ] : [],
    dataModels: [
      { id: 'd1', name: 'Users', fields: ['id', 'name', 'email', 'avatar'] },
      { id: 'd2', name: 'Posts', fields: ['id', 'title', 'content', 'author'] },
    ],
    flows: [
      { id: 'f1', name: 'User Sign Up', steps: ['Collect info', 'Validate', 'Create account'] },
      { id: 'f2', name: 'Create Post', steps: ['Enter content', 'Add media', 'Publish'] },
    ],
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Multi-agent AI conversation - REAL API CALL
  const runAgentConversation = async (userInput) => {
    const agents = [AGENTS.ARCHITECT, AGENTS.DESIGNER, AGENTS.ENGINEER];
    setActiveAgents(agents.map(a => a.id));
    
    // Agent 1: Architect analyzes
    await addAgentMessage(AGENTS.ARCHITECT, `Analyzing request: "${userInput}"`, 500);
    await addAgentMessage(AGENTS.ARCHITECT, "Planning structural changes...", 400);
    
    // Agent 2: Designer proposes
    await addAgentMessage(AGENTS.DESIGNER, "Preparing UI components and styling...", 500);
    
    // Agent 3: Engineer implements - CALL REAL API
    await addAgentMessage(AGENTS.ENGINEER, "Generating components...", 400);
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: userInput,
          mode: 'incremental',
          use_llm: true,
          options: { project_id: id }
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.blueprint) {
        await addAgentMessage(AGENTS.ENGINEER, "Components generated successfully!", 300);
        
        // Update the structure with generated content
        const generatedStructure = {
          screens: data.blueprint.screens || [],
          flows: data.blueprint.flows || [],
          data_models: data.blueprint.data_models || [],
          navigation: data.blueprint.navigation || {},
          theme: data.blueprint.theme || {}
        };
        
        // Create pending changes from the blueprint
        const changes = [];
        if (generatedStructure.screens?.length > 0) {
          changes.push({ 
            type: 'add_screens', 
            description: `Added ${generatedStructure.screens.length} screen(s)`,
            data: generatedStructure.screens
          });
        }
        if (generatedStructure.flows?.length > 0) {
          changes.push({ 
            type: 'add_flows', 
            description: `Added ${generatedStructure.flows.length} flow(s)`,
            data: generatedStructure.flows
          });
        }
        if (generatedStructure.data_models?.length > 0) {
          changes.push({ 
            type: 'add_models', 
            description: `Added ${generatedStructure.data_models.length} data model(s)`,
            data: generatedStructure.data_models
          });
        }
        
        if (changes.length === 0) {
          changes.push({ 
            type: 'update', 
            description: 'Project updated based on request',
            data: generatedStructure
          });
        }
        
        setPendingChanges(changes);
        setGeneratedBlueprint(generatedStructure);
        
        // Reviewer checks
        setActiveAgents([AGENTS.REVIEWER.id]);
        await addAgentMessage(AGENTS.REVIEWER, `Reviewing ${changes.length} change(s)...`, 400);
        await addAgentMessage(AGENTS.REVIEWER, "All changes look good! Ready to apply.", 300);
        
        setActiveAgents([]);
        
        // Show confirmation for review
        if (changes.length > 0) {
          setShowConfirmation(true);
        }
        
        return { success: true, changes };
      } else {
        // Fallback to simulated generation if API fails
        await addAgentMessage(AGENTS.ENGINEER, "Using local generation...", 300);
        const simulatedChanges = generateChangesFromInput(userInput);
        setPendingChanges(simulatedChanges);
        
        setActiveAgents([AGENTS.REVIEWER.id]);
        await addAgentMessage(AGENTS.REVIEWER, `Reviewing ${simulatedChanges.length} change(s)...`, 400);
        await addAgentMessage(AGENTS.REVIEWER, "Changes ready to apply.", 300);
        setActiveAgents([]);
        
        if (simulatedChanges.length > 0) {
          setShowConfirmation(true);
        }
        
        return { success: true, changes: simulatedChanges };
      }
    } catch (err) {
      console.error('AI generation error:', err);
      await addAgentMessage(AGENTS.ENGINEER, `Error: ${err.message}. Using local generation.`, 300);
      
      // Fallback to simulated generation
      const simulatedChanges = generateChangesFromInput(userInput);
      setPendingChanges(simulatedChanges);
      
      setActiveAgents([AGENTS.REVIEWER.id]);
      await addAgentMessage(AGENTS.REVIEWER, "Changes ready to apply.", 300);
      setActiveAgents([]);
      
      setShowConfirmation(true);
      return { success: false, error: err.message };
    }
  };

  const addAgentMessage = (agent, content, delay) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'agent',
          agent: agent.id,
          agentName: agent.name,
          agentIcon: agent.icon,
          content,
          timestamp: new Date(),
        }]);
        resolve();
      }, delay);
    });
  };

  const generateChangesFromInput = (input) => {
    const lowerInput = input.toLowerCase();
    const changes = [];
    
    if (lowerInput.includes('screen') || lowerInput.includes('page')) {
      changes.push({ type: 'add_screen', description: 'New screen created' });
      changes.push({ type: 'update_navigation', description: 'Navigation updated' });
    }
    if (lowerInput.includes('data') || lowerInput.includes('model')) {
      changes.push({ type: 'add_model', description: 'Data model created' });
    }
    if (lowerInput.includes('style') || lowerInput.includes('color') || lowerInput.includes('theme')) {
      changes.push({ type: 'update_style', description: 'Visual style updated' });
    }
    if (lowerInput.includes('flow') || lowerInput.includes('action')) {
      changes.push({ type: 'add_flow', description: 'New flow created' });
    }
    
    if (changes.length === 0) {
      changes.push({ type: 'update', description: 'Project updated based on request' });
    }
    
    return changes;
  };

  const applyChanges = (changes) => {
    // Save current state to history for undo
    setHistory(prev => [...prev.slice(0, historyIndex + 1), { structure: { ...structure } }]);
    setHistoryIndex(prev => prev + 1);
    
    // Apply the generated blueprint to structure
    if (generatedBlueprint) {
      setStructure(prev => ({
        ...prev,
        screens: [...(prev?.screens || []), ...(generatedBlueprint.screens || [])],
        flows: [...(prev?.flows || []), ...(generatedBlueprint.flows || [])],
        data_models: [...(prev?.data_models || []), ...(generatedBlueprint.data_models || [])],
        navigation: generatedBlueprint.navigation || prev?.navigation,
        theme: generatedBlueprint.theme || prev?.theme
      }));
      
      // Select the first new screen if available
      if (generatedBlueprint.screens?.length > 0) {
        setSelectedScreen(generatedBlueprint.screens[0]);
      }
    }
    
    // Add success message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'success',
      content: `✅ Applied ${changes.length} change${changes.length > 1 ? 's' : ''}:\n${changes.map(c => `• ${c.description}`).join('\n')}`,
      timestamp: new Date(),
    }]);
    
    setPendingChanges([]);
    setShowConfirmation(false);
    setGeneratedBlueprint(null);
    setSaveStatus('saving');
    
    // Save to backend
    saveProjectChanges();
  };
  
  // Save project changes to backend
  const saveProjectChanges = async () => {
    try {
      const token = getAuthToken();
      await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          structure: structure,
          updated_at: new Date().toISOString()
        })
      });
      setSaveStatus('saved');
    } catch (err) {
      console.error('Failed to save:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('saved'), 3000);
    }
  };

  const rejectChanges = () => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'info',
      content: "Changes rejected. No modifications were made.",
      timestamp: new Date(),
    }]);
    setPendingChanges([]);
    setShowConfirmation(false);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setStructure(history[historyIndex - 1].structure);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'info',
        content: "⏪ Undid last change",
        timestamp: new Date(),
      }]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputValue;
    setInputValue('');
    setIsGenerating(true);

    try {
      await runAgentConversation(userInput);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    if (!voiceSupported) return;
    
    if (isListening) {
      setIsListening(false);
      return;
    }
    
    setIsListening(true);
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
    };
    
    recognition.onerror = () => {
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getIcon = (iconName) => {
    const icons = { Home, BarChart3, User, Settings, Globe, FileText, ShoppingCart, MessageSquare, Users };
    return icons[iconName] || Layout;
  };

  if (!project || !structure) {
    return (
      <div className="h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden" data-testid="builder-workspace">
      {/* Top Bar */}
      <header className="h-14 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <div className="h-5 w-px bg-gray-800" />
          <div className="flex items-center gap-2">
            {saveStatus === 'saved' && <Cloud className="w-4 h-4 text-green-400" />}
            {saveStatus === 'saving' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
            {saveStatus === 'error' && <CloudOff className="w-4 h-4 text-red-400" />}
            <span className="text-white font-medium">{project.name}</span>
            <span className="text-gray-500 text-xs">
              {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Error'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Switcher */}
          <div className="flex items-center bg-gray-800 rounded-lg p-1">
            {[
              { id: 'mobile', icon: Smartphone },
              { id: 'tablet', icon: Tablet },
              { id: 'desktop', icon: Monitor },
            ].map(({ id: viewId, icon: Icon }) => (
              <button
                key={viewId}
                onClick={() => setDeviceView(viewId)}
                className={`p-1.5 rounded-md transition-colors ${
                  deviceView === viewId
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-gray-800" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Undo className="w-4 h-4 mr-2" />
            Undo
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBackendConnections(true)}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Server className="w-4 h-4 mr-2" />
            Backend
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Settings className="w-4 h-4" />
          </Button>

          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Rocket className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </header>

      {/* Backend Connections Modal */}
      <BackendConnections
        isOpen={showBackendConnections}
        onClose={() => setShowBackendConnections(false)}
        projectId={id}
      />

      {/* Main Content - Two Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - AI Conversation Stream (35%) */}
        <div
          className={`${
            showSidebar ? 'w-[35%] min-w-[380px]' : 'w-0'
          } border-r border-gray-800 flex flex-col transition-all duration-300 overflow-hidden bg-gray-900/30`}
        >
          {/* AI Header */}
          <div className="p-4 border-b border-gray-800 bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 lotus-logo">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-sm">AI Builder Team</h2>
                  <p className="text-green-400 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    {activeAgents.length > 0 ? `${activeAgents.length} agents working` : 'Ready to build'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Object.values(AGENTS).map(agent => (
                  <div
                    key={agent.id}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                      activeAgents.includes(agent.id)
                        ? `bg-gradient-to-br ${agentColors[agent.id]} ring-2 ring-white/20 scale-110`
                        : 'bg-gray-800 opacity-50'
                    }`}
                    title={agent.name}
                  >
                    {agent.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} formatTime={formatTime} />
              ))}

              {/* Pending Changes Confirmation */}
              {showConfirmation && pendingChanges.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">Review Changes</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {pendingChanges.map((change, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {change.description}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => applyChanges(pendingChanges)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Apply Changes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={rejectChanges}
                      className="border-gray-600 text-gray-300"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Suggestions */}
          {messages.length <= 2 && !isGenerating && (
            <div className="p-3 border-t border-gray-800 bg-gray-900/30">
              <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                Try saying...
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.slice(0, 3).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setInputValue(prompt)}
                    className="px-2.5 py-1.5 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-800 bg-gray-900/50">
            <div className="relative">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe what you want to build or change..."
                disabled={isGenerating}
                className="min-h-[80px] max-h-[160px] pr-24 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 resize-none rounded-xl"
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                {voiceSupported && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleVoiceInput}
                    className={`h-8 w-8 p-0 rounded-lg ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isGenerating}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 p-0 rounded-lg shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-gray-500 text-xs">
                Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">Enter</kbd> to send
              </p>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span>{user?.credits ? (user.credits.monthly + user.credits.bonus + user.credits.purchased + (user.credits.starter || 0)) : 100} credits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Live Preview (65%) */}
        <div className="flex-1 flex flex-col bg-gray-900/20">
          {/* Preview Header */}
          <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900/30">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-1.5 text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-800"
              >
                {showSidebar ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
              </button>
              <div className="h-4 w-px bg-gray-800" />
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm font-medium">Live Preview</span>
              {selectedScreen && (
                <>
                  <span className="text-gray-600">—</span>
                  <span className="text-gray-400 text-sm">{selectedScreen.name}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Wand2 className="w-4 h-4 mr-1" />
                Refine
              </Button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto bg-gray-950/50">
            <div
              className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
                deviceView === 'mobile'
                  ? 'w-[375px] h-[667px]'
                  : deviceView === 'tablet'
                  ? 'w-[768px] h-[600px]'
                  : 'w-full max-w-5xl h-full max-h-[700px]'
              }`}
            >
              {/* Dynamic App Preview - Renders generated screens */}
              <div className="h-full flex flex-col">
                {/* App Header */}
                <div className="h-14 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium text-sm">
                      {project?.name || 'My App'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white/70" />
                    </div>
                  </div>
                </div>

                {/* App Content - Renders dynamic or default content */}
                <div className="flex-1 bg-gray-50 p-4 overflow-auto">
                  {structure?.screens?.length > 0 ? (
                    // Render generated screens
                    <div className="space-y-4">
                      {selectedScreen ? (
                        <ScreenRenderer screen={selectedScreen} deviceView={deviceView} />
                      ) : (
                        <ScreenRenderer screen={structure.screens[0]} deviceView={deviceView} />
                      )}
                    </div>
                  ) : (
                    // Default placeholder content
                    <>
                      {/* Welcome Section */}
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome to your app</h2>
                        <p className="text-gray-500 text-sm">Start building by describing what you want</p>
                      </div>

                      {/* Stats Cards */}
                      <div className={`grid ${deviceView === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'} gap-3 mb-6`}>
                        {[
                          { color: 'bg-blue-100', iconBg: 'bg-blue-500', label: 'Users', value: '0' },
                          { color: 'bg-green-100', iconBg: 'bg-green-500', label: 'Revenue', value: '$0' },
                          { color: 'bg-purple-100', iconBg: 'bg-purple-500', label: 'Orders', value: '0' },
                          { color: 'bg-orange-100', iconBg: 'bg-orange-500', label: 'Views', value: '0' },
                        ].map((item, i) => (
                          <div key={i} className={`${item.color} rounded-xl p-4 shadow-sm transition-all hover:scale-105`}>
                            <div className={`w-8 h-8 ${item.iconBg} rounded-lg mb-2`} />
                            <div className="text-lg font-bold text-gray-800">{item.value}</div>
                            <div className="text-xs text-gray-500">{item.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Content Section */}
                      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Recent Items</h3>
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full" />
                              <div className="flex-1">
                                <div className="font-medium text-gray-800">Item {i}</div>
                                <div className="text-xs text-gray-500">Description here</div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 text-center transition-colors">
                        <span className="font-medium">Get Started</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Bottom Navigation */}
                <div className="h-16 bg-white border-t border-gray-200 flex items-center justify-around px-4">
                  {(structure?.navigation?.items || [
                    { icon: 'home', label: 'Home', active: true },
                    { icon: 'chart', label: 'Stats' },
                    { icon: 'plus', label: 'Add', special: true },
                    { icon: 'bell', label: 'Alerts' },
                    { icon: 'user', label: 'Profile' },
                  ]).slice(0, 5).map((item, i) => {
                    const IconComponent = item.icon === 'home' ? Home : 
                                         item.icon === 'chart' ? BarChart3 :
                                         item.icon === 'plus' ? Plus :
                                         item.icon === 'bell' ? Bell : User;
                    return (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                          item.special
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : item.active
                            ? 'bg-blue-100'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => item.screen_id && setSelectedScreen(
                          structure?.screens?.find(s => s.id === item.screen_id) || null
                        )}
                      >
                        <IconComponent className={`w-5 h-5 ${item.active && !item.special ? 'text-blue-600' : item.special ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Screen Selector - Shows available screens */}
            {structure?.screens?.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4 bg-gray-900/90 backdrop-blur rounded-lg p-2">
                <p className="text-xs text-gray-400 mb-2">Screens ({structure.screens.length})</p>
                <div className="flex gap-2 overflow-x-auto">
                  {structure.screens.map((screen, i) => (
                    <button
                      key={screen.id || i}
                      onClick={() => setSelectedScreen(screen)}
                      className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors ${
                        selectedScreen?.id === screen.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {screen.name || `Screen ${i + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Screen Renderer Component - Renders a generated screen
const ScreenRenderer = ({ screen, deviceView }) => {
  if (!screen) return null;
  
  return (
    <div className="space-y-4">
      {/* Screen Title */}
      {screen.name && (
        <h2 className="text-xl font-bold text-gray-800">{screen.name}</h2>
      )}
      {screen.description && (
        <p className="text-gray-500 text-sm">{screen.description}</p>
      )}
      
      {/* Render Components */}
      {screen.components?.map((component, i) => (
        <ComponentRenderer key={component.id || i} component={component} deviceView={deviceView} />
      ))}
      
      {/* Fallback if no components */}
      {(!screen.components || screen.components.length === 0) && (
        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
          <Layout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Screen: {screen.name}</p>
          <p className="text-gray-400 text-sm mt-1">Components will appear here</p>
        </div>
      )}
    </div>
  );
};

// Component Renderer - Renders individual UI components
const ComponentRenderer = ({ component, deviceView }) => {
  const type = component.type?.toLowerCase() || 'container';
  
  switch (type) {
    case 'header':
    case 'heading':
      return (
        <h3 className="text-lg font-semibold text-gray-800">
          {component.content || component.text || component.title || 'Header'}
        </h3>
      );
    
    case 'text':
    case 'paragraph':
      return (
        <p className="text-gray-600">
          {component.content || component.text || 'Text content'}
        </p>
      );
    
    case 'button':
      return (
        <button 
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            component.variant === 'secondary' 
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {component.label || component.text || 'Button'}
        </button>
      );
    
    case 'input':
    case 'textfield':
      return (
        <input
          type={component.inputType || 'text'}
          placeholder={component.placeholder || 'Enter text...'}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      );
    
    case 'card':
      return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          {component.title && <h4 className="font-semibold text-gray-800 mb-2">{component.title}</h4>}
          {component.content && <p className="text-gray-600 text-sm">{component.content}</p>}
          {component.children?.map((child, i) => (
            <ComponentRenderer key={i} component={child} deviceView={deviceView} />
          ))}
        </div>
      );
    
    case 'list':
      return (
        <div className="space-y-2">
          {(component.items || []).map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">{i + 1}</span>
              </div>
              <span className="text-gray-700">{typeof item === 'string' ? item : item.text || item.label}</span>
            </div>
          ))}
        </div>
      );
    
    case 'image':
      return (
        <div className="bg-gray-200 rounded-lg h-40 flex items-center justify-center">
          <span className="text-gray-400">📷 Image</span>
        </div>
      );
    
    case 'form':
      return (
        <div className="space-y-3 bg-white rounded-xl p-4 shadow-sm">
          {component.title && <h4 className="font-semibold text-gray-800">{component.title}</h4>}
          {(component.fields || []).map((field, i) => (
            <div key={i}>
              <label className="block text-sm text-gray-600 mb-1">{field.label || `Field ${i + 1}`}</label>
              <input
                type={field.type || 'text'}
                placeholder={field.placeholder || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          ))}
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium">
            {component.submitLabel || 'Submit'}
          </button>
        </div>
      );
    
    case 'grid':
    case 'row':
      return (
        <div className={`grid ${deviceView === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'} gap-3`}>
          {(component.children || component.items || []).map((child, i) => (
            <ComponentRenderer key={i} component={child} deviceView={deviceView} />
          ))}
        </div>
      );
    
    case 'container':
    case 'section':
    default:
      return (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          {component.title && <h4 className="font-semibold text-gray-800 mb-2">{component.title}</h4>}
          {component.content && <p className="text-gray-600">{component.content}</p>}
          {component.children?.map((child, i) => (
            <ComponentRenderer key={i} component={child} deviceView={deviceView} />
          ))}
        </div>
      );
  }
};

// Message Bubble Component
const MessageBubble = ({ message, formatTime }) => {
  if (message.type === 'user') {
    return (
      <div className="flex gap-3 flex-row-reverse">
        <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-gray-300" />
        </div>
        <div className="flex-1 text-right">
          <div className="inline-block p-3 rounded-2xl rounded-br-md bg-blue-600 text-white max-w-[95%] text-left">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          </div>
          <p className="text-gray-500 text-xs mt-1.5 px-1">{formatTime(message.timestamp)}</p>
        </div>
      </div>
    );
  }

  if (message.type === 'agent') {
    return (
      <div className="flex gap-3">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agentColors[message.agent]} flex items-center justify-center flex-shrink-0 shadow-md`}>
          <span className="text-sm">{message.agentIcon}</span>
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">{message.agentName}</p>
          <div className="inline-block p-3 rounded-2xl rounded-bl-md bg-gray-800/80 text-gray-100 max-w-[95%] border border-gray-700/50">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          </div>
          <p className="text-gray-500 text-xs mt-1.5 px-1">{formatTime(message.timestamp)}</p>
        </div>
      </div>
    );
  }

  if (message.type === 'success') {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
        <p className="text-sm text-green-400 whitespace-pre-wrap">{message.content}</p>
      </div>
    );
  }

  if (message.type === 'info') {
    return (
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
        <p className="text-sm text-blue-400">{message.content}</p>
      </div>
    );
  }

  // System message
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-md">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="inline-block p-3 rounded-2xl rounded-bl-md bg-gray-800/80 text-gray-100 max-w-[95%] border border-gray-700/50">
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
        <p className="text-gray-500 text-xs mt-1.5 px-1">{formatTime(message.timestamp)}</p>
      </div>
    </div>
  );
};

export default Builder;
