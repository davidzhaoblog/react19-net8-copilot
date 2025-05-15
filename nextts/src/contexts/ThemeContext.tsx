'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeToggleProvider({ children }: { children: ReactNode }) {
  // Use localStorage to persist theme preference
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load theme preference from localStorage on first render
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    // Check for saved preference or use system preference
    const prefersDark = savedTheme === 'true' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(prefersDark);
    setMounted(true);
  }, []);

  // Create theme based on the current mode
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#f50057',
      },
    },
    components: {
      MuiAppBar: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          },
        },
      },
    },
  });

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem('darkMode', newValue.toString());
      return newValue;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {/* Render children only after we've determined theme from localStorage */}
      {mounted && (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      )}
    </ThemeContext.Provider>
  );
}

export function useThemeToggle() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeToggle must be used within a ThemeToggleProvider');
  }
  return context;
}