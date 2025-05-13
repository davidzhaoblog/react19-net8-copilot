import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


import MainRoutes from './routes/MainRoutes'
import { ThemeProviderWithContext } from './contexts/ThemeContext'
import { CssBaseline } from '@mui/material';
import { LanguageProvider } from '@/contexts/LanguageContext';

const queryClient = new QueryClient();

function App() {
    return (
        <div className="App">
            <LanguageProvider> {/* Wrap the app with LanguageProvider */}
            <ThemeProviderWithContext>
                <CssBaseline />
                <QueryClientProvider client={queryClient}>
                    <MainRoutes></MainRoutes>
                </QueryClientProvider>
            </ThemeProviderWithContext>
            </LanguageProvider>
        </div>
    )
}

export default App
