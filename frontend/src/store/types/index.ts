/**
 * Redux Store Type Definitions
 * 
 * Common TypeScript interfaces and types used across Redux slices.
 * These types provide consistent patterns for async operations, caching,
 * optimistic updates, and list management.
 * 
 * Requirements: 8.3, 8.4, 8.5, 8.6
 */

// Re-export API types for convenience
export type { Vehicle } from '@/api/vehicle';
export type { Driver } from '@/types/driver';
export type { Trip } from '@/types/trip';
export type { Expense } from '@/types/expense';
export type { MaintenanceRecord } from '@/types/maintenance';
export type { FuelLog } from '@/api/fuel-log';
export type { DashboardKpis } from '@/api/dashboard';

/**
 * AsyncState interface
 * 
 * Standard pattern for tracking async operation states in slices.
 * All slices that perform API calls should include these fields.
 * 
 * Usage:
 * ```typescript
 * interface MySliceState extends AsyncState {
 *   data: MyData[];
 *   // ... other fields
 * }
 * ```
 * 
 * Requirements: 8.5, 3.12, 3.13
 */
export interface AsyncState {
  /** Indicates if an async operation is currently in progress */
  loading: boolean;
  /** Contains error message if the last async operation failed */
  error: string | null;
}

/**
 * CacheEntry interface
 * 
 * Wrapper for cached data with timestamp metadata.
 * Used to implement time-based cache invalidation across all slices.
 * 
 * Usage:
 * ```typescript
 * interface VehicleState {
 *   listCache: CacheEntry<VehicleListResponse> | null;
 * }
 * ```
 * 
 * Requirements: 8.6, 4.1, 4.2, 4.3
 */
export interface CacheEntry<T> {
  /** The cached data payload */
  data: T;
  /** Unix timestamp (milliseconds) when data was cached */
  timestamp: number;
}

/**
 * OptimisticUpdateState interface
 * 
 * Tracks state for optimistic updates with rollback capability.
 * Stores previous state to enable restoration if the server request fails.
 * 
 * Usage:
 * ```typescript
 * interface VehicleState {
 *   optimisticUpdates: OptimisticUpdateState<Vehicle[]>;
 * }
 * ```
 * 
 * Requirements: 8.6, 6.8, 6.9, 6.10
 */
export interface OptimisticUpdateState<T> {
  /** True if an optimistic update is pending server confirmation */
  pending: boolean;
  /** Snapshot of state before optimistic update, null if no update in progress */
  previousState: T | null;
}

/**
 * ListState interface
 * 
 * Standard structure for paginated list responses from the API.
 * Provides consistent pagination metadata across all list endpoints.
 * 
 * Usage:
 * ```typescript
 * interface VehicleState {
 *   list: ListState<Vehicle>;
 * }
 * ```
 * 
 * Requirements: 8.6
 */
export interface ListState<T> {
  /** Array of items in the current page */
  items: T[];
  /** Total number of items across all pages */
  total: number;
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  limit: number;
}
