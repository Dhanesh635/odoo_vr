/**
 * FuelLog Slice
 * 
 * Manages fuel log state with CRUD operations and time-based cache invalidation.
 * Requirements: 2.4, 3.4, 3.5, 3.6, 3.7
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as fuelLogApi from '@/api/fuel-log';
import type { FuelLog, FuelLogListResponse } from '@/api/fuel-log';
import { isCacheValid } from '../utils/cache';

interface FuelLogState {
  items: FuelLog[];
  page: number;
  limit: number;
  total: number;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: FuelLogState = {
  items: [],
  page: 1,
  limit: 10,
  total: 0,
  loading: false,
  error: null,
  lastFetched: null,
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export const fetchFuelLogs = createAsyncThunk(
  'fuelLog/fetchList',
  async (query: Record<string, unknown> = {}, { rejectWithValue }) => {
    try {
      return await fuelLogApi.listFuelLogs(query);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createFuelLog = createAsyncThunk(
  'fuelLog/create',
  async (payload: Partial<FuelLog>, { rejectWithValue }) => {
    try {
      return await fuelLogApi.createFuelLog(payload);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const fuelLogSlice = createSlice({
  name: 'fuelLog',
  initialState,
  reducers: {
    invalidateCache: (state) => {
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch list
    builder.addCase(fetchFuelLogs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFuelLogs.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.total = action.payload.total;
      state.lastFetched = Date.now();
    });
    builder.addCase(fetchFuelLogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create
    builder.addCase(createFuelLog.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createFuelLog.fulfilled, (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
      state.total += 1;
      state.lastFetched = null; // Invalidate cache
    });
    builder.addCase(createFuelLog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { invalidateCache } = fuelLogSlice.actions;
export default fuelLogSlice.reducer;

export const shouldFetchFuelLogs = (lastFetched: number | null): boolean => {
  return !isCacheValid(lastFetched, CACHE_DURATION);
};
