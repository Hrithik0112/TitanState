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

// RTK Compatibility
export {
  configureStore,
  createAction,
  createReducer,
  createAsyncThunk,
} from './rtk-compat';
export type {
  RTKStore,
  ConfigureStoreOptions,
  CaseReducer,
  CaseReducers,
  ReducerBuilder,
  AsyncThunkOptions,
} from './rtk-compat';

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

// Middleware
export {
  applyMiddleware,
  composeMiddleware,
  loggerMiddleware,
  thunkMiddleware,
} from './middleware';
export type { Middleware, MiddlewareAPI } from './middleware';

// Internal (for advanced use cases)
export { SubscriptionManager } from './subscription';
export { Scheduler } from './scheduler';

