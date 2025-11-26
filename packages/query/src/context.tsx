/**
 * React context for query client
 */

import React, { createContext, useContext } from 'react';
import type { QueryClient } from './client';

/**
 * Query client context
 */
const QueryClientContext = createContext<QueryClient | null>(null);

/**
 * Hook to get query client from context
 */
export function useQueryClient(): QueryClient {
  const client = useContext(QueryClientContext);
  
  if (!client) {
    throw new Error(
      'useQueryClient must be used within a QueryClientProvider. ' +
      'Make sure to wrap your component tree with <QueryClientProvider client={...}>'
    );
  }
  
  return client;
}

/**
 * Query client provider props
 */
export interface QueryClientProviderProps {
  client: QueryClient;
  children: React.ReactNode;
}

/**
 * Query client provider component
 */
export function QueryClientProvider({
  client,
  children,
}: QueryClientProviderProps): JSX.Element {
  return (
    <QueryClientContext.Provider value={client}>
      {children}
    </QueryClientContext.Provider>
  );
}

