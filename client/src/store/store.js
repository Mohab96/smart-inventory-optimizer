import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import positionReducer from "./features/positionSlice";
import revenueReducer from "./features/dashboardSlices/revenueSlice";
import expiryDateReducer from "./features/dashboardSlices/expiryDateSlice";
import lowStockReducer from "./features/dashboardSlices/lowStockSlice";
import salesReducer from "./features/dashboardSlices/salesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    position: positionReducer,
    revenue: revenueReducer,
    sales: salesReducer,
    expiryDate: expiryDateReducer,
    lowStock: lowStockReducer,
  },
});
