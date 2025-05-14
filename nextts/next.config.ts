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

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);