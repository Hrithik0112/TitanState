import { CodeBlock } from '@/components/CodeBlock';

export default function WorkersSetup() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Worker Setup</h1>
      
      <p>
        This guide walks you through setting up Web Workers with TitanState.
      </p>

      <h2>1. Create Worker Script</h2>

      <CodeBlock language="typescript" filename="worker.ts">
{`// worker.ts
import { registerWorkerReducer } from '@titanstate/worker';

// Register reducer
registerWorkerReducer('main', (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'PROCESS_DATA':
      return processLargeDataset(state, action.payload);
    default:
      return state;
  }
});

function processLargeDataset(state: any, data: any) {
  // Heavy computation here
  return { ...state, processed: data };
}`}
      </CodeBlock>

      <h2>2. Build Worker Bundle</h2>

      <p>
        Build your worker script. TitanState provides a worker entry point that you can
        import in your worker.
      </p>

      <CodeBlock language="typescript" filename="worker-entry.ts">
{`// Import TitanState worker utilities
import '@titanstate/worker/worker';

// Your worker code
import { registerWorkerReducer } from '@titanstate/worker';

registerWorkerReducer('main', (state, action) => {
  // Your reducer logic
  return state;
});`}
      </CodeBlock>

      <h2>3. Initialize Worker Bridge</h2>

      <CodeBlock language="typescript">
{`import { WorkerBridge } from '@titanstate/worker';
import { createStore } from '@titanstate/core';

// Create worker bridge
const workerBridge = new WorkerBridge({
  scriptUrl: '/worker.js', // Path to built worker
  poolSize: 4, // Number of workers in pool
});

// Start workers
workerBridge.start('/worker.js');

// Create store with worker bridge
const store = createStore({
  workerBridge: workerBridge,
});`}
      </CodeBlock>

      <h2>4. Use in Your App</h2>

      <CodeBlock language="tsx">
{`function DataProcessor() {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  
  const processData = async () => {
    setProcessing(true);
    try {
      const processed = await workerBridge.dispatchToWorker(
        'main',
        { type: 'PROCESS_DATA', payload: largeData },
        currentState
      );
      setResult(processed);
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <div>
      <button onClick={processData} disabled={processing}>
        {processing ? 'Processing...' : 'Process Data'}
      </button>
      {result && <div>{/* Display result */}</div>}
    </div>
  );
}`}
      </CodeBlock>

      <h2>Vite Configuration</h2>

      <p>
        If using Vite, configure it to build workers:
      </p>

      <CodeBlock language="typescript" filename="vite.config.ts">
{`import { defineConfig } from 'vite';

export default defineConfig({
  worker: {
    format: 'es',
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'worker.js',
      },
    },
  },
});`}
      </CodeBlock>

      <h2>Webpack Configuration</h2>

      <CodeBlock language="javascript" filename="webpack.config.js">
{`module.exports = {
  entry: {
    main: './src/index.ts',
    worker: './src/worker.ts',
  },
  output: {
    filename: '[name].js',
  },
};`}
      </CodeBlock>

      <h2>Error Handling</h2>

      <CodeBlock language="typescript">
{`workerBridge.onMessage((message) => {
  if (message.type === 'error') {
    console.error('Worker error:', message.error);
  }
});

try {
  const result = await workerBridge.dispatchToWorker('main', action, state);
} catch (error) {
  console.error('Failed to process in worker:', error);
}`}
      </CodeBlock>

      <h2>Testing Workers</h2>

      <p>
        Workers can be tested using Jest with <code>jest-worker</code> or by mocking
        the Worker API.
      </p>
    </div>
  );
}

