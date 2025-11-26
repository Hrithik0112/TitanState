/**
 * Lazy hydration logic
 */

import type { Atom } from '@titanstate/types';
import type { Driver, DriverOptions } from './types';
import { compress, decompress } from './compression';
import { chunkData, reconstructData, getChunkKey, getChunkKeys } from './chunking';

/**
 * Hydration options
 */
export interface HydrationOptions extends DriverOptions {
  /**
   * Maximum size before chunking (in bytes)
   */
  chunkThreshold?: number;
  
  /**
   * Compression algorithm
   */
  compression?: 'gzip' | 'deflate' | 'brotli' | 'none';
}

/**
 * Default chunk threshold (10MB)
 */
const DEFAULT_CHUNK_THRESHOLD = 10 * 1024 * 1024;

/**
 * Hydrate an atom from storage
 */
export async function hydrateAtom<T>(
  atom: Atom<T>,
  driver: Driver,
  options: HydrationOptions = {}
): Promise<T> {
  if (!atom.meta.persisted || !atom.meta.key) {
    throw new Error(`Atom ${String(atom.key)} is not configured for persistence`);
  }
  
  const storageKey = atom.meta.key;
  
  // Check if data is chunked
  const allKeys = await driver.keys();
  const chunkKeys = await getChunkKeys(storageKey, allKeys, {
    chunkPrefix: 'chunk',
  });
  
  let data: unknown;
  
  if (chunkKeys.length > 0) {
    // Reconstruct from chunks
    const chunks = await Promise.all(
      chunkKeys.map(async (chunkKey) => {
        const chunkData = await driver.get(chunkKey, options);
        if (!chunkData || !(chunkData instanceof ArrayBuffer)) {
          throw new Error(`Invalid chunk data for ${chunkKey}`);
        }
        const match = chunkKey.match(/:chunk:(\d+)$/);
        const index = match && match[1] ? parseInt(match[1], 10) : 0;
        return { index, data: chunkData };
      })
    );
    
    const reconstructed = reconstructData(chunks);
    
    // Decompress if needed
    const decompressed = options.compression && options.compression !== 'none'
      ? await decompress(reconstructed, { algorithm: options.compression })
      : reconstructed;
    
    // Deserialize
    const text = new TextDecoder().decode(decompressed);
    data = JSON.parse(text);
  } else {
    // Single value
    const rawData = await driver.get(storageKey, options);
    
    if (rawData === null) {
      throw new Error(`Atom ${String(atom.key)} not found in storage`);
    }
    
    // Handle compressed data
    if (rawData instanceof ArrayBuffer && options.compression && options.compression !== 'none') {
      const decompressed = await decompress(rawData, { algorithm: options.compression });
      const text = new TextDecoder().decode(decompressed);
      data = JSON.parse(text);
    } else {
      data = rawData;
    }
  }
  
  return data as T;
}

/**
 * Persist an atom to storage
 */
export async function persistAtom<T>(
  atom: Atom<T>,
  driver: Driver,
  options: HydrationOptions = {}
): Promise<void> {
  if (!atom.meta.persisted || !atom.meta.key) {
    return; // Not persisted, skip
  }
  
  if (atom.value === undefined) {
    return; // No value to persist
  }
  
  const storageKey = atom.meta.key;
  const chunkThreshold = options.chunkThreshold ?? DEFAULT_CHUNK_THRESHOLD;
  
  // Serialize
  const serialized = JSON.stringify(atom.value);
  const encoded = new TextEncoder().encode(serialized);
  
  // Compress if needed
  const compressed = options.compression && options.compression !== 'none'
    ? await compress(encoded.buffer, { algorithm: options.compression })
    : encoded.buffer;
  
  // Check if we need to chunk
  if (compressed.byteLength > chunkThreshold) {
    // Split into chunks
    const chunks = chunkData(compressed, { chunkSize: chunkThreshold });
    
    // Delete old chunks if they exist
    const allKeys = await driver.keys();
    const oldChunkKeys = await getChunkKeys(storageKey, allKeys, { chunkPrefix: 'chunk' });
    await Promise.all(oldChunkKeys.map(key => driver.delete(key)));
    
    // Store chunks
    await Promise.all(
      chunks.map(chunk => {
        const chunkKey = getChunkKey(storageKey, chunk.index, { chunkPrefix: 'chunk' });
        return driver.put(chunkKey, chunk.data, options);
      })
    );
    
    // Delete single value if it exists
    await driver.delete(storageKey);
  } else {
    // Store as single value
    // Delete chunks if they exist
    const allKeys = await driver.keys();
    const oldChunkKeys = await getChunkKeys(storageKey, allKeys, { chunkPrefix: 'chunk' });
    await Promise.all(oldChunkKeys.map(key => driver.delete(key)));
    
    await driver.put(storageKey, compressed, options);
  }
  
  // Update metadata
  atom.meta.hydrated = true;
  atom.meta.lastAccessed = Date.now();
  atom.meta.size = compressed.byteLength;
}

