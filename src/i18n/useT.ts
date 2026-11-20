import { useCallback } from 'react';
import { es } from './es';
import { en } from './en';
import { useAppStore } from '../store/useAppStore';
import type { Locale } from '../types';

const DICTIONARIES: Record<Locale, Record<string, Record<string, string>>> = {
  es,
  en,
};

export function translate(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>
): string {
  const [section, field] = key.split('.');
  const dict = DICTIONARIES[locale] ?? DICTIONARIES.es;
  let text = dict[section]?.[field] ?? DICTIONARIES.es[section]?.[field] ?? key;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return text;
}

export function useT() {
  const locale = useAppStore((s) => s.settings?.locale ?? 'es');
  return useCallback(
    (key: string, params?: Record<string, string | number>) => translate(locale, key, params),
    [locale]
  );
}
