import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import tokenReducer from "./features/tokenSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    token: tokenReducer,
  },
});
