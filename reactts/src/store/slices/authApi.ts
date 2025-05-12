import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { whenAuthTokenChange, whenLogoutUser } from './authSlice';
import { AUTH_API_BASE_URL } from '@/shared/constants';
import { RootState } from '@/store/Store';
import { whenUserLogin, whenUserLogout } from './userSlice';
import { TokenResponse } from '@/types/Authentication';

// Define the base query with token handling
const authBaseQuery = fetchBaseQuery({
    baseUrl: AUTH_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const state = (getState() as RootState);
        const token = state.auth?.usedToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const authBaseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await authBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const state = api.getState() as RootState;
        const refreshToken = state.auth?.refreshToken;

        if (refreshToken) {
            const refreshResult = await authBaseQuery(
                {
                    url: '/refresh',
                    method: 'POST',
                    body: { refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const { accessToken, refreshToken: newRefreshToken } = refreshResult.data as unknown as TokenResponse;
                api.dispatch(
                    whenAuthTokenChange({
                        accessToken: accessToken,
                        refreshToken: newRefreshToken,
                    })
                );
                result = await authBaseQuery(args, api, extraOptions);
            } else {
                api.dispatch(whenLogoutUser());
            }
        } else {
            api.dispatch(whenLogoutUser());
        }
    }

    return result;
};

// Create the API slice
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: authBaseQueryWithReauth,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(whenAuthTokenChange({
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                    }));
                    dispatch(whenUserLogin({
                        userName: data.email,
                        email: data.email,
                        roles: [],
                    }));
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(whenLogoutUser());
                    dispatch(whenUserLogout());
                } catch (error) {
                    console.error('Logout failed:', error);
               }
            },
        }),
        refresh: builder.mutation({
            query: (refreshToken) => ({
                url: '/refresh',
                method: 'POST',
                body: { refreshToken },
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(whenAuthTokenChange({
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                    }));
                } catch (error) {
                    console.error('Token refresh failed:', error);
                }
            },
        }),
        register: builder.mutation({
            query: (userDetails) => ({
                url: '/register',
                method: 'POST',
                body: userDetails,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: '/forgot-password',
                method: 'POST',
                body: { email },
            }),
        }),
        resetPassword: builder.mutation({
            query: (resetDetails) => ({
                url: '/reset-password',
                method: 'POST',
                body: resetDetails,
            }),
        }),
        confirmEmail: builder.mutation({
            query: (params) => ({
                url: '/confirm-email',
                method: 'POST',
                body: params,
            }),
        }),
        resendConfirmationEmail: builder.mutation({
            query: (params) => ({
                url: '/resend-confirmation-email',
                method: 'POST',
                body: params,
            }),
        }),
        manage2fa: builder.mutation({
            query: (params) => ({
                url: '/manage-2fa',
                method: 'POST',
                body: params,
            }),
        }),
        manage2faResetRecoveryCodes: builder.mutation({
            query: (params) => ({
                url: '/manage-2fa/reset-recovery-codes',
                method: 'POST',
                body: params,
            }),
        }),
        manage2faResetSharedKey: builder.mutation({
            query: (params) => ({
                url: '/manage-2fa/reset-shared-key',
                method: 'POST',
                body: params,
            }),
        }),
        manage2faForgetMachine: builder.mutation({
            query: (params) => ({
                url: '/manage-2fa/forget-machine',
                method: 'POST',
                body: params,
            }),
        }),
        manageinfoGet: builder.query({
            query: () => ({
                url: '/manage-info',
                method: 'GET',
            }),
        }),
        manageinfoPost: builder.mutation({
            query: (params) => ({
                url: '/manage-info',
                method: 'POST',
                body: params,
            }),
        }),
    }),
});

export const { 
    useLoginMutation, 
    useLogoutMutation, 
    useRefreshMutation, 
    useRegisterMutation, 
    useForgotPasswordMutation, 
    useResetPasswordMutation, 
    useConfirmEmailMutation, 
    useResendConfirmationEmailMutation, 
    useManage2faMutation, 
    useManage2faResetRecoveryCodesMutation, 
    useManage2faResetSharedKeyMutation, 
    useManage2faForgetMachineMutation, 
    useManageinfoGetQuery, 
    useManageinfoPostMutation 
} = authApi;

export default authApi;
export { authBaseQuery, authBaseQueryWithReauth };