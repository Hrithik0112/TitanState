/**
 * Unit tests for atom functionality
 */

import { createAtom, areValuesEqual } from '../atom';
import type { Atom } from '../types';

describe('createAtom', () => {
  it('should create an atom with initial value', () => {
    const atom = createAtom('test', 42);
    
    expect(atom.key).toBe('test');
    expect(atom.value).toBe(42);
    expect(atom.meta.hydrated).toBe(true);
  });
  
  it('should create an atom with lazy loading', () => {
    const atom = createAtom('lazy', 'value', { lazyLoad: true });
    
    expect(atom.value).toBeUndefined();
    expect(atom.meta.hydrated).toBe(false);
  });
  
  it('should create an atom with persistence', () => {
    const atom = createAtom('persisted', 'data', { persisted: true });
    
    expect(atom.meta.persisted).toBe(true);
    expect(atom.meta.key).toBe('atom:persisted');
  });
  
  it('should create an atom with custom equality function', () => {
    const customEquals = (a: number, b: number) => Math.abs(a - b) < 1;
    const atom = createAtom('custom', 5, { equals: customEquals });
    
    expect(atom.options.equals).toBe(customEquals);
  });
});

describe('areValuesEqual', () => {
  it('should use default equality for primitives', () => {
    const atom = createAtom('test', 5);
    
    expect(areValuesEqual(atom, 5, 5)).toBe(true);
    expect(areValuesEqual(atom, 5, 6)).toBe(false);
  });
  
  it('should use custom equality function', () => {
    const customEquals = (a: number, b: number) => Math.abs(a - b) < 1;
    const atom = createAtom('test', 5, { equals: customEquals });
    
    expect(areValuesEqual(atom, 5, 5.5)).toBe(true);
    expect(areValuesEqual(atom, 5, 7)).toBe(false);
  });
});

