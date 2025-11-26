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

