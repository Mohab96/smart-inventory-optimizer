import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import positionReducer from "./features/positionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    position: positionReducer,
  },
});
