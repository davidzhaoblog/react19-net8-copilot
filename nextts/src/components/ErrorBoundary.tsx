// Create a separate ErrorBoundary component
// filepath: \src\components\ErrorBoundary.tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '50vh',
            p: 3 
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            Something went wrong
          </Typography>
          <Typography color="text.secondary" paragraph>
            {this.state.error?.message || "An unexpected error occurred"}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;