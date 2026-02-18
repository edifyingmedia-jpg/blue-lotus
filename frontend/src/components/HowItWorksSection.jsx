import React from 'react';
import { howItWorks } from '../data/mock';
import { MessageSquare, Layers, Wand2, Rocket } from 'lucide-react';

const stepIcons = [MessageSquare, Layers, Wand2, Rocket];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            From idea to live product
            <span className="text-blue-400"> in minutes</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((item, index) => {
            const Icon = stepIcons[index];
            return (
              <div key={item.step} className="relative">
                {/* Connector line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent" />
                )}
                
                <div className="group text-center">
                  {/* Step number with icon */}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm border border-blue-500/50">
                      {item.step}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
