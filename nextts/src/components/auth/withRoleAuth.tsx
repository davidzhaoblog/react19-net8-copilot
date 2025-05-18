// src/components/auth/withRoleAuth.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CircularProgress, Box, Alert, Paper, Typography, Button } from '@mui/material';
import Link from 'next/link';

type RoleAuthOptions = {
  requiredRoles?: string[];
  redirectUrl?: string;
  fallbackComponent?: React.ReactNode;
};

export function withRoleAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: RoleAuthOptions = {}
) {
  return function ProtectedRouteWithRoles(props: P) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [checked, setChecked] = useState(false);
    
    const { requiredRoles = [], redirectUrl = '/Identity/Login', fallbackComponent } = options;
    
    // Check if user has any of the required roles
    const hasRequiredRole = requiredRoles.length === 0 || 
      (user?.roles && requiredRoles.some(role => user.roles.includes(role)));
    
    useEffect(() => {
      if (!isLoading) {
        setChecked(true);
        
        if (!isAuthenticated) {
          // User is not authenticated, redirect to login
          router.push(`${redirectUrl}?returnUrl=${encodeURIComponent(window.location.pathname)}`);
        } else if (requiredRoles.length > 0 && !hasRequiredRole) {
          // User is authenticated but doesn't have required roles
          router.push('/Forbidden');
        }
      }
    }, [isAuthenticated, isLoading, router, hasRequiredRole, requiredRoles, redirectUrl]);
    
    // Show loading state during auth/role checking
    if (isLoading || !checked) {
      return (
        <Box className="flex justify-center items-center min-h-screen">
          <CircularProgress />
        </Box>
      );
    }
    
    // Not authenticated
    if (!isAuthenticated) {
      return (
        <Box className="container mx-auto p-4">
          <Paper className="p-6">
            <Typography variant="h5" className="mb-4">
              Authentication Required
            </Typography>
            <Typography variant="body1" className="mb-4">
              Please log in to access this page
            </Typography>
            <Link href={`${redirectUrl}?returnUrl=${encodeURIComponent(window.location.pathname)}`} passHref>
              <Button variant="contained" color="primary">
                Sign In
              </Button>
            </Link>
          </Paper>
        </Box>
      );
    }
    
    // Authenticated but lacking required role
    if (requiredRoles.length > 0 && !hasRequiredRole) {
      if (fallbackComponent) {
        return <>{fallbackComponent}</>;
      }
      
      return (
        <Box className="container mx-auto p-4">
          <Alert severity="error" className="mb-4">
            <Typography variant="h6">
              Access Denied
            </Typography>
            <Typography variant="body1">
              You don't have permission to access this page.
            </Typography>
          </Alert>
          <Button variant="contained" color="primary" onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </Box>
      );
    }
    
    // User is authenticated and has required role(s)
    return <Component {...props} />;
  };
}

// Usage examples:
// const AdminOnlyPage = withRoleAuth(YourComponent, { requiredRoles: ['Admin'] });
// const EditorOrAdminPage = withRoleAuth(YourComponent, { requiredRoles: ['Editor', 'Admin'] });
// const AuthenticatedOnlyPage = withRoleAuth(YourComponent);