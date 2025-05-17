// src/i18n/index.ts
import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

 
export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Load messages for the requested locale
  let messages;
  try {
    messages = (await import(`@/i18n/messages/${locale}.json`)).default;
    // console.log(`Loaded messages for locale: ${locale}`, messages);
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Fallback to empty messages rather than crashing
    messages = {};
  }

  return {
    locale,
    messages,
    // // You can add date, number, and time formats here too
    // timeZone: 'UTC',
  };
});