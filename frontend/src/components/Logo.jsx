import React from 'react';

const Logo = ({ className = '', size = 44, showText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Back outer petals - rounded cloud-like shapes */}
        <ellipse cx="25" cy="60" rx="18" ry="15" fill="#71717A" opacity="0.7" />
        <ellipse cx="75" cy="60" rx="18" ry="15" fill="#71717A" opacity="0.7" />
        
        {/* Second layer petals */}
        <ellipse cx="30" cy="55" rx="16" ry="18" fill="#9CA3AF" opacity="0.85" />
        <ellipse cx="70" cy="55" rx="16" ry="18" fill="#9CA3AF" opacity="0.85" />
        
        {/* Third layer petals - rounder */}
        <ellipse cx="35" cy="50" rx="14" ry="20" fill="#D1D5DB" />
        <ellipse cx="65" cy="50" rx="14" ry="20" fill="#D1D5DB" />
        
        {/* Inner side petals */}
        <ellipse cx="40" cy="47" rx="12" ry="22" fill="#E5E7EB" />
        <ellipse cx="60" cy="47" rx="12" ry="22" fill="#E5E7EB" />
        
        {/* Center front petal - tallest, brightest */}
        <ellipse cx="50" cy="45" rx="10" ry="25" fill="#F9FAFB" />
        
        {/* Top bulb - rounded cap */}
        <ellipse cx="50" cy="25" rx="15" ry="12" fill="url(#topBulb)" />
        
        {/* Small highlight bubbles for 3D effect */}
        <circle cx="43" cy="22" r="4" fill="white" opacity="0.7" />
        <circle cx="55" cy="28" r="3" fill="white" opacity="0.5" />
        
        {/* Side highlight on center petal */}
        <ellipse cx="46" cy="40" rx="4" ry="12" fill="white" opacity="0.4" />
        
        <defs>
          <radialGradient id="topBulb" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F3F4F6" />
            <stop offset="100%" stopColor="#E5E7EB" />
          </radialGradient>
        </defs>
      </svg>
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
