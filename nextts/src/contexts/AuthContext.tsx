'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '@/services/authService';
import tokenService from '@/services/tokenService';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  name?: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshTokens: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Parse user from token
  // This function decodes the JWT token and extracts user information
  // such as id, email, name, and roles.
  // In case of an error during decoding, it returns null.
  // When return null, should call another webapi to get user info.
  const parseUserFromToken = (token: string | null): User | null => {
    if (!token) return null;
    
    try {
      const decoded = jwtDecode<any>(token);

      return {
        id: decoded.sub || decoded.nameid,
        email: decoded.email,
        name: decoded.name,
        roles: decoded.role ? (Array.isArray(decoded.role) ? decoded.role : [decoded.role]) : []
      };
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  // Initialize auth state from stored tokens
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      const token = tokenService.getAccessToken();
      
      if (token) {
        // Check if token is expired and needs refresh
        if (tokenService.isTokenExpired()) {
          // Try to refresh the token
          const refreshed = await authService.refreshToken();
          
          if (refreshed) {
            // If refresh successful, get the new token
            const newToken = tokenService.getAccessToken();
            const userData = parseUserFromToken(newToken);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // If refresh failed, clear auth state
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // If token valid, set user from token
          const userData = parseUserFromToken(token);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } else {
        // No token found
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  // Login function with rememberMe parameter
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    const result = await authService.login(email, password, rememberMe);
    
    if (result.success) {
      const token = tokenService.getAccessToken();
      const userData = parseUserFromToken(token);
      setUser(userData);
      setIsAuthenticated(true);
    }
    
    return result;
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Refresh tokens function
  const refreshTokens = async (): Promise<boolean> => {
    const result = await authService.refreshToken();
    
    if (result) {
      const token = tokenService.getAccessToken();
      const userData = parseUserFromToken(token);
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}