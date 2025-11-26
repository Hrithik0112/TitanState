/**
 * Compression utilities
 * 
 * Note: Full Brotli/lz4 support via WASM would be added in production.
 * This is a simplified implementation using native browser APIs.
 */

/**
 * Compression algorithm type
 */
export type CompressionAlgorithm = 'gzip' | 'deflate' | 'brotli' | 'none';

/**
 * Compression options
 */
export interface CompressionOptions {
  /**
   * Compression algorithm to use
   */
  algorithm?: CompressionAlgorithm;
  
  /**
   * Compression level (0-11, algorithm dependent)
   */
  level?: number;
}

/**
 * Compress data
 */
export async function compress(
  data: string | ArrayBuffer,
  options: CompressionOptions = {}
): Promise<ArrayBuffer> {
  const algorithm = options.algorithm ?? 'gzip';
  
  if (algorithm === 'none') {
    const buffer = typeof data === 'string'
      ? new TextEncoder().encode(data).buffer
      : data;
    return buffer;
  }
  
  // Check if CompressionStream is available (Chrome/Edge)
  // Note: CompressionStream only supports 'gzip' and 'deflate', not 'brotli'
  if (typeof CompressionStream !== 'undefined' && (algorithm === 'gzip' || algorithm === 'deflate')) {
    const stream = new CompressionStream(algorithm);
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();
    
    const input = typeof data === 'string'
      ? new TextEncoder().encode(data)
      : new Uint8Array(data);
    
    writer.write(input);
    writer.close();
    
    const chunks: Uint8Array[] = [];
    let done = false;
    
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        chunks.push(value);
      }
    }
    
    // Combine chunks
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    
    return result.buffer;
  }
  
  // Fallback: no compression (for brotli or unsupported algorithms)
  if (algorithm === 'brotli') {
    console.warn('Brotli compression requires WASM implementation, returning uncompressed data');
  } else {
    console.warn(`Compression algorithm ${algorithm} not supported, returning uncompressed data`);
  }
  return typeof data === 'string'
    ? new TextEncoder().encode(data).buffer
    : data;
}

/**
 * Decompress data
 */
export async function decompress(
  data: ArrayBuffer,
  options: CompressionOptions = {}
): Promise<ArrayBuffer> {
  const algorithm = options.algorithm ?? 'gzip';
  
  if (algorithm === 'none') {
    return data;
  }
  
  // Check if DecompressionStream is available (Chrome/Edge)
  // Note: DecompressionStream only supports 'gzip' and 'deflate', not 'brotli'
  if (typeof DecompressionStream !== 'undefined' && (algorithm === 'gzip' || algorithm === 'deflate')) {
    const stream = new DecompressionStream(algorithm);
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();
    
    writer.write(new Uint8Array(data));
    writer.close();
    
    const chunks: Uint8Array[] = [];
    let done = false;
    
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        chunks.push(value);
      }
    }
    
    // Combine chunks
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    
    return result.buffer;
  }
  
  // Fallback: assume data is not compressed
  console.warn(`Decompression algorithm ${algorithm} not supported, returning data as-is`);
  return data;
}

/**
 * Check if compression is supported
 */
export function isCompressionSupported(algorithm: CompressionAlgorithm): boolean {
  if (algorithm === 'none') {
    return true;
  }
  
  return typeof CompressionStream !== 'undefined' && 
         typeof DecompressionStream !== 'undefined';
}

