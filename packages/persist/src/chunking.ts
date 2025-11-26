/**
 * Large data chunking strategy
 */

/**
 * Chunking configuration
 */
export interface ChunkingConfig {
  /**
   * Maximum chunk size in bytes
   */
  chunkSize?: number;
  
  /**
   * Chunk prefix
   */
  chunkPrefix?: string;
}

/**
 * Default chunk size (1MB)
 */
const DEFAULT_CHUNK_SIZE = 1024 * 1024;

/**
 * Split data into chunks
 */
export function chunkData(
  data: ArrayBuffer,
  config: ChunkingConfig = {}
): Array<{ index: number; data: ArrayBuffer }> {
  const chunkSize = config.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const chunks: Array<{ index: number; data: ArrayBuffer }> = [];
  const view = new Uint8Array(data);
  
  for (let i = 0; i < view.length; i += chunkSize) {
    const chunk = view.slice(i, i + chunkSize);
    chunks.push({
      index: Math.floor(i / chunkSize),
      data: chunk.buffer,
    });
  }
  
  return chunks;
}

/**
 * Reconstruct data from chunks
 */
export function reconstructData(
  chunks: Array<{ index: number; data: ArrayBuffer }>
): ArrayBuffer {
  // Sort chunks by index
  const sortedChunks = [...chunks].sort((a, b) => a.index - b.index);
  
  // Calculate total size
  const totalSize = sortedChunks.reduce((sum, chunk) => sum + chunk.data.byteLength, 0);
  
  // Combine chunks
  const result = new Uint8Array(totalSize);
  let offset = 0;
  
  for (const chunk of sortedChunks) {
    const chunkView = new Uint8Array(chunk.data);
    result.set(chunkView, offset);
    offset += chunk.data.byteLength;
  }
  
  return result.buffer;
}

/**
 * Generate chunk key
 */
export function getChunkKey(
  baseKey: string,
  index: number,
  config: ChunkingConfig = {}
): string {
  const prefix = config.chunkPrefix ?? 'chunk';
  return `${baseKey}:${prefix}:${String(index).padStart(6, '0')}`;
}

/**
 * Parse chunk key to get base key and index
 */
export function parseChunkKey(chunkKey: string): { baseKey: string; index: number } | null {
  const match = chunkKey.match(/^(.+):chunk:(\d+)$/);
  if (!match || !match[1] || !match[2]) {
    return null;
  }
  
  return {
    baseKey: match[1],
    index: parseInt(match[2], 10),
  };
}

/**
 * Get all chunk keys for a base key
 */
export async function getChunkKeys(
  baseKey: string,
  keys: string[],
  config: ChunkingConfig = {}
): Promise<string[]> {
  const prefix = config.chunkPrefix ?? 'chunk';
  const chunkPrefix = `${baseKey}:${prefix}:`;
  
  return keys
    .filter(key => key.startsWith(chunkPrefix))
    .sort();
}

