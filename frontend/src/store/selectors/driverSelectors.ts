/**
 * Driver Selectors
 * 
 * Memoized selectors for driver state.
 * Requirements: 2.5, 3.9
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export const selectDriverState = (state: RootState) => state.driver;

export const selectDriverList = createSelector(
  [selectDriverState],
  (driver) => driver.items
);

export const selectCurrentDriver = createSelector(
  [selectDriverState],
  (driver) => driver.currentDriver
);

export const selectDriverPagination = createSelector(
  [selectDriverState],
  (driver) => ({
    page: driver.page,
    limit: driver.limit,
    total: driver.total,
  })
);

export const selectDriverLoading = createSelector(
  [selectDriverState],
  (driver) => driver.loading
);

export const selectDriverError = createSelector(
  [selectDriverState],
  (driver) => driver.error
);

export const selectDriverLastFetched = createSelector(
  [selectDriverState],
  (driver) => driver.lastFetched
);

export const selectDriverById = (id: string) =>
  createSelector([selectDriverList], (drivers) =>
    drivers.find((driver) => driver._id === id)
  );
