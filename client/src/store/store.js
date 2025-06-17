import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import positionReducer from "./features/positionSlice";
import revenueReducer from "./features/dashboardSlices/revenueSlice";
import expiryDateReducer from "./features/dashboardSlices/expiryDateSlice";
import lowStockReducer from "./features/dashboardSlices/lowStockSlice";
import salesReducer from "./features/dashboardSlices/salesSlice";
import transactionSlice from "./features/transactionSlices/transactionSlice";
import recommendationsSlice from "./features/recommendationSices/recommendationsSlice";
import trendsSlice from "./features/trendSlices/trendSlice";
import overviewReducer from "./features/dashboardSlices/overviewSlice";
import expiryProductsReducer from "./features/dashboardSlices/expiryProductsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    position: positionReducer,
    revenue: revenueReducer,
    sales: salesReducer,
    expiryDate: expiryDateReducer,
    expiryProducts: expiryProductsReducer,
    lowStock: lowStockReducer,
    transaction: transactionSlice,
    recommendation: recommendationsSlice,
    trend: trendsSlice,
    overview: overviewReducer,
  },
});
