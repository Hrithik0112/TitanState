/**
 * React hooks for TitanState
 */

import { useSyncExternalStore, useCallback, useRef } from 'react';
import type { Atom, Action } from '@titanstate/types';
import type { Store } from '@titanstate/core';
import type { EqualityFn } from './types';
import { useStore } from './context';
import { withTracking, trackedGet } from '@titanstate/reactivity';

/**
 * Default equality function for selectors
 */
const defaultEqualityFn = <T,>(a: T, b: T): boolean => Object.is(a, b);

/**
 * Hook to access and update an atom
 * 
 * @example
 * ```tsx
 * const [count, setCount] = useAtom(countAtom);
 * ```
 */
export function useAtom<T>(atom: Atom<T>): [T, (value: T) => void] {
  const store = useStore();
  
  // Subscribe to atom changes
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      return store.subscribe(atom, () => {
        onStoreChange();
      });
    },
    [store, atom]
  );
  
  // Get current value
  const getSnapshot = useCallback(() => {
    const value = store.get(atom);
    if (value === undefined) {
      throw new Error(`Atom ${String(atom.key)} is not hydrated`);
    }
    return value;
  }, [store, atom]);
  
  // Get server snapshot (for SSR compatibility)
  // For SSR, we return undefined if not hydrated, but the type system
  // expects T, so we'll throw here too to maintain type safety
  const getServerSnapshot = useCallback(() => {
    const value = store.get(atom);
    if (value === undefined) {
      throw new Error(`Atom ${String(atom.key)} is not hydrated`);
    }
    return value;
  }, [store, atom]);
  
  // Use React's useSyncExternalStore for concurrent rendering support
  const value = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  
  // Setter function
  const setValue = useCallback(
    (newValue: T) => {
      store.set(atom, newValue);
    },
    [store, atom]
  );
  
  return [value, setValue];
}

/**
 * Hook to read an atom value (read-only)
 * 
 * @example
 * ```tsx
 * const count = useAtomValue(countAtom);
 * ```
 */
export function useAtomValue<T>(atom: Atom<T>): T {
  const [value] = useAtom(atom);
  return value;
}

/**
 * Hook to get a setter function for an atom
 * 
 * @example
 * ```tsx
 * const setCount = useSetAtom(countAtom);
 * setCount(5);
 * ```
 */
export function useSetAtom<T>(atom: Atom<T>): (value: T) => void {
  const store = useStore();
  
  return useCallback(
    (value: T) => {
      store.set(atom, value);
    },
    [store, atom]
  );
}

/**
 * Hook to select a derived value using a selector function with automatic dependency tracking
 * 
 * This hook automatically tracks which atoms are accessed during selector execution
 * and subscribes to them. No need to explicitly pass atoms!
 * 
 * The selector function receives a tracked store as its parameter, which automatically
 * tracks dependencies when you call store.get().
 * 
 * @example
 * ```tsx
 * // Automatic dependency tracking - store is passed to selector
 * const userName = useSelector((store) => {
 *   const user = store.get(userAtom);
 *   return user.name;
 * });
 * 
 * // Multiple atoms - automatically tracked
 * const fullName = useSelector((store) => {
 *   const first = store.get(firstNameAtom);
 *   const last = store.get(lastNameAtom);
 *   return `${first} ${last}`;
 * });
 * ```
 */
export function useSelector<T>(
  selector: (store: Store) => T,
  equalityFn?: EqualityFn<T>
): T;

/**
 * Hook to select a derived value from one or more atoms using a selector function
 * 
 * @deprecated Use the automatic dependency tracking version instead:
 * `useSelector(() => { const value = store.get(atom); return ... })`
 * 
 * @example
 * ```tsx
 * // Simple case: select from a single atom
 * const userName = useSelector([userAtom], (user) => user.name);
 * 
 * // Multiple atoms
 * const fullName = useSelector([firstNameAtom, lastNameAtom], (state) => 
 *   `${state[0]} ${state[1]}`
 * );
 * ```
 */
export function useSelector<T>(
  atoms: Atom<unknown>[],
  selector: (values: unknown[]) => T,
  equalityFn?: EqualityFn<T>
): T;

