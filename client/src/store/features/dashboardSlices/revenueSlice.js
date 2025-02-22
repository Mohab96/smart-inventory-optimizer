import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  data: [],
  error: "",
};

export const fetchRevenue = createAsyncThunk(
  "revenue/fetchRevenue",
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

const revenueSlice = createSlice({
  name: "revenue",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchRevenue.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRevenue.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(fetchRevenue.rejected, (state, action) => {
      state.loading = false;
      state.data = [];

      state.error = action.error.message;
    });
  },
});

export default revenueSlice.reducer;
