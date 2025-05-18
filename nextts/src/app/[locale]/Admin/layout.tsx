// src/app/[locale]/Admin/layout.tsx
import { redirect } from 'next/navigation';
import universalCookies from '@/services/universalCookieService';
import { useAuth } from '@/contexts/AuthContext';
import tokenService from '@/services/tokenService';

export default function AdminLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const { user, hasRole } = useAuth();
    const accessToken = tokenService.getAccessToken();
    const tokenExpiry = tokenService.getTokenExpiry();

    if (!accessToken) {
        redirect(`/${locale}/Identity/Login?returnUrl=${encodeURIComponent(`/${locale}/Admin`)}`);
    }

    try {
        const isAdmin = hasRole('Admin') || false;

        if (!isAdmin) {
            redirect(`/${locale}/Forbidden`);
        }

        // Check expiration
        if (tokenExpiry < Math.floor(Date.now() / 1000)) {
            redirect(`/${locale}/Identity/Login?returnUrl=${encodeURIComponent(`/${locale}/Admin`)}`);
        }

        return <>{children}</>;
    } catch (error) {
        redirect(`/${locale}/Identity/Login?returnUrl=${encodeURIComponent(`/${locale}/Admin`)}`);
    }
}