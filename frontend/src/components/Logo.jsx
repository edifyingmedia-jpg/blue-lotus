import React from 'react';

const Logo = ({ className = '', size = 44 }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
      >
        {/* Outer petals - far left and right */}
        <ellipse
          cx="50"
          cy="55"
          rx="6"
          ry="22"
          fill="url(#lotusGradientOuter)"
          transform="rotate(-55, 50, 55)"
          opacity="0.6"
        />
        <ellipse
          cx="50"
          cy="55"
          rx="6"
          ry="22"
          fill="url(#lotusGradientOuter)"
          transform="rotate(55, 50, 55)"
          opacity="0.6"
        />
        
        {/* Middle outer petals */}
        <ellipse
          cx="50"
          cy="52"
          rx="7"
          ry="24"
          fill="url(#lotusGradientMid)"
          transform="rotate(-35, 50, 52)"
          opacity="0.75"
        />
        <ellipse
          cx="50"
          cy="52"
          rx="7"
          ry="24"
          fill="url(#lotusGradientMid)"
          transform="rotate(35, 50, 52)"
          opacity="0.75"
        />
        
        {/* Inner side petals */}
        <ellipse
          cx="50"
          cy="50"
          rx="8"
          ry="26"
          fill="url(#lotusGradientInner)"
          transform="rotate(-18, 50, 50)"
          opacity="0.85"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="8"
          ry="26"
          fill="url(#lotusGradientInner)"
          transform="rotate(18, 50, 50)"
          opacity="0.85"
        />
        
        {/* Center petal */}
        <ellipse
          cx="50"
          cy="48"
          rx="9"
          ry="28"
          fill="url(#lotusGradientCenter)"
        />
        
        {/* Inner glow/center */}
        <ellipse cx="50" cy="68" rx="12" ry="6" fill="url(#lotusBaseGlow)" opacity="0.9" />
        <circle cx="50" cy="65" r="6" fill="url(#lotusCenterGlow)" />
        
        {/* Definitions */}
        <defs>
          <linearGradient id="lotusGradientOuter" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          <linearGradient id="lotusGradientMid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="lotusGradientInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BFDBFE" />
            <stop offset="40%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="lotusGradientCenter" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DBEAFE" />
            <stop offset="30%" stopColor="#93C5FD" />
            <stop offset="70%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          <radialGradient id="lotusCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="50%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lotusBaseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.3" />
          </radialGradient>
        </defs>
      </svg>
      <span className="text-xl font-bold bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 bg-clip-text text-transparent">
        Blue Lotus
      </span>
    </div>
  );
};

export default Logo;
