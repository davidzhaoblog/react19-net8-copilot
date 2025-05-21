import { redirect } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { deleteServerErrorLog } from '@/services/ErrorLogService';

interface DeleteErrorLogPageProps {
  params: { locale: string; id: string };
}

export default async function DeleteErrorLogPage({ params }: DeleteErrorLogPageProps) {
  const { locale, id } = await params;
  const errorLogId = parseInt(id);
  
  // Delete the error log
  await deleteServerErrorLog(errorLogId);
  
  // Redirect back to the error logs list
  redirect(`/${locale}/Admin/ErrorLogs`);
  
  // This is just for TypeScript, the redirect above will prevent this from rendering
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Deleting error log...</Typography>
    </Box>
  );
}