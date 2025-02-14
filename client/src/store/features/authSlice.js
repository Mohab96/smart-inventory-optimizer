// src/store/features/authSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login success
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      state.user = user;
      state.error = null;
      // Store token in localStorage
      localStorage.setItem('token', token);
    },
    // Logout
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      // Remove token from localStorage
      localStorage.removeItem('token');
    },
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    // Update user info
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  }
});

// Export actions
export const {
  setCredentials,
  logout,
  setLoading,
  setError,
  updateUser
} = authSlice.actions;

// Export selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Export reducer
export default authSlice.reducer;