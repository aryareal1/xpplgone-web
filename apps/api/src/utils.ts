import type { ElysiaCookie } from 'elysia/cookies';

/**
 * Frontend web url.
 */
export const webUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.WEB_URL
    : 'http://localhost:3600';

/**
 * Default cookie properties.
 */
export const cookieDefaults = {
  secure: true,
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 15,
} as const satisfies ElysiaCookie;
