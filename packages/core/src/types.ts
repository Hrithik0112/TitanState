/**
 * Core-specific types
 */

import type { StoreConfig, AtomKey, AtomValue, AtomOptions, Atom, Listener, Unsubscribe, TransactionCallback } from '@titanstate/types';

export type { StoreConfig, AtomKey, AtomValue, AtomOptions, Atom, Listener, Unsubscribe, TransactionCallback };

/**
 * Store interface
 */
export interface Store {
  /**
   * Create a new atom
   */
  createAtom<T>(key: AtomKey, initial: T, options?: AtomOptions<T>): Atom<T>;
  
  /**
   * Get atom value (synchronous)
   */
  get<T>(atom: Atom<T>): T | undefined;
  
  /**
   * Get atom value (asynchronous, handles lazy loading)
   */
  getAsync<T>(atom: Atom<T>): Promise<T>;
  
  /**
   * Set atom value (synchronous)
   */
  set<T>(atom: Atom<T>, value: T): void;
  
  /**
   * Set atom value (asynchronous, handles persistence)
   */
  setAsync<T>(atom: Atom<T>, value: T): Promise<void>;
  
  /**
   * Subscribe to atom changes
   */
  subscribe<T>(atom: Atom<T>, listener: Listener<T>): Unsubscribe;
  
  /**
   * Execute a transaction (grouped updates)
   */
  transaction(callback: TransactionCallback): Promise<void>;
  
  /**
   * Dispatch an action (for slice compatibility)
   */
  dispatch(action: unknown): void;
}

