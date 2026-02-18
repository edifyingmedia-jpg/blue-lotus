import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { 
  Check, 
  X,
  HelpCircle, 
  Zap, 
  Sparkles,
  Rocket,
  Crown,
  Star,
  ChevronRight
} from 'lucide-react';

const pricingTiers = [
  {
    id: 'free',
    name: 'Free',
    priceDisplay: '$0 / month',
    highlight: false,
    icon: Sparkles,
    features: [
      '20 starter credits (one-time)',
      'Access to builder',
      'Unlimited projects',
      'Preview only',
      'No exporting or downloading',
      'No publishing',
    ],
    ctaLabel: 'Get Started',
  },
  {
    id: 'creator',
    name: 'Creator',
    priceDisplay: '$9.99 / month',
    highlight: true,
    icon: Rocket,
    features: [
      '150 monthly credits',
      '10 bonus credits every 24 hours',
      'Export apps and websites',
      'Publish to staging',
      'Basic templates',
      'Basic support',
    ],
    ctaLabel: 'Choose Creator',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceDisplay: '$19.99 / month',
    highlight: false,
    icon: Crown,
    features: [
      '400 monthly credits',
      '10 bonus credits every 24 hours',
      'Publish to production',
      'Advanced templates',
      'Priority generation speed',
      'Basic analytics',
      'Remove Blue Lotus branding',
    ],
    ctaLabel: 'Choose Pro',
  },
  {
    id: 'elite',
    name: 'Elite',
    priceDisplay: '$29.99 / month',
    highlight: false,
    icon: Star,
    features: [
      '800 monthly credits',
      '10 bonus credits every 24 hours',
      'Unlimited publishing',
      'Team access (1–3 seats)',
      'Premium templates',
      'Priority support',
      'Early access to new features',
    ],
    ctaLabel: 'Choose Elite',
  },
];

const creditPacks = [
  { name: '100 Credits', priceDisplay: '$4.99', credits: 100 },
  { name: '250 Credits', priceDisplay: '$9.99', credits: 250 },
  { name: '600 Credits', priceDisplay: '$19.99', credits: 600 },
  { name: '1500 Credits', priceDisplay: '$39.99', credits: 1500 },
];

const creditRules = [
  'Monthly credits reset every billing cycle.',
  'Bonus credits refresh every 24 hours.',
  'Bonus credits do not roll over.',
  'Purchased credits never expire.',
  'Free users cannot export or download projects.',
];

const comparisonTable = {
  columns: ['Feature', 'Free', 'Creator', 'Pro', 'Elite'],
  rows: [
    { feature: 'Monthly Price', values: ['$0', '$9.99', '$19.99', '$29.99'] },
    { feature: 'Starter Credits', values: ['20 (one-time)', '—', '—', '—'] },
    { feature: 'Monthly Credits', values: ['0', '150', '400', '800'] },
    { feature: 'Daily Bonus Credits', values: ['0', '10', '10', '10'] },
    { feature: 'Bonus Rollovers', values: ['No', 'No', 'No', 'No'] },
    { feature: 'Export / Download', values: ['No', 'Yes', 'Yes', 'Yes'] },
    { feature: 'Publish to Staging', values: ['No', 'Yes', 'Yes', 'Yes'] },
    { feature: 'Publish to Production', values: ['No', 'No', 'Yes', 'Yes'] },
    { feature: 'Templates', values: ['Basic', 'Basic', 'Advanced', 'Premium'] },
    { feature: 'Support Level', values: ['Community', 'Basic', 'Priority', 'Priority+'] },
    { feature: 'Team Access', values: ['No', 'No', 'No', '1–3 seats'] },
  ],
};

