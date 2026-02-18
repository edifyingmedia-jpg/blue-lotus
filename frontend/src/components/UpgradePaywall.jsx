import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  X,
  Download,
  Upload,
  Rocket,
  AlertTriangle,
  FolderPlus,
  Globe
} from 'lucide-react';

// Paywall messages for different blocked actions
const PAYWALL_MESSAGES = {
  export: {
    icon: Download,
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-600/20',
    title: 'Export Blocked',
    message: 'Exporting projects is available on paid plans.',
    showUpgrade: true,
    showCredits: false,
  },
  download: {
    icon: Download,
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-600/20',
    title: 'Download Blocked',
    message: 'Downloading project code is available on paid plans.',
    showUpgrade: true,
    showCredits: false,
  },
  publish: {
    icon: Upload,
    iconColor: 'text-purple-400',
    bgColor: 'bg-purple-600/20',
    title: 'Publishing Blocked',
    message: 'Publishing is not available on your current plan.',
    showUpgrade: true,
    showCredits: false,
  },
  publishProduction: {
    icon: Rocket,
    iconColor: 'text-orange-400',
    bgColor: 'bg-orange-600/20',
    title: 'Production Access Required',
    message: 'Production publishing requires a Pro or Elite plan.',
    showUpgrade: true,
    showCredits: false,
  },
  projectLimit: {
    icon: FolderPlus,
    iconColor: 'text-red-400',
    bgColor: 'bg-red-600/20',
    title: 'Project Limit Reached',
    message: 'You\'ve reached the maximum number of projects for your plan.',
    showUpgrade: true,
    showCredits: false,
  },
  publishLimit: {
    icon: Globe,
    iconColor: 'text-orange-400',
    bgColor: 'bg-orange-600/20',
    title: 'Publishing Limit Reached',
    message: 'You\'ve reached the maximum number of published projects for your plan.',
    showUpgrade: true,
    showCredits: false,
  },
  insufficientCredits: {
    icon: Zap,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-500/20',
    title: 'Insufficient Credits',
    message: 'You do not have enough credits to continue.',
    showUpgrade: false,
    showCredits: true,
  },
  teamAccess: {
    icon: Lock,
    iconColor: 'text-green-400',
    bgColor: 'bg-green-600/20',
    title: 'Team Access Required',
    message: 'Team collaboration requires an Elite plan.',
    showUpgrade: true,
    showCredits: false,
  },
};

const UpgradePaywall = () => {
  const navigate = useNavigate();
  const { upgradeModal, closeUpgradeModal } = usePlanEnforcement();
  
  const config = PAYWALL_MESSAGES[upgradeModal.type];
  
  if (!upgradeModal.isOpen || !config) return null;

  const Icon = config.icon;

  const handleUpgradePlan = () => {
    closeUpgradeModal();
    navigate('/pricing');
  };

  const handlePurchaseCredits = () => {
    closeUpgradeModal();
    navigate('/settings/billing');
  };

  const handleCancel = () => {
    closeUpgradeModal();
  };

  return (
    <Dialog open={upgradeModal.isOpen} onOpenChange={(open) => !open && closeUpgradeModal()}>
      <DialogContent className="bg-gray-900 border-gray-800 sm:max-w-md p-0 overflow-hidden">
        {/* Header with Icon */}
        <div className={`${config.bgColor} px-6 pt-8 pb-6`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-900/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Icon className={`w-7 h-7 ${config.iconColor}`} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                {config.title}
              </DialogTitle>
              <p className="text-white/70 text-sm mt-1">Upgrade Required</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <DialogDescription className="text-gray-300 text-base leading-relaxed">
            {config.message}
          </DialogDescription>

          {/* Warning for credits */}
          {config.showCredits && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-200 text-sm">
                Purchase additional credits or wait for your daily bonus to refresh.
              </p>
            </div>
          )}

          {/* Upgrade info */}
          {config.showUpgrade && (
            <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
              <p className="text-gray-400 text-sm mb-2">Unlock this feature with:</p>
              <div className="flex flex-wrap gap-2">
                {upgradeModal.type === 'export' || upgradeModal.type === 'publish' ? (
                  <>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">Creator</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">Pro</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">Elite</span>
                  </>
                ) : upgradeModal.type === 'publishProduction' ? (
                  <>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">Pro</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">Elite</span>
                  </>
                ) : upgradeModal.type === 'teamAccess' ? (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">Elite</span>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <DialogFooter className="px-6 py-4 bg-gray-800/30 border-t border-gray-800 flex flex-col sm:flex-row gap-3">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="w-full sm:w-auto text-gray-400 hover:text-white hover:bg-gray-800"
            data-testid="paywall-cancel-btn"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          
          <div className="flex gap-2 w-full sm:w-auto">
            {config.showCredits && (
              <Button
                onClick={handlePurchaseCredits}
                className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                data-testid="paywall-purchase-btn"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Purchase Credits
              </Button>
            )}
            
            {config.showUpgrade && (
              <Button
                onClick={handleUpgradePlan}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="paywall-upgrade-btn"
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePaywall;
