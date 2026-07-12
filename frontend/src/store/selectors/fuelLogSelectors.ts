/**
 * FuelLog Selectors
 * 
 * Memoized selectors for fuel log state.
 * Requirements: 2.5, 3.9
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export const selectFuelLogState = (state: RootState) => state.fuelLog;

export const selectFuelLogList = createSelector(
  [selectFuelLogState],
  (fuelLog) => fuelLog.items
);

export const selectFuelLogPagination = createSelector(
  [selectFuelLogState],
  (fuelLog) => ({
    page: fuelLog.page,
    limit: fuelLog.limit,
    total: fuelLog.total,
  })
);

export const selectFuelLogLoading = createSelector(
  [selectFuelLogState],
  (fuelLog) => fuelLog.loading
);

export const selectFuelLogError = createSelector(
  [selectFuelLogState],
  (fuelLog) => fuelLog.error
);

export const selectFuelLogLastFetched = createSelector(
  [selectFuelLogState],
  (fuelLog) => fuelLog.lastFetched
);

export const selectFuelLogsByVehicle = (vehicleId: string) =>
  createSelector([selectFuelLogList], (fuelLogs) =>
    fuelLogs.filter((log) => log.vehicle === vehicleId)
  );

export const selectFuelLogsByTrip = (tripId: string) =>
  createSelector([selectFuelLogList], (fuelLogs) =>
    fuelLogs.filter((log) => log.trip === tripId)
  );
