import { StorageKeys } from "@/types/StorageKeys";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem(StorageKeys.Token),
    refreshToken: localStorage.getItem(StorageKeys.RefreshToken),
    usedToken: localStorage.getItem(StorageKeys.Token),
};

const tokenSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        authTokenChange: (state, action) => {
            localStorage.setItem(StorageKeys.Token, action.payload.accessToken);
            localStorage.setItem(StorageKeys.RefreshToken, action.payload.refreshToken);
            state.token = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.usedToken = action.payload.accessToken;
        },
        logoutUser: (state) => {
            localStorage.removeItem(StorageKeys.Token);
            localStorage.removeItem(StorageKeys.RefreshToken);
            state.token = null;
            state.refreshToken = null;
            state.usedToken = null;
        },
        adjustUsedToken: (state, action) => {
            state.usedToken = action.payload;
        },
    },
});

export const { authTokenChange, logoutUser, adjustUsedToken } = tokenSlice.actions;
export default tokenSlice.reducer;