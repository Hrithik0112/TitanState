'use client';

import { useEffect, useState } from 'react';

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function useHeadings() {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // Wait for content to render
    const extractHeadings = () => {
      const headingElements = Array.from(
        document.querySelectorAll('.prose h2, .prose h3')
      ) as HTMLElement[];

      const extractedHeadings: Heading[] = headingElements.map((element) => {
        // Generate ID if not present
        if (!element.id) {
          const text = element.textContent || '';
          element.id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        }

        return {
          id: element.id,
          text: element.textContent || '',
          level: parseInt(element.tagName.substring(1), 10),
        };
      });

      setHeadings(extractedHeadings);
    };

    // Extract immediately
    extractHeadings();

    // Also extract after a short delay to catch dynamically rendered content
    const timeoutId = setTimeout(extractHeadings, 100);

    // Use MutationObserver to watch for content changes
    const observer = new MutationObserver(extractHeadings);
    const proseElement = document.querySelector('.prose');
    if (proseElement) {
      observer.observe(proseElement, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return headings;
}

