import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePlanEnforcement } from '../context/PlanEnforcementContext';
import { Button } from './ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from './ui/dialog';
import { 
  Lock, 
  Zap, 
  ArrowUpRight, 
  ShoppingCart,
  Rocket,
  Crown,
  Star,
  Sparkles
} from 'lucide-react';

const planIcons = {
  creator: Rocket,
  pro: Crown,
  elite: Star,
};

const UpgradePromptModal = () => {
  const navigate = useNavigate();
  const { upgradeModal, closeUpgradeModal, getUpgradeMessage, currentPlan } = usePlanEnforcement();
  
  const message = getUpgradeMessage();
  
  if (!message) return null;

  const isCreditsIssue = upgradeModal.type === 'insufficientCredits';
  const RequiredPlanIcon = message.requiredPlan ? (planIcons[message.requiredPlan] || Sparkles) : Zap;

  const handleUpgrade = () => {
    closeUpgradeModal();
    if (isCreditsIssue) {
      navigate('/settings/billing');
    } else {
      navigate(`/checkout?plan=${message.requiredPlan}`);
    }
  };

  const handleViewPricing = () => {
    closeUpgradeModal();
    navigate('/pricing');
  };

  return (
    <Dialog open={upgradeModal.isOpen} onOpenChange={(open) => !open && closeUpgradeModal()}>
      <DialogContent className="bg-gray-900 border-gray-800 sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isCreditsIssue ? 'bg-yellow-500/20' : 'bg-blue-600/20'
            }`}>
              {isCreditsIssue ? (
                <Zap className="w-6 h-6 text-yellow-500" />
              ) : (
                <Lock className="w-6 h-6 text-blue-400" />
              )}
            </div>
            <DialogTitle className="text-xl font-semibold text-white">
              {message.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-400 text-sm leading-relaxed">
            {message.description}
          </DialogDescription>
        </DialogHeader>

        {/* Upgrade Benefits */}
        {!isCreditsIssue && message.requiredPlan && (
          <div className="py-4">
            <div className="p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <RequiredPlanIcon className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">
                  Upgrade to {message.requiredPlan.charAt(0).toUpperCase() + message.requiredPlan.slice(1)}
                </span>
              </div>
              <ul className="space-y-2">
                {message.requiredPlan === 'creator' && (
                  <>
                    <li className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      Export apps and websites
                    </li>
                    <li className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      Publish to staging environment
                    </li>
                    <li className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      150 monthly credits + 10/day bonus
                    </li>
                  </>
                )}
                {message.requiredPlan === 'pro' && (
                  <>
                    <li className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      Publish to production
                    </li>
                    <li className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      Remove Blue Lotus branding
                    </li>
                    <li className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      400 monthly credits + priority speed
                    </li>
                  </>
                )}
                {message.requiredPlan === 'elite' && (
                  <>
                    <li className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      Team access (1-3 seats)
                    </li>
                    <li className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      Unlimited publishing
                    </li>
                    <li className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      800 monthly credits + priority support
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Credit Purchase Options */}
        {isCreditsIssue && (
          <div className="py-4">
            <p className="text-gray-400 text-sm mb-3">Purchase credits to continue:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { credits: 100, price: '$4.99' },
                { credits: 250, price: '$9.99' },
                { credits: 600, price: '$19.99' },
                { credits: 1500, price: '$39.99' },
              ].map((pack) => (
                <div 
                  key={pack.credits}
                  className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-center"
                >
                  <p className="text-white font-bold">{pack.credits}</p>
                  <p className="text-gray-400 text-sm">{pack.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={closeUpgradeModal}
            className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Maybe Later
          </Button>
          
          {isCreditsIssue ? (
            <Button
              onClick={handleUpgrade}
              className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Purchase Credits
            </Button>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleViewPricing}
                className="flex-1 sm:flex-none border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                View Plans
              </Button>
              <Button
                onClick={handleUpgrade}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePromptModal;
