/**
 * Store creation and management
 */

import type { StoreConfig, AtomKey, AtomOptions, TransactionCallback } from '@titanstate/types';
import type { Store, Atom } from './types';
import { createAtom } from './atom';
import { SubscriptionManager } from './subscription';
import { Scheduler } from './scheduler';
import { areValuesEqual } from './atom';

/**
 * Internal store implementation
 */
class StoreImpl implements Store {
  private atoms = new Map<AtomKey, Atom>();
  private subscriptions = new SubscriptionManager();
  private scheduler = new Scheduler();
  private inTransaction = false;
  
  constructor(_config: StoreConfig = {}) {
    // Config stored for future use (drivers, workers, etc.)
    
    // Set up scheduler notification callback
    this.scheduler.setNotifyCallback((updates) => {
      for (const update of updates) {
        this.subscriptions.notify(
          update.atom,
          update.value,
          update.previousValue
        );
      }
    });
  }
  
  createAtom<T>(key: AtomKey, initial: T, options?: AtomOptions<T>): Atom<T> {
    // Check if atom already exists
    if (this.atoms.has(key)) {
      throw new Error(`Atom with key ${String(key)} already exists`);
    }
    
    const atom = createAtom(key, initial, options);
    this.atoms.set(key, atom as Atom<unknown>);
    
    return atom;
  }
  
  get<T>(atom: Atom<T>): T | undefined {
    // Update last accessed time
    atom.meta.lastAccessed = Date.now();
    
    return atom.value;
  }
  
  async getAsync<T>(atom: Atom<T>): Promise<T> {
    // Update last accessed time
    atom.meta.lastAccessed = Date.now();
    
    // If atom is hydrated, return immediately
    if (atom.meta.hydrated && atom.value !== undefined) {
      return atom.value;
    }
    
    // For lazy-loaded atoms, we would hydrate here
    // This will be implemented in the persist layer
    // For now, return the value or initial value
    if (atom.value === undefined) {
      throw new Error(`Atom ${String(atom.key)} is not hydrated and lazy loading is not yet implemented`);
    }
    
    return atom.value;
  }
  
  set<T>(atom: Atom<T>, value: T): void {
    const previousValue = atom.value;
    
    // Check if value actually changed
    if (atom.value !== undefined && areValuesEqual(atom, previousValue as T, value)) {
      return; // No change, skip update
    }
    
    // Update atom value
    atom.value = value;
    atom.meta.hydrated = true;
    atom.meta.lastAccessed = Date.now();
    
    // Schedule notification (batched)
    this.scheduler.schedule(atom, value, previousValue);
    
    // If persisted, we would save here (implemented in persist layer)
    // For now, just update in-memory
  }
  
  async setAsync<T>(atom: Atom<T>, value: T): Promise<void> {
    const previousValue = atom.value;
    
    // Check if value actually changed
    if (atom.value !== undefined && areValuesEqual(atom, previousValue as T, value)) {
      return; // No change, skip update
    }
    
    // Update atom value
    atom.value = value;
    atom.meta.hydrated = true;
    atom.meta.lastAccessed = Date.now();
    
    // Schedule notification (batched)
    this.scheduler.schedule(atom, value, previousValue);
    
    // If persisted, we would save here (implemented in persist layer)
    // For now, just update in-memory
  }
  
  subscribe<T>(atom: Atom<T>, listener: (value: T, previousValue: T | undefined) => void) {
    return this.subscriptions.subscribe(atom, listener);
  }
  
  async transaction(callback: TransactionCallback): Promise<void> {
    if (this.inTransaction) {
      // Nested transactions are allowed, just execute the callback
      await callback();
      return;
    }
    
    this.inTransaction = true;
    
    try {
      await callback();
      // Flush all updates synchronously after transaction
      this.scheduler.flushSync();
    } finally {
      this.inTransaction = false;
    }
  }
  
  dispatch(_action: unknown): void {
    // Dispatch is primarily for slice compatibility
    // For now, this is a no-op at the store level
    // Slices handle their own dispatch
    // This will be enhanced when we add middleware support
  }
  
  /**
   * Get all atoms (internal use)
   */
  getAllAtoms(): Map<AtomKey, Atom> {
    return this.atoms;
  }
  
  /**
   * Cleanup (for testing/teardown)
   */
  destroy(): void {
    this.subscriptions.clear();
    this.scheduler.clear();
    this.atoms.clear();
  }
}

/**
 * Create a new store instance
 */
export function createStore(config?: StoreConfig): Store {
  return new StoreImpl(config);
}

