import React from 'react';
import { Link } from 'react-router-dom';

const MadeWithBlueLotus = ({ className = '' }) => {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black/90 border border-gray-800 hover:border-gray-700 transition-colors ${className}`}
      data-testid="made-with-blue-lotus"
    >
      <img 
        src="/lotus-logo.gif" 
        alt="Blue Lotus" 
        className="w-4 h-4 object-contain"
      />
      <span className="text-[13px] font-semibold text-white opacity-90 whitespace-nowrap">
        Made with Blue Lotus
      </span>
    </Link>
  );
};

export default MadeWithBlueLotus;
