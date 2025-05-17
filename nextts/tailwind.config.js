/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  // ...rest of your config
  theme: {
    extend: {
      colors: {
        // Optionally use MUI theme colors in Tailwind
        'mui-primary': 'var(--mui-primary)',
        'mui-secondary': 'var(--mui-secondary)',
        'mui-bg': 'var(--mui-background-default)',
        'mui-paper': 'var(--mui-background-paper)',
        'mui-text': 'var(--mui-text-primary)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [],
  // Important: This ensures MUI styles take precedence over Tailwind
  // only when needed
  corePlugins: {
    preflight: false,
  },
}