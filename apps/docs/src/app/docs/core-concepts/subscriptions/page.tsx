import { CodeBlock } from '@/components/CodeBlock';

export default function Subscriptions() {
  return (
    <>
      <h1>Subscriptions</h1>
      
      <p>
        Subscriptions allow you to react to changes in atom values. TitanState uses an
        efficient subscription system that only notifies listeners when values actually change.
      </p>

      <h2>Basic Subscription</h2>

      <CodeBlock language="typescript">
{`import { createStore } from '@titanstate/core';

const store = createStore();
const countAtom = store.createAtom('count', 0);

// Subscribe to changes
const unsubscribe = store.subscribe(countAtom, (newValue, previousValue) => {
  console.log('Count changed from', previousValue, 'to', newValue);
});

// Update the value
store.set(countAtom, 1); // Listener is called

// Unsubscribe when done
unsubscribe();`}
      </CodeBlock>

      <h2>Subscription Callback</h2>

      <p>
        The subscription callback receives two parameters:
      </p>

      <ul>
        <li><code>newValue</code> - The new atom value</li>
        <li><code>previousValue</code> - The previous atom value (undefined on first call)</li>
      </ul>

      <h2>Unsubscribing</h2>

      <p>
        Always unsubscribe when you no longer need to listen to changes. This prevents
        memory leaks and unnecessary updates.
      </p>

      <CodeBlock language="typescript">
{`// In a component
useEffect(() => {
  const unsubscribe = store.subscribe(atom, (value) => {
    // Handle change
  });
  
  // Cleanup on unmount
  return unsubscribe;
}, []);`}
      </CodeBlock>

      <h2>Batched Updates</h2>

      <p>
        Multiple updates within a transaction are batched together. Subscribers are only
        notified once after all updates complete.
      </p>

      <CodeBlock language="typescript">
{`// All updates batched - subscribers notified once
await store.transaction(async () => {
  store.set(atom1, value1);
  store.set(atom2, value2);
  store.set(atom3, value3);
});`}
      </CodeBlock>

      <h2>Change Detection</h2>

      <p>
        Subscriptions only fire when values actually change. TitanState uses equality checking
        to determine if a value has changed:
      </p>

      <ul>
        <li>Primitives: Uses <code>Object.is()</code></li>
        <li>Objects/Arrays: Shallow comparison by default</li>
        <li>Custom: Use <code>equals</code> option for custom comparison</li>
      </ul>

      <CodeBlock language="typescript">
{`// Custom equality function
const userAtom = store.createAtom('user', user, {
  equals: (a, b) => a.id === b.id, // Only update if ID changes
});`}
      </CodeBlock>

      <h2>React Integration</h2>

      <p>
        React hooks automatically handle subscriptions. You don't need to manually subscribe
        when using <code>useAtom</code>, <code>useAtomValue</code>, or <code>useSelector</code>.
      </p>

      <CodeBlock language="tsx">
{`function Counter() {
  // Automatically subscribes and unsubscribes
  const [count, setCount] = useAtom(countAtom);
  return <div>{count}</div>;
}`}
      </CodeBlock>

      <h2>Performance</h2>

      <ul>
        <li>Subscriptions are efficient - only active listeners are notified</li>
        <li>Updates are batched to minimize re-renders</li>
        <li>Equality checking prevents unnecessary notifications</li>
        <li>Unsubscribe when no longer needed to free memory</li>
      </ul>
    </>
  );
}

