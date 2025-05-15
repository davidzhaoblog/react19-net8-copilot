// src/app/[locale]/layout.tsx
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono } from "next/font/google";
import ThemeRegistry from "@/components/ThemeRegistry";
import "../globals.css";
import { locales } from '@/utils/locale';
import {routing} from '@/i18n/routing';
import ThemeRegistryWithProvider from '@/components/ThemeRegistry';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
 
export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}
 
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
 
  // Load messages for the current locale
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
 
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeRegistryWithProvider>
            {children}
          </ThemeRegistryWithProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
