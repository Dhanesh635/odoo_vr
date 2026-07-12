/**
 * Expense Slice
 * 
 * Manages expense state with CRUD operations and time-based cache invalidation.
 * Requirements: 2.4, 3.4, 3.5, 3.6, 3.7
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as expenseApi from '@/api/expense';
import type { Expense, ExpenseListResponse } from '@/api/expense';
import { isCacheValid } from '../utils/cache';

interface ExpenseState {
  items: Expense[];
  page: number;
  limit: number;
  total: number;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: ExpenseState = {
  items: [],
  page: 1,
  limit: 10,
  total: 0,
  loading: false,
  error: null,
  lastFetched: null,
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export const fetchExpenses = createAsyncThunk(
  'expense/fetchList',
  async (query: Record<string, unknown> = {}, { rejectWithValue }) => {
    try {
      return await expenseApi.listExpenses(query);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createExpense = createAsyncThunk(
  'expense/create',
  async (payload: Partial<Expense>, { rejectWithValue }) => {
    try {
      return await expenseApi.createExpense(payload);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    invalidateCache: (state) => {
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch list
    builder.addCase(fetchExpenses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchExpenses.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.total = action.payload.total;
      state.lastFetched = Date.now();
    });
    builder.addCase(fetchExpenses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create
    builder.addCase(createExpense.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createExpense.fulfilled, (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
      state.total += 1;
      state.lastFetched = null; // Invalidate cache
    });
    builder.addCase(createExpense.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { invalidateCache } = expenseSlice.actions;
export default expenseSlice.reducer;

export const shouldFetchExpenses = (lastFetched: number | null): boolean => {
  return !isCacheValid(lastFetched, CACHE_DURATION);
};
