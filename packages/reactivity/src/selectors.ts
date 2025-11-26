/**
 * Selector and memo implementation
 */

import type {
  Signal,
  SignalValue,
  Selector,
  SelectorOptions,
} from './types';

/**
 * Default equality function
 */
function defaultEquals<T>(a: T, b: T): boolean {
  return Object.is(a, b);
}

/**
 * Memoized selector result
 */
interface MemoizedResult<T> {
  value: T;
  dependencies: Signal<unknown>[];
  timestamp: number;
}

/**
 * Selector with dependency tracking and memoization
 */
export class SelectorSignal<T = SignalValue> {
  private selector: Selector<T>;
  private options: SelectorOptions<T>;
  private memoized: MemoizedResult<T> | null = null;
  private dependencies: Signal<unknown>[] = [];
  private unsubscribeDeps: (() => void)[] = [];
  private subscribers = new Set<(value: T) => void>();
  
  constructor(selector: Selector<T>, options: SelectorOptions<T> = {}) {
    this.selector = selector;
    this.options = {
      equals: options.equals ?? defaultEquals,
      memo: options.memo ?? true,
      ...options,
    };
  }
  
  /**
   * Get current value
   */
  get(): T {
    // Track dependencies during computation
    const currentDeps: Signal<unknown>[] = [];
    
    // Execute selector and track dependencies
    // This is a simplified version - in production, you'd use
    // a dependency tracking system that intercepts signal.get() calls
    const newValue = this.selector();
    
    // Check if dependencies changed
    const depsChanged = this.dependencies.length !== currentDeps.length ||
      this.dependencies.some((dep, i) => dep !== currentDeps[i]);
    
    // Check if memoized value is still valid
    if (this.options.memo && this.memoized && !depsChanged) {
      return this.memoized.value;
    }
    
    // Update memoized value
    if (this.options.memo) {
      this.memoized = {
        value: newValue,
        dependencies: [...currentDeps],
        timestamp: Date.now(),
      };
    }
    
    // Update dependencies
    this.updateDependencies(currentDeps);
    
    return newValue;
  }
  
  /**
   * Subscribe to changes
   */
  subscribe(subscriber: (value: T) => void): () => void {
    this.subscribers.add(subscriber);
    
    // Subscribe to dependencies
    this.subscribeToDependencies();
    
    return () => {
      this.subscribers.delete(subscriber);
      if (this.subscribers.size === 0) {
        this.unsubscribeFromDependencies();
      }
    };
  }
  
  /**
   * Update dependencies
   */
  private updateDependencies(newDeps: Signal<unknown>[]): void {
    // Unsubscribe from old dependencies
    this.unsubscribeFromDependencies();
    
    // Update dependencies
    this.dependencies = newDeps;
    
    // Subscribe to new dependencies if we have subscribers
    if (this.subscribers.size > 0) {
      this.subscribeToDependencies();
    }
  }
  
  /**
   * Subscribe to dependencies
   */
  private subscribeToDependencies(): void {
    this.unsubscribeDeps = this.dependencies.map(dep =>
      dep.subscribe(() => {
        // Dependency changed, invalidate memoized value
        this.memoized = null;
        
        // Recompute and notify subscribers
        const newValue = this.get();
        for (const subscriber of this.subscribers) {
          try {
            subscriber(newValue);
          } catch (error) {
            console.error('Error in selector subscriber:', error);
          }
        }
      })
    );
  }
  
  /**
   * Unsubscribe from dependencies
   */
  private unsubscribeFromDependencies(): void {
    for (const unsubscribe of this.unsubscribeDeps) {
      unsubscribe();
    }
    this.unsubscribeDeps = [];
  }
}

/**
 * Create a selector
 */
export function createSelector<T = SignalValue>(
  selector: Selector<T>,
  options: SelectorOptions<T> = {}
): SelectorSignal<T> {
  return new SelectorSignal(selector, options);
}

/**
 * Create a memoized selector
 */
export function createMemo<T = SignalValue>(
  selector: Selector<T>,
  options: SelectorOptions<T> = {}
): SelectorSignal<T> {
  return new SelectorSignal(selector, {
    ...options,
    memo: true,
  });
}

