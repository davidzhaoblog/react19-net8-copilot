import { combineReducers } from "@reduxjs/toolkit";
// import { generatedCombineReducers, generatedCombinedReducers_BlackList } from "src/generated/store/GeneratedCombinedReducers";
// import { generatedSummaryCombinedReducers, generatedSummaryCombinedReducers_BlackList } from "src/generated/store/GeneratedSummaryCombinedReducers";

import app from "@/store/slices/appSlice"
import { authApi } from './slices/authApi';
import auth from './slices/authSlice';
import userReducer from './slices/userSlice';

import { errorLogApi } from "@/store/slices/errorLogApi";

// import siteData from 'src/slices/siteDataSlice'
// import userPreference from "src/slices/userPreferenceDataSlice"

export const blacklist = [
    "app",
    // ...generatedSummaryCombinedReducers_BlackList,
    // ...generatedCombinedReducers_BlackList,
];

export const reducers = combineReducers({
    app: app,
    auth: auth,
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [errorLogApi.reducerPath]: errorLogApi.reducer,
    // siteData: siteData,
    // userPreference: userPreference,

    // ...generatedSummaryCombinedReducers,
    // ...generatedCombineReducers
});

export type RootState = ReturnType<typeof reducers>

