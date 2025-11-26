/**
 * @titanstate/advanced - Advanced features for TitanState
 * 
 * Main entry point for advanced functionality
 */

// Encryption
export {
  generateEncryptionKey,
  deriveKeyFromPassword,
  encrypt,
  decrypt,
  encryptString,
  decryptString,
} from './encryption';

// Multi-tab sync
export { MultiTabSync } from './multi-tab';
export type { MultiTabSyncConfig } from './multi-tab';

// Migration
export { MigrationManager, createMigration } from './migration';
export type { Migration, MigrationFunction } from './types';

// CRDT
export { CRDTReplica, createCRDTReplica, lastWriteWins } from './crdt';
export { CRDTAdapter, createCRDTAdapter } from './crdt-adapter';
export type { CRDTAdapterConfig } from './crdt-adapter';
export {
  MultiTabCRDTSync,
  RemoteCRDTSync,
  createMultiTabCRDTSync,
  createRemoteCRDTSync,
} from './crdt-sync';
export type {
  MultiTabCRDTSyncConfig,
  RemoteCRDTSyncConfig,
} from './crdt-sync';

// Types
export type {
  EncryptionAlgorithm,
  EncryptionOptions,
  SyncMessage,
  SyncMessageType,
  CRDTOperation,
  CRDTOperationType,
  CRDTState,
} from './types';

