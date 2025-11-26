/**
 * React hooks for queries
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  QueryKey,
  QueryFunction,
  QueryOptions,
  QueryResult,
  MutationFunction,
  MutationOptions,
  MutationResult,
} from './types';
import { useQueryClient } from './context';

/**
 * useQuery hook
 */
export function useQuery<TData = unknown>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TData>,
  options: QueryOptions<TData> = {}
): QueryResult<TData> {
  const queryClient = useQueryClient();
  const [result, setResult] = useState<QueryResult<TData>>({
    data: undefined,
    error: null,
    status: 'idle',
    isLoading: false,
    isError: false,
    isSuccess: false,
    isIdle: true,
    refetch: async () => {
      return queryClient.fetchQuery(queryKey, queryFn, options);
    },
  });
  
  const enabled = options.enabled !== false;
  const mountedRef = useRef(true);
  
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  useEffect(() => {
    if (!enabled) {
      return;
    }
    
    // Check cache first
    const cached = queryClient.getQueryData<TData>(queryKey);
    if (cached !== undefined && !queryClient.getCache().isStale(queryKey)) {
      setResult(prev => ({
        ...prev,
        data: cached,
        status: 'success',
        isLoading: false,
        isError: false,
        isSuccess: true,
        isIdle: false,
      }));
      return;
    }
    
    // Set loading state
    setResult(prev => ({
      ...prev,
      status: 'loading',
      isLoading: true,
      isError: false,
      isSuccess: false,
      isIdle: false,
    }));
    
    // Fetch data
    queryClient
      .fetchQuery(queryKey, queryFn, options)
      .then(data => {
        if (!mountedRef.current) return;
        
        setResult(prev => ({
          ...prev,
          data,
          status: 'success',
          isLoading: false,
          isError: false,
          isSuccess: true,
          isIdle: false,
        }));
      })
      .catch(error => {
        if (!mountedRef.current) return;
        
        setResult(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error(String(error)),
          status: 'error',
          isLoading: false,
          isError: true,
          isSuccess: false,
          isIdle: false,
        }));
      });
  }, [queryKey, queryClient, queryFn, enabled, options.staleTime, options.cacheTime]);
  
  const refetch = useCallback(async () => {
    const data = await queryClient.fetchQuery(queryKey, queryFn, options);
    return data;
  }, [queryKey, queryClient, queryFn, options]);
  
  return {
    ...result,
    refetch,
  };
}

/**
 * useMutation hook
 */
export function useMutation<TData = unknown, TVariables = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
  options: MutationOptions<TData, TVariables> = {}
): MutationResult<TData, TVariables> {
  const [result, setResult] = useState<MutationResult<TData, TVariables>>({
    data: undefined,
    error: null,
    status: 'idle',
    isLoading: false,
    isError: false,
    isSuccess: false,
    isIdle: true,
    mutate: async () => {
      throw new Error('mutate not initialized');
    },
    reset: () => {
      setResult({
        data: undefined,
        error: null,
        status: 'idle',
        isLoading: false,
        isError: false,
        isSuccess: false,
        isIdle: true,
        mutate: result.mutate,
        reset: result.reset,
      });
    },
  });
  
  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setResult(prev => ({
        ...prev,
        status: 'loading',
        isLoading: true,
        isError: false,
        isSuccess: false,
        isIdle: false,
      }));
      
      try {
        const data = await mutationFn(variables);
        
        setResult(prev => ({
          ...prev,
          data,
          status: 'success',
          isLoading: false,
          isError: false,
          isSuccess: true,
          isIdle: false,
        }));
        
        options.onSuccess?.(data, variables);
        return data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        
        setResult(prev => ({
          ...prev,
          error: err,
          status: 'error',
          isLoading: false,
          isError: true,
          isSuccess: false,
          isIdle: false,
        }));
        
        options.onError?.(err, variables);
        throw error;
      }
    },
    [mutationFn, options]
  );
  
  const reset = useCallback(() => {
    setResult(prev => ({
      ...prev,
      data: undefined,
      error: null,
      status: 'idle',
      isLoading: false,
      isError: false,
      isSuccess: false,
      isIdle: true,
      mutate,
      reset,
    }));
  }, [mutate]);
  
  // Update mutate and reset in result
  return {
    ...result,
    mutate,
    reset,
  };
}

