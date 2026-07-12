/**
 * Redux Store Configuration
 * 
 * Central store configuration for the Odoo VR fleet management system.
 * Uses Redux Toolkit for simplified Redux setup with TypeScript support.
 * 
 * Features:
 * - Configured with empty reducer (slices added incrementally during migration)
 * - Redux DevTools enabled only in development mode
 * - Middleware configured for serialization checks
 * - Exports typed RootState and AppDispatch for type-safe hooks
 * 
 * Requirements: 1.1, 1.2, 1.3, 7.1, 7.2
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Implemented slices
import authReducer from './slices/authSlice';
import vehicleReducer from './slices/vehicleSlice';
import dashboardReducer from './slices/dashboardSlice';
import driverReducer from './slices/driverSlice';
import expenseReducer from './slices/expenseSlice';
import fuelLogReducer from './slices/fuelLogSlice';
import maintenanceReducer from './slices/maintenanceSlice';
import reportsReducer from './slices/reportsSlice';
import tripReducer from './slices/tripSlice';

// Future imports - will be uncommented as slices are implemented
// import uiReducer from './slices/uiSlice';

/**
 * Persist config for auth slice only
 * Only persist user and token fields
 */
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token'], // Only persist these fields
};

/**
 * Root reducer combining all feature slices
 * 
 * Phase 2: auth (with Redux Persist), vehicle
 * Phase 3: dashboard, driver, expense, fuelLog, maintenance, reports, trip
 * Phase 4: ui
 */
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  vehicle: vehicleReducer,
  dashboard: dashboardReducer,
  driver: driverReducer,
  expense: expenseReducer,
  fuelLog: fuelLogReducer,
  maintenance: maintenanceReducer,
  reports: reportsReducer,
  trip: tripReducer,
  // Phase 4 will add: ui
});

/**
 * Redux store instance
 * 
 * Configured with Redux Toolkit's configureStore which includes:
 * - Redux Thunk middleware by default
 * - Redux DevTools integration (dev only)
 * - Serialization checks for state and actions
 * - Immutability checks (dev only)
 */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Configure serializable check middleware
      // This middleware warns when non-serializable values are detected in state or actions
      serializableCheck: {
        // Ignore Redux Persist actions in serialization checks
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 128, // Warn if check takes longer than 128ms
      },
    }),
  // Enable Redux DevTools only in development mode
  // In production, DevTools is disabled for security and performance
  devTools: process.env.NODE_ENV !== 'production',
});

/**
 * Redux Persist persistor
 * Manages the persistence of auth state to localStorage
 */
export const persistor = persistStore(store);

/**
 * RootState type
 * 
 * Represents the entire Redux state tree structure.
 * Inferred automatically from the store's reducer configuration.
 * 
 * Usage:
 * ```typescript
 * import { RootState } from '@/store/store';
 * 
 * // In selectors
 * const selectUser = (state: RootState) => state.auth.user;
 * 
 * // In useAppSelector
 * const user = useAppSelector((state: RootState) => state.auth.user);
 * ```
 * 
 * Requirement: 8.3
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch type
 * 
 * Represents the dispatch function type with proper typing for thunks.
 * Enables type inference for async actions and middleware.
 * 
 * Usage:
 * ```typescript
 * import { AppDispatch } from '@/store/store';
 * 
 * // In components
 * const dispatch: AppDispatch = useAppDispatch();
 * dispatch(loginThunk({ email, password })); // Fully typed
 * ```
 * 
 * Requirement: 8.4
 */
export type AppDispatch = typeof store.dispatch;
