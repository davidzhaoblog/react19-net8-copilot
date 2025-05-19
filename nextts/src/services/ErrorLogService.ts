// src/services/ErrorLogService.ts
import { ErrorLog, ErrorLogQuery, PagedResult } from '@/types';
import { get, post, put, del } from '@/utils/fetchClient';
import { ApiGet, ApiPost, ApiPut, ApiDelete } from '@/hooks/useAuthenticatedApi';

/**
 * Service for ErrorLog API interactions
 */
class ErrorLogService {
    private baseEndpoint = '/api/ErrorLog';
    private searchEndpoint = '/api/ErrorLog/Search';

    constructor(
        private getFn: ApiGet,
        private postFn: ApiPost,
        private putFn: ApiPut,
        private deleteFn: ApiDelete
    ) { }


    /**
     * Search error logs with filtering, sorting and pagination
     */
    async searchErrorLogs(query: ErrorLogQuery = {}, options: { skipAuth?: boolean, skipRefresh?: boolean } = {}): Promise<PagedResult<ErrorLog>> {
        // Set defaults
        const params: ErrorLogQuery = {
            pageSize: 20,
            pageIndex: 0,
            ...query
        };

        // Build query string
        const queryParams = new URLSearchParams();

        if (params.text) queryParams.append('text', params.text);
        if (params.errorTimeFrom) queryParams.append('errorTimeFrom', params.errorTimeFrom);
        if (params.errorTimeTo) queryParams.append('errorTimeTo', params.errorTimeTo);
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params.pageIndex) queryParams.append('pageIndex', params.pageIndex.toString());
        if (params.orderBy) queryParams.append('orderBy', params.orderBy);

        // Handle arrays
        if (params.errorSeverities && params.errorSeverities.length > 0) {
            params.errorSeverities.forEach(severity => {
                queryParams.append('errorSeverities', severity.toString());
            });
        }

        if (params.errorStates && params.errorStates.length > 0) {
            params.errorStates.forEach(state => {
                queryParams.append('errorStates', state.toString());
            });
        }
        const url = `${AUTH_API_BASE_URL}${this.searchEndpoint}?${queryParams.toString()}`;
        const result = await this.getFn<PagedResult<ErrorLog>>(url, { skipAuth: options.skipAuth, skipRefresh: options.skipRefresh });
        if (!result) {
            throw new Error('Failed to fetch error logs');
        }
        return result;
    }

  /**
   * Get a single error log by ID
   */
  async getErrorLog(id: number): Promise<ErrorLog> {
    const result = await this.getFn<ErrorLog>(`${this.baseEndpoint}/${id}`);
    if (!result) {
      throw new Error(`Failed to fetch error log with ID ${id}`);
    }
    return result;
  }

  /**
   * Create a new error log
   */
  async createErrorLog(errorLog: Omit<ErrorLog, 'errorLogId'>): Promise<ErrorLog> {
    const result = await this.postFn<ErrorLog>(this.baseEndpoint, errorLog);
    if (!result) {
      throw new Error('Failed to create error log');
    }
    return result;
  }

  /**
   * Update an existing error log
   */
  async updateErrorLog(id: number, errorLog: Partial<ErrorLog>): Promise<ErrorLog> {
    const result = await this.putFn<ErrorLog>(`${this.baseEndpoint}/${id}`, errorLog);
    if (!result) {
      throw new Error(`Failed to update error log with ID ${id}`);
    }
    return result;
  }

  /**
   * Delete an error log
   */
  async deleteErrorLog(id: number): Promise<void> {
    const result = await this.deleteFn<{}>(`${this.baseEndpoint}/${id}`);
    if (!result) {
      throw new Error(`Failed to delete error log with ID ${id}`);
    }
  }
}

// Create a singleton instance
// Default service for non-authenticated (general/server) use, using the standard fetch client
const createDefaultService = () => new ErrorLogService(
  async (url, options) => (await get(url, options)).data,
  async (url, data, options) => (await post(url, data, options)).data,
  async (url, data, options) => (await put(url, data, options)).data,
  async (url, options) => (await del(url, options)).data
);
const defaultService = createDefaultService();
export default defaultService;

// For server-side data fetching
export const getServerErrorLogs = (query: ErrorLogQuery = {}) => defaultService.searchErrorLogs(query, { skipAuth: true, skipRefresh: true });
export const getServerErrorLog = (id: number) => defaultService.getErrorLog(id);

// For authenticated client-side usage
import { useAuthenticatedApi } from '@/hooks/useAuthenticatedApi';
import { AUTH_API_BASE_URL } from '@/utils/constants';

export function useAuthenticatedErrorLogService() {
  const api = useAuthenticatedApi();
  
  return new ErrorLogService(
    api.get,
    api.post,
    api.put,
    api.delete
  );
}