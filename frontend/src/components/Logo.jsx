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
        {/* Back outer petals - widest spread */}
        <path
          d="M12 70 Q20 50, 50 30 Q30 55, 20 70 Q15 73, 12 70"
          fill="#6B7280"
          opacity="0.8"
        />
        <path
          d="M88 70 Q80 50, 50 30 Q70 55, 80 70 Q85 73, 88 70"
          fill="#6B7280"
          opacity="0.8"
        />
        
        {/* Second layer - slightly inside */}
        <path
          d="M20 68 Q28 48, 50 28 Q35 52, 28 68 Q23 72, 20 68"
          fill="#9CA3AF"
          opacity="0.9"
        />
        <path
          d="M80 68 Q72 48, 50 28 Q65 52, 72 68 Q77 72, 80 68"
          fill="#9CA3AF"
          opacity="0.9"
        />
        
        {/* Third layer */}
        <path
          d="M28 67 Q35 45, 50 25 Q40 50, 35 67 Q31 71, 28 67"
          fill="#D1D5DB"
        />
        <path
          d="M72 67 Q65 45, 50 25 Q60 50, 65 67 Q69 71, 72 67"
          fill="#D1D5DB"
        />
        
        {/* Fourth layer - closer to center */}
        <path
          d="M35 66 Q42 43, 50 22 Q45 48, 42 66 Q38 70, 35 66"
          fill="#E5E7EB"
        />
        <path
          d="M65 66 Q58 43, 50 22 Q55 48, 58 66 Q62 70, 65 66"
          fill="#E5E7EB"
        />
        
        {/* Inner petals */}
        <path
          d="M42 65 Q46 40, 50 20 Q48 45, 47 65 Q44 69, 42 65"
          fill="#F3F4F6"
        />
        <path
          d="M58 65 Q54 40, 50 20 Q52 45, 53 65 Q56 69, 58 65"
          fill="#F3F4F6"
        />
        
        {/* Center petal - front, brightest */}
        <path
          d="M47 64 Q48 38, 50 18 Q52 38, 53 64 Q51 68, 50 68 Q49 68, 47 64"
          fill="#FFFFFF"
        />
        
        {/* Top rounded bulb shape */}
        <ellipse
          cx="50"
          cy="23"
          rx="12"
          ry="8"
          fill="url(#bulbGradient)"
        />
        
        {/* Highlight shine */}
        <ellipse
          cx="47"
          cy="20"
          rx="4"
          ry="3"
          fill="white"
          opacity="0.6"
        />
        
        <defs>
          <linearGradient id="bulbGradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F9FAFB" />
            <stop offset="100%" stopColor="#E5E7EB" />
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
