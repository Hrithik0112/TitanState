/**
 * Scheduler for batching updates and managing update queue
 */

import type { Atom } from './types';

/**
 * Pending update for an atom
 */
interface PendingUpdate<T> {
  atom: Atom<T>;
  value: T;
  previousValue: T | undefined;
}

/**
 * Scheduler for batching atom updates
 */
export class Scheduler {
  private updateQueue: PendingUpdate<unknown>[] = [];
  private isScheduled = false;
  private notifyCallback?: (updates: PendingUpdate<unknown>[]) => void;
  
  /**
   * Set the callback to be invoked when updates are flushed
   */
  setNotifyCallback(callback: (updates: PendingUpdate<unknown>[]) => void): void {
    this.notifyCallback = callback;
  }
  
  /**
   * Schedule an update to be batched
   */
  schedule<T>(atom: Atom<T>, value: T, previousValue: T | undefined): void {
    // Check if this atom already has a pending update
    const existingIndex = this.updateQueue.findIndex(
      update => update.atom.key === atom.key
    );
    
    if (existingIndex >= 0) {
      // Update the existing pending update
      const existing = this.updateQueue[existingIndex];
      if (existing) {
        this.updateQueue[existingIndex] = {
          atom: atom as Atom<unknown>,
          value,
          previousValue: existing.previousValue,
        };
      }
    } else {
      // Add new update to queue
      this.updateQueue.push({
        atom: atom as Atom<unknown>,
        value,
        previousValue,
      });
    }
    
    // Schedule flush if not already scheduled
    if (!this.isScheduled) {
      this.isScheduled = true;
      
      // Use microtask for batching (similar to React's batching)
      if (typeof queueMicrotask !== 'undefined') {
        queueMicrotask(() => this.flush());
      } else {
        // Fallback for older environments
        Promise.resolve().then(() => this.flush());
      }
    }
  }
  
  /**
   * Flush all pending updates
   */
  private flush(): void {
    if (this.updateQueue.length === 0) {
      this.isScheduled = false;
      return;
    }
    
    // Create a copy of the queue and clear it
    const updates = [...this.updateQueue];
    this.updateQueue = [];
    this.isScheduled = false;
    
    // Notify subscribers
    if (this.notifyCallback) {
      this.notifyCallback(updates);
    }
  }
  
  /**
   * Force immediate flush (for transactions)
   */
  flushSync(): void {
    if (this.updateQueue.length > 0) {
      this.flush();
    }
  }
  
  /**
   * Clear all pending updates
   */
  clear(): void {
    this.updateQueue = [];
    this.isScheduled = false;
  }
}

