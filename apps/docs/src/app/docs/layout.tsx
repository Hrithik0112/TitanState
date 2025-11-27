'use client';

import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { TableOfContents } from '@/components/TableOfContents';
import { useHeadings } from '@/hooks/useHeadings';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headings = useHeadings();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 xl:mr-64">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="prose prose-gray max-w-none">
              {children}
            </div>
          </div>
        </main>
        <TableOfContents headings={headings} />
      </div>
    </div>
  );
}

