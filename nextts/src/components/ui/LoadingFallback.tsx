import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingFallback({ message = 'Loading...' }) {
  return (
    <Box className="flex flex-col items-center justify-center p-8">
      <CircularProgress size={40} className="mb-4" />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}