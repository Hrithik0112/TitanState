/**
 * Cache eviction strategies
 */

import type { CacheEntry, EvictionStrategy } from './types';

/**
 * LRU (Least Recently Used) eviction
 */
export function evictLRU(entries: CacheEntry[]): CacheEntry | null {
  if (entries.length === 0) {
    return null;
  }
  
  // Find entry with oldest lastAccessed time
  let oldest: CacheEntry | null = entries[0] ?? null;
  if (!oldest) {
    return null;
  }
  
  for (const entry of entries) {
    const entryTime = entry.lastAccessed ?? entry.timestamp;
    const oldestTime = oldest.lastAccessed ?? oldest.timestamp;
    
    if (entryTime < oldestTime) {
      oldest = entry;
    }
  }
  
  return oldest;
}

/**
 * LFU (Least Frequently Used) eviction
 */
export function evictLFU(entries: CacheEntry[]): CacheEntry | null {
  if (entries.length === 0) {
    return null;
  }
  
  // Find entry with lowest access count
  let leastUsed: CacheEntry | null = entries[0] ?? null;
  if (!leastUsed) {
    return null;
  }
  
  for (const entry of entries) {
    const entryCount = entry.accessCount ?? 0;
    const leastCount = leastUsed.accessCount ?? 0;
    
    if (entryCount < leastCount) {
      leastUsed = entry;
    } else if (entryCount === leastCount) {
      // If counts are equal, use LRU as tiebreaker
      const entryTime = entry.lastAccessed ?? entry.timestamp;
      const leastTime = leastUsed.lastAccessed ?? leastUsed.timestamp;
      if (entryTime < leastTime) {
        leastUsed = entry;
      }
    }
  }
  
  return leastUsed;
}

/**
 * TTL (Time To Live) eviction - find expired entries
 */
export function evictTTL(entries: CacheEntry[]): CacheEntry[] {
  const now = Date.now();
  return entries.filter(entry => {
    // Check if cacheTime has expired
    return entry.cacheTime < now;
  });
}

/**
 * Size-based eviction - find largest entries
 */
export function evictSize(entries: CacheEntry[], maxSize: number): CacheEntry[] {
  // Sort by size (largest first)
  const sorted = [...entries].sort((a, b) => {
    const sizeA = a.size ?? 0;
    const sizeB = b.size ?? 0;
    return sizeB - sizeA;
  });
  
  // Calculate total size
  let totalSize = entries.reduce((sum, entry) => sum + (entry.size ?? 0), 0);
  
  // Remove largest entries until under limit
  const toEvict: CacheEntry[] = [];
  for (const entry of sorted) {
    if (totalSize <= maxSize) {
      break;
    }
    toEvict.push(entry);
    totalSize -= entry.size ?? 0;
  }
  
  return toEvict;
}

/**
 * Apply eviction strategy
 */
export function applyEviction(
  entries: CacheEntry[],
  strategy: EvictionStrategy,
  maxSize?: number
): CacheEntry[] {
  if (strategy === 'none' || entries.length === 0) {
    return [];
  }
  
  // First, always evict expired TTL entries
  const expired = evictTTL(entries);
  const remaining = entries.filter(entry => !expired.includes(entry));
  
  if (remaining.length === 0) {
    return expired;
  }
  
  // Apply size-based eviction if maxSize is specified
  if (strategy === 'size' && maxSize !== undefined) {
    const sizeEvicted = evictSize(remaining, maxSize);
    return [...expired, ...sizeEvicted];
  }
  
  // Apply other strategies if needed
  if (strategy === 'lru') {
    const lruEntry = evictLRU(remaining);
    return lruEntry ? [...expired, lruEntry] : expired;
  }
  
  if (strategy === 'lfu') {
    const lfuEntry = evictLFU(remaining);
    return lfuEntry ? [...expired, lfuEntry] : expired;
  }
  
  if (strategy === 'ttl') {
    return expired;
  }
  
  return expired;
}

/**
 * Calculate approximate size of an entry
 */
export function calculateEntrySize(entry: CacheEntry): number {
  if (entry.size !== undefined) {
    return entry.size;
  }
  
  // Rough estimate: JSON stringify size
  try {
    const json = JSON.stringify(entry.data);
    return new Blob([json]).size;
  } catch {
    // Fallback estimate
    return 1024; // 1KB default
  }
}

