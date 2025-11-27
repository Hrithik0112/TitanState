'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TitanStateIcon } from '@/components/icons';

export function Header() {
  const pathname = usePathname();
  const isDocs = pathname?.startsWith('/docs');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <TitanStateIcon size={28} className="text-indigo-600 group-hover:text-indigo-700 transition-colors" />
            <span className="text-xl font-bold text-gray-900">TitanState</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/docs" 
              className={`text-sm font-medium transition-all duration-200 relative ${
                isDocs 
                  ? 'text-gray-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900' 
                  : 'text-gray-600 hover:text-gray-900 hover:scale-105'
              }`}
            >
              Docs
            </Link>
            <a
              href="https://github.com/titanstate/titanstate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-105"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

