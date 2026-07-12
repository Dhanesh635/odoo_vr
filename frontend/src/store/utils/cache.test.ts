/**
 * Unit Tests for Cache Utilities
 *
 * Tests verify cache staleness checking, cache entry creation,
 * cache age calculation, and cache size management functions.
 */

import {
  isCacheStale,
  createCacheEntry,
  getCacheAge,
  estimateCacheSize,
  shouldEvictCache,
  getCacheMetadata,
  STALENESS_DURATIONS,
  type CacheEntry,
} from "./cache";

describe("Cache Utilities", () => {
  describe("isCacheStale", () => {
    it("should return true when cache is null", () => {
      const result = isCacheStale(null, STALENESS_DURATIONS.VEHICLE_LIST);
      expect(result).toBe(true);
    });

    it("should return false when cache age is less than staleness duration", () => {
      const cache: CacheEntry<any> = {
        data: { test: "data" },
        timestamp: Date.now() - 1000, // 1 second ago
      };
      const result = isCacheStale(cache, 5000); // 5 seconds staleness
      expect(result).toBe(false);
    });

    it("should return true when cache age equals staleness duration", () => {
      const cache: CacheEntry<any> = {
        data: { test: "data" },
        timestamp: Date.now() - 5000, // 5 seconds ago
      };
      const result = isCacheStale(cache, 5000); // 5 seconds staleness
      expect(result).toBe(true);
    });

    it("should return true when cache age exceeds staleness duration", () => {
      const cache: CacheEntry<any> = {
        data: { test: "data" },
        timestamp: Date.now() - 10000, // 10 seconds ago
      };
      const result = isCacheStale(cache, 5000); // 5 seconds staleness
      expect(result).toBe(true);
    });

    it("should work with DASHBOARD_KPIS staleness duration (5 minutes)", () => {
      const freshCache: CacheEntry<any> = {
        data: { test: "data" },
        timestamp: Date.now() - 4 * 60 * 1000, // 4 minutes ago
      };
      const staleCache: CacheEntry<any> = {
        data: { test: "data" },
        timestamp: Date.now() - 6 * 60 * 1000, // 6 minutes ago
      };

      expect(isCacheStale(freshCache, STALENESS_DURATIONS.DASHBOARD_KPIS)).toBe(
        false,
      );
      expect(isCacheStale(staleCache, STALENESS_DURATIONS.DASHBOARD_KPIS)).toBe(
        true,
      );
    });

    it("should work with VEHICLE_LIST staleness duration (10 minutes)", () => {
      const freshCache: CacheEntry<any> = {
        data: { test: "data" },
        timestamp: Date.now() - 9 * 60 * 1000, // 9 minutes ago
      };
      const staleCache: CacheEntry<any> = {
        data: { test: "data" },
        timestamp: Date.now() - 11 * 60 * 1000, // 11 minutes ago
      };

      expect(isCacheStale(freshCache, STALENESS_DURATIONS.VEHICLE_LIST)).toBe(
        false,
      );
      expect(isCacheStale(staleCache, STALENESS_DURATIONS.VEHICLE_LIST)).toBe(
        true,
      );
    });

    it("should work with REPORTS staleness duration (30 minutes)", () => {
      const freshCache: CacheEntry<any> = {
        data: { test: "data" },
        timestamp: Date.now() - 29 * 60 * 1000, // 29 minutes ago
      };
      const staleCache: CacheEntry<any> = {
        data: { test: "data" },
        timestamp: Date.now() - 31 * 60 * 1000, // 31 minutes ago
      };

      expect(isCacheStale(freshCache, STALENESS_DURATIONS.REPORTS)).toBe(false);
      expect(isCacheStale(staleCache, STALENESS_DURATIONS.REPORTS)).toBe(true);
    });
  });

  describe("createCacheEntry", () => {
    it("should create a cache entry with data and timestamp", () => {
      const data = { id: 1, name: "Test Vehicle" };
      const beforeTimestamp = Date.now();
      const cache = createCacheEntry(data);
      const afterTimestamp = Date.now();

      expect(cache.data).toEqual(data);
      expect(cache.timestamp).toBeGreaterThanOrEqual(beforeTimestamp);
      expect(cache.timestamp).toBeLessThanOrEqual(afterTimestamp);
    });

    it("should create cache entries with different timestamps when called multiple times", async () => {
      const cache1 = createCacheEntry({ test: "data1" });

      // Wait a small amount to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));

      const cache2 = createCacheEntry({ test: "data2" });

      expect(cache2.timestamp).toBeGreaterThan(cache1.timestamp);
    });

    it("should work with complex data types", () => {
      const complexData = {
        vehicles: [
          { id: "1", name: "Vehicle 1", status: "available" },
          { id: "2", name: "Vehicle 2", status: "in_use" },
        ],
        total: 2,
        page: 1,
        limit: 10,
      };

      const cache = createCacheEntry(complexData);
      expect(cache.data).toEqual(complexData);
      expect(typeof cache.timestamp).toBe("number");
    });

    it("should work with arrays", () => {
      const arrayData = [1, 2, 3, 4, 5];
      const cache = createCacheEntry(arrayData);

      expect(cache.data).toEqual(arrayData);
      expect(typeof cache.timestamp).toBe("number");
    });

    it("should work with null and undefined data", () => {
      const nullCache = createCacheEntry(null);
      const undefinedCache = createCacheEntry(undefined);

      expect(nullCache.data).toBe(null);
      expect(undefinedCache.data).toBe(undefined);
      expect(typeof nullCache.timestamp).toBe("number");
      expect(typeof undefinedCache.timestamp).toBe("number");
    });
  });

  describe("getCacheAge", () => {
    it("should return null when cache is null", () => {
      const age = getCacheAge(null);
      expect(age).toBe(null);
    });

    it("should return age in milliseconds for valid cache", () => {
      const cache: CacheEntry<any> = {
        data: { test: "data" },
        timestamp: Date.now() - 5000, // 5 seconds ago
      };

      const age = getCacheAge(cache);
      expect(age).toBeGreaterThanOrEqual(4900); // Allow for slight timing variation
      expect(age).toBeLessThanOrEqual(5100);
    });

    it("should return 0 or near 0 for just-created cache", () => {
      const cache = createCacheEntry({ test: "data" });
      const age = getCacheAge(cache);

      expect(age).toBeGreaterThanOrEqual(0);
      expect(age).toBeLessThan(100); // Should be very small
    });

    it("should return increasing values as time passes", async () => {
      const cache = createCacheEntry({ test: "data" });
      const age1 = getCacheAge(cache);

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 50));

      const age2 = getCacheAge(cache);
      expect(age2).toBeGreaterThan(age1!);
    });
  });

  describe("estimateCacheSize", () => {
    it("should estimate size for simple object", () => {
      const cache = { data: "test" };
      const size = estimateCacheSize(cache);

      expect(size).toBeGreaterThan(0);
      expect(typeof size).toBe("number");
    });

    it("should return larger size for larger objects", () => {
      const smallCache = { data: "test" };
      const largeCache = {
        data: Array(1000).fill({
          id: 1,
          name: "Test Item",
          description: "A longer description",
        }),
      };

      const smallSize = estimateCacheSize(smallCache);
      const largeSize = estimateCacheSize(largeCache);

      expect(largeSize).toBeGreaterThan(smallSize);
    });

    it("should handle empty objects", () => {
      const emptyCache = {};
      const size = estimateCacheSize(emptyCache);

      expect(size).toBeGreaterThanOrEqual(0);
    });

    it("should handle nested objects", () => {
      const nestedCache = {
        level1: {
          level2: {
            level3: {
              data: "deeply nested",
            },
          },
        },
      };

      const size = estimateCacheSize(nestedCache);
      expect(size).toBeGreaterThan(0);
    });

    it("should return 0 for circular references", () => {
      const circularCache: any = { data: "test" };
      circularCache.self = circularCache; // Create circular reference

      const size = estimateCacheSize(circularCache);
      expect(size).toBe(0); // Should handle error gracefully
    });
  });

  describe("shouldEvictCache", () => {
    it("should return false when size is under limit", () => {
      const size = 5 * 1024 * 1024; // 5MB
      expect(shouldEvictCache(size)).toBe(false);
    });

    it("should return false when size equals limit", () => {
      const size = 10 * 1024 * 1024; // 10MB (exactly at limit)
      expect(shouldEvictCache(size)).toBe(false);
    });

    it("should return true when size exceeds limit", () => {
      const size = 11 * 1024 * 1024; // 11MB
      expect(shouldEvictCache(size)).toBe(true);
    });

    it("should return false for zero size", () => {
      expect(shouldEvictCache(0)).toBe(false);
    });

    it("should return false for very small size", () => {
      expect(shouldEvictCache(1024)).toBe(false); // 1KB
    });
  });

  describe("getCacheMetadata", () => {
    it("should return metadata with isStale=true and age=0 for null cache", () => {
      const metadata = getCacheMetadata(null, STALENESS_DURATIONS.VEHICLE_LIST);

      expect(metadata.isStale).toBe(true);
      expect(metadata.age).toBe(0);
    });

    it("should return metadata with isStale=false for fresh cache", () => {
      const cache: CacheEntry<any> = {
        data: { test: "data" },
        timestamp: Date.now() - 1000, // 1 second ago
      };

      const metadata = getCacheMetadata(cache, 10000); // 10 seconds staleness

      expect(metadata.isStale).toBe(false);
      expect(metadata.age).toBeGreaterThanOrEqual(900);
      expect(metadata.age).toBeLessThanOrEqual(1100);
    });

    it("should return metadata with isStale=true for stale cache", () => {
      const cache: CacheEntry<any> = {
        data: { test: "data" },
        timestamp: Date.now() - 15000, // 15 seconds ago
      };

      const metadata = getCacheMetadata(cache, 10000); // 10 seconds staleness

      expect(metadata.isStale).toBe(true);
      expect(metadata.age).toBeGreaterThanOrEqual(14900);
      expect(metadata.age).toBeLessThanOrEqual(15100);
    });

    it("should work with different staleness durations", () => {
      const cache: CacheEntry<any> = {
        data: { test: "data" },
        timestamp: Date.now() - 7 * 60 * 1000, // 7 minutes ago
      };

      // Fresh for VEHICLE_LIST (10 min)
      const metadata1 = getCacheMetadata(
        cache,
        STALENESS_DURATIONS.VEHICLE_LIST,
      );
      expect(metadata1.isStale).toBe(false);

      // Stale for DASHBOARD_KPIS (5 min)
      const metadata2 = getCacheMetadata(
        cache,
        STALENESS_DURATIONS.DASHBOARD_KPIS,
      );
      expect(metadata2.isStale).toBe(true);
    });
  });

  describe("STALENESS_DURATIONS constants", () => {
    it("should have correct duration for DASHBOARD_KPIS (5 minutes)", () => {
      expect(STALENESS_DURATIONS.DASHBOARD_KPIS).toBe(5 * 60 * 1000);
    });

    it("should have correct duration for VEHICLE_LIST (10 minutes)", () => {
      expect(STALENESS_DURATIONS.VEHICLE_LIST).toBe(10 * 60 * 1000);
    });

    it("should have correct duration for DRIVER_LIST (10 minutes)", () => {
      expect(STALENESS_DURATIONS.DRIVER_LIST).toBe(10 * 60 * 1000);
    });

    it("should have correct duration for TRIP_LIST (15 minutes)", () => {
      expect(STALENESS_DURATIONS.TRIP_LIST).toBe(15 * 60 * 1000);
    });

    it("should have correct duration for EXPENSE_LIST (15 minutes)", () => {
      expect(STALENESS_DURATIONS.EXPENSE_LIST).toBe(15 * 60 * 1000);
    });

    it("should have correct duration for FUEL_LOG_LIST (15 minutes)", () => {
      expect(STALENESS_DURATIONS.FUEL_LOG_LIST).toBe(15 * 60 * 1000);
    });

    it("should have correct duration for MAINTENANCE_LIST (15 minutes)", () => {
      expect(STALENESS_DURATIONS.MAINTENANCE_LIST).toBe(15 * 60 * 1000);
    });

    it("should have correct duration for REPORTS (30 minutes)", () => {
      expect(STALENESS_DURATIONS.REPORTS).toBe(30 * 60 * 1000);
    });

    it("should have DASHBOARD_KPIS as shortest duration", () => {
      const durations = Object.values(STALENESS_DURATIONS);
      const min = Math.min(...durations);
      expect(STALENESS_DURATIONS.DASHBOARD_KPIS).toBe(min);
    });

    it("should have REPORTS as longest duration", () => {
      const durations = Object.values(STALENESS_DURATIONS);
      const max = Math.max(...durations);
      expect(STALENESS_DURATIONS.REPORTS).toBe(max);
    });
  });
});
