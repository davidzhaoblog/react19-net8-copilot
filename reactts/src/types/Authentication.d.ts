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