export function useSelector<T>(
  atomsOrSelector: Atom<unknown>[] | ((store: Store) => T),
  selectorOrEquality?: ((values: unknown[]) => T) | EqualityFn<T>,
  equalityFn?: EqualityFn<T>
): T {
  const store = useStore();
  
  // Check if this is the new automatic dependency tracking API
  if (typeof atomsOrSelector === 'function') {
    // New API: automatic dependency tracking
    const selector = atomsOrSelector as (store: Store) => T;
    const equality = (selectorOrEquality as EqualityFn<T>) ?? defaultEqualityFn;
    const selectorRef = useRef(selector);
    const equalityRef = useRef(equality);
    const dependenciesRef = useRef<Atom<unknown>[]>([]);
    
    // Update refs if they change
    selectorRef.current = selector;
    equalityRef.current = equality;
    
    // Create tracked store that intercepts get() calls
    const trackedStoreRef = useRef<Store | null>(null);
    if (!trackedStoreRef.current) {
      trackedStoreRef.current = {
        ...store,
        get: <U>(atom: Atom<U>) => trackedGet(store, atom),
      } as Store;
    }
    
    // Subscribe to dependencies
    const subscribe = useCallback(
      (onStoreChange: () => void) => {
        const unsubscribes: (() => void)[] = [];
        
        // Subscribe to each dependency
        for (const atom of dependenciesRef.current) {
          const unsubscribe = store.subscribe(atom, () => {
            onStoreChange();
          });
          unsubscribes.push(unsubscribe);
        }
        
        return () => {
          for (const unsubscribe of unsubscribes) {
            unsubscribe();
          }
        };
      },
      [store]
    );
    
    const getSnapshot = useCallback(() => {
      // Track dependencies during computation
      const { result, dependencies } = withTracking(store, () => {
        // Execute selector with tracked store
        return selectorRef.current(trackedStoreRef.current!);
      });
      
      // Update dependencies
      dependenciesRef.current = dependencies;
      
      return result;
    }, [store]);
    
    const getServerSnapshot = useCallback(() => {
      return getSnapshot();
    }, [getSnapshot]);
    
    // Track previous value to avoid unnecessary re-renders
    const previousValueRef = useRef<T>();
    
    const currentValue = useSyncExternalStore(
      subscribe,
      () => {
        const newValue = getSnapshot();
        const prevValue = previousValueRef.current;
        
        if (prevValue === undefined || !equalityRef.current(prevValue, newValue)) {
          previousValueRef.current = newValue;
          return newValue;
        }
        
        return prevValue!;
      },
      getServerSnapshot
    );
    
    return currentValue;
  } else {
    // Legacy API: explicit atoms array
    const atoms = atomsOrSelector;
    const selector = selectorOrEquality as (values: unknown[]) => T;
    const equality = equalityFn ?? defaultEqualityFn;
    const selectorRef = useRef(selector);
    const equalityRef = useRef(equality);
    const atomsRef = useRef(atoms);
    
    // Update refs if they change
    selectorRef.current = selector;
    equalityRef.current = equality;
    atomsRef.current = atoms;
    
    // Subscribe to all atoms
    const subscribe = useCallback(
      (onStoreChange: () => void) => {
        const unsubscribes: (() => void)[] = [];
        
        // Subscribe to each atom
        for (const atom of atomsRef.current) {
          const unsubscribe = store.subscribe(atom, () => {
            onStoreChange();
          });
          unsubscribes.push(unsubscribe);
        }
        
        return () => {
          for (const unsubscribe of unsubscribes) {
            unsubscribe();
          }
        };
      },
      [store]
    );
    
    const getSnapshot = useCallback(() => {
      // Get values from all atoms
      const values = atomsRef.current.map(atom => store.get(atom));
      return selectorRef.current(values);
    }, [store]);
    
    const getServerSnapshot = useCallback(() => {
      return getSnapshot();
    }, [getSnapshot]);
    
    // Track previous value to avoid unnecessary re-renders
    const previousValueRef = useRef<T>();
    
    const currentValue = useSyncExternalStore(
      subscribe,
      () => {
        const newValue = getSnapshot();
        const prevValue = previousValueRef.current;
        
        if (prevValue === undefined || !equalityRef.current(prevValue, newValue)) {
          previousValueRef.current = newValue;
          return newValue;
        }
        
        return prevValue!;
      },
      getServerSnapshot
    );
    
    return currentValue;
  }
}

/**
 * Hook to get the dispatch function
 * 
 * @example
 * ```tsx
 * const dispatch = useDispatch();
 * dispatch({ type: 'increment' });
 * ```
 */
export function useDispatch(): (action: Action) => void {
  const store = useStore();
  
  return useCallback(
    (action: Action) => {
      store.dispatch(action);
    },
    [store]
  );
}

