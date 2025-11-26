/**
 * Lazy state reconstruction for time-travel debugging
 */

import type { DevToolsEvent, StateSnapshot } from './types';
import type { AtomKey } from '@titanstate/types';
import type { Store } from '@titanstate/core';
import { EventLog } from './event-log';

/**
 * Reconstruction options
 */
export interface ReconstructionOptions {
  /**
   * Target sequence number (for time-travel)
   */
  targetSeq?: number;
  
  /**
   * Atom keys to reconstruct (if undefined, reconstruct all)
   */
  atomKeys?: AtomKey[];
  
  /**
   * Include state data in result
   */
  includeState?: boolean;
}

/**
 * Reconstructed state
 */
export interface ReconstructedState {
  /**
   * Sequence number
   */
  seq: number;
  
  /**
   * Timestamp
   */
  timestamp: number;
  
  /**
   * Reconstructed state (if includeState is true)
   */
  state?: Record<string, unknown>;
  
  /**
   * Atom keys that were reconstructed
   */
  atomKeys: AtomKey[];
}

/**
 * State reconstructor for time-travel debugging
 */
export class StateReconstructor {
  private eventLog: EventLog;
  
  constructor(eventLog: EventLog, _store: Store) {
    this.eventLog = eventLog;
    // Store parameter kept for future use (e.g., applying state for time-travel)
  }
  
  /**
   * Reconstruct state at a specific sequence number
   */
  async reconstruct(options: ReconstructionOptions = {}): Promise<ReconstructedState> {
    const { targetSeq, atomKeys, includeState = false } = options;
    
    // Find the closest snapshot
    const snapshot = targetSeq
      ? this.findClosestSnapshot(targetSeq)
      : this.eventLog.getSnapshots()[this.eventLog.getSnapshots().length - 1];
    
    if (!snapshot) {
      // No snapshot, reconstruct from beginning
      return this.reconstructFromEvents(0, targetSeq, atomKeys, includeState);
    }
    
    // Reconstruct from snapshot
    const events = this.eventLog.getEvents(
      snapshot.seq + 1,
      targetSeq
    );
    
    const state: Record<string, unknown> = includeState ? {} : undefined as any;
    const reconstructedKeys = new Set<AtomKey>();
    
    // Apply events to reconstruct state
    for (const event of events) {
      if (atomKeys && event.target && !atomKeys.includes(event.target)) {
        continue;
      }
      
      if (event.target) {
        reconstructedKeys.add(event.target);
      }
      
      if (includeState && state) {
        await this.applyEventToState(event, state);
      }
    }
    
    return {
      seq: targetSeq ?? snapshot.seq,
      timestamp: snapshot.timestamp,
      state,
      atomKeys: Array.from(reconstructedKeys),
    };
  }
  
  /**
   * Find closest snapshot to a sequence number
   */
  private findClosestSnapshot(seq: number): StateSnapshot | null {
    const snapshots = this.eventLog.getSnapshots();
    
    // Find snapshot with seq <= target seq
    let closest: StateSnapshot | null = null;
    for (const snapshot of snapshots) {
      if (snapshot.seq <= seq) {
        if (!closest || snapshot.seq > closest.seq) {
          closest = snapshot;
        }
      }
    }
    
    return closest;
  }
  
  /**
   * Reconstruct state from events (no snapshot)
   */
  private async reconstructFromEvents(
    startSeq: number,
    endSeq: number | undefined,
    atomKeys: AtomKey[] | undefined,
    includeState: boolean
  ): Promise<ReconstructedState> {
    const events = this.eventLog.getEvents(startSeq, endSeq);
    const state: Record<string, unknown> = includeState ? {} : undefined as any;
    const reconstructedKeys = new Set<AtomKey>();
    
    for (const event of events) {
      if (atomKeys && event.target && !atomKeys.includes(event.target)) {
        continue;
      }
      
      if (event.target) {
        reconstructedKeys.add(event.target);
      }
      
      if (includeState && state) {
        await this.applyEventToState(event, state);
      }
    }
    
    return {
      seq: endSeq ?? this.eventLog.getLatestEvent()?.seq ?? 0,
      timestamp: Date.now(),
      state,
      atomKeys: Array.from(reconstructedKeys),
    };
  }
  
  /**
   * Apply event to state object
   */
  private async applyEventToState(
    event: DevToolsEvent,
    state: Record<string, unknown>
  ): Promise<void> {
    if (!event.target) {
      return;
    }
    
    const key = String(event.target);
    
    switch (event.type) {
      case 'atom-update': {
        const updateEvent = event as any;
        state[key] = updateEvent.newValue;
        break;
      }
      
      case 'patch': {
        const patchEvent = event as any;
        // Apply patches to state
        // This is simplified - in production, you'd use the patch system
        if (patchEvent.patches) {
          // For now, just update the value
          // Full patch application would be implemented here
        }
        break;
      }
      
      case 'dispatch': {
        // Dispatch events don't directly update state
        // They trigger reducers which produce updates
        break;
      }
      
      default:
        // Other event types don't directly modify state
        break;
    }
  }
  
  /**
   * Get state at a specific point in time
   */
  async getStateAt(seq: number, atomKeys?: AtomKey[]): Promise<Record<string, unknown>> {
    const reconstructed = await this.reconstruct({
      targetSeq: seq,
      atomKeys,
      includeState: true,
    });
    
    return reconstructed.state ?? {};
  }
}

