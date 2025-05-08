// https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-8.0

import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { TokenResponse as GoogleTokenResponse } from "@react-oauth/google";

import {
    ConfirmEmailRequest, ForgotPasswordRequest, LoginRequest, Manage2faResponse, Manage2faRequest,
    Manage2faResetRecoveryCodesRequest, Manage2faResetSharedKeyRequest, Manage2faForgetMachineRequest, ManageinfoPostRequest, ManageinfoResponse,
    RegisterErrorResponse, RegisterRequest, ResendConfirmationEmailRequest, ResetPasswordRequest,
    TokenResponse
}
from '@/types/MSIdentityFrameworkModels';
import { AxiosApiBase } from '@/shared/axiosApiClient/AxiosApiBase';
import { StorageKeys } from '@/types/StorageKeys';
import { authApiConfig } from '@/shared/axiosApiClient/apiConfig';

export class MSIdentityFrameworkApi extends AxiosApiBase {
    public constructor(conf: AxiosRequestConfig) {
        super(conf);

        this.interceptors?.request.use((param) => {
            //console.log(param);
            const token = localStorage.getItem(StorageKeys.Token);
            if (token) {
                return {
                    ...param,

                    headers: {
                        ...param.headers,
                        "Authorization": `Bearer ${token}`
                    },
                }
            }
            return {
                ...param,
                headers: {
                    ...param.headers,
                }
            }

        }, (error) => {
            // handling error
            // console.log(error);
            throw error;
        });

        // this middleware is been called right before the response is get it by the method that triggers the request
        // the original code was commented out below.
        // fixes from https://github.com/axios/axios/issues/1510.
        this.interceptors?.response.use((param) => ({
            ...param
        }), error => {
            // Something went wrong, figure out how to handle it here or in a `.catch` somewhere down the pipe
            // TODO: refresh token when expire every N minutes:
            // https://stackoverflow.com/questions/35900230/axios-interceptors-and-asynchronous-login
            //console.log(error);
            throw error;
        });

        // 1. Register Request and Response
        this.register = this.register.bind(this);
        // 2. Login Request and Response
        this.login = this.login.bind(this);
        // // 3. Refresh Request and Response
        // this.refresh = this.refresh.bind(this);
        // 4. ConfirmEmail Request and Response
        this.confirmEmail = this.confirmEmail.bind(this);
        // 5. ResendConfirmationEmail Request and Response
        this.resendConfirmationEmail = this.resendConfirmationEmail.bind(this);
        // 6. ForgotPassword Request and Response
        this.forgotPassword = this.forgotPassword.bind(this);
        // 7. ResetPassword Request and Response
        this.resetPassword = this.resetPassword.bind(this);
        // 8. Manage2fa Request and Response
        this.manage2fa = this.manage2fa.bind(this);
        this.manage2faResetRecoveryCodes = this.manage2faResetRecoveryCodes.bind(this);
        this.manage2faResetSharedKey = this.manage2faResetSharedKey.bind(this);
        this.manage2faForgetMachine = this.manage2faForgetMachine.bind(this);
        // 9. ManageinfoGet Request and Response
        this.manageinfoGet = this.manageinfoGet.bind(this);
        // 10. ManageinfoPost Request and Response
        this.manageinfoPost = this.manageinfoPost.bind(this);

        // 21. logout
        this.logout = this.logout.bind(this);
        // 22. getTempToken
        this.getTempToken = this.getTempToken.bind(this);
        // // 23. getUserInfo
        // this.getUserInfo = this.getUserInfo.bind(this);

        // 31. googleCallBac
        this.googleCallBack = this.googleCallBack.bind(this);
    }
    
    // 1. Register Request and Response
    public register = (params: RegisterRequest): Promise<RegisterErrorResponse> => {
        const url = "/register";
        return this.post<RegisterErrorResponse, RegisterRequest, AxiosResponse<RegisterErrorResponse>>(url, params)
            .then(res => {
                return this.success(res);
            });
    }

