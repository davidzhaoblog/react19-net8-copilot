// should be a MUI Grid v2 issue:
// the width of GridContainer is changing when the selected value of the Select component inside the Grid changed.
'use client';

import React, { useState, useEffect, use } from 'react'; // Remove 'use' import
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid as MuiGridv2,
    Divider,
    CircularProgress,
    Alert,
    FormHelperText
} from '@mui/material';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';

import { getServerErrorLog, useAuthenticatedErrorLogService } from '@/services/ErrorLogService';
import { ErrorLog, errorStateOptions, errorSeverityOptions, UpdateErrorLogModel } from '@/types/errorLog';

interface ErrorLogEditPageProps {
    params: Promise<{
        locale: string;
        id: string;
    }>;
}


export default function ErrorLogEditClient({ params }: ErrorLogEditPageProps) {
    const { locale, id } = use(params);
    const errorLogId = parseInt(id);
    const t = useTranslations('errorLogs');
    const router = useRouter();

    // Get the authenticated service
    const errorLogService = useAuthenticatedErrorLogService();

    // Form state
    const [formState, setFormState] = useState<UpdateErrorLogModel>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Fetch the error log data
    const { data: errorLog, isLoading, isError, error } = useQuery({
        queryKey: ['errorLog', errorLogId],
        queryFn: () => errorLogService.getErrorLog(errorLogId),
        enabled: !!errorLogId && errorLogId > 0,
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (patchedLog: UpdateErrorLogModel) =>
            errorLogService.patchErrorLog(errorLogId, errorLog, patchedLog),
        onSuccess: () => {
            // Navigate back to the error log details page
            router.push(`/${locale}/Admin/ErrorLogs/${errorLogId}`);
        },
        onError: (error) => {
            console.error('Failed to update error log:', error);
        },
    });

    // Initialize form when data is available
    useEffect(() => {
        if (errorLog) {
            setFormState({
                errorState: errorLog.errorState,
                errorSeverity: errorLog.errorSeverity,
                // assignedTo: errorLog.assignedTo,
                // notes: errorLog.notes || '',
            });
        }
    }, [errorLog]);
    
    // Handle changes
    const handleChange = (field: keyof ErrorLog) => (
        event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
    ) => {
        const value = event.target.value;

        // For Select components, ensure we're working with numbers for enums
        if (field === 'errorState' || field === 'errorSeverity') {
            setFormState((prevState) => ({
                ...prevState,
                [field]: typeof value === 'string' ? parseInt(value) : value,
            }));
        } else {
            setFormState((prevState) => ({
                ...prevState,
                [field]: value,
            }));
        }

        // Clear error for this field if it exists
        if (formErrors[field]) {
            setFormErrors({
                ...formErrors,
                [field]: '',
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Validate form
        const errors: Record<string, string> = {};

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        
        const changes: UpdateErrorLogModel = {
            errorState: formState.errorState,
            errorSeverity: formState.errorSeverity
        };
        
        // Submit form
        updateMutation.mutate(changes);
    };

    // Handle cancel
    const handleCancel = () => {
        router.push(`/${locale}/Admin/ErrorLogs/${errorLogId}`);
    };

    // Show loading state
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Show error state
    if (isError) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    {t('errorLoadingData') || 'Error loading error log data'}: {error instanceof Error ? error.message : 'Unknown error'}
                </Alert>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        component={Link}
                        href={`/${locale}/Admin/ErrorLogs/${errorLogId}`}
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                    >
                        {t('backToDetails') || 'Back to Details'}
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        // Fix 1: Set a fixed width directly on the container
        <Box className="container mx-auto py-8">
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1">
                    {t('admin.editErrorLog') || 'Edit Error Log'}
                </Typography>

                <Button
                    component={Link}
                    href={`/${locale}/Admin/ErrorLogs/${errorLogId}`}
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                >
                    {t('backToDetails') || 'Back to Details'}
                </Button>
            </Box>

            {updateMutation.isError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {t('errorUpdating') || 'Error updating error log'}: {
                        updateMutation.error instanceof Error
                            ? updateMutation.error.message
                            : 'Unknown error'
                    }
                </Alert>
            )}

            {/* Fix 2: Ensure the Paper has a fixed width */}
            <Paper sx={{ p: 3, width: '100%' }}>
                <form onSubmit={handleSubmit}>
                    {/* Fix 3: Lock the Grid container width */}
                    <MuiGridv2 container spacing={3} sx={{ width: '100%', m: 0, flexGrow: 1 }}>
                        <MuiGridv2 size={{ xs: 12 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {t('admin.errorInformation') || 'Error Information'}
                            </Typography>
                        </MuiGridv2>

                        <MuiGridv2 size={{ xs: 12, md: 6 }}>
                            {/* Fix 4: More comprehensive styling for FormControl */}
                            <FormControl 
                                fullWidth 
                                error={!!formErrors.errorState}
                                sx={{ 
                                    minHeight: '80px',
                                    width: '100%',
                                    // Fix 5: Force stable sizing on the Select component
                                    '& .MuiInputBase-root': {
                                        width: '100%'
                                    },
                                    '& .MuiSelect-select': {
                                        width: '100%'
                                    }
                                }}
                            >
                                <InputLabel id="error-state-label">{t('fields.errorState') || 'Error State'}</InputLabel>
                                <Select
                                    labelId="error-state-label"
                                    id="error-state"
                                    value={formState.errorState !== undefined ? formState.errorState : ''}
                                    onChange={handleChange('errorState')}
                                    label={t('fields.errorState') || 'Error State'}
                                    // Fix 6: Force display block to maintain width
                                    sx={{ display: 'block', width: '100%' }}
                                >
                                    {errorStateOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {t(`state.${option.label.toLowerCase()}`) || option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.errorState && (
                                    <FormHelperText>{formErrors.errorState}</FormHelperText>
                                )}
                            </FormControl>
                        </MuiGridv2>

                        <MuiGridv2 size={{ xs: 12, md: 6 }}>
                            <FormControl 
                                fullWidth 
                                error={!!formErrors.errorSeverity}
                                sx={{ 
                                    minHeight: '80px',
                                    width: '100%',
                                    // Force stable sizing on the Select component
                                    '& .MuiInputBase-root': {
                                        width: '100%'
                                    },
                                    '& .MuiSelect-select': {
                                        width: '100%'
                                    }
                                }}
                            >
                                <InputLabel id="error-severity-label">{t('fields.errorSeverity') || 'Error Severity'}</InputLabel>
                                <Select
                                    labelId="error-severity-label"
                                    id="error-severity"
                                    value={formState.errorSeverity !== undefined ? formState.errorSeverity : ''}
                                    onChange={handleChange('errorSeverity')}
                                    label={t('fields.errorSeverity') || 'Error Severity'}
                                    sx={{ display: 'block', width: '100%' }}
                                >
                                    {errorSeverityOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {t(`severity.${option.label.toLowerCase()}`) || option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.errorSeverity && (
                                    <FormHelperText>{formErrors.errorSeverity}</FormHelperText>
                                )}
                            </FormControl>
                        </MuiGridv2>

                        {/* Action buttons */}
                        <MuiGridv2 size={{ xs: 12 }}>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<CancelIcon />}
                                    onClick={handleCancel}
                                    disabled={updateMutation.isPending}
                                    // Fix 7: Fixed width buttons
                                    sx={{ minWidth: '100px' }}
                                >
                                    {t('admin.cancel') || 'Cancel'}
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    disabled={updateMutation.isPending}
                                    // Fix 7: Fixed width buttons
                                    sx={{ minWidth: '150px' }}
                                >
                                    {updateMutation.isPending ? (
                                        <>
                                            <CircularProgress size={24} sx={{ mr: 1 }} />
                                            {t('admin.saving') || 'Saving...'}
                                        </>
                                    ) : (
                                        t('admin.saveChanges') || 'Save Changes'
                                    )}
                                </Button>
                            </Box>
                        </MuiGridv2>
                    </MuiGridv2>
                </form>
            </Paper>
        </Box>
    );
}