const faqItems = [
  {
    question: 'Do credits roll over?',
    answer: 'Monthly and bonus credits do not roll over. Purchased credits never expire.',
  },
  {
    question: 'Can I upgrade or downgrade anytime?',
    answer: 'Yes. Changes take effect on your next billing cycle.',
  },
  {
    question: 'Can free users export projects?',
    answer: 'No. Exporting requires a paid plan.',
  },
  {
    question: 'What happens if I run out of credits?',
    answer: 'You can purchase additional credit packs at any time.',
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Pricing
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Simple, affordable plans designed for creators at every level.
          </p>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Choose Your Plan
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier) => {
              const TierIcon = tier.icon;
              return (
                <div
                  key={tier.id}
                  className={`relative p-6 rounded-2xl transition-all duration-300 flex flex-col ${
                    tier.highlight
                      ? 'bg-gradient-to-b from-blue-600/20 to-gray-900/50 border-2 border-blue-500 shadow-lg shadow-blue-500/20 lg:scale-105 lg:-my-4'
                      : 'bg-gray-900/50 border border-gray-800 hover:border-gray-700'
                  }`}
                  data-testid={`pricing-tier-${tier.id}`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full whitespace-nowrap">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tier.highlight ? 'bg-blue-600/30' : 'bg-gray-800'
                      }`}>
                        <TierIcon className={`w-5 h-5 ${tier.highlight ? 'text-blue-400' : 'text-gray-400'}`} />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {tier.priceDisplay}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6 flex-1">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          tier.highlight ? 'bg-blue-500/20' : 'bg-gray-700/50'
                        }`}>
                          <Check className={`w-3 h-3 ${tier.highlight ? 'text-blue-400' : 'text-gray-400'}`} />
                        </div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link to={tier.id === 'free' ? '/signup' : `/checkout?plan=${tier.id}`} className="mt-auto">
                    <Button
                      className={`w-full h-11 font-medium ${
                        tier.highlight
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                      }`}
                      data-testid={`pricing-cta-${tier.id}`}
                    >
                      {tier.ctaLabel}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Compare Plans
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="pricing-comparison-table">
              {/* Header */}
              <thead>
                <tr className="border-b border-gray-800">
                  {comparisonTable.columns.map((col, index) => (
                    <th 
                      key={index}
                      className={`py-4 px-4 text-left ${
                        index === 0 
                          ? 'text-gray-400 font-medium' 
                          : index === 2 
                            ? 'text-blue-400 font-semibold bg-blue-600/5' 
                            : 'text-white font-semibold'
                      }`}
                    >
                      {col}
                      {index === 2 && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                          Popular
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              
              {/* Body */}
              <tbody>
                {comparisonTable.rows.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors"
                  >
                    <td className="py-4 px-4 text-gray-400 text-sm">
                      {row.feature}
                    </td>
                    {row.values.map((value, colIndex) => (
                      <td 
                        key={colIndex}
                        className={`py-4 px-4 text-sm ${
                          colIndex === 1 ? 'bg-blue-600/5' : ''
                        }`}
                      >
                        {value === 'Yes' ? (
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-green-400" />
                          </div>
                        ) : value === 'No' ? (
                          <div className="w-6 h-6 rounded-full bg-gray-700/50 flex items-center justify-center">
                            <X className="w-3.5 h-3.5 text-gray-500" />
                          </div>
                        ) : (
                          <span className={`${
                            colIndex === 1 ? 'text-blue-400 font-medium' : 'text-white'
                          }`}>
                            {value}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Credit Add-ons Section */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">
              Need More Credits?
            </h2>
            <p className="text-gray-400">
              Purchase additional credits anytime. Purchased credits never expire.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {creditPacks.map((pack, index) => (
              <div 
                key={index}
                className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-blue-500/30 transition-all group cursor-pointer"
                data-testid={`credit-pack-${pack.credits}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                    <Zap className="w-5 h-5 text-yellow-500" />
                  </div>
                  <span className="text-lg font-semibold text-white">{pack.name}</span>
                </div>
                <p className="text-2xl font-bold text-white">{pack.priceDisplay}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit Rules Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6 text-blue-400" />
              How Credits Work
            </h2>
            <ul className="space-y-4">
              {creditRules.map((rule, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span className="text-gray-300">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div 
                key={index} 
                className="bg-gray-900 border border-gray-800 rounded-xl p-6"
                data-testid={`faq-item-${index}`}
              >
                <h3 className="text-white font-medium flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-400 mt-3 ml-8">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start building?
          </h2>
          <p className="text-gray-400 mb-8">
            Get started for free with 20 credits — no credit card required.
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
