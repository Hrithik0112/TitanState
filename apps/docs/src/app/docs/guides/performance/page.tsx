import { CodeBlock } from '@/components/CodeBlock';

export default function Performance() {
  return (
    <>
      <h1>Performance Guide</h1>
      
      <p>
        TitanState is designed for high performance, especially with large datasets.
        This guide covers best practices for optimal performance.
      </p>

      <h2>Lazy Loading</h2>

      <p>
        Use lazy loading for large datasets that aren't needed immediately. This prevents
        loading unnecessary data on initialization.
      </p>

      <CodeBlock language="typescript">
{`// Large dataset - lazy load
const largeDataAtom = store.createAtom('largeData', [], {
  persisted: true,
  lazyLoad: true, // Only loads when accessed
});

// Access when needed
const data = await store.getAsync(largeDataAtom);`}
      </CodeBlock>

      <h2>Compression</h2>

      <p>
        Enable compression for large persisted atoms to reduce storage size and
        improve load times.
      </p>

      <CodeBlock language="typescript">
{`const dataAtom = store.createAtom('data', largeData, {
  persisted: true,
  compress: true, // Automatically compressed
});`}
      </CodeBlock>

      <h2>Custom Equality Functions</h2>

      <p>
        Provide custom equality functions to prevent unnecessary updates and re-renders.
      </p>

      <CodeBlock language="typescript">
{`const userAtom = store.createAtom('user', user, {
  equals: (a, b) => a.id === b.id, // Only update if ID changes
});`}
      </CodeBlock>

      <h2>Web Workers</h2>

      <p>
        Offload heavy computations to Web Workers to keep the main thread responsive.
      </p>

      <CodeBlock language="typescript">
{`import { WorkerBridge } from '@titanstate/worker';

const workerBridge = new WorkerBridge({ scriptUrl: '/worker.js' });
workerBridge.start('/worker.js');

// Dispatch heavy computation to worker
const result = await workerBridge.dispatchToWorker('namespace', action, state);`}
      </CodeBlock>

      <h2>Batch Updates</h2>

      <p>
        Use transactions to batch multiple updates together, reducing the number of
        re-renders and notifications.
      </p>

      <CodeBlock language="typescript">
{`await store.transaction(async () => {
  store.set(atom1, value1);
  store.set(atom2, value2);
  store.set(atom3, value3);
  // All updates batched together
});`}
      </CodeBlock>

      <h2>Memory Management</h2>

      <ul>
        <li>Use <code>lazyLoad</code> for large datasets</li>
        <li>Enable compression for persisted data</li>
        <li>Use chunking for very large datasets (automatic for 10MB+)</li>
        <li>Unsubscribe from atoms when components unmount</li>
      </ul>
    </>
  );
}

