/**
 * Driver Slice
 * 
 * Manages driver state with CRUD operations and time-based cache invalidation.
 * Requirements: 2.4, 3.4, 3.5, 3.6, 3.7
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as driverApi from '@/api/driver';
import type { Driver, DriverListResponse } from '@/api/driver';
import { isCacheValid } from '../utils/cache';

interface DriverState {
  items: Driver[];
  currentDriver: Driver | null;
  page: number;
  limit: number;
  total: number;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: DriverState = {
  items: [],
  currentDriver: null,
  page: 1,
  limit: 10,
  total: 0,
  loading: false,
  error: null,
  lastFetched: null,
};

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const fetchDrivers = createAsyncThunk(
  'driver/fetchList',
  async (query: Record<string, unknown> = {}, { rejectWithValue }) => {
    try {
      return await driverApi.listDrivers(query);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchDriver = createAsyncThunk(
  'driver/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      return await driverApi.getDriver(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createDriver = createAsyncThunk(
  'driver/create',
  async (payload: Partial<Driver>, { rejectWithValue }) => {
    try {
      return await driverApi.createDriver(payload);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateDriver = createAsyncThunk(
  'driver/update',
  async ({ id, payload }: { id: string; payload: Partial<Driver> }, { rejectWithValue }) => {
    try {
      return await driverApi.updateDriver(id, payload);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteDriver = createAsyncThunk(
  'driver/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await driverApi.deleteDriver(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    invalidateCache: (state) => {
      state.lastFetched = null;
    },
    clearCurrentDriver: (state) => {
      state.currentDriver = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch list
    builder.addCase(fetchDrivers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDrivers.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.total = action.payload.total;
      state.lastFetched = Date.now();
    });
    builder.addCase(fetchDrivers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch one
    builder.addCase(fetchDriver.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDriver.fulfilled, (state, action) => {
      state.loading = false;
      state.currentDriver = action.payload;
    });
    builder.addCase(fetchDriver.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create
    builder.addCase(createDriver.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createDriver.fulfilled, (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
      state.total += 1;
      state.lastFetched = null; // Invalidate cache
    });
    builder.addCase(createDriver.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update
    builder.addCase(updateDriver.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateDriver.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.currentDriver?._id === action.payload._id) {
        state.currentDriver = action.payload;
      }
    });
    builder.addCase(updateDriver.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete
    builder.addCase(deleteDriver.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteDriver.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter(item => item._id !== action.payload);
      state.total -= 1;
      if (state.currentDriver?._id === action.payload) {
        state.currentDriver = null;
      }
    });
    builder.addCase(deleteDriver.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { invalidateCache, clearCurrentDriver } = driverSlice.actions;
export default driverSlice.reducer;

export const shouldFetchDrivers = (lastFetched: number | null): boolean => {
  return !isCacheValid(lastFetched, CACHE_DURATION);
};
