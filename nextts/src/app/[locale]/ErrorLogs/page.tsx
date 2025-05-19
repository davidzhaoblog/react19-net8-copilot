import { Suspense } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getTranslations } from 'next-intl/server';
import ErrorLogGrid from '@/components/ErrorLogs/ErrorLogGrid';
import { getServerErrorLogs } from '@/services/ErrorLogService';
import { ErrorLogQuery } from '@/types';

interface ErrorLogsPageProps {
    params: { locale: string };
    searchParams: {
        page?: string;
        pageSize?: string;
        text?: string;
        errorTimeFrom?: string;
        errorTimeTo?: string;
        orderBy?: string;
        errorSeverities?: string | string[];
        errorStates?: string | string[];
    };
}

export default async function ErrorLogsPage({
    params,
    searchParams
}: ErrorLogsPageProps) {
    const { locale } = await params;
    const t = await getTranslations('errorLogs');
    const searchParams2 = await searchParams;
    console.log('Search params:', searchParams2);


    const query: ErrorLogQuery = {
        pageIndex: searchParams2?.page ? Math.max(0, parseInt(searchParams2?.page) - 1) : 0,
        pageSize: searchParams2?.pageSize ? parseInt(searchParams2?.pageSize) : 12,
        orderBy: searchParams2?.orderBy || 'ErrorTime',
        text: searchParams2?.text,
        errorTimeFrom: searchParams2?.errorTimeFrom,
        errorTimeTo: searchParams2?.errorTimeTo,
    };
    console.log('Parsed query:', query);
    // Handle array parameters
    if (searchParams2?.errorSeverities) {
        if (Array.isArray(searchParams2.errorSeverities)) {
            query.errorSeverities = searchParams2.errorSeverities.map(s => parseInt(s));
        } else {
            query.errorSeverities = [parseInt(searchParams2.errorSeverities)];
        }
    }

    if (searchParams2?.errorStates) {
        if (Array.isArray(searchParams2.errorStates)) {
            query.errorStates = searchParams2.errorStates.map(s => parseInt(s));
        } else {
            query.errorStates = [parseInt(searchParams2.errorStates)];
        }
    }

    // Create a new QueryClient for this request
    const queryClient = new QueryClient();

    try {
        // Fetch data server-side
        const errorLogs = await getServerErrorLogs(query);

        // Preload the query cache with this data
        queryClient.setQueryData(['errorLogs', query], errorLogs);

        return (
            <div className="container mx-auto py-8">
                <Typography variant="h4" component="h1" className="mb-6">
                    {t('title') || 'Error Logs'}
                </Typography>

                <Suspense fallback={
                    <Box className="flex justify-center p-8">
                        <CircularProgress />
                    </Box>
                }>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <ErrorLogGrid
                            initialQuery={query}
                            title={t('errorLogList.title') || 'Error Log List'}
                            locale={locale}
                            showActions={false} requireAuth={false}
                        />
                    </HydrationBoundary>
                </Suspense>
            </div>
        );
    } catch (error) {
        console.error('Error fetching error logs:', error);

        // Still hydrate query client even with error for client-side recovery
        return (
            <div className="container mx-auto py-8">
                <Typography variant="h4" component="h1" className="mb-6">
                    {t('title') || 'Error Logs'}
                </Typography>

                <Box className="p-4 bg-red-50 border border-red-200 rounded">
                    <Typography color="error">
                        {t('errorFetching') || 'Error fetching data. Please try again later.'}
                    </Typography>
                </Box>

                <HydrationBoundary state={dehydrate(queryClient)}>
                    <ErrorLogGrid
                        initialQuery={query}
                        title={t('errorLogList.title') || 'Error Log List'}
                        locale={locale}
                        showActions={false} requireAuth={false}
                    />
                </HydrationBoundary>
            </div>
        );
    }
}