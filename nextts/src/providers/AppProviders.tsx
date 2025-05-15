'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeToggleProvider } from '@/contexts/ThemeContext';

interface AppProvidersProps {
  children: ReactNode;
  locale: string;
  messages?: Record<string, any>;
}

export default function AppProviders({ children, locale, messages = {} }: AppProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeToggleProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeToggleProvider>
    </NextIntlClientProvider>
  );
}