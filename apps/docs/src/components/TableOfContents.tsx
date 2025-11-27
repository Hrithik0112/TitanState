'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-120px 0px -66%',
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="hidden xl:block fixed right-0 top-16 bottom-0 w-64 border-l border-gray-200 bg-white overflow-y-auto z-10">
      <nav className="p-6">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          On this page
        </div>
        <ul className="space-y-2">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            const indent = heading.level === 3 ? 'pl-4' : '';
            
            return (
              <li key={heading.id} className={indent}>
                <a
                  href={`#${heading.id}`}
                  className={`block py-1.5 text-sm transition-all duration-200 ${
                    isActive
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(heading.id);
                    if (element) {
                      const offset = 100;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;

                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth',
                      });
                    }
                  }}
                >
                  <span className={isActive ? 'border-l-2 border-gray-900 pl-3 block' : 'pl-3'}>
                    {heading.text}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

