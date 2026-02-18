import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { pricingPlans, creditAddons } from '../data/mock';
import { Button } from '../components/ui/button';
import { 
  Check, 
  X, 
  HelpCircle, 
  Zap, 
  Gift, 
  Clock, 
  Download,
  Sparkles,
  Crown,
  Rocket,
  Star
} from 'lucide-react';

const tierIcons = {
  free: Sparkles,
  creator: Rocket,
  pro: Crown,
  elite: Star,
};

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const getPrice = (price) => {
    if (price === 0) return 'Free';
    if (billingCycle === 'yearly') {
      return `$${(price * 0.8).toFixed(2)}`;
    }
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-6">
            <Zap className="w-4 h-4" />
            Credit-based pricing for maximum flexibility
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Choose your
            <span className="text-blue-400"> plan</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Start for free with 20 credits. Upgrade anytime to unlock more features and credits.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 p-1 bg-gray-900 border border-gray-800 rounded-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'monthly' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                billingCycle === 'yearly' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan) => {
              const TierIcon = tierIcons[plan.id] || Sparkles;
              return (
                <div
                  key={plan.id}
                  className={`relative p-6 rounded-2xl transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-b from-blue-600/20 to-gray-900/50 border-2 border-blue-500 shadow-lg shadow-blue-500/20 lg:scale-105 lg:-my-4'
                      : 'bg-gray-900/50 border border-gray-800 hover:border-gray-700'
                  }`}
                  data-testid={`pricing-plan-${plan.id}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        plan.popular ? 'bg-blue-600/30' : 'bg-gray-800'
                      }`}>
                        <TierIcon className={`w-5 h-5 ${plan.popular ? 'text-blue-400' : 'text-gray-400'}`} />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl md:text-4xl font-bold text-white">
                        {getPrice(plan.price)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-400 ml-1 text-sm">{plan.period}</span>
                      )}
                    </div>
                  </div>

                  {/* Credits Info */}
                  <div className="space-y-3 mb-6 p-4 bg-gray-800/30 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        Monthly Credits
                      </span>
                      <span className="text-white font-medium">
                        {plan.monthlyCredits || '—'}
                      </span>
                    </div>
                    {plan.starterCredits && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm flex items-center gap-2">
                          <Gift className="w-4 h-4 text-purple-400" />
                          Starter Credits
                        </span>
                        <span className="text-white font-medium">{plan.starterCredits}</span>
                      </div>
                    )}
                    {plan.dailyBonusCredits > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-400" />
                          Daily Bonus
                        </span>
                        <span className="text-white font-medium">+{plan.dailyBonusCredits}/day</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm flex items-center gap-2">
                        <Download className="w-4 h-4 text-blue-400" />
                        Export
                      </span>
                      {plan.exportAllowed ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-blue-400" />
                        </div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/signup">
                    <Button
                      className={`w-full h-11 font-medium ${
                        plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                      }`}
                      data-testid={`pricing-cta-${plan.id}`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Credit Add-ons */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need more credits?
            </h2>
            <p className="text-gray-400">
              Purchase credit packs anytime. Purchased credits never expire.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {creditAddons.map((addon) => (
              <div 
                key={addon.id}
                className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-blue-500/30 transition-all group"
                data-testid={`credit-addon-${addon.id}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-yellow-500" />
                  </div>
                  <span className="text-2xl font-bold text-white">{addon.credits}</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">credits</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-white">${addon.price}</span>
                  <span className="text-xs text-gray-500">
                    ${(addon.price / addon.credits * 100).toFixed(1)}¢/credit
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit Rules */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                How Credits Work
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  Monthly credits reset at the start of each billing cycle
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  Daily bonus credits refresh every 24 hours
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  Bonus credits do not roll over to the next day
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  Purchased credit packs never expire
                </li>
              </ul>
            </div>

            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-400" />
                Free Tier Details
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  20 starter credits to explore the platform
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  Unlimited projects with full builder access
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  Preview your apps and websites in the builder
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  Upgrade anytime to export and publish
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'What are credits used for?',
                a: 'Credits are consumed when you use AI to generate screens, modify layouts, create data models, or build application logic. Different operations use different amounts based on complexity.',
              },
              {
                q: 'Can I export my code on the Free plan?',
                a: 'No, exporting and downloading code requires a paid plan (Creator or above). Free users can build and preview unlimited projects but cannot export or publish them.',
              },
              {
                q: 'Do daily bonus credits stack?',
                a: 'No, daily bonus credits refresh every 24 hours and do not roll over. Use them or lose them! Monthly credits also reset each billing cycle.',
              },
              {
                q: 'Do purchased credit packs expire?',
                a: 'No! Credit packs you purchase never expire. They remain in your account until you use them, even if you change or cancel your subscription.',
              },
              {
                q: 'Can I upgrade or downgrade anytime?',
                a: 'Yes! You can change your plan at any time. Upgrades take effect immediately with prorated charges. Downgrades apply at the next billing cycle.',
              },
              {
                q: 'What happens if I run out of credits?',
                a: 'You can purchase additional credit packs anytime, or wait for your daily bonus (paid plans) or monthly reset. Your projects remain accessible.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-gray-400 mt-3 ml-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start building?
          </h2>
          <p className="text-gray-400 mb-8">
            Get 20 free credits and start creating your first app in minutes.
          </p>
          <Link to="/signup">
            <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium">
              Get Started Free
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
