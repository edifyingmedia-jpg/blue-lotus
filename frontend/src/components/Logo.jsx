import React from 'react';

const Logo = ({ className = '', size = 44, showText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="/lotus-logo.gif" 
        alt="Blue Lotus" 
        style={{ width: size, height: size }}
        className="object-contain"
      />
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
