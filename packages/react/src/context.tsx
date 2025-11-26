/**
 * React context for store
 */

import React, { createContext, useContext } from 'react';
import type { Store } from '@titanstate/core';

/**
 * Store context
 */
const StoreContext = createContext<Store | null>(null);

/**
 * Hook to get the store from context
 */
export function useStore(): Store {
  const store = useContext(StoreContext);
  
  if (!store) {
    throw new Error(
      'useStore must be used within a StoreProvider. ' +
      'Make sure to wrap your component tree with <StoreProvider store={...}>'
    );
  }
  
  return store;
}

/**
 * Store context provider props
 */
export interface StoreProviderProps {
  store: Store;
  children: React.ReactNode;
}

/**
 * Store context provider component
 */
export function StoreProvider({ store, children }: StoreProviderProps): JSX.Element {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

