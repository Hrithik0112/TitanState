/**
 * Query-specific types
 */

/**
 * Query key - can be a string or array
 */
export type QueryKey = string | readonly unknown[];

/**
 * Query function
 */
export type QueryFunction<T = unknown> = (...args: unknown[]) => Promise<T> | T;

/**
 * Mutation function
 */
export type MutationFunction<TData = unknown, TVariables = unknown> = (
  variables: TVariables
) => Promise<TData>;

/**
 * Query status
 */
export type QueryStatus = 'idle' | 'loading' | 'error' | 'success';

/**
 * Query result
 */
export interface QueryResult<TData = unknown> {
  data: TData | undefined;
  error: Error | null;
  status: QueryStatus;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isIdle: boolean;
  refetch: () => Promise<TData>;
}

/**
 * Mutation result
 */
export interface MutationResult<TData = unknown, TVariables = unknown> {
  data: TData | undefined;
  error: Error | null;
  status: QueryStatus;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isIdle: boolean;
  mutate: (variables: TVariables) => Promise<TData>;
  reset: () => void;
}

/**
 * Query options
 */
export interface QueryOptions<_TData = unknown> {
  /**
   * Time in milliseconds after which data is considered stale
   */
  staleTime?: number;
  
  /**
   * Time in milliseconds to keep unused data in cache
   */
  cacheTime?: number;
  
  /**
   * Maximum cache size in bytes
   */
  maxSize?: number;
  
  /**
   * Enable streaming
   */
  stream?: boolean;
  
  /**
   * Persistence options
   */
  persistence?: {
    driver?: 'indexeddb' | 'memory' | 'fs' | 'remote';
    key?: string;
    compress?: boolean;
  };
  
  /**
   * Retry options
   */
  retry?: boolean | number;
  
  /**
   * Retry delay in milliseconds
   */
  retryDelay?: number;
  
  /**
   * Refetch on window focus
   */
  refetchOnWindowFocus?: boolean;
  
  /**
   * Refetch on reconnect
   */
  refetchOnReconnect?: boolean;
  
  /**
   * Enabled - if false, query won't execute
   */
  enabled?: boolean;
}

/**
 * Mutation options
 */
export interface MutationOptions<TData = unknown, TVariables = unknown> {
  /**
   * On success callback
   */
  onSuccess?: (data: TData, variables: TVariables) => void;
  
  /**
   * On error callback
   */
  onError?: (error: Error, variables: TVariables) => void;
  
  /**
   * Retry options
   */
  retry?: boolean | number;
  
  /**
   * Retry delay in milliseconds
   */
  retryDelay?: number;
}

/**
 * Cache entry
 */
export interface CacheEntry<TData = unknown> {
  /**
   * Query key
   */
  key: QueryKey;
  
  /**
   * Cached data
   */
  data: TData;
  
  /**
   * Timestamp when data was fetched
   */
  timestamp: number;
  
  /**
   * Timestamp when data becomes stale
   */
  staleTime: number;
  
  /**
   * Timestamp when data should be removed from cache
   */
  cacheTime: number;
  
  /**
   * Size in bytes (approximate)
   */
  size?: number;
  
  /**
   * Access count (for LFU)
   */
  accessCount?: number;
  
  /**
   * Last accessed timestamp (for LRU)
   */
  lastAccessed?: number;
}

/**
 * Eviction strategy type
 */
export type EvictionStrategy = 'lru' | 'lfu' | 'ttl' | 'size' | 'none';

