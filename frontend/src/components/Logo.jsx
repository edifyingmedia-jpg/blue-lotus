import React from 'react';

const Logo = ({ className = '', size = 44, showText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        className="relative"
        style={{ 
          width: size, 
          height: size,
          background: 'transparent'
        }}
      >
        {/* Glow effect behind logo */}
        <div 
          className="absolute inset-0 rounded-full opacity-40 blur-md"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)',
          }}
        />
        {/* Logo image with enforced transparency */}
        <img 
          src="/blue-lotus.png" 
          alt="Blue Lotus" 
          className="relative z-10 object-contain"
          style={{ 
            width: size, 
            height: size,
            background: 'transparent',
            mixBlendMode: 'normal'
          }}
        />
      </div>
      {showText && (
        <span className="text-xl font-bold">
          <span className="text-white">Blue</span>{' '}
          <span className="text-blue-400">Lotus</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
