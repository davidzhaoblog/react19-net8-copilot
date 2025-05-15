'use client';

import { useState } from 'react';
import { get, post, put, patch, del } from '@/utils/fetchClient';
import { useAuth } from '@/contexts/AuthContext';

export function useAuthenticatedApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { isAuthenticated, refreshTokens } = useAuth();

  // Generic request handler with automatic authentication
  const handleRequest = async <T>(
    requestFn: () => Promise<{ data: T; response: Response }>
  ): Promise<T | null> => {
    if (!isAuthenticated) {
      setError(new Error('Not authenticated'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await requestFn();
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Wrapper functions for each HTTP method
  const authGet = <T>(url: string, options = {}) => {
    return handleRequest<T>(() => get<T>(url, options));
  };

  const authPost = <T>(url: string, data?: any, options = {}) => {
    return handleRequest<T>(() => post<T>(url, data, options));
  };

  const authPut = <T>(url: string, data?: any, options = {}) => {
    return handleRequest<T>(() => put<T>(url, data, options));
  };

  const authPatch = <T>(url: string, data?: any, options = {}) => {
    return handleRequest<T>(() => patch<T>(url, data, options));
  };

  const authDelete = <T>(url: string, options = {}) => {
    return handleRequest<T>(() => del<T>(url, options));
  };

  return {
    get: authGet,
    post: authPost,
    put: authPut,
    patch: authPatch,
    delete: authDelete,
    isLoading,
    error,
  };
}