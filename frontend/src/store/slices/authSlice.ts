/**
 * Auth Slice
 * 
 * Manages authentication state with Redux Persist for token persistence.
 * Wraps existing auth API functions with Redux Toolkit async thunks.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.8, 3.10, 3.11, 3.12, 3.13, 9.4, 9.5
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as authApi from '@/api/auth';
import type { AuthUser, AuthCredentials, RegisterPayload } from '@/api/auth';

/**
 * Auth state interface
 */
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

/**
 * Login thunk - wraps auth API login function
 */
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: AuthCredentials, { rejectWithValue }) => {
    try {
      return await authApi.login(credentials);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Register thunk - wraps auth API register function
 */
export const registerThunk = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      return await authApi.register(payload);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Get current user thunk - wraps auth API getCurrentUser function
 */
export const getCurrentUserThunk = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.getCurrentUser();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      authApi.logout(); // Call existing logout function
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(registerThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get current user
    builder.addCase(getCurrentUserThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCurrentUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(getCurrentUserThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      // Clear auth on fetch failure (token likely invalid)
      state.user = null;
      state.token = null;
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;