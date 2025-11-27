import { CodeBlock } from '@/components/CodeBlock';

export default function GettingStarted() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1>Getting Started</h1>
      
      <p>
        TitanState is a scalable state management engine designed to handle very large datasets
        (100MB–GB range) in browsers and client apps while preserving the developer ergonomics
        of Redux/RTK.
      </p>

      <h2>Why TitanState?</h2>
      
      <p>
        Traditional state management libraries struggle with large datasets. TitanState solves this
        with:
      </p>

      <ul>
        <li><strong>Lazy Loading</strong> - Atoms are only loaded when accessed</li>
        <li><strong>Compression</strong> - Automatic compression for persisted data</li>
        <li><strong>Web Workers</strong> - Offload heavy computations</li>
        <li><strong>Efficient Memory</strong> - Structural sharing and chunking</li>
        <li><strong>Time-Travel Debugging</strong> - Event-based debugging</li>
      </ul>

      <h2>Installation</h2>

      <CodeBlock language="bash">
{`# Install core package
npm install @titanstate/core

# Install React bindings
npm install @titanstate/react

# Or install all packages
npm install @titanstate/core @titanstate/react @titanstate/persist @titanstate/query`}
      </CodeBlock>

      <h2>Quick Start</h2>

      <p>Create a store and start using atoms:</p>

      <CodeBlock language="typescript">
{`import { createStore } from '@titanstate/core';

// Create a store
const store = createStore();

// Create an atom
const countAtom = store.createAtom('count', 0);

// Read value
const count = store.get(countAtom);
console.log(count); // 0

// Update value
store.set(countAtom, 1);

// Subscribe to changes
const unsubscribe = store.subscribe(countAtom, (newValue) => {
  console.log('Count changed:', newValue);
});`}
      </CodeBlock>

      <h2>With React</h2>

      <CodeBlock language="tsx">
{`import { createStore } from '@titanstate/core';
import { StoreProvider, useAtom } from '@titanstate/react';

const store = createStore();
const countAtom = store.createAtom('count', 0);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

function App() {
  return (
    <StoreProvider store={store}>
      <Counter />
    </StoreProvider>
  );
}`}
      </CodeBlock>

      <h2>Next Steps</h2>

      <ul>
        <li><a href="/docs/core-concepts/atoms">Learn about Atoms</a></li>
        <li><a href="/docs/react/setup">Set up React Integration</a></li>
        <li><a href="/docs/persistence/overview">Add Persistence</a></li>
        <li><a href="/docs/examples">View Examples</a></li>
      </ul>
    </div>
  );
}

