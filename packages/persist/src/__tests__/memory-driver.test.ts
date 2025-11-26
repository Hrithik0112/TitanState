/**
 * Unit tests for MemoryDriver
 */

import { MemoryDriver } from '../memory-driver';

describe('MemoryDriver', () => {
  let driver: MemoryDriver;
  
  beforeEach(() => {
    driver = new MemoryDriver();
  });
  
  it('should store and retrieve values', async () => {
    await driver.put('test', 'value');
    const result = await driver.get('test');
    
    expect(result).toBe('value');
  });
  
  it('should return null for non-existent keys', async () => {
    const result = await driver.get('nonexistent');
    expect(result).toBeNull();
  });
  
  it('should delete values', async () => {
    await driver.put('test', 'value');
    await driver.delete('test');
    
    const result = await driver.get('test');
    expect(result).toBeNull();
  });
  
  it('should check if key exists', async () => {
    expect(await driver.has('test')).toBe(false);
    
    await driver.put('test', 'value');
    expect(await driver.has('test')).toBe(true);
  });
  
  it('should list keys with prefix', async () => {
    await driver.put('prefix:key1', 'value1');
    await driver.put('prefix:key2', 'value2');
    await driver.put('other:key', 'value');
    
    const keys = await driver.keys('prefix:');
    expect(keys).toHaveLength(2);
    expect(keys).toContain('prefix:key1');
    expect(keys).toContain('prefix:key2');
  });
  
  it('should handle TTL expiration', async () => {
    await driver.put('test', 'value', { ttl: 1 }); // 1 second
    
    expect(await driver.has('test')).toBe(true);
    
    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    expect(await driver.has('test')).toBe(false);
    expect(await driver.get('test')).toBeNull();
  });
  
  it('should clear all values', async () => {
    await driver.put('key1', 'value1');
    await driver.put('key2', 'value2');
    
    await driver.clear();
    
    expect(await driver.get('key1')).toBeNull();
    expect(await driver.get('key2')).toBeNull();
  });
});

