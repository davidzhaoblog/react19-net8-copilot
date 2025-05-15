'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@mui/material';

interface ClientAuthCheckProps {
  authenticatedContent: ReactNode;
  guestContent: ReactNode;
  loadingContent?: ReactNode;
}

export default function ClientAuthCheck({ 
  authenticatedContent, 
  guestContent, 
  loadingContent 
}: ClientAuthCheckProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return loadingContent || <Skeleton variant="rectangular" height={300} />;
  }

  return isAuthenticated ? authenticatedContent : guestContent;
}