import { Suspense } from 'react';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getTranslations } from 'next-intl/server';
import ErrorLogGrid from '@/components/ErrorLogs/ErrorLogGrid';
import ErrorLogSearchPanel from '@/components/ErrorLogs/ErrorLogSearchPanel';
import { getServerErrorLogs } from '@/services/ErrorLogService';
import { ErrorLogQuery } from '@/types/errorLog';
import { headers } from 'next/headers';

interface AdminErrorLogsPageProps {
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

// This is needed for security - ensures this page is only accessible by admins
export const dynamic = 'force-dynamic';

export default async function AdminErrorLogsPage({
  params,
  searchParams
}: AdminErrorLogsPageProps) {
  const { locale } = await params;
  const searchParams1 = await searchParams || {};
  const t = await getTranslations('errorLogs');
  
  // Parse query parameters
  const query: ErrorLogQuery = {
    pageIndex: searchParams1.page ? Math.max(0, parseInt(searchParams1.page) - 1) : 0,
    pageSize: searchParams1.pageSize ? parseInt(searchParams1.pageSize) : 12,
    orderBy: searchParams1.orderBy || 'ErrorTime desc',
    text: searchParams1.text,
    errorTimeFrom: searchParams1.errorTimeFrom,
    errorTimeTo: searchParams1.errorTimeTo,
  };
  
  // Handle array parameters
  if (searchParams1.errorSeverities) {
    if (Array.isArray(searchParams1.errorSeverities)) {
      query.errorSeverities = searchParams1.errorSeverities.map(s => parseInt(s));
    } else {
      query.errorSeverities = [parseInt(searchParams1.errorSeverities)];
    }
  }

  if (searchParams1.errorStates) {
    if (Array.isArray(searchParams1.errorStates)) {
      query.errorStates = searchParams1.errorStates.map(s => parseInt(s));
    } else {
      query.errorStates = [parseInt(searchParams1.errorStates)];
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
          {t('admin.title') || 'System Error Logs'}
        </Typography>
        
        <div className="mb-4">
          <Alert severity="info">
            This page is only accessible to System Administrators. All actions are logged.
          </Alert>
        </div>

        <ErrorLogSearchPanel
          initialQuery={query}
        />

        <Suspense fallback={
          <Box className="flex justify-center p-8">
            <CircularProgress />
          </Box>
        }>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorLogGrid
              initialQuery={query}
              title={t('admin.errorLogList.title') || 'Error Log Administration'}
              locale={locale}
              showActions={true}
              requireAuth={true}
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
          {t('admin.title') || 'System Error Logs'}
        </Typography>
        
        <div className="mb-4">
          <Alert severity="info">
            This page is only accessible to System Administrators. All actions are logged.
          </Alert>
        </div>

        <ErrorLogSearchPanel
          initialQuery={query}
        />

        <Box className="p-4 bg-red-50 border border-red-200 rounded">
          <Typography color="error">
            {t('errorFetching') || 'Error fetching data. Please try again later.'}
          </Typography>
        </Box>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <ErrorLogGrid
            initialQuery={query}
            title={t('admin.errorLogList') || 'Error Log Administration'}
            locale={locale}
            showActions={true}
            requireAuth={true}
          />
        </HydrationBoundary>
      </div>
    );
  }
}