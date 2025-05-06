import { createTheme, CssBaseline, PaletteMode, Theme, ThemeProvider } from '@mui/material'
import './App.css'
import MainRoutes from './routes/MainRoutes'
import { useState } from 'react'
import { getThemeDesignTokens } from './types/ThemeRelated'

function App() {
    const [currentTheme, _] = useState<Theme>(createTheme(getThemeDesignTokens('light' as unknown as PaletteMode)))

    return (
        <div className="App">
            <ThemeProvider theme={currentTheme}>
                <CssBaseline />
                <MainRoutes></MainRoutes>
            </ThemeProvider>
        </div>
    )
}

export default App
