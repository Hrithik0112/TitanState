/**
 * Signal implementation
 */

import type {
  Signal,
  SignalValue,
  SignalSubscriber,
  SignalOptions,
} from './types';

/**
 * Default equality function
 */
function defaultEquals<T>(a: T, b: T): boolean {
  return Object.is(a, b);
}

/**
 * Create a signal
 */
export function createSignal<T = SignalValue>(
  initialValue: T,
  options: SignalOptions<T> = {}
): Signal<T> {
  let value = initialValue;
  const subscribers = new Set<SignalSubscriber<T>>();
  const equals = options.equals ?? defaultEquals;
  const key = Symbol('signal');
  
  const signal: Signal<T> = {
    get() {
      return value;
    },
    
    set(newValue: T) {
      if (equals(value, newValue)) {
        return; // No change
      }
      
      value = newValue;
      
      // Notify subscribers
      for (const subscriber of subscribers) {
        try {
          subscriber(value);
        } catch (error) {
          console.error('Error in signal subscriber:', error);
        }
      }
    },
    
    update(updater: (value: T) => T) {
      const newValue = updater(value);
      signal.set(newValue);
    },
    
    subscribe(subscriber: SignalSubscriber<T>) {
      subscribers.add(subscriber);
      
      // Return unsubscribe function
      return () => {
        subscribers.delete(subscriber);
      };
    },
    
    get key() {
      return key;
    },
  };
  
  return signal;
}

/**
 * Create a computed signal (read-only)
 * 
 * Note: For automatic dependency tracking with atoms, use createSelector
 * from the selectors module instead, which integrates with the store.
 */
export function createComputed<T = SignalValue>(
  compute: () => T,
  options: SignalOptions<T> = {}
): Signal<T> {
  const signal = createSignal(compute(), options);
  
  // This is a simplified implementation
  // In a full implementation, we'd track dependencies automatically
  // by intercepting signal.get() calls during computation and
  // subscribing to those signals to recompute when they change
  
  return {
    ...signal,
    set() {
      throw new Error('Computed signals are read-only');
    },
    update() {
      throw new Error('Computed signals are read-only');
    },
  };
}

