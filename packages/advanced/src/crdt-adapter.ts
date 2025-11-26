/**
 * CRDT Adapter for TitanState
 * 
 * Integrates CRDT replicas with TitanState atoms for collaborative applications
 */

import type { Store } from '@titanstate/core';
import type { Atom } from '@titanstate/types';
import { CRDTReplica } from './crdt';
import type { CRDTOperation, CRDTOperationType, CRDTState } from './types';

/**
 * CRDT adapter configuration
 */
export interface CRDTAdapterConfig {
  /**
   * Replica ID (unique identifier for this instance)
   */
  replicaId: string;
  
  /**
   * Sync function to send operations to other replicas
   */
  sync?: (operations: CRDTOperation[]) => Promise<void>;
  
  /**
   * Conflict resolution strategy
   */
  conflictResolution?: 'last-write-wins' | 'merge' | 'custom';
  
  /**
   * Custom conflict resolver
   */
  customResolver?: (op1: CRDTOperation, op2: CRDTOperation) => CRDTOperation;
}

/**
 * CRDT adapter for atoms
 */
export class CRDTAdapter {
  private replica: CRDTReplica;
  private store: Store;
  private atomMap = new Map<string, Atom>();
  private syncFunction?: (operations: CRDTOperation[]) => Promise<void>;
  
  constructor(store: Store, config: CRDTAdapterConfig) {
    this.store = store;
    this.replica = new CRDTReplica(config.replicaId);
    this.syncFunction = config.sync;
    // Note: conflictResolution and customResolver are reserved for future use
    void config.conflictResolution;
    void config.customResolver;
  }
  
  /**
   * Create a CRDT-enabled atom
   */
  createCRDTAtom<T>(key: string, initialValue: T, options?: { persisted?: boolean }): Atom<T> {
    // Create atom in store
    const atom = this.store.createAtom(key, initialValue, {
      persisted: options?.persisted ?? false,
    });
    
    // Register atom
    this.atomMap.set(key, atom as Atom<unknown>);
    
    // Initialize CRDT state if needed
    const currentValue = this.store.get(atom);
    if (currentValue !== undefined) {
      this.replica.applyOperation('set', key, currentValue);
    }
    
    // Subscribe to atom changes to track operations
    this.store.subscribe(atom as Atom<unknown>, (newValue, previousValue) => {
      this.handleAtomChange(key, newValue, previousValue);
    });
    
    return atom;
  }
  
  /**
   * Handle atom change and create CRDT operation
   */
  private handleAtomChange(key: string, newValue: unknown, previousValue: unknown | undefined): void {
    // Determine operation type based on change
    let operationType: CRDTOperationType;
    
    if (newValue === undefined) {
      operationType = 'delete';
    } else if (typeof newValue === 'number' && typeof previousValue === 'number') {
      // Check if it's an increment
      const diff = (newValue as number) - (previousValue as number);
      if (diff !== 0) {
        operationType = 'increment';
        this.replica.applyOperation(operationType, key, diff);
        this.syncIfNeeded();
        return;
      } else {
        operationType = 'set';
      }
    } else if (
      typeof newValue === 'object' && 
      newValue !== null && 
      typeof previousValue === 'object' && 
      previousValue !== null
    ) {
      // Check if it's a merge operation
      operationType = 'merge';
    } else {
      operationType = 'set';
    }
    
      // Apply operation
      this.replica.applyOperation(operationType, key, newValue);
      
      // Sync if configured
      this.syncIfNeeded();
  }
  
  /**
   * Apply remote operations
   */
  async applyRemoteOperations(operations: CRDTOperation[]): Promise<void> {
    // Merge operations into replica
    this.replica.merge(operations);
    
    // Apply operations to atoms
    for (const _operation of operations) {
      const atom = this.atomMap.get(_operation.key);
      if (!atom) {
        continue;
      }
      
      // Compute new value from CRDT state
      const newValue = this.replica.computeValue(_operation.key);
      
      // Update atom (this will trigger subscription but won't create new operation)
      // We need to temporarily disable operation tracking
      const currentValue = this.store.get(atom);
      if (currentValue !== newValue) {
        this.store.set(atom, newValue as any);
      }
    }
  }
  
  /**
   * Get operations to sync
   */
  getOperationsSince(timestamp: number): CRDTOperation[] {
    return this.replica.getOperationsSince(timestamp);
  }
  
  /**
   * Get current CRDT state
   */
  getCRDTState(): CRDTState {
    return this.replica.getState();
  }
  
  /**
   * Sync operations if sync function is configured
   */
  private async syncIfNeeded(): Promise<void> {
    if (this.syncFunction) {
      const state = this.replica.getState();
      const operations = state.operations;
      
      // Only sync if there are operations
      if (operations.length > 0) {
        try {
          await this.syncFunction(operations);
        } catch (error) {
          console.error('Error syncing CRDT operations:', error);
        }
      }
    }
  }
  
  /**
   * Manual sync trigger
   */
  async sync(): Promise<void> {
    await this.syncIfNeeded();
  }
  
  /**
   * Get replica ID
   */
  getReplicaId(): string {
    return this.replica.getState().replicaId;
  }
}

/**
 * Create a CRDT adapter
 */
export function createCRDTAdapter(
  store: Store,
  config: CRDTAdapterConfig
): CRDTAdapter {
  return new CRDTAdapter(store, config);
}

