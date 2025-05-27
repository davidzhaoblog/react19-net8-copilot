'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography, Button, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useAuthenticatedErrorLogService } from '@/services/ErrorLogService';
import { useTranslations } from 'next-intl';

interface DeleteErrorLogClientProps {
  errorLogId: number;
  locale: string;
}

export default function DeleteErrorLogClient({ errorLogId, locale }: DeleteErrorLogClientProps) {
  const router = useRouter();
  const t = useTranslations('errorLogs');
  const errorLogService = useAuthenticatedErrorLogService();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(true);
  
  // Extract delete operation to a callback function
  const performDelete = useCallback(async () => {
    try {
      setIsLoading(true);
      await errorLogService.deleteErrorLog(errorLogId);
      router.push(`/${locale}/Admin/ErrorLogs`);
    } catch (err) {
      console.error('Error deleting error log:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setIsLoading(false);
    }
  }, [errorLogId, locale, router, errorLogService]);

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    setShowConfirmation(false);
    performDelete();
  };
  
  // Handle cancel
  const handleCancel = () => {
    router.push(`/${locale}/Admin/ErrorLogs/${errorLogId}`);
  };
  
  // Error display
  if (error) {
    return (
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {t('errorDeleting') || 'Error deleting error log'}: {error}
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => router.push(`/${locale}/Admin/ErrorLogs/${errorLogId}`)}
          >
            {t('backToDetails') || 'Back to Details'}
          </Button>
        </Box>
      </Box>
    );
  }
  
  // Loading indicator
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh', 
        flexDirection: 'column' 
      }}
      aria-live="polite"
      role="status"
      >
        <CircularProgress size={60} aria-label={t('deletingErrorLog') || 'Deleting error log...'} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {t('deletingErrorLog') || 'Deleting error log...'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('pleaseWait') || 'Please wait, you will be redirected automatically'}
        </Typography>
      </Box>
    );
  }
  
  // Confirmation dialog
  return (
    <Dialog
      open={showConfirmation}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        {t('confirmDelete') || 'Confirm Deletion'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          {t('deleteConfirmation') || 'Are you sure you want to delete this error log? This action cannot be undone.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          {t('cancel') || 'Cancel'}
        </Button>
        <Button onClick={handleConfirmDelete} color="error" autoFocus>
          {t('delete') || 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}