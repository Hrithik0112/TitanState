/**
 * Derived signal computation
 */

import type {
  Signal,
  SignalValue,
  DerivedSignalOptions,
} from './types';
import { createSignal } from './signals';

/**
 * Default equality function
 */
function defaultEquals<T>(a: T, b: T): boolean {
  return Object.is(a, b);
}

/**
 * Create a derived signal from one or more source signals
 */
export function createDerived<T = SignalValue>(
  sources: Signal<unknown>[],
  compute: (...values: unknown[]) => T,
  options: DerivedSignalOptions<T> = {}
): Signal<T> {
  const equals = options.equals ?? defaultEquals;
  const signal = createSignal(compute(...sources.map(s => s.get())), { equals });
  
  // Subscribe to all sources
  sources.forEach(source =>
    source.subscribe(() => {
      const newValue = compute(...sources.map(s => s.get()));
      signal.set(newValue);
    })
  );
  
  // Return a signal that unsubscribes when no longer needed
  // This is a simplified version - in production, you'd want
  // to handle cleanup more carefully
  return {
    ...signal,
    subscribe(subscriber) {
      const unsubscribe = signal.subscribe(subscriber);
      
      return () => {
        unsubscribe();
        // Clean up source subscriptions if no one is listening
        // This is a simplified cleanup - in production, you'd track
        // subscriber count more carefully
      };
    },
  };
}

/**
 * Create a derived signal from a single source
 */
export function derive<TInput = SignalValue, TOutput = SignalValue>(
  source: Signal<TInput>,
  transform: (value: TInput) => TOutput,
  options: DerivedSignalOptions<TOutput> = {}
): Signal<TOutput> {
  return createDerived(
    [source],
    (value) => transform(value as TInput),
    options
  );
}

/**
 * Combine multiple signals into one
 */
export function combine<T extends Signal<unknown>[]>(
  ...signals: T
): Signal<{ [K in keyof T]: T[K] extends Signal<infer V> ? V : never }> {
  return createDerived(
    signals,
    (...values) => values as any,
    {}
  ) as Signal<{ [K in keyof T]: T[K] extends Signal<infer V> ? V : never }>;
}

/**
 * Create a signal that filters values
 */
export function filter<T = SignalValue>(
  source: Signal<T>,
  predicate: (value: T) => boolean,
  options: DerivedSignalOptions<T | undefined> = {}
): Signal<T | undefined> {
  return derive(
    source,
    (value) => predicate(value as T) ? (value as T) : undefined,
    options
  );
}

/**
 * Create a signal that maps values
 */
export function map<TInput = SignalValue, TOutput = SignalValue>(
  source: Signal<TInput>,
  transform: (value: TInput) => TOutput,
  options: DerivedSignalOptions<TOutput> = {}
): Signal<TOutput> {
  return derive(source, transform, options);
}

