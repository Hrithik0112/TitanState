/**
 * Multi-tab synchronization using BroadcastChannel and SharedWorker
 */

import type { SyncMessage, SyncMessageType } from './types';
import type { Store } from '@titanstate/core';
import type { Atom } from '@titanstate/types';

/**
 * Multi-tab sync configuration
 */
export interface MultiTabSyncConfig {
  /**
   * Channel name for BroadcastChannel
   */
  channelName?: string;
  
  /**
   * Use SharedWorker instead of BroadcastChannel
   */
  useSharedWorker?: boolean;
  
  /**
   * SharedWorker script URL
   */
  sharedWorkerUrl?: string;
  
  /**
   * Enable sync
   */
  enabled?: boolean;
}

/**
 * Multi-tab synchronizer
 */
export class MultiTabSync {
  // Store for future use (e.g., applying state from other tabs)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _store: Store | null = null;
  private channel: BroadcastChannel | null = null;
  private sharedWorker: SharedWorker | null = null;
  private tabId: string;
  private config: Required<Pick<MultiTabSyncConfig, 'channelName' | 'enabled'>> & MultiTabSyncConfig;
  private messageHandlers = new Map<SyncMessageType, (message: SyncMessage) => void>();
  
  constructor(config: MultiTabSyncConfig = {}) {
    this.config = {
      channelName: config.channelName ?? 'titanstate-sync',
      enabled: config.enabled ?? true,
      ...config,
    };
    
    // Generate unique tab ID
    this.tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (this.config.enabled) {
      this.initialize();
    }
  }
  
  /**
   * Initialize sync
   */
  private initialize(): void {
    if (this.config.useSharedWorker && this.config.sharedWorkerUrl) {
      this.initializeSharedWorker();
    } else if (typeof BroadcastChannel !== 'undefined') {
      this.initializeBroadcastChannel();
    } else {
      console.warn('Multi-tab sync not supported: BroadcastChannel and SharedWorker not available');
    }
  }
  
  /**
   * Initialize BroadcastChannel
   */
  private initializeBroadcastChannel(): void {
    try {
      this.channel = new BroadcastChannel(this.config.channelName);
      
      this.channel.onmessage = (event: MessageEvent<SyncMessage>) => {
        this.handleMessage(event.data);
      };
    } catch (error) {
      console.error('Failed to initialize BroadcastChannel:', error);
    }
  }
  
  /**
   * Initialize SharedWorker
   */
  private initializeSharedWorker(): void {
    if (typeof SharedWorker === 'undefined') {
      console.warn('SharedWorker is not supported');
      return;
    }
    
    try {
      this.sharedWorker = new SharedWorker(this.config.sharedWorkerUrl!);
      
      this.sharedWorker.port.onmessage = (event: MessageEvent<SyncMessage>) => {
        this.handleMessage(event.data);
      };
      
      this.sharedWorker.port.start();
    } catch (error) {
      console.error('Failed to initialize SharedWorker:', error);
    }
  }
  
  /**
   * Set store instance
   */
  setStore(store: Store): void {
    this._store = store; // Store for future use (e.g., applying state from other tabs)
  }
  
  /**
   * Handle incoming message
   */
  private handleMessage(message: SyncMessage): void {
    // Ignore messages from self
    if (message.source === this.tabId) {
      return;
    }
    
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
      return;
    }
    
    // Default handlers
    switch (message.type) {
      case 'atom-change': {
        // Apply atom change from another tab
        // This would need to be implemented based on store API
        if (this._store) {
          // Future: apply atom change using store API
        }
        break;
      }
      
      case 'sync-request': {
        // Respond to sync request
        this.sendSyncResponse();
        break;
      }
      
      case 'sync-response': {
        // Handle sync response
        // This would apply state from another tab
        if (this._store) {
          // Future: apply state from another tab using store API
        }
        break;
      }
      
      default:
        break;
    }
  }
  
  /**
   * Send message to other tabs
   */
  private sendMessage(type: SyncMessageType, payload: unknown): void {
    const message: SyncMessage = {
      type,
      payload,
      timestamp: Date.now(),
      source: this.tabId,
    };
    
    if (this.channel) {
      this.channel.postMessage(message);
    } else if (this.sharedWorker) {
      this.sharedWorker.port.postMessage(message);
    }
  }
  
  /**
   * Broadcast atom change
   */
  broadcastAtomChange(atom: Atom<unknown>, newValue: unknown): void {
    this.sendMessage('atom-change', {
      key: atom.key,
      value: newValue,
    });
  }
  
  /**
   * Request sync from other tabs
   */
  requestSync(): void {
    this.sendMessage('sync-request', {});
  }
  
  /**
   * Send sync response
   */
  private sendSyncResponse(): void {
    // This would collect current state and send it
    // Implementation depends on store API
    this.sendMessage('sync-response', {
      state: {}, // Would contain actual state
    });
  }
  
  /**
   * Register message handler
   */
  onMessage(type: SyncMessageType, handler: (message: SyncMessage) => void): () => void {
    this.messageHandlers.set(type, handler);
    
    return () => {
      this.messageHandlers.delete(type);
    };
  }
  
  /**
   * Close sync
   */
  close(): void {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    
    if (this.sharedWorker) {
      this.sharedWorker.port.close();
      this.sharedWorker = null;
    }
  }
}

