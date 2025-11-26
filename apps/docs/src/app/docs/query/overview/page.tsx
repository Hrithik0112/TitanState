import { CodeBlock } from '@/components/CodeBlock';

export default function QueryOverview() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Query Client Overview</h1>
      
      <p>
        The Query Client provides server-state management similar to React Query. It handles
        caching, refetching, and synchronization of server data.
      </p>

      <h2>Installation</h2>

      <CodeBlock language="bash">
{`npm install @titanstate/query`}
      </CodeBlock>

      <h2>Basic Setup</h2>

      <CodeBlock language="tsx">
{`import { QueryClient, QueryClientProvider } from '@titanstate/query';
import { StoreProvider } from '@titanstate/react';
import { createStore } from '@titanstate/core';

const store = createStore();
const queryClient = new QueryClient({
  defaultStaleTime: 5000,
  defaultCacheTime: 30000,
});

function App() {
  return (
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <YourComponents />
      </QueryClientProvider>
    </StoreProvider>
  );
}`}
      </CodeBlock>

      <h2>Key Features</h2>

      <ul>
        <li><strong>Caching</strong> - Automatic caching of query results</li>
        <li><strong>Refetching</strong> - Automatic refetch on window focus/reconnect</li>
        <li><strong>Stale Time</strong> - Configurable stale time for data</li>
        <li><strong>Cache Time</strong> - Configurable cache retention time</li>
        <li><strong>Eviction</strong> - LRU, LFU, TTL, and size-based eviction</li>
        <li><strong>Mutations</strong> - Optimistic updates and cache invalidation</li>
      </ul>

      <h2>useQuery Hook</h2>

      <CodeBlock language="tsx">
{`import { useQuery } from '@titanstate/query';

function UserProfile({ userId }: { userId: number }) {
  const { data, isLoading, error, refetch } = useQuery(
    ['user', userId],
    () => fetchUser(userId),
    {
      staleTime: 5000,
    }
  );
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data.name}</div>;
}`}
      </CodeBlock>

      <h2>useMutation Hook</h2>

      <CodeBlock language="tsx">
{`import { useMutation } from '@titanstate/query';

function UpdateUser() {
  const mutation = useMutation(
    (data) => updateUser(data),
    {
      onSuccess: () => {
        queryClient.invalidateQuery(['user']);
      },
    }
  );
  
  return (
    <button onClick={() => mutation.mutate({ name: 'John' })}>
      Update
    </button>
  );
}`}
      </CodeBlock>

      <h2>Query Client Configuration</h2>

      <table>
        <thead>
          <tr>
            <th>Option</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>defaultStaleTime</code></td>
            <td><code>number</code></td>
            <td>Default time before data is considered stale (ms)</td>
          </tr>
          <tr>
            <td><code>defaultCacheTime</code></td>
            <td><code>number</code></td>
            <td>Default time to keep unused data in cache (ms)</td>
          </tr>
          <tr>
            <td><code>maxSize</code></td>
            <td><code>number</code></td>
            <td>Maximum cache size in bytes</td>
          </tr>
          <tr>
            <td><code>evictionStrategy</code></td>
            <td><code>'lru' | 'lfu' | 'ttl' | 'size'</code></td>
            <td>Cache eviction strategy</td>
          </tr>
        </tbody>
      </table>

      <h2>Next Steps</h2>

      <ul>
        <li><a href="/docs/query/use-query">Learn about useQuery</a></li>
        <li><a href="/docs/query/use-mutation">Learn about useMutation</a></li>
        <li><a href="/docs/query/caching">Caching Strategies</a></li>
      </ul>
    </div>
  );
}

