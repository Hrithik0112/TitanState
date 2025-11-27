'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { name: 'Introduction', href: '/docs/getting-started' },
      { name: 'Installation', href: '/docs/getting-started/installation' },
      { name: 'Quick Start', href: '/docs/getting-started/quick-start' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { name: 'Atoms', href: '/docs/core-concepts/atoms' },
      { name: 'Store', href: '/docs/core-concepts/store' },
      { name: 'Subscriptions', href: '/docs/core-concepts/subscriptions' },
      { name: 'Transactions', href: '/docs/core-concepts/transactions' },
    ],
  },
  {
    title: 'React Integration',
    items: [
      { name: 'Setup', href: '/docs/react/setup' },
      { name: 'Hooks', href: '/docs/react/hooks' },
      { name: 'Best Practices', href: '/docs/react/best-practices' },
    ],
  },
  {
    title: 'Persistence',
    items: [
      { name: 'Overview', href: '/docs/persistence/overview' },
      { name: 'Drivers', href: '/docs/persistence/drivers' },
      { name: 'Lazy Loading', href: '/docs/persistence/lazy-loading' },
      { name: 'Compression', href: '/docs/persistence/compression' },
    ],
  },
  {
    title: 'Query Client',
    items: [
      { name: 'Overview', href: '/docs/query/overview' },
      { name: 'useQuery', href: '/docs/query/use-query' },
      { name: 'useMutation', href: '/docs/query/use-mutation' },
      { name: 'Caching', href: '/docs/query/caching' },
    ],
  },
  {
    title: 'Workers',
    items: [
      { name: 'Overview', href: '/docs/workers/overview' },
      { name: 'Setup', href: '/docs/workers/setup' },
      { name: 'Reducers', href: '/docs/workers/reducers' },
    ],
  },
  {
    title: 'DevTools',
    items: [
      { name: 'Overview', href: '/docs/devtools/overview' },
      { name: 'Extension', href: '/docs/devtools/extension' },
      { name: 'Time Travel', href: '/docs/devtools/time-travel' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { name: 'Performance', href: '/docs/guides/performance' },
      { name: 'Migration from RTK', href: '/docs/guides/migration-rtk' },
      { name: 'Best Practices', href: '/docs/guides/best-practices' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { name: 'Core API', href: '/docs/api/core' },
      { name: 'React API', href: '/docs/api/react' },
      { name: 'Persistence API', href: '/docs/api/persistence' },
      { name: 'Query API', href: '/docs/api/query' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(navigation.map((section) => section.title))
  );

  const toggleSection = (title: string) => {
    const newOpen = new Set(openSections);
    if (newOpen.has(title)) {
      newOpen.delete(title);
    } else {
      newOpen.add(title);
    }
    setOpenSections(newOpen);
  };

  return (
    <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 border-r border-gray-200 bg-white overflow-y-auto z-10">
      <nav className="p-6">
        {navigation.map((section) => (
          <div key={section.title} className="mb-8">
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 hover:text-gray-900 transition-colors"
            >
              <span>{section.title}</span>
              <svg
                className={`h-3 w-3 transition-transform ${
                  openSections.has(section.title) ? 'rotate-90' : ''
                }`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {openSections.has(section.title) && (
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`block px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                          isActive
                            ? 'bg-gray-100 text-gray-900 font-medium shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:translate-x-1'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

