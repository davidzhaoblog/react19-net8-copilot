// https://stackoverflow.com/questions/62020623/createasyncthunk-and-writing-reducer-login-with-redux-toolkit
// https://stackoverflow.com/questions/64287428/call-reducer-from-a-different-slice-redux-toolkit

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { TokenResponse as GoogleTokenResponse } from "@react-oauth/google";

// import { UIRouteLinkSetting } from "@/types/UIRouteLinkSetting";


import { msIdentityFrameworkApi } from "@/apiClients/MSIdentityFrameworkApi";
import { LoginRequest, Manage2faForgetMachineRequest, Manage2faRequest, Manage2faResetRecoveryCodesRequest, Manage2faResetSharedKeyRequest, ManageinfoPostRequest } from "@/types/MSIdentityFrameworkModels";

//import { getPersonAvatar, getPersonTitle, IPersonDataModel } from 'dataModels/IPersonDataModel';
// import { AspNetRolesOptions, SubscriberTypeOptions } from "dataModels/Enums";
import { ApiErrorMessage } from "@/types/ApiClient";
// import { setOpenImportantNotificationDialog } from "./appSlice";

export interface AuthState {
    isLoggingIn: boolean;
    isLoggingOut: boolean;
    isVerifying: boolean;
    loginError: boolean;
    logoutError: boolean;
    isAuthenticated: boolean;
    logInDateTime: string;
    expiringAt: string;
    email: string;
    // identityProvider: IdentityProviders;
    // subscriberTypeID: SubscriberTypeOptions;
    // subscriberPlanID?: number;
    roles: string[];
    // person: IPersonDataModel;
    // newConsumerSubscriberPlanID?: number;
    // consumerConsole: UIRouteLinkSetting;
    // hasConsumerConsole: boolean;
    // employeeConsoleList: UIRouteLinkSetting[];
    // hasEmployeeConsole: boolean;
    // newPartnerSubscriberPlanID?: number;
    // partnerConsoleList: UIRouteLinkSetting[];
    // hasPartnerConsole: boolean;
    // personConsole: UIRouteLinkSetting;
    // hasPersonConsole: boolean;
    apiErrorMessage: ApiErrorMessage;
}

const initialState = {
    isLoggingIn: false,
    isLoggingOut: false,
    isVerifying: false,
    loginError: false,
    logoutError: false,
    isAuthenticated: false,
    logInDateTime: "",
    expiringAt: "",
    email: "",
    // identityProvider: IdentityProviders.This,
    // subscriberTypeID: SubscriberTypeOptions.Consumer,
    // subscriberPlanID: -1,
    roles: [],
    // person: null,
    newConsumerSubscriberPlanID: null,
    consumerConsole: null,
    hasConsumerConsole: false,
    employeeConsoleList: [],
    hasEmployeeConsole: false,
    newPartnerSubscriberPlanID: null,
    partnerConsoleList: [],
    hasPartnerConsole: false,
    personConsole: null,
    hasPersonConsole: false,
    apiErrorMessage: null,
} as unknown as AuthState;

// // 1. register Request and Response
// export const register = createAsyncThunk(
//     'register',
//     async (params: RegisterRequest, { dispatch, rejectWithValue }) => {
//         dispatch(reset());
//         try {
//             const response = await msIdentityFrameworkApi.register(params);
//             return response;
//         } catch (err: any) {
//             // setError(err.response.data as unknown as ApiErrorMessage);
//             return rejectWithValue(err.response.data);
//         }
//     }
// )

// 2. login Request and Response
export const login = createAsyncThunk(
    'login',
    async (params: LoginRequest, { dispatch }) => {
        dispatch(reset());
        const response = await msIdentityFrameworkApi.login(params);
        // if(response === null) {
        //     return null;
        // } 
        // const userInfo =  await msIdentityFrameworkApi.getUserInfo();
        // dispatch(getUserInfo());

        return { loginRequest: params, tokenResult: response };
    }
)

// // 3. refresh Request and Response
// export const refresh = createAsyncThunk(
//     'refresh',
//     async (params: RefreshRequest, { dispatch }) => {
//         const response = await msIdentityFrameworkApi.refresh(params);
//         return { ...response };
//     }
// )

// // 4. confirmEmail Request and Response
// export const confirmEmail = createAsyncThunk(
//     'confirmEmail',
//     async (params: ConfirmEmailRequest, { dispatch }) => {
//         const response = await msIdentityFrameworkApi.confirmEmail(params);
//         return { ...response };
//     }
// )

// // 5. resendConfirmationEmail Request and Response
// export const resendConfirmationEmail = createAsyncThunk(
//     'resendConfirmationEmail',
//     async (params: ResendConfirmationEmailRequest, { dispatch }) => {
//         const response = await msIdentityFrameworkApi.resendConfirmationEmail(params);
//         return { ...response };
//     }
// )

