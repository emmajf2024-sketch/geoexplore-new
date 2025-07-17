
import React from 'react';

export const LocationMarkerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M11.54 22.35a.75.75 0 01-1.08 0l-6.75-6.75a.75.75 0 01.04-1.12l6.75-6.75a.75.75 0 011.08 0l6.75 6.75a.75.75 0 01-.04 1.12l-6.75 6.75zM12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
      clipRule="evenodd"
    />
  </svg>
);

export const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 18.75h-9a9.75 9.75 0 01-4.874-1.975l-.166-.125a2.25 2.25 0 01-.86-1.575V4.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 4.5v10.585c0 .607-.243 1.18-.659 1.575l-.166.125a9.75 9.75 0 01-4.874 1.975zM10.5 6h.008v.008h-.008V6zm3 0h.008v.008h-.008V6z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 12.75h.008v.008H12v-.008zM12 15h.008v.008H12v-.008zM12 17.25h.008v.008H12v-.008z"
    />
  </svg>
);

export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className={className}>
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
    </svg>
);
