import { useState } from 'react'
import { createTheme, CssBaseline, PaletteMode, Theme, ThemeProvider } from '@mui/material'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './App.css'
import MainRoutes from './routes/MainRoutes'
import { getThemeDesignTokens } from './types/ThemeRelated'

const queryClient = new QueryClient();

function App() {
    const [currentTheme, _] = useState<Theme>(createTheme(getThemeDesignTokens('light' as unknown as PaletteMode)))

    return (
        <div className="App">
            <ThemeProvider theme={currentTheme}>
                <CssBaseline />
                <QueryClientProvider client={queryClient}>
                    <MainRoutes></MainRoutes>
                </QueryClientProvider>
            </ThemeProvider>
        </div>
    )
}

export default App
