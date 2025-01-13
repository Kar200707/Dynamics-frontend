import localForage from 'localforage';

const CACHE_KEY = 'audioCache';
const CACHE_LIMIT = 30;
const MAX_DURATION = 900;

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

  async remove(trackId: string) {
    await this.cache.removeItem(trackId);
  }

  async set(trackId: string, data: Blob, duration: number) {
    if (duration > MAX_DURATION) {
      console.log(`Track ${trackId} is longer than 15 minutes, skipping cache.`);
      return;
    }

    await this.ensureCache();
    await this.cache.setItem(trackId, data);
  }

  async clear() {
    await this.cache.clear();
  }
}
