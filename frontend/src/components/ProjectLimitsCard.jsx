import React from 'react';
import { Link } from 'react-router-dom';
import { usePlanEnforcement } from '../context/PlanEnforcementContext';
import { Button } from './ui/button';
import { 
  FolderOpen, 
  Globe, 
  ArrowUpRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const ProjectLimitsCard = ({ compact = false }) => {
  const { 
    currentPlan,
    getProjectLimits, 
    getPublishLimits,
    getPlanRestrictions 
  } = usePlanEnforcement();

  const projectLimits = getProjectLimits();
  const publishLimits = getPublishLimits();
  const restrictions = getPlanRestrictions();

  const projectPercent = projectLimits.percentUsed;
  const publishPercent = publishLimits.percentUsed;

  const getProgressColor = (percent) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  if (compact) {
    return (
      <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl" data-testid="project-limits-compact">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm">Projects</span>
          <span className="text-white font-medium">
            {projectLimits.current} / {projectLimits.max}
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${getProgressColor(projectPercent)}`}
            style={{ width: `${Math.min(projectPercent, 100)}%` }}
          />
        </div>
        {projectLimits.remaining <= 1 && (
          <p className="text-yellow-400 text-xs mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {projectLimits.remaining === 0 ? 'Limit reached' : '1 project remaining'}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6" data-testid="project-limits-full">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <FolderOpen className="w-5 h-5 text-blue-400" />
        Project Limits
      </h2>

      <div className="space-y-4">
        {/* Active Projects */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Active Projects</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">
                {projectLimits.current} / {projectLimits.max}
              </span>
              {projectLimits.remaining <= 1 && (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
            </div>
          </div>
          <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${getProgressColor(projectPercent)}`}
              style={{ width: `${Math.min(projectPercent, 100)}%` }}
            />
          </div>
          {projectLimits.remaining <= 2 && projectLimits.remaining > 0 && (
            <p className="text-yellow-400 text-xs mt-1">
              Only {projectLimits.remaining} project{projectLimits.remaining > 1 ? 's' : ''} remaining
            </p>
          )}
          {projectLimits.remaining === 0 && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Project limit reached - upgrade to create more
            </p>
          )}
        </div>

        {/* Published Projects */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              Published Projects
            </span>
            <span className="text-white font-medium">
              {publishLimits.current} / {publishLimits.max}
            </span>
          </div>
          {!publishLimits.isUnlimited && (
            <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${getProgressColor(publishPercent)}`}
                style={{ width: `${Math.min(publishPercent, 100)}%` }}
              />
            </div>
          )}
          {publishLimits.isUnlimited && (
            <div className="flex items-center gap-1 text-green-400 text-xs">
              <CheckCircle className="w-3 h-3" />
              Unlimited publishing
            </div>
          )}
          {!publishLimits.isUnlimited && publishLimits.remaining === 0 && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Publishing limit reached
            </p>
          )}
        </div>

        {/* Plan Info */}
        <div className="pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Current Plan</span>
            <span className="text-white font-medium">{restrictions.planName}</span>
          </div>
        </div>

        {/* Limits Table */}
        <div className="p-3 bg-gray-800/30 rounded-lg">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500">
                <th className="text-left pb-2">Plan</th>
                <th className="text-center pb-2">Projects</th>
                <th className="text-center pb-2">Published</th>
              </tr>
            </thead>
            <tbody className="text-gray-400">
              <tr className={currentPlan === 'free' ? 'text-white' : ''}>
                <td className="py-1">Free</td>
                <td className="text-center">3</td>
                <td className="text-center">0</td>
              </tr>
              <tr className={currentPlan === 'creator' ? 'text-white' : ''}>
                <td className="py-1">Creator</td>
                <td className="text-center">10</td>
                <td className="text-center">2</td>
              </tr>
              <tr className={currentPlan === 'pro' ? 'text-white' : ''}>
                <td className="py-1">Pro</td>
                <td className="text-center">25</td>
                <td className="text-center">5</td>
              </tr>
              <tr className={currentPlan === 'elite' ? 'text-white' : ''}>
                <td className="py-1">Elite</td>
                <td className="text-center">100</td>
                <td className="text-center">∞</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Upgrade CTA */}
        {(projectLimits.remaining <= 2 || !publishLimits.isUnlimited) && (
          <Link to="/pricing">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Upgrade for More Projects
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProjectLimitsCard;
