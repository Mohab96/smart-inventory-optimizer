import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  data: [],
  error: "",
};

export const fetchMonthlyRevenue = createAsyncThunk(
  "revenue/fetchMonthlyRevenue",
  async ({ startDate, endDate }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token is missing!");
    }

    return axios
      .get(
        `${import.meta.env.VITE_BASE_URL}/api/statistics/monthly-category-revenues?startDate=${startDate}&endDate=${endDate}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => res.data);
  }
);

export const fetchCategoryRevenue = createAsyncThunk(
  "revenue/fetchCategoryRevenue",
  async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token is missing!");
    }

    return axios
      .get(
        `${import.meta.env.VITE_BASE_URL}/api/statistics/category-revenue`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => res.data);
  }
);

const revenueSlice = createSlice({
  name: "revenue",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchMonthlyRevenue.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMonthlyRevenue.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(fetchMonthlyRevenue.rejected, (state, action) => {
      state.loading = false;
      state.data = [];

      state.error = action.error.message;
    });

    builder.addCase(fetchCategoryRevenue.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCategoryRevenue.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(fetchCategoryRevenue.rejected, (state, action) => {
      state.loading = false;
      state.data = [];

      state.error = action.error.message;
    });
  },
});

export default revenueSlice.reducer;
