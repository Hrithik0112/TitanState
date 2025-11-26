/**
 * React hooks for TitanState
 */

import { useSyncExternalStore, useCallback, useRef } from 'react';
import type { Atom, Action } from '@titanstate/types';
import type { EqualityFn } from './types';
import { useStore } from './context';

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
 * Hook to select a derived value from one or more atoms using a selector function
 * 
 * Note: This is a simplified implementation. For Phase 7 (reactivity engine),
 * we'll add automatic dependency tracking. For now, you must explicitly pass
 * the atoms you want to subscribe to.
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
): T {
  const store = useStore();
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

