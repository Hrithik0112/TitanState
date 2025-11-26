/**
 * Dependency tracking system for automatic dependency detection
 */

import type { Atom } from '@titanstate/types';
import type { Store } from '@titanstate/core';

/**
 * Dependency tracking context
 */
class DependencyTracker {
  private currentComputation: {
    dependencies: Set<Atom<unknown>>;
    store: Store;
  } | null = null;
  
  /**
   * Start tracking dependencies for a computation
   */
  startTracking(store: Store): void {
    this.currentComputation = {
      dependencies: new Set(),
      store,
    };
  }
  
  /**
   * Track an atom access
   */
  track(atom: Atom<unknown>): void {
    if (this.currentComputation) {
      this.currentComputation.dependencies.add(atom);
    }
  }
  
  /**
   * Stop tracking and get collected dependencies
   */
  stopTracking(): Atom<unknown>[] {
    if (!this.currentComputation) {
      return [];
    }
    
    const deps = Array.from(this.currentComputation.dependencies);
    this.currentComputation = null;
    return deps;
  }
  
  /**
   * Check if currently tracking
   */
  isTracking(): boolean {
    return this.currentComputation !== null;
  }
  
  /**
   * Get current store (if tracking)
   */
  getCurrentStore(): Store | null {
    return this.currentComputation?.store ?? null;
  }
}

/**
 * Global dependency tracker instance
 */
export const dependencyTracker = new DependencyTracker();

/**
 * Wrapper for store.get() that tracks dependencies
 */
export function trackedGet<T>(store: Store, atom: Atom<T>): T | undefined {
  // Track dependency if we're in a computation
  if (dependencyTracker.isTracking()) {
    dependencyTracker.track(atom as Atom<unknown>);
  }
  
  // Call original get
  return store.get(atom);
}

/**
 * Execute a function with dependency tracking
 */
export function withTracking<T>(
  store: Store,
  fn: () => T
): { result: T; dependencies: Atom<unknown>[] } {
  dependencyTracker.startTracking(store);
  
  try {
    const result = fn();
    const dependencies = dependencyTracker.stopTracking();
    return { result, dependencies };
  } catch (error) {
    dependencyTracker.stopTracking();
    throw error;
  }
}

/**
 * Create a tracked store proxy that automatically tracks dependencies
 * when get() is called
 */
export function createTrackedStore(store: Store): Store {
  return {
    ...store,
    get<T>(atom: Atom<T>): T | undefined {
      return trackedGet(store, atom) as T | undefined;
    },
  };
}

