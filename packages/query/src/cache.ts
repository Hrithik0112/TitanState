/**
 * Cache management system
 */

import type { CacheEntry, QueryKey, EvictionStrategy } from './types';
import { applyEviction, calculateEntrySize } from './eviction';

/**
 * Serialize query key to string
 */
function serializeKey(key: QueryKey): string {
  if (typeof key === 'string') {
    return key;
  }
  return JSON.stringify(key);
}

/**
 * Cache manager
 */
export class QueryCache {
  private cache = new Map<string, CacheEntry>();
  private strategy: EvictionStrategy = 'lru';
  private maxSize: number | undefined;
  private defaultStaleTime: number;
  private defaultCacheTime: number;
  
  constructor(config: {
    strategy?: EvictionStrategy;
    maxSize?: number;
    defaultStaleTime?: number;
    defaultCacheTime?: number;
  } = {}) {
    this.strategy = config.strategy ?? 'lru';
    this.maxSize = config.maxSize;
    this.defaultStaleTime = config.defaultStaleTime ?? 0;
    this.defaultCacheTime = config.defaultCacheTime ?? 5 * 60 * 1000; // 5 minutes
  }
  
  /**
   * Get entry from cache
   */
  get<TData = unknown>(key: QueryKey): CacheEntry<TData> | null {
    const serializedKey = serializeKey(key);
    const entry = this.cache.get(serializedKey);
    
    if (!entry) {
      return null;
    }
    
    // Check if expired
    if (entry.cacheTime < Date.now()) {
      this.delete(key);
      return null;
    }
    
    // Update access metadata
    entry.lastAccessed = Date.now();
    entry.accessCount = (entry.accessCount ?? 0) + 1;
    
    return entry as CacheEntry<TData>;
  }
  
  /**
   * Set entry in cache
   */
  set<TData = unknown>(
    key: QueryKey,
    data: TData,
    options: {
      staleTime?: number;
      cacheTime?: number;
    } = {}
  ): void {
    const serializedKey = serializeKey(key);
    const now = Date.now();
    
    const staleTime = options.staleTime ?? this.defaultStaleTime;
    const cacheTime = options.cacheTime ?? this.defaultCacheTime;
    
    const entry: CacheEntry<TData> = {
      key,
      data,
      timestamp: now,
      staleTime: now + staleTime,
      cacheTime: now + cacheTime,
      lastAccessed: now,
      accessCount: 1,
      size: undefined, // Will be calculated
    };
    
    // Calculate size
    entry.size = calculateEntrySize(entry);
    
    // Check if we need to evict
    if (this.maxSize !== undefined) {
      const currentSize = this.getTotalSize();
      if (currentSize + entry.size > this.maxSize) {
        this.evict();
      }
    }
    
    this.cache.set(serializedKey, entry);
  }
  
  /**
   * Delete entry from cache
   */
  delete(key: QueryKey): void {
    const serializedKey = serializeKey(key);
    this.cache.delete(serializedKey);
  }
  
  /**
   * Check if entry exists and is valid
   */
  has(key: QueryKey): boolean {
    const entry = this.get(key);
    return entry !== null;
  }
  
  /**
   * Check if entry is stale
   */
  isStale(key: QueryKey): boolean {
    const entry = this.get(key);
    if (!entry) {
      return true;
    }
    return entry.staleTime < Date.now();
  }
  
  /**
   * Invalidate entry (mark as stale)
   */
  invalidate(key: QueryKey): void {
    const serializedKey = serializeKey(key);
    const entry = this.cache.get(serializedKey);
    
    if (entry) {
      entry.staleTime = 0; // Immediately stale
    }
  }
  
  /**
   * Clear all entries
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get all entries
   */
  getAll(): CacheEntry[] {
    return Array.from(this.cache.values());
  }
  
  /**
   * Get total cache size
   */
  getTotalSize(): number {
    let total = 0;
    for (const entry of this.cache.values()) {
      total += entry.size ?? 0;
    }
    return total;
  }
  
  /**
   * Evict entries based on strategy
   */
  private evict(): void {
    const entries = this.getAll();
    const toEvict = applyEviction(entries, this.strategy, this.maxSize);
    
    for (const entry of toEvict) {
      this.delete(entry.key);
    }
  }
  
  /**
   * Set eviction strategy
   */
  setStrategy(strategy: EvictionStrategy): void {
    this.strategy = strategy;
  }
  
  /**
   * Set max size
   */
  setMaxSize(maxSize: number): void {
    this.maxSize = maxSize;
    
    // Evict if over limit
    if (this.getTotalSize() > maxSize) {
      this.evict();
    }
  }
}

