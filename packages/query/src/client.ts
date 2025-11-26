/**
 * Query client implementation
 */

import type {
  QueryKey,
  QueryFunction,
  QueryOptions,
} from './types';
import { QueryCache } from './cache';
import type { Driver } from '@titanstate/persist';

/**
 * Query client configuration
 */
export interface QueryClientConfig {
  /**
   * Default stale time in milliseconds
   */
  defaultStaleTime?: number;
  
  /**
   * Default cache time in milliseconds
   */
  defaultCacheTime?: number;
  
  /**
   * Maximum cache size in bytes
   */
  maxSize?: number;
  
  /**
   * Eviction strategy
   */
  evictionStrategy?: 'lru' | 'lfu' | 'ttl' | 'size' | 'none';
  
  /**
   * Persistence driver
   */
  persistenceDriver?: Driver;
  
  /**
   * Enable refetch on window focus
   */
  refetchOnWindowFocus?: boolean;
  
  /**
   * Enable refetch on reconnect
   */
  refetchOnReconnect?: boolean;
}

/**
 * Query client
 */
export class QueryClient {
  private cache: QueryCache;
  private persistenceDriver?: Driver;
  private refetchOnWindowFocus: boolean;
  private refetchOnReconnect: boolean;
  private activeQueries = new Map<string, Promise<unknown>>();
  
  constructor(config: QueryClientConfig = {}) {
    this.cache = new QueryCache({
      strategy: config.evictionStrategy ?? 'lru',
      maxSize: config.maxSize,
      defaultStaleTime: config.defaultStaleTime ?? 0,
      defaultCacheTime: config.defaultCacheTime ?? 5 * 60 * 1000,
    });
    
    this.persistenceDriver = config.persistenceDriver;
    this.refetchOnWindowFocus = config.refetchOnWindowFocus ?? true;
    this.refetchOnReconnect = config.refetchOnReconnect ?? true;
    
    // Set up window focus and reconnect listeners
    if (typeof window !== 'undefined') {
      if (this.refetchOnWindowFocus) {
        window.addEventListener('focus', () => {
          this.refetchStaleQueries();
        });
      }
      
      if (this.refetchOnReconnect) {
        window.addEventListener('online', () => {
          this.refetchStaleQueries();
        });
      }
    }
  }
  
  /**
   * Fetch query data
   */
  async fetchQuery<TData = unknown>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TData>,
    options: QueryOptions<TData> = {}
  ): Promise<TData> {
    const serializedKey = this.serializeKey(queryKey);
    
    // Check cache first
    const cached = this.cache.get<TData>(queryKey);
    if (cached && !this.cache.isStale(queryKey) && !options.stream) {
      return cached.data;
    }
    
    // Check if query is already in progress
    const existingPromise = this.activeQueries.get(serializedKey);
    if (existingPromise) {
      return existingPromise as Promise<TData>;
    }
    
    // Execute query
    const promise = (async () => {
      try {
        // Check persistence first if enabled
        if (this.persistenceDriver && options.persistence) {
          const persisted = await this.persistenceDriver.get(
            options.persistence.key ?? serializedKey
          );
          if (persisted) {
            const data = persisted as TData;
            this.cache.set(queryKey, data, {
              staleTime: options.staleTime,
              cacheTime: options.cacheTime,
            });
            return data;
          }
        }
        
        // Fetch from query function
        const data = await queryFn();
        
        // Cache the result
        this.cache.set(queryKey, data, {
          staleTime: options.staleTime,
          cacheTime: options.cacheTime,
        });
        
        // Persist if enabled
        if (this.persistenceDriver && options.persistence) {
          await this.persistenceDriver.put(
            options.persistence.key ?? serializedKey,
            data,
            {
              compress: options.persistence.compress,
            }
          );
        }
        
        return data;
      } finally {
        this.activeQueries.delete(serializedKey);
      }
    })();
    
    this.activeQueries.set(serializedKey, promise);
    return promise;
  }
  
  /**
   * Prefetch query
   */
  async prefetchQuery<TData = unknown>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TData>,
    options: QueryOptions<TData> = {}
  ): Promise<void> {
    await this.fetchQuery(queryKey, queryFn, options);
  }
  
  /**
   * Invalidate query
   */
  invalidateQuery(queryKey: QueryKey): void {
    this.cache.invalidate(queryKey);
  }
  
  /**
   * Remove query from cache
   */
  removeQuery(queryKey: QueryKey): void {
    this.cache.delete(queryKey);
  }
  
  /**
   * Get query data
   */
  getQueryData<TData = unknown>(queryKey: QueryKey): TData | undefined {
    const entry = this.cache.get<TData>(queryKey);
    return entry?.data;
  }
  
  /**
   * Set query data
   */
  setQueryData<TData = unknown>(
    queryKey: QueryKey,
    data: TData,
    options?: QueryOptions<TData>
  ): void {
    this.cache.set(queryKey, data, {
      staleTime: options?.staleTime,
      cacheTime: options?.cacheTime,
    });
  }
  
  /**
   * Refetch stale queries
   */
  private async refetchStaleQueries(): Promise<void> {
    // This would need to be implemented with query observers
    // For now, it's a placeholder
  }
  
  /**
   * Serialize query key
   */
  private serializeKey(key: QueryKey): string {
    if (typeof key === 'string') {
      return key;
    }
    return JSON.stringify(key);
  }
  
  /**
   * Get cache instance
   */
  getCache(): QueryCache {
    return this.cache;
  }
}

