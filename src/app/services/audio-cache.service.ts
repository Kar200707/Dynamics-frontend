import localForage from 'localforage';

const CACHE_KEY = 'audioCache';
const CACHE_LIMIT = 30;

export class AudioCacheService {
  private cache = localForage.createInstance({
    name: 'audioCache',
    storeName: 'tracks'
  });

  constructor() {
    this.ensureCache();
  }

  private async ensureCache() {
    const keys = await this.cache.keys();
    if (keys.length > CACHE_LIMIT) {
      const oldestKeys = keys.slice(0, keys.length - CACHE_LIMIT);
      for (const key of oldestKeys) {
        await this.cache.removeItem(key);
      }
    }
  }

  async get(trackId: string): Promise<Blob | null> {
    return this.cache.getItem(trackId);
  }

  async set(trackId: string, data: Blob) {
    await this.ensureCache();
    await this.cache.setItem(trackId, data);
  }

  async clear() {
    await this.cache.clear();
  }
}
