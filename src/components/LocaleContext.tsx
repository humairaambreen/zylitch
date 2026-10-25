'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SupportedLocale, SUPPORTED_LOCALES, LOCALE_LABELS } from '@/lib/seo';
import { getDictionary, I18nDictionary } from '@/lib/i18n';

interface LocaleContextType {
  locale: SupportedLocale;
  setLocale: (newLocale: SupportedLocale) => void;
  dict: I18nDictionary;
  supportedLocales: readonly SupportedLocale[];
  localeLabels: typeof LOCALE_LABELS;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  setLocale: () => {},
  dict: getDictionary('en'),
  supportedLocales: SUPPORTED_LOCALES,
  localeLabels: LOCALE_LABELS,
});

export function LocaleProvider({
  children,
  initialLocale = 'en',
}: {
  children: React.ReactNode;
  initialLocale?: string;
}) {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    if (typeof window !== 'undefined') {
      const segs = window.location.pathname.split('/').filter(Boolean);
      if (segs[0] && SUPPORTED_LOCALES.includes(segs[0] as SupportedLocale)) {
        return segs[0] as SupportedLocale;
      }
    }
    if (SUPPORTED_LOCALES.includes(initialLocale as SupportedLocale)) {
      return initialLocale as SupportedLocale;
    }
    return 'en';
  });

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    setLocaleState(newLocale);

    if (typeof window !== 'undefined') {
      document.cookie = `zylitch_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = newLocale;

      // Seamlessly update browser URL subpath without full page reload
      const pathname = window.location.pathname;
      const segments = pathname.split('/').filter(Boolean);
      const isSubpathLocale = SUPPORTED_LOCALES.includes(segments[0] as SupportedLocale);
      const remaining = isSubpathLocale ? segments.slice(1).join('/') : segments.join('/');

      let targetUrl = '';
      if (newLocale === 'en') {
        targetUrl = remaining ? `/${remaining}` : '/';
      } else {
        targetUrl = remaining ? `/${newLocale}/${remaining}` : `/${newLocale}`;
      }

      if (window.location.pathname !== targetUrl) {
        window.history.pushState(null, '', targetUrl + window.location.search + window.location.hash);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. First priority: Check URL subpath (/ko, /ja, etc.)
    const segs = window.location.pathname.split('/').filter(Boolean);
    if (segs[0] && SUPPORTED_LOCALES.includes(segs[0] as SupportedLocale)) {
      const urlLocale = segs[0] as SupportedLocale;
      setLocaleState(urlLocale);
      document.documentElement.lang = urlLocale;
      return;
    }

    // 2. Second priority: Read from cookie if present
    const match = document.cookie.match(/(?:^|;\s*)zylitch_locale=([^;]*)/);
    if (match && SUPPORTED_LOCALES.includes(match[1] as SupportedLocale)) {
      setLocaleState(match[1] as SupportedLocale);
      document.documentElement.lang = match[1];
      return;
    }

    // 3. Fallback: Detect via GeoIP API
    fetch('/api/geo')
      .then((res) => res.json())
      .then((data) => {
        if (data.locale && SUPPORTED_LOCALES.includes(data.locale as SupportedLocale)) {
          setLocaleState(data.locale as SupportedLocale);
          document.documentElement.lang = data.locale;
        }
      })
      .catch(() => {});

    // Listen for browser Back/Forward navigation
    const handlePopState = () => {
      const currentSegs = window.location.pathname.split('/').filter(Boolean);
      if (currentSegs[0] && SUPPORTED_LOCALES.includes(currentSegs[0] as SupportedLocale)) {
        setLocaleState(currentSegs[0] as SupportedLocale);
        document.documentElement.lang = currentSegs[0];
      } else {
        setLocaleState('en');
        document.documentElement.lang = 'en';
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const dict = getDictionary(locale);

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        dict,
        supportedLocales: SUPPORTED_LOCALES,
        localeLabels: LOCALE_LABELS,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

/**
 * Minimal Editorial Text Language Selector
 */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale, supportedLocales, localeLabels } = useLocale();

  return (
    <nav className={`lang-switcher-root ${className}`} aria-label="Language Selector">
      <div className="lang-text-list">
        {supportedLocales.map((loc) => {
          const isActive = loc === locale;
          const info = localeLabels[loc];
          return (
            <button
              key={loc}
              type="button"
              onClick={() => setLocale(loc)}
              className={`lang-text-btn ${isActive ? 'is-active' : ''}`}
              aria-current={isActive ? 'true' : undefined}
            >
              {info.native}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
