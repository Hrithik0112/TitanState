import { CodeBlock } from '@/components/CodeBlock';

export default function ReactSetup() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>React Setup</h1>
      
      <p>
        TitanState provides seamless React integration with hooks and a context provider.
        This guide shows you how to set up TitanState in your React application.
      </p>

      <h2>Installation</h2>

      <CodeBlock language="bash">
{`npm install @titanstate/core @titanstate/react`}
      </CodeBlock>

      <h2>Basic Setup</h2>

      <h3>1. Create a Store</h3>

      <CodeBlock language="typescript">
{`// store.ts
import { createStore } from '@titanstate/core';

export const store = createStore();`}
      </CodeBlock>

      <h3>2. Wrap Your App with StoreProvider</h3>

      <CodeBlock language="tsx">
{`// App.tsx
import { StoreProvider } from '@titanstate/react';
import { store } from './store';

function App() {
  return (
    <StoreProvider store={store}>
      <YourComponents />
    </StoreProvider>
  );
}`}
      </CodeBlock>

      <h3>3. Use Hooks in Components</h3>

      <CodeBlock language="tsx">
{`import { useAtom } from '@titanstate/react';
import { store } from './store';

const countAtom = store.createAtom('count', 0);

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

      <h2>Advanced Setup</h2>

      <h3>With Persistence</h3>

      <CodeBlock language="tsx">
{`import { createStore } from '@titanstate/core';
import { IndexedDBDriver } from '@titanstate/persist';
import { DevToolsBridge } from '@titanstate/devtools';
import { StoreProvider } from '@titanstate/react';

const driver = new IndexedDBDriver({ dbName: 'myapp' });
const devtools = new DevToolsBridge({ enabled: true });

const store = createStore({
  persistenceDriver: driver,
  devtoolsBridge: devtools,
});

function App() {
  return (
    <StoreProvider store={store}>
      <YourComponents />
    </StoreProvider>
  );
}`}
      </CodeBlock>

      <h2>Multiple Stores</h2>

      <p>
        While you typically use one store per app, you can use multiple stores if needed.
        Each StoreProvider provides its own store context.
      </p>

      <CodeBlock language="tsx">
{`function App() {
  return (
    <StoreProvider store={store1}>
      <StoreProvider store={store2}>
        <YourComponents />
      </StoreProvider>
    </StoreProvider>
  );
}`}
      </CodeBlock>

      <h2>TypeScript</h2>

      <p>
        TitanState is fully typed. All hooks and store methods have proper TypeScript
        types for excellent developer experience.
      </p>

      <h2>Next Steps</h2>

      <ul>
        <li><a href="/docs/react/hooks">Learn about React Hooks</a></li>
        <li><a href="/docs/react/best-practices">Best Practices</a></li>
        <li><a href="/docs/core-concepts/atoms">Core Concepts</a></li>
      </ul>
    </div>
  );
}

