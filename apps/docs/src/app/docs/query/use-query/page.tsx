import { CodeBlock } from '@/components/CodeBlock';

export default function UseQuery() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1>useQuery Hook</h1>
      
      <p>
        The <code>useQuery</code> hook fetches and caches server data. It provides loading
        states, error handling, and automatic refetching.
      </p>

      <h2>Basic Usage</h2>

      <CodeBlock language="tsx">
{`import { useQuery } from '@titanstate/query';

function UserProfile({ userId }: { userId: number }) {
  const { data, isLoading, error } = useQuery(
    ['user', userId],
    () => fetchUser(userId)
  );
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data.name}</div>;
}`}
      </CodeBlock>

      <h2>Query Key</h2>

      <p>
        The query key uniquely identifies the query. It can be a string or array.
      </p>

      <CodeBlock language="typescript">
{`// String key
useQuery('users', fetchUsers);

// Array key with parameters
useQuery(['user', userId], () => fetchUser(userId));

// Complex key
useQuery(['posts', { author: userId, status: 'published' }], fetchPosts);`}
      </CodeBlock>

      <h2>Query Function</h2>

      <p>
        The query function fetches the data. It can be async or return a promise.
      </p>

      <CodeBlock language="typescript">
{`// Async function
useQuery(['user', userId], async () => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});

// Promise
useQuery(['user', userId], () => fetch(`/api/users/${userId}`).then(r => r.json()));`}
      </CodeBlock>

      <h2>Query Options</h2>

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
            <td><code>staleTime</code></td>
            <td><code>number</code></td>
            <td>Time before data is considered stale (ms)</td>
          </tr>
          <tr>
            <td><code>cacheTime</code></td>
            <td><code>number</code></td>
            <td>Time to keep unused data in cache (ms)</td>
          </tr>
          <tr>
            <td><code>enabled</code></td>
            <td><code>boolean</code></td>
            <td>Whether to execute the query</td>
          </tr>
          <tr>
            <td><code>refetchOnWindowFocus</code></td>
            <td><code>boolean</code></td>
            <td>Refetch when window gains focus</td>
          </tr>
          <tr>
            <td><code>retry</code></td>
            <td><code>boolean | number</code></td>
            <td>Number of retry attempts</td>
          </tr>
        </tbody>
      </table>

      <h2>Return Values</h2>

      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>data</code></td>
            <td><code>TData | undefined</code></td>
            <td>Query result data</td>
          </tr>
          <tr>
            <td><code>isLoading</code></td>
            <td><code>boolean</code></td>
            <td>True while fetching</td>
          </tr>
          <tr>
            <td><code>isError</code></td>
            <td><code>boolean</code></td>
            <td>True if query failed</td>
          </tr>
          <tr>
            <td><code>error</code></td>
            <td><code>Error | null</code></td>
            <td>Error object if query failed</td>
          </tr>
          <tr>
            <td><code>refetch</code></td>
            <td><code>() => Promise&lt;TData&gt;</code></td>
            <td>Function to manually refetch</td>
          </tr>
        </tbody>
      </table>

      <h2>Conditional Queries</h2>

      <CodeBlock language="tsx">
{`function UserProfile({ userId }: { userId?: number }) {
  const { data } = useQuery(
    ['user', userId],
    () => fetchUser(userId!),
    {
      enabled: !!userId, // Only fetch if userId exists
    }
  );
  
  if (!userId) return <div>No user selected</div>;
  return <div>{data?.name}</div>;
}`}
      </CodeBlock>

      <h2>Dependent Queries</h2>

      <CodeBlock language="tsx">
{`function UserPosts({ userId }: { userId: number }) {
  const { data: user } = useQuery(['user', userId], () => fetchUser(userId));
  
  const { data: posts } = useQuery(
    ['posts', userId],
    () => fetchUserPosts(userId),
    {
      enabled: !!user, // Only fetch posts after user is loaded
    }
  );
  
  return <div>{/* Render posts */}</div>;
}`}
      </CodeBlock>

      <h2>Manual Refetching</h2>

      <CodeBlock language="tsx">
{`function DataDisplay() {
  const { data, refetch } = useQuery(['data'], fetchData);
  
  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      <div>{data}</div>
    </div>
  );
}`}
      </CodeBlock>
    </div>
  );
}

