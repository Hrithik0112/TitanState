import { CodeBlock } from '@/components/CodeBlock';

export default function ReactHooks() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1>React Hooks</h1>
      
      <p>
        TitanState provides React hooks for seamless integration with React components.
        All hooks are optimized for React 18+ concurrent rendering.
      </p>

      <h2>useAtom</h2>

      <p>
        The <code>useAtom</code> hook provides both read and write access to an atom.
      </p>

      <CodeBlock language="tsx">
{`import { useAtom } from '@titanstate/react';

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}`}
      </CodeBlock>

      <h2>useAtomValue</h2>

      <p>
        Read-only access to an atom. Use this when you only need to read the value.
      </p>

      <CodeBlock language="tsx">
{`import { useAtomValue } from '@titanstate/react';

function Display() {
  const count = useAtomValue(countAtom);
  
  return <p>Count: {count}</p>;
}`}
      </CodeBlock>

      <h2>useSetAtom</h2>

      <p>
        Write-only access to an atom. Use this when you only need to update the value.
      </p>

      <CodeBlock language="tsx">
{`import { useSetAtom } from '@titanstate/react';

function IncrementButton() {
  const setCount = useSetAtom(countAtom);
  
  return <button onClick={() => setCount(prev => prev + 1)}>Increment</button>;
}`}
      </CodeBlock>

      <h2>useSelector</h2>

      <p>
        Select derived values from one or more atoms.
      </p>

      <CodeBlock language="tsx">
{`import { useSelector } from '@titanstate/react';

function UserName() {
  const name = useSelector([userAtom], (values) => {
    const user = values[0] as { name: string };
    return user.name;
  });
  
  return <p>Hello, {name}!</p>;
}`}
      </CodeBlock>

      <h2>Performance Considerations</h2>

      <ul>
        <li>Components only re-render when subscribed atoms change</li>
        <li>Use <code>useAtomValue</code> for read-only access to avoid unnecessary re-renders</li>
        <li><code>useSelector</code> uses equality checking to prevent unnecessary updates</li>
        <li>All hooks work with React 18 concurrent features</li>
      </ul>
    </div>
  );
}

