/**
 * Subscription management system
 */

import type { AtomKey, Listener, Unsubscribe } from '@titanstate/types';
import type { Atom } from './types';

/**
 * Subscription manager for atoms
 */
export class SubscriptionManager {
  private subscriptions = new Map<AtomKey, Set<Listener>>();
  
  /**
   * Subscribe to an atom
   */
  subscribe<T>(atom: Atom<T>, listener: Listener<T>): Unsubscribe {
    const key = atom.key;
    
    if (!this.subscriptions.has(key)) {
      this.subscriptions.set(key, new Set());
    }
    
    const listeners = this.subscriptions.get(key)!;
    listeners.add(listener as Listener);
    
    // Return unsubscribe function
    return () => {
      const currentListeners = this.subscriptions.get(key);
      if (currentListeners) {
        currentListeners.delete(listener as Listener);
        if (currentListeners.size === 0) {
          this.subscriptions.delete(key);
        }
      }
    };
  }
  
  /**
   * Notify all subscribers of an atom
   */
  notify<T>(atom: Atom<T>, newValue: T, previousValue: T | undefined): void {
    const listeners = this.subscriptions.get(atom.key);
    if (!listeners || listeners.size === 0) {
      return;
    }
    
    // Create a copy of listeners to avoid issues if listeners unsubscribe during iteration
    const listenersCopy = Array.from(listeners) as Listener<T>[];
    
    for (const listener of listenersCopy) {
      try {
        listener(newValue, previousValue);
      } catch (error) {
        console.error(`Error in atom subscription listener for ${String(atom.key)}:`, error);
      }
    }
  }
  
  /**
   * Get subscriber count for an atom
   */
  getSubscriberCount(key: AtomKey): number {
    return this.subscriptions.get(key)?.size ?? 0;
  }
  
  /**
   * Check if an atom has subscribers
   */
  hasSubscribers(key: AtomKey): boolean {
    return this.getSubscriberCount(key) > 0;
  }
  
  /**
   * Clear all subscriptions (for cleanup)
   */
  clear(): void {
    this.subscriptions.clear();
  }
}

