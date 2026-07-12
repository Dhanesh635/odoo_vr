/**
 * Reports Selectors
 * 
 * Memoized selectors for reports state.
 * Requirements: 2.5, 3.9
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export const selectReportsState = (state: RootState) => state.reports;

export const selectFuelEfficiencyReport = createSelector(
  [selectReportsState],
  (reports) => reports.fuelEfficiency
);

export const selectFleetUtilizationReport = createSelector(
  [selectReportsState],
  (reports) => reports.fleetUtilization
);

export const selectOperationalCostReport = createSelector(
  [selectReportsState],
  (reports) => reports.operationalCost
);

export const selectVehicleRoiReport = createSelector(
  [selectReportsState],
  (reports) => reports.vehicleRoi
);

export const selectReportsLoading = createSelector(
  [selectReportsState],
  (reports) => reports.loading
);

export const selectReportsError = createSelector(
  [selectReportsState],
  (reports) => reports.error
);

export const selectReportsLastFetched = createSelector(
  [selectReportsState],
  (reports) => reports.lastFetched
);

export const selectReportLastFetched = (reportType: keyof RootState['reports']['lastFetched']) =>
  createSelector([selectReportsLastFetched], (lastFetched) => lastFetched[reportType]);
