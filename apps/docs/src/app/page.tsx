import Link from 'next/link';

export default function Home() {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          TitanState
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The next-generation scalable state management engine
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/docs/getting-started"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/docs"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Documentation
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">🚀 Performance</h3>
          <p className="text-gray-600">
            Handle 100MB+ datasets with lazy loading, compression, and efficient memory management.
          </p>
        </div>
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">⚡ React Integration</h3>
          <p className="text-gray-600">
            Seamless React hooks with automatic re-renders and concurrent rendering support.
          </p>
        </div>
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">🔧 Developer Experience</h3>
          <p className="text-gray-600">
            Time-travel debugging, DevTools integration, and TypeScript-first design.
          </p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6">Key Features</h2>
        <ul className="space-y-4">
          <li className="flex items-start">
            <span className="text-primary-600 mr-3">✓</span>
            <div>
              <strong>Atom-based Architecture</strong> - Fine-grained reactivity with structural sharing
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-3">✓</span>
            <div>
              <strong>Automatic Persistence</strong> - Lazy loading, compression, and multiple storage drivers
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-3">✓</span>
            <div>
              <strong>Web Worker Support</strong> - Offload heavy computations to keep UI responsive
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-3">✓</span>
            <div>
              <strong>Query Client</strong> - Server-state management with caching and refetching
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-3">✓</span>
            <div>
              <strong>Time-Travel Debugging</strong> - Event-based debugging with state reconstruction
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

