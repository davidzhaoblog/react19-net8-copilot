import { redirect } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { resolveServerErrorLog } from '@/services/ErrorLogService';

interface ResolveErrorLogPageProps {
  params: { locale: string; id: string };
}

export default async function ResolveErrorLogPage({ params }: ResolveErrorLogPageProps) {
  const { locale, id } = await params;
  const errorLogId = parseInt(id);
  
  // Show loading state briefly
  // In a real app, you'd use a form with CSRF protection
  await resolveServerErrorLog(errorLogId);
  
  // Redirect back to the error log details
  redirect(`/${locale}/Admin/ErrorLogs/${id}`);
  
  // This is just for TypeScript, the redirect above will prevent this from rendering
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Resolving error log...</Typography>
    </Box>
  );
}