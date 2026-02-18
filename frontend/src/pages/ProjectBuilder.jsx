import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockProjects, mockChatMessages } from '../data/mock';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Send,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Download,
  Settings,
  ExternalLink,
  Code,
  Eye,
  Loader2,
  Bot,
  User,
  ChevronDown,
  Zap,
  Github,
  Globe,
  Sparkles,
  Copy,
  Check,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';

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

  const [messages, setMessages] = useState(mockChatMessages);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [showSidebar, setShowSidebar] = useState(true);
  const [copied, setCopied] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you want to ${inputValue.toLowerCase()}. I'm working on implementing that for you now. Here's what I'll do:\n\n1. **Analyze** your requirements\n2. **Generate** the necessary code\n3. **Test** the implementation\n4. **Deploy** the changes\n\nThe preview on the right will update automatically once the changes are ready.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
              Back
            </Button>
            <div className="h-6 w-px bg-gray-800" />
            <div>
              <h1 className="text-white font-medium text-sm">{project.name}</h1>
              <p className="text-gray-500 text-xs">Editing</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Github className="w-4 h-4 mr-2" />
              Push to GitHub
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
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
            showSidebar ? 'w-[400px]' : 'w-0'
          } border-r border-gray-800 flex flex-col transition-all duration-300 overflow-hidden bg-gray-900/50`}
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h2 className="text-white font-medium text-sm">AI Assistant</h2>
                <p className="text-gray-500 text-xs">Ready to help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMessages(mockChatMessages)}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-blue-600'
                      : 'bg-gray-800 border border-gray-700'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-blue-400" />
                  )}
                </div>
                <div
                  className={`flex-1 ${
                    message.role === 'user' ? 'text-right' : ''
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-xl max-w-[90%] text-left ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-200 border border-gray-700'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                    <span className="text-gray-400 text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="relative">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe what you want to build..."
                className="min-h-[80px] max-h-[200px] pr-12 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 resize-none"
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isGenerating}
                className="absolute right-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Preview/Code Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="border-b border-gray-800 px-4 flex items-center justify-between bg-gray-900/30">
            <div className="flex">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-3 text-gray-400 hover:text-white transition-colors"
              >
                {showSidebar ? (
                  <PanelLeftClose className="w-5 h-5" />
                ) : (
                  <PanelLeft className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'preview'
                    ? 'text-blue-400 border-blue-400'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4 inline-block mr-2" />
                Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'code'
                    ? 'text-blue-400 border-blue-400'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <Code className="w-4 h-4 inline-block mr-2" />
                Code
              </button>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'code' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyCode}
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  {copied ? (
                    <Check className="w-4 h-4 mr-2 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              )}
              {activeTab === 'preview' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in new tab
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'preview' ? (
              <div className="h-full bg-white">
                <iframe
                  src="about:blank"
                  className="w-full h-full border-0"
                  title="Preview"
                />
                {/* Placeholder content */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-gray-900 font-semibold mb-2">Live Preview</h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                      Start describing your app in the chat to see the live preview here
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full bg-gray-950 p-4 overflow-auto">
                <pre className="text-sm text-gray-300 font-mono">
                  <code>{`// Your project code will appear here
// Start chatting with the AI to generate code

import React from 'react';

function App() {
  return (
    <div className="app">
      <h1>Hello, Blue Lotus!</h1>
      <p>Start building your app...</p>
    </div>
  );
}

export default App;`}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectBuilder;
