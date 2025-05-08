import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    userName: string | null;
    email: string | null;
    isAuthenticated: boolean;
    roles: string[];
}

const initialState: UserState = {
    userName: null,
    email: null,
    isAuthenticated: false,
    roles: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        whenUserLogin: (state, action: PayloadAction<{ userName: string; email: string; roles: string[] }>) => {
            state.userName = action.payload.userName;
            state.email = action.payload.email;
            state.isAuthenticated = true;
            state.roles = action.payload.roles;
        },
        whenUserLogout: (state) => {
            state.userName = null;
            state.email = null;
            state.isAuthenticated = false;
            state.roles = [];
        },
    },
});

export const { whenUserLogin, whenUserLogout } = userSlice.actions;
export default userSlice.reducer;