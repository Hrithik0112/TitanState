/**
 * Worker bridge for main thread communication
 */

import type {
  WorkerMessage,
  DispatchMessage,
  ResultMessage,
  ErrorMessage,
} from './types';
import { WorkerPool } from './pool';

/**
 * Message handler type
 */
export type MessageHandler = (message: WorkerMessage) => void;

/**
 * Worker bridge configuration
 */
export interface WorkerBridgeConfig {
  /**
   * Worker script URL
   */
  scriptUrl?: string;
  
  /**
   * Worker pool size
   */
  poolSize?: number;
  
  /**
   * Enable message logging
   */
  debug?: boolean;
}

/**
 * Worker bridge for managing communication with web workers
 */
export class WorkerBridge {
  private pool: WorkerPool | null = null;
  private messageHandlers = new Map<string, {
    resolve: (value: unknown) => void;
    reject: (error: Error) => void;
    timestamp: number;
  }>();
  private globalHandlers: MessageHandler[] = [];
  private messageIdCounter = 0;
  private config: WorkerBridgeConfig;
  
  constructor(config: WorkerBridgeConfig = {}) {
    this.config = config;
  }
  
  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${++this.messageIdCounter}`;
  }
  
  /**
   * Start the worker bridge
   */
  start(scriptUrl: string): void {
    if (this.pool) {
      console.warn('Worker bridge already started');
      return;
    }
    
    if (typeof Worker === 'undefined') {
      console.warn('Web Workers are not supported in this environment');
      return;
    }
    
    this.pool = new WorkerPool({
      scriptUrl,
      poolSize: this.config.poolSize,
    });
    
    // Set up message listeners for all workers
    this.pool.getWorkers().forEach(worker => {
      worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
        this.handleWorkerMessage(event.data);
      };
      
      worker.onerror = (error: ErrorEvent) => {
        console.error('Worker error:', error);
        this.handleWorkerError(error);
      };
    });
  }
  
  /**
   * Stop the worker bridge
   */
  stop(): void {
    if (this.pool) {
      this.pool.terminate();
      this.pool = null;
    }
    
    // Reject all pending messages
    for (const handler of this.messageHandlers.values()) {
      handler.reject(new Error('Worker bridge stopped'));
    }
    this.messageHandlers.clear();
  }
  
  /**
   * Handle message from worker
   */
  private handleWorkerMessage(message: WorkerMessage): void {
    if (this.config.debug) {
      console.log('[WorkerBridge] Received message:', message);
    }
    
    // Check if this is a response to a pending message
    if (this.messageHandlers.has(message.id)) {
      const handler = this.messageHandlers.get(message.id)!;
      this.messageHandlers.delete(message.id);
      
      if (message.type === 'result') {
        handler.resolve((message as ResultMessage).result);
      } else if (message.type === 'error') {
        const errorMsg = message as ErrorMessage;
        handler.reject(new Error(errorMsg.error.message));
      }
      
      return;
    }
    
    // Call global handlers
    for (const handler of this.globalHandlers) {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    }
  }
  
  /**
   * Handle worker error
   */
  private handleWorkerError(error: ErrorEvent): void {
    // Reject all pending messages
    for (const handler of this.messageHandlers.values()) {
      handler.reject(new Error(`Worker error: ${error.message}`));
    }
    this.messageHandlers.clear();
  }
  
  /**
   * Send message to worker
   */
  private async sendMessage(message: WorkerMessage): Promise<unknown> {
    if (!this.pool) {
      throw new Error('Worker bridge not started. Call start() first.');
    }
    
    return this.pool.execute(async (worker) => {
      return new Promise((resolve, reject) => {
        // Store handler for response
        this.messageHandlers.set(message.id, {
          resolve,
          reject,
          timestamp: Date.now(),
        });
        
        // Set timeout for message (30 seconds)
        setTimeout(() => {
          if (this.messageHandlers.has(message.id)) {
            this.messageHandlers.delete(message.id);
            reject(new Error('Message timeout'));
          }
        }, 30000);
        
        // Send message to worker
        worker.postMessage(message);
      });
    });
  }
  
  /**
   * Dispatch action to worker
   */
  async dispatchToWorker(
    namespace: string,
    action: unknown,
    state?: unknown
  ): Promise<unknown> {
    const message: DispatchMessage = {
      id: this.generateMessageId(),
      type: 'dispatch',
      namespace,
      action: action as { type: string; payload?: unknown },
      state,
      timestamp: Date.now(),
    };
    
    return this.sendMessage(message);
  }
  
  /**
   * Register a global message handler
   */
  onMessage(handler: MessageHandler): () => void {
    this.globalHandlers.push(handler);
    
    return () => {
      const index = this.globalHandlers.indexOf(handler);
      if (index >= 0) {
        this.globalHandlers.splice(index, 1);
      }
    };
  }
  
  /**
   * Get worker pool statistics
   */
  getStats() {
    return this.pool?.getStats() ?? null;
  }
}

