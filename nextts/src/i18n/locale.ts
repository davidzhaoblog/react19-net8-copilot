// src/utils/locale.ts

export const locales = ['en', 'es', 'fr'];
export const defaultLng = 'en';
export const fallbackLng = 'en';

/**
 * Detects the user's preferred language from browser settings
 * Falls back to default if not supported
 */
export function detectUserLanguage(
  supportedLocales: string[] = locales,
  defaultLocale: string = defaultLng
): string {
  // Only run on client
  if (typeof window === 'undefined') {
    return defaultLocale;
  }

  // Get browser language (e.g., 'en-US' -> 'en')
  const browserLang = navigator.language.split('-')[0];
  
  // Check if browser language is supported
  if (supportedLocales.includes(browserLang)) {
    return browserLang;
  }
  
  // Fall back to default
  return defaultLocale;
}
