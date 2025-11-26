/**
 * Middleware system for TitanState
 */

import type { Store } from './types';
import type { Action } from '@titanstate/types';

/**
 * Middleware function type
 * 
 * @param action - The action being dispatched
 * @param store - The store instance
 * @param next - Function to call the next middleware or final dispatch
 * @returns The result of the dispatch chain
 */
export type Middleware = (
  action: Action,
  store: Store,
  next: (action: Action) => unknown
) => unknown;

/**
 * Middleware API (similar to Redux middleware API)
 */
export interface MiddlewareAPI {
  /**
   * Get the store instance
   */
  getStore(): Store;
  
  /**
   * Dispatch an action (will go through middleware chain)
   */
  dispatch(action: Action): unknown;
  
  /**
   * Get state from an atom (synchronous)
   */
  getState<T>(atom: import('./types').Atom<T>): T | undefined;
}

/**
 * Create middleware API
 */
function createMiddlewareAPI(store: Store, dispatch: (action: Action) => unknown): MiddlewareAPI {
  return {
    getStore() {
      return store;
    },
    dispatch(action: Action) {
      return dispatch(action);
    },
    getState<T>(atom: import('./types').Atom<T>): T | undefined {
      return store.get(atom);
    },
  };
}

/**
 * Compose middleware functions
 */
export function composeMiddleware(middlewares: Middleware[]): (store: Store, dispatch: (action: Action) => unknown) => (action: Action) => unknown {
  if (middlewares.length === 0) {
    return (_store, dispatch) => dispatch;
  }
  
  if (middlewares.length === 1) {
    return (store, dispatch) => {
      const middleware = middlewares[0];
      if (!middleware) {
        return dispatch;
      }
      return (action: Action) => {
        return middleware(action, store, dispatch);
      };
    };
  }
  
  return (_store, dispatch) => {
    // Create the dispatch chain
    const chain = middlewares.map(middleware => {
      return (next: (action: Action) => unknown) => {
        return (action: Action) => {
          return middleware(action, _store, next);
        };
      };
    });
    
    // Compose the chain
    let composed = dispatch;
    for (let i = chain.length - 1; i >= 0; i--) {
      const chainFn = chain[i];
      if (chainFn) {
        composed = chainFn(composed);
      }
    }
    
    return composed;
  };
}

/**
 * Apply middleware to a store
 */
export function applyMiddleware(...middlewares: Middleware[]): (store: Store) => Store {
  return (store: Store) => {
    // Create original dispatch
    const originalDispatch = (action: Action) => {
      // Default dispatch behavior (can be overridden by middleware)
      return action;
    };
    
    // Compose middleware
    const composedDispatch = composeMiddleware(middlewares)(store, originalDispatch);
    
    // Create enhanced store with middleware
    return {
      ...store,
      dispatch(action: unknown) {
        return composedDispatch(action as Action);
      },
    };
  };
}

/**
 * Logger middleware (for debugging)
 */
export function loggerMiddleware(): Middleware {
  return (action, store, next) => {
    const startTime = Date.now();
    console.group(`[TitanState] Dispatching action: ${action.type}`);
    console.log('Action:', action);
    console.log('Store:', store);
    
    const result = next(action);
    
    const duration = Date.now() - startTime;
    console.log(`[TitanState] Action completed in ${duration}ms`);
    console.groupEnd();
    
    return result;
  };
}

/**
 * Thunk middleware (for async actions)
 */
export function thunkMiddleware(): Middleware {
  return (action, store, next) => {
    // If action is a function, call it with store API
    if (typeof action === 'function') {
      const api = createMiddlewareAPI(store, next);
      return (action as (api: MiddlewareAPI) => unknown)(api);
    }
    
    // Otherwise, pass to next middleware
    return next(action);
  };
}

