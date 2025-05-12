import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';

import "./i18n";

import './index.css'
import App from './App.tsx'
import store from './store/Store.ts';
import { StyledEngineProvider } from '@mui/material';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StyledEngineProvider injectFirst>
        <GoogleOAuthProvider clientId="231032877404-lnl95rkjik29sdfg2bbq2pjm1a249eg8.apps.googleusercontent.com">
            <BrowserRouter>
                <Provider store={store}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <App />
                    </LocalizationProvider>
                </Provider>
            </BrowserRouter>
        </GoogleOAuthProvider>
        </StyledEngineProvider>
    </StrictMode>,
)