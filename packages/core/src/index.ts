/**
 * @titanstate/core - Core store engine
 * 
 * Main entry point for TitanState core functionality
 */

// Store
export { createStore } from './store';
export type { Store } from './types';

// Atoms
export { createAtom, areValuesEqual } from './atom';
export type { Atom } from './types';

// Slices
export { createSlice } from './slice';
export type { Slice } from './slice';

// Types
export type {
  StoreConfig,
  AtomKey,
  AtomValue,
  AtomOptions,
  Listener,
  Unsubscribe,
  TransactionCallback,
  Reducer,
  Action,
  SliceConfig,
  EvictionPolicy,
} from '@titanstate/types';

// Internal (for advanced use cases)
export { SubscriptionManager } from './subscription';
export { Scheduler } from './scheduler';

