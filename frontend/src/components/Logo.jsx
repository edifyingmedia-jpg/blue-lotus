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
        className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
      >
        {/* Back row petals - outermost */}
        <ellipse
          cx="50"
          cy="58"
          rx="5"
          ry="18"
          fill="url(#petalBack)"
          transform="rotate(-60, 50, 58)"
        />
        <ellipse
          cx="50"
          cy="58"
          rx="5"
          ry="18"
          fill="url(#petalBack)"
          transform="rotate(60, 50, 58)"
        />
        
        {/* Second row petals */}
        <ellipse
          cx="50"
          cy="55"
          rx="6"
          ry="22"
          fill="url(#petalMidOuter)"
          transform="rotate(-45, 50, 55)"
        />
        <ellipse
          cx="50"
          cy="55"
          rx="6"
          ry="22"
          fill="url(#petalMidOuter)"
          transform="rotate(45, 50, 55)"
        />
        
        {/* Third row petals */}
        <ellipse
          cx="50"
          cy="52"
          rx="7"
          ry="26"
          fill="url(#petalMid)"
          transform="rotate(-28, 50, 52)"
        />
        <ellipse
          cx="50"
          cy="52"
          rx="7"
          ry="26"
          fill="url(#petalMid)"
          transform="rotate(28, 50, 52)"
        />
        
        {/* Inner side petals */}
        <ellipse
          cx="50"
          cy="50"
          rx="8"
          ry="30"
          fill="url(#petalInner)"
          transform="rotate(-14, 50, 50)"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="8"
          ry="30"
          fill="url(#petalInner)"
          transform="rotate(14, 50, 50)"
        />
        
        {/* Center petal - front */}
        <ellipse
          cx="50"
          cy="47"
          rx="9"
          ry="33"
          fill="url(#petalCenter)"
        />
        
        {/* Highlight on center petal */}
        <ellipse
          cx="50"
          cy="38"
          rx="4"
          ry="12"
          fill="url(#petalHighlight)"
          opacity="0.6"
        />
        
        {/* Base glow */}
        <ellipse 
          cx="50" 
          cy="75" 
          rx="18" 
          ry="8" 
          fill="url(#baseGlow)" 
          opacity="0.5" 
        />
        
        {/* Definitions */}
        <defs>
          {/* Back petals - darker/more transparent */}
          <linearGradient id="petalBack" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#6B7280" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4B5563" stopOpacity="0.5" />
          </linearGradient>
          
          {/* Mid outer petals */}
          <linearGradient id="petalMidOuter" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D1D5DB" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#9CA3AF" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#6B7280" stopOpacity="0.6" />
          </linearGradient>
          
          {/* Mid petals */}
          <linearGradient id="petalMid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E5E7EB" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#D1D5DB" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#9CA3AF" stopOpacity="0.7" />
          </linearGradient>
          
          {/* Inner petals */}
          <linearGradient id="petalInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F3F4F6" />
            <stop offset="30%" stopColor="#E5E7EB" />
            <stop offset="70%" stopColor="#D1D5DB" />
            <stop offset="100%" stopColor="#9CA3AF" stopOpacity="0.8" />
          </linearGradient>
          
          {/* Center petal - brightest */}
          <linearGradient id="petalCenter" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="20%" stopColor="#F9FAFB" />
            <stop offset="50%" stopColor="#F3F4F6" />
            <stop offset="80%" stopColor="#E5E7EB" />
            <stop offset="100%" stopColor="#D1D5DB" stopOpacity="0.9" />
          </linearGradient>
          
          {/* Highlight */}
          <linearGradient id="petalHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          
          {/* Base glow */}
          <radialGradient id="baseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
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
