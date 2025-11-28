/**
 * Cache Utilities
 * Provides caching functionality for API responses and computed values
 */

const CACHE_STORE = new Map();
const CACHE_TIMESTAMPS = new Map();

/**
 * Get cached value
 * @param {string} key - Cache key
 * @param {number} maxAge - Maximum age in milliseconds (default: 5 minutes)
 * @returns {any|null} Cached value or null if expired/not found
 */
export function getCache(key, maxAge = 5 * 60 * 1000) {
  const timestamp = CACHE_TIMESTAMPS.get(key);
  if (!timestamp) return null;

  const age = Date.now() - timestamp;
  if (age > maxAge) {
    CACHE_STORE.delete(key);
    CACHE_TIMESTAMPS.delete(key);
    return null;
  }

  return CACHE_STORE.get(key);
}

/**
 * Set cached value
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 */
export function setCache(key, value) {
  CACHE_STORE.set(key, value);
  CACHE_TIMESTAMPS.set(key, Date.now());
}

/**
 * Clear cached value
 * @param {string} key - Cache key
 */
export function clearCache(key) {
  CACHE_STORE.delete(key);
  CACHE_TIMESTAMPS.delete(key);
}

/**
 * Clear all cache
 */
export function clearAllCache() {
  CACHE_STORE.clear();
  CACHE_TIMESTAMPS.clear();
}

/**
 * Clear cache by pattern
 * @param {string} pattern - Pattern to match keys (uses includes)
 */
export function clearCacheByPattern(pattern) {
  for (const key of CACHE_STORE.keys()) {
    if (key.includes(pattern)) {
      CACHE_STORE.delete(key);
      CACHE_TIMESTAMPS.delete(key);
    }
  }
}

/**
 * Get cache statistics
 * @returns {object} Cache statistics
 */
export function getCacheStats() {
  return {
    size: CACHE_STORE.size,
    keys: Array.from(CACHE_STORE.keys()),
  };
}

