import React from 'react';
import { usePlanEnforcement } from '../context/PlanEnforcementContext';
import { Lock, Rocket, Crown, Star } from 'lucide-react';

const planIcons = {
  creator: Rocket,
  pro: Crown,
  elite: Star,
};

const planColors = {
  creator: 'blue',
  pro: 'purple',
  elite: 'yellow',
};

// Badge that shows when a feature requires an upgrade
export const UpgradeBadge = ({ requiredPlan, small = false }) => {
  const Icon = planIcons[requiredPlan] || Lock;
  const color = planColors[requiredPlan] || 'gray';
  
  if (small) {
    return (
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 bg-${color}-500/20 text-${color}-400 text-[10px] rounded`}>
        <Icon className="w-2.5 h-2.5" />
        {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 bg-${color}-500/20 border border-${color}-500/30 text-${color}-400 text-xs rounded-full`}>
      <Icon className="w-3 h-3" />
      {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}+ Required
    </span>
  );
};

// Lock icon overlay for restricted features
export const RestrictedOverlay = ({ show = true, requiredPlan }) => {
  if (!show) return null;
  
  return (
    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
      <div className="text-center">
        <Lock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-400 text-sm">
          Requires {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
        </p>
      </div>
    </div>
  );
};

// Hook to check if current plan allows a feature
export const useFeatureAccess = (feature) => {
  const { currentPlan, getPlanRestrictions } = usePlanEnforcement();
  const restrictions = getPlanRestrictions();
  
  const featureMap = {
    export: restrictions.canExport,
    publish: restrictions.canPublish,
    publishProduction: restrictions.canPublishProduction,
    teamAccess: restrictions.hasTeamAccess,
  };

  const requiredPlanMap = {
    export: 'creator',
    publish: 'creator',
    publishProduction: 'pro',
    teamAccess: 'elite',
  };

  return {
    hasAccess: featureMap[feature] ?? true,
    requiredPlan: requiredPlanMap[feature],
    currentPlan,
  };
};

// Button wrapper that shows upgrade prompt on restricted click
export const RestrictedButton = ({ 
  children, 
  feature, 
  onClick, 
  className = '',
  disabled = false,
  ...props 
}) => {
  const { attemptAction } = usePlanEnforcement();
  const { hasAccess, requiredPlan } = useFeatureAccess(feature);

  const handleClick = (e) => {
    if (!hasAccess) {
      e.preventDefault();
      attemptAction(feature);
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative ${className} ${!hasAccess ? 'opacity-80' : ''}`}
      {...props}
    >
      {children}
      {!hasAccess && (
        <span className="absolute -top-1 -right-1">
          <Lock className="w-3 h-3 text-gray-400" />
        </span>
      )}
    </button>
  );
};

export default UpgradeBadge;
