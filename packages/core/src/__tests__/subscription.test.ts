/**
 * Unit tests for subscription system
 */

import { SubscriptionManager } from '../subscription';
import { createAtom } from '../atom';

describe('SubscriptionManager', () => {
  it('should subscribe to atom changes', () => {
    const manager = new SubscriptionManager();
    const atom = createAtom('test', 42);
    let receivedValue: number | undefined;
    
    const unsubscribe = manager.subscribe(atom, (value) => {
      receivedValue = value as number;
    });
    
    manager.notify(atom, 100, 42);
    expect(receivedValue).toBe(100);
    
    unsubscribe();
    manager.notify(atom, 200, 100);
    expect(receivedValue).toBe(100); // Should not update after unsubscribe
  });
  
  it('should handle multiple subscribers', () => {
    const manager = new SubscriptionManager();
    const atom = createAtom('test', 42);
    const values: number[] = [];
    
    manager.subscribe(atom, (value) => values.push(value as number));
    manager.subscribe(atom, (value) => values.push((value as number) * 2));
    
    manager.notify(atom, 10, 42);
    
    expect(values).toEqual([10, 20]);
  });
  
  it('should get subscriber count', () => {
    const manager = new SubscriptionManager();
    const atom = createAtom('test', 42);
    
    expect(manager.getSubscriberCount(atom.key)).toBe(0);
    
    manager.subscribe(atom, () => {});
    expect(manager.getSubscriberCount(atom.key)).toBe(1);
    
    manager.subscribe(atom, () => {});
    expect(manager.getSubscriberCount(atom.key)).toBe(2);
  });
  
  it('should clear all subscriptions', () => {
    const manager = new SubscriptionManager();
    const atom = createAtom('test', 42);
    
    manager.subscribe(atom, () => {});
    manager.clear();
    
    expect(manager.getSubscriberCount(atom.key)).toBe(0);
  });
});

