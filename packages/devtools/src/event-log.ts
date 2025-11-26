/**
 * Event log implementation
 */

import type {
  DevToolsEvent,
  DevToolsEventType,
  StateSnapshot,
} from './types';
import type { Driver } from '@titanstate/persist';

/**
 * Event log configuration
 */
export interface EventLogConfig {
  /**
   * Maximum number of events to keep in memory
   */
  maxInMemoryEvents?: number;
  
  /**
   * Persist events to storage
   */
  persist?: boolean;
  
  /**
   * Storage driver for persistence
   */
  driver?: Driver;
  
  /**
   * Snapshot interval (create snapshot every N events)
   */
  snapshotInterval?: number;
}

/**
 * Event log for storing DevTools events
 */
export class EventLog {
  private events: DevToolsEvent[] = [];
  private sequenceNumber = 0;
  private config: Required<Pick<EventLogConfig, 'maxInMemoryEvents' | 'persist' | 'snapshotInterval'>> & EventLogConfig;
  private driver?: Driver;
  private snapshots: StateSnapshot[] = [];
  
  constructor(config: EventLogConfig = {}) {
    this.config = {
      maxInMemoryEvents: config.maxInMemoryEvents ?? 10000,
      persist: config.persist ?? false,
      snapshotInterval: config.snapshotInterval ?? 1000,
      ...config,
    };
    
    this.driver = config.driver;
  }
  
  /**
   * Log an event
   */
  async log(event: Omit<DevToolsEvent, 'seq' | 'ts'>): Promise<void> {
    const fullEvent: DevToolsEvent = {
      ...event,
      seq: ++this.sequenceNumber,
      ts: Date.now(),
    };
    
    // Add to in-memory log
    this.events.push(fullEvent);
    
    // Trim if over limit
    if (this.events.length > this.config.maxInMemoryEvents) {
      const toRemove = this.events.length - this.config.maxInMemoryEvents;
      this.events.splice(0, toRemove);
    }
    
    // Persist if enabled
    if (this.config.persist && this.driver) {
      await this.persistEvent(fullEvent);
    }
    
    // Create snapshot if needed
    if (this.sequenceNumber % this.config.snapshotInterval === 0) {
      await this.createSnapshot();
    }
  }
  
  /**
   * Get events
   */
  getEvents(
    startSeq?: number,
    endSeq?: number,
    eventType?: DevToolsEventType
  ): DevToolsEvent[] {
    let filtered = this.events;
    
    // Filter by sequence range
    if (startSeq !== undefined) {
      filtered = filtered.filter(e => e.seq >= startSeq);
    }
    if (endSeq !== undefined) {
      filtered = filtered.filter(e => e.seq <= endSeq);
    }
    
    // Filter by event type
    if (eventType) {
      filtered = filtered.filter(e => e.type === eventType);
    }
    
    return filtered;
  }
  
  /**
   * Get latest event
   */
  getLatestEvent(): DevToolsEvent | null {
    return this.events.length > 0 ? (this.events[this.events.length - 1] ?? null) : null;
  }
  
  /**
   * Get event by sequence number
   */
  getEvent(seq: number): DevToolsEvent | null {
    return this.events.find(e => e.seq === seq) ?? null;
  }
  
  /**
   * Get events for a specific target
   */
  getEventsForTarget(target: string | symbol): DevToolsEvent[] {
    return this.events.filter(e => e.target === target);
  }
  
  /**
   * Clear events
   */
  async clear(): Promise<void> {
    this.events = [];
    this.sequenceNumber = 0;
    this.snapshots = [];
    
    if (this.driver) {
      // Clear persisted events
      const keys = await this.driver.keys('devtools:event:');
      await Promise.all(keys.map(key => this.driver!.delete(key)));
      
      // Clear snapshots
      const snapshotKeys = await this.driver.keys('devtools:snapshot:');
      await Promise.all(snapshotKeys.map(key => this.driver!.delete(key)));
    }
  }
  
  /**
   * Get statistics
   */
  getStats() {
    const eventCounts: Record<DevToolsEventType, number> = {
      dispatch: 0,
      patch: 0,
      hydration: 0,
      'worker-job': 0,
      'query-event': 0,
      'atom-update': 0,
      'transaction-start': 0,
      'transaction-end': 0,
    };
    
    for (const event of this.events) {
      eventCounts[event.type]++;
    }
    
    return {
      totalEvents: this.events.length,
      sequenceNumber: this.sequenceNumber,
      eventCounts,
      snapshots: this.snapshots.length,
    };
  }
  
  /**
   * Persist event to storage
   */
  private async persistEvent(event: DevToolsEvent): Promise<void> {
    if (!this.driver) {
      return;
    }
    
    const key = `devtools:event:${event.seq}`;
    await this.driver.put(key, event);
  }
  
  /**
   * Create a snapshot
   */
  private async createSnapshot(): Promise<void> {
    const snapshot: StateSnapshot = {
      timestamp: Date.now(),
      seq: this.sequenceNumber,
      atomKeys: this.extractAtomKeys(),
    };
    
    this.snapshots.push(snapshot);
    
    if (this.driver) {
      const key = `devtools:snapshot:${snapshot.seq}`;
      await this.driver.put(key, snapshot);
    }
  }
  
  /**
   * Extract atom keys from events
   */
  private extractAtomKeys(): (string | symbol)[] {
    const keys = new Set<string | symbol>();
    
    for (const event of this.events) {
      if (event.target) {
        keys.add(event.target);
      }
    }
    
    return Array.from(keys);
  }
  
  /**
   * Get snapshots
   */
  getSnapshots(): StateSnapshot[] {
    return [...this.snapshots];
  }
  
  /**
   * Get snapshot by sequence number
   */
  getSnapshot(seq: number): StateSnapshot | null {
    return this.snapshots.find(s => s.seq === seq) ?? null;
  }
}

