'use client';

// src/app/[locale]/page.tsx
import { useTranslations } from 'next-intl';
import Image from "next/image";
import MuiWithTailwind from "@/components/MuiWithTailwind";
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Paper, Skeleton, Typography } from '@mui/material';
import { Suspense } from 'react';
import ClientAuthCheck from '@/components/auth/ClientAuthCheck';
import AuthenticatedHomeContent from '@/components/home/AuthenticatedHomeContent';
import GuestHomeContent from '@/components/home/GuestHomeContent';

export default function Home() {
    const t = useTranslations('app');
    const { isAuthenticated } = useAuth();

    return (
        <>
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-3xl font-bold">{t('common.welcome')}</h1>
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

            <Paper className="p-4 mb-4">
                <Typography variant="body1">
                    This application demonstrates a modern web app with Next.js, Material UI, and ASP.NET Core backend.
                </Typography>
            </Paper>

            <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
                <ClientAuthCheck
                    authenticatedContent={<AuthenticatedHomeContent />}
                    guestContent={<GuestHomeContent />}
                />
            </Suspense>
        </>
    );
}
