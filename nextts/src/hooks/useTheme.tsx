'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize theme from localStorage or default to 'system'
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  
  // Effect to initialize theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      setTheme(storedTheme);
    }
  }, []);
  
  // Effect to apply theme changes
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Determine the resolved theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateResolvedTheme = () => {
      const resolved = theme === 'system' 
        ? (mediaQuery.matches ? 'dark' : 'light') 
        : theme;
      
      setResolvedTheme(resolved);
      
      // Add or remove the 'dark' class on the document
      if (resolved === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    };
    
    // Initial update
    updateResolvedTheme();
    
    // Listen for changes in system preference
    mediaQuery.addEventListener('change', updateResolvedTheme);
    
    return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}