/**
 * CRDT Synchronization utilities
 * 
 * Provides sync mechanisms for CRDT replicas
 */

import type { CRDTOperation } from './types';
import { MultiTabSync } from './multi-tab';

/**
 * Multi-tab CRDT sync configuration
 */
export interface MultiTabCRDTSyncConfig {
  /**
   * Channel name for sync
   */
  channelName?: string;
  
  /**
   * Enable automatic sync
   */
  autoSync?: boolean;
  
  /**
   * Sync interval in milliseconds (for polling)
   */
  syncInterval?: number;
}

/**
 * Multi-tab CRDT synchronizer
 */
export class MultiTabCRDTSync {
  private multiTabSync: MultiTabSync;
  private intervalId?: ReturnType<typeof setInterval>;
  private getOperationsFn: () => CRDTOperation[];
  
  constructor(
    getOperations: () => CRDTOperation[],
    applyOperations: (operations: CRDTOperation[]) => Promise<void>,
    config: MultiTabCRDTSyncConfig = {}
  ) {
    const { channelName = 'titanstate-crdt-sync', autoSync = true, syncInterval } = config;
    
    this.getOperationsFn = getOperations;
    
    this.multiTabSync = new MultiTabSync({
      channelName,
    });
    
    // Setup message handler
    this.multiTabSync.onMessage('crdt-operations', async (message) => {
      await applyOperations(message.payload as CRDTOperation[]);
    });
    
    // Auto-sync if enabled
    if (autoSync && syncInterval) {
      // Polling-based sync
      this.intervalId = setInterval(() => {
        this.sync();
      }, syncInterval);
    }
  }
  
  /**
   * Manual sync trigger
   */
  async sync(): Promise<void> {
    const operations = this.getOperationsFn();
    if (operations.length > 0) {
      // Send operations to other tabs
      this.multiTabSync.sendMessage('crdt-operations', operations);
    }
  }
  
  /**
   * Cleanup
   */
  destroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.multiTabSync.close();
  }
}

/**
 * Remote CRDT sync (for server/client sync)
 */
export interface RemoteCRDTSyncConfig {
  /**
   * Server endpoint URL
   */
  endpoint: string;
  
  /**
   * Authentication token (optional)
   */
  token?: string;
  
  /**
   * Sync interval in milliseconds
   */
  syncInterval?: number;
  
  /**
   * Enable automatic sync
   */
  autoSync?: boolean;
}

/**
 * Remote CRDT synchronizer
 */
export class RemoteCRDTSync {
  private endpoint: string;
  private token?: string;
  private syncInterval?: number;
  private intervalId?: ReturnType<typeof setInterval>;
  private lastSyncTimestamp = 0;
  
  constructor(
    private getOperations: () => CRDTOperation[],
    private applyOperations: (operations: CRDTOperation[]) => Promise<void>,
    config: RemoteCRDTSyncConfig
  ) {
    this.endpoint = config.endpoint;
    this.token = config.token;
    this.syncInterval = config.syncInterval || 5000; // Default 5 seconds
    
    if (config.autoSync !== false) {
      this.startAutoSync();
    }
  }
  
  /**
   * Start automatic sync
   */
  private startAutoSync(): void {
    this.intervalId = setInterval(() => {
      this.sync();
    }, this.syncInterval);
  }
  
  /**
   * Sync with remote server
   */
  async sync(): Promise<void> {
    try {
      // Get local operations since last sync
      const localOperations = this.getOperations().filter(
        op => op.timestamp > this.lastSyncTimestamp
      );
      
      // Send local operations to server
      if (localOperations.length > 0) {
        await this.sendOperations(localOperations);
      }
      
      // Fetch remote operations
      const remoteOperations = await this.fetchOperations();
      
      // Apply remote operations
      if (remoteOperations.length > 0) {
        await this.applyOperations(remoteOperations);
      }
      
      // Update last sync timestamp
      this.lastSyncTimestamp = Date.now();
    } catch (error) {
      console.error('Error syncing with remote server:', error);
    }
  }
  
  /**
   * Send operations to server
   */
  private async sendOperations(operations: CRDTOperation[]): Promise<void> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: JSON.stringify({ operations }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send operations: ${response.statusText}`);
    }
  }
  
  /**
   * Fetch operations from server
   */
  private async fetchOperations(): Promise<CRDTOperation[]> {
    const response = await fetch(`${this.endpoint}?since=${this.lastSyncTimestamp}`, {
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch operations: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.operations || [];
  }
  
  /**
   * Cleanup
   */
  destroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

/**
 * Create multi-tab CRDT sync
 */
export function createMultiTabCRDTSync(
  getOperations: () => CRDTOperation[],
  applyOperations: (operations: CRDTOperation[]) => Promise<void>,
  config?: MultiTabCRDTSyncConfig
): MultiTabCRDTSync {
  return new MultiTabCRDTSync(getOperations, applyOperations, config);
}

/**
 * Create remote CRDT sync
 */
export function createRemoteCRDTSync(
  getOperations: () => CRDTOperation[],
  applyOperations: (operations: CRDTOperation[]) => Promise<void>,
  config: RemoteCRDTSyncConfig
): RemoteCRDTSync {
  return new RemoteCRDTSync(getOperations, applyOperations, config);
}

