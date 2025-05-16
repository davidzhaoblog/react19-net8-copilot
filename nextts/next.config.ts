import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// Globalization:
export const locales = ['en', 'es', 'fr'];
export const defaultLng = 'en';
export const fallbackLng = 'en';


// Port configuration is NOT set here - it should be set in package.json scripts
// or with environment variables
const nextConfig: NextConfig = {
  /* config options here */
  

};

// we are using './src/i18n/index.ts' as shared translation file,
// in case we want to use a different file for server and client
// you can add './src/i18n/server.ts' for server and './src/i18n/client.ts' for client
// const withNextIntl = createNextIntlPlugin()
const withNextIntl = createNextIntlPlugin('./src/i18n/index.ts')
export default withNextIntl(nextConfig);