import { CodeBlock } from '@/components/CodeBlock';

export default function WorkersOverview() {
  return (
    <>
      <h1>Web Workers Overview</h1>
      
      <p>
        TitanState supports Web Workers for offloading heavy computations. This keeps the
        main thread responsive while processing large datasets or complex operations.
      </p>

      <h2>Why Use Workers?</h2>

      <ul>
        <li><strong>Performance</strong> - Keep UI responsive during heavy computations</li>
        <li><strong>Large Data</strong> - Process 100MB+ datasets without blocking</li>
        <li><strong>Complex Calculations</strong> - Offload CPU-intensive work</li>
        <li><strong>Parallel Processing</strong> - Use multiple workers for parallel tasks</li>
      </ul>

      <h2>Architecture</h2>

      <p>
        TitanState uses a worker pool that automatically manages worker instances. Workers
        communicate with the main thread via message passing.
      </p>

      <CodeBlock language="typescript">
{`Main Thread                    Worker Thread
     |                               |
     |-- dispatch(action) ---------->|
     |                               |-- reducer(state, action)
     |                               |-- compute result
     |<-- result/patches ------------|
     |                               |
     |-- apply patches               |
     |-- update store                |`}
      </CodeBlock>

      <h2>Basic Setup</h2>

      <CodeBlock language="typescript">
{`import { WorkerBridge } from '@titanstate/worker';

// Create worker bridge
const workerBridge = new WorkerBridge({
  scriptUrl: '/worker.js',
  poolSize: 4, // Number of workers
});

// Start workers
workerBridge.start('/worker.js');`}
      </CodeBlock>

      <h2>Worker Reducers</h2>

      <p>
        Register reducers in workers to handle actions. Reducers run in the worker thread,
        keeping the main thread free.
      </p>

      <CodeBlock language="typescript">
{`// In worker
import { registerWorkerReducer } from '@titanstate/worker';

registerWorkerReducer('main', (state, action) => {
  switch (action.type) {
    case 'PROCESS_DATA':
      return processLargeDataset(state, action.payload);
    default:
      return state;
  }
});`}
      </CodeBlock>

      <h2>Dispatching to Workers</h2>

      <CodeBlock language="typescript">
{`// In main thread
const result = await workerBridge.dispatchToWorker(
  'main',
  { type: 'PROCESS_DATA', payload: largeData },
  currentState
);

// Update store with result
store.set(dataAtom, result);`}
      </CodeBlock>

      <h2>Worker Pool</h2>

      <p>
        TitanState automatically manages a pool of workers. The pool size is based on
        <code>navigator.hardwareConcurrency</code> by default.
      </p>

      <CodeBlock language="typescript">
{`const workerBridge = new WorkerBridge({
  poolSize: navigator.hardwareConcurrency || 4,
});`}
      </CodeBlock>

      <h2>Zero-Copy Transfers</h2>

      <p>
        For large data, use <code>ArrayBuffer</code> transfers for zero-copy message passing.
      </p>

      <CodeBlock language="typescript">
{`// Transfer ArrayBuffer (zero-copy)
const buffer = new ArrayBuffer(100 * 1024 * 1024); // 100MB
worker.postMessage(buffer, [buffer]); // Transfers ownership`}
      </CodeBlock>

      <h2>Limitations</h2>

      <ul>
        <li>Workers don't have access to DOM</li>
        <li>Limited browser APIs available</li>
        <li>Message passing overhead for small data</li>
        <li>Not available in all environments (Node.js, etc.)</li>
      </ul>

      <h2>Next Steps</h2>

      <ul>
        <li><a href="/docs/workers/setup">Setup Guide</a></li>
        <li><a href="/docs/workers/reducers">Worker Reducers</a></li>
      </ul>
    </>
  );
}

