import {defineRouting} from 'next-intl/routing';
import { locales, defaultLng } from '@/utils/locale';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales:  locales,
 
  // Used when no locale matches
  defaultLocale: defaultLng,

// If this locale is matched, pathnames work without a prefix
  localePrefix: 'always'
});