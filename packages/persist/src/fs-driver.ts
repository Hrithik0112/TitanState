/**
 * FileSystem driver - for environments with File System Access API
 */

import type { Driver, DriverOptions, PutOptions } from './types';
import { BaseDriver } from './driver';

/**
 * FileSystem driver configuration
 */
export interface FileSystemDriverConfig {
  /**
   * Root directory handle
   */
  rootHandle?: FileSystemDirectoryHandle;
  
  /**
   * Request permission on initialization
   */
  requestPermission?: boolean;
}

/**
 * FileSystem driver implementation
 * Requires File System Access API (available in Chrome/Edge)
 */
export class FileSystemDriver extends BaseDriver implements Driver {
  private rootHandle: FileSystemDirectoryHandle | null = null;
  
  constructor(config: FileSystemDriverConfig = {}) {
    super();
    this.rootHandle = config.rootHandle ?? null;
  }
  
  /**
   * Check if File System Access API is available
   */
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
  }
  
  /**
   * Request directory access
   */
  async requestAccess(): Promise<FileSystemDirectoryHandle> {
    if (!FileSystemDriver.isSupported()) {
      throw new Error('File System Access API is not supported in this environment');
    }
    
    if (this.rootHandle) {
      return this.rootHandle;
    }
    
    // Request directory picker
    const handle = await (window as any).showDirectoryPicker({
      mode: 'readwrite',
    });
    
    this.rootHandle = handle;
    return handle;
  }
  
  /**
   * Get file handle for a key
   */
  private async getFileHandle(key: string, create = false): Promise<FileSystemFileHandle> {
    if (!this.rootHandle) {
      await this.requestAccess();
    }
    
    const parts = key.split('/');
    let currentHandle = this.rootHandle!;
    
    // Navigate/create directory structure
    for (let i = 0; i < parts.length - 1; i++) {
      const dirName = parts[i];
      if (!dirName) {
        throw new Error(`Invalid key path: ${key}`);
      }
      currentHandle = await currentHandle.getDirectoryHandle(dirName, { create });
    }
    
    const fileName = parts[parts.length - 1];
    if (!fileName) {
      throw new Error(`Invalid key path: ${key}`);
    }
    return currentHandle.getFileHandle(fileName, { create });
  }
  
  async put(key: string, value: unknown, options?: PutOptions): Promise<void> {
    const fileHandle = await this.getFileHandle(key, true);
    const serialized = this.serialize(value, options);
    
    const writable = await fileHandle.createWritable();
    await writable.write(typeof serialized === 'string' ? serialized : serialized);
    await writable.close();
  }
  
  async get(key: string, options?: DriverOptions): Promise<unknown | null> {
    try {
      const fileHandle = await this.getFileHandle(key, false);
      const file = await fileHandle.getFile();
      const text = await file.text();
      return this.deserialize(text, options);
    } catch (error) {
      if ((error as Error).name === 'NotFoundError') {
        return null;
      }
      throw error;
    }
  }
  
  async delete(key: string): Promise<void> {
    try {
      const parts = key.split('/');
      const parentParts = parts.slice(0, -1);
      const fileName = parts[parts.length - 1];
      
      if (!fileName) {
        throw new Error(`Invalid key path: ${key}`);
      }
      
      if (parentParts.length === 0) {
        // Root level - need root handle
        if (!this.rootHandle) {
          return;
        }
        await this.rootHandle.removeEntry(fileName);
      } else {
        let currentHandle = this.rootHandle!;
        for (const dirName of parentParts) {
          if (!dirName) {
            throw new Error(`Invalid key path: ${key}`);
          }
          currentHandle = await currentHandle.getDirectoryHandle(dirName);
        }
        await currentHandle.removeEntry(fileName);
      }
    } catch (error) {
      if ((error as Error).name === 'NotFoundError') {
        // Already deleted, ignore
        return;
      }
      throw error;
    }
  }
  
  async has(key: string): Promise<boolean> {
    try {
      await this.getFileHandle(key, false);
      return true;
    } catch {
      return false;
    }
  }
  
  async keys(prefix?: string): Promise<string[]> {
    if (!this.rootHandle) {
      await this.requestAccess();
    }
    
    const keys: string[] = [];
    
    async function traverse(
      handle: FileSystemDirectoryHandle,
      currentPath: string
    ): Promise<void> {
      // FileSystemDirectoryHandle.entries() returns an async iterator
      // TypeScript types may not include this, so we use type assertion
      const handleWithEntries = handle as any as {
        entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
      };
      
      try {
        for await (const [name, entry] of handleWithEntries.entries()) {
          const fullPath = currentPath ? `${currentPath}/${name}` : name;
          
          if (entry.kind === 'file') {
            if (!prefix || fullPath.startsWith(prefix)) {
              keys.push(fullPath);
            }
          } else if (entry.kind === 'directory') {
            await traverse(entry as FileSystemDirectoryHandle, fullPath);
          }
        }
      } catch (error) {
        console.warn('Directory traversal error:', error);
      }
    }
    
    await traverse(this.rootHandle!, '');
    return keys;
  }
  
  async clear(): Promise<void> {
    if (!this.rootHandle) {
      return;
    }
    
    // Delete all entries in root
    // FileSystemDirectoryHandle.entries() returns an async iterator
    const handleWithEntries = this.rootHandle as any as {
      entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
    };
    
    try {
      for await (const [name] of handleWithEntries.entries()) {
        await this.rootHandle.removeEntry(name, { recursive: true });
      }
    } catch (error) {
      console.warn('Clear operation error:', error);
    }
  }
}

