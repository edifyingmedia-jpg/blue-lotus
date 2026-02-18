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
        {/* Outer left petal */}
        <path
          d="M20 72 C22 55, 35 35, 50 18 C40 40, 32 60, 28 72 Z"
          fill="#71717A"
        />
        
        {/* Outer right petal */}
        <path
          d="M80 72 C78 55, 65 35, 50 18 C60 40, 68 60, 72 72 Z"
          fill="#71717A"
        />
        
        {/* Second left petal */}
        <path
          d="M28 74 C30 55, 40 35, 50 16 C44 42, 38 60, 35 74 Z"
          fill="#A1A1AA"
        />
        
        {/* Second right petal */}
        <path
          d="M72 74 C70 55, 60 35, 50 16 C56 42, 62 60, 65 74 Z"
          fill="#A1A1AA"
        />
        
        {/* Third left petal */}
        <path
          d="M35 75 C37 52, 44 32, 50 14 C47 42, 43 60, 41 75 Z"
          fill="#D4D4D8"
        />
        
        {/* Third right petal */}
        <path
          d="M65 75 C63 52, 56 32, 50 14 C53 42, 57 60, 59 75 Z"
          fill="#D4D4D8"
        />
        
        {/* Inner left petal */}
        <path
          d="M41 76 C42 50, 47 30, 50 12 C49 40, 47 58, 46 76 Z"
          fill="#E4E4E7"
        />
        
        {/* Inner right petal */}
        <path
          d="M59 76 C58 50, 53 30, 50 12 C51 40, 53 58, 54 76 Z"
          fill="#E4E4E7"
        />
        
        {/* Center petal - brightest */}
        <path
          d="M46 77 C47 48, 49 28, 50 10 C51 28, 53 48, 54 77 Z"
          fill="#FAFAFA"
        />
        
        {/* Center highlight */}
        <path
          d="M49 55 C49.5 40, 50 25, 50 15 C50 25, 50.5 40, 51 55 Z"
          fill="white"
        />
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
