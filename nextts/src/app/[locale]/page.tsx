'use client';

// src/app/[locale]/page.tsx
import { useTranslations } from 'next-intl';
import Image from "next/image";
import MuiWithTailwind from "@/components/MuiWithTailwind";
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import Link from 'next/link';
import { useAuthenticatedApi } from '@/hooks/useAuthenticatedApi';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const t = useTranslations('app');
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold">{t('common.welcome')}</h1>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
        
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        {/* MUI with Tailwind CSS Example */}
        <MuiWithTailwind />
        { 
            !isAuthenticated && <Link href={'/Identity/Login'} >Log In</Link>
        }
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            {t('common.description')}{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/[locale]/page.tsx
            </code>
            .
          </li>
        </ol>
      </main>
    </div>
  );
}
