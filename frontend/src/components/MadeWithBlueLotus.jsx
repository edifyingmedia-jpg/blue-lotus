import React from 'react';
import { Link } from 'react-router-dom';

const MadeWithBlueLotus = ({ className = '' }) => {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black/90 border border-gray-800 hover:border-blue-500/50 transition-all hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] ${className}`}
      data-testid="made-with-blue-lotus"
    >
      {/* Logo with enforced transparency */}
      <div className="relative w-5 h-5" style={{ background: 'transparent' }}>
        <div 
          className="absolute inset-0 rounded-full opacity-50 blur-sm"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
          }}
        />
        <img 
          src="/blue-lotus.png" 
          alt="Blue Lotus" 
          className="relative z-10 w-5 h-5 object-contain"
          style={{ background: 'transparent' }}
        />
      </div>
      <span className="text-[13px] font-semibold text-white opacity-90 whitespace-nowrap">
        Made with Blue Lotus
      </span>
    </Link>
  );
};

export default MadeWithBlueLotus;
