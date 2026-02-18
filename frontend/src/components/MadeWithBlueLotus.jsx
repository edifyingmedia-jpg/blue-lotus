import React from 'react';
import { Link } from 'react-router-dom';

const MadeWithBlueLotus = ({ className = '' }) => {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-900/90 border border-gray-800 hover:border-gray-700 transition-colors ${className}`}
      data-testid="made-with-blue-lotus"
    >
      {/* Mini Lotus Icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simplified lotus for small size */}
        <path
          d="M30 70 Q40 40, 50 15 Q48 50, 42 70 Z"
          fill="#9CA3AF"
        />
        <path
          d="M70 70 Q60 40, 50 15 Q52 50, 58 70 Z"
          fill="#9CA3AF"
        />
        <path
          d="M44 73 Q48 38, 50 10 Q52 38, 56 73 Z"
          fill="#E5E7EB"
        />
      </svg>
      <span className="text-sm font-medium text-gray-300 opacity-85">
        Made with Blue Lotus
      </span>
    </Link>
  );
};

export default MadeWithBlueLotus;
