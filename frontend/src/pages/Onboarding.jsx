import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { Textarea } from '../components/ui/textarea';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Coins,
  Smartphone,
  Globe,
  Layers,
  FileText,
  Check,
  Loader2,
  Zap,
} from 'lucide-react';

const ONBOARDING_STEPS = [
  { id: 'welcome', title: 'Welcome to Blue Lotus' },
  { id: 'account_setup', title: 'Set Up Your Account' },
  { id: 'intro_credits', title: 'Your Starter Credits' },
  { id: 'project_type', title: 'What Do You Want to Build?' },
  { id: 'project_brief', title: 'Describe Your Project' },
  { id: 'review_structure', title: 'Your Project Structure Is Ready' },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatingStructure, setGeneratingStructure] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    projectType: '',
    projectDescription: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [generatedStructure, setGeneratedStructure] = useState(null);

  // Redirect if already authenticated (skip to project type step)
  useEffect(() => {
    if (isAuthenticated && currentStep < 2) {
      setCurrentStep(2); // Skip to credits intro
    }
  }, [isAuthenticated, currentStep]);

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleAccountSetup = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    
    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to create account');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const generateProjectStructure = async () => {
    setGeneratingStructure(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const structures = {
      app: {
        screens: ['Home', 'Dashboard', 'Profile', 'Settings', 'Login', 'Signup'],
        dataModels: ['User', 'Session', 'Preferences'],
        flows: ['Authentication', 'Onboarding', 'Main Navigation'],
      },
      website: {
        pages: ['Home', 'About', 'Services', 'Pricing', 'Contact', 'Blog'],
        sections: ['Hero', 'Features', 'Testimonials', 'CTA', 'Footer'],
        integrations: ['Contact Form', 'Newsletter', 'Analytics'],
      },
      both: {
        screens: ['Home', 'Dashboard', 'Profile', 'Settings'],
        pages: ['Landing', 'About', 'Pricing', 'Blog'],
        dataModels: ['User', 'Session', 'Content', 'Analytics'],
        flows: ['Authentication', 'Onboarding', 'Content Management'],
      },
    };
    
    setGeneratedStructure(structures[formData.projectType] || structures.app);
    setGeneratingStructure(false);
  };

  const handleNext = async () => {
    const step = ONBOARDING_STEPS[currentStep];
    
    if (step.id === 'account_setup') {
      const success = await handleAccountSetup();
      if (!success) return;
    }
    
    if (step.id === 'project_type' && !formData.projectType) {
      setError('Please select what you want to build');
      return;
    }
    
    if (step.id === 'project_brief') {
      if (!formData.projectDescription.trim()) {
        setError('Please describe your project');
        return;
      }
      await generateProjectStructure();
    }
    
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setError('');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setError('');
    }
  };

  const handleOpenProject = () => {
    // Create mock project and navigate to builder
    const projectId = 'new-' + Date.now();
    localStorage.setItem('bluelotus_new_project', JSON.stringify({
      id: projectId,
      type: formData.projectType,
      description: formData.projectDescription,
      structure: generatedStructure,
    }));
    navigate(`/builder/${projectId}`);
  };

  const renderStep = () => {
    const step = ONBOARDING_STEPS[currentStep];

    switch (step.id) {
      case 'welcome':
        return <WelcomeStep />;
      case 'account_setup':
        return (
          <AccountSetupStep
            formData={formData}
            onInputChange={handleInputChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            error={error}
          />
        );
      case 'intro_credits':
        return <IntroCreditsStep />;
      case 'project_type':
        return (
          <ProjectTypeStep
            selectedType={formData.projectType}
            onSelect={(type) => handleInputChange('projectType', type)}
            error={error}
          />
        );
      case 'project_brief':
        return (
          <ProjectBriefStep
            description={formData.projectDescription}
            onDescriptionChange={(value) => handleInputChange('projectDescription', value)}
            error={error}
            isGenerating={generatingStructure}
          />
        );
      case 'review_structure':
        return (
          <ReviewStructureStep
            structure={generatedStructure}
            projectType={formData.projectType}
          />
        );
      default:
        return null;
    }
  };

  const getCtaText = () => {
    const step = ONBOARDING_STEPS[currentStep];
    if (loading) return 'Creating Account...';
    if (generatingStructure) return 'Generating...';
    
    switch (step.id) {
      case 'welcome':
        return 'Get Started';
      case 'account_setup':
        return 'Continue';
      case 'intro_credits':
        return 'Continue';
      case 'project_type':
        return 'Continue';
      case 'project_brief':
        return 'Generate Structure';
      case 'review_structure':
        return 'Open Project';
      default:
        return 'Continue';
    }
  };

  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col" data-testid="onboarding-page">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <Logo size={40} />
      </header>

      {/* Progress Bar */}
      <div className="relative z-10 px-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            Step {currentStep + 1} of {ONBOARDING_STEPS.length}
          </span>
          <span className="text-sm text-gray-400">
            {Math.round(progress)}% complete
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-800" data-testid="onboarding-progress" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {renderStep()}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm" data-testid="onboarding-error">
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center gap-4">
            {currentStep > 0 && !isLastStep && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                disabled={loading || generatingStructure}
                data-testid="onboarding-back-btn"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            
            <Button
              onClick={isLastStep ? handleOpenProject : handleNext}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              disabled={loading || generatingStructure}
              data-testid="onboarding-cta-btn"
            >
              {(loading || generatingStructure) && (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              )}
              {getCtaText()}
              {!loading && !generatingStructure && (
                <ArrowRight className="w-5 h-5 ml-2" />
              )}
            </Button>
          </div>

          {/* Skip Link for Welcome */}
          {ONBOARDING_STEPS[currentStep].id === 'welcome' && (
            <p className="text-center text-gray-500 mt-4 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-400 hover:underline"
                data-testid="onboarding-login-link"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

// Step Components
const WelcomeStep = () => (
  <div className="text-center" data-testid="welcome-step">
    <div className="mb-8 flex justify-center">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
        <Sparkles className="w-12 h-12 text-white" />
      </div>
    </div>
    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
      Welcome to Blue Lotus
    </h1>
    <p className="text-lg text-gray-400 max-w-lg mx-auto">
      A no-code, no-drag builder for apps and websites. Describe what you want to build, and we'll create it for you.
    </p>
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Check className="w-4 h-4 text-green-400" />
        No coding required
      </div>
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Check className="w-4 h-4 text-green-400" />
        No drag-and-drop
      </div>
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Check className="w-4 h-4 text-green-400" />
        AI-powered generation
      </div>
    </div>
  </div>
);

const AccountSetupStep = ({ formData, onInputChange, showPassword, setShowPassword, error }) => (
  <div data-testid="account-setup-step">
    <div className="text-center mb-8">
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center">
          <User className="w-8 h-8 text-blue-400" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">Set Up Your Account</h2>
      <p className="text-gray-400">Create your account to start building</p>
    </div>

    <div className="space-y-4 max-w-md mx-auto">
      <div>
        <Label htmlFor="name" className="text-gray-300">Full Name</Label>
        <div className="relative mt-1">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="John Doe"
            className="pl-10 h-12 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-blue-500"
            data-testid="onboarding-name-input"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-gray-300">Email</Label>
        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="you@example.com"
            className="pl-10 h-12 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-blue-500"
            data-testid="onboarding-email-input"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password" className="text-gray-300">Password</Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            placeholder="Min. 8 characters"
            className="pl-10 pr-10 h-12 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-blue-500"
            data-testid="onboarding-password-input"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const IntroCreditsStep = () => (
  <div className="text-center" data-testid="intro-credits-step">
    <div className="mb-8 flex justify-center">
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/30">
          <Coins className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
          20
        </div>
      </div>
    </div>
    <h2 className="text-3xl font-bold text-white mb-4">Your Starter Credits</h2>
    <p className="text-lg text-gray-400 max-w-lg mx-auto mb-8">
      You have been given <span className="text-amber-400 font-semibold">20 free credits</span> to explore the builder.
    </p>
    
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 max-w-md mx-auto">
      <h3 className="text-white font-semibold mb-4">What can you do with credits?</h3>
      <div className="space-y-3 text-left">
        <div className="flex items-center gap-3 text-gray-300">
          <Zap className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <span>Generate screens and pages</span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <Zap className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <span>Create data models and flows</span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <Zap className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <span>Refine and iterate on your project</span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <Zap className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <span>Preview your app or website</span>
        </div>
      </div>
    </div>
  </div>
);

const ProjectTypeStep = ({ selectedType, onSelect, error }) => {
  const projectTypes = [
    {
      id: 'app',
      icon: Smartphone,
      title: 'App',
      description: 'Mobile or web application with screens, navigation, and user flows',
    },
    {
      id: 'website',
      icon: Globe,
      title: 'Website',
      description: 'Marketing site, portfolio, or landing page with pages and sections',
    },
    {
      id: 'both',
      icon: Layers,
      title: 'Both',
      description: 'Full-stack solution with app functionality and marketing pages',
    },
  ];

  return (
    <div data-testid="project-type-step">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">What Do You Want to Build?</h2>
        <p className="text-gray-400">Choose the type of project that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projectTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-800/50'
              }`}
              data-testid={`project-type-${type.id}`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                isSelected ? 'bg-blue-500' : 'bg-gray-800'
              }`}>
                <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{type.title}</h3>
              <p className="text-sm text-gray-400">{type.description}</p>
              {isSelected && (
                <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm">
                  <Check className="w-4 h-4" />
                  Selected
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ProjectBriefStep = ({ description, onDescriptionChange, error, isGenerating }) => (
  <div data-testid="project-brief-step">
    <div className="text-center mb-8">
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center">
          <FileText className="w-8 h-8 text-blue-400" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">Describe Your Project</h2>
      <p className="text-gray-400">Tell us what you want to build and we'll generate the structure</p>
    </div>

    <div className="max-w-lg mx-auto">
      <Textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="E.g., A task management app where users can create projects, add tasks, set deadlines, and collaborate with team members..."
        className="min-h-[160px] bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-blue-500 resize-none"
        disabled={isGenerating}
        data-testid="project-description-input"
      />
      
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs text-gray-500">Try:</span>
        {['E-commerce store', 'Portfolio website', 'SaaS dashboard', 'Social app'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onDescriptionChange(suggestion)}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs rounded-full transition-colors"
            disabled={isGenerating}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>

    {isGenerating && (
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Generating your project structure...
        </div>
      </div>
    )}
  </div>
);

const ReviewStructureStep = ({ structure, projectType }) => {
  if (!structure) return null;

  const getStructureItems = () => {
    const items = [];
    
    if (structure.screens) {
      items.push({ label: 'Screens', items: structure.screens, icon: Smartphone });
    }
    if (structure.pages) {
      items.push({ label: 'Pages', items: structure.pages, icon: Globe });
    }
    if (structure.dataModels) {
      items.push({ label: 'Data Models', items: structure.dataModels, icon: Layers });
    }
    if (structure.flows) {
      items.push({ label: 'Flows', items: structure.flows, icon: Zap });
    }
    if (structure.sections) {
      items.push({ label: 'Sections', items: structure.sections, icon: FileText });
    }
    if (structure.integrations) {
      items.push({ label: 'Integrations', items: structure.integrations, icon: Check });
    }
    
    return items;
  };

  return (
    <div data-testid="review-structure-step">
      <div className="text-center mb-8">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center">
            <Check className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Your Project Structure Is Ready</h2>
        <p className="text-gray-400">Screens, pages, and data models have been generated</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {getStructureItems().map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.label}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white">{section.label}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {section.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          You can customize everything after opening your project
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
