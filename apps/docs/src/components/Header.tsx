'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">TitanState</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/docs" className="text-gray-700 hover:text-primary-600">
              Docs
            </Link>
            <Link href="/docs/examples" className="text-gray-700 hover:text-primary-600">
              Examples
            </Link>
            <Link href="/docs/api" className="text-gray-700 hover:text-primary-600">
              API
            </Link>
            <a
              href="https://github.com/titanstate/titanstate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-primary-600"
            >
              GitHub
            </a>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

