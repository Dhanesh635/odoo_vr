/**
 * Maintenance Slice
 * 
 * Manages maintenance state with CRUD operations and time-based cache invalidation.
 * Requirements: 2.4, 3.4, 3.5, 3.6, 3.7
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as maintenanceApi from '@/api/maintenance';
import type { MaintenanceRecord, MaintenanceListResponse } from '@/api/maintenance';
import { isCacheValid } from '../utils/cache';

interface MaintenanceState {
  items: MaintenanceRecord[];
  currentMaintenance: MaintenanceRecord | null;
  page: number;
  limit: number;
  total: number;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: MaintenanceState = {
  items: [],
  currentMaintenance: null,
  page: 1,
  limit: 10,
  total: 0,
  loading: false,
  error: null,
  lastFetched: null,
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export const fetchMaintenanceList = createAsyncThunk(
  'maintenance/fetchList',
  async (query: Record<string, unknown> = {}, { rejectWithValue }) => {
    try {
      return await maintenanceApi.listMaintenance(query);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchMaintenance = createAsyncThunk(
  'maintenance/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      return await maintenanceApi.getMaintenance(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createMaintenance = createAsyncThunk(
  'maintenance/create',
  async (payload: Partial<MaintenanceRecord>, { rejectWithValue }) => {
    try {
      return await maintenanceApi.createMaintenance(payload);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateMaintenance = createAsyncThunk(
  'maintenance/update',
  async ({ id, payload }: { id: string; payload: Partial<MaintenanceRecord> }, { rejectWithValue }) => {
    try {
      return await maintenanceApi.updateMaintenance(id, payload);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const closeMaintenance = createAsyncThunk(
  'maintenance/close',
  async (id: string, { rejectWithValue }) => {
    try {
      return await maintenanceApi.closeMaintenance(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    invalidateCache: (state) => {
      state.lastFetched = null;
    },
    clearCurrentMaintenance: (state) => {
      state.currentMaintenance = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch list
    builder.addCase(fetchMaintenanceList.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMaintenanceList.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.total = action.payload.total;
      state.lastFetched = Date.now();
    });
    builder.addCase(fetchMaintenanceList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch one
    builder.addCase(fetchMaintenance.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMaintenance.fulfilled, (state, action) => {
      state.loading = false;
      state.currentMaintenance = action.payload;
    });
    builder.addCase(fetchMaintenance.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create
    builder.addCase(createMaintenance.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createMaintenance.fulfilled, (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
      state.total += 1;
      state.lastFetched = null; // Invalidate cache
    });
    builder.addCase(createMaintenance.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update
    builder.addCase(updateMaintenance.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateMaintenance.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.currentMaintenance?._id === action.payload._id) {
        state.currentMaintenance = action.payload;
      }
    });
    builder.addCase(updateMaintenance.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Close
    builder.addCase(closeMaintenance.fulfilled, (state, action) => {
      const index = state.items.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.currentMaintenance?._id === action.payload._id) {
        state.currentMaintenance = action.payload;
      }
    });
  },
});

export const { invalidateCache, clearCurrentMaintenance } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;

export const shouldFetchMaintenance = (lastFetched: number | null): boolean => {
  return !isCacheValid(lastFetched, CACHE_DURATION);
};
