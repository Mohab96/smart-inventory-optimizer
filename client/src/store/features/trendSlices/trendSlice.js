import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  error: "",
  categoriesSales: [],
  productsSales: [],
  categoriesRevenue: [],
  productsRevenue: [],
};

// Fetch Categories Sales Trends
export const fetchCategoriesSalesTrends = createAsyncThunk(
  "trend/fetchCategoriesSalesTrends",
  async (selectedDate) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing!");

    const response = await axios.get(
      `http://localhost:2000/api/statistics/categories-sale-trend/${selectedDate}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  }
);

// Fetch Products Sales Trends
export const fetchProductsSalesTrends = createAsyncThunk(
  "trend/fetchProductsSalesTrends",
  async (selectedDate) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing!");

    const response = await axios.get(
      `http://localhost:2000/api/statistics/products-sale-trend/${selectedDate}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  }
);

// Fetch Products Revenues Trends
export const fetchProductsRevenuesTrends = createAsyncThunk(
  "trend/fetchProductsRevenuesTrends",
  async (selectedDate) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing!");

    const response = await axios.get(
      `http://localhost:2000/api/statistics/products-revenue-trend/${selectedDate}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  }
);

// Fetch Categories Revenues Trends
export const fetchCategoriesRevenuesTrends = createAsyncThunk(
  "trend/fetchCategoriesRevenuesTrends",
  async (selectedDate) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing!");

    const response = await axios.get(
      `http://localhost:2000/api/statistics/categories-revenue-trend/${selectedDate}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  }
);

const trendSlice = createSlice({
  name: "trend",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchCategoriesSalesTrends.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCategoriesSalesTrends.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
      // console.log("✅ Categories Sales Trends:", action.payload);
    });
    builder.addCase(fetchCategoriesSalesTrends.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchProductsSalesTrends.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProductsSalesTrends.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
      // console.log("✅ Products Sales Trends:", action.payload);
    });
    builder.addCase(fetchProductsSalesTrends.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchProductsRevenuesTrends.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProductsRevenuesTrends.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
      // console.log("✅ Products Revenues Trends:", action.payload);
    });
    builder.addCase(fetchProductsRevenuesTrends.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchCategoriesRevenuesTrends.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchCategoriesRevenuesTrends.fulfilled,
      (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = "";
        // console.log("✅ Categories Revenues Trends:", action.payload);
      }
    );
    builder.addCase(fetchCategoriesRevenuesTrends.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export default trendSlice.reducer;
