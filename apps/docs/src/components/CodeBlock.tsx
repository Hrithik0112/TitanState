'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ children, language = 'typescript', filename }: CodeBlockProps) {
  return (
    <div className="my-6">
      {filename && (
        <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm rounded-t-lg">
          {filename}
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: filename ? '0 0 0.5rem 0.5rem' : '0.5rem',
          padding: '1rem',
        }}
        showLineNumbers
      >
        {children.trim()}
      </SyntaxHighlighter>
    </div>
  );
}