// // 6. forgotPassword Request and Response
// export const forgotPassword = createAsyncThunk(
//     'forgotPassword',
//     async (params: ForgotPasswordRequest, { dispatch }) => {
//         const response = await msIdentityFrameworkApi.forgotPassword(params);
//         return { ...response };
//     }
// )

// // 7. resetPassword Request and Response
// export const resetPassword = createAsyncThunk(
//     'resetPassword',
//     async (params: ResetPasswordRequest, { dispatch }) => {
//         const response = await msIdentityFrameworkApi.resetPassword(params);
//         return { ...response };
//     }
// )

// 8. manage2fa Request and Response
export const manage2fa = createAsyncThunk(
    'manage2fa',
    async (params: Manage2faRequest, { dispatch }) => {
        const response = await msIdentityFrameworkApi.manage2fa(params);
        return { ...response };
    }
)
export const manage2faResetRecoveryCodes = createAsyncThunk(
    'manage2fa',
    async (params: Manage2faResetRecoveryCodesRequest, { dispatch }) => {
        const response = await msIdentityFrameworkApi.manage2faResetRecoveryCodes(params);
        return { ...response };
    }
)
export const manage2faResetSharedKey = createAsyncThunk(
    'manage2fa',
    async (params: Manage2faResetSharedKeyRequest, { dispatch }) => {
        const response = await msIdentityFrameworkApi.manage2faResetSharedKey(params);
        return { ...response };
    }
)
export const manage2faForgetMachine = createAsyncThunk(
    'manage2fa',
    async (params: Manage2faForgetMachineRequest, { dispatch }) => {
        const response = await msIdentityFrameworkApi.manage2faForgetMachine(params);
        return { ...response };
    }
)

// 9. manageinfoGet Request and Response
export const manageinfoGet = createAsyncThunk(
    'manageinfoGet',
    async (params: any, { dispatch }) => {
        const response = await msIdentityFrameworkApi.manageinfoGet();
        return { ...response };
    }
)

// 10. manageinfoPost Request and Response
export const manageinfoPost = createAsyncThunk(
    'manageinfoPost',
    async (params: ManageinfoPostRequest, { dispatch }) => {
        const response = await msIdentityFrameworkApi.manageinfoPost(params);
        return { ...response };
    }
)

// 21. logout
export const logout = createAsyncThunk(
    'logout',
    async (_: void, { dispatch }) => {
        reset();
        const response = await msIdentityFrameworkApi.logout();

        return response;
    }
)

// 22. getTempToken
export const getTempToken = createAsyncThunk(
    'getTempToken',
    async (_: void, { dispatch }) => {
        const response = await msIdentityFrameworkApi.getTempToken();

        return response;
    }
)

// // 23. getUserInfo
// export const getUserInfo = createAsyncThunk(
//     'getUserInfo',
//     async (_: void, { dispatch }) => {
//         const response = await msIdentityFrameworkApi.getUserInfo();
//         dispatch(setOpenImportantNotificationDialog(true));
//         // const userInfo =  await msIdentityFrameworkApi.getUserInfo();
//         //console.log(response);
//         return response;
//     }
// )

// 31. googleCallBack
export const googleCallBack = createAsyncThunk(
    'googleCallBack',
    async (tokenResponse: GoogleTokenResponse, { dispatch }) => {
        const response = await msIdentityFrameworkApi.googleCallBack(tokenResponse);
        // dispatch(getUserInfo());
        return { tokenResult: response };
    }
)

