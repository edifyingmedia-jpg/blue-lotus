import React from 'react';
import { features } from '../data/mock';
import { Sparkles, MousePointer2, Rocket } from 'lucide-react';

const iconMap = {
  Sparkles,
  MousePointerOff: MousePointer2, // Using MousePointer2 as alternative
  Rocket,
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-gray-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            A builder that works
            <span className="text-blue-400"> the way you think</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Skip the canvas and the clutter. Blue Lotus generates complete screens, 
            pages, flows, and data models automatically. You focus on the vision — 
            we handle the structure.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <div
                key={feature.id}
                className="group relative p-8 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {IconComponent && <IconComponent className="w-7 h-7 text-blue-400" />}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
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

export default FeaturesSection;
