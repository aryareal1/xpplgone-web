import { treaty } from '@elysiajs/eden';
import type { App } from '@xirpl/api';

export const API_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.API_URL!
    : 'http://localhost:3601';

// Dedupe concurrent refresh calls (multiple 401s at once).
let refreshing: Promise<boolean> | null = null;

async function refreshAccessToken() {
  if (!refreshing) {
    refreshing = fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => res.ok)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const res = await fetch(input, init);
  if (res.status !== 401) return res;

  const url =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.href
        : input.url;
  // Don't retry the refresh call itself.
  if (url.endsWith('/auth/refresh')) return res;

  // Session expired → try refreshing once, then replay the request.
  if (await refreshAccessToken()) return fetch(input, init);
  return res;
}) as typeof fetch;

const api = treaty<App>(API_URL, {
  fetch: { credentials: 'include' },
  fetcher,
});

export default api;
