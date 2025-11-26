/**
 * DevTools bridge for communication with browser extension
 */

import type {
  DevToolsMessage,
  DevToolsMessageType,
  DevToolsEvent,
} from './types';
import { EventLog } from './event-log';
import { StateReconstructor } from './reconstruction';
import type { Store } from '@titanstate/core';

/**
 * DevTools bridge configuration
 */
export interface DevToolsBridgeConfig {
  /**
   * Enable DevTools
   */
  enabled?: boolean;
  
  /**
   * Event log configuration
   */
  eventLog?: {
    maxInMemoryEvents?: number;
    persist?: boolean;
    snapshotInterval?: number;
  };
  
  /**
   * Storage driver for persistence
   */
  driver?: import('@titanstate/persist').Driver;
}

/**
 * DevTools bridge
 */
export class DevToolsBridge {
  private eventLog: EventLog;
  private reconstructor: StateReconstructor | null = null;
  private store: Store | null = null;
  private enabled: boolean;
  private messageHandlers = new Map<string, (message: DevToolsMessage) => void | Promise<void>>();
  
  constructor(config: DevToolsBridgeConfig = {}) {
    // Enable DevTools in development mode
    // Check for process.env safely (may not exist in browser)
    const isDevelopment = typeof window !== 'undefined' && 
      (typeof (globalThis as any).process === 'undefined' || 
       (globalThis as any).process?.env?.NODE_ENV === 'development');
    this.enabled = config.enabled ?? isDevelopment;
    
    this.eventLog = new EventLog({
      maxInMemoryEvents: config.eventLog?.maxInMemoryEvents,
      persist: config.eventLog?.persist,
      snapshotInterval: config.eventLog?.snapshotInterval,
      driver: config.driver,
    });
    
    if (this.enabled && typeof window !== 'undefined') {
      this.setupMessageListener();
    }
  }
  
  /**
   * Initialize with store
   */
  init(store: Store): void {
    this.store = store;
    this.reconstructor = new StateReconstructor(this.eventLog, store);
  }
  
  /**
   * Log an event
   */
  async logEvent(event: Omit<DevToolsEvent, 'seq' | 'ts'>): Promise<void> {
    if (!this.enabled) {
      return;
    }
    
    await this.eventLog.log(event);
    
    // Send to DevTools extension if available
    this.sendToExtension({
      type: 'event',
      payload: event,
    });
  }
  
  /**
   * Get event log
   */
  getEventLog(): EventLog {
    return this.eventLog;
  }
  
  /**
   * Get state reconstructor
   */
  getReconstructor(): StateReconstructor | null {
    return this.reconstructor;
  }
  
  /**
   * Handle message from DevTools extension
   */
  private async handleMessage(message: DevToolsMessage): Promise<void> {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      await handler(message);
      return;
    }
    
    // Default handlers
    switch (message.type) {
      case 'get-state': {
        if (!this.reconstructor) {
          return;
        }
        
        const seq = (message.payload as { seq?: number })?.seq;
        const atomKeys = (message.payload as { atomKeys?: unknown[] })?.atomKeys;
        
        const state = await this.reconstructor.reconstruct({
          targetSeq: seq,
          atomKeys: atomKeys as any,
          includeState: true,
        });
        
        this.sendToExtension({
          type: 'get-state',
          payload: state,
          id: message.id,
        });
        break;
      }
      
      case 'time-travel': {
        if (!this.reconstructor || !this.store) {
          return;
        }
        
        const seq = (message.payload as { seq: number }).seq;
        const state = await this.reconstructor.getStateAt(seq);
        
        // Apply state to store (for time-travel)
        // This would need to be implemented based on store API
        this.sendToExtension({
          type: 'time-travel',
          payload: { seq, state },
          id: message.id,
        });
        break;
      }
      
      case 'inspect-atom': {
        const key = (message.payload as { key: string | symbol }).key;
        const events = this.eventLog.getEventsForTarget(key);
        
        this.sendToExtension({
          type: 'inspect-atom',
          payload: { key, events },
          id: message.id,
        });
        break;
      }
      
      default:
        break;
    }
  }
  
  /**
   * Register message handler
   */
  onMessage(type: DevToolsMessageType, handler: (message: DevToolsMessage) => void | Promise<void>): () => void {
    this.messageHandlers.set(type, handler);
    
    return () => {
      this.messageHandlers.delete(type);
    };
  }
  
  /**
   * Setup message listener for DevTools extension
   */
  private setupMessageListener(): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    window.addEventListener('message', (event: MessageEvent) => {
      // Only accept messages from DevTools extension
      if (event.source !== window || !event.data || event.data.source !== 'titanstate-devtools') {
        return;
      }
      
      const message = event.data as DevToolsMessage;
      this.handleMessage(message).catch(error => {
        console.error('Error handling DevTools message:', error);
      });
    });
  }
  
  /**
   * Send message to DevTools extension
   */
  private sendToExtension(message: DevToolsMessage): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    window.postMessage(
      {
        source: 'titanstate-devtools',
        ...message,
      },
      '*'
    );
  }
  
  /**
   * Enable/disable DevTools
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
  
  /**
   * Get statistics
   */
  getStats() {
    return this.eventLog.getStats();
  }
}

