/**
 * Vehicle Slice
 * 
 * Manages vehicle state with caching (10 min staleness).
 * 
 * Requirements: 3.2, 3.10, 3.11, 3.12, 3.13, 4.1-4.7, 4.13-4.17, 5.1, 5.4
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as vehicleApi from '@/api/vehicle';
import type { Vehicle, VehicleListResponse } from '@/api/vehicle';
import type { QueryParams } from '@/api/axios';
import { isCacheStale, createCacheEntry, STALENESS_DURATIONS } from '../utils/cache';
import type { CacheEntry } from '../types';

interface VehicleState {
  list: Vehicle[];
  listCache: CacheEntry<VehicleListResponse> | null;
  currentVehicle: Vehicle | null;
  loading: boolean;
  error: string | null;
}

const initialState: VehicleState = {
  list: [],
  listCache: null,
  currentVehicle: null,
  loading: false,
  error: null,
};

// Async thunks
export const listVehiclesThunk = createAsyncThunk(
  'vehicle/list',
  async (query: QueryParams = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { vehicle: VehicleState };
      
      // Check cache
      if (!isCacheStale(state.vehicle.listCache, STALENESS_DURATIONS.VEHICLE_LIST)) {
        return state.vehicle.listCache!.data;
      }

      // Fetch fresh data
      return await vehicleApi.listVehicles(query);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createVehicleThunk = createAsyncThunk(
  'vehicle/create',
  async (payload: Partial<Vehicle>, { rejectWithValue }) => {
    try {
      return await vehicleApi.createVehicle(payload);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateVehicleThunk = createAsyncThunk(
  'vehicle/update',
  async ({ id, payload }: { id: string; payload: Partial<Vehicle> }, { rejectWithValue }) => {
    try {
      return await vehicleApi.updateVehicle(id, payload);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteVehicleThunk = createAsyncThunk(
  'vehicle/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await vehicleApi.deleteVehicle(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    invalidateCache: (state) => {
      state.listCache = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // List vehicles
    builder.addCase(listVehiclesThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(listVehiclesThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload.items;
      state.listCache = createCacheEntry(action.payload);
    });
    builder.addCase(listVehiclesThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create vehicle
    builder.addCase(createVehicleThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createVehicleThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.list.unshift(action.payload);
      state.listCache = null; // Invalidate cache
    });
    builder.addCase(createVehicleThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update vehicle
    builder.addCase(updateVehicleThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateVehicleThunk.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.list.findIndex((v) => v._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
      state.listCache = null; // Invalidate cache
    });
    builder.addCase(updateVehicleThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete vehicle
    builder.addCase(deleteVehicleThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteVehicleThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.list = state.list.filter((v) => v._id !== action.payload);
      state.listCache = null; // Invalidate cache
    });
    builder.addCase(deleteVehicleThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { invalidateCache, clearError } = vehicleSlice.actions;
export default vehicleSlice.reducer;
