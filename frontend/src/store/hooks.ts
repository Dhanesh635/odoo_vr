/**
 * Typed Redux Hooks
 * 
 * Pre-typed versions of Redux hooks for use throughout the application.
 * These hooks provide full TypeScript inference without needing to
 * manually type state or dispatch in every component.
 * 
 * Usage:
 * ```typescript
 * // Instead of:
 * import { useDispatch, useSelector } from 'react-redux';
 * const dispatch = useDispatch<AppDispatch>();
 * const user = useSelector((state: RootState) => state.auth.user);
 * 
 * // Use:
 * import { useAppDispatch, useAppSelector } from '@/store/hooks';
 * const dispatch = useAppDispatch(); // Automatically typed
 * const user = useAppSelector((state) => state.auth.user); // Automatically typed
 * ```
 * 
 * Requirements: 8.1, 8.2, 8.8
 */

import { useDispatch, useSelector, useStore } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * useAppDispatch hook
 * 
 * Typed version of useDispatch that returns AppDispatch type.
 * Enables proper type inference for async thunks and middleware.
 * 
 * Usage:
 * ```typescript
 * const dispatch = useAppDispatch();
 * 
 * // Dispatch regular actions
 * dispatch(logout());
 * 
 * // Dispatch async thunks with full type safety
 * dispatch(loginThunk({ email, password }));
 * 
 * // Get returned promise from thunk
 * const result = await dispatch(listVehiclesThunk()).unwrap();
 * ```
 * 
 * Requirement: 8.1
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * useAppSelector hook
 * 
 * Typed version of useSelector that provides RootState type inference.
 * Automatically infers the return type from the selector function.
 * 
 * Usage:
 * ```typescript
 * // Simple selector
 * const user = useAppSelector((state) => state.auth.user); // Type inferred as AuthUser | null
 * 
 * // Complex selector with computed value
 * const activeVehicles = useAppSelector((state) => 
 *   state.vehicle.list.filter(v => v.status === 'active')
 * ); // Type inferred as Vehicle[]
 * 
 * // Use with memoized selectors
 * const vehicles = useAppSelector(selectVehicleList); // Type from selector
 * ```
 * 
 * Requirement: 8.2
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * useAppStore hook
 * 
 * Typed version of useStore that returns the Redux store instance.
 * Useful for advanced use cases like accessing store outside React components
 * or in middleware/utilities.
 * 
 * Usage:
 * ```typescript
 * const store = useAppStore();
 * 
 * // Get current state snapshot
 * const currentState = store.getState();
 * 
 * // Dispatch actions
 * store.dispatch(someAction());
 * 
 * // Subscribe to state changes
 * const unsubscribe = store.subscribe(() => {
 *   console.log('State changed:', store.getState());
 * });
 * ```
 * 
 * Note: This is rarely needed in typical React components.
 * Prefer useAppSelector and useAppDispatch for most use cases.
 * 
 * Requirement: 8.8
 */
export const useAppStore = () => useStore<RootState>();
