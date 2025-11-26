/**
 * DevTools-specific types
 */

import type { Action, AtomKey, PatchOp } from '@titanstate/types';

/**
 * DevTools event types
 */
export type DevToolsEventType =
  | 'dispatch'
  | 'patch'
  | 'hydration'
  | 'worker-job'
  | 'query-event'
  | 'atom-update'
  | 'transaction-start'
  | 'transaction-end';

/**
 * Base DevTools event
 */
export interface DevToolsEvent {
  /**
   * Event sequence number
   */
  seq: number;
  
  /**
   * Timestamp
   */
  ts: number;
  
  /**
   * Event type
   */
  type: DevToolsEventType;
  
  /**
   * Target atom/slice key
   */
  target?: AtomKey;
  
  /**
   * Action (for dispatch events)
   */
  action?: Action;
  
  /**
   * Metadata
   */
  meta?: Record<string, unknown>;
}

/**
 * Dispatch event
 */
export interface DispatchEvent extends DevToolsEvent {
  type: 'dispatch';
  action: Action;
  target: AtomKey;
}

/**
 * Patch event
 */
export interface PatchEvent extends DevToolsEvent {
  type: 'patch';
  target: AtomKey;
  patches: PatchOp[];
}

/**
 * Hydration event
 */
export interface HydrationEvent extends DevToolsEvent {
  type: 'hydration';
  target: AtomKey;
  size?: number;
}

/**
 * Worker job event
 */
export interface WorkerJobEvent extends DevToolsEvent {
  type: 'worker-job';
  namespace: string;
  action: Action;
  duration?: number;
}

/**
 * Query event
 */
export interface QueryEvent extends DevToolsEvent {
  type: 'query-event';
  queryKey: string;
  status: 'pending' | 'success' | 'error';
}

/**
 * Atom update event
 */
export interface AtomUpdateEvent extends DevToolsEvent {
  type: 'atom-update';
  target: AtomKey;
  previousValue?: unknown;
  newValue?: unknown;
}

/**
 * Transaction start event
 */
export interface TransactionStartEvent extends DevToolsEvent {
  type: 'transaction-start';
  transactionId: string;
}

/**
 * Transaction end event
 */
export interface TransactionEndEvent extends DevToolsEvent {
  type: 'transaction-end';
  transactionId: string;
  duration: number;
}

/**
 * DevTools message types
 */
export type DevToolsMessageType =
  | 'init'
  | 'event'
  | 'get-state'
  | 'set-state'
  | 'time-travel'
  | 'inspect-atom'
  | 'subscribe'
  | 'unsubscribe';

/**
 * DevTools message
 */
export interface DevToolsMessage {
  type: DevToolsMessageType;
  payload?: unknown;
  id?: string;
}

/**
 * State snapshot
 */
export interface StateSnapshot {
  /**
   * Snapshot timestamp
   */
  timestamp: number;
  
  /**
   * Sequence number
   */
  seq: number;
  
  /**
   * State data (lazy-loaded)
   */
  state?: Record<string, unknown>;
  
  /**
   * Atom keys in this snapshot
   */
  atomKeys: AtomKey[];
}

