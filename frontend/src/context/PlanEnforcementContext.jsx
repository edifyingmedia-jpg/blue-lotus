import React, { createContext, useContext, useState } from 'react';

// Plan tier configuration with project limits
const PLAN_CONFIG = {
  free: {
    name: 'Free',
    export: false,
    download: false,
    publish: false,
    publishProduction: false,
    monthlyCredits: 0,
    dailyBonus: 0,
    maxProjects: 3,
    maxPublishedProjects: 0,
  },
  creator: {
    name: 'Creator',
    export: true,
    download: true,
    publish: true, // Staging only
    publishProduction: false,
    monthlyCredits: 150,
    dailyBonus: 10,
    maxProjects: 10,
    maxPublishedProjects: 2,
  },
  pro: {
    name: 'Pro',
    export: true,
    download: true,
    publish: true,
    publishProduction: true,
    monthlyCredits: 400,
    dailyBonus: 10,
    maxProjects: 25,
    maxPublishedProjects: 5,
  },
  elite: {
    name: 'Elite',
    export: true,
    download: true,
    publish: true,
    publishProduction: true,
    unlimitedPublishing: true,
    monthlyCredits: 800,
    dailyBonus: 10,
    maxProjects: 100,
    maxPublishedProjects: Infinity, // Unlimited
  },
};

// Upgrade trigger messages
const UPGRADE_MESSAGES = {
  export: {
    title: 'Export Requires Upgrade',
    description: 'Free users cannot export apps or websites. Upgrade to Creator or higher to unlock exporting.',
    requiredPlan: 'creator',
  },
  download: {
    title: 'Download Requires Upgrade',
    description: 'Free users cannot download project code. Upgrade to Creator or higher to unlock downloads.',
    requiredPlan: 'creator',
  },
  publish: {
    title: 'Publishing Requires Upgrade',
    description: 'Free users cannot publish projects. Upgrade to Creator or higher to publish to staging.',
    requiredPlan: 'creator',
  },
  publishProduction: {
    title: 'Production Publishing Requires Pro',
    description: 'Creator plan only supports staging deployments. Upgrade to Pro or Elite to publish to production.',
    requiredPlan: 'pro',
  },
  insufficientCredits: {
    title: 'Insufficient Credits',
    description: 'You don\'t have enough credits to perform this action. Purchase more credits or wait for your daily bonus.',
    requiredPlan: null,
  },
  teamAccess: {
    title: 'Team Access Requires Elite',
    description: 'Team collaboration is only available on the Elite plan. Upgrade to add team members.',
    requiredPlan: 'elite',
  },
  projectLimit: {
    title: 'Project Limit Reached',
    description: 'You\'ve reached the maximum number of projects for your plan. Upgrade to create more projects.',
    requiredPlan: 'creator',
  },
  publishLimit: {
    title: 'Publishing Limit Reached',
    description: 'You\'ve reached the maximum number of published projects for your plan. Upgrade to publish more.',
    requiredPlan: 'pro',
  },
};

const PlanEnforcementContext = createContext(null);

