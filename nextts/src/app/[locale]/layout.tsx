// src/app/[locale]/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { locales } from '@/i18n/locale';
import ThemeRegistryWithProvider from '@/components/ThemeRegistry';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import AppProviders from '@/providers/AppProviders';
import AppLayout from '@/components/layout/AppLayout';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
    return locales.map(locale => ({ locale }));
}

export default async function RootLayout({
    children,
    params
}: {
    children: ReactNode;
    params: { locale: string };
}) {
    const { locale } = await params;
    const messages = (await import(`@/i18n/messages/${locale}.json`)).default;

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={inter.className}>
                <AppProviders locale={locale} messages={messages}>
                    <AppLayout>
                            <div className="content-start items-center justify-items-center">
                                <main className="flex flex-col row-start-2 content-start items-start sm:items-start">
                                    {children}
                                </main>
                            </div>
                    </AppLayout>
                </AppProviders>
            </body>
        </html>
    );
}
