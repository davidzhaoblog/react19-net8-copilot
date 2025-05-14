// src/i18n/index.ts
import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';
 
export const locales = ['en', 'es', 'fr'];
export const defaultLng = 'en';
export const fallbackLng = 'en';

 
export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
 
    console.log('Locale:', locale);
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});