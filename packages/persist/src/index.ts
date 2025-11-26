/**
 * @titanstate/persist - Persistence layer for TitanState
 * 
 * Main entry point for persistence functionality
 */

// Drivers
export { BaseDriver, defaultSerialize, defaultDeserialize } from './driver';
export { MemoryDriver } from './memory-driver';
export { IndexedDBDriver } from './indexeddb-driver';
export type { IndexedDBDriverConfig } from './indexeddb-driver';
export { FileSystemDriver } from './fs-driver';
export type { FileSystemDriverConfig } from './fs-driver';
export { RemoteDriver } from './remote-driver';
export type { RemoteDriverConfig } from './remote-driver';

// Hydration
export { hydrateAtom, persistAtom } from './hydration';
export type { HydrationOptions } from './hydration';

// Compression
export { compress, decompress, isCompressionSupported } from './compression';
export type { CompressionAlgorithm, CompressionOptions } from './compression';

// Chunking
export {
  chunkData,
  reconstructData,
  getChunkKey,
  parseChunkKey,
  getChunkKeys,
} from './chunking';
export type { ChunkingConfig } from './chunking';

// Metadata
export { DriverMetadataStore, MemoryMetadataStore } from './metadata';

// Types
export type {
  Driver,
  DriverOptions,
  PutOptions,
  StreamReadOptions,
  MetadataEntry,
  MetadataStore,
} from './types';

