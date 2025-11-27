import { CodeBlock } from '@/components/CodeBlock';

export default function WorkerReducers() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1>Worker Reducers</h1>
      
      <p>
        Worker reducers are functions that run in Web Workers to process actions and
        update state. They keep heavy computations off the main thread.
      </p>

      <h2>Registering Reducers</h2>

      <CodeBlock language="typescript">
{`import { registerWorkerReducer } from '@titanstate/worker';

// Register a reducer
registerWorkerReducer('namespace', (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
});`}
      </CodeBlock>

      <h2>Reducer Function</h2>

      <p>
        Reducers receive the current state and an action, and return the new state.
        They can be async for operations that require async work.
      </p>

      <CodeBlock language="typescript">
{`// Synchronous reducer
registerWorkerReducer('main', (state, action) => {
  return newState;
});

// Async reducer
registerWorkerReducer('main', async (state, action) => {
  const processed = await processData(state, action.payload);
  return processed;
});`}
      </CodeBlock>

      <h2>Namespaces</h2>

      <p>
        Reducers are organized by namespaces. This allows multiple reducers to coexist
        and be dispatched to independently.
      </p>

      <CodeBlock language="typescript">
{`// Register multiple reducers
registerWorkerReducer('users', (state, action) => {
  // Handle user actions
});

registerWorkerReducer('posts', (state, action) => {
  // Handle post actions
});

// Dispatch to specific namespace
await workerBridge.dispatchToWorker('users', action, userState);
await workerBridge.dispatchToWorker('posts', action, postState);`}
      </CodeBlock>

      <h2>Complex Reducers</h2>

      <CodeBlock language="typescript">
{`registerWorkerReducer('data', (state, action) => {
  switch (action.type) {
    case 'PROCESS_BATCH': {
      const batch = action.payload;
      const processed = batch.map(item => ({
        ...item,
        processed: true,
        timestamp: Date.now(),
      }));
      return { ...state, items: [...state.items, ...processed] };
    }
    
    case 'FILTER': {
      const filtered = state.items.filter(item =>
        item.name.includes(action.payload.query)
      );
      return { ...state, filtered };
    }
    
    case 'SORT': {
      const sorted = [...state.items].sort((a, b) => {
        return a[action.payload.field] - b[action.payload.field];
      });
      return { ...state, items: sorted };
    }
    
    default:
      return state;
  }
});`}
      </CodeBlock>

      <h2>Error Handling</h2>

      <CodeBlock language="typescript">
{`registerWorkerReducer('main', (state, action) => {
  try {
    // Process action
    return newState;
  } catch (error) {
    // Error is automatically sent back to main thread
    throw error;
  }
});

// In main thread
try {
  const result = await workerBridge.dispatchToWorker('main', action, state);
} catch (error) {
  console.error('Worker error:', error);
}`}
      </CodeBlock>

      <h2>Best Practices</h2>

      <ul>
        <li>Keep reducers pure when possible</li>
        <li>Use async reducers for I/O operations</li>
        <li>Handle errors gracefully</li>
        <li>Use namespaces to organize related reducers</li>
        <li>Return new state objects (immutability)</li>
      </ul>

      <h2>Example: Data Processing</h2>

      <CodeBlock language="typescript">
{`registerWorkerReducer('analytics', (state, action) => {
  switch (action.type) {
    case 'CALCULATE_STATS': {
      const data = action.payload;
      const stats = {
        mean: calculateMean(data),
        median: calculateMedian(data),
        stdDev: calculateStdDev(data),
      };
      return { ...state, stats };
    }
    
    case 'GENERATE_REPORT': {
      const report = generateReport(state.data, action.payload);
      return { ...state, report };
    }
    
    default:
      return state;
  }
});`}
      </CodeBlock>
    </div>
  );
}

