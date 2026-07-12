/**
 * Maintenance Selectors
 * 
 * Memoized selectors for maintenance state.
 * Requirements: 2.5, 3.9
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export const selectMaintenanceState = (state: RootState) => state.maintenance;

export const selectMaintenanceList = createSelector(
  [selectMaintenanceState],
  (maintenance) => maintenance.items
);

export const selectCurrentMaintenance = createSelector(
  [selectMaintenanceState],
  (maintenance) => maintenance.currentMaintenance
);

export const selectMaintenancePagination = createSelector(
  [selectMaintenanceState],
  (maintenance) => ({
    page: maintenance.page,
    limit: maintenance.limit,
    total: maintenance.total,
  })
);

export const selectMaintenanceLoading = createSelector(
  [selectMaintenanceState],
  (maintenance) => maintenance.loading
);

export const selectMaintenanceError = createSelector(
  [selectMaintenanceState],
  (maintenance) => maintenance.error
);

export const selectMaintenanceLastFetched = createSelector(
  [selectMaintenanceState],
  (maintenance) => maintenance.lastFetched
);

export const selectMaintenanceById = (id: string) =>
  createSelector([selectMaintenanceList], (records) =>
    records.find((record) => record._id === id)
  );

export const selectMaintenanceByStatus = (status: string) =>
  createSelector([selectMaintenanceList], (records) =>
    records.filter((record) => record.status === status)
  );

export const selectMaintenanceByVehicle = (vehicleId: string) =>
  createSelector([selectMaintenanceList], (records) =>
    records.filter((record) => record.vehicle === vehicleId)
  );
