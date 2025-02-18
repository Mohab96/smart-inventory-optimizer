import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import tokenReducer from "./features/tokenSlice";
import positionReducer from "./features/positionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    token: tokenReducer,
    position: positionReducer,
  },
});
