/**
 * Redux Toolkit (RTK) Compatibility Layer
 * 
 * Provides RTK-compatible APIs for easier migration from Redux Toolkit
 */

import type { Action, Reducer } from '@titanstate/types';
import type { Store } from './types';
import { createSlice, type Slice } from './slice';
import { createStore } from './store';
import type { StoreConfig } from '@titanstate/types';

/**
 * RTK-compatible store configuration
 */
export interface ConfigureStoreOptions<S = unknown> {
  /**
   * Root reducer (object of slice reducers or a single reducer)
   */
  reducer: Record<string, Reducer<unknown, Action>> | Reducer<S, Action>;
  
  /**
   * Preloaded state
   */
  preloadedState?: Partial<S>;
  
  /**
   * Middleware array
   */
  middleware?: Array<(action: Action, store: unknown, next: (action: Action) => unknown) => unknown>;
  
  /**
   * Enable Redux DevTools (maps to devtoolsBridge)
   */
  devTools?: boolean | {
    enabled?: boolean;
    name?: string;
    trace?: boolean;
  };
  
  /**
   * Additional TitanState store configuration
   */
  enhancers?: Omit<StoreConfig, 'middleware' | 'devtoolsBridge'>;
}

/**
 * RTK-compatible store interface
 */
export interface RTKStore<S = unknown> {
  /**
   * Dispatch an action
   */
  dispatch: (action: Action) => Action;
  
  /**
   * Get current state
   */
  getState: () => S;
  
  /**
   * Subscribe to store changes
   */
  subscribe: (listener: () => void) => () => void;
  
  /**
   * Replace reducer (for code splitting)
   */
  replaceReducer: (nextReducer: Reducer<S, Action>) => void;
  
  /**
   * Get underlying TitanState store
   */
  __titanStateStore: Store;
}

/**
 * Create an action creator (RTK-compatible)
 */
export function createAction<T extends string>(
  type: T
): () => Action<T>;

export function createAction<T extends string, P>(
  type: T,
  prepareAction: (payload: P) => { payload: P }
): (payload: P) => Action<T> & { payload: P };

export function createAction<T extends string, P, M>(
  type: T,
  prepareAction: (payload: P, meta: M) => { payload: P; meta: M }
): (payload: P, meta: M) => Action<T> & { payload: P; meta: M };

export function createAction<T extends string>(
  type: T,
  prepareAction?: (payload: unknown, meta?: unknown) => { payload?: unknown; meta?: unknown }
): ((payload?: unknown, meta?: unknown) => Action<T>) {
  function actionCreator(payload?: unknown, meta?: unknown): Action<T> {
    if (prepareAction) {
      const prepared = prepareAction(payload, meta);
      return {
        type,
        payload: prepared.payload,
        meta: prepared.meta as Record<string, unknown>,
      } as Action<T>;
    }
    
    return {
      type,
      payload,
      meta: meta as Record<string, unknown> | undefined,
    } as Action<T>;
  }
  
  actionCreator.type = type;
  actionCreator.toString = () => type;
  
  return actionCreator as any;
}

/**
 * Create a reducer with builder pattern (RTK-compatible)
 */
export interface CaseReducer<S, A extends Action> {
  (state: S, action: A): S;
}

export interface CaseReducers<S, A extends Action> {
  [key: string]: CaseReducer<S, A>;
}

export interface ReducerBuilder<S, A extends Action> {
  addCase: (actionCreator: string | (() => Action), reducer: CaseReducer<S, A>) => ReducerBuilder<S, A>;
  addMatcher: (matcher: (action: Action) => boolean, reducer: CaseReducer<S, A>) => ReducerBuilder<S, A>;
  addDefaultCase: (reducer: CaseReducer<S, A>) => ReducerBuilder<S, A>;
}

/**
 * Create a reducer (RTK-compatible)
 */
export function createReducer<S, A extends Action = Action>(
  initialState: S,
  builderCallback: (builder: ReducerBuilder<S, A>) => void
): Reducer<S, A>;

export function createReducer<S, A extends Action = Action>(
  initialState: S,
  actionsMap: CaseReducers<S, A>
): Reducer<S, A>;

export function createReducer<S, A extends Action = Action>(
  initialState: S,
  builderOrMap: ((builder: ReducerBuilder<S, A>) => void) | CaseReducers<S, A>
): Reducer<S, A> {
  if (typeof builderOrMap === 'function') {
    // Builder pattern
    const actionsMap: CaseReducers<S, A> = {};
    const matchers: Array<{ matcher: (action: Action) => boolean; reducer: CaseReducer<S, A> }> = [];
    let defaultCase: CaseReducer<S, A> | undefined;
    
    const builder: ReducerBuilder<S, A> = {
      addCase(actionCreator, reducer) {
        let type: string;
        if (typeof actionCreator === 'string') {
          type = actionCreator;
        } else if (typeof actionCreator === 'function') {
          const actionFn = actionCreator as any;
          type = actionFn.type || String(actionCreator);
        } else {
          type = String(actionCreator);
        }
        actionsMap[type] = reducer;
        return builder;
      },
      addMatcher(matcher, reducer) {
        matchers.push({ matcher, reducer });
        return builder;
      },
      addDefaultCase(reducer) {
        defaultCase = reducer;
        return builder;
      },
    };
    
    builderOrMap(builder);
    
    // Build the reducer from collected cases
    return (state: S = initialState, action: A): S => {
      // Check exact match first
      const actionType = String(action.type);
      const reducer = actionsMap[actionType];
      if (reducer) {
        return reducer(state, action);
      }
      
      // Check matchers
      for (const { matcher, reducer } of matchers) {
        if (matcher(action)) {
          return reducer(state, action);
        }
      }
      
      // Default case
      if (defaultCase) {
        return defaultCase(state, action);
      }
      
      return state;
    };
  } else {
    // Simple map
    return (state: S = initialState, action: A): S => {
      const reducer = builderOrMap[action.type];
      if (reducer) {
        return reducer(state, action);
      }
      return state;
    };
  }
}

