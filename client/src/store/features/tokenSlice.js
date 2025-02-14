import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null,
};

export const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { setToken } = tokenSlice.actions;
export const selectToken = (state) => state.token.value;
export default tokenSlice.reducer;