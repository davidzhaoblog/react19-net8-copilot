import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query";
import { RootState } from "@/store/Store";
import { whenAuthTokenChange, whenLogoutUser, whenAdjustUsedToken } from "@/store/slices/tokenSlice";
import { StorageKeys } from "@/types/StorageKeys";
import { AUTH_API_BASE_URL } from "@/shared/constants";

// Define base query with authorization header
const baseQuery = fetchBaseQuery({
    baseUrl: AUTH_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const token = state.auth?.usedToken;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// Define base query with re-authentication logic
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const state = api.getState() as RootState;
        const refreshToken = state.auth?.refreshToken || localStorage.getItem(StorageKeys.RefreshToken);

        if (refreshToken) {
            api.dispatch(whenAdjustUsedToken(refreshToken));

            const refreshResult = await baseQuery(
                {
                    url: "/refresh",
                    method: "POST",
                    body: { refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                api.dispatch(
                    whenAuthTokenChange({
                        accessToken: (refreshResult.data as any).accessToken,
                        refreshToken,
                    })
                );
                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(whenLogoutUser());
            }
        } else {
            api.dispatch(whenLogoutUser());
        }
    }

    return result;
};

export default baseQueryWithReauth;