export enum IdentityProviders
{
    This = "This",
    Google = "Google",
}
// 1. HttpPost: register Request and Response
export interface RegisterRequest {
    email: string,
    password: string
}

export interface RegisterErrorResponse {
    type: string;
    title: string;
    status: number;
    errors: any[];
}

// 2. HttpPost: login Request and Response
export interface LoginRequest {
    email: string;
    password: string;
    twoFactorCode?: string;
    twoFactorRecoveryCode?: string;
}

export interface TokenResponse {
    tokenType: string,
    accessToken: string,
    expiresIn: number,
    refreshToken: string
}

// 3. HttpPost: Refresh Request and Response is TokenResponse
export interface RefreshRequest {
    refreshToken: string;
}

// 4. HttpGet: ConfirmEmail Request and Response, when IdentityOptions.SignIn.RequireConfirmedEmail=true
// builder.Services.Configure<IdentityOptions>(options =>
//     {
//         options.SignIn.RequireConfirmedEmail = true;
//     });
export interface ConfirmEmailRequest {
    userId: string;
    code: string;
    changedEmail?: string;
}
// Returns the text "Thank you for confirming your email." in the response body.
// https://learn.microsoft.com/en-us/aspnet/core/security/authentication/accconfirm?view=aspnetcore-8.0&tabs=visual-studio

// 5. HttpPost: ResendConfirmationEmail Request and Response
export interface ResendConfirmationEmailRequest {
    email: string;
}

// 6. HttpPost: ForgotPassword Request and Response
export interface ForgotPasswordRequest {
    email: string;
}

// 7. HttpPost: ResetPassword Request and Response
export interface ResetPasswordRequest {
    email: string;
    resetCode: string;
    newPassword: string;
}

// 8. HttpPost: Manage2fa Request and Response
// 8. Step.1. Post empty Request JSON body {}
export interface Manage2faResponse {
    sharedKey: string;
    recoveryCodesLeft: number;
    recoveryCodes: string[] | null;
    isTwoFactorEnabled: boolean;
    isMachineRemembered: boolean;
}

// 8. Step.2. Post following Request JSON body {}
export interface Manage2faRequest {
    enable: boolean;
    twoFactorCode: string;
}

// 8. Step.3. login 2fa
// {
//     "email": "string",
//     "password": "string",
//     "twoFactorCode": "string"
// }

// 8. Step.4. login 2fa failed, can recover, using twoFactorRecoveryCode
// {
//     "email": "string",
//     "password": "string",
//     "twoFactorRecoveryCode": "string"
// }

// 8. Step.5. Reset the recovery codes
// {
//     "resetSharedKey": true
// }
export interface Manage2faResetRecoveryCodesRequest {
    resetRecoveryCodes: boolean;
}

// 8. Step.6. Reset the shared key
// {
//     "resetSharedKey": true
// }
export interface Manage2faResetSharedKeyRequest {
    resetSharedKey: boolean;
}

// 8. Step.7. Forget the machine
// {
//     "forgetMachine": true
// }
export interface Manage2faForgetMachineRequest {
    forgetMachine: boolean;
}

// 9. HttpGet: ManageinfoGet no Request params and Response
export interface ManageinfoResponse {
    email: string;
    isEmailConfirmed: boolean;
}

// 10. HttpPost: ManageinfoPost Request and Response
export interface ManageinfoPostRequest {
    newEmail: string;
    newPassword: string;
    oldPassword: string;
}
