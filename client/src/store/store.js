import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import positionReducer from "./features/positionSlice";
import revenueReducer from "./features/dashboardSlices/revenueSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    position: positionReducer,
    revenue: revenueReducer,
  },
});
