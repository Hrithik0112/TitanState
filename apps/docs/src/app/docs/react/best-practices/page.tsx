import { CodeBlock } from '@/components/CodeBlock';

export default function ReactBestPractices() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>React Best Practices</h1>
      
      <p>
        Follow these best practices to get the most out of TitanState in your React
        applications.
      </p>

      <h2>Choose the Right Hook</h2>

      <h3>useAtom - Read and Write</h3>
      <CodeBlock language="tsx">
{`// Use when you need both read and write
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`}
      </CodeBlock>

      <h3>useAtomValue - Read Only</h3>
      <CodeBlock language="tsx">
{`// Use when you only need to read
function Display() {
  const count = useAtomValue(countAtom);
  return <div>Count: {count}</div>;
}`}
      </CodeBlock>

      <h3>useSetAtom - Write Only</h3>
      <CodeBlock language="tsx">
{`// Use when you only need to write
function IncrementButton() {
  const setCount = useSetAtom(countAtom);
  return <button onClick={() => setCount(prev => prev + 1)}>+</button>;
}`}
      </CodeBlock>

      <h2>Component Organization</h2>

      <p>
        Keep atoms close to where they're used. Create atoms at the module level, not
        inside components.
      </p>

      <CodeBlock language="tsx">
{`// ✅ Good - atom at module level
const userAtom = store.createAtom('user', null);

function UserProfile() {
  const [user] = useAtom(userAtom);
  return <div>{user?.name}</div>;
}

// ❌ Bad - atom inside component
function UserProfile() {
  const userAtom = store.createAtom('user', null); // Don't do this!
  const [user] = useAtom(userAtom);
  return <div>{user?.name}</div>;
}`}
      </CodeBlock>

      <h2>Derived State</h2>

      <p>
        Use <code>useSelector</code> for derived values instead of creating separate atoms.
      </p>

      <CodeBlock language="tsx">
{`// ✅ Good - use selector
function FullName() {
  const fullName = useSelector([firstNameAtom, lastNameAtom], (values) => {
    return \`\${values[0]} \${values[1]}\`;
  });
  return <div>{fullName}</div>;
}

// ❌ Bad - separate atom for derived state
const fullNameAtom = store.createAtom('fullName', ''); // Don't do this!`}
      </CodeBlock>

      <h2>Performance Optimization</h2>

      <h3>Split Components</h3>
      <p>
        Split components that use different atoms to minimize re-renders.
      </p>

      <CodeBlock language="tsx">
{`// ✅ Good - separate components
function UserName() {
  const name = useAtomValue(nameAtom);
  return <div>{name}</div>;
}

function UserEmail() {
  const email = useAtomValue(emailAtom);
  return <div>{email}</div>;
}

// ❌ Bad - one component using multiple atoms
function UserInfo() {
  const name = useAtomValue(nameAtom);
  const email = useAtomValue(emailAtom);
  return (
    <div>
      <div>{name}</div>
      <div>{email}</div>
    </div>
  );
}`}
      </CodeBlock>

      <h2>Batch Updates</h2>

      <p>
        Use transactions to batch multiple updates together.
      </p>

      <CodeBlock language="tsx">
{`function UpdateUser() {
  const [user, setUser] = useAtom(userAtom);
  const setLoading = useSetAtom(loadingAtom);
  
  const handleUpdate = async () => {
    await store.transaction(async () => {
      setLoading(true);
      const updated = await api.updateUser(user);
      setUser(updated);
      setLoading(false);
    });
  };
  
  return <button onClick={handleUpdate}>Update</button>;
}`}
      </CodeBlock>

      <h2>Error Handling</h2>

      <CodeBlock language="tsx">
{`import { useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useAtom(dataAtom);
  const [error, setError] = useAtom(errorAtom);
  
  useEffect(() => {
    fetchData()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);
  
  if (error) return <div>Error: {error}</div>;
  return <div>{data}</div>;
}`}
      </CodeBlock>

      <h2>Testing</h2>

      <p>
        Test components with TitanState by providing a test store.
      </p>

      <CodeBlock language="tsx">
{`import { render } from '@testing-library/react';
import { StoreProvider } from '@titanstate/react';
import { createStore } from '@titanstate/core';

test('renders counter', () => {
  const testStore = createStore();
  const countAtom = testStore.createAtom('count', 0);
  
  render(
    <StoreProvider store={testStore}>
      <Counter />
    </StoreProvider>
  );
  
  // Test your component
});`}
      </CodeBlock>
    </div>
  );
}

