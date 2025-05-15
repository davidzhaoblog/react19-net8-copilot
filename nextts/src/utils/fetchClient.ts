import tokenService from '@/services/tokenService';
import authService from '@/services/authService';

type RequestOptions = {
  headers?: HeadersInit;
  timeout?: number;
  baseUrl?: string;
  skipAuth?: boolean;
  skipRefresh?: boolean;
} & Omit<RequestInit, 'headers'>;

type FetchResponse<T> = {
  data: T;
  response: Response;
};

class HttpError extends Error {
  status: number;
  statusText: string;
  data: any;
  
  constructor(response: Response, data: any) {
    super(`HTTP Error: ${response.status} ${response.statusText}`);
    this.name = 'HttpError';
    this.status = response.status;
    this.statusText = response.statusText;
    this.data = data;
  }
}

const defaultOptions: RequestOptions = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
  skipAuth: false,
  skipRefresh: false,
};

/**
 * Enhanced fetch client with automatic token refresh
 */
export async function fetchClient<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<FetchResponse<T>> {
  // Merge options with defaults
  const mergedOptions: RequestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  const { baseUrl, timeout, skipAuth, skipRefresh, ...fetchOptions } = mergedOptions;
  
  // Check if token refresh is needed
  if (!skipAuth && !skipRefresh && tokenService.isTokenExpired()) {
    // Attempt to refresh the token
    const refreshed = await authService.refreshToken();
    if (!refreshed) {
      throw new Error('Authentication expired');
    }
  }
  
  // Add auth header if needed
  if (!skipAuth) {
    const token = tokenService.getAccessToken();
    if (token) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${token}`
      };
    }
  }
  
  // Prepend base URL if the URL is not absolute
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = timeout 
    ? setTimeout(() => controller.abort(), timeout) 
    : null;
  
  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      signal: controller.signal,
    });
    
    // Clear timeout
    if (timeoutId) clearTimeout(timeoutId);
    
    // Get response data - handle different content types
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else if (contentType?.includes('text/')) {
      data = await response.text();
    } else {
      data = await response.blob();
    }
    
    // Handle 401 Unauthorized - possibly expired token that needs refresh
    if (response.status === 401 && !skipRefresh && !skipAuth) {
      // Try to refresh token and retry the request (but only once)
      const refreshed = await authService.refreshToken();
      
      if (refreshed) {
        // Retry the request with the new token, but skip refresh to avoid loops
        return fetchClient<T>(url, { ...options, skipRefresh: true });
      }
    }
    
    // Handle error responses (non-2xx)
    if (!response.ok) {
      throw new HttpError(response, data);
    }
    
    return { data, response };
  } catch (error) {
    // Clear timeout
    if (timeoutId) clearTimeout(timeoutId);
    
    // Handle abort (timeout)
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    
    // Re-throw other errors
    throw error;
  }
}

// Convenience methods
export const get = <T = any>(url: string, options?: RequestOptions) => 
  fetchClient<T>(url, { ...options, method: 'GET' });

export const post = <T = any>(url: string, data?: any, options?: RequestOptions) => 
  fetchClient<T>(url, { ...options, method: 'POST', body: data ? JSON.stringify(data) : undefined });

export const put = <T = any>(url: string, data?: any, options?: RequestOptions) => 
  fetchClient<T>(url, { ...options, method: 'PUT', body: data ? JSON.stringify(data) : undefined });

export const patch = <T = any>(url: string, data?: any, options?: RequestOptions) => 
  fetchClient<T>(url, { ...options, method: 'PATCH', body: data ? JSON.stringify(data) : undefined });

export const del = <T = any>(url: string, options?: RequestOptions) => 
  fetchClient<T>(url, { ...options, method: 'DELETE' });