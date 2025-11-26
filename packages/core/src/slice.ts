/**
 * Slice creation for RTK compatibility
 */

import type { SliceConfig, Reducer, Action } from '@titanstate/types';
import type { Atom } from './types';
import { createAtom } from './atom';

/**
 * Slice interface
 */
export interface Slice<S = unknown, A = Action> {
  /**
   * Slice name
   */
  name: string;
  
  /**
   * Root atom for the slice
   */
  atom: Atom<S>;
  
  /**
   * Reducers map
   */
  reducers: Record<string, Reducer<S, A>>;
  
  /**
   * Get current state
   */
  getState(): S;
  
  /**
   * Dispatch an action to the slice
   */
  dispatch(action: A): S;
}

/**
 * Create a slice (RTK-compatible API)
 */
export function createSlice<S = unknown, A extends Action = Action>(
  config: SliceConfig<S, A>
): Slice<S, A> {
  const { name, initialState, reducers } = config;
  
  // Create root atom for the slice
  const atom = createAtom(`slice:${name}`, initialState, {
    persisted: false, // Slices are not persisted by default
  });
  
  // Store reference to atom value for synchronous access
  let currentState = initialState;
  
  const slice: Slice<S, A> = {
    name,
    atom,
    reducers,
    
    getState(): S {
      return currentState;
    },
    
    dispatch(action: A): S {
      const reducer = reducers[action.type];
      
      if (!reducer) {
        console.warn(`No reducer found for action type: ${action.type}`);
        return currentState;
      }
      
      // Apply reducer
      const newState = reducer(currentState, action);
      
      // Update atom value
      atom.value = newState;
      currentState = newState;
      atom.meta.hydrated = true;
      atom.meta.lastAccessed = Date.now();
      
      return newState;
    },
  };
  
  return slice;
}

