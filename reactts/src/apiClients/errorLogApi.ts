import { StorageKeys } from '@/types/StorageKeys';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base URL for your API
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export interface ErrorLog {
    id: number;
    message: string;
    timestamp: string;
    level: string;
}

export const errorLogApi = createApi({
    reducerPath: 'errorLogApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem(StorageKeys.Token);
        
            // If we have a token set in state, let's assume that we should be passing it.
            // if (token) {
            //   headers.set('authorization', `Bearer ${token}`)
            // }
        
            return headers
          },
    }),
    tagTypes: ['ErrorLog'],
    endpoints: (builder) => ({
        // Fetch all ErrorLogs
        getErrorLogs: builder.query<ErrorLog[], void>({
            query: () => '/errorlog',
            providesTags: ['ErrorLog'],
        }),
        // Fetch a single ErrorLog by ID
        getErrorLogById: builder.query<ErrorLog, number>({
            query: (id) => `/errorlog/${id}`,
            providesTags: (result, error, id) => [{ type: 'ErrorLog', id }],
        }),
        // Create a new ErrorLog
        createErrorLog: builder.mutation<ErrorLog, Partial<ErrorLog>>({
            query: (newErrorLog) => ({
                url: '/errorlog',
                method: 'POST',
                body: newErrorLog,
            }),
            invalidatesTags: ['ErrorLog'],
        }),
        // Update an existing ErrorLog
        updateErrorLog: builder.mutation<ErrorLog, Partial<ErrorLog>>({
            query: ({ id, ...updatedFields }) => ({
                url: `/errorlog/${id}`,
                method: 'PUT',
                body: updatedFields,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'ErrorLog', id }],
        }),
        // Delete an ErrorLog
        deleteErrorLog: builder.mutation<{ success: boolean; id: number }, number>({
            query: (id) => ({
                url: `/errorlog/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'ErrorLog', id }],
        }),
    }),
});

export const {
    useGetErrorLogsQuery,
    useGetErrorLogByIdQuery,
    useCreateErrorLogMutation,
    useUpdateErrorLogMutation,
    useDeleteErrorLogMutation,
} = errorLogApi;
