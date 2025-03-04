import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { data } from "react-router-dom";

const initialState = {
  loading: false,
  data: [],
  error: "",
};

// Fetch Monthly Revenue
export const fetchCategorySales = createAsyncThunk(
  "sales/fetchCategorySales",
  async ({ page = 1, limit = 10, orderBy = "asc" }) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing!");

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/statistics/category-sales?page=${page}&limit=${limit}&orderBy=${orderBy}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

const salesSlice = createSlice({
  name: "revenue",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchCategorySales.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCategorySales.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(fetchCategorySales.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export default salesSlice.reducer;