const msIdentityFrameworkSlice = createSlice({
    name: "msIdentityFrameworkSlice",
    initialState: { ...initialState },
    reducers: {
        /* any other state updates here */
        setEmail(state, action: PayloadAction<string>) {
            state.email = action.payload;
        },
        // setNewSubscriberPlanID(state, action: PayloadAction<{ type: SubscriberTypeOptions, id: number }>) {
        //     console.log(action.payload);
        //     const { type, id } = action.payload;
        //     if (type === SubscriberTypeOptions.Consumer) {
        //         state.newConsumerSubscriberPlanID = id;
        //     }
        //     else if (type === SubscriberTypeOptions.Partner) {
        //         state.newPartnerSubscriberPlanID = id;
        //     }
        // },
        setIsAuthenticated(state, action: PayloadAction<boolean>) {
            state.isAuthenticated = action.payload;
            state.isLoggingIn = false;
        },
        reset: () => initialState,
    },
    extraReducers: builder => {
        // // 1. register
        // builder.addCase(register.pending, (state) => {
        //     state.isLoggingIn = true;
        //     // console.log("register.pending");
        // });
        // builder.addCase(register.fulfilled, (state, { payload }) => {
        //     state.isLoggingIn = false;
        //     state.isAuthenticated = false;
        //     // console.log("register.fulfilled");
        // });
        // builder.addCase(register.rejected, (state, action) => {
        //     state.isLoggingIn = false;
        //     state.loginError = true;
        //     state.apiErrorMessage = action.payload;
        //     // console.log("register.rejected");
        // });

        // 2. login
        builder.addCase(login.pending, (state) => {
            state.isLoggingIn = true;
            // console.log("login.pending");
        });
        builder.addCase(login.fulfilled, (state, { payload }) => {
            state.isLoggingIn = false;
            state.isAuthenticated = true;
            state.logInDateTime = dayjs().toString();
            state.expiringAt = (dayjs().add(payload.tokenResult.expiresIn ?? 7, "days")).toString();
            state.email = payload.loginRequest.email;
            // state.identityProvider = IdentityProviders.This;
            // console.log("login.fulfilled");
        });
        builder.addCase(login.rejected, (state, action) => {
            state.isLoggingIn = false;
            state.loginError = true;
            // console.log("login.rejected");
        });

        // // 3. refresh
        // builder.addCase(refresh.pending, (state) => {
        //     // state = { ...initialState };
        //     // console.log("refresh.pending");
        // });
        // builder.addCase(refresh.fulfilled, (state, { payload }) => {
        //     // console.log("refresh.fulfilled");
        // });
        // builder.addCase(refresh.rejected, (state, action) => {
        //     // console.log("refresh.rejected");
        // });

        // // 4. confirmEmail
        // builder.addCase(confirmEmail.pending, (state) => {
        //     // state = { ...initialState };
        //     // console.log("confirmEmail.pending");
        // });
        // builder.addCase(confirmEmail.fulfilled, (state, { payload }) => {
        //     // console.log("confirmEmail.fulfilled");
        // });
        // builder.addCase(confirmEmail.rejected, (state, action) => {
        //     // console.log("confirmEmail.rejected");
        // });

        // // 5. resendConfirmationEmail
        // builder.addCase(resendConfirmationEmail.pending, (state) => {
        //     // state = { ...initialState };
        //     // console.log("resendConfirmationEmail.pending");
        // });
        // builder.addCase(
        //     resendConfirmationEmail.fulfilled,
        //     (state, { payload }) => {
        //         // console.log("resendConfirmationEmail.fulfilled");
        //     }
        // );
        // builder.addCase(resendConfirmationEmail.rejected, (state, action) => {
        //     // console.log("resendConfirmationEmail.rejected");
        // });

        // // 6. forgotPassword
        // builder.addCase(forgotPassword.pending, (state) => {
        //     // state = { ...initialState };
        //     // console.log("forgotPassword.pending");
        // });
        // builder.addCase(forgotPassword.fulfilled, (state, { payload }) => {
        //     // console.log("forgotPassword.fulfilled");
        // });
        // builder.addCase(forgotPassword.rejected, (state, action) => {
        //     // console.log("forgotPassword.rejected");
        // });

        // // 7. resetPassword
        // builder.addCase(resetPassword.pending, (state) => {
        //     // state = { ...initialState };
        //     // console.log("resetPassword.pending");
        // });
        // builder.addCase(resetPassword.fulfilled, (state, { payload }) => {
        //     // console.log("resetPassword.fulfilled");
        // });
        // builder.addCase(resetPassword.rejected, (state, action) => {
        //     // console.log("resetPassword.rejected");
        // });

        // 8. manage2fa
        builder.addCase(manage2fa.pending, (state) => {
            // state = { ...initialState };
            // console.log("manage2fa.pending");
        });
        builder.addCase(manage2fa.fulfilled, (state, { payload }) => {
            // console.log("manage2fa.fulfilled");
        });
        builder.addCase(manage2fa.rejected, (state, action) => {
            // console.log("manage2fa.rejected");
        });

        // 9. manageinfoGet
        builder.addCase(manageinfoGet.pending, (state) => {
            // state = { ...initialState };
            // console.log("manageinfoGet.pending");
        });
        builder.addCase(manageinfoGet.fulfilled, (state, { payload }) => {
            // console.log("manageinfoGet.fulfilled");
        });
        builder.addCase(manageinfoGet.rejected, (state, action) => {
            // console.log("manageinfoGet.rejected");
        });

        // 10. manageinfoPost
        builder.addCase(manageinfoPost.pending, (state) => {
            // state = { ...initialState };
            // console.log("manageinfoPost.pending");
        });
        builder.addCase(manageinfoPost.fulfilled, (state, { payload }) => {
            // console.log("manageinfoPost.fulfilled");
        });
        builder.addCase(manageinfoPost.rejected, (state, action) => {
            // console.log("manageinfoPost.rejected");
        });

        // 21. logout
        builder.addCase(logout.pending, (state) => {
            state.isLoggingOut = true;
            // console.log("logout.pending");
        });
        builder.addCase(logout.fulfilled, (state, { payload }) => {
            // state = { ...initialState };
            state.isLoggingOut = false;
            state.isAuthenticated = false;
            state.isLoggingIn = false;
            state.isLoggingOut = false;
            state.isVerifying = false;
            state.loginError = false;
            state.logoutError = false;
            state.isAuthenticated = false;
            state.logInDateTime = "";
            state.expiringAt = "";
            state.email = "";
            // state.identityProvider = IdentityProviders.This;
            // subscriberTypeID = SubscriberTypeOptions.Consumer;
            // subscriberPlanID = -1;
            state.roles = [];
            // console.log("logout.fulfilled");
        });
        builder.addCase(logout.rejected, (state, action) => {
            state.isLoggingOut = false;
            // console.log("logout.rejected");
        });

        // 22. getTempToken
        builder.addCase(getTempToken.pending, (state) => {
            // console.log("getTempToken.pending");
        });
        builder.addCase(getTempToken.fulfilled, (state, { payload }) => {
            // state = { ...initialState };
            // console.log("getTempToken.fulfilled");
        });
        builder.addCase(getTempToken.rejected, (state, action) => {
            // console.log("getTempToken.rejected");
        });

        // // 23. getUserInfo
        // builder.addCase(getUserInfo.pending, (state) => {
        //     // console.log("getUserInfo.pending");
        // });
        // builder.addCase(getUserInfo.fulfilled, (state, { payload }) => {
        //     if (payload === null)
        //         return;
        //     const { roles, person, userData } = payload;
        //     state.roles = roles;
        //     if (person === null || userData === null)
        //         return;
        //     state.person = person;
            
        //     state.consumerConsole = { name: getPersonTitle(person), avatarUrl: person.avatarUrl, avatarText: getPersonAvatar(person), uniqueName: person.uniqueName };
        //     state.hasConsumerConsole = !!roles && roles.some(o1 => [AspNetRolesOptions.Consumer].some(o2 => o1 === o2));
        //     state.employeeConsoleList = userData?.employeeConsoleList;
        //     state.hasEmployeeConsole = !!roles && roles.some(o1 => [AspNetRolesOptions.Employee].some(o2 => o1 === o2)) && !!userData?.employeeConsoleList && userData?.employeeConsoleList.length > 0;
        //     state.partnerConsoleList = userData?.partnerConsoleList;
        //     state.hasPartnerConsole = !!roles && roles.some(o1 => [AspNetRolesOptions.Owner].some(o2 => o1 === o2)) && !!userData?.partnerConsoleList && userData?.partnerConsoleList.length > 0;
        //     state.personConsole = { name: getPersonTitle(person), avatarUrl: person.avatarUrl, avatarText: getPersonAvatar(person), uniqueName: person.uniqueName };
        //     state.hasPersonConsole = !!roles && roles.some(o1 => [AspNetRolesOptions.Owner, AspNetRolesOptions.Employee, AspNetRolesOptions.Consumer].some(o2 => o1 === o2));
        //     // console.log("getUserInfo.fulfilled");
        // });
        // builder.addCase(getUserInfo.rejected, (state, action) => {
        //     // console.log("getUserInfo.rejected");
        // });

        // 31. googleCallBack
        builder.addCase(googleCallBack.pending, (state) => {
            state.isLoggingIn = true;
            // console.log("googleCallBack.pending");
        });
        builder.addCase(googleCallBack.fulfilled, (state, { payload }) => {
            state.isLoggingIn = false;
            state.isAuthenticated = true;
            state.logInDateTime = dayjs().toString();
            state.expiringAt = (dayjs().add(payload.tokenResult.expiresIn ?? 7, "days")).toString();
            // state.identityProvider = IdentityProviders.Google;
            // state.email = payload.loginRequest.email;
            // console.log("googleCallBack.fulfilled");
        });
        builder.addCase(googleCallBack.rejected, (state, action) => {
            state.isLoggingIn = false;
            state.loginError = true;
            // console.log("googleCallBack.rejected");
        });
    }
});

// export const { setIsAuthenticated, reset, setEmail, setNewSubscriberPlanID } = msIdentityFrameworkSlice.actions;
export const { setIsAuthenticated, reset, setEmail } = msIdentityFrameworkSlice.actions;
export default msIdentityFrameworkSlice.reducer;
