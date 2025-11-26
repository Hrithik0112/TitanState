/**
 * Metadata store implementation
 */

import type { MetadataStore, MetadataEntry } from './types';
import type { Driver } from './types';

/**
 * Metadata store using a driver for persistence
 */
export class DriverMetadataStore implements MetadataStore {
  private driver: Driver;
  private metadataKey: string;
  
  constructor(driver: Driver, metadataKey = '__metadata__') {
    this.driver = driver;
    this.metadataKey = metadataKey;
  }
  
  /**
   * Get metadata storage key
   */
  private getMetadataKey(key: string): string {
    return `${this.metadataKey}:${key}`;
  }
  
  async get(key: string): Promise<MetadataEntry | null> {
    const metadataKey = this.getMetadataKey(key);
    const metadata = await this.driver.get(metadataKey);
    
    if (!metadata) {
      return null;
    }
    
    return metadata as MetadataEntry;
  }
  
  async set(key: string, metadata: MetadataEntry): Promise<void> {
    const metadataKey = this.getMetadataKey(key);
    await this.driver.put(metadataKey, metadata);
  }
  
  async delete(key: string): Promise<void> {
    const metadataKey = this.getMetadataKey(key);
    await this.driver.delete(metadataKey);
  }
  
  async list(prefix?: string): Promise<MetadataEntry[]> {
    const metadataPrefix = prefix 
      ? this.getMetadataKey(prefix)
      : `${this.metadataKey}:`;
    
    const keys = await this.driver.keys(metadataPrefix);
    const entries: MetadataEntry[] = [];
    
    for (const key of keys) {
      const metadata = await this.driver.get(key);
      if (metadata) {
        entries.push(metadata as MetadataEntry);
      }
    }
    
    return entries;
  }
  
  async clear(): Promise<void> {
    const keys = await this.driver.keys(`${this.metadataKey}:`);
    await Promise.all(keys.map(key => this.driver.delete(key)));
  }
}

/**
 * In-memory metadata store (for testing)
 */
export class MemoryMetadataStore implements MetadataStore {
  private storage = new Map<string, MetadataEntry>();
  
  async get(key: string): Promise<MetadataEntry | null> {
    return this.storage.get(key) ?? null;
  }
  
  async set(key: string, metadata: MetadataEntry): Promise<void> {
    this.storage.set(key, metadata);
  }
  
  async delete(key: string): Promise<void> {
    this.storage.delete(key);
  }
  
  async list(prefix?: string): Promise<MetadataEntry[]> {
    const entries = Array.from(this.storage.values());
    
    if (!prefix) {
      return entries;
    }
    
    return entries.filter(entry => entry.key.startsWith(prefix));
  }
  
  async clear(): Promise<void> {
    this.storage.clear();
  }
}

