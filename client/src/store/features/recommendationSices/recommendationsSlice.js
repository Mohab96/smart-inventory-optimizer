import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  data: [],
  error: "",
};

// Fetch Transactions with Date Parameter
export const fetchRecommendations = createAsyncThunk(
  "recommendation/fetchRecommendations",
  async ({ numberOfProducts, daysOfForecasting }) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing!");

    const response = await axios.get(
      `http://localhost:2000/api/insights/get-insights?numberOfProducts=${numberOfProducts}&daysOfForecasting=${daysOfForecasting}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  }
);

const recommendationSlice = createSlice({
  name: "recommendation",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchRecommendations.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRecommendations.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(fetchRecommendations.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export default recommendationSlice.reducer;
