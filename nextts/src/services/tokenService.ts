import universalCookies from './universalCookieService';

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
      // Store tokens in cookies
      universalCookies.set(this.accessTokenKey, accessToken, { 
        expires: new Date(expiryTime * 1000) 
      });
      
      universalCookies.set(this.refreshTokenKey, refreshToken, { 
        expires: 30 // 30 days 
      });
      
      // Store expiry in localStorage for easy access
      localStorage.setItem(this.tokenExpiryKey, expiryTime.toString());
    }
  }
  
  // Get access token
  getAccessToken(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    return universalCookies.get(this.accessTokenKey);
  }
  
  // Get refresh token
  getRefreshToken(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    return universalCookies.get(this.refreshTokenKey);
  }
  
  // Get token expiry
  getTokenExpiry(): number {
    if (typeof window === 'undefined') return 0;
    const expiry = universalCookies.get(this.tokenExpiryKey);
    return expiry ? parseInt(expiry, 10) : 0;
  }
  
  // Clear tokens
  clearTokens(): void {
    if (typeof window === 'undefined') return;
    universalCookies.remove(this.accessTokenKey);
    universalCookies.remove(this.refreshTokenKey);
    universalCookies.remove(this.tokenExpiryKey);
  }
  
  // Check if access token is expired or will expire soon (buffer time in seconds)
  isTokenExpired(bufferTime = 60): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    
    // Current time plus buffer
    const currentTime = Math.floor(Date.now() / 1000) + bufferTime;
    return currentTime >= expiry;
  }
    
  // Check if we're authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !this.isTokenExpired();
  }
}

const tokenService = new TokenService();
export default tokenService;