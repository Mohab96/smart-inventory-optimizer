import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  totalProducts: 0,
  totalCategories: 0,
  error: "",
};

export const fetchTotalProducts = createAsyncThunk(
  "overview/fetchTotalProducts",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("Token not found");
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/statistics/total-products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTotalCategories = createAsyncThunk(
  "overview/fetchTotalCategories",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("Token not found");
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/statistics/total-categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const overviewSlice = createSlice({
  name: "overview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTotalProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.totalProducts = action.payload;
        state.error = "";
      })
      .addCase(fetchTotalProducts.rejected, (state, action) => {
        state.loading = false;
        state.totalProducts = 0;
        state.error = action.payload;
      })
      .addCase(fetchTotalCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTotalCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.totalCategories = action.payload;
        state.error = "";
      })
      .addCase(fetchTotalCategories.rejected, (state, action) => {
        state.loading = false;
        state.totalCategories = 0;
        state.error = action.payload;
      });
  },
});

export default overviewSlice.reducer; 