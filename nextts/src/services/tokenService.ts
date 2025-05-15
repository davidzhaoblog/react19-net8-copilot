interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: number; // Unix timestamp in seconds
}

class TokenService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private tokenExpiryKey = 'token_expiry';
  
  // Store tokens - using memory + secure HTTP-only cookie for refresh token is recommended
  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    const expiryTime = Math.floor(Date.now() / 1000) + expiresIn;
    
    // Store tokens and expiry
    if (typeof window !== 'undefined') {
      // For client-side only
      sessionStorage.setItem(this.accessTokenKey, accessToken);
      // For better security, the refresh token should be stored in an HTTP-only cookie
      // Here we're using sessionStorage for simplicity
      sessionStorage.setItem(this.refreshTokenKey, refreshToken);
      sessionStorage.setItem(this.tokenExpiryKey, expiryTime.toString());
    }
  }
  
  // Get access token
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(this.accessTokenKey);
  }
  
  // Get refresh token
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(this.refreshTokenKey);
  }
  
  // Get token expiry
  getTokenExpiry(): number {
    if (typeof window === 'undefined') return 0;
    const expiry = sessionStorage.getItem(this.tokenExpiryKey);
    return expiry ? parseInt(expiry, 10) : 0;
  }
  
  // Clear tokens
  clearTokens(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(this.accessTokenKey);
    sessionStorage.removeItem(this.refreshTokenKey);
    sessionStorage.removeItem(this.tokenExpiryKey);
  }
  
  // Check if access token is expired or will expire soon (buffer time in seconds)
  isTokenExpired(bufferTime = 60): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    
    // Current time plus buffer
    const currentTime = Math.floor(Date.now() / 1000) + bufferTime;
    return currentTime >= expiry;
  }
}

const tokenService = new TokenService();
export default tokenService;