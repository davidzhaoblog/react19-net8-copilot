// middleware.ts (in your project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales } from '@/i18n/locale'; // Adjust path as needed
import {routing} from './i18n/routing';

// Combine i18n middleware with auth protection
const intlMiddleware = createMiddleware(routing);

// Define protected routes (patterns that require authentication)
const PROTECTED_ROUTES = [
  '/Identity/Profile',
  '/Identity/ChangePassword',
  '/Identity/PersonalData',
  '/Identity/TwoFactorAuthentication',
  '/Identity/ExternalLogins',
  '/Dashboard'
];

export default async function middleware(request: NextRequest) {
  // Get the path that will be processed by the intl middleware

  console.log('Original URL:', request.nextUrl.pathname);
  const response = intlMiddleware(request);
    
  // If the response is a redirect, log it
  if (response instanceof NextResponse && response.headers.get('Location')) {
    console.log('Redirecting to:', response.headers.get('Location'));
  }
  
  const pathname = request.nextUrl.pathname;

  // Check if the route requires authentication
  const requiresAuth = PROTECTED_ROUTES.some(route => {
    // Check if any locale + protected route matches the pathname
    return locales.some(locale => 
      pathname.startsWith(`/${locale}${route}`)
    );
  });

  if (requiresAuth) {
    // Check for auth token in cookies
    const accessToken = request.cookies.get('access_token')?.value;
    
    if (!accessToken) {
      // Get locale from path or default to 'en'
      const locale = pathname.split('/')[1] || 'en';
      
      // Redirect to login with return URL
      const url = new URL(`/${locale}/Identity/Login`, request.url);
      url.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return response;
}

export const config = {
  // Only run middleware on the pages that may require auth checking
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};