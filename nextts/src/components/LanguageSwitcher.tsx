// src/components/LanguageSwitcher.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { locales } from '@/i18n/i18nConstants';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const handleChange = (event: any) => {
    const newLocale = event.target.value;
    
    // Get the path without the locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    
    // Construct the new path with the new locale
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    // Navigate to the new path
    router.push(newPath);
  };
  
  const languageNames: Record<string, string> = {
    en: 'English',
    fr: 'Français',
    es: 'Español',
    de: 'Deutsch',
    ja: '日本語',
  };
  
  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="language-select-label">Language</InputLabel>
      <Select
        labelId="language-select-label"
        id="language-select"
        value={locale}
        onChange={handleChange}
        label="Language"
      >
        {locales.map((loc) => (
          <MenuItem key={loc} value={loc}>
            {languageNames[loc] || loc}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
