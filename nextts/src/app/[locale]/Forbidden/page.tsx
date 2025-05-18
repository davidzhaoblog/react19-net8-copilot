// src/app/[locale]/Forbidden/page.tsx
import { Box, Typography, Button, Paper } from '@mui/material';
import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <Box className="flex justify-center items-center min-h-screen">
      <Paper elevation={3} className="p-8 max-w-md w-full text-center">
        <Typography variant="h1" className="text-6xl font-bold text-red-500 mb-4">
          403
        </Typography>
        <Typography variant="h5" className="mb-4">
          Access Denied
        </Typography>
        <Typography variant="body1" className="mb-6">
          You don't have permission to access this page.
        </Typography>
        <Link href="/" passHref>
          <Button variant="contained" color="primary">
            Go Home
          </Button>
        </Link>
      </Paper>
    </Box>
  );
}