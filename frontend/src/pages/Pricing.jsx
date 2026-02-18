import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { pricingPlans } from '../data/mock';
import { Button } from '../components/ui/button';
import { Check, HelpCircle } from 'lucide-react';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Simple, transparent
            <span className="text-blue-400"> pricing</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Start for free and scale as you grow. No hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-8 rounded-2xl transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-blue-600/20 to-gray-900/50 border-2 border-blue-500 shadow-lg shadow-blue-500/20 scale-105'
                    : 'bg-gray-900/50 border border-gray-800 hover:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl md:text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/signup">
                  <Button
                    className={`w-full h-12 font-medium ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 bg-gray-900/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'What are credits and how do they work?',
                a: 'Credits are used for AI operations like generating code, deploying apps, and using advanced features. Different operations consume different amounts of credits based on complexity.',
              },
              {
                q: 'Can I export my code?',
                a: 'Yes! All plans include code export. You own your code completely and can download it anytime to host elsewhere or continue development locally.',
              },
              {
                q: 'Do unused credits roll over?',
                a: 'Credits reset each billing cycle on paid plans. We recommend using your credits within your billing period for the best value.',
              },
              {
                q: 'Can I upgrade or downgrade my plan?',
                a: 'Absolutely! You can change your plan at any time. When upgrading, you\'ll be prorated for the remainder of your billing cycle.',
              },
              {
                q: 'Is there a free trial for paid plans?',
                a: 'Yes, Pro plans include a 14-day free trial. No credit card required to start. Enterprise plans include a custom pilot program.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-400" />
                  {faq.q}
                </h3>
                <p className="text-gray-400 mt-3 ml-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
