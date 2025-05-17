'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { NextIntlClientProvider } from 'next-intl';
import ThemeRegistryWithProvider from '@/components/ThemeRegistry';

interface AppProvidersProps {
    children: ReactNode;
    locale: string;
    messages?: Record<string, any>;
}

export default function AppProviders({ children, locale, messages = {} }: AppProvidersProps) {
    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider>
                <ThemeRegistryWithProvider>
                    {children}
                </ThemeRegistryWithProvider>
            </AuthProvider>
        </NextIntlClientProvider>
    );
}