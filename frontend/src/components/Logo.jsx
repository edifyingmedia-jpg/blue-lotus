import React from 'react';

const Logo = ({ className = '', size = 40 }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Lotus petals - outer layer */}
        <ellipse
          cx="50"
          cy="65"
          rx="8"
          ry="25"
          fill="url(#blueGradient)"
          transform="rotate(-45, 50, 50)"
          opacity="0.7"
        />
        <ellipse
          cx="50"
          cy="65"
          rx="8"
          ry="25"
          fill="url(#blueGradient)"
          transform="rotate(45, 50, 50)"
          opacity="0.7"
        />
        <ellipse
          cx="50"
          cy="65"
          rx="8"
          ry="25"
          fill="url(#blueGradient)"
          transform="rotate(-25, 50, 50)"
          opacity="0.8"
        />
        <ellipse
          cx="50"
          cy="65"
          rx="8"
          ry="25"
          fill="url(#blueGradient)"
          transform="rotate(25, 50, 50)"
          opacity="0.8"
        />
        {/* Center petal */}
        <ellipse
          cx="50"
          cy="60"
          rx="7"
          ry="22"
          fill="url(#blueGradientLight)"
        />
        {/* Inner glow */}
        <circle cx="50" cy="70" r="8" fill="url(#centerGlow)" />
        
        {/* Definitions */}
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="blueGradientLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="50%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#BFDBFE" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
        Emergent
      </span>
    </div>
  );
};

export default Logo;
