/**
 * Vehicle Selectors
 * 
 * Memoized selectors for vehicle state to prevent unnecessary re-renders.
 * 
 * Requirements: 8.8, 10.1, 10.2
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Basic selector
const selectVehicleState = (state: RootState) => state.vehicle;

// Memoized selectors
export const selectVehicleList = createSelector(
  [selectVehicleState],
  (vehicleState) => vehicleState.list
);

export const selectVehicleLoading = createSelector(
  [selectVehicleState],
  (vehicleState) => vehicleState.loading
);

export const selectVehicleError = createSelector(
  [selectVehicleState],
  (vehicleState) => vehicleState.error
);

export const selectAvailableVehicles = createSelector(
  [selectVehicleList],
  (vehicles) => vehicles.filter((v) => v.status === 'available')
);

export const selectVehicleById = (id: string) =>
  createSelector(
    [selectVehicleList],
    (vehicles) => vehicles.find((v) => v._id === id)
  );

export const selectVehicleCacheAge = createSelector(
  [selectVehicleState],
  (vehicleState) => {
    if (!vehicleState.listCache) return null;
    return Date.now() - vehicleState.listCache.timestamp;
  }
);