    // 2. Login Request and Response
    public login = (params: LoginRequest): Promise<TokenResponse> => {
        const url = "/login?useCookies=false&useSessionCookies=false";
        return this.post<TokenResponse, LoginRequest, AxiosResponse<TokenResponse>>(url, params)
            .then(res => {
                const { accessToken, refreshToken } = res.data;
                localStorage.setItem(StorageKeys.Token, accessToken);
                localStorage.setItem(StorageKeys.RefreshToken, refreshToken);
                return this.success(res);
            });
    }

    // this method moved to AxiosApiBase.ts
    // // 3. Refresh Request and Response
    // public refresh = (params: RefreshRequest): Promise<TokenResponse> => {
    //     const url = "/refresh";
    //     return this.post<TokenResponse, RefreshRequest, AxiosResponse<TokenResponse>>(url, params)
    //         .then(res => {
    //             return this.success(res);
    //         });
    // }

    // 4. ConfirmEmail Request and Response
    public confirmEmail = (params: ConfirmEmailRequest): Promise<any> => {
        const url = this.buildFullUrl("/confirmEmail", null, params, []);
        return this.get<any, AxiosResponse<any>>(url)
            .then(res => {
                return this.success(res);
            });
    }

    // 5. ResendConfirmationEmail Request and Response
    public resendConfirmationEmail = (params: ResendConfirmationEmailRequest): Promise<any> => {
        const url = "/resendConfirmationEmail";
        return this.post<any, ResendConfirmationEmailRequest, AxiosResponse<any>>(url, params)
            .then(res => {
                return this.success(res);
            });
    }

    // 6. ForgotPassword Request and Response
    public forgotPassword = (params: ForgotPasswordRequest): Promise<any> => {
        const url = "/forgotPassword";
        localStorage.setItem(StorageKeys.Token, '');
        localStorage.setItem(StorageKeys.RefreshToken, '');
        return this.post<any, ForgotPasswordRequest, AxiosResponse<any>>(url, params)
            .then(res => {
                return this.success(res);
            });
    }

    // 7. ResetPassword Request and Response
    public resetPassword = (params: ResetPasswordRequest): Promise<any> => {
        const url = "/resetPassword";
        return this.post<any, ResetPasswordRequest, AxiosResponse<any>>(url, params)
            .then(res => {
                return this.success(res);
            });
    }

    // 8. Manage2fa Request and Response
    // 8. Step.1. Manage2fa, empty RequestBody, Response as following:
    // {
    //     "sharedKey": "string",
    //     "recoveryCodesLeft": 0,
    //     "recoveryCodes": null,
    //     "isTwoFactorEnabled": false,
    //     "isMachineRemembered": false
    // }    
    // 8. Step.2. Manage2fa, Enable 2FA, RequestBody, Response as following:
    // {
    //     "sharedKey": "string",
    //     "recoveryCodesLeft": 10,
    //     "recoveryCodes": [
    //       "string",
    //       "string",
    //       "string",
    //       "string",
    //       "string",
    //       "string",
    //       "string",
    //       "string",
    //       "string",
    //       "string"
    //     ],
    //     "isTwoFactorEnabled": true,
    //     "isMachineRemembered": false
    //   }    
    // 8. Step.3. login 2fa
    // {
    //     "email": "string",
    //     "password": "string",
    //     "twoFactorCode": "string"
    // }
    public manage2fa = (params: Manage2faRequest): Promise<Manage2faResponse> => {
        const url = "/manage2fa";
        return this.post<Manage2faResponse, Manage2faRequest, AxiosResponse<Manage2faResponse>>(url, params)
            .then(res => {
                return this.success(res);
            });
    }

