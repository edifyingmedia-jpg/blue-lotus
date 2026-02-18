import React from 'react';
import { Link } from 'react-router-dom';

const MadeWithBlueLotus = ({ className = '' }) => {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black/90 border border-gray-800 hover:border-gray-700 transition-colors ${className}`}
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
        {/* Outer petals */}
        <path d="M20 72 C22 55, 35 35, 50 18 C40 40, 32 60, 28 72 Z" fill="#71717A" />
        <path d="M80 72 C78 55, 65 35, 50 18 C60 40, 68 60, 72 72 Z" fill="#71717A" />
        {/* Middle petals */}
        <path d="M35 75 C37 52, 44 32, 50 14 C47 42, 43 60, 41 75 Z" fill="#A1A1AA" />
        <path d="M65 75 C63 52, 56 32, 50 14 C53 42, 57 60, 59 75 Z" fill="#A1A1AA" />
        {/* Center petal */}
        <path d="M46 77 C47 48, 49 28, 50 10 C51 28, 53 48, 54 77 Z" fill="#FAFAFA" />
      </svg>
      <span className="text-[13px] font-semibold text-white opacity-90 whitespace-nowrap">
        Made with Blue Lotus
      </span>
    </Link>
  );
};

export default MadeWithBlueLotus;
