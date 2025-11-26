import { CodeBlock } from '@/components/CodeBlock';

export default function UseMutation() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>useMutation Hook</h1>
      
      <p>
        The <code>useMutation</code> hook handles server mutations (create, update, delete).
        It provides loading states, error handling, and cache invalidation.
      </p>

      <h2>Basic Usage</h2>

      <CodeBlock language="tsx">
{`import { useMutation } from '@titanstate/query';
import { useQueryClient } from '@titanstate/query';

function UpdateUser() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation(
    (data: { name: string }) => updateUser(data),
    {
      onSuccess: () => {
        queryClient.invalidateQuery(['user']);
      },
    }
  );
  
  return (
    <button
      onClick={() => mutation.mutate({ name: 'John' })}
      disabled={mutation.isLoading}
    >
      {mutation.isLoading ? 'Updating...' : 'Update'}
    </button>
  );
}`}
      </CodeBlock>

      <h2>Mutation Function</h2>

      <p>
        The mutation function performs the server operation. It receives variables and
        returns a promise.
      </p>

      <CodeBlock language="typescript">
{`const mutation = useMutation(
  async (variables: { name: string; email: string }) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(variables),
    });
    return response.json();
  }
);`}
      </CodeBlock>

      <h2>Mutation Options</h2>

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
            <td><code>onSuccess</code></td>
            <td><code>(data, variables) => void</code></td>
            <td>Callback on successful mutation</td>
          </tr>
          <tr>
            <td><code>onError</code></td>
            <td><code>(error, variables) => void</code></td>
            <td>Callback on mutation error</td>
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
            <td><code>mutate</code></td>
            <td><code>(variables) => Promise&lt;TData&gt;</code></td>
            <td>Function to execute mutation</td>
          </tr>
          <tr>
            <td><code>data</code></td>
            <td><code>TData | undefined</code></td>
            <td>Mutation result data</td>
          </tr>
          <tr>
            <td><code>isLoading</code></td>
            <td><code>boolean</code></td>
            <td>True while mutating</td>
          </tr>
          <tr>
            <td><code>isError</code></td>
            <td><code>boolean</code></td>
            <td>True if mutation failed</td>
          </tr>
          <tr>
            <td><code>error</code></td>
            <td><code>Error | null</code></td>
            <td>Error object if mutation failed</td>
          </tr>
          <tr>
            <td><code>reset</code></td>
            <td><code>() => void</code></td>
            <td>Reset mutation state</td>
          </tr>
        </tbody>
      </table>

      <h2>Cache Invalidation</h2>

      <CodeBlock language="tsx">
{`function UpdateUser() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation(updateUser, {
    onSuccess: (data, variables) => {
      // Invalidate and refetch user query
      queryClient.invalidateQuery(['user', variables.id]);
      
      // Or update cache directly
      queryClient.setQueryData(['user', variables.id], data);
    },
  });
  
  return <button onClick={() => mutation.mutate({ id: 1, name: 'John' })}>Update</button>;
}`}
      </CodeBlock>

      <h2>Optimistic Updates</h2>

      <CodeBlock language="tsx">
{`function UpdateUser() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation(updateUser, {
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['user', variables.id]);
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(['user', variables.id]);
      
      // Optimistically update
      queryClient.setQueryData(['user', variables.id], {
        ...previous,
        ...variables,
      });
      
      return { previous };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['user', variables.id], context.previous);
    },
    onSettled: (data, error, variables) => {
      // Refetch after mutation
      queryClient.invalidateQuery(['user', variables.id]);
    },
  });
  
  return <button onClick={() => mutation.mutate({ id: 1, name: 'John' })}>Update</button>;
}`}
      </CodeBlock>

      <h2>Form Handling</h2>

      <CodeBlock language="tsx">
{`function UserForm() {
  const mutation = useMutation(createUser);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    };
    
    try {
      await mutation.mutate(data);
      alert('User created!');
    } catch (error) {
      alert('Error creating user');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" />
      <input name="email" placeholder="Email" />
      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}`}
      </CodeBlock>
    </div>
  );
}

