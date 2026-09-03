'use client';

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import type * as React from 'react';
import { useEffect, useRef } from 'react';

// next-themes stores per-origin localStorage; web (:3600) and admin (:3620)
// are different origins. Cookies ignore ports on localhost, so mirror the
// theme through a cookie and adopt it on load.
// ponytail: sync-on-load only; storage-event live sync if tabs need it.
const readCookie = () =>
  document.cookie.match(/(?:^|; )theme=([^;]*)/)?.[1];

function ThemeCookieSync() {
  const { theme, setTheme } = useTheme();
  const adopted = useRef(false);

  useEffect(() => {
    if (adopted.current) return;
    adopted.current = true;
    const c = readCookie();
    if (c && c !== theme) setTheme(c);
  }, [theme, setTheme]);

  useEffect(() => {
    if (!adopted.current || !theme) return;
    document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  }, [theme]);

  return null;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeCookieSync />
      {children}
    </NextThemesProvider>
  );
}
