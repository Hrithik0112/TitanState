/**
 * Memory driver - in-memory storage for testing
 */

import type { Driver, DriverOptions, PutOptions } from './types';
import { BaseDriver } from './driver';

/**
 * Memory driver implementation
 */
export class MemoryDriver extends BaseDriver implements Driver {
  private storage = new Map<string, {
    value: string | ArrayBuffer;
    metadata?: Record<string, unknown>;
    expiresAt?: number;
  }>();
  
  async put(key: string, value: unknown, options?: PutOptions): Promise<void> {
    const serialized = this.serialize(value, options);
    
    let expiresAt: number | undefined;
    if (options?.ttl) {
      expiresAt = Date.now() + (options.ttl * 1000);
    }
    
    this.storage.set(key, {
      value: serialized,
      metadata: options?.metadata,
      expiresAt,
    });
  }
  
  async get(key: string, options?: DriverOptions): Promise<unknown | null> {
    const entry = this.storage.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check expiration
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      await this.delete(key);
      return null;
    }
    
    return this.deserialize(entry.value, options);
  }
  
  async delete(key: string): Promise<void> {
    this.storage.delete(key);
  }
  
  async has(key: string): Promise<boolean> {
    const entry = this.storage.get(key);
    
    if (!entry) {
      return false;
    }
    
    // Check expiration
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      await this.delete(key);
      return false;
    }
    
    return true;
  }
  
  async keys(prefix?: string): Promise<string[]> {
    const allKeys = Array.from(this.storage.keys());
    
    if (!prefix) {
      return allKeys;
    }
    
    return allKeys.filter(key => key.startsWith(prefix));
  }
  
  async clear(): Promise<void> {
    this.storage.clear();
  }
  
  /**
   * Get storage size (for testing/debugging)
   */
  getSize(): number {
    return this.storage.size;
  }
}

