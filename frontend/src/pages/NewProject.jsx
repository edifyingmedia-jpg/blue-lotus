import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import {
  Smartphone,
  Globe,
  Layers,
  ArrowRight,
  Sparkles,
  Check,
} from 'lucide-react';

const projectTypes = [
  {
    id: 'app',
    title: 'Build an App',
    description: 'Multi-screen mobile or web application with authentication, dashboards, and data flows',
    icon: Smartphone,
    features: ['User authentication', 'Multiple screens', 'Data models', 'Business logic'],
  },
  {
    id: 'website',
    title: 'Build a Website',
    description: 'Marketing sites, landing pages, blogs with beautiful responsive designs',
    icon: Globe,
    features: ['Landing pages', 'Blog sections', 'Contact forms', 'SEO ready'],
  },
  {
    id: 'both',
    title: 'Build Both',
    description: 'Full platform with marketing website and connected application',
    icon: Layers,
    features: ['Marketing site', 'Connected app', 'Shared data', 'Unified design'],
  },
];

const NewProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [projectDescription, setProjectDescription] = useState('');
  const [projectName, setProjectName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!projectDescription.trim() || !selectedType) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create project and navigate to builder
    const projectId = Date.now().toString();
    
    // Store project data in localStorage for the builder
    localStorage.setItem(`project_${projectId}`, JSON.stringify({
      id: projectId,
      name: projectName || 'Untitled Project',
      type: selectedType,
      description: projectDescription,
      createdAt: new Date().toISOString(),
    }));
    
    navigate(`/builder/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size={36} />
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          {/* Step 1: Select Project Type */}
          {step === 1 && (
            <div className="animate-in fade-in duration-300">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-white mb-3">
                  What would you like to build?
                </h1>
                <p className="text-gray-400">
                  Select the type of project and let AI handle the rest
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {projectTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                          : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        isSelected ? 'bg-blue-500/20' : 'bg-gray-800'
                      }`}>
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                      </div>
                      <h3 className="text-white font-semibold mb-2">{type.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{type.description}</p>
                      <ul className="space-y-1.5">
                        {type.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-500 text-xs">
                            <Check className="w-3 h-3 text-blue-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedType}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Describe Project */}
          {step === 2 && (
            <div className="animate-in fade-in duration-300">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">
                  Describe your project
                </h1>
                <p className="text-gray-400 max-w-lg mx-auto">
                  Tell us what you want to build in plain language. Be as detailed as you like — 
                  AI will generate the complete structure.
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="My Awesome Project"
                    className="w-full h-12 px-4 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Project Description
                  </label>
                  <Textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe what you want to build...\n\nExample: A fitness tracking app with user login, workout logging, progress charts, and a social feed where users can share achievements."
                    className="min-h-[200px] bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-blue-500 rounded-xl resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="text-gray-400 hover:text-white"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={!projectDescription.trim() || isGenerating}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Project
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProject;
