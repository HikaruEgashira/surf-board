import { describe, test, expect, beforeEach } from 'vitest';
import { LRUCache } from '../cache';

describe('LRUCache', () => {
  let cache: LRUCache<string, number>;

  beforeEach(() => {
    cache = new LRUCache<string, number>({ maxSize: 3, ttl: 1000 });
  });

  test('should store and retrieve values', () => {
    cache.set('a', 1);
    expect(cache.get('a')).toBe(1);
  });

  test('should respect maxSize limit', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.set('d', 4); // This should evict 'a'

    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);
    expect(cache.get('d')).toBe(4);
    expect(cache.size()).toBe(3);
  });

  test('should respect TTL', async () => {
    cache = new LRUCache<string, number>({ maxSize: 3, ttl: 100 });
    cache.set('a', 1);
    
    expect(cache.get('a')).toBe(1);
    
    await new Promise(resolve => setTimeout(resolve, 150));
    expect(cache.get('a')).toBeUndefined();
  });

  test('should update access order on get', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    
    // Access 'a', making it most recently used
    cache.get('a');
    
    // Add new item, should evict 'b' instead of 'a'
    cache.set('d', 4);

    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('a')).toBe(1);
    expect(cache.get('c')).toBe(3);
    expect(cache.get('d')).toBe(4);
  });

  test('should clear cache', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    
    cache.clear();
    
    expect(cache.size()).toBe(0);
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBeUndefined();
  });
});
