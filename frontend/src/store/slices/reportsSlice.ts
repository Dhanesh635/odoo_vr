/**
 * Reports Slice
 * 
 * Manages reports state with read-only operations and time-based cache invalidation.
 * Requirements: 2.4, 3.4, 3.5
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as reportsApi from '@/api/reports';
import type {
  FuelEfficiencyReportRow,
  FleetUtilizationReport,
  OperationalCostReportRow,
  VehicleRoiReportRow,
} from '@/api/reports';
import { isCacheValid } from '../utils/cache';

interface ReportsState {
  fuelEfficiency: FuelEfficiencyReportRow[];
  fleetUtilization: FleetUtilizationReport | null;
  operationalCost: OperationalCostReportRow[];
  vehicleRoi: VehicleRoiReportRow[];
  loading: boolean;
  error: string | null;
  lastFetched: {
    fuelEfficiency: number | null;
    fleetUtilization: number | null;
    operationalCost: number | null;
    vehicleRoi: number | null;
  };
}

const initialState: ReportsState = {
  fuelEfficiency: [],
  fleetUtilization: null,
  operationalCost: [],
  vehicleRoi: [],
  loading: false,
  error: null,
  lastFetched: {
    fuelEfficiency: null,
    fleetUtilization: null,
    operationalCost: null,
    vehicleRoi: null,
  },
};

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const fetchFuelEfficiencyReport = createAsyncThunk(
  'reports/fetchFuelEfficiency',
  async (query: Record<string, unknown> = {}, { rejectWithValue }) => {
    try {
      return await reportsApi.getFuelEfficiencyReport(query);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchFleetUtilizationReport = createAsyncThunk(
  'reports/fetchFleetUtilization',
  async (query: Record<string, unknown> = {}, { rejectWithValue }) => {
    try {
      return await reportsApi.getFleetUtilizationReport(query);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchOperationalCostReport = createAsyncThunk(
  'reports/fetchOperationalCost',
  async (query: Record<string, unknown> = {}, { rejectWithValue }) => {
    try {
      return await reportsApi.getOperationalCostReport(query);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchVehicleRoiReport = createAsyncThunk(
  'reports/fetchVehicleRoi',
  async (query: Record<string, unknown> = {}, { rejectWithValue }) => {
    try {
      return await reportsApi.getVehicleRoiReport(query);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    invalidateCache: (state, action: { payload?: keyof typeof state.lastFetched }) => {
      if (action.payload) {
        state.lastFetched[action.payload] = null;
      } else {
        // Invalidate all caches
        state.lastFetched.fuelEfficiency = null;
        state.lastFetched.fleetUtilization = null;
        state.lastFetched.operationalCost = null;
        state.lastFetched.vehicleRoi = null;
      }
    },
  },
  extraReducers: (builder) => {
    // Fuel efficiency
    builder.addCase(fetchFuelEfficiencyReport.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFuelEfficiencyReport.fulfilled, (state, action) => {
      state.loading = false;
      state.fuelEfficiency = action.payload.items;
      state.lastFetched.fuelEfficiency = Date.now();
    });
    builder.addCase(fetchFuelEfficiencyReport.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fleet utilization
    builder.addCase(fetchFleetUtilizationReport.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFleetUtilizationReport.fulfilled, (state, action) => {
      state.loading = false;
      state.fleetUtilization = action.payload;
      state.lastFetched.fleetUtilization = Date.now();
    });
    builder.addCase(fetchFleetUtilizationReport.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Operational cost
    builder.addCase(fetchOperationalCostReport.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOperationalCostReport.fulfilled, (state, action) => {
      state.loading = false;
      state.operationalCost = action.payload.items;
      state.lastFetched.operationalCost = Date.now();
    });
    builder.addCase(fetchOperationalCostReport.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Vehicle ROI
    builder.addCase(fetchVehicleRoiReport.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchVehicleRoiReport.fulfilled, (state, action) => {
      state.loading = false;
      state.vehicleRoi = action.payload.items;
      state.lastFetched.vehicleRoi = Date.now();
    });
    builder.addCase(fetchVehicleRoiReport.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { invalidateCache } = reportsSlice.actions;
export default reportsSlice.reducer;

export const shouldFetchReport = (
  reportType: keyof typeof initialState.lastFetched,
  lastFetched: number | null
): boolean => {
  return !isCacheValid(lastFetched, CACHE_DURATION);
};
