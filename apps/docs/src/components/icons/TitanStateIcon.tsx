import React from 'react';

interface TitanStateIconProps {
  className?: string;
  size?: number;
}

export function TitanStateIcon({ className = '', size = 24 }: TitanStateIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Atom structure representing state management */}
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      <ellipse cx="12" cy="12" rx="3" ry="8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="3" ry="8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" transform="rotate(-60 12 12)" />
    </svg>
  );
}

