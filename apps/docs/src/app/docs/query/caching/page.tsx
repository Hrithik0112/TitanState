import { CodeBlock } from '@/components/CodeBlock';

export default function Caching() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1>Caching</h1>
      
      <p>
        The Query Client provides sophisticated caching with configurable eviction strategies,
        stale time management, and cache size limits.
      </p>

      <h2>Cache Configuration</h2>

      <CodeBlock language="typescript">
{`import { QueryClient } from '@titanstate/query';

const queryClient = new QueryClient({
  defaultStaleTime: 5000, // 5 seconds
  defaultCacheTime: 30000, // 30 seconds
  maxSize: 50 * 1024 * 1024, // 50MB
  evictionStrategy: 'lru', // LRU eviction
});`}
      </CodeBlock>

      <h2>Stale Time</h2>

      <p>
        Stale time determines how long data is considered fresh. Fresh data is not refetched.
      </p>

      <CodeBlock language="typescript">
{`// Data is fresh for 5 seconds
useQuery(['user'], fetchUser, {
  staleTime: 5000,
});

// Data is always fresh (never refetched)
useQuery(['config'], fetchConfig, {
  staleTime: Infinity,
});`}
      </CodeBlock>

      <h2>Cache Time</h2>

      <p>
        Cache time determines how long unused data stays in cache before being garbage collected.
      </p>

      <CodeBlock language="typescript">
{`// Keep unused data for 5 minutes
useQuery(['user'], fetchUser, {
  cacheTime: 5 * 60 * 1000,
});

// Never remove from cache
useQuery(['config'], fetchConfig, {
  cacheTime: Infinity,
});`}
      </CodeBlock>

      <h2>Eviction Strategies</h2>

      <h3>LRU (Least Recently Used)</h3>
      <p>Evicts least recently accessed entries when cache is full.</p>
      <CodeBlock language="typescript">
{`const queryClient = new QueryClient({
  evictionStrategy: 'lru',
  maxSize: 50 * 1024 * 1024, // 50MB
});`}
      </CodeBlock>

      <h3>LFU (Least Frequently Used)</h3>
      <p>Evicts least frequently accessed entries.</p>
      <CodeBlock language="typescript">
{`const queryClient = new QueryClient({
  evictionStrategy: 'lfu',
});`}
      </CodeBlock>

      <h3>TTL (Time To Live)</h3>
      <p>Evicts entries based on expiration time.</p>
      <CodeBlock language="typescript">
{`const queryClient = new QueryClient({
  evictionStrategy: 'ttl',
});`}
      </CodeBlock>

      <h3>Size-Based</h3>
      <p>Evicts largest entries when cache exceeds size limit.</p>
      <CodeBlock language="typescript">
{`const queryClient = new QueryClient({
  evictionStrategy: 'size',
  maxSize: 50 * 1024 * 1024, // 50MB
});`}
      </CodeBlock>

      <h2>Manual Cache Management</h2>

      <CodeBlock language="typescript">
{`import { useQueryClient } from '@titanstate/query';

function CacheControls() {
  const queryClient = useQueryClient();
  
  // Get cached data
  const user = queryClient.getQueryData(['user', 1]);
  
  // Set cached data
  queryClient.setQueryData(['user', 1], { id: 1, name: 'John' });
  
  // Invalidate query (triggers refetch)
  queryClient.invalidateQuery(['user', 1]);
  
  // Remove from cache
  queryClient.removeQuery(['user', 1]);
  
  // Clear all cache
  queryClient.clear();
  
  return null;
}`}
      </CodeBlock>

      <h2>Cache Persistence</h2>

      <p>
        Integrate with persistence layer to persist cache across sessions.
      </p>

      <CodeBlock language="typescript">
{`import { QueryClient } from '@titanstate/query';
import { IndexedDBDriver } from '@titanstate/persist';

const driver = new IndexedDBDriver({ dbName: 'myapp' });

const queryClient = new QueryClient({
  persistenceDriver: driver,
});`}
      </CodeBlock>

      <h2>Best Practices</h2>

      <ul>
        <li>Set appropriate stale times based on data volatility</li>
        <li>Use longer cache times for stable data</li>
        <li>Choose eviction strategy based on access patterns</li>
        <li>Set max size to prevent memory issues</li>
        <li>Invalidate cache after mutations</li>
      </ul>
    </div>
  );
}

