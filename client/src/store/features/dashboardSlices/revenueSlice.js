import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  data: [],
  error: "",
};

export const fetchRevenue = createAsyncThunk(
  "revenue/fetchRevenue",
  async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token is missing!");
    }

    console.log("Token being sent:", token); // Debugging log

    return axios
      .get(
        "https://smart-inventory-optimizer.vercel.app/api/statistics/products-revenues",
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
      (state.loading = false), (state.data = action.payload);
      state.error = "";
    });
    builder.addCase(fetchRevenue.rejected, (state, action) => {
      (state.loading = false), (state.data = []);
      state.error = action.error.message;
    });
  },
});

export default revenueSlice.reducer;
