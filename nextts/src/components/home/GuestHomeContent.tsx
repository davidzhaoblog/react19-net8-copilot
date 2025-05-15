'use client';

import { Box, Typography } from "@mui/material";

// Copy the AuthenticatedContent from earlier

export default function GuestHomeContent() {
    return (
        <Box className="mt-4">
            <Typography variant="h4" component="h1" gutterBottom>
                Not Authenticated Welcome to Next.js App
            </Typography>
        </Box>
    );
}