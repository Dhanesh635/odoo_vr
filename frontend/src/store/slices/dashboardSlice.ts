/**
 * Dashboard Slice
 * 
 * Manages dashboard KPIs state with time-based cache invalidation.
 * Requirements: 2.4, 3.1, 3.2, 3.3
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as dashboardApi from '@/api/dashboard';
import type { DashboardKpis } from '@/api/dashboard';
import { isCacheValid } from '../utils/cache';

interface DashboardState {
  kpis: DashboardKpis | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: DashboardState = {
  kpis: null,
  loading: false,
  error: null,
  lastFetched: null,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchDashboardKpis = createAsyncThunk(
  'dashboard/fetchKpis',
  async (query: Record<string, unknown> = {}, { rejectWithValue }) => {
    try {
      return await dashboardApi.getDashboardKpis(query);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    invalidateCache: (state) => {
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDashboardKpis.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDashboardKpis.fulfilled, (state, action) => {
      state.loading = false;
      state.kpis = action.payload;
      state.lastFetched = Date.now();
    });
    builder.addCase(fetchDashboardKpis.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { invalidateCache } = dashboardSlice.actions;
export default dashboardSlice.reducer;

// Helper to check if fetch is needed
export const shouldFetchDashboard = (lastFetched: number | null): boolean => {
  return !isCacheValid(lastFetched, CACHE_DURATION);
};
