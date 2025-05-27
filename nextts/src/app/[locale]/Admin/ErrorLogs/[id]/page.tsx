import React from 'react';
import { notFound } from 'next/navigation';
import { Box, Paper, Typography, Chip, Grid, Divider, Button, CircularProgress } from '@mui/material';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';

import {
    ArrowBack as ArrowBackIcon,
    Check as CheckIcon,
    Delete as DeleteIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    Edit as EditIcon
} from '@mui/icons-material';

import { getServerErrorLog } from '@/services/ErrorLogService';
import { ErrorLogState, ErrorLogSeverity } from '@/types/errorLog';

interface ErrorLogDetailPageProps {
    params: {
        locale: string;
        id: string;
    };
}

export default async function ErrorLogDetailPage({ params }: ErrorLogDetailPageProps) {
    const { locale, id } = await params;
    const errorLogId = parseInt(id);

    // Validate ID
    if (isNaN(errorLogId)) {
        return notFound();
    }

    const t = await getTranslations('errorLogs');
    const queryClient = new QueryClient();

    try {
        // Fetch error log details
        const errorLog = await getServerErrorLog(errorLogId);

        // Preload query cache
        queryClient.setQueryData(['errorLog', errorLogId], errorLog);

        // Get severity info
        const getSeverityInfo = (severity?: number) => {
            if (severity === undefined) return { icon: <InfoIcon />, color: 'info', label: t('severity.info') || 'Info' };

            switch (severity) {
                case ErrorLogSeverity.Fatal:
                    return { icon: <ErrorIcon />, color: 'error', label: t('severity.fatal') || 'Fatal' };
                case ErrorLogSeverity.Error:
                    return { icon: <ErrorIcon />, color: 'error', label: t('severity.error') || 'Error' };
                case ErrorLogSeverity.Warning:
                    return { icon: <WarningIcon />, color: 'warning', label: t('severity.warning') || 'Warning' };
                case ErrorLogSeverity.Notice:
                    return { icon: <InfoIcon />, color: 'primary', label: t('severity.notice') || 'Notice' };
                default:
                    return { icon: <InfoIcon />, color: 'info', label: t('severity.info') || 'Info' };
            }
        };

        // Get state info
        const getStateInfo = (state?: number) => {
            if (state === undefined) return { label: t('state.new') || 'New', color: 'default' };

            switch (state) {
                case ErrorLogState.New:
                    return { label: t('state.new') || 'New', color: 'default' };
                case ErrorLogState.InProgress:
                    return { label: t('state.inProgress') || 'In Progress', color: 'primary' };
                case ErrorLogState.Resolved:
                    return { label: t('state.resolved') || 'Resolved', color: 'success' };
                case ErrorLogState.Closed:
                    return { label: t('state.closed') || 'Closed', color: 'secondary' };
                default:
                    return { label: state.toString(), color: 'default' };
            }
        };

        const severityInfo = getSeverityInfo(errorLog.errorSeverity);
        const stateInfo = getStateInfo(errorLog.errorState);

        return (
            <Box className="container mx-auto py-8">
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1">
                        {t('admin.errorDetailTitle') || 'Error Log Detail'}
                    </Typography>

                    <Link href={`/${locale}/Admin/ErrorLogs`} passHref>
                        <Button startIcon={<ArrowBackIcon />} variant="outlined">
                            {t('admin.backToList') || 'Back to List'}
                        </Button>
                    </Link>
                </Box>

                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Chip
                                    icon={severityInfo.icon}
                                    label={severityInfo.label}
                                    color={severityInfo.color as any}
                                    size="medium"
                                />
                                <Chip
                                    label={stateInfo.label}
                                    color={stateInfo.color as any}
                                    size="medium"
                                />
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                ID: {errorLog.errorLogId}
                            </Typography>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {t('fields.errorTime') || 'Error Time'}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {format(new Date(errorLog.errorTime), 'yyyy-MM-dd HH:mm:ss')}
                                </Typography>

                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {t('fields.userName') || 'User'}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {errorLog.userName || t('fields.anonymous') || 'Anonymous'}
                                </Typography>

                                {/* {errorLog.errorProcedure && (
                                    <>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {t('fields.errorProcedure') || 'Procedure'}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            {errorLog.errorProcedure}
                                        </Typography>
                                    </>
                                )} */}
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {t('fields.errorNumber') || 'Error Number'}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {errorLog.errorNumber || 'N/A'}
                                </Typography>

                                {errorLog.errorLine && (
                                    <>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {t('fields.errorLine') || 'Line Number'}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            {errorLog.errorLine}
                                        </Typography>
                                    </>
                                )}

                                {/* NEW FIELD: AssignedTo */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {t('fields.assignedTo') || 'Assigned To'}
                                    </Typography>
                                    {errorLog.assignedTo ? (
                                        <Chip
                                            label={errorLog.assignedTo}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ) : (
                                        <Typography variant="body1" color="text.secondary" fontStyle="italic">
                                            {t('notAssigned') || 'Not assigned'}
                                        </Typography>
                                    )}
                                </Grid>
                                {/* NEW FIELD: LastUpdated */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {t('fields.lastUpdated') || 'Last Updated'}
                                    </Typography>
                                    {errorLog.lastUpdated ? (
                                        <Typography variant="body1">{format(new Date(errorLog.lastUpdated), 'yyyy-MM-dd HH:mm:ss')}</Typography>
                                    ) : (
                                        <Typography variant="body1" color="text.secondary" fontStyle="italic">
                                            {t('notUpdated') || 'Not updated'}
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>

                            <Grid size={12}>
                                <Divider sx={{ my: 2 }} />

                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {t('fields.errorMessage') || 'Error Message'}
                                </Typography>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        mt: 1,
                                        backgroundColor: 'grey.50',
                                        fontFamily: 'monospace',
                                        whiteSpace: 'pre-wrap',
                                        overflowX: 'auto'
                                    }}
                                >
                                    {errorLog.errorMessage}
                                </Paper>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        {/* Add this button in your actions section */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<EditIcon />}
                                component={Link}
                                href={`/${locale}/Admin/ErrorLogs/${id}/Edit`}
                            >
                                {t('admin.editErrorLog') || 'Edit Log'}
                            </Button>

                            {/* Your existing buttons */}
                            {errorLog.errorState !== ErrorLogState.Resolved && (
                                <Button
                                    variant="outlined"
                                    color="success"
                                    startIcon={<CheckIcon />}
                                    href={`/${locale}/Admin/ErrorLogs/${id}/Resolve`}
                                >
                                    {t('admin.markAsResolved') || 'Mark as Resolved'}
                                </Button>
                            )}

                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                href={`/${locale}/Admin/ErrorLogs/${id}/Delete`}
                            >
                                {t('admin.deleteErrorLog') || 'Delete Log'}
                            </Button>
                        </Box>
                    </Paper>
                </HydrationBoundary>
            </Box>
        );
    } catch (error) {
        console.error('Error fetching error log details:', error);

        // Handle error state
        return (
            <Box className="container mx-auto py-8">
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1">
                        {t('admin.errorDetailTitle') || 'Error Log Detail'}
                    </Typography>

                    <Link href={`/${locale}/Admin/ErrorLogs`} passHref>
                        <Button startIcon={<ArrowBackIcon />} variant="outlined">
                            {t('admin.backToList') || 'Back to List'}
                        </Button>
                    </Link>
                </Box>

                <Paper sx={{ p: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
                    <Typography>
                        {t('admin.errorLoadingDetails') || 'Error loading error log details. The requested error log may not exist or you may not have permission to view it.'}
                    </Typography>
                </Paper>
            </Box>
        );
    }
}