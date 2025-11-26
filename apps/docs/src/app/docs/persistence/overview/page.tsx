import { CodeBlock } from '@/components/CodeBlock';

export default function PersistenceOverview() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Persistence Overview</h1>
      
      <p>
        TitanState provides automatic persistence with lazy loading, compression, and multiple
        storage drivers. Persisted atoms are automatically saved and loaded.
      </p>

      <h2>Basic Setup</h2>

      <CodeBlock language="typescript">
{`import { createStore } from '@titanstate/core';
import { IndexedDBDriver } from '@titanstate/persist';
import { DevToolsBridge } from '@titanstate/devtools';

// Create storage driver
const driver = new IndexedDBDriver({ dbName: 'myapp' });

// Create DevTools bridge
const devtools = new DevToolsBridge({ enabled: true });

// Create store with persistence
const store = createStore({
  persistenceDriver: driver,
  devtoolsBridge: devtools,
});

// Create persisted atom
const settingsAtom = store.createAtom('settings', {
  theme: 'light',
  language: 'en',
}, {
  persisted: true,
  lazyLoad: false,
});`}
      </CodeBlock>

      <h2>Lazy Loading</h2>

      <p>
        For large datasets, enable lazy loading. The atom won't be loaded from storage
        until it's accessed.
      </p>

      <CodeBlock language="typescript">
{`// Large dataset - lazy load
const largeDataAtom = store.createAtom('largeData', [], {
  persisted: true,
  lazyLoad: true, // Won't load until accessed
});

// Access triggers lazy loading
const data = await store.getAsync(largeDataAtom);`}
      </CodeBlock>

      <h2>Storage Drivers</h2>

      <p>TitanState supports multiple storage drivers:</p>

      <ul>
        <li><strong>MemoryDriver</strong> - In-memory storage (for testing)</li>
        <li><strong>IndexedDBDriver</strong> - Browser IndexedDB</li>
        <li><strong>FileSystemDriver</strong> - File System Access API</li>
        <li><strong>RemoteDriver</strong> - HTTP/S3 remote storage</li>
      </ul>

      <h2>Compression</h2>

      <CodeBlock language="typescript">
{`// Enable compression for large data
const compressedAtom = store.createAtom('data', largeData, {
  persisted: true,
  compress: true, // Automatically compressed
});`}
      </CodeBlock>

      <h2>Chunking</h2>

      <p>
        Very large datasets (10MB+) are automatically chunked into smaller pieces
        for efficient storage and retrieval.
      </p>
    </div>
  );
}

