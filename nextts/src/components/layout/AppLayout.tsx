'use client';

import { useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Box, Toolbar, Container } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import AppDrawer from './AppDrawer';
import AppBar from './AppBar';

const drawerWidth = 240;

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  // Close drawer when navigating to a new page on mobile
  useEffect(() => {
    if (window.innerWidth < 900) {
      setOpen(false);
    }
  }, [pathname]);

  // Persist drawer state in localStorage
  useEffect(() => {
    // Load drawer state from localStorage on first render
    const savedDrawerState = localStorage.getItem('drawerOpen');
    if (savedDrawerState !== null) {
      setOpen(savedDrawerState === 'true');
    } else {
      // Default to open on desktop, closed on mobile
      setOpen(window.innerWidth >= 900);
    }
  }, []);

  // Save drawer state when it changes
  useEffect(() => {
    localStorage.setItem('drawerOpen', open.toString());
  }, [open]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar 
        open={open} 
        drawerWidth={drawerWidth} 
        onDrawerToggle={handleDrawerToggle} 
      />
      
      {/* Drawer */}
      {open && isAuthenticated && <AppDrawer 
        open={open} 
        drawerWidth={drawerWidth} 
        onDrawerToggle={handleDrawerToggle}
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
      />
      }

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: theme => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* This provides spacing below the AppBar */}
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}