import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { 
  Zap, 
  Gift, 
  ShoppingCart, 
  Clock, 
  ArrowDown,
  RefreshCw,
  Infinity,
  Lock,
  Ban,
  CheckCircle,
  XCircle,
  Sparkles,
  Rocket,
  Crown,
  Star,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

const deductionPriority = [
  { 
    order: 1, 
    type: 'Bonus Credits', 
    icon: Gift, 
    color: 'purple',
    description: 'Used first – refreshes daily',
    example: 'If you have 8 bonus credits, these are used before any others'
  },
  { 
    order: 2, 
    type: 'Monthly Credits', 
    icon: Zap, 
    color: 'blue',
    description: 'Used second – resets monthly',
    example: 'After bonus credits are depleted, monthly allocation is consumed'
  },
  { 
    order: 3, 
    type: 'Purchased Credits', 
    icon: ShoppingCart, 
    color: 'green',
    description: 'Used last – never expires',
    example: 'Purchased packs are preserved until bonus and monthly are exhausted'
  },
];

const planCredits = [
  { plan: 'Free', icon: Sparkles, monthly: '—', bonus: '—', starter: '20 (one-time)' },
  { plan: 'Creator', icon: Rocket, monthly: '150', bonus: '10/day', starter: '—' },
  { plan: 'Pro', icon: Crown, monthly: '400', bonus: '10/day', starter: '—' },
  { plan: 'Elite', icon: Star, monthly: '800', bonus: '10/day', starter: '—' },
];

const freeRestrictions = [
  { feature: 'Export Apps', allowed: false },
  { feature: 'Download Code', allowed: false },
  { feature: 'Publish to Staging', allowed: false },
  { feature: 'Publish to Production', allowed: false },
  { feature: 'Access Builder', allowed: true },
  { feature: 'Create Projects', allowed: true },
  { feature: 'Preview Apps', allowed: true },
];

const CreditRules = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-2xl mb-6">
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              How Credits Work
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Understand how credits are consumed, refreshed, and prioritized across all Blue Lotus plans.
            </p>
          </div>

          {/* Credit Consumption Section */}
          <section className="mb-12">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ArrowDown className="w-5 h-5 text-blue-400" />
                Credit Consumption
              </h2>
              
              <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl mb-6">
                <p className="text-gray-300">
                  <strong className="text-white">Variable Cost:</strong> Credits are consumed based on the complexity of each operation. 
                  Simple changes use fewer credits, while complex generations may use more.
                </p>
              </div>

              <h3 className="text-white font-medium mb-4">Deduction Priority</h3>
              <p className="text-gray-400 text-sm mb-4">
                When you perform an action, credits are deducted in this order:
              </p>
              
              <div className="space-y-3">
                {deductionPriority.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.order}
                      className="flex items-start gap-4 p-4 bg-gray-800/30 border border-gray-700 rounded-xl"
                    >
                      <div className={`w-10 h-10 bg-${item.color}-500/20 rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold">{item.order}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 text-${item.color}-400`} />
                          <span className="text-white font-medium">{item.type}</span>
                        </div>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                        <p className="text-gray-500 text-xs mt-1 italic">{item.example}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-200 text-sm">
                  This priority system ensures your purchased credits are preserved as long as possible.
                </p>
              </div>
            </div>
          </section>

          {/* Bonus Credits Section */}
          <section className="mb-12">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-400" />
                Bonus Credits
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-medium">Amount</span>
                  </div>
                  <p className="text-2xl font-bold text-white">10 <span className="text-gray-400 text-sm font-normal">credits/day</span></p>
                </div>
                
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-medium">Refresh Interval</span>
                  </div>
                  <p className="text-2xl font-bold text-white">24 <span className="text-gray-400 text-sm font-normal">hours</span></p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-gray-300">Bonus credits <strong className="text-white">do not roll over</strong> – unused bonus credits are lost at refresh</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Available for <strong className="text-white">Creator, Pro, and Elite</strong> plans only</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">Refreshes at <strong className="text-white">midnight UTC</strong> each day</span>
                </div>
              </div>
            </div>
          </section>

          {/* Monthly Credits Section */}
          <section className="mb-12">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                Monthly Credits
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">Resets on your <strong className="text-white">monthly billing date</strong></span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-gray-300">Monthly credits <strong className="text-white">do not roll over</strong> to the next cycle</span>
                </div>
              </div>

              {/* Credits by Plan */}
              <h3 className="text-white font-medium mb-3">Credits by Plan</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Plan</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Monthly</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Daily Bonus</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Starter</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planCredits.map((row) => {
                      const Icon = row.icon;
                      return (
                        <tr key={row.plan} className="border-b border-gray-800/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-gray-400" />
                              <span className="text-white">{row.plan}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-white font-medium">{row.monthly}</td>
                          <td className="py-3 px-4 text-white">{row.bonus}</td>
                          <td className="py-3 px-4 text-gray-400">{row.starter}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Purchased Credits Section */}
          <section className="mb-12">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-400" />
                Purchased Credits
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Infinity className="w-4 h-4 text-green-400" />
                    <span className="text-white font-medium">Expiration</span>
                  </div>
                  <p className="text-2xl font-bold text-green-400">Never</p>
                  <p className="text-gray-400 text-sm">Credits last forever</p>
                </div>
                
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDown className="w-4 h-4 text-green-400" />
                    <span className="text-white font-medium">Priority</span>
                  </div>
                  <p className="text-2xl font-bold text-white">Used Last</p>
                  <p className="text-gray-400 text-sm">Preserved as long as possible</p>
                </div>
              </div>

              <div className="p-4 bg-gray-800/30 rounded-xl">
                <h4 className="text-white font-medium mb-3">Available Credit Packs</h4>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { credits: 100, price: '$4.99' },
                    { credits: 250, price: '$9.99' },
                    { credits: 600, price: '$19.99' },
                    { credits: 1500, price: '$39.99' },
                  ].map((pack) => (
                    <div key={pack.credits} className="text-center p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-white font-bold">{pack.credits}</p>
                      <p className="text-gray-400 text-sm">{pack.price}</p>
                    </div>
                  ))}
                </div>
                <Link to="/settings/billing" className="mt-4 inline-block">
                  <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                    Purchase Credits
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Free Tier Restrictions Section */}
          <section className="mb-12">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-400" />
                Free Tier Restrictions
              </h2>
              
              <p className="text-gray-400 mb-6">
                Free users have limited functionality. Upgrade to a paid plan to unlock all features.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {freeRestrictions.map((item) => (
                  <div 
                    key={item.feature}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      item.allowed 
                        ? 'bg-green-500/10 border border-green-500/20' 
                        : 'bg-red-500/10 border border-red-500/20'
                    }`}
                  >
                    {item.allowed ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <Ban className="w-5 h-5 text-red-400 flex-shrink-0" />
                    )}
                    <span className={item.allowed ? 'text-green-300' : 'text-red-300'}>
                      {item.feature}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/pricing" className="mt-6 inline-block">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  View Pricing Plans
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </section>

          {/* Quick Summary */}
          <section>
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Summary</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  Credits are deducted in order: Bonus → Monthly → Purchased
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  Bonus credits (10/day) refresh every 24 hours and don't roll over
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  Monthly credits reset on your billing date and don't roll over
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  Purchased credits never expire and are always used last
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  Free tier users cannot export, download, or publish projects
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreditRules;
