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
        {/* Back petals - outermost layer */}
        <path
          d="M25 65 Q30 35, 50 20 Q45 45, 35 65 Z"
          fill="#6B7280"
          opacity="0.6"
        />
        <path
          d="M75 65 Q70 35, 50 20 Q55 45, 65 65 Z"
          fill="#6B7280"
          opacity="0.6"
        />
        
        {/* Second layer petals */}
        <path
          d="M30 68 Q38 38, 50 18 Q46 48, 38 68 Z"
          fill="#9CA3AF"
          opacity="0.75"
        />
        <path
          d="M70 68 Q62 38, 50 18 Q54 48, 62 68 Z"
          fill="#9CA3AF"
          opacity="0.75"
        />
        
        {/* Third layer petals */}
        <path
          d="M35 70 Q42 38, 50 15 Q48 48, 42 70 Z"
          fill="#D1D5DB"
          opacity="0.85"
        />
        <path
          d="M65 70 Q58 38, 50 15 Q52 48, 58 70 Z"
          fill="#D1D5DB"
          opacity="0.85"
        />
        
        {/* Inner petals */}
        <path
          d="M40 72 Q46 40, 50 12 Q50 50, 46 72 Z"
          fill="#E5E7EB"
          opacity="0.9"
        />
        <path
          d="M60 72 Q54 40, 50 12 Q50 50, 54 72 Z"
          fill="#E5E7EB"
          opacity="0.9"
        />
        
        {/* Center petal - front and brightest */}
        <path
          d="M44 73 Q48 38, 50 10 Q52 38, 56 73 Z"
          fill="#F9FAFB"
        />
        
        {/* Highlight on center petal */}
        <path
          d="M48 50 Q49 30, 50 18 Q51 30, 52 50 Z"
          fill="white"
          opacity="0.8"
        />
        
        {/* Base/stem area */}
        <ellipse
          cx="50"
          cy="75"
          rx="15"
          ry="5"
          fill="url(#baseGradient)"
          opacity="0.7"
        />
        
        <defs>
          <linearGradient id="baseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4B5563" stopOpacity="0" />
            <stop offset="50%" stopColor="#6B7280" />
            <stop offset="100%" stopColor="#4B5563" stopOpacity="0" />
          </linearGradient>
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
