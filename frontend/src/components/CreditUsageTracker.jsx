import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { 
  Zap, 
  Gift, 
  ShoppingCart, 
  Clock, 
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

const CreditUsageTracker = ({ 
  monthlyCredits = 150,
  monthlyCreditsUsed = 47,
  bonusCredits = 8,
  maxBonusCredits = 10,
  purchasedCredits = 250,
  creditsUsedToday = 12,
  avgCreditsPerGeneration = 3,
  compact = false 
}) => {
  const [timeUntilBonus, setTimeUntilBonus] = useState(null);

  // Calculate remaining credits
  const monthlyRemaining = monthlyCredits - monthlyCreditsUsed;
  const totalCredits = monthlyRemaining + bonusCredits + purchasedCredits;

  // Bonus credit refresh timer (resets at midnight or every 24 hours)
  useEffect(() => {
    const calculateTimeUntilBonus = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return { hours, minutes, seconds };
    };

    setTimeUntilBonus(calculateTimeUntilBonus());
    
    const interval = setInterval(() => {
      setTimeUntilBonus(calculateTimeUntilBonus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
    if (!time) return '--:--:--';
    return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4" data-testid="credit-tracker-compact">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm">Credits</span>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-white font-bold">{totalCredits}</span>
          </div>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"
            style={{ width: `${Math.min((totalCredits / (monthlyCredits + maxBonusCredits)) * 100, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Bonus in {formatTime(timeUntilBonus)}</span>
          <Link to="/settings/billing" className="text-blue-400 hover:text-blue-300">
            Get more
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6" data-testid="credit-tracker-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Credit Usage
        </h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-yellow-400 font-bold">{totalCredits}</span>
          <span className="text-yellow-400/70 text-sm">total</span>
        </div>
      </div>

      {/* Credit Balance Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Credit Balance</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-blue-500/20 rounded-md flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span className="text-gray-400 text-xs">Monthly</span>
            </div>
            <p className="text-xl font-bold text-white">{monthlyRemaining}</p>
            <p className="text-gray-500 text-xs">of {monthlyCredits}</p>
          </div>
          
          <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-purple-500/20 rounded-md flex items-center justify-center">
                <Gift className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span className="text-gray-400 text-xs">Bonus</span>
            </div>
            <p className="text-xl font-bold text-white">{bonusCredits}</p>
            <p className="text-gray-500 text-xs">of {maxBonusCredits}</p>
          </div>
          
          <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-green-500/20 rounded-md flex items-center justify-center">
                <ShoppingCart className="w-3.5 h-3.5 text-green-400" />
              </div>
              <span className="text-gray-400 text-xs">Purchased</span>
            </div>
            <p className="text-xl font-bold text-white">{purchasedCredits}</p>
            <p className="text-gray-500 text-xs">never expires</p>
          </div>
        </div>
      </div>

      {/* Usage Summary Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Usage Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm">Credits Used This Month</span>
            </div>
            <span className="text-white font-medium">{monthlyCreditsUsed}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm">Credits Used Today</span>
            </div>
            <span className="text-white font-medium">{creditsUsedToday}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm">Avg. Credits Per Generation</span>
            </div>
            <span className="text-white font-medium">~{avgCreditsPerGeneration}</span>
          </div>
        </div>
      </div>

      {/* Bonus Credit Timer Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Bonus Credit Timer</h3>
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">Next Bonus Refresh In</p>
                <p className="text-gray-400 text-sm">+{maxBonusCredits} credits coming</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold text-white" data-testid="bonus-timer">
                {formatTime(timeUntilBonus)}
              </p>
              <p className="text-gray-500 text-xs">hours : min : sec</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <Link to="/settings/billing">
            <Button 
              className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 hover:border-yellow-500/40"
              data-testid="purchase-credits-btn"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Purchase Credits
            </Button>
          </Link>
          
          <Link to="/settings/billing">
            <Button 
              variant="outline" 
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
              data-testid="view-billing-btn"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              View Billing
            </Button>
          </Link>
          
          <Link to="/pricing">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="upgrade-plan-btn"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreditUsageTracker;
