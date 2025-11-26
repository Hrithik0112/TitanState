/**
 * Persistence-specific types
 */

/**
 * Driver options
 */
export interface DriverOptions {
  /**
   * Enable compression
   */
  compress?: boolean;
  
  /**
   * Encryption key (for sensitive data)
   */
  encryptionKey?: CryptoKey;
  
  /**
   * Custom serialization function
   */
  serialize?: (value: unknown) => string | ArrayBuffer;
  
  /**
   * Custom deserialization function
   */
  deserialize?: (data: string | ArrayBuffer) => unknown;
}

/**
 * Driver put options
 */
export interface PutOptions extends DriverOptions {
  /**
   * Metadata to store with the value
   */
  metadata?: Record<string, unknown>;
  
  /**
   * Time to live in seconds
   */
  ttl?: number;
}

/**
 * Stream read options
 */
export interface StreamReadOptions {
  /**
   * Start offset in bytes
   */
  offset?: number;
  
  /**
   * Maximum bytes to read
   */
  limit?: number;
}

/**
 * Storage driver interface
 */
export interface Driver {
  /**
   * Store a value
   */
  put(key: string, value: unknown, options?: PutOptions): Promise<void>;
  
  /**
   * Retrieve a value
   */
  get(key: string, options?: DriverOptions): Promise<unknown | null>;
  
  /**
   * Delete a value
   */
  delete(key: string): Promise<void>;
  
  /**
   * Check if a key exists
   */
  has(key: string): Promise<boolean>;
  
  /**
   * List all keys (optionally with prefix)
   */
  keys(prefix?: string): Promise<string[]>;
  
  /**
   * Stream read (optional, for large data)
   */
  streamRead?(key: string, options?: StreamReadOptions): Promise<ReadableStream<Uint8Array>>;
  
  /**
   * Compact storage (optional, for cleanup)
   */
  compact?(): Promise<void>;
  
  /**
   * Clear all data
   */
  clear(): Promise<void>;
}

/**
 * Metadata entry
 */
export interface MetadataEntry {
  /**
   * Storage key
   */
  key: string;
  
  /**
   * Schema version
   */
  schemaVersion?: number;
  
  /**
   * Last accessed timestamp
   */
  lastAccessed?: number;
  
  /**
   * Size in bytes
   */
  size?: number;
  
  /**
   * Creation timestamp
   */
  createdAt?: number;
  
  /**
   * Time to live (expiration timestamp)
   */
  expiresAt?: number;
  
  /**
   * Custom metadata
   */
  custom?: Record<string, unknown>;
}

/**
 * Metadata store interface
 */
export interface MetadataStore {
  /**
   * Get metadata for a key
   */
  get(key: string): Promise<MetadataEntry | null>;
  
  /**
   * Set metadata for a key
   */
  set(key: string, metadata: MetadataEntry): Promise<void>;
  
  /**
   * Delete metadata for a key
   */
  delete(key: string): Promise<void>;
  
  /**
   * List all metadata entries
   */
  list(prefix?: string): Promise<MetadataEntry[]>;
  
  /**
   * Clear all metadata
   */
  clear(): Promise<void>;
}

