import { treaty } from '@elysia/eden';
import type { App } from '@xirpl/api';

export const API_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL!
    : 'http://localhost:3601';

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
  if (url.endsWith('/auth/refresh')) return res;

  if (await refreshAccessToken()) return fetch(input, init);
  return res;
}) as typeof fetch;

// @ts-expect-error idk why type App is fighting.
const api = treaty<App>(API_URL, {
  fetch: { credentials: 'include' },
  fetcher,
  // Eden mengubah string mirip tanggal jadi Date, termasuk kolom `date` yang
  // di skema bertipe string. Dimatikan supaya respons sama dengan tipenya.
  parseDate: false,
});

// Nama file dari POST /s3/upload jadi URL yang bisa dipakai <img src>.
export const fileUrl = (name: string) =>
  /^https?:\/\//.test(name) ? name : `${API_URL}/s3/${name}`;

export default api;
