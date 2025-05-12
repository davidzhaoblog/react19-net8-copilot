// this file is no longer used when using react-query directly in ErrorLogList.tsx, but it is kept for reference
import { createApi } from '@reduxjs/toolkit/query/react';

import baseQueryWithReauth from '@/shared/RTKQuery/RTKBaseQuery';

export interface ErrorLog {
    id: number;
    message: string;
    timestamp: string;
    level: string;
}

export const errorLogApi = createApi({
    reducerPath: 'errorLogApi',
    baseQuery: baseQueryWithReauth,
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
