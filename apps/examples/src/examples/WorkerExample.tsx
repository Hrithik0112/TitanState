import { useEffect, useState } from 'react';
import { createStore } from '@titanstate/core';
import { WorkerBridge } from '@titanstate/worker';

// Create store
const store = createStore();

// Create worker bridge (requires worker script)
// In a real app, you'd have a worker script file
let workerBridge: WorkerBridge | null = null;

// Mock worker reducer for demonstration
// In a real app, this would run in a Web Worker
function mockWorkerReducer(state: { count: number; items: number[] }, action: { type: string; payload?: unknown }) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, state.items.length] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.slice(0, -1) };
    case 'PROCESS_BATCH':
      // Simulate heavy computation
      const batch = action.payload as number[];
      const processed = batch.map(n => n * 2);
      return { ...state, items: [...state.items, ...processed] };
    default:
      return state;
  }
}

// Create atom for worker state
const workerStateAtom = store.createAtom('workerState', {
  count: 0,
  items: [] as number[],
});

export default function WorkerExample() {
  const [state, setState] = useState(store.get(workerStateAtom) ?? { count: 0, items: [] });
  const [processing, setProcessing] = useState(false);
  const [workerAvailable, setWorkerAvailable] = useState(false);

  useEffect(() => {
    const unsubscribe = store.subscribe(workerStateAtom, (value) => {
      setState(value);
    });

    // Check if workers are available
    if (typeof Worker !== 'undefined') {
      setWorkerAvailable(true);
      // In a real app, you'd initialize the worker bridge here
      // workerBridge = new WorkerBridge({ scriptUrl: '/worker.js' });
      // workerBridge.start('/worker.js');
    }

    return unsubscribe;
  }, []);

  const dispatchToWorker = async (action: { type: string; payload?: unknown }) => {
    if (workerBridge) {
      // In a real app, dispatch to actual worker
      setProcessing(true);
      try {
        const result = await workerBridge.dispatchToWorker('main', action, state);
        store.set(workerStateAtom, result as typeof state);
      } catch (error) {
        console.error('Worker error:', error);
      } finally {
        setProcessing(false);
      }
    } else {
      // Fallback to mock reducer (runs on main thread)
      setProcessing(true);
      setTimeout(() => {
        const newState = mockWorkerReducer(state, action);
        store.set(workerStateAtom, newState);
        setProcessing(false);
      }, 100); // Simulate async work
    }
  };

  const processBatch = () => {
    const batch = Array.from({ length: 1000 }, (_, i) => i);
    dispatchToWorker({ type: 'PROCESS_BATCH', payload: batch });
  };

  return (
    <div className="example-container">
      <h2>Worker Reducers</h2>
      <p>
        This example demonstrates dispatching actions to Web Workers for heavy computations.
        This keeps the main thread responsive while processing large datasets.
      </p>

      {!workerAvailable && (
        <div className="example-section" style={{ background: '#fff3cd', borderColor: '#ffc107' }}>
          <p style={{ color: '#856404' }}>
            <strong>Note:</strong> Web Workers are not available in this environment.
            The example is running with a mock reducer on the main thread.
          </p>
        </div>
      )}

      <div className="example-section">
        <h3>Counter (Worker Reducer)</h3>
        <p>Count: <code>{state.count}</code></p>
        <button onClick={() => dispatchToWorker({ type: 'INCREMENT' })} disabled={processing}>
          Increment
        </button>
        <button onClick={() => dispatchToWorker({ type: 'DECREMENT' })} disabled={processing}>
          Decrement
        </button>
      </div>

      <div className="example-section">
        <h3>Items (Worker Reducer)</h3>
        <p>Items count: <code>{state.items.length}</code></p>
        <button onClick={() => dispatchToWorker({ type: 'ADD_ITEM' })} disabled={processing}>
          Add Item
        </button>
        <button onClick={() => dispatchToWorker({ type: 'REMOVE_ITEM' })} disabled={processing}>
          Remove Item
        </button>
        <button onClick={processBatch} disabled={processing}>
          {processing ? 'Processing...' : 'Process Batch (1000 items)'}
        </button>
        {state.items.length > 0 && (
          <div style={{ marginTop: '1rem', maxHeight: '200px', overflow: 'auto' }}>
            <p>Items: {state.items.slice(0, 20).join(', ')}{state.items.length > 20 ? '...' : ''}</p>
          </div>
        )}
      </div>

      {processing && (
        <div className="example-section" style={{ background: '#d1ecf1', borderColor: '#0c5460' }}>
          <p style={{ color: '#0c5460' }}>Processing in worker...</p>
        </div>
      )}

      <div className="example-section">
        <h3>Code Example</h3>
        <pre>
          <code>{`import { createStore } from '@titanstate/core';
import { WorkerBridge } from '@titanstate/worker';

// Create store and worker bridge
const store = createStore();
const workerBridge = new WorkerBridge({ scriptUrl: '/worker.js' });
workerBridge.start('/worker.js');

// Register reducer in worker
registerWorkerReducer('main', (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
});

// Dispatch to worker
const newState = await workerBridge.dispatchToWorker(
  'main',
  { type: 'INCREMENT' },
  currentState
);

// Update store with result
store.set(stateAtom, newState);`}</code>
        </pre>
      </div>
    </div>
  );
}