export const PlanEnforcementProvider = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState('creator'); // Mock: default to creator
  const [credits, setCredits] = useState({
    monthly: { remaining: 103, total: 150 },
    bonus: { remaining: 8, total: 10 },
    purchased: 250,
  });
  const [projectCount, setProjectCount] = useState(3); // Mock: current project count
  const [publishedCount, setPublishedCount] = useState(1); // Mock: current published count
  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    type: null,
  });

  const planConfig = PLAN_CONFIG[currentPlan] || PLAN_CONFIG.free;
  const totalCredits = credits.monthly.remaining + credits.bonus.remaining + credits.purchased;

  // Check if user can export
  const canExport = () => {
    return planConfig.export;
  };

  // Check if user can download
  const canDownload = () => {
    return planConfig.download;
  };

  // Check if user can publish (to staging)
  const canPublish = () => {
    return planConfig.publish;
  };

  // Check if user can publish to production
  const canPublishProduction = () => {
    return planConfig.publishProduction;
  };

  // Check if user can create more projects
  const canCreateProject = () => {
    return projectCount < planConfig.maxProjects;
  };

  // Check if user can publish more projects
  const canPublishMore = () => {
    if (planConfig.maxPublishedProjects === Infinity) return true;
    return publishedCount < planConfig.maxPublishedProjects;
  };

  // Get project limits info
  const getProjectLimits = () => {
    return {
      current: projectCount,
      max: planConfig.maxProjects,
      remaining: planConfig.maxProjects - projectCount,
      percentUsed: (projectCount / planConfig.maxProjects) * 100,
    };
  };

  // Get published limits info
  const getPublishLimits = () => {
    const isUnlimited = planConfig.maxPublishedProjects === Infinity;
    return {
      current: publishedCount,
      max: isUnlimited ? 'Unlimited' : planConfig.maxPublishedProjects,
      remaining: isUnlimited ? Infinity : planConfig.maxPublishedProjects - publishedCount,
      isUnlimited,
      percentUsed: isUnlimited ? 0 : (publishedCount / planConfig.maxPublishedProjects) * 100,
    };
  };

  // Check if user has enough credits
  const hasEnoughCredits = (required = 1) => {
    return totalCredits >= required;
  };

  // Deduct credits (following priority: bonus -> monthly -> purchased)
  const deductCredits = (amount) => {
    if (!hasEnoughCredits(amount)) {
      return false;
    }

    let remaining = amount;
    const newCredits = { ...credits };

    // First, deduct from bonus
    if (newCredits.bonus.remaining > 0) {
      const deductFromBonus = Math.min(remaining, newCredits.bonus.remaining);
      newCredits.bonus.remaining -= deductFromBonus;
      remaining -= deductFromBonus;
    }

    // Then, deduct from monthly
    if (remaining > 0 && newCredits.monthly.remaining > 0) {
      const deductFromMonthly = Math.min(remaining, newCredits.monthly.remaining);
      newCredits.monthly.remaining -= deductFromMonthly;
      remaining -= deductFromMonthly;
    }

    // Finally, deduct from purchased
    if (remaining > 0 && newCredits.purchased > 0) {
      newCredits.purchased -= remaining;
    }

    setCredits(newCredits);
    return true;
  };

  // Attempt to perform an action with enforcement
  const attemptAction = (action, requiredCredits = 0) => {
    // Check credits first
    if (requiredCredits > 0 && !hasEnoughCredits(requiredCredits)) {
      showUpgradeModal('insufficientCredits');
      return { allowed: false, reason: 'insufficientCredits' };
    }

    switch (action) {
      case 'export':
        if (!canExport()) {
          showUpgradeModal('export');
          return { allowed: false, reason: 'export' };
        }
        break;
      case 'download':
        if (!canDownload()) {
          showUpgradeModal('download');
          return { allowed: false, reason: 'download' };
        }
        break;
      case 'publish':
        if (!canPublish()) {
          showUpgradeModal('publish');
          return { allowed: false, reason: 'publish' };
        }
        if (!canPublishMore()) {
          showUpgradeModal('publishLimit');
          return { allowed: false, reason: 'publishLimit' };
        }
        break;
      case 'publishProduction':
        if (!canPublishProduction()) {
          showUpgradeModal('publishProduction');
          return { allowed: false, reason: 'publishProduction' };
        }
        break;
      case 'createProject':
        if (!canCreateProject()) {
          showUpgradeModal('projectLimit');
          return { allowed: false, reason: 'projectLimit' };
        }
        break;
      case 'teamAccess':
        if (currentPlan !== 'elite') {
          showUpgradeModal('teamAccess');
          return { allowed: false, reason: 'teamAccess' };
        }
        break;
      default:
        break;
    }

    // Deduct credits if required
    if (requiredCredits > 0) {
      deductCredits(requiredCredits);
    }

    return { allowed: true };
  };

  // Show upgrade modal
  const showUpgradeModal = (type) => {
    setUpgradeModal({ isOpen: true, type });
  };

  // Close upgrade modal
  const closeUpgradeModal = () => {
    setUpgradeModal({ isOpen: false, type: null });
  };

  // Get upgrade message for current modal
  const getUpgradeMessage = () => {
    if (!upgradeModal.type) return null;
    return UPGRADE_MESSAGES[upgradeModal.type];
  };

  // Get plan restrictions info
  const getPlanRestrictions = () => {
    return {
      canExport: planConfig.export,
      canDownload: planConfig.download,
      canPublish: planConfig.publish,
      canPublishProduction: planConfig.publishProduction,
      hasTeamAccess: currentPlan === 'elite',
      planName: planConfig.name,
      maxProjects: planConfig.maxProjects,
      maxPublishedProjects: planConfig.maxPublishedProjects,
    };
  };

  const value = {
    currentPlan,
    setCurrentPlan,
    credits,
    setCredits,
    totalCredits,
    planConfig,
    projectCount,
    setProjectCount,
    publishedCount,
    setPublishedCount,
    canExport,
    canDownload,
    canPublish,
    canPublishProduction,
    canCreateProject,
    canPublishMore,
    getProjectLimits,
    getPublishLimits,
    hasEnoughCredits,
    deductCredits,
    attemptAction,
    upgradeModal,
    showUpgradeModal,
    closeUpgradeModal,
    getUpgradeMessage,
    getPlanRestrictions,
    PLAN_CONFIG,
  };

  return (
    <PlanEnforcementContext.Provider value={value}>
      {children}
    </PlanEnforcementContext.Provider>
  );
};

export const usePlanEnforcement = () => {
  const context = useContext(PlanEnforcementContext);
  if (!context) {
    throw new Error('usePlanEnforcement must be used within a PlanEnforcementProvider');
  }
  return context;
};

export default PlanEnforcementContext;
