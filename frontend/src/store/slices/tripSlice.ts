/**
 * Trip Slice
 * 
 * Manages trip state with CRUD operations and cross-slice cache invalidation.
 * Requirements: 2.4, 3.4, 3.5, 3.6, 3.7, 3.8
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as tripApi from '@/api/trip';
import type { Trip, TripListResponse } from '@/api/trip';
import { isCacheValid } from '../utils/cache';
import type { AppDispatch } from '../store';
import { invalidateCache as invalidateDashboard } from './dashboardSlice';

interface TripState {
  items: Trip[];
  currentTrip: Trip | null;
  page: number;
  limit: number;
  total: number;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: TripState = {
  items: [],
  currentTrip: null,
  page: 1,
  limit: 10,
  total: 0,
  loading: false,
  error: null,
  lastFetched: null,
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export const fetchTrips = createAsyncThunk(
  'trip/fetchList',
  async (query: Record<string, unknown> = {}, { rejectWithValue }) => {
    try {
      return await tripApi.listTrips(query);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchTrip = createAsyncThunk(
  'trip/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      return await tripApi.getTrip(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createTrip = createAsyncThunk(
  'trip/create',
  async (payload: Partial<Trip>, { rejectWithValue, dispatch }) => {
    try {
      const result = await tripApi.createTrip(payload);
      // Invalidate dashboard cache when trips change
      dispatch(invalidateDashboard());
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateTrip = createAsyncThunk(
  'trip/update',
  async ({ id, payload }: { id: string; payload: Partial<Trip> }, { rejectWithValue, dispatch }) => {
    try {
      const result = await tripApi.updateTrip(id, payload);
      dispatch(invalidateDashboard());
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const dispatchTrip = createAsyncThunk(
  'trip/dispatch',
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const result = await tripApi.dispatchTrip(id);
      dispatch(invalidateDashboard());
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const completeTrip = createAsyncThunk(
  'trip/complete',
  async ({ id, payload }: { id: string; payload: { finalOdometerKm: number; fuelConsumedLiters: number } }, { rejectWithValue, dispatch }) => {
    try {
      const result = await tripApi.completeTrip(id, payload);
      dispatch(invalidateDashboard());
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const cancelTrip = createAsyncThunk(
  'trip/cancel',
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const result = await tripApi.cancelTrip(id);
      dispatch(invalidateDashboard());
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteTrip = createAsyncThunk(
  'trip/delete',
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await tripApi.deleteTrip(id);
      dispatch(invalidateDashboard());
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    invalidateCache: (state) => {
      state.lastFetched = null;
    },
    clearCurrentTrip: (state) => {
      state.currentTrip = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch list
    builder.addCase(fetchTrips.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTrips.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.total = action.payload.total;
      state.lastFetched = Date.now();
    });
    builder.addCase(fetchTrips.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch one
    builder.addCase(fetchTrip.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTrip.fulfilled, (state, action) => {
      state.loading = false;
      state.currentTrip = action.payload;
    });
    builder.addCase(fetchTrip.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create
    builder.addCase(createTrip.fulfilled, (state, action) => {
      state.items.push(action.payload);
      state.total += 1;
      state.lastFetched = null;
    });

    // Update
    builder.addCase(updateTrip.fulfilled, (state, action) => {
      const index = state.items.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.currentTrip?._id === action.payload._id) {
        state.currentTrip = action.payload;
      }
    });

    // Dispatch
    builder.addCase(dispatchTrip.fulfilled, (state, action) => {
      const index = state.items.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.currentTrip?._id === action.payload._id) {
        state.currentTrip = action.payload;
      }
    });

    // Complete
    builder.addCase(completeTrip.fulfilled, (state, action) => {
      const index = state.items.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.currentTrip?._id === action.payload._id) {
        state.currentTrip = action.payload;
      }
    });

    // Cancel
    builder.addCase(cancelTrip.fulfilled, (state, action) => {
      const index = state.items.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.currentTrip?._id === action.payload._id) {
        state.currentTrip = action.payload;
      }
    });

    // Delete
    builder.addCase(deleteTrip.fulfilled, (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      state.total -= 1;
      if (state.currentTrip?._id === action.payload) {
        state.currentTrip = null;
      }
    });
  },
});

export const { invalidateCache, clearCurrentTrip } = tripSlice.actions;
export default tripSlice.reducer;

export const shouldFetchTrips = (lastFetched: number | null): boolean => {
  return !isCacheValid(lastFetched, CACHE_DURATION);
};
