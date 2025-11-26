/**
 * Shared TypeScript types for TitanState
 */

/**
 * Atom key identifier
 */
export type AtomKey = string | symbol;

/**
 * Atom value can be any serializable type
 */
export type AtomValue = unknown;

/**
 * Listener function for atom subscriptions
 */
export type Listener<T = AtomValue> = (value: T, previousValue: T | undefined) => void;

/**
 * Unsubscribe function
 */
export type Unsubscribe = () => void;

/**
 * Atom options for configuration
 */
export interface AtomOptions<T = AtomValue> {
  /**
   * Whether this atom should be persisted to storage
   */
  persisted?: boolean;
  
  /**
   * Whether to lazy-load the atom value (don't load until accessed)
   */
  lazyLoad?: boolean;
  
  /**
   * Whether to compress the atom value when persisted
   */
  compress?: boolean;
  
  /**
   * Eviction policy for the atom
   */
  eviction?: EvictionPolicy;
  
  /**
   * Whether this atom contains sensitive data (encrypted at rest)
   */
  sensitive?: boolean;
  
  /**
   * Equality function for determining if value changed
   */
  equals?: (a: T, b: T) => boolean;
}

/**
 * Eviction policy configuration
 */
export interface EvictionPolicy {
  /**
   * Time to live in seconds
   */
  ttl?: number;
  
  /**
   * Maximum size in bytes
   */
  maxSize?: number;
}

/**
 * Store configuration
 */
export interface StoreConfig {
  /**
   * Custom drivers for persistence (optional)
   */
  drivers?: Record<string, unknown>;
  
  /**
   * Worker configuration (optional)
   */
  workers?: {
    /**
     * Number of workers in the pool
     */
    poolSize?: number;
    
    /**
     * Worker script URL
     */
    scriptUrl?: string;
  };
  
  /**
   * Enable devtools integration
   */
  devtools?: boolean;
  
  /**
   * Enable multi-tab synchronization
   */
  multiTab?: boolean;
  
  /**
   * Persistence driver for automatic persistence (optional)
   * When provided, persisted atoms will be automatically saved/loaded
   */
  persistenceDriver?: unknown; // Driver from @titanstate/persist
  
  /**
   * DevTools bridge for automatic event logging (optional)
   * When provided, atom updates will be automatically logged
   */
  devtoolsBridge?: unknown; // DevToolsBridge from @titanstate/devtools
  
  /**
   * Worker bridge for optional worker dispatch (optional)
   * When provided, heavy operations can be dispatched to workers
   */
  workerBridge?: unknown; // WorkerBridge from @titanstate/worker
  
  /**
   * Middleware functions to apply to dispatch (optional)
   * Middleware will be applied in the order provided
   */
  middleware?: Array<(action: Action, store: unknown, next: (action: Action) => unknown) => unknown>;
}

/**
 * Atom metadata stored in the store
 */
export interface AtomMeta {
  /**
   * Storage key for persisted atoms
   */
  key?: string;
  
  /**
   * Whether the atom is currently hydrated (loaded in memory)
   */
  hydrated: boolean;
  
  /**
   * Whether the atom is persisted
   */
  persisted: boolean;
  
  /**
   * Last accessed timestamp
   */
  lastAccessed?: number;
  
  /**
   * Size in bytes (approximate)
   */
  size?: number;
}

/**
 * Internal atom representation
 */
export interface Atom<T = AtomValue> {
  /**
   * Unique key for the atom
   */
  key: AtomKey;
  
  /**
   * Current value (may be undefined if not hydrated)
   */
  value: T | undefined;
  
  /**
   * Atom metadata
   */
  meta: AtomMeta;
  
  /**
   * Atom options
   */
  options: AtomOptions<T>;
}

/**
 * Reducer function type
 */
export type Reducer<S = AtomValue, A = unknown> = (state: S, action: A) => S;

/**
 * Action type
 */
export interface Action<T = string> {
  type: T;
  payload?: unknown;
  meta?: Record<string, unknown>;
}

/**
 * Slice configuration
 */
export interface SliceConfig<S = AtomValue, A = Action> {
  /**
   * Slice name
   */
  name: string;
  
  /**
   * Initial state
   */
  initialState: S;
  
  /**
   * Reducers map
   */
  reducers: Record<string, Reducer<S, A>>;
}

/**
 * Patch operation type
 */
export type PatchOp = 
  | { op: 'set'; path: string; value: unknown }
  | { op: 'delete'; path: string }
  | { op: 'splice'; path: string; index: number; deleteCount: number; items?: unknown[] }
  | { op: 'binary-chunk'; path: string; offset: number; data: ArrayBuffer };

/**
 * Transaction callback
 */
export type TransactionCallback = () => void | Promise<void>;

