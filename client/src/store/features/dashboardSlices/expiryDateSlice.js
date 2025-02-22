import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  data: [],
  error: "",
};

export const fetchExpiryDate = createAsyncThunk(
  "expiryDate/fetchExpiryDate",
  async ({ page = 1, limit = 10, orderBy = "asc" }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token is missing!");
    }

    return axios
      .get(
        `${import.meta.env.VITE_BASE_URL}/api/statistics/products-expiringsoon?page=${page}&limit=${limit}&orderBy=${orderBy}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => res.data);
  }
);

const expiryDateSlice = createSlice({
  name: "expiryDate",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchExpiryDate.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchExpiryDate.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(fetchExpiryDate.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export default expiryDateSlice.reducer;
