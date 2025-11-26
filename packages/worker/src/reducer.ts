/**
 * Worker reducer registration and management
 */

import type {
  WorkerReducer,
  WorkerReducerHandle,
  Action,
} from './types';
import { WorkerBridge } from './bridge';
import { generatePatches } from './patch';

/**
 * Reducer registry
 */
class ReducerRegistry {
  private reducers = new Map<string, WorkerReducer>();
  private bridge: WorkerBridge | null = null;
  
  /**
   * Set the worker bridge
   */
  setBridge(bridge: WorkerBridge): void {
    this.bridge = bridge;
  }
  
  /**
   * Register a reducer
   */
  registerReducer<S = unknown, A = Action>(
    namespace: string,
    reducer: WorkerReducer<S, A>
  ): WorkerReducerHandle {
    const reducerId = `${namespace}_${Date.now()}_${Math.random()}`;
    const key = `${namespace}:${reducerId}`;
    
    this.reducers.set(key, reducer as WorkerReducer);
    
    // If bridge is available, register with worker
    if (this.bridge) {
      // Send registration message to worker
      // This will be handled by the worker entry point
      this.bridge.dispatchToWorker(namespace, {
        type: 'register-reducer',
        payload: { reducerId },
      } as Action).catch(error => {
        console.error('Failed to register reducer with worker:', error);
      });
    }
    
    return {
      namespace,
      reducerId,
      dispatch: async (action: Action) => {
        return this.dispatch(namespace, reducerId, action);
      },
    };
  }
  
  /**
   * Dispatch action to reducer
   */
  async dispatch(
    namespace: string,
    reducerId: string,
    action: Action
  ): Promise<unknown> {
    const key = `${namespace}:${reducerId}`;
    const reducer = this.reducers.get(key);
    
    if (!reducer) {
      throw new Error(`Reducer not found: ${key}`);
    }
    
    // If bridge is available, dispatch to worker
    if (this.bridge) {
      try {
        const result = await this.bridge.dispatchToWorker(namespace, action);
        return result;
      } catch (error) {
        console.warn('Worker dispatch failed, falling back to main thread:', error);
        // Fallback to main thread execution
      }
    }
    
    // Execute reducer on main thread (fallback)
    // Note: This is not ideal for heavy computations, but provides fallback
    const state = {}; // Initial state - in practice, this would come from store
    const newState = await reducer(state, action);
    
    // Generate patches for the state change
    const patches = generatePatches(state, newState);
    
    return {
      state: newState,
      patches,
    };
  }
  
  /**
   * Get reducer by key
   */
  getReducer(key: string): WorkerReducer | undefined {
    return this.reducers.get(key);
  }
  
  /**
   * Unregister reducer
   */
  unregisterReducer(namespace: string, reducerId: string): void {
    const key = `${namespace}:${reducerId}`;
    this.reducers.delete(key);
  }
}

// Global reducer registry instance
const reducerRegistry = new ReducerRegistry();

/**
 * Register a worker reducer
 */
export function registerWorkerReducer<S = unknown, A = Action>(
  namespace: string,
  reducer: WorkerReducer<S, A>
): WorkerReducerHandle {
  return reducerRegistry.registerReducer(namespace, reducer);
}

/**
 * Dispatch action to worker reducer
 */
export async function dispatchToWorker(
  namespace: string,
  action: Action
): Promise<unknown> {
  // This is a simplified version - in practice, you'd need to know the reducerId
  // For now, we'll use the namespace as the key
  const key = `${namespace}:default`;
  const reducer = reducerRegistry.getReducer(key);
  
  if (!reducer) {
    throw new Error(`No reducer registered for namespace: ${namespace}`);
  }
  
  return reducerRegistry.dispatch(namespace, 'default', action);
}

/**
 * Set the worker bridge for the reducer registry
 */
export function setWorkerBridge(bridge: WorkerBridge): void {
  reducerRegistry.setBridge(bridge);
}

