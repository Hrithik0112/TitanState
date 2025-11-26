/**
 * Store creation and management
 */

import type { StoreConfig, AtomKey, AtomOptions, TransactionCallback, Action } from '@titanstate/types';
import type { Store, Atom } from './types';
import { createAtom } from './atom';
import { SubscriptionManager } from './subscription';
import { Scheduler } from './scheduler';
import { areValuesEqual } from './atom';
import { composeMiddleware, type Middleware } from './middleware';

// Minimal interfaces for integration hooks (avoid circular dependencies)
// These match the actual interfaces from the respective packages
interface Driver {
  put(key: string, value: unknown, options?: unknown): Promise<void>;
  get(key: string, options?: unknown): Promise<unknown | null>;
  delete(key: string): Promise<void>;
  has(key: string): Promise<boolean>;
  keys(prefix?: string): Promise<string[]>;
  clear(): Promise<void>;
}

interface DevToolsBridge {
  init(store: Store): void;
  logEvent(event: { type: string; target?: AtomKey; meta?: Record<string, unknown> }): Promise<void>;
}

interface WorkerBridge {
  dispatchToWorker(namespace: string, action: unknown, state?: unknown): Promise<unknown>;
}

/**
 * Internal store implementation
 */
class StoreImpl implements Store {
  private atoms = new Map<AtomKey, Atom>();
  private subscriptions = new SubscriptionManager();
  private scheduler = new Scheduler();
  private inTransaction = false;
  private persistenceDriver: Driver | null = null;
  private devtoolsBridge: DevToolsBridge | null = null;
  private workerBridge: WorkerBridge | null = null;
  private middlewareChain: ((action: Action) => unknown) | null = null;
  
  constructor(config: StoreConfig = {}) {
    // Store integration hooks
    this.persistenceDriver = (config.persistenceDriver as Driver) ?? null;
    this.devtoolsBridge = (config.devtoolsBridge as DevToolsBridge) ?? null;
    this.workerBridge = (config.workerBridge as WorkerBridge) ?? null;
    
    // Setup middleware chain if provided
    if (config.middleware && config.middleware.length > 0) {
      const middlewares = config.middleware as Middleware[];
      const finalDispatch = (action: Action) => {
        // Final dispatch - no-op by default, slices handle their own dispatch
        return action;
      };
      this.middlewareChain = composeMiddleware(middlewares)(this, finalDispatch);
    }
    
    // Initialize DevTools bridge if provided
    if (this.devtoolsBridge) {
      this.devtoolsBridge.init(this);
    }
    
    // Set up scheduler notification callback
    this.scheduler.setNotifyCallback((updates) => {
      for (const update of updates) {
        this.subscriptions.notify(
          update.atom,
          update.value,
          update.previousValue
        );
        
        // Log to DevTools if enabled
        if (this.devtoolsBridge) {
          this.devtoolsBridge.logEvent({
            type: 'atom-update',
            target: update.atom.key,
            meta: {
              previousValue: update.previousValue,
              newValue: update.value,
            },
          }).catch(error => {
            console.error('Error logging to DevTools:', error);
          });
        }
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
    
    // Auto-hydrate if atom is persisted and we have a driver
    if (atom.meta.persisted && !atom.meta.hydrated && this.persistenceDriver) {
      try {
        // Dynamic import to avoid circular dependencies
        // @ts-ignore - Dynamic import for optional dependency
        const persistModule = await import('@titanstate/persist');
        // @ts-ignore - Dynamic import for optional dependency
        const value = await persistModule.hydrateAtom(atom, this.persistenceDriver) as T;
        atom.value = value;
        atom.meta.hydrated = true;
        
        // Log hydration to DevTools
        if (this.devtoolsBridge) {
          await this.devtoolsBridge.logEvent({
            type: 'hydration',
            target: atom.key,
            meta: {
              size: atom.meta.size,
            },
          });
        }
        
        return value;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error hydrating atom ${String(atom.key)}:`, errorMessage);
        // If hydration fails and we have no value, throw
        if (atom.value === undefined) {
          throw error;
        }
      }
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
    
    // Auto-persist if atom is persisted and we have a driver
    if (atom.meta.persisted && this.persistenceDriver) {
      // Persist asynchronously (fire and forget)
      this.persistAtom(atom).catch(error => {
        console.error(`Error persisting atom ${String(atom.key)}:`, error);
      });
    }
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
    
    // Auto-persist if atom is persisted and we have a driver
    if (atom.meta.persisted && this.persistenceDriver) {
      await this.persistAtom(atom);
    }
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
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    // Log transaction start to DevTools
    if (this.devtoolsBridge) {
      await this.devtoolsBridge.logEvent({
        type: 'transaction-start',
        meta: {
          transactionId,
        },
      });
    }
    
    try {
      await callback();
      // Flush all updates synchronously after transaction
      this.scheduler.flushSync();
      
      // Log transaction end to DevTools
      if (this.devtoolsBridge) {
        const duration = Date.now() - startTime;
        await this.devtoolsBridge.logEvent({
          type: 'transaction-end',
          meta: {
            transactionId,
            duration,
          },
        });
      }
    } finally {
      this.inTransaction = false;
    }
  }
  
  dispatch(action: unknown): unknown {
    // If middleware chain exists, use it
    if (this.middlewareChain) {
      return this.middlewareChain(action as Action);
    }
    
    // Otherwise, default behavior (no-op at store level)
    // Slices handle their own dispatch
    return action;
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
    this.persistenceDriver = null;
    this.devtoolsBridge = null;
    this.workerBridge = null;
  }
  
  /**
   * Persist an atom to storage (internal helper)
   */
  private async persistAtom<T>(atom: Atom<T>): Promise<void> {
    if (!this.persistenceDriver || !atom.meta.persisted || !atom.meta.key) {
      return;
    }
    
    try {
      // Dynamic import to avoid circular dependencies
      // @ts-ignore - Dynamic import for optional dependency
      const persistModule = await import('@titanstate/persist');
      // @ts-ignore - Dynamic import for optional dependency
      await persistModule.persistAtom(atom, this.persistenceDriver, {
        compress: atom.options.compress,
      });
    } catch (error) {
      console.error(`Error persisting atom ${String(atom.key)}:`, error);
      throw error;
    }
  }
  
  /**
   * Get persistence driver (for external access)
   */
  getPersistenceDriver(): Driver | null {
    return this.persistenceDriver;
  }
  
  /**
   * Get DevTools bridge (for external access)
   */
  getDevToolsBridge(): DevToolsBridge | null {
    return this.devtoolsBridge;
  }
  
  /**
   * Get worker bridge (for external access)
   */
  getWorkerBridge(): WorkerBridge | null {
    return this.workerBridge;
  }
}

/**
 * Create a new store instance
 */
export function createStore(config?: StoreConfig): Store {
  return new StoreImpl(config);
}

