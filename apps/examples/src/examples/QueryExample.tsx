import React, { useState } from 'react';
import { createStore } from '@titanstate/core';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@titanstate/query';
import { StoreProvider } from '@titanstate/react';

// Create store
const store = createStore();

// Create query client
const queryClient = new QueryClient({
  defaultStaleTime: 5000, // 5 seconds
  defaultCacheTime: 30000, // 30 seconds
});

// Mock API functions
async function fetchUser(id: number): Promise<{ id: number; name: string; email: string }> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id,
    name: `User ${id}`,
    email: `user${id}@example.com`,
  };
}

async function updateUser(id: number, data: { name: string; email: string }): Promise<{ id: number; name: string; email: string }> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { id, ...data };
}

// Component using useQuery
function UserProfile({ userId }: { userId: number }) {
  const { data, isLoading, error, refetch } = useQuery(
    ['user', userId],
    () => fetchUser(userId),
    {
      staleTime: 5000,
    }
  );

  if (isLoading) return <div>Loading user...</div>;
  if (error) return <div>Error: {String(error)}</div>;

  return (
    <div className="example-section">
      <h3>User Profile (useQuery)</h3>
      {data && (
        <div>
          <p>ID: <code>{data.id}</code></p>
          <p>Name: <code>{data.name}</code></p>
          <p>Email: <code>{data.email}</code></p>
        </div>
      )}
      <button onClick={() => refetch()}>Refetch</button>
    </div>
  );
}

// Component using useMutation
function UpdateUserForm({ userId }: { userId: number }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const mutation = useMutation(
    (data: { name: string; email: string }) => updateUser(userId, data),
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQuery(['user', userId]);
        alert('User updated successfully!');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, email });
  };

  return (
    <div className="example-section">
      <h3>Update User (useMutation)</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.5rem' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Updating...' : 'Update User'}
        </button>
      </form>
      {mutation.isError && (
        <p style={{ color: '#dc3545', marginTop: '0.5rem' }}>
          Error: {String(mutation.error)}
        </p>
      )}
      {mutation.isSuccess && (
        <p style={{ color: '#28a745', marginTop: '0.5rem' }}>
          Success! User updated.
        </p>
      )}
    </div>
  );
}

function QueryExampleContent() {
  const [userId, setUserId] = useState(1);

  return (
    <div className="example-container">
      <h2>Query Client</h2>
      <p>
        This example demonstrates server-state management with the Query Client.
        It provides caching, refetching, and mutation handling similar to React Query.
      </p>

      <div className="example-section">
        <h3>User ID Selector</h3>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(Number.parseInt(e.target.value, 10))}
          min="1"
          max="10"
        />
      </div>

      <UserProfile userId={userId} />
      <UpdateUserForm userId={userId} />

      <div className="example-section">
        <h3>Code Example</h3>
        <pre>
          <code>{`import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@titanstate/query';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      cacheTime: 30000,
    },
  },
});

// Wrap your app
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>

// Use in components
function UserProfile({ userId }) {
  const { data, isLoading, error, refetch } = useQuery(
    ['user', userId],
    () => fetchUser(userId),
    { staleTime: 5000 }
  );
  
  if (isLoading) return <div>Loading...</div>;
  return <div>{data.name}</div>;
}

// Mutations
function UpdateUser() {
  const mutation = useMutation(
    (data) => updateUser(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user']);
      },
    }
  );
  
  return <button onClick={() => mutation.mutate({ name: 'John' })}>Update</button>;
}`}</code>
        </pre>
      </div>
    </div>
  );
}

export default function QueryExample() {
  return (
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <QueryExampleContent />
      </QueryClientProvider>
    </StoreProvider>
  );
}

