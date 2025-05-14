import {defineRouting} from 'next-intl/routing';
import { locales, defaultLng } from '@/i18n/i18nConstants';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales:  locales,
 
  // Used when no locale matches
  defaultLocale: defaultLng
});