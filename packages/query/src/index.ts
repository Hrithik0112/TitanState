/**
 * @titanstate/query - Query client for TitanState
 * 
 * Main entry point for query functionality
 */

// Client
export { QueryClient } from './client';
export type { QueryClientConfig } from './client';

// Cache
export { QueryCache } from './cache';

// Eviction
export {
  evictLRU,
  evictLFU,
  evictTTL,
  evictSize,
  applyEviction,
  calculateEntrySize,
} from './eviction';

// Hooks
export { useQuery, useMutation } from './hooks';

// Context
export { QueryClientProvider, useQueryClient } from './context';
export type { QueryClientProviderProps } from './context';

// Types
export type {
  QueryKey,
  QueryFunction,
  MutationFunction,
  QueryStatus,
  QueryResult,
  MutationResult,
  QueryOptions,
  MutationOptions,
  CacheEntry,
  EvictionStrategy,
} from './types';