    // 8. Step.5. manage2fa, Reset the recovery codes
    public manage2faResetRecoveryCodes = (params: Manage2faResetRecoveryCodesRequest): Promise<string[]> => {
        const url = "/manage2fa";
        return this.post<string[], Manage2faResetRecoveryCodesRequest, AxiosResponse<string[]>>(url, params)
            .then(res => {
                return this.success(res);
            });
    }

    // 8. Step.6. manage2fa, Reset the recovery codes
    public manage2faResetSharedKey = (params: Manage2faResetSharedKeyRequest): Promise<any> => {
        const url = "/manage2fa";
        return this.post<any, Manage2faResetSharedKeyRequest, AxiosResponse<any>>(url, params)
            .then(res => {
                return this.success(res);
            });
    }

    // 8. Step.7. manage2fa, Forget the machine
    public manage2faForgetMachine = (params: Manage2faForgetMachineRequest): Promise<any> => {
        const url = "/manage2fa";
        return this.post<any, Manage2faForgetMachineRequest, AxiosResponse<any>>(url, params)
            .then(res => {
                return this.success(res);
            });
    }

    // 9. ManageinfoGet Request and Response
    public manageinfoGet = (): Promise<Manage2faResponse> => {
        const url = "/manageinfo";
        return this.get<Manage2faResponse, AxiosResponse<Manage2faResponse>>(url)
            .then(res => {
                return this.success(res);
            });
    }

    // 10. ManageinfoPost Request and Response
    public manageinfoPost = (params: ManageinfoPostRequest): Promise<ManageinfoResponse> => {
        const url = "/manageinfo";
        return this.post<ManageinfoResponse, ManageinfoPostRequest, AxiosResponse<ManageinfoResponse>>(url, params)
            .then(res => {
                return this.success(res);

            });
    }

    // 21. logout    
    public logout = (): Promise<TokenResponse> => {
        const url = "/logout";
        return this.post<TokenResponse, any, AxiosResponse<TokenResponse>>(url, null)
            .then(res => {
                const { accessToken, refreshToken } = res.data;
                localStorage.setItem(StorageKeys.Token, accessToken);
                localStorage.setItem(StorageKeys.RefreshToken, refreshToken);
                return this.success(res);
            })
            .finally(() => {
            });
    }

    // 22. getTempToken
    public getTempToken = (): Promise<TokenResponse> => {
        const url = "/GetTempToken";
        return this.post<TokenResponse, any, AxiosResponse<TokenResponse>>(url, null)
            .then(res => {
                const { accessToken, refreshToken } = res.data;
                localStorage.setItem(StorageKeys.Token, accessToken);
                localStorage.setItem(StorageKeys.RefreshToken, refreshToken);
                return this.success(res);
            });
    }

    // // 23. getUserInfo
    // public getUserInfo = (): Promise<UserInfo> => {
    //     const url = "/GetUserInfo";
    //     return this.get<UserInfo, AxiosResponse<UserInfo>>(url, null)
    //         .then(res => {
    //             return this.success(res);
    //         });
    // }

    // 31. googleCallBack
    public googleCallBack = (tokenResponse: GoogleTokenResponse): Promise<TokenResponse> => {
        const url = "/GoogleCallBack";
        return this.post<TokenResponse, GoogleTokenResponse, AxiosResponse<TokenResponse>>(url, tokenResponse)
            .then(res => {
                const { accessToken, refreshToken } = res.data;
                localStorage.setItem(StorageKeys.Token, accessToken);
                localStorage.setItem(StorageKeys.RefreshToken, refreshToken);
                return this.success(res);
            });
    }
}

// export interface UserInfo {
//     roles: string[];
//     person: IPersonDataModel;
//     notifications: INotificationDataModel[];
//     userData: {
//         partnerConsoleList: UIRouteLinkSetting[];
//         employeeConsoleList: UIRouteLinkSetting[];
//     },
// }

export const msIdentityFrameworkApi = new MSIdentityFrameworkApi(authApiConfig);
