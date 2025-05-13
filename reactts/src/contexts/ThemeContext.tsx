import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createTheme, ThemeProvider, PaletteMode } from '@mui/material';
import { getThemeDesignTokens } from '@/types/ThemeRelated'; // Adjust the import path if necessary

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextProps {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProviderWithContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<ThemeMode>(() => {
        const savedMode = localStorage.getItem('themeMode') as ThemeMode;
        return savedMode || 'system';
    });

    const currentMode: PaletteMode = useMemo(() => {
        if (mode === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return mode;
    }, [mode]);

    useEffect(() => {
        const root = window.document.documentElement;

        if (mode === 'system') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.toggle('dark', systemDark);
        } else {
            root.classList.toggle('dark', mode === 'dark');
        }
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const theme = useMemo(() => createTheme(getThemeDesignTokens(currentMode)), [currentMode]);

    return (
        <ThemeContext.Provider value={{ mode, setMode }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = (): ThemeContextProps => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProviderWithContext');
    }
    return context;
};