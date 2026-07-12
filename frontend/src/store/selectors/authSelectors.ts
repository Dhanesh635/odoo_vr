/**
 * Auth Selectors
 * 
 * Memoized selectors for auth state to prevent unnecessary re-renders.
 * 
 * Requirements: 8.8, 10.1, 10.2
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Basic selector
const selectAuthState = (state: RootState) => state.auth;

// Memoized selectors
export const selectAuthUser = createSelector(
  [selectAuthState],
  (authState) => authState.user
);

export const selectAuthToken = createSelector(
  [selectAuthState],
  (authState) => authState.token
);

export const selectAuthLoading = createSelector(
  [selectAuthState],
  (authState) => authState.loading
);

export const selectAuthError = createSelector(
  [selectAuthState],
  (authState) => authState.error
);

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (authState) => !!authState.user && !!authState.token
);
