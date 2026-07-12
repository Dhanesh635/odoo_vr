/**
 * Expense Selectors
 * 
 * Memoized selectors for expense state.
 * Requirements: 2.5, 3.9
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export const selectExpenseState = (state: RootState) => state.expense;

export const selectExpenseList = createSelector(
  [selectExpenseState],
  (expense) => expense.items
);

export const selectExpensePagination = createSelector(
  [selectExpenseState],
  (expense) => ({
    page: expense.page,
    limit: expense.limit,
    total: expense.total,
  })
);

export const selectExpenseLoading = createSelector(
  [selectExpenseState],
  (expense) => expense.loading
);

export const selectExpenseError = createSelector(
  [selectExpenseState],
  (expense) => expense.error
);

export const selectExpenseLastFetched = createSelector(
  [selectExpenseState],
  (expense) => expense.lastFetched
);

export const selectExpensesByType = (type: string) =>
  createSelector([selectExpenseList], (expenses) =>
    expenses.filter((expense) => expense.type === type)
  );

export const selectExpensesByVehicle = (vehicleId: string) =>
  createSelector([selectExpenseList], (expenses) =>
    expenses.filter((expense) => expense.vehicle === vehicleId)
  );
