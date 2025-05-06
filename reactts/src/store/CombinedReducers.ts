import { combineReducers } from "@reduxjs/toolkit";
// import { generatedCombineReducers, generatedCombinedReducers_BlackList } from "src/generated/store/GeneratedCombinedReducers";
// import { generatedSummaryCombinedReducers, generatedSummaryCombinedReducers_BlackList } from "src/generated/store/GeneratedSummaryCombinedReducers";

import app from "../slices/appSlice"
import auth from "../slices/msIdentityFrameworkSlice"
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
    // siteData: siteData,
    // userPreference: userPreference,

    // ...generatedSummaryCombinedReducers,
    // ...generatedCombineReducers
});

export type RootState = ReturnType<typeof reducers>

