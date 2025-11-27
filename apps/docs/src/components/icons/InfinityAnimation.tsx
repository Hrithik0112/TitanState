'use client';

import React from 'react';

interface InfinityAnimationProps {
  className?: string;
}

export function InfinityAnimation({ className = '' }: InfinityAnimationProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        width="600"
        height="500"
        viewBox="0 0 600 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Enhanced gradient for infinity path */}
          <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9">
              <animate attributeName="stop-opacity" values="0.9;1;0.9" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="30%" stopColor="#818cf8" stopOpacity="0.7">
              <animate attributeName="stop-opacity" values="0.7;0.95;0.7" dur="4s" repeatCount="indefinite" begin="0.3s" />
            </stop>
            <stop offset="60%" stopColor="#a5b4fc" stopOpacity="0.5">
              <animate attributeName="stop-opacity" values="0.5;0.8;0.5" dur="4s" repeatCount="indefinite" begin="0.6s" />
            </stop>
            <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.3">
              <animate attributeName="stop-opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" begin="0.9s" />
            </stop>
          </linearGradient>
          
          {/* Glowing effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Particle gradient */}
          <radialGradient id="particleGradient">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
          </radialGradient>
        </defs>

        {/* Main infinity symbol path with glow */}
        <path
          id="infinityPath"
          d="M 150 250 Q 80 150, 150 150 Q 220 150, 300 250 Q 380 350, 450 350 Q 520 350, 450 250 Q 380 150, 300 250 Q 220 350, 150 350 Q 80 350, 150 250"
          stroke="url(#infinityGradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          opacity="0.9"
        >
          <animate attributeName="stroke-width" values="5;6;5" dur="3s" repeatCount="indefinite" />
        </path>

        {/* Secondary infinity path for depth */}
        <path
          d="M 150 250 Q 80 150, 150 150 Q 220 150, 300 250 Q 380 350, 450 350 Q 520 350, 450 250 Q 380 150, 300 250 Q 220 350, 150 350 Q 80 350, 150 250"
          stroke="#6366f1"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.2"
        />

        {/* Multiple animated particles with varying speeds */}
        <g>
          {/* Fast particle */}
          <circle r="6" fill="url(#particleGradient)" opacity="0.9">
            <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
              <mpath href="#infinityPath" />
            </animateMotion>
            <animate attributeName="r" values="5;7;5" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
          </circle>
          
          {/* Medium speed particle */}
          <circle r="5" fill="url(#particleGradient)" opacity="0.8">
            <animateMotion dur="4s" repeatCount="indefinite" begin="0.8s" rotate="auto">
              <mpath href="#infinityPath" />
            </animateMotion>
            <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" begin="0.8s" />
            <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite" begin="0.8s" />
          </circle>
          
          {/* Slow particle */}
          <circle r="5.5" fill="url(#particleGradient)" opacity="0.7">
            <animateMotion dur="5s" repeatCount="indefinite" begin="1.6s" rotate="auto">
              <mpath href="#infinityPath" />
            </animateMotion>
            <animate attributeName="r" values="4.5;6.5;4.5" dur="2.5s" repeatCount="indefinite" begin="1.6s" />
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2.5s" repeatCount="indefinite" begin="1.6s" />
          </circle>
          
          {/* Extra fast particle */}
          <circle r="4" fill="#ffffff" opacity="0.9">
            <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.4s" rotate="auto">
              <mpath href="#infinityPath" />
            </animateMotion>
            <animate attributeName="r" values="3;5;3" dur="1.2s" repeatCount="indefinite" begin="0.4s" />
          </circle>
        </g>

        {/* Enhanced state nodes with connecting lines */}
        <g>
          {/* Left node */}
          <line x1="150" y1="200" x2="150" y2="300" stroke="#6366f1" strokeWidth="1" opacity="0.2" />
          <circle cx="150" cy="250" r="12" fill="#6366f1" opacity="0.2">
            <animate attributeName="r" values="12;18;12" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="150" cy="250" r="8" fill="#6366f1" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="150" cy="250" r="4" fill="#ffffff" />
        </g>
        
        <g>
          {/* Center node */}
          <line x1="300" y1="200" x2="300" y2="300" stroke="#818cf8" strokeWidth="1" opacity="0.2" />
          <circle cx="300" cy="250" r="12" fill="#818cf8" opacity="0.2">
            <animate attributeName="r" values="12;18;12" dur="2.5s" repeatCount="indefinite" begin="0.8s" />
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2.5s" repeatCount="indefinite" begin="0.8s" />
          </circle>
          <circle cx="300" cy="250" r="8" fill="#818cf8" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2.5s" repeatCount="indefinite" begin="0.8s" />
          </circle>
          <circle cx="300" cy="250" r="4" fill="#ffffff" />
        </g>
        
        <g>
          {/* Right node */}
          <line x1="450" y1="200" x2="450" y2="300" stroke="#a5b4fc" strokeWidth="1" opacity="0.2" />
          <circle cx="450" cy="250" r="12" fill="#a5b4fc" opacity="0.2">
            <animate attributeName="r" values="12;18;12" dur="2.5s" repeatCount="indefinite" begin="1.6s" />
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2.5s" repeatCount="indefinite" begin="1.6s" />
          </circle>
          <circle cx="450" cy="250" r="8" fill="#a5b4fc" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2.5s" repeatCount="indefinite" begin="1.6s" />
          </circle>
          <circle cx="450" cy="250" r="4" fill="#ffffff" />
        </g>

        {/* Connecting lines between nodes */}
        <path
          d="M 150 250 Q 225 250, 300 250"
          stroke="#6366f1"
          strokeWidth="1.5"
          fill="none"
          opacity="0.15"
          strokeDasharray="5,5"
        >
          <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
        </path>
        <path
          d="M 300 250 Q 375 250, 450 250"
          stroke="#818cf8"
          strokeWidth="1.5"
          fill="none"
          opacity="0.15"
          strokeDasharray="5,5"
        >
          <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" begin="1s" />
        </path>
      </svg>
    </div>
  );
}
