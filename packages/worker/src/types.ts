/**
 * Worker-specific types
 */

import type { Action, PatchOp } from '@titanstate/types';

export type { Action, PatchOp };

/**
 * Worker message types
 */
export type WorkerMessageType = 
  | 'dispatch' 
  | 'patch' 
  | 'result' 
  | 'error' 
  | 'register-reducer'
  | 'ping'
  | 'pong';

/**
 * Base worker message
 */
export interface WorkerMessage {
  id: string;
  type: WorkerMessageType;
  timestamp: number;
}

/**
 * Dispatch message - send action to worker
 */
export interface DispatchMessage extends WorkerMessage {
  type: 'dispatch';
  namespace: string;
  action: Action;
  state?: unknown;
}

/**
 * Patch message - apply patch to state
 */
export interface PatchMessage extends WorkerMessage {
  type: 'patch';
  namespace: string;
  patches: PatchOp[];
}

/**
 * Result message - worker computation result
 */
export interface ResultMessage extends WorkerMessage {
  type: 'result';
  namespace: string;
  result: unknown;
  patches?: PatchOp[];
}

/**
 * Error message - worker error
 */
export interface ErrorMessage extends WorkerMessage {
  type: 'error';
  error: {
    message: string;
    stack?: string;
    name?: string;
  };
}

/**
 * Register reducer message
 */
export interface RegisterReducerMessage extends WorkerMessage {
  type: 'register-reducer';
  namespace: string;
  reducerId: string;
}

/**
 * Worker reducer function
 */
export type WorkerReducer<S = unknown, A = Action> = (
  state: S,
  action: A
) => S | Promise<S>;

/**
 * Worker reducer handle
 */
export interface WorkerReducerHandle {
  namespace: string;
  reducerId: string;
  dispatch: (action: Action) => Promise<unknown>;
}

