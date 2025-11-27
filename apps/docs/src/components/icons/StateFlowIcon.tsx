import React from 'react';

interface StateFlowIconProps {
  className?: string;
  size?: number;
}

export function StateFlowIcon({ className = '', size = 24 }: StateFlowIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* State flow representation */}
      <circle cx="6" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="6" r="2" fill="currentColor" />
      <circle cx="18" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="18" r="2" fill="currentColor" />
      <path
        d="M 8 12 L 10 8 M 14 8 L 16 12 M 16 12 L 14 16 M 10 16 L 8 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

