'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ErrorLog, ErrorLogQuery } from '@/types';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Pagination,
    CircularProgress,
    Alert,
    Chip,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Skeleton,
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import defaultErrorLogService, { useAuthenticatedErrorLogService } from '@/services/ErrorLogService';

interface ErrorLogGridProps {
    initialQuery?: Partial<ErrorLogQuery>;
    title?: string;
    showActions?: boolean;
    onLogClick?: (errorLog: ErrorLog) => void;
    locale?: string;
    requireAuth?: boolean;
}

export default function ErrorLogGrid({
    initialQuery = {},
    title = 'Error Logs',
    showActions = false,
    onLogClick,
    locale = 'en',
    requireAuth = false
}: ErrorLogGridProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get the authenticated service if required
    const authService = requireAuth ? useAuthenticatedErrorLogService() : null;
    const service = requireAuth ? authService : defaultErrorLogService;

    // State for query parameters
    const [query, setQuery] = useState<ErrorLogQuery>({
        pageSize: 12,
        pageIndex: 0,
        orderBy: 'ErrorTime desc',
        ...initialQuery
    });

    // Fetch error logs with React Query
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['errorLogs', query],
        queryFn: () => service!.searchErrorLogs(query, {skipAuth: true, skipRefresh: true}),
        // If initialQuery is provided, use it as initialData
        initialData: initialQuery && 'items' in initialQuery ? initialQuery as any : undefined,
    });

    // Sync URL with query state when query changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            updateUrl(query);
        }
    }, [query]);

    // Handle page change
    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setQuery(prev => ({
            ...prev,
            pageIndex: page - 1
        }));
    };

    // Handle rows per page change
    const handlePageSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newPageSize = event.target.value as number;
        setQuery(prev => ({
            ...prev,
            pageSize: newPageSize,
            pageIndex: 0 // Reset to first page when changing page size
        }));
    };

    // Update URL without navigation
    const updateUrl = (params: ErrorLogQuery) => {
        // Create a new URLSearchParams instance
        const newSearchParams = new URLSearchParams(searchParams?.toString() || '');

        // Update the params
        if (params.pageIndex !== undefined) {
            newSearchParams.set('page', (params.pageIndex + 1).toString());
        }

        if (params.pageSize) {
            newSearchParams.set('pageSize', params.pageSize.toString());
        }

        if (params.orderBy) {
            newSearchParams.set('orderBy', params.orderBy);
        }

        if (params.text) {
            newSearchParams.set('text', params.text);
        } else {
            newSearchParams.delete('text');
        }

        if (params.errorTimeFrom) {
            newSearchParams.set('errorTimeFrom', params.errorTimeFrom);
        } else {
            newSearchParams.delete('errorTimeFrom');
        }

        if (params.errorTimeTo) {
            newSearchParams.set('errorTimeTo', params.errorTimeTo);
        } else {
            newSearchParams.delete('errorTimeTo');
        }

        // Handle arrays
        newSearchParams.delete('errorSeverities');
        if (params.errorSeverities && params.errorSeverities.length > 0) {
            params.errorSeverities.forEach(severity => {
                newSearchParams.append('errorSeverities', severity.toString());
            });
        }

        newSearchParams.delete('errorStates');
        if (params.errorStates && params.errorStates.length > 0) {
            params.errorStates.forEach(state => {
                newSearchParams.append('errorStates', state.toString());
            });
        }

        // Use router to update the URL without a full page refresh
        if (pathname) {
            router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
        }
    };

    // Get severity icon and color
    const getSeverityInfo = (severity?: number) => {
        if (!severity) return { icon: <InfoIcon />, color: 'default', label: 'Info' };
        if (severity >= 16) return { icon: <ErrorIcon />, color: 'error', label: 'Error' };
        if (severity >= 11) return { icon: <WarningIcon />, color: 'warning', label: 'Warning' };
        return { icon: <InfoIcon />, color: 'info', label: 'Info' };
    };

    // Handle card click
    const handleCardClick = (errorLog: ErrorLog) => {
        if (onLogClick) {
            onLogClick(errorLog);
        } else if (showActions) {
            router.push(`/${locale}/ErrorLogs/${errorLog.errorLogId}`);
        }
    };

    // Loading skeleton
    if (isLoading) {
        return (
            <Paper className="p-4">
                <Box className="flex justify-between items-center mb-4">
                    <Skeleton variant="text" width={200} height={40} />
                    <Skeleton variant="rectangular" width={120} height={40} />
                </Box>

                <Grid container spacing={3}>
                    {Array.from(new Array(6)).map((_, index) => (
                        <Grid size={{xs:12, sm:6, md:4, lg:3}} key={index}>
                            <Card className="h-full">
                                <CardContent>
                                    <Box className="flex justify-between items-start mb-2">
                                        <Skeleton variant="rectangular" width={80} height={24} />
                                        <Skeleton variant="text" width={40} />
                                    </Box>
                                    <Skeleton variant="text" width="80%" />
                                    <Skeleton variant="text" width="60%" />
                                    <Skeleton variant="text" width="70%" />
                                    <Box mt={2}>
                                        <Skeleton variant="rectangular" height={80} />
                                    </Box>
                                    <Box className="flex gap-2 mt-2">
                                        <Skeleton variant="rectangular" width={60} height={24} />
                                        <Skeleton variant="rectangular" width={60} height={24} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        );
    }

    if (isError) {
        return (
            <Alert severity="error" className="m-4">
                Error loading error logs: {(error as Error).message}
            </Alert>
        );
    }

    return (
        <Paper className="p-4">
            <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6">{title}</Typography>

                <Box className="flex items-center gap-4">
                    <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
                        <InputLabel id="page-size-label">Page Size</InputLabel>
                        <Select
                            labelId="page-size-label"
                            value={query.pageSize}
                            onChange={handlePageSizeChange as any}
                            label="Page Size"
                        >
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={12}>12</MenuItem>
                            <MenuItem value={24}>24</MenuItem>
                            <MenuItem value={48}>48</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {data?.items && data.items.length > 0 ? (
                <Grid container spacing={3}>
                    {data.items.map((logItem: ErrorLog) => {
                        const severityInfo = getSeverityInfo(logItem.errorSeverity);

                        return (
                            <Grid size={{xs:12, sm:6, md:4, lg:3}} key={logItem.errorLogId}>
                                <Card
                                    elevation={3}
                                    className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                                    onClick={() => handleCardClick(logItem)}
                                >
                                    <CardContent className="flex-grow">
                                        <Box className="flex justify-between items-start mb-2">
                                            <Chip
                                                icon={severityInfo.icon}
                                                label={`${severityInfo.label} ${logItem.errorSeverity || ''}`}
                                                color={severityInfo.color as any}
                                                size="small"
                                            />
                                            <Typography variant="caption" className="text-gray-500">
                                                #{logItem.errorLogId}
                                            </Typography>
                                        </Box>

                                        <Typography variant="subtitle2" className="font-bold mb-1">
                                            {format(new Date(logItem.errorTime), 'yyyy-MM-dd HH:mm:ss')}
                                        </Typography>

                                        <Typography variant="body2" className="text-gray-600 mb-2">
                                            User: {logItem.userName}
                                        </Typography>

                                        {logItem.errorProcedure && (
                                            <Typography variant="body2" className="text-gray-600 mb-2">
                                                Procedure: {logItem.errorProcedure}
                                            </Typography>
                                        )}

                                        <Typography
                                            variant="body2"
                                            className="line-clamp-3 mb-2"
                                            title={logItem.errorMessage}
                                        >
                                            {logItem.errorMessage}
                                        </Typography>

                                        <Box className="flex flex-wrap gap-2 mt-1">
                                            {logItem.errorNumber && (
                                                <Chip
                                                    label={`Error #${logItem.errorNumber}`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            )}

                                            {logItem.errorLine && (
                                                <Chip
                                                    label={`Line ${logItem.errorLine}`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            )}

                                            {logItem.errorState && (
                                                <Chip
                                                    label={`State ${logItem.errorState}`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>
                                    </CardContent>

                                    {showActions && (
                                        <CardActions>
                                            <Button
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/${locale}/ErrorLogs/${logItem.errorLogId}`);
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </CardActions>
                                    )}
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            ) : (
                <Alert severity="info">No error logs found</Alert>
            )}

            {(data?.totalCount || 0) > 0 && (
                <Box className="flex justify-center mt-6">
                    <Pagination
                        count={Math.ceil((data?.totalCount || 0) / (query.pageSize || 12))}
                        page={(query.pageIndex || 0) + 1}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </Paper>
    );
}