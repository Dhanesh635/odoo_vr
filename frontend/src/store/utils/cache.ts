/**
 * Cache Utilities for Redux Store
 * 
 * Provides helper functions for managing cache entries in Redux slices,
 * including cache staleness checking, cache entry creation, and cache eviction logic.
 */

/**
 * Represents a cached data entry with timestamp metadata
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Staleness duration constants for different domain types (in milliseconds)
 * 
 * These values determine how long cached data remains fresh before
 * requiring a server refresh.
 */
export const STALENESS_DURATIONS = {
  /** Dashboard KPI data - 5 minutes (frequently changing operational metrics) */
  DASHBOARD_KPIS: 5 * 60 * 1000,
  
  /** Vehicle list data - 10 minutes (moderate update frequency) */
  VEHICLE_LIST: 10 * 60 * 1000,
  
  /** Driver list data - 10 minutes (moderate update frequency) */
  DRIVER_LIST: 10 * 60 * 1000,
  
  /** Trip list data - 15 minutes (less frequent updates) */
  TRIP_LIST: 15 * 60 * 1000,
  
  /** Expense list data - 15 minutes (less frequent updates) */
  EXPENSE_LIST: 15 * 60 * 1000,
  
  /** Fuel log list data - 15 minutes (less frequent updates) */
  FUEL_LOG_LIST: 15 * 60 * 1000,
  
  /** Maintenance log list data - 15 minutes (less frequent updates) */
  MAINTENANCE_LIST: 15 * 60 * 1000,
  
  /** Reports data - 30 minutes (historical data, infrequent changes) */
  REPORTS: 30 * 60 * 1000,
} as const;

/**
 * Checks if a cache entry is stale based on its age and staleness duration
 * 
 * Algorithm:
 * 1. If cache is null or undefined, it's considered stale
 * 2. Calculate age = current time - cache timestamp
 * 3. Return true if age >= staleness duration, false otherwise
 * 
 * @param cache - The cache entry to check (null if no cache exists)
 * @param staleness - Maximum age in milliseconds before cache is considered stale
 * @returns true if cache is stale or doesn't exist, false if cache is fresh
 * 
 * @example
 * const cache = { data: [...], timestamp: Date.now() - 600000 }; // 10 min old
 * isCacheStale(cache, STALENESS_DURATIONS.VEHICLE_LIST); // false (< 10min limit)
 * isCacheStale(cache, STALENESS_DURATIONS.DASHBOARD_KPIS); // true (> 5min limit)
 */
export function isCacheStale<T>(
  cache: CacheEntry<T> | null,
  staleness: number
): boolean {
  if (!cache) return true;
  const age = Date.now() - cache.timestamp;
  return age >= staleness;
}

/**
 * Creates a new cache entry with the current timestamp
 * 
 * @param data - The data to cache
 * @returns A cache entry object containing the data and current timestamp
 * 
 * @example
 * const vehicles = await fetchVehicles();
 * const cacheEntry = createCacheEntry(vehicles);
 * // { data: [...vehicles], timestamp: 1704067200000 }
 */
export function createCacheEntry<T>(data: T): CacheEntry<T> {
  return {
    data,
    timestamp: Date.now(),
  };
}

/**
 * Gets the age of a cache entry in milliseconds
 * 
 * @param cache - The cache entry to check (null if no cache exists)
 * @returns Age in milliseconds, or null if cache doesn't exist
 * 
 * @example
 * const age = getCacheAge(state.listCache);
 * if (age && age > 300000) {
 *   console.log('Cache is older than 5 minutes');
 * }
 */
export function getCacheAge<T>(cache: CacheEntry<T> | null): number | null {
  if (!cache) return null;
  return Date.now() - cache.timestamp;
}

/**
 * Maximum cache size limit in bytes (10MB)
 * 
 * When cache size exceeds this limit, oldest entries should be evicted
 * to prevent excessive memory usage.
 */
const MAX_CACHE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Estimates the size of a cache object in bytes
 * 
 * Uses JSON serialization to approximate memory usage. This is a rough
 * estimation and not exact, but sufficient for cache size management.
 * 
 * @param cache - The cache object to estimate (typically a Redux slice's cache state)
 * @returns Estimated size in bytes
 * 
 * @example
 * const size = estimateCacheSize(state.vehicle.listCache);
 * console.log(`Vehicle cache uses approximately ${size} bytes`);
 */
export function estimateCacheSize(cache: Record<string, any>): number {
  try {
    // Rough estimation using JSON serialization
    const jsonString = JSON.stringify(cache);
    return new Blob([jsonString]).size;
  } catch (error) {
    // If serialization fails (e.g., circular references), return 0
    console.warn('Failed to estimate cache size:', error);
    return 0;
  }
}

/**
 * Determines if cache should be evicted based on current size
 * 
 * @param currentSize - Current cache size in bytes
 * @returns true if current size exceeds MAX_CACHE_SIZE, false otherwise
 * 
 * @example
 * const totalSize = estimateCacheSize(allCaches);
 * if (shouldEvictCache(totalSize)) {
 *   // Evict oldest cache entries
 * }
 */
export function shouldEvictCache(currentSize: number): boolean {
  return currentSize > MAX_CACHE_SIZE;
}

/**
 * Metadata about cache state
 */
export interface CacheMetadata {
  /** Whether the cache is considered stale */
  isStale: boolean;
  /** Age of the cache in milliseconds since fetch */
  age: number;
}

/**
 * Gets comprehensive cache metadata for monitoring and debugging
 * 
 * @param cache - The cache entry to analyze
 * @param staleness - Staleness duration for this cache type
 * @returns Cache metadata object with staleness status and age
 * 
 * @example
 * const metadata = getCacheMetadata(
 *   state.vehicle.listCache,
 *   STALENESS_DURATIONS.VEHICLE_LIST
 * );
 * console.log(`Cache is ${metadata.age}ms old, stale: ${metadata.isStale}`);
 */
export function getCacheMetadata<T>(
  cache: CacheEntry<T> | null,
  staleness: number
): CacheMetadata {
  const age = getCacheAge(cache) ?? 0;
  const isStale = isCacheStale(cache, staleness);
  
  return {
    isStale,
    age,
  };
}
