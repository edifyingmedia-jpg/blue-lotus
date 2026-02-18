import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Textarea } from '../components/ui/textarea';
import {
  ChevronRight,
  ChevronDown,
  Layout,
  FileText,
  Database,
  GitBranch,
  Settings,
  Send,
  Sparkles,
  Smartphone,
  Monitor,
  Tablet,
  Plus,
  MoreVertical,
  Eye,
  Rocket,
  RefreshCw,
  Home,
  User,
  BarChart3,
  MessageSquare,
  Bell,
  Search,
  LogOut,
  Loader2,
  Check,
  Circle,
  Lightbulb,
  Wand2,
  Palette,
  Type,
  Navigation,
  Layers,
  Globe,
  ArrowLeft,
  Zap,
} from 'lucide-react';

// Mock generated project structure
const mockProjectStructure = {
  screens: [
    { id: '1', name: 'Home', icon: Home, type: 'screen' },
    { id: '2', name: 'Dashboard', icon: BarChart3, type: 'screen' },
    { id: '3', name: 'Profile', icon: User, type: 'screen' },
    { id: '4', name: 'Settings', icon: Settings, type: 'screen' },
    { id: '5', name: 'Notifications', icon: Bell, type: 'screen' },
  ],
  dataModels: [
    { id: 'd1', name: 'Users', fields: 4 },
    { id: 'd2', name: 'Posts', fields: 6 },
    { id: 'd3', name: 'Comments', fields: 5 },
  ],
  flows: [
    { id: 'f1', name: 'User Authentication', steps: 3 },
    { id: 'f2', name: 'Create Post', steps: 4 },
    { id: 'f3', name: 'Send Notification', steps: 2 },
  ],
};

