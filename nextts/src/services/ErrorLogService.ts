import { compare, Operation } from 'fast-json-patch';
// src/services/ErrorLogService.ts
import { AUTH_API_BASE_URL } from '@/utils/constants';
import { CreateErrorLogModel, ErrorLog, ErrorLogQuery, PagedResult, UpdateErrorLogModel } from '@/types';
import { get, post, put, patch, del } from '@/utils/fetchClient';
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
        private patchFn: ApiPut,
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

        // Existing query params
        if (params.text) queryParams.append('text', params.text);
        if (params.errorTimeFrom) queryParams.append('errorTimeFrom', params.errorTimeFrom);
        if (params.errorTimeTo) queryParams.append('errorTimeTo', params.errorTimeTo);
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params.pageIndex) queryParams.append('pageIndex', params.pageIndex.toString());
        if (params.orderBy) queryParams.append('orderBy', params.orderBy);

        // New query params for added columns
        if (params.lastUpdatedFrom) queryParams.append('lastUpdatedFrom', params.lastUpdatedFrom);
        if (params.lastUpdatedTo) queryParams.append('lastUpdatedTo', params.lastUpdatedTo);

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

        // New array param for assignedToUsers
        if (params.assignedToUsers && params.assignedToUsers.length > 0) {
            params.assignedToUsers.forEach(user => {
                queryParams.append('assignedToUsers', user);
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
    async getErrorLog(id: number, options?: any): Promise<ErrorLog> {
        const url = `${AUTH_API_BASE_URL}${this.baseEndpoint}/${id}`;
        console.log("url", url);
        const result = await this.getFn<ErrorLog>(url, options);
        if (!result) {
            throw new Error(`Failed to fetch error log with ID ${id}`);
        }
        return result;
    }

    /**
     * Create a new error log
     */
    async createErrorLog(errorLog: CreateErrorLogModel): Promise<ErrorLog> {
        const url = `${AUTH_API_BASE_URL}${this.baseEndpoint}`;
        const result = await this.postFn<ErrorLog>(url, errorLog);
        if (!result) {
            throw new Error('Failed to create error log');
        }
        return result;
    }

    /**
     * Update an existing error log
     */
    async updateErrorLog(id: number, errorLog: UpdateErrorLogModel): Promise<ErrorLog> {
        const url = `${AUTH_API_BASE_URL}${this.baseEndpoint}/${id}`;
        const result = await this.putFn<ErrorLog>(url, errorLog);
        if (!result) {
            throw new Error(`Failed to update error log with ID ${id}`);
        }
        return result;
    }

    /**
     * Update an existing error log
     */
    async patchErrorLog(id: number, existingErrorLog: ErrorLog | undefined | null, newErrorLog: UpdateErrorLogModel): Promise<ErrorLog> {
        const url = `${AUTH_API_BASE_URL}${this.baseEndpoint}/${id}`;

        // Convert the partial object to JSON Patch operations
        const patchOperations: Operation[] =
            existingErrorLog !== undefined && existingErrorLog !== null
                ? compare(existingErrorLog, {
                    ...existingErrorLog,
                    ...newErrorLog
                })
                : Object.entries(newErrorLog).map(([key, value]) => ({
                    op: "replace",
                    path: `/${key}`,
                    value: value
                })) as Operation[];

        // Only send if there are actual changes
        if (patchOperations.length > 0) {
            const result = await this.patchFn<ErrorLog>(url, patchOperations);
            if (!result) {
                throw new Error(`Failed to update error log with ID ${id}`);
            }
            return result;
        }

        return existingErrorLog ?? newErrorLog as ErrorLog;
    }

    /**
     * Delete an error log
     */
    async deleteErrorLog(id: number, options?: any): Promise<boolean> {
        const url = `${AUTH_API_BASE_URL}${this.baseEndpoint}/${id}`;
        const result = await this.deleteFn<boolean>(url, options);
        return result || false;
    }

    /**
     * Resolve an error log
     */
    async resolveErrorLog(id: number, options?: any): Promise<boolean> {
        const url = `${AUTH_API_BASE_URL}${this.baseEndpoint}/${id}/Resolve`;
        const result = await this.postFn<boolean>(url, {}, options);
        return result || false;
    }
    
    /**
     * Assign an error log to a user
     */
    async assignErrorLog(id: number, userId: string): Promise<ErrorLog> {
        const url = `${AUTH_API_BASE_URL}${this.baseEndpoint}/${id}/Assign`;
        const result = await this.postFn<ErrorLog>(url, { assignedTo: userId });
        if (!result) {
            throw new Error(`Failed to assign error log with ID ${id}`);
        }
        return result;
    }
    
    /**
     * Update an error log note
     */
    async updateNote(id: number, note: string): Promise<ErrorLog> {
        const url = `${AUTH_API_BASE_URL}${this.baseEndpoint}/${id}/Note`;
        const result = await this.postFn<ErrorLog>(url, { note });
        if (!result) {
            throw new Error(`Failed to update note for error log with ID ${id}`);
        }
        return result;
    }
}

// Create a singleton instance
// Default service for non-authenticated (general/server) use, using the standard fetch client
const createDefaultService = () => new ErrorLogService(
    async (url, options) => (await get(url, options)).data,
    async (url, data, options) => (await post(url, data, options)).data,
    async (url, data, options) => (await put(url, data, options)).data,
    async (url, data, options) => (await patch(url, data, options)).data,
    async (url, options) => (await del(url, options)).data
);
const defaultService = createDefaultService();
export default defaultService;

// For server-side data fetching
export const getServerErrorLogs = (query: ErrorLogQuery = {}) => defaultService.searchErrorLogs(query, { skipAuth: true, skipRefresh: true });
export const getServerErrorLog = async (id: number): Promise<ErrorLog> => { return await defaultService.getErrorLog(id, { skipAuth: true, skipRefresh: true }); };
export const deleteServerErrorLog = async (id: number): Promise<boolean> => { return await defaultService.deleteErrorLog(id, { skipAuth: true, skipRefresh: true }); }
export const resolveServerErrorLog = async (id: number): Promise<boolean> => { return await defaultService.resolveErrorLog(id, { skipAuth: true, skipRefresh: true }); }
export const updateServerErrorLog = async (id: number, errorLog: UpdateErrorLogModel): Promise<ErrorLog> => { return await defaultService.updateErrorLog(id, errorLog); }
export const patchServerErrorLog = async (id: number, existingErrorLog: ErrorLog | undefined, newErrorLog: UpdateErrorLogModel): Promise<ErrorLog> => { return await defaultService.patchErrorLog(id, existingErrorLog, newErrorLog); }
export const assignServerErrorLog = async (id: number, userId: string): Promise<ErrorLog> => { return await defaultService.assignErrorLog(id, userId); }
export const updateServerNote = async (id: number, note: string): Promise<ErrorLog> => { return await defaultService.updateNote(id, note); }

// For authenticated client-side usage
import { useAuthenticatedApi } from '@/hooks/useAuthenticatedApi';

export function useAuthenticatedErrorLogService() {
    const api = useAuthenticatedApi();

    return new ErrorLogService(
        api.get,
        api.post,
        api.put,
        api.patch,
        api.delete
    );
}
