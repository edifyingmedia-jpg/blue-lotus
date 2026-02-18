import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockProjects } from '../data/mock';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  Send,
  ArrowLeft,
  RotateCcw,
  Download,
  ExternalLink,
  Code,
  Eye,
  Loader2,
  Bot,
  User,
  Github,
  Globe,
  Sparkles,
  Copy,
  Check,
  PanelLeftClose,
  PanelLeft,
  FileCode,
  FolderTree,
  Terminal,
  Play,
  Settings,
  MoreHorizontal,
  Lightbulb,
  Wand2,
  RefreshCw,
  ChevronRight,
  File,
  Folder,
  Image,
  Database,
  Server,
  Layout,
  Smartphone,
  Zap,
  CheckCircle2,
  Circle,
  Clock,
} from 'lucide-react';

const suggestedPrompts = [
  { icon: Layout, text: 'Build a landing page with hero section' },
  { icon: Database, text: 'Add user authentication with database' },
  { icon: Server, text: 'Create a REST API endpoint' },
  { icon: Smartphone, text: 'Make the design responsive' },
];

const mockFileTree = [
  {
    name: 'src',
    type: 'folder',
    expanded: true,
    children: [
      { name: 'App.js', type: 'file', icon: FileCode },
      { name: 'index.js', type: 'file', icon: FileCode },
      {
        name: 'components',
        type: 'folder',
        expanded: true,
        children: [
          { name: 'Header.jsx', type: 'file', icon: FileCode },
          { name: 'Footer.jsx', type: 'file', icon: FileCode },
        ],
      },
      {
        name: 'pages',
        type: 'folder',
        children: [
          { name: 'Home.jsx', type: 'file', icon: FileCode },
          { name: 'About.jsx', type: 'file', icon: FileCode },
        ],
      },
    ],
  },
  { name: 'package.json', type: 'file', icon: File },
  { name: 'README.md', type: 'file', icon: File },
];

const ProjectBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [project, setProject] = useState(() =>
    mockProjects.find((p) => p.id === id) || {
      id,
      name: 'New Project',
      description: '',
      status: 'building',
    }
  );

  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI development assistant. Tell me what you'd like to build, and I'll help you create it step by step.\n\nYou can describe your app idea, ask me to add features, fix bugs, or modify the design. I'll generate the code and show you a live preview.",
      timestamp: new Date(Date.now() - 60000),
      status: 'complete',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showFileTree, setShowFileTree] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generationSteps, setGenerationSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateGeneration = async (userMessage) => {
    const steps = [
      { text: 'Understanding your request...', duration: 800 },
      { text: 'Planning the implementation...', duration: 1000 },
      { text: 'Generating code...', duration: 1500 },
      { text: 'Running tests...', duration: 800 },
      { text: 'Finalizing changes...', duration: 500 },
    ];

    setGenerationSteps(steps.map((s) => s.text));
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise((resolve) => setTimeout(resolve, steps[i].duration));
    }

    return `I've analyzed your request to "${userMessage.toLowerCase()}". Here's what I've done:\n\n**Changes Made:**\n• Created the necessary components\n• Updated the styling for a modern look\n• Added responsive breakpoints\n• Implemented the core functionality\n\nThe preview on the right has been updated. Let me know if you'd like any adjustments!`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    setIsGenerating(true);
    setGenerationSteps([]);
    setCurrentStep(0);

    try {
      const response = await simulateGeneration(messageText);
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        status: 'complete',
      };
      setMessages((prev) => [...prev, aiResponse]);
    } finally {
      setIsGenerating(false);
      setGenerationSteps([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePromptClick = (prompt) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('// Your generated code here');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderFileTree = (items, depth = 0) => {
    return items.map((item, index) => (
      <div key={index}>
        <div
          className={`flex items-center gap-2 py-1.5 px-2 hover:bg-gray-800 rounded cursor-pointer text-sm ${
            depth > 0 ? 'ml-' + depth * 4 : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {item.type === 'folder' ? (
            <>
              <ChevronRight className={`w-3 h-3 text-gray-500 ${item.expanded ? 'rotate-90' : ''}`} />
              <Folder className="w-4 h-4 text-blue-400" />
            </>
          ) : (
            <>
              <span className="w-3" />
              <FileCode className="w-4 h-4 text-gray-400" />
            </>
          )}
          <span className={item.type === 'folder' ? 'text-gray-200' : 'text-gray-400'}>
            {item.name}
          </span>
        </div>
        {item.type === 'folder' && item.expanded && item.children && (
          <div>{renderFileTree(item.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 h-14 flex items-center justify-between">
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
            <div className="h-6 w-px bg-gray-800" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <h1 className="text-white font-medium text-sm">{project.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Github className="w-4 h-4 mr-2" />
              Push
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Globe className="w-4 h-4 mr-2" />
              Deploy
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Sidebar */}
        <div
          className={`${
            showSidebar ? 'w-[420px]' : 'w-0'
          } border-r border-gray-800 flex flex-col transition-all duration-300 overflow-hidden bg-gray-900/30`}
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-sm">AI Assistant</h2>
                <p className="text-green-400 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMessages([messages[0]])}
                className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 p-0"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 p-0"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {message.role === 'assistant' ? (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                  <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div
                      className={`inline-block p-3 rounded-2xl max-w-[95%] text-left ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-gray-800/80 text-gray-100 rounded-bl-md border border-gray-700/50'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                    <p className="text-gray-500 text-xs mt-1.5 px-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Generation Progress */}
              {isGenerating && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl rounded-bl-md p-4">
                      <div className="space-y-2">
                        {generationSteps.map((step, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {index < currentStep ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : index === currentStep ? (
                              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-600" />
                            )}
                            <span
                              className={`text-sm ${
                                index <= currentStep ? 'text-gray-200' : 'text-gray-500'
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Suggested Prompts */}
          {messages.length <= 2 && !isGenerating && (
            <div className="p-4 border-t border-gray-800 bg-gray-900/30">
              <p className="text-gray-400 text-xs mb-3 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                Suggestions
              </p>
              <div className="grid grid-cols-2 gap-2">
                {suggestedPrompts.map((prompt, index) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt.text)}
                      className="flex items-center gap-2 p-2.5 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 rounded-lg text-left transition-all group"
                    >
                      <Icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 text-xs line-clamp-1 group-hover:text-white">
                        {prompt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-800 bg-gray-900/50">
            <div className="relative">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe what you want to build..."
                disabled={isGenerating}
                className="min-h-[100px] max-h-[200px] pr-14 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 resize-none rounded-xl"
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isGenerating}
                className="absolute right-3 bottom-3 bg-blue-600 hover:bg-blue-700 text-white h-9 w-9 p-0 rounded-lg shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-gray-500 text-xs">
                Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">Enter</kbd> to send
              </p>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span>{user?.credits || 1850} credits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview/Code Area */}
        <div className="flex-1 flex flex-col bg-gray-950">
          {/* Tabs */}
          <div className="border-b border-gray-800 px-4 flex items-center justify-between bg-gray-900/30">
            <div className="flex items-center">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-3 text-gray-400 hover:text-white transition-colors"
              >
                {showSidebar ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
              </button>
              <div className="flex">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'preview'
                      ? 'text-blue-400 border-blue-400'
                      : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'code'
                      ? 'text-blue-400 border-blue-400'
                      : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  Code
                </button>
                <button
                  onClick={() => setShowFileTree(!showFileTree)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                    showFileTree
                      ? 'text-blue-400 border-blue-400'
                      : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  <FolderTree className="w-4 h-4" />
                  Files
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'code' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyCode}
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  {copied ? <Check className="w-4 h-4 mr-2 text-green-400" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              )}
              {activeTab === 'preview' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* File Tree Sidebar */}
            {showFileTree && (
              <div className="w-56 border-r border-gray-800 bg-gray-900/50 overflow-y-auto">
                <div className="p-2">
                  <div className="text-gray-400 text-xs uppercase tracking-wider px-2 py-2">
                    Project Files
                  </div>
                  {renderFileTree(mockFileTree)}
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 relative">
              {activeTab === 'preview' ? (
                <div className="h-full bg-white flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Wand2 className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-gray-900 font-semibold text-lg mb-2">Live Preview</h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                      Describe your app in the chat and watch it come to life here in real-time
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full bg-[#0d1117] overflow-auto">
                  <div className="p-4">
                    <pre className="text-sm font-mono">
                      <code className="text-gray-300">
                        <span className="text-purple-400">import</span>{' '}
                        <span className="text-blue-300">React</span>{' '}
                        <span className="text-purple-400">from</span>{' '}
                        <span className="text-green-400">'react'</span>;{'\n\n'}
                        <span className="text-purple-400">function</span>{' '}
                        <span className="text-yellow-300">App</span>
                        <span className="text-gray-400">()</span> {'{'}
                        {'\n'}
                        {'  '}
                        <span className="text-purple-400">return</span> ({'\n'}
                        {'    '}&lt;<span className="text-blue-300">div</span>{' '}
                        <span className="text-cyan-300">className</span>=
                        <span className="text-green-400">"app"</span>&gt;{'\n'}
                        {'      '}&lt;<span className="text-blue-300">h1</span>&gt;
                        <span className="text-white">Hello, Blue Lotus!</span>
                        &lt;/<span className="text-blue-300">h1</span>&gt;{'\n'}
                        {'      '}&lt;<span className="text-blue-300">p</span>&gt;
                        <span className="text-white">Start building your app...</span>
                        &lt;/<span className="text-blue-300">p</span>&gt;{'\n'}
                        {'    '}&lt;/<span className="text-blue-300">div</span>&gt;{'\n'}
                        {'  '});{'\n'}
                        {'}'}{'\n\n'}
                        <span className="text-purple-400">export default</span>{' '}
                        <span className="text-yellow-300">App</span>;
                      </code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectBuilder;
