import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  data: [],
  error: "",
};

export const fetchLowStock = createAsyncThunk(
  "lowStock/fetchLowStock",
  async ({ page = 1, limit = 10, orderBy = "asc" }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token is missing!");
    }

    return axios
      .get(
        `${import.meta.env.VITE_BASE_URL}/api/statistics/products-stock?page=${page}&limit=${limit}&orderBy=${orderBy}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => res.data);
  }
);


const lowStockSlice = createSlice({
  name: "expiryDate",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchLowStock.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLowStock.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(fetchLowStock.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export default lowStockSlice.reducer;
