import React from 'react';
import { Link } from 'react-router-dom';

const MadeWithBlueLotus = ({ className = '' }) => {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${className}`}
      style={{
        background: 'rgba(2, 11, 20, 0.95)',
        border: '1px solid #003A66',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#4CC3FF';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(76, 195, 255, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#003A66';
        e.currentTarget.style.boxShadow = 'none';
      }}
      data-testid="made-with-blue-lotus"
    >
      {/* Logo with enforced transparency */}
      <div className="relative" style={{ width: 20, height: 20, background: 'transparent' }}>
        <img 
          src="/blue-lotus.png" 
          alt="Blue Lotus" 
          className="w-5 h-5 object-contain lotus-logo"
          style={{ background: 'transparent' }}
        />
      </div>
      <span 
        className="text-sm font-medium whitespace-nowrap"
        style={{ color: '#7FDBFF' }}
      >
        Made with Blue Lotus
      </span>
    </Link>
  );
};

export default MadeWithBlueLotus;
