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
        {/* Back outer petals - spread wide */}
        <path
          d="M15 75 C18 60, 30 45, 50 35 C35 50, 25 65, 22 75 Q18 78, 15 75"
          fill="url(#petal1)"
        />
        <path
          d="M85 75 C82 60, 70 45, 50 35 C65 50, 75 65, 78 75 Q82 78, 85 75"
          fill="url(#petal1)"
        />
        
        {/* Second layer petals */}
        <path
          d="M22 73 C25 55, 38 40, 50 30 C40 48, 32 62, 30 73 Q26 76, 22 73"
          fill="url(#petal2)"
        />
        <path
          d="M78 73 C75 55, 62 40, 50 30 C60 48, 68 62, 70 73 Q74 76, 78 73"
          fill="url(#petal2)"
        />
        
        {/* Third layer petals */}
        <path
          d="M30 72 C33 52, 42 38, 50 26 C45 45, 40 58, 38 72 Q34 75, 30 72"
          fill="url(#petal3)"
        />
        <path
          d="M70 72 C67 52, 58 38, 50 26 C55 45, 60 58, 62 72 Q66 75, 70 72"
          fill="url(#petal3)"
        />
        
        {/* Inner petals */}
        <path
          d="M38 71 C40 50, 46 36, 50 22 C48 42, 46 56, 45 71 Q42 74, 38 71"
          fill="url(#petal4)"
        />
        <path
          d="M62 71 C60 50, 54 36, 50 22 C52 42, 54 56, 55 71 Q58 74, 62 71"
          fill="url(#petal4)"
        />
        
        {/* Center front petal */}
        <path
          d="M45 70 C46 48, 49 32, 50 18 C51 32, 54 48, 55 70 Q52 73, 50 73 Q48 73, 45 70"
          fill="url(#petal5)"
        />
        
        {/* Top bulb/bud highlight */}
        <ellipse
          cx="50"
          cy="22"
          rx="8"
          ry="6"
          fill="url(#topHighlight)"
        />
        
        <defs>
          {/* Outer petals - darkest */}
          <linearGradient id="petal1" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#9CA3AF" />
            <stop offset="100%" stopColor="#6B7280" />
          </linearGradient>
          
          {/* Second layer */}
          <linearGradient id="petal2" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#D1D5DB" />
            <stop offset="100%" stopColor="#9CA3AF" />
          </linearGradient>
          
          {/* Third layer */}
          <linearGradient id="petal3" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#E5E7EB" />
            <stop offset="100%" stopColor="#D1D5DB" />
          </linearGradient>
          
          {/* Inner petals */}
          <linearGradient id="petal4" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#F3F4F6" />
            <stop offset="100%" stopColor="#E5E7EB" />
          </linearGradient>
          
          {/* Center petal - brightest */}
          <linearGradient id="petal5" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F3F4F6" />
          </linearGradient>
          
          {/* Top highlight */}
          <radialGradient id="topHighlight" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F9FAFB" stopOpacity="0" />
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
