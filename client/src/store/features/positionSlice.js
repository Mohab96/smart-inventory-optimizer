import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

export const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    setPosition: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setPosition } = positionSlice.actions;
export const selectPosition = (state) => state.position.value;
export default positionSlice.reducer;
