/**
 * IndexedDB driver implementation
 */

import type { Driver, DriverOptions, PutOptions, StreamReadOptions } from './types';
import { BaseDriver } from './driver';

/**
 * IndexedDB driver configuration
 */
export interface IndexedDBDriverConfig {
  /**
   * Database name
   */
  dbName?: string;
  
  /**
   * Database version
   */
  version?: number;
  
  /**
   * Store name
   */
  storeName?: string;
}

/**
 * IndexedDB driver implementation
 */
export class IndexedDBDriver extends BaseDriver implements Driver {
  private dbName: string;
  private version: number;
  private storeName: string;
  private db: IDBDatabase | null = null;
  
  constructor(config: IndexedDBDriverConfig = {}) {
    super();
    this.dbName = config.dbName ?? 'titanstate';
    this.version = config.version ?? 1;
    this.storeName = config.storeName ?? 'atoms';
  }
  
  /**
   * Open database connection
   */
  private async openDB(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }
    
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB is not supported in this environment'));
        return;
      }
      
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => {
        reject(new Error(`Failed to open IndexedDB: ${request.error?.message}`));
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'key' });
          store.createIndex('key', 'key', { unique: true });
        }
      };
    });
  }
  
  async put(key: string, value: unknown, options?: PutOptions): Promise<void> {
    const db = await this.openDB();
    const serialized = this.serialize(value, options);
    
    // Convert to Blob for storage
    const blob = typeof serialized === 'string'
      ? new Blob([serialized], { type: 'application/json' })
      : new Blob([serialized]);
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const entry = {
        key,
        value: blob,
        metadata: options?.metadata,
        expiresAt: options?.ttl ? Date.now() + (options.ttl * 1000) : undefined,
        updatedAt: Date.now(),
      };
      
      const request = store.put(entry);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to put value: ${request.error?.message}`));
    });
  }
  
  async get(key: string, options?: DriverOptions): Promise<unknown | null> {
    const db = await this.openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);
      
      request.onsuccess = () => {
        const entry = request.result;
        
        if (!entry) {
          resolve(null);
          return;
        }
        
        // Check expiration
        if (entry.expiresAt && entry.expiresAt < Date.now()) {
          this.delete(key).then(() => resolve(null));
          return;
        }
        
        // Convert Blob back to string/ArrayBuffer
        const blob: Blob = entry.value;
        const reader = new FileReader();
        
        reader.onload = () => {
          try {
            const data = reader.result as string | ArrayBuffer;
            const deserialized = this.deserialize(data, options);
            resolve(deserialized);
          } catch (error) {
            reject(error);
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read blob'));
        };
        
        if (options?.deserialize || typeof blob === 'string') {
          reader.readAsText(blob);
        } else {
          reader.readAsArrayBuffer(blob);
        }
      };
      
      request.onerror = () => {
        reject(new Error(`Failed to get value: ${request.error?.message}`));
      };
    });
  }
  
  async delete(key: string): Promise<void> {
    const db = await this.openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to delete value: ${request.error?.message}`));
    });
  }
  
  async has(key: string): Promise<boolean> {
    const db = await this.openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.count(IDBKeyRange.only(key));
      
      request.onsuccess = () => {
        resolve(request.result > 0);
      };
      
      request.onerror = () => {
        reject(new Error(`Failed to check key: ${request.error?.message}`));
      };
    });
  }
  
  async keys(prefix?: string): Promise<string[]> {
    const db = await this.openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAllKeys();
      
      request.onsuccess = () => {
        const allKeys = request.result as string[];
        
        if (!prefix) {
          resolve(allKeys);
          return;
        }
        
        resolve(allKeys.filter(key => key.startsWith(prefix)));
      };
      
      request.onerror = () => {
        reject(new Error(`Failed to get keys: ${request.error?.message}`));
      };
    });
  }
  
  async streamRead(key: string, options?: StreamReadOptions): Promise<ReadableStream<Uint8Array>> {
    const db = await this.openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);
      
      request.onsuccess = () => {
        const entry = request.result;
        
        if (!entry) {
          reject(new Error(`Key not found: ${key}`));
          return;
        }
        
        const blob: Blob = entry.value;
        const stream = blob.stream();
        
        // Apply offset and limit if specified
        if (options?.offset || options?.limit) {
          // This is a simplified implementation
          // In production, you'd want to handle streaming more efficiently
          resolve(stream as unknown as ReadableStream<Uint8Array>);
        } else {
          resolve(stream as unknown as ReadableStream<Uint8Array>);
        }
      };
      
      request.onerror = () => {
        reject(new Error(`Failed to stream read: ${request.error?.message}`));
      };
    });
  }
  
  async compact(): Promise<void> {
    // IndexedDB doesn't need explicit compaction, but we can clean up expired entries
    const db = await this.openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.openCursor();
      
      const expiredKeys: string[] = [];
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        
        if (cursor) {
          const entry = cursor.value;
          if (entry.expiresAt && entry.expiresAt < Date.now()) {
            expiredKeys.push(entry.key);
          }
          cursor.continue();
        } else {
          // Delete all expired keys
          Promise.all(expiredKeys.map(key => this.delete(key)))
            .then(() => resolve())
            .catch(reject);
        }
      };
      
      request.onerror = () => {
        reject(new Error(`Failed to compact: ${request.error?.message}`));
      };
    });
  }
  
  async clear(): Promise<void> {
    const db = await this.openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to clear: ${request.error?.message}`));
    });
  }
}

