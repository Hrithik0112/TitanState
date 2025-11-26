/**
 * Advanced features type definitions
 */

/**
 * Encryption algorithm
 */
export type EncryptionAlgorithm = 'AES-GCM' | 'AES-CBC';

/**
 * Encryption options
 */
export interface EncryptionOptions {
  /**
   * Encryption algorithm
   */
  algorithm?: EncryptionAlgorithm;
  
  /**
   * Key length in bits
   */
  keyLength?: number;
}

/**
 * Multi-tab sync message types
 */
export type SyncMessageType = 'state-update' | 'atom-change' | 'sync-request' | 'sync-response' | 'crdt-operations';

/**
 * Multi-tab sync message
 */
export interface SyncMessage {
  type: SyncMessageType;
  payload: unknown;
  timestamp: number;
  source: string; // Tab ID
}

/**
 * Migration function
 */
export type MigrationFunction = (oldData: unknown) => unknown;

/**
 * Migration definition
 */
export interface Migration {
  /**
   * Target version
   */
  version: number;
  
  /**
   * Migration function
   */
  migrate: MigrationFunction;
  
  /**
   * Description
   */
  description?: string;
}

/**
 * CRDT operation types
 */
export type CRDTOperationType = 'set' | 'delete' | 'increment' | 'merge';

/**
 * CRDT operation
 */
export interface CRDTOperation {
  type: CRDTOperationType;
  key: string;
  value?: unknown;
  timestamp: number;
  replicaId: string;
}

/**
 * CRDT state
 */
export interface CRDTState {
  operations: CRDTOperation[];
  replicaId: string;
  lastSync: number;
}

