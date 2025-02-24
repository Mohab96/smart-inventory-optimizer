import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: localStorage.getItem("position") || null,
};

export const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    setPosition: (state, action) => {
      state.value = action.payload;
      localStorage.setItem("position", state.value);
    },
  },
});

export const { setPosition } = positionSlice.actions;
export const selectPosition = (state) => state.position.value;
export default positionSlice.reducer;
