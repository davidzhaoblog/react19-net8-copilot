import { configureStore } from '@reduxjs/toolkit'

import { reducers } from './CombinedReducers'
import { errorLogApi } from '@/store/slices/errorLogApi'
import authApi from './slices/authApi'

import { loadUserState, saveUserState } from '@/utilities/userLocalStorage';

const preloadedState = {
    user: loadUserState(), // Load persisted user state
};

const store = configureStore({
    reducer: reducers,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(authApi.middleware)
    .concat(errorLogApi.middleware),
})

// Subscribe to store changes to persist the user state
store.subscribe(() => {
    saveUserState(store.getState().user);
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>;
export default store