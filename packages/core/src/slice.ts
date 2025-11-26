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
   * Action creators (RTK-compatible)
   */
  actions?: Record<string, (payload?: unknown) => A>;
  
  /**
   * Combined reducer (RTK-compatible)
   */
  reducer?: Reducer<S, A>;
  
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
 * 
 * Enhanced to support RTK-style reducers with action creators
 */
export function createSlice<S = unknown, A extends Action = Action>(
  config: SliceConfig<S, A>
): Slice<S, A> & {
  actions: Record<string, (payload?: unknown) => A>;
  reducer: Reducer<S, A>;
} {
  const { name, initialState, reducers } = config;
  
  // Create root atom for the slice
  const atom = createAtom(`slice:${name}`, initialState, {
    persisted: false, // Slices are not persisted by default
  });
  
  // Store reference to atom value for synchronous access
  let currentState = initialState;
  
  // Create action creators from reducers
  const actions: Record<string, (payload?: unknown) => A> = {};
  for (const [reducerName, reducer] of Object.entries(reducers)) {
    actions[reducerName] = (payload?: unknown) => ({
      type: `${name}/${reducerName}`,
      payload,
    } as A);
  }
  
  // Create combined reducer
  const reducer: Reducer<S, A> = (state: S = initialState, action: A): S => {
    // Extract reducer name from action type (format: "sliceName/reducerName")
    const actionType = action.type as string;
    if (actionType.startsWith(`${name}/`)) {
      const reducerName = actionType.slice(`${name}/`.length);
      const reducerFn = reducers[reducerName];
      if (reducerFn) {
        return reducerFn(state, action);
      }
    }
    return state;
  };
  
  const slice: Slice<S, A> & {
    actions: Record<string, (payload?: unknown) => A>;
    reducer: Reducer<S, A>;
  } = {
    name,
    atom,
    reducers,
    actions,
    reducer,
    
    getState(): S {
      return currentState;
    },
    
    dispatch(action: A): S {
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

