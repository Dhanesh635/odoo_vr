/**
 * Slice exports
 * 
 * Centralized exports for all Redux slices
 */

export { default as authReducer } from './authSlice';
export { default as vehicleReducer } from './vehicleSlice';

export { 
  loginThunk, 
  registerThunk, 
  getCurrentUserThunk, 
  logout,
  clearError as clearAuthError 
} from './authSlice';

export {
  listVehiclesThunk,
  createVehicleThunk,
  updateVehicleThunk,
  deleteVehicleThunk,
  invalidateCache as invalidateVehicleCache,
  clearError as clearVehicleError
} from './vehicleSlice';
