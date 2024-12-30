interface CacheConfig {
  maxSize: number;
  ttl: number;
}

export class LRUCache<K, V> {
  private cache: Map<K, { value: V; timestamp: number }> = new Map();
  private readonly config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = config;
  }

  set(key: K, value: V): void {
    if (this.cache.size >= this.config.maxSize) {
      // Remove oldest entry
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() - entry.timestamp > this.config.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    // Update entry to be most recent
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}