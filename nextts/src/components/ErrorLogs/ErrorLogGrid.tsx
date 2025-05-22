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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import defaultErrorLogService, { useAuthenticatedErrorLogService } from '@/services/ErrorLogService';
import { arraysEqual } from '@/utils/arrayHelper';
import Link from 'next/link';

interface ErrorLogGridProps {
    initialQuery?: Partial<ErrorLogQuery>;
    title?: string;
    showActions?: boolean;
    onLogClick?: (errorLog: ErrorLog) => void;
    locale?: string;
    requireAuth?: boolean;
}

export default function ErrorLogGrid({
    initialQuery = {}
    ,
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
        queryKey: ['errorLogs', query], // This is good - it will refetch when query changes
        queryFn: () => service!.searchErrorLogs(query, { skipAuth: !requireAuth, skipRefresh: !requireAuth }),
        initialData: initialQuery && 'items' in initialQuery ? initialQuery as any : undefined,
        // Add these options:
        refetchOnMount: true,
        refetchOnWindowFocus: false, // Only refetch when explicitly triggered
        staleTime: 30000, // Consider data fresh for 30 seconds
    });

    // Sync URL with query state when query changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            updateUrl(query);
        }
    }, [query]);
    // Add this effect to sync URL parameters back to state
    useEffect(() => {
        if (searchParams) {
            const newQuery: ErrorLogQuery = { ...query };
            let hasChanges = false;

            // Parse page parameters
            if (searchParams.has('page')) {
                const pageIndex = Math.max(0, parseInt(searchParams.get('page') || '1') - 1);
                if (newQuery.pageIndex !== pageIndex) {
                    newQuery.pageIndex = pageIndex;
                    hasChanges = true;
                }
            }

            if (searchParams.has('pageSize')) {
                const pageSize = parseInt(searchParams.get('pageSize') || '12');
                if (newQuery.pageSize !== pageSize) {
                    newQuery.pageSize = pageSize;
                    hasChanges = true;
                }
            }

            // Parse sorting
            if (searchParams.has('orderBy')) {
                const orderBy = searchParams.get('orderBy') || 'ErrorTime desc';
                if (newQuery.orderBy !== orderBy) {
                    newQuery.orderBy = orderBy;
                    hasChanges = true;
                }
            }

            // Parse text search
            const text = searchParams.get('text') || undefined;
            if (newQuery.text !== text) {
                newQuery.text = text;
                hasChanges = true;
            }

            // Parse dates
            const errorTimeFrom = searchParams.get('errorTimeFrom') || undefined;
            if (newQuery.errorTimeFrom !== errorTimeFrom) {
                newQuery.errorTimeFrom = errorTimeFrom;
                hasChanges = true;
            }

            const errorTimeTo = searchParams.get('errorTimeTo') || undefined;
            if (newQuery.errorTimeTo !== errorTimeTo) {
                newQuery.errorTimeTo = errorTimeTo;
                hasChanges = true;
            }

            // Parse arrays
            const severities = searchParams.getAll('errorSeverities');
            if (severities.length > 0) {
                const parsedSeverities = severities.map(s => parseInt(s));
                if (!arraysEqual(newQuery.errorSeverities || [], parsedSeverities)) {
                    newQuery.errorSeverities = parsedSeverities;
                    hasChanges = true;
                }
            } else if (newQuery.errorSeverities?.length) {
                newQuery.errorSeverities = undefined;
                hasChanges = true;
            }

            const states = searchParams.getAll('errorStates');
            if (states.length > 0) {
                const parsedStates = states.map(s => parseInt(s));
                if (!arraysEqual(newQuery.errorStates || [], parsedStates)) {
                    newQuery.errorStates = parsedStates;
                    hasChanges = true;
                }
            } else if (newQuery.errorStates?.length) {
                newQuery.errorStates = undefined;
                hasChanges = true;
            }

            // Only update if there are actual changes
            if (hasChanges) {
                setQuery(newQuery);
            }
        }
    }, [searchParams]); // React to URL changes

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

    // Add sorting functionality
    const handleSortChange = (field: string) => {
        const currentOrderBy = query.orderBy || 'ErrorTime desc';
        const [currentField, currentDirection] = currentOrderBy.split(' ');

        // Toggle direction if same field, otherwise set to 'asc'
        const newDirection = (currentField === field && currentDirection === 'asc') ? 'desc' : 'asc';
        const newOrderBy = `${field} ${newDirection}`;

        setQuery({
            ...query,
            orderBy: newOrderBy
        });
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
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
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
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell onClick={() => handleSortChange('ErrorTime')}>
                                    Time {query.orderBy?.startsWith('ErrorTime') === true ? (query.orderBy?.endsWith('asc') ? '↑' : '↓') : ''}
                                </TableCell>
                                <TableCell onClick={() => handleSortChange('UserName')}>
                                    User {query.orderBy?.startsWith('UserName') === true ? (query.orderBy?.endsWith('asc') ? '↑' : '↓') : ''}
                                </TableCell>
                                <TableCell onClick={() => handleSortChange('ErrorMessage')}>
                                    Message {query.orderBy?.startsWith('ErrorMessage') === true ? (query.orderBy?.endsWith('asc') ? '↑' : '↓') : ''}
                                </TableCell>
                                <TableCell onClick={() => handleSortChange('ErrorSeverity')}>
                                    Severity {query.orderBy?.startsWith('ErrorSeverity') === true ? (query.orderBy?.endsWith('asc') ? '↑' : '↓') : ''}
                                </TableCell>
                                <TableCell onClick={() => handleSortChange('ErrorState')}>
                                    State {query.orderBy?.startsWith('ErrorState') === true ? (query.orderBy?.endsWith('asc') ? '↑' : '↓') : ''}
                                </TableCell>
                                <TableCell onClick={() => handleSortChange('ErrorProcedure')}>
                                    Procedure {query.orderBy?.startsWith('ErrorProcedure') === true ? (query.orderBy?.endsWith('asc') ? '↑' : '↓') : ''}
                                </TableCell>
                                <TableCell onClick={() => handleSortChange('ErrorLine')}>
                                    Line {query.orderBy?.startsWith('ErrorLine') === true ? (query.orderBy?.endsWith('asc') ? '↑' : '↓') : ''}
                                </TableCell>
                                {showActions && <TableCell>Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.items.map((logItem: ErrorLog) => {
                                const severityInfo = getSeverityInfo(logItem.errorSeverity);

                                return (
                                    <TableRow
                                        key={logItem.errorLogId}
                                        sx={{
                                            cursor: onLogClick || showActions ? 'pointer' : 'default',
                                            '&:hover': { bgcolor: 'action.hover' }
                                        }}
                                        onClick={() => {
                                            if (onLogClick) {
                                                onLogClick(logItem);
                                            } else if (showActions) {
                                                // Navigate to detail page
                                                router.push(`/${locale}/Admin/ErrorLogs/${logItem.errorLogId}`);
                                            }
                                        }}
                                    >
                                        <TableCell>
                                            <Chip
                                                icon={severityInfo.icon}
                                                label={`${severityInfo.label} ${logItem.errorSeverity || ''}`}
                                                color={severityInfo.color as any}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(logItem.errorTime), 'yyyy-MM-dd HH:mm:ss')}
                                        </TableCell>
                                        <TableCell>
                                            {logItem.userName}
                                        </TableCell>
                                        <TableCell>
                                            {logItem.errorMessage}
                                        </TableCell>
                                        <TableCell>
                                            {logItem.errorSeverity}
                                        </TableCell>
                                        <TableCell>
                                            {logItem.errorState}
                                        </TableCell>
                                        <TableCell>
                                            {logItem.errorProcedure}
                                        </TableCell>
                                        <TableCell>
                                            {logItem.errorLine}
                                        </TableCell>
                                        {showActions && (
                                            <TableCell>
                                                <IconButton
                                                    component={Link}
                                                    href={`/${locale}/Admin/ErrorLogs/${logItem.errorLogId}`}
                                                    size="small"
                                                    onClick={(e) => e.stopPropagation()} // Prevent row click from firing
                                                    aria-label="view details"
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    component={Link}
                                                    href={`/${locale}/Admin/ErrorLogs/${logItem.errorLogId}/Edit`}
                                                    size="small"
                                                    onClick={(e) => e.stopPropagation()} // Prevent row click from firing
                                                    aria-label="edit"
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    component={Link}
                                                    href={`/${locale}/Admin/ErrorLogs/${logItem.errorLogId}/Delete`}
                                                    size="small"
                                                    onClick={(e) => e.stopPropagation()} // Prevent row click from firing
                                                    aria-label="delete"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
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