/**
 * Reactivity-specific types
 */

/**
 * Signal value type
 */
export type SignalValue = unknown;

/**
 * Signal subscriber function
 */
export type SignalSubscriber<T = SignalValue> = (value: T) => void;

/**
 * Equality function for signals
 */
export type EqualityFn<T> = (a: T, b: T) => boolean;

/**
 * Signal options
 */
export interface SignalOptions<T = SignalValue> {
  /**
   * Equality function for determining if value changed
   */
  equals?: EqualityFn<T>;
}

/**
 * Signal interface
 */
export interface Signal<T = SignalValue> {
  /**
   * Get current value
   */
  get(): T;
  
  /**
   * Set value
   */
  set(value: T): void;
  
  /**
   * Update value using a function
   */
  update(updater: (value: T) => T): void;
  
  /**
   * Subscribe to changes
   */
  subscribe(subscriber: SignalSubscriber<T>): () => void;
  
  /**
   * Get signal key (for identification)
   */
  readonly key: string | symbol;
}

/**
 * Derived signal options
 */
export interface DerivedSignalOptions<T = SignalValue> {
  /**
   * Equality function
   */
  equals?: EqualityFn<T>;
  
  /**
   * Memoization enabled
   */
  memo?: boolean;
}

/**
 * Selector function
 */
export type Selector<T = SignalValue> = (...args: SignalValue[]) => T;

/**
 * Selector options
 */
export interface SelectorOptions<T = SignalValue> {
  /**
   * Equality function
   */
  equals?: EqualityFn<T>;
  
  /**
   * Memoization enabled
   */
  memo?: boolean;
}

