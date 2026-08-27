import { treaty } from '@elysia/eden';
import type { App } from '@be/app';

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
  // Eden coerces date-like strings into Date, including the `date` column which
  // is typed as a string in the schema. Disabled so responses match their types.
  parseDate: false,
});

// Turn a filename from POST /s3/upload into a URL usable in <img src>.
export const fileUrl = (name: string) =>
  /^https?:\/\//.test(name) ? name : `${API_URL}/s3/${name}`;

export default api;
