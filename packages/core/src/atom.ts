/**
 * Atom creation and management
 */

import type { AtomKey, AtomValue, AtomOptions } from '@titanstate/types';
import type { Atom } from './types';

/**
 * Default equality function (shallow comparison)
 */
function defaultEquals<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) {
    return true;
  }
  
  // For objects and arrays, do shallow comparison
  if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) {
      return false;
    }
    
    for (const key of keysA) {
      if (!(key in (b as Record<string, unknown>))) {
        return false;
      }
      if (!Object.is((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
        return false;
      }
    }
    
    return true;
  }
  
  return false;
}

/**
 * Create a new atom
 */
export function createAtom<T = AtomValue>(
  key: AtomKey,
  initial: T,
  options: AtomOptions<T> = {}
): Atom<T> {
  const {
    persisted = false,
    lazyLoad = false,
    compress = false,
    eviction,
    sensitive = false,
    equals = defaultEquals,
  } = options;
  
  // Generate storage key if persisted
  const storageKey = persisted && typeof key === 'string' 
    ? `atom:${key}` 
    : undefined;
  
  const atom: Atom<T> = {
    key,
    value: lazyLoad ? undefined : initial,
    meta: {
      key: storageKey,
      hydrated: !lazyLoad,
      persisted,
      lastAccessed: lazyLoad ? undefined : Date.now(),
      size: undefined, // Will be calculated when needed
    },
    options: {
      persisted,
      lazyLoad,
      compress,
      eviction,
      sensitive,
      equals,
    },
  };
  
  return atom;
}

/**
 * Check if two values are equal using atom's equality function
 */
export function areValuesEqual<T>(atom: Atom<T>, a: T, b: T): boolean {
  return atom.options.equals ? atom.options.equals(a, b) : defaultEquals(a, b);
}