/**
 * Configure store (RTK-compatible)
 */
export function configureStore<S = unknown>(
  options: ConfigureStoreOptions<S>
): RTKStore<S> {
  const { reducer, preloadedState, middleware = [], devTools, enhancers = {} } = options;
  
  // Convert reducer map to slices
  const slices: Slice[] = [];
  const reducerMap = typeof reducer === 'object' ? reducer : { root: reducer };
  
  // Create slices for each reducer
  for (const [key, reducerFn] of Object.entries(reducerMap)) {
    const slice = createSlice({
      name: key,
      initialState: preloadedState?.[key as keyof S] ?? (typeof reducerFn === 'function' ? undefined : reducerFn),
      reducers: {
        // For now, we'll use a generic reducer wrapper
        // In a full implementation, we'd analyze the reducer to extract action types
        [key]: reducerFn as Reducer<unknown, Action>,
      },
    });
    slices.push(slice);
  }
  
  // Setup DevTools if enabled
  let devtoolsBridge = (enhancers as any).devtoolsBridge;
  if (devTools && !devtoolsBridge) {
    // Try to import DevTools bridge
    try {
      // @ts-ignore - Dynamic import
      import('@titanstate/devtools').then(({ DevToolsBridge }) => {
        devtoolsBridge = new DevToolsBridge({
          enabled: typeof devTools === 'boolean' ? devTools : devTools.enabled !== false,
        });
      }).catch(() => {
        // DevTools not available
      });
    } catch {
      // DevTools not available
    }
  }
  
  // Create TitanState store
  const store = createStore({
    ...enhancers,
    middleware,
    devtoolsBridge: devtoolsBridge as any,
  });
  
  // Register slices with store
  const sliceMap = new Map<string, Slice>();
  for (const slice of slices) {
    store.createAtom(slice.atom.key, slice.getState());
    sliceMap.set(slice.name, slice);
  }
  
  // Create RTK-compatible store interface
  const rtkStore: RTKStore<S> = {
    dispatch(action: Action): Action {
      // Find matching slice and dispatch
      for (const slice of slices) {
        if (slice.reducers[action.type]) {
          slice.dispatch(action as any);
          // Notify store subscribers
          store.set(slice.atom, slice.getState());
          break;
        }
      }
      
      // Also dispatch through store middleware
      store.dispatch(action);
      
      return action;
    },
    
    getState(): S {
      const state: any = {};
      for (const slice of slices) {
        state[slice.name] = slice.getState();
      }
      return state as S;
    },
    
    subscribe(listener: () => void): () => void {
      const unsubscribes: (() => void)[] = [];
      
      // Subscribe to all slices
      for (const slice of slices) {
        const unsubscribe = store.subscribe(slice.atom, () => {
          listener();
        });
        unsubscribes.push(unsubscribe);
      }
      
      return () => {
        for (const unsubscribe of unsubscribes) {
          unsubscribe();
        }
      };
    },
    
    replaceReducer(_nextReducer: Reducer<S, Action>): void {
      // Replace reducer implementation
      // This is a simplified version - in production, you'd need to
      // properly handle reducer replacement
      console.warn('replaceReducer is not fully implemented in RTK compatibility layer');
    },
    
    __titanStateStore: store,
  };
  
  return rtkStore;
}

/**
 * Create async thunk (RTK-compatible)
 */
export interface AsyncThunkOptions {
  condition?: (arg: unknown, { getState }: { getState: () => unknown }) => boolean;
  dispatchConditionRejection?: boolean;
}

export function createAsyncThunk<
  Returned,
  ThunkArg = void,
  ThunkApiConfig extends { state?: unknown; dispatch?: unknown; extra?: unknown } = {}
>(
  typePrefix: string,
  payloadCreator: (
    arg: ThunkArg,
    thunkAPI: {
      dispatch: (action: Action) => unknown;
      getState: () => ThunkApiConfig['state'];
      extra: ThunkApiConfig['extra'];
      rejectWithValue: <T>(value: T) => T;
      fulfillWithValue: <T>(value: T) => T;
    }
  ) => Promise<Returned>
): (arg: ThunkArg) => (dispatch: (action: Action) => unknown, getState: () => ThunkApiConfig['state'], extra: ThunkApiConfig['extra']) => Promise<Returned> {
  const pending = createAction(`${typePrefix}/pending`);
  const fulfilled = createAction(`${typePrefix}/fulfilled`, (payload: Returned) => ({ payload }));
  const rejected = createAction(`${typePrefix}/rejected`, (payload: unknown) => ({ payload }));
  
  return (arg: ThunkArg) => {
    return async (dispatch: (action: Action) => unknown, getState: () => ThunkApiConfig['state'], extra: ThunkApiConfig['extra']) => {
      const pendingAction = pending() as Action;
      dispatch(pendingAction);
      
      try {
        const result = await payloadCreator(arg, {
          dispatch,
          getState,
          extra,
          rejectWithValue: <T>(value: T) => value,
          fulfillWithValue: <T>(value: T) => value,
        });
        
        const fulfilledAction = fulfilled(result) as Action;
        dispatch(fulfilledAction);
        return result;
      } catch (error) {
        const rejectedAction = rejected(error) as Action;
        dispatch(rejectedAction);
        throw error;
      }
    };
  };
}

