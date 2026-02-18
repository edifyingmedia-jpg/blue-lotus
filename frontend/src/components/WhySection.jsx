import React from 'react';
import { useNavigate } from 'react-router-dom';
import { whyBlueLotus } from '../data/mock';
import { Button } from './ui/button';
import { Check, ArrowRight, Users, Briefcase, Lightbulb } from 'lucide-react';

const WhySection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gray-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Why Blue Lotus */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-4">
              Why Blue Lotus
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              A faster way to build
              <span className="text-blue-400"> digital products</span>
            </h2>
            
            <div className="space-y-4 mb-8">
              {whyBlueLotus.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300 text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Audience Section */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              For creators, founders, and businesses
            </h3>
            <p className="text-gray-400 leading-relaxed mb-8">
              Whether you're launching a startup, building a client project, or creating 
              your first app, Blue Lotus gives you a complete, guided workflow that gets 
              you to a finished product faster.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: Lightbulb, label: 'Creators' },
                { icon: Briefcase, label: 'Founders' },
                { icon: Users, label: 'Teams' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="text-center p-4 bg-gray-800/50 rounded-xl">
                  <Icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <span className="text-gray-300 text-sm">{label}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => navigate('/signup')}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
