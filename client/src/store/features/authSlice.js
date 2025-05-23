import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  resetToken: localStorage.getItem("resetToken") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const token = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("token", token);
    },
    setResetToken: (state, action) => {
      state.resetToken = action.payload;
      localStorage.setItem("resetToken", action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Export actions
export const { setCredentials, setResetToken, logout, setLoading, setError } =
  authSlice.actions;

// Export selectors
export const selectToken = (state) => state.auth.token;
export const selectResetToken = (state) => state.auth.resetToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Export reducer
export default authSlice.reducer;