const quickActions = [
  { icon: Plus, label: 'Add screen', command: 'Add a new screen for' },
  { icon: Palette, label: 'Change style', command: 'Change the visual style to' },
  { icon: Type, label: 'Rewrite text', command: 'Rewrite the text to be more' },
  { icon: Navigation, label: 'Edit navigation', command: 'Modify navigation to' },
  { icon: Database, label: 'Add data model', command: 'Create a data model for' },
  { icon: GitBranch, label: 'Add flow', command: 'Add a new flow for' },
];

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [selectedItem, setSelectedItem] = useState(mockProjectStructure.screens[0]);
  const [expandedSections, setExpandedSections] = useState(['screens', 'dataModels', 'flows']);
  const [environment, setEnvironment] = useState('draft');
  const [deviceView, setDeviceView] = useState('desktop');
  const [commandInput, setCommandInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [generationSteps, setGenerationSteps] = useState([]);

  useEffect(() => {
    // Load project from localStorage
    const storedProject = localStorage.getItem(`project_${id}`);
    if (storedProject) {
      setProject(JSON.parse(storedProject));
    } else {
      setProject({
        id,
        name: 'My Project',
        type: 'app',
        description: 'A sample project',
      });
    }
  }, [id]);

  const toggleSection = (section) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleCommand = async () => {
    if (!commandInput.trim() || isProcessing) return;

    const command = commandInput;
    setCommandInput('');
    setIsProcessing(true);

    // Add to history
    setCommandHistory((prev) => [
      ...prev,
      { type: 'user', content: command, timestamp: new Date() },
    ]);

    // Simulate AI processing steps
    const steps = [
      'Understanding request...',
      'Analyzing current structure...',
      'Generating changes...',
      'Applying updates...',
    ];

    setGenerationSteps(steps);

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setGenerationSteps((prev) =>
        prev.map((s, idx) => (idx <= i ? { text: s, done: true } : { text: s, done: false }))
      );
    }

    // Add AI response
    setCommandHistory((prev) => [
      ...prev,
      {
        type: 'assistant',
        content: `Done! I've processed your request: "${command}". The preview has been updated with the changes.`,
        timestamp: new Date(),
      },
    ]);

    setIsProcessing(false);
    setGenerationSteps([]);
  };

  const handleQuickAction = (action) => {
    setCommandInput(action.command + ' ');
  };

  const envColors = {
    draft: 'bg-gray-500',
    staging: 'bg-yellow-500',
    live: 'bg-green-500',
  };

  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 p-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="h-5 w-px bg-gray-800" />
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{project?.name || 'Loading...'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Environment Selector */}
          <div className="flex items-center bg-gray-800 rounded-lg p-1">
            {['draft', 'staging', 'live'].map((env) => (
              <button
                key={env}
                onClick={() => setEnvironment(env)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  environment === env
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${envColors[env]}`} />
                {env.charAt(0).toUpperCase() + env.slice(1)}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-gray-800" />

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>

          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Project Navigator */}
        <div className="w-64 border-r border-gray-800 bg-gray-900/50 flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-gray-800">
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Project Navigator
            </h2>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {/* Screens/Pages */}
              <div className="mb-2">
                <button
                  onClick={() => toggleSection('screens')}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-gray-300 hover:bg-gray-800 rounded-lg"
                >
                  {expandedSections.includes('screens') ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                  <Layout className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">Screens</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {mockProjectStructure.screens.length}
                  </span>
                </button>
                {expandedSections.includes('screens') && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {mockProjectStructure.screens.map((screen) => {
                      const Icon = screen.icon;
                      return (
                        <button
                          key={screen.id}
                          onClick={() => setSelectedItem(screen)}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            selectedItem?.id === screen.id
                              ? 'bg-blue-600/20 text-blue-400'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {screen.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Data Models */}
              <div className="mb-2">
                <button
                  onClick={() => toggleSection('dataModels')}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-gray-300 hover:bg-gray-800 rounded-lg"
                >
                  {expandedSections.includes('dataModels') ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                  <Database className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium">Data Models</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {mockProjectStructure.dataModels.length}
                  </span>
                </button>
                {expandedSections.includes('dataModels') && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {mockProjectStructure.dataModels.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSelectedItem({ ...model, type: 'dataModel' })}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedItem?.id === model.id
                            ? 'bg-green-600/20 text-green-400'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <span>{model.name}</span>
                        <span className="text-xs text-gray-500">{model.fields} fields</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Flows */}
              <div className="mb-2">
                <button
                  onClick={() => toggleSection('flows')}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-gray-300 hover:bg-gray-800 rounded-lg"
                >
                  {expandedSections.includes('flows') ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">Flows</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {mockProjectStructure.flows.length}
                  </span>
                </button>
                {expandedSections.includes('flows') && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {mockProjectStructure.flows.map((flow) => (
                      <button
                        key={flow.id}
                        onClick={() => setSelectedItem({ ...flow, type: 'flow' })}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedItem?.id === flow.id
                            ? 'bg-purple-600/20 text-purple-400'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <span>{flow.name}</span>
                        <span className="text-xs text-gray-500">{flow.steps} steps</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Center Panel - Preview */}
        <div className="flex-1 flex flex-col bg-gray-900/30">
          {/* Preview Header */}
          <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm font-medium">Preview</span>
              <span className="text-gray-500 text-sm">— {selectedItem?.name}</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
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
          </div>

          {/* Preview Content */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <div
              className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
                deviceView === 'mobile'
                  ? 'w-[375px] h-[667px]'
                  : deviceView === 'tablet'
                  ? 'w-[768px] h-[1024px] scale-[0.65] origin-center'
                  : 'w-full max-w-5xl h-full'
              }`}
            >
              {/* Mock Preview Content */}
              <div className="h-full flex flex-col">
                {/* Mock Header */}
                <div className="h-14 bg-blue-600 flex items-center px-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg" />
                  <div className="ml-3 h-4 w-24 bg-white/30 rounded" />
                  <div className="ml-auto flex gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg" />
                    <div className="w-8 h-8 bg-white/20 rounded-lg" />
                  </div>
                </div>
                {/* Mock Content */}
                <div className="flex-1 p-6 bg-gray-50">
                  <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
                  <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-6" />
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="h-32 bg-white rounded-lg shadow" />
                    <div className="h-32 bg-white rounded-lg shadow" />
                  </div>
                  <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
                  <div className="space-y-2">
                    <div className="h-16 bg-white rounded-lg shadow" />
                    <div className="h-16 bg-white rounded-lg shadow" />
                    <div className="h-16 bg-white rounded-lg shadow" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - AI Command */}
        <div className="w-80 border-l border-gray-800 bg-gray-900/50 flex flex-col flex-shrink-0">
          {/* Panel Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-white font-medium text-sm">AI Commands</h2>
                <p className="text-gray-500 text-xs">Refine with natural language</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-b border-gray-800">
            <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              Quick Actions
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleQuickAction(action)}
                    className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 rounded-lg text-xs text-gray-300 hover:text-white transition-colors"
                  >
                    <Icon className="w-3 h-3 text-blue-400" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Command History */}
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {commandHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Wand2 className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Use commands to refine your project
                  </p>
                </div>
              ) : (
                commandHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl text-sm ${
                      msg.type === 'user'
                        ? 'bg-blue-600/20 text-blue-100 ml-4'
                        : 'bg-gray-800 text-gray-300 mr-4'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))
              )}

              {/* Generation Progress */}
              {isProcessing && generationSteps.length > 0 && (
                <div className="p-3 bg-gray-800 rounded-xl mr-4">
                  <div className="space-y-1.5">
                    {generationSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        {typeof step === 'object' && step.done ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : i === generationSteps.findIndex((s) => typeof s === 'string' || !s.done) ? (
                          <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                        ) : (
                          <Circle className="w-3 h-3 text-gray-600" />
                        )}
                        <span className="text-gray-400">
                          {typeof step === 'object' ? step.text : step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Command Input */}
          <div className="p-3 border-t border-gray-800">
            <div className="relative">
              <Textarea
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCommand();
                  }
                }}
                placeholder="Describe changes..."
                disabled={isProcessing}
                className="min-h-[80px] pr-12 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 rounded-xl resize-none text-sm"
              />
              <Button
                size="sm"
                onClick={handleCommand}
                disabled={!commandInput.trim() || isProcessing}
                className="absolute right-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 p-0 rounded-lg"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Enter to send</span>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span>{user?.credits || 1850} credits</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
