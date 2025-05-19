'use client';

import { useState, useEffect, ReactNode, memo } from 'react';
import { usePathname } from 'next/navigation';
import { Box, Toolbar, Container, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import AppDrawer from '@/components/layout/AppDrawer';
import AppBar from '@/components/layout/AppBar';
import ErrorBoundary from '@/components/ErrorBoundary';

const drawerWidth = 240;

interface AppLayoutProps {
    children: ReactNode;
}

export default memo(function AppLayout({ children }: AppLayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    console.log('isMobile:', isMobile);

    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useAuth();

    // Close drawer when navigating to a new page on mobile
    useEffect(() => {
        if (isMobile) {
            setOpen(false);
        }
    }, [pathname, isMobile]);

    // Persist drawer state in localStorage
    useEffect(() => {
        // Only load from localStorage on first render
        const savedDrawerState = localStorage.getItem('drawerOpen');
        if (savedDrawerState !== null) {
            setOpen(savedDrawerState === 'true' && !isMobile);
        }
    }, [isMobile]);

    // Add this effect to handle window resizing
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 900 && open) {
                setOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [open]);

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

    // Handle window resize
    useEffect(() => {
        if (isMobile && open) {
            setOpen(false);
        }
    }, [isMobile, open]);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* App Bar */}
            <AppBar
                open={open && isAuthenticated}
                drawerWidth={drawerWidth}
                onDrawerToggle={handleDrawerToggle}
                aria-expanded={open && isAuthenticated}
            />

            {/* Drawer */}
            {<AppDrawer
                open={open && isAuthenticated}
                drawerWidth={drawerWidth}
                onDrawerToggle={handleDrawerToggle}
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
                aria-hidden={!open || !isAuthenticated}
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
                {isLoading ? (
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
    <CircularProgress />
  </Box>
) : (
                <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </Container>
)}
            </Box>
        </Box>
    );
});