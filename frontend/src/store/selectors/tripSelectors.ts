/**
 * Trip Selectors
 * 
 * Memoized selectors for trip state.
 * Requirements: 2.5, 3.9
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export const selectTripState = (state: RootState) => state.trip;

export const selectTripList = createSelector(
  [selectTripState],
  (trip) => trip.items
);

export const selectCurrentTrip = createSelector(
  [selectTripState],
  (trip) => trip.currentTrip
);

export const selectTripPagination = createSelector(
  [selectTripState],
  (trip) => ({
    page: trip.page,
    limit: trip.limit,
    total: trip.total,
  })
);

export const selectTripLoading = createSelector(
  [selectTripState],
  (trip) => trip.loading
);

export const selectTripError = createSelector(
  [selectTripState],
  (trip) => trip.error
);

export const selectTripLastFetched = createSelector(
  [selectTripState],
  (trip) => trip.lastFetched
);

export const selectTripById = (id: string) =>
  createSelector([selectTripList], (trips) =>
    trips.find((trip) => trip._id === id)
  );

export const selectTripsByStatus = (status: string) =>
  createSelector([selectTripList], (trips) =>
    trips.filter((trip) => trip.status === status)
  );
