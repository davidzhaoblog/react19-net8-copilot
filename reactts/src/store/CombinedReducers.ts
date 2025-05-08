import { combineReducers } from "@reduxjs/toolkit";
// import { generatedCombineReducers, generatedCombinedReducers_BlackList } from "src/generated/store/GeneratedCombinedReducers";
// import { generatedSummaryCombinedReducers, generatedSummaryCombinedReducers_BlackList } from "src/generated/store/GeneratedSummaryCombinedReducers";

import app from "@/store/slices/appSlice"
import auth from "@/store/slices/msIdentityFrameworkSlice"
import { errorLogApi } from "@/apiClients/errorLogApi";
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
    [errorLogApi.reducerPath]: errorLogApi.reducer,
    // siteData: siteData,
    // userPreference: userPreference,

    // ...generatedSummaryCombinedReducers,
    // ...generatedCombineReducers
});

export type RootState = ReturnType<typeof reducers>

