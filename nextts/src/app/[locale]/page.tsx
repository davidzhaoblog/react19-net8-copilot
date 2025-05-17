// src/app/[locale]/page.tsx
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import HomePageClient from '@/components/home/HomePageClient';

export async function generateMetadata({ params: { locale } }: { 
  params: { locale: string } 
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'app' });
  
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    // You can add other metadata here
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      // ...other OG fields
    }
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
  return <HomePageClient locale={locale} />;
}
