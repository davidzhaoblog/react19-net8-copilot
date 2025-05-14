// src/components/TranslatedText.tsx
"use client";

import { useTranslations } from 'next-intl';
import { JSX } from 'react';

type TranslatedTextProps = {
  namespace: string;
  id: string;
  params?: Record<string, string | number>;
  className?: string;
  component?: keyof JSX.IntrinsicElements;
};

/**
 * A component to easily use translations in both client and server components.
 * Usage: <TranslatedText namespace="app.common" id="welcome" component="h1" className="text-xl" />
 */
export default function TranslatedText({ 
  namespace, 
  id, 
  params, 
  className = '',
  component: Component = 'span'
}: TranslatedTextProps) {
  const t = useTranslations(namespace);
  
  return (
    <Component className={className}>
      {t(id, params)}
    </Component>
  );
}
