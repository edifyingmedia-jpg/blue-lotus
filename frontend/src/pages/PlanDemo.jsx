import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { usePlanEnforcement } from '../context/PlanEnforcementContext';
import ProjectLimitsCard from '../components/ProjectLimitsCard';
import { Button } from '../components/ui/button';
import { 
  Download, 
  Upload, 
  Rocket, 
  Users, 
  Zap,
  CheckCircle,
  XCircle,
  Crown,
  Star,
  Sparkles,
  Lock,
  ArrowRight,
  FolderPlus,
  Minus,
  Plus
} from 'lucide-react';

const PlanDemo = () => {
  const { 
    currentPlan, 
    setCurrentPlan, 
    credits,
    totalCredits,
    projectCount,
    setProjectCount,
    publishedCount,
    setPublishedCount,
    attemptAction,
    getPlanRestrictions,
    getProjectLimits,
    PLAN_CONFIG
  } = usePlanEnforcement();

  const restrictions = getPlanRestrictions();
  const projectLimits = getProjectLimits();

  const planOptions = [
    { id: 'free', name: 'Free', icon: Sparkles },
    { id: 'creator', name: 'Creator', icon: Rocket },
    { id: 'pro', name: 'Pro', icon: Crown },
    { id: 'elite', name: 'Elite', icon: Star },
  ];

  const testActions = [
    { 
      id: 'export', 
      name: 'Export App', 
      description: 'Download your app code',
      icon: Download,
      requiredPlan: 'creator'
    },
    { 
      id: 'createProject', 
      name: 'Create Project', 
      description: 'Add a new project',
      icon: FolderPlus,
      requiredPlan: 'varies'
    },
    { 
      id: 'publish', 
      name: 'Publish to Staging', 
      description: 'Deploy to staging environment',
      icon: Upload,
      requiredPlan: 'creator'
    },
    { 
      id: 'publishProduction', 
      name: 'Publish to Production', 
      description: 'Deploy to live production',
      icon: Rocket,
      requiredPlan: 'pro'
    },
    { 
      id: 'teamAccess', 
      name: 'Add Team Member', 
      description: 'Invite collaborators',
      icon: Users,
      requiredPlan: 'elite'
    },
  ];

  const handleTestAction = (actionId) => {
    const result = attemptAction(actionId, 0);
    if (result.allowed) {
      alert(`✅ Action "${actionId}" allowed! This would perform the action.`);
    }
    // If not allowed, the upgrade modal will appear automatically
  };

  const handleTestGeneration = (creditCost) => {
    const result = attemptAction('generate', creditCost);
    if (result.allowed) {
      alert(`✅ Generation successful! ${creditCost} credits deducted.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Plan Enforcement Demo
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Test how plan restrictions work. Switch between plans and try different actions to see the upgrade prompts.
            </p>
          </div>

          {/* Plan Selector */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Select Your Plan (Demo)</h2>
            <div className="grid grid-cols-4 gap-3">
              {planOptions.map((plan) => {
                const Icon = plan.icon;
                const isActive = currentPlan === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setCurrentPlan(plan.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isActive 
                        ? 'border-blue-500 bg-blue-600/10' 
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {plan.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Restrictions */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">
              Current Plan: {restrictions.planName}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg flex items-center gap-3 ${
                restrictions.canExport ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}>
                {restrictions.canExport ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={restrictions.canExport ? 'text-green-300' : 'text-red-300'}>
                  Export Apps
                </span>
              </div>
              <div className={`p-3 rounded-lg flex items-center gap-3 ${
                restrictions.canPublish ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}>
                {restrictions.canPublish ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={restrictions.canPublish ? 'text-green-300' : 'text-red-300'}>
                  Publish (Staging)
                </span>
              </div>
              <div className={`p-3 rounded-lg flex items-center gap-3 ${
                restrictions.canPublishProduction ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}>
                {restrictions.canPublishProduction ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={restrictions.canPublishProduction ? 'text-green-300' : 'text-red-300'}>
                  Publish (Production)
                </span>
              </div>
              <div className={`p-3 rounded-lg flex items-center gap-3 ${
                restrictions.hasTeamAccess ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}>
                {restrictions.hasTeamAccess ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={restrictions.hasTeamAccess ? 'text-green-300' : 'text-red-300'}>
                  Team Access
                </span>
              </div>
            </div>
          </div>

          {/* Test Actions */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Test Actions</h2>
            <p className="text-gray-400 text-sm mb-4">
              Click these buttons to test the plan enforcement. If your current plan doesn't support the action, you'll see an upgrade prompt.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {testActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleTestAction(action.id)}
                    className="p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-500 text-xs">
                        Requires {action.requiredPlan}+
                      </span>
                    </div>
                    <p className="text-white font-medium">{action.name}</p>
                    <p className="text-gray-400 text-sm">{action.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Credit Deduction */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Test Credit Usage</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-yellow-400 font-bold">{totalCredits}</span>
                <span className="text-yellow-400/70 text-sm">total credits</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                <p className="text-gray-400 text-xs">Bonus</p>
                <p className="text-white font-bold">{credits.bonus.remaining}</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                <p className="text-gray-400 text-xs">Monthly</p>
                <p className="text-white font-bold">{credits.monthly.remaining}</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                <p className="text-gray-400 text-xs">Purchased</p>
                <p className="text-white font-bold">{credits.purchased}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => handleTestGeneration(5)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Use 5 Credits
              </Button>
              <Button 
                onClick={() => handleTestGeneration(50)}
                variant="outline"
                className="border-gray-700"
              >
                Use 50 Credits
              </Button>
              <Button 
                onClick={() => handleTestGeneration(500)}
                variant="outline"
                className="border-gray-700"
              >
                Use 500 Credits
              </Button>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2">
              Back to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlanDemo;
