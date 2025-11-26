/**
 * Worker entry point - runs inside web worker
 */

import type {
  WorkerMessage,
  DispatchMessage,
  ResultMessage,
  ErrorMessage,
  WorkerReducer,
} from './types';
import { generatePatches } from './patch';

/**
 * Reducer registry inside worker
 */
const workerReducers = new Map<string, WorkerReducer>();

/**
 * Current state for each namespace
 */
const workerState = new Map<string, unknown>();

/**
 * Handle messages from main thread
 */
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;
  
  try {
    handleMessage(message);
  } catch (error) {
    const errorMessage: ErrorMessage = {
      id: message.id,
      type: 'error',
      timestamp: Date.now(),
      error: {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      },
    };
    
    self.postMessage(errorMessage);
  }
};

/**
 * Handle incoming message
 */
async function handleMessage(message: WorkerMessage): Promise<void> {
  switch (message.type) {
    case 'dispatch': {
      const dispatchMsg = message as DispatchMessage;
      await handleDispatch(dispatchMsg);
      break;
    }
    
    case 'register-reducer': {
      // Reducer registration is handled by the main thread
      // This is just for acknowledgment
      const result: ResultMessage = {
        id: message.id,
        type: 'result',
        namespace: '',
        result: { success: true },
        timestamp: Date.now(),
      };
      self.postMessage(result);
      break;
    }
    
    case 'ping': {
      // Health check
      const pong: WorkerMessage = {
        id: message.id,
        type: 'pong',
        timestamp: Date.now(),
      };
      self.postMessage(pong);
      break;
    }
    
    default:
      throw new Error(`Unknown message type: ${message.type}`);
  }
}

/**
 * Handle dispatch message
 */
async function handleDispatch(message: DispatchMessage): Promise<void> {
  const { namespace, action, state } = message;
  
  // Get or initialize state for namespace
  let currentState = workerState.get(namespace);
  if (currentState === undefined && state !== undefined) {
    currentState = state;
    workerState.set(namespace, currentState);
  }
  
  // Get reducer for namespace
  const reducer = workerReducers.get(namespace);
  
  if (!reducer) {
    throw new Error(`No reducer registered for namespace: ${namespace}`);
  }
  
  // Execute reducer
  const newState = await reducer(currentState ?? {}, action);
  
  // Update state
  workerState.set(namespace, newState);
  
  // Generate patches if we had previous state
  const patches = currentState !== undefined
    ? generatePatches(currentState, newState)
    : undefined;
  
  // Send result back
  const result: ResultMessage = {
    id: message.id,
    type: 'result',
    namespace,
    result: newState,
    patches,
    timestamp: Date.now(),
  };
  
  self.postMessage(result);
}

/**
 * Register reducer in worker (called from main thread via special message)
 * This is a simplified version - in practice, you'd send the reducer code
 * or register it differently
 */
export function registerWorkerReducer(
  namespace: string,
  reducer: WorkerReducer
): void {
  workerReducers.set(namespace, reducer);
}

/**
 * Get current state for namespace
 */
export function getWorkerState(namespace: string): unknown {
  return workerState.get(namespace);
}

