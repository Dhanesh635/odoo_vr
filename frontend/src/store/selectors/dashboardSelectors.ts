/**
 * Dashboard Selectors
 * 
 * Memoized selectors for dashboard state.
 * Requirements: 2.5, 3.9
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export const selectDashboardState = (state: RootState) => state.dashboard;

export const selectDashboardKpis = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.kpis
);

export const selectDashboardLoading = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.loading
);

export const selectDashboardError = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.error
);

export const selectDashboardLastFetched = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.lastFetched
);
