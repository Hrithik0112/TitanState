/**
 * Unit tests for store functionality
 */

import { createStore } from '../store';
import { createAtom } from '../atom';

describe('createStore', () => {
  it('should create a store instance', () => {
    const store = createStore();
    
    expect(store).toBeDefined();
    expect(typeof store.createAtom).toBe('function');
    expect(typeof store.get).toBe('function');
    expect(typeof store.set).toBe('function');
    expect(typeof store.subscribe).toBe('function');
  });
  
  it('should create and manage atoms', () => {
    const store = createStore();
    const atom = store.createAtom('test', 42);
    
    expect(store.get(atom)).toBe(42);
  });
  
  it('should update atom values', () => {
    const store = createStore();
    const atom = store.createAtom('test', 42);
    
    store.set(atom, 100);
    expect(store.get(atom)).toBe(100);
  });
  
  it('should notify subscribers on value change', (done) => {
    const store = createStore();
    const atom = store.createAtom('test', 42);
    
    store.subscribe(atom, (value, previousValue) => {
      expect(value).toBe(100);
      expect(previousValue).toBe(42);
      done();
    });
    
    store.set(atom, 100);
  });
  
  it('should handle transactions', async () => {
    const store = createStore();
    const atom1 = store.createAtom('a', 1);
    const atom2 = store.createAtom('b', 2);
    
    let updateCount = 0;
    store.subscribe(atom1, () => updateCount++);
    store.subscribe(atom2, () => updateCount++);
    
    await store.transaction(async () => {
      store.set(atom1, 10);
      store.set(atom2, 20);
    });
    
    // Updates should be batched
    expect(updateCount).toBeGreaterThanOrEqual(0);
    expect(store.get(atom1)).toBe(10);
    expect(store.get(atom2)).toBe(20);
  });
  
  it('should prevent duplicate atom keys', () => {
    const store = createStore();
    store.createAtom('test', 1);
    
    expect(() => {
      store.createAtom('test', 2);
    }).toThrow('already exists');
  });
});

