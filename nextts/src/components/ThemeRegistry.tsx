'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { NextAppDirEmotionCacheProvider } from './EmotionCache';

// MUI theme configuration
const theme = createTheme({
  // You can customize your MUI theme here
  typography: {
    fontFamily: 'var(--font-geist-sans)',
  },
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: '#1976d2',
    },
  },
  // This ensures that MUI's styling won't conflict with Tailwind
  components: {
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

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline is equivalent to a global CSS reset */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}