import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  monthlyData: null,
  quarterlyData: null,
  categoryRevenue: null,
  productsRevenue: null,
  totalYearRevenue: null, // Added this for total revenue state
  error: "",
};

// Fetch Monthly Revenue
export const fetchMonthlyRevenue = createAsyncThunk(
  "revenue/fetchMonthlyRevenue",
  async ({ startDate, endDate }) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing!");

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/statistics/monthly-category-revenues?startDate=${startDate}&endDate=${endDate}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

// Fetch Category Revenue
export const fetchCategoryRevenue = createAsyncThunk(
  "revenue/fetchCategoryRevenue",
  async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing!");

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/statistics/category-revenue`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

// Fetch Products Revenue
export const fetchProductsRevenue = createAsyncThunk(
  "revenue/fetchProductsRevenue",
  async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing!");

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/statistics/products-revenue`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

// Fetch Revenue Per Month
export const fetchRevenuesPerMonth = createAsyncThunk(
  "revenue/fetchRevenuesPerMonth",
  async ({ year }) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing!");

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/statistics/yearly-revenue-per-month?year=${year}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

// Fetch Revenue Per Quarter
export const fetchRevenuesPerQuarter = createAsyncThunk(
  "revenue/fetchRevenuesPerQuarter",
  async ({ year }) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing!");

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/statistics/total-revenue-per-quarter?year=${year}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

// Fetch Total Year Revenue (Fixed API URL)
export const fetchTotalYearRevenue = createAsyncThunk(
  "revenue/fetchTotalYearRevenue",
  async ({ year }) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing!");

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/statistics/total-revenue-per-year?year=${year}`, // Fixed URL
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

const revenueSlice = createSlice({
  name: "revenue",
  initialState,
  extraReducers: (builder) => {
    builder
      // Handle fetchMonthlyRevenue
      .addCase(fetchMonthlyRevenue.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMonthlyRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyData = action.payload;
        state.error = "";
      })
      .addCase(fetchMonthlyRevenue.rejected, (state, action) => {
        state.loading = false;
        state.monthlyData = null;
        state.error = action.error.message;
      })

      // Handle fetchCategoryRevenue
      .addCase(fetchCategoryRevenue.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryRevenue = action.payload;
        state.error = "";
      })
      .addCase(fetchCategoryRevenue.rejected, (state, action) => {
        state.loading = false;
        state.categoryRevenue = null;
        state.error = action.error.message;
      })

      // Handle fetchProductsRevenue
      .addCase(fetchProductsRevenue.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.productsRevenue = action.payload;
        state.error = "";
      })
      .addCase(fetchProductsRevenue.rejected, (state, action) => {
        state.loading = false;
        state.productsRevenue = null;
        state.error = action.error.message;
      })

      // Handle fetchRevenuesPerMonth
      .addCase(fetchRevenuesPerMonth.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRevenuesPerMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyData = action.payload;
        state.error = "";
      })
      .addCase(fetchRevenuesPerMonth.rejected, (state, action) => {
        state.loading = false;
        state.monthlyData = null;
        state.error = action.error.message;
      })

      // Handle fetchRevenuesPerQuarter
      .addCase(fetchRevenuesPerQuarter.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRevenuesPerQuarter.fulfilled, (state, action) => {
        state.loading = false;
        state.quarterlyData = action.payload;
        state.error = "";
      })
      .addCase(fetchRevenuesPerQuarter.rejected, (state, action) => {
        state.loading = false;
        state.quarterlyData = null;
        state.error = action.error.message;
      })

      // Handle fetchTotalYearRevenue (Added missing reducer)
      .addCase(fetchTotalYearRevenue.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTotalYearRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.totalYearRevenue = action.payload;
        state.error = "";
      })
      .addCase(fetchTotalYearRevenue.rejected, (state, action) => {
        state.loading = false;
        state.totalYearRevenue = null;
        state.error = action.error.message;
      });
  },
});

export default revenueSlice.reducer;
