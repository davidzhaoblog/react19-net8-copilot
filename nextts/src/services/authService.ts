import { AUTH_API_BASE_URL } from '@/utils/constants';
import tokenService from './tokenService';

// Track refresh promise to prevent multiple simultaneous refresh requests
let refreshPromise: Promise<boolean> | null = null;

// Define interfaces for request/response types
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
}

interface UserResponse {
  id: string;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ConfirmEmailRequest {
  userId: string;
  token: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserResponse;
}

class AuthService {
  private apiUrl = AUTH_API_BASE_URL;
  
  // Helper method for API calls with error handling
  private async apiCall<T>(
    endpoint: string, 
    method: string, 
    data?: any, 
    requiresAuth: boolean = false
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add auth token if required
      if (requiresAuth) {
        const token = tokenService.getAccessToken();
        if (!token) {
          return {
            success: false,
            error: 'Not authenticated'
          };
        }
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      const responseData = response.status !== 204 
        ? await response.json() 
        : null;

      if (!response.ok) {
        return { 
          success: false, 
          error: responseData?.message || responseData?.title || `Request failed with status ${response.status}`
        };
      }

      return { 
        success: true, 
        data: responseData
      };
    } catch (error) {
      console.error(`API call error (${endpoint}):`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network or server error occurred'
      };
    }
  }

  // Login with ASP.NET Identity
  async login(email: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; error?: string }> {
    const result = await this.apiCall<TokenResponse>('/login?useCookies=false', 'POST', {
      email,
      password,
      rememberMe
    });

    if (result.success && result.data) {
      // Store tokens
      tokenService.setTokens(
        result.data.accessToken, 
        result.data.refreshToken, 
        result.data.expiresIn
      );
    }
    
    return {
      success: result.success,
      error: result.error
    };
  }
  
  // Register a new user
  async register(registerData: RegisterRequest): Promise<{ success: boolean; error?: string }> {
    return await this.apiCall('/register', 'POST', registerData);
  }
  
  // Get current user profile
  async getUserProfile(): Promise<{ success: boolean; data?: UserResponse; error?: string }> {
    // Check if token needs refresh
    if (tokenService.isTokenExpired()) {
      const refreshed = await this.refreshToken();
      if (!refreshed) {
        return {
          success: false,
          error: 'Authentication expired'
        };
      }
    }
    
    return await this.apiCall<UserResponse>('/GetUserProfile', 'GET', undefined, true);
  }

  // Change password
  async changePassword(data: ChangePasswordRequest): Promise<{ success: boolean; error?: string }> {
    return await this.apiCall('/change-password', 'POST', data, true);
  }

  // Request password reset email
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ success: boolean; error?: string }> {
    return await this.apiCall('/forgot-password', 'POST', data);
  }

  // Reset password with token
  async resetPassword(data: ResetPasswordRequest): Promise<{ success: boolean; error?: string }> {
    return await this.apiCall('/reset-password', 'POST', data);
  }

  // Confirm email address
  async confirmEmail(userId: string, token: string): Promise<{ success: boolean; error?: string }> {
    return await this.apiCall('/confirm-email', 'POST', { userId, token });
  }

  // Request new email confirmation
  async resendEmailConfirmation(email: string): Promise<{ success: boolean; error?: string }> {
    return await this.apiCall('/resend-email-confirmation', 'POST', { email });
  }

  // Logout from server (optional - revokes tokens on server)
  async logoutFromServer(): Promise<{ success: boolean; error?: string }> {
    const refreshToken = tokenService.getRefreshToken();
    const result = await this.apiCall('/logout', 'POST', { refreshToken }, true);
    
    // Clear tokens regardless of server response
    tokenService.clearTokens();
    
    return result;
  }
  
  // Local logout (client-side only)
  logout(): void {
    tokenService.clearTokens();
  }
  
  // Refresh token
  async refreshToken(): Promise<boolean> {
    // If refresh already in progress, return the existing promise
    if (refreshPromise) {
      return refreshPromise;
    }
    
    // Get current refresh token
    const refreshToken = tokenService.getRefreshToken();
    
    if (!refreshToken) {
      console.error('No refresh token available');
      return false;
    }
    
    // Create and store the refresh promise
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.apiUrl}/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to refresh token');
        }
        
        const data = await response.json();
        
        // Store new tokens
        tokenService.setTokens(
          data.accessToken, 
          data.refreshToken || refreshToken, // Use new refresh token if provided, otherwise keep existing
          data.expiresIn
        );
        
        return true;
      } catch (error) {
        console.error('Token refresh failed:', error);
        // Clear tokens on refresh failure
        tokenService.clearTokens();
        // Redirect to login or handle as needed
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return false;
      } finally {
        // Clear the promise reference
        refreshPromise = null;
      }
    })();
    
    return refreshPromise;
  }

  // Check if user is in role
  async isInRole(role: string): Promise<boolean> {
    const profile = await this.getUserProfile();
    if (!profile.success || !profile.data) return false;
    
    return profile.data.roles.includes(role);
  }

  // Check if email is available (not already registered)
  async checkEmailAvailable(email: string): Promise<{ available: boolean; error?: string }> {
    const result = await this.apiCall<{ available: boolean }>('/check-email', 'POST', { email });
    return {
      available: result.success && result.data?.available === true,
      error: result.error
    };
  }

  // Get available roles (admin only)
  async getRoles(): Promise<{ success: boolean; data?: string[]; error?: string }> {
    return await this.apiCall<string[]>('/roles', 'GET', undefined, true);
  }

  // Check if user is authenticated (token exists and is valid)
  isAuthenticated(): boolean {
    return tokenService.getAccessToken() !== null && !tokenService.isTokenExpired();
  }
}

const authService = new AuthService();
export default authService;