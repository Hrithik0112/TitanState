/**
 * Base driver interface and utilities
 */

import type { Driver, DriverOptions, PutOptions } from './types';

/**
 * Default serialization (JSON)
 */
export function defaultSerialize(value: unknown): string {
  return JSON.stringify(value);
}

/**
 * Default deserialization (JSON)
 */
export function defaultDeserialize(data: string | ArrayBuffer): unknown {
  if (typeof data === 'string') {
    return JSON.parse(data);
  }
  
  // For ArrayBuffer, decode as UTF-8
  const decoder = new TextDecoder();
  const text = decoder.decode(data);
  return JSON.parse(text);
}

/**
 * Base driver implementation with common utilities
 */
export abstract class BaseDriver implements Driver {
  /**
   * Serialize value
   */
  protected serialize(value: unknown, options?: DriverOptions): string | ArrayBuffer {
    if (options?.serialize) {
      return options.serialize(value);
    }
    return defaultSerialize(value);
  }
  
  /**
   * Deserialize value
   */
  protected deserialize(data: string | ArrayBuffer, options?: DriverOptions): unknown {
    if (options?.deserialize) {
      return options.deserialize(data);
    }
    return defaultDeserialize(data);
  }
  
  /**
   * Abstract methods that must be implemented
   */
  abstract put(key: string, value: unknown, options?: PutOptions): Promise<void>;
  abstract get(key: string, options?: DriverOptions): Promise<unknown | null>;
  abstract delete(key: string): Promise<void>;
  abstract has(key: string): Promise<boolean>;
  abstract keys(prefix?: string): Promise<string[]>;
  abstract clear(): Promise<void>;
}

