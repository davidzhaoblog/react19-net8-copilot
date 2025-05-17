'use client';

import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { NextAppDirEmotionCacheProvider } from './EmotionCache';
import { ThemeProvider } from '@/hooks/useTheme';
import { useTheme } from '@/hooks/useTheme';
import { useEffect } from 'react';

// This component is used inside the ThemeProvider, so it can use the useTheme hook
function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  
  // Create theme based on the resolved theme (light or dark)
  const theme = createTheme({
    palette: {
      mode: resolvedTheme,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      // You can add more custom colors based on the theme
      ...(resolvedTheme === 'dark' ? {
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
     } : {}),
    },
    typography: {
      fontFamily: 'var(--font-geist-sans)',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          // Export theme colors as CSS variables for Tailwind to use
          ':root': {
            '--mui-primary': '#1976d2',
            '--mui-secondary': '#dc004e',
            '--mui-background-default': resolvedTheme === 'dark' ? '#121212' : '#ffffff',
            '--mui-background-paper': resolvedTheme === 'dark' ? '#1e1e1e' : '#ffffff',
            '--mui-text-primary': resolvedTheme === 'dark' ? '#ffffff' : '#000000',
          }
        }
      },
      MuiPopover: {
        defaultProps: {
          container: () => document.getElementById('__next'),
        },
      },
      MuiPopper: {
        defaultProps: {
          container: () => document.getElementById('__next'),
        },
      },
      MuiDialog: {
        defaultProps: {
          container: () => document.getElementById('__next'),
        },
      },
    },
  });

  // Sync MUI theme with Tailwind dark mode
  useEffect(() => {
    // Toggle the 'dark' class on html element based on the theme
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}

// This wrapper ensures the ThemeProvider is used
export default function ThemeRegistryWithProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeRegistry>{children}</ThemeRegistry>
    </ThemeProvider>
  );
}