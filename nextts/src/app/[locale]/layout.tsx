import { locales } from '@/i18n/locale';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import AppProviders from '@/providers/AppProviders';
import AppLayout from '@/components/layout/AppLayout';
import "../globals.css";
import QueryProvider from '@/providers/QueryProvider';

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
    const messages = (await import(`../../i18n/messages/${locale}.json`)).default;

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={inter.className}>
                <AppProviders locale={locale} messages={messages}>
                    <QueryProvider>
                        <AppLayout>
                            <div className="content-start items-center justify-items-center">
                                <main className="flex flex-col row-start-2 content-start items-start sm:items-start">
                                    {children}
                                </main>
                            </div>
                        </AppLayout>
                    </QueryProvider>
                </AppProviders>
            </body>
        </html>
    );
}
