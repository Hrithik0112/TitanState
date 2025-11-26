/**
 * CRDT (Conflict-free Replicated Data Type) adapters
 */

import type { CRDTOperation, CRDTState, CRDTOperationType } from './types';

/**
 * CRDT replica
 */
export class CRDTReplica {
  private state: CRDTState;
  private operations: CRDTOperation[] = [];
  
  constructor(replicaId: string) {
    this.state = {
      operations: [],
      replicaId,
      lastSync: Date.now(),
    };
  }
  
  /**
   * Apply local operation
   */
  applyOperation(type: CRDTOperationType, key: string, value?: unknown): CRDTOperation {
    const operation: CRDTOperation = {
      type,
      key,
      value,
      timestamp: Date.now(),
      replicaId: this.state.replicaId,
    };
    
    this.operations.push(operation);
    this.state.operations.push(operation);
    
    return operation;
  }
  
  /**
   * Merge operations from another replica
   */
  merge(operations: CRDTOperation[]): void {
    for (const operation of operations) {
      // Check if operation already exists
      const exists = this.state.operations.some(
        op => op.timestamp === operation.timestamp &&
              op.replicaId === operation.replicaId &&
              op.key === operation.key
      );
      
      if (!exists) {
        this.state.operations.push(operation);
      }
    }
    
    // Sort operations by timestamp
    this.state.operations.sort((a, b) => {
      if (a.timestamp !== b.timestamp) {
        return a.timestamp - b.timestamp;
      }
      // If timestamps are equal, use replica ID for deterministic ordering
      return a.replicaId.localeCompare(b.replicaId);
    });
    
    this.state.lastSync = Date.now();
  }
  
  /**
   * Get current state
   */
  getState(): CRDTState {
    return {
      ...this.state,
      operations: [...this.state.operations],
    };
  }
  
  /**
   * Get operations since timestamp
   */
  getOperationsSince(timestamp: number): CRDTOperation[] {
    return this.state.operations.filter(op => op.timestamp > timestamp);
  }
  
  /**
   * Compute final value from operations
   */
  computeValue(key: string): unknown {
    let value: unknown = undefined;
    
    // Apply operations in order
    for (const operation of this.state.operations) {
      if (operation.key !== key) {
        continue;
      }
      
      switch (operation.type) {
        case 'set':
          value = operation.value;
          break;
        
        case 'delete':
          value = undefined;
          break;
        
        case 'increment':
          if (typeof value === 'number' && typeof operation.value === 'number') {
            value = (value as number) + (operation.value as number);
          }
          break;
        
        case 'merge':
          if (typeof value === 'object' && value !== null && typeof operation.value === 'object') {
            value = { ...(value as Record<string, unknown>), ...(operation.value as Record<string, unknown>) };
          }
          break;
      }
    }
    
    return value;
  }
  
  /**
   * Reset state
   */
  reset(): void {
    this.state.operations = [];
    this.operations = [];
    this.state.lastSync = Date.now();
  }
}

/**
 * Create a CRDT replica
 */
export function createCRDTReplica(replicaId: string): CRDTReplica {
  return new CRDTReplica(replicaId);
}

/**
 * Last-write-wins conflict resolution
 */
export function lastWriteWins(
  op1: CRDTOperation,
  op2: CRDTOperation
): CRDTOperation {
  if (op1.timestamp > op2.timestamp) {
    return op1;
  } else if (op2.timestamp > op1.timestamp) {
    return op2;
  }
  // If timestamps are equal, use replica ID for deterministic ordering
  return op1.replicaId > op2.replicaId ? op1 : op2;
}

