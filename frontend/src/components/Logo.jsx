import React from 'react';

const Logo = ({ className = '', size = 44, showText = true, animate = true }) => {
  // Ensure minimum size of 24px as per brand guidelines
  const logoSize = Math.max(size, 24);
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        className="relative"
        style={{ 
          width: logoSize, 
          height: logoSize,
          background: 'transparent',
          padding: '2px' // Minimum clear space
        }}
      >
        {/* Logo image with brand animation */}
        <img 
          src="/blue-lotus.png" 
          alt="Blue Lotus" 
          className={`relative z-10 object-contain ${animate ? 'lotus-logo lotus-float' : ''}`}
          style={{ 
            width: logoSize, 
            height: logoSize,
            background: 'transparent',
          }}
        />
      </div>
      {showText && (
        <span className="text-xl font-semibold tracking-tight">
          <span className="text-white">Blue</span>{' '}
          <span style={{ color: '#4CC3FF' }}>Lotus</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
