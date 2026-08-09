import crypto from 'node:crypto';
import type { AnySchema, UnwrapSchema } from 'elysia';
import { TZ_OFFSET } from './constants';

/**
 * Token util
 */
export const Token = {
  /**
   * Generate a random 64 bytes base64url token.
   * @returns
   */
  generate() {
    return crypto.randomBytes(64).toString('base64url');
  },
  /**
   * Hash a token using HMAC SHA256.
   * @param token
   * @returns
   */
  hash(token: string) {
    return crypto
      .createHmac('sha256', process.env.HASH_SECRET!)
      .update(token)
      .digest('hex');
  },
};

/**
 * Check if value is a valid UUID.
 * @param value
 */
export function isUUID(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

/**
 * Format a date in WIB as `YYYY-MM-DD`.
 * Shifts by WIB offset so calendar day follows Jakarta time.
 * @param d
 */
export function toDateStr(d: Date = new Date()) {
  return new Date(d.getTime() + TZ_OFFSET * 60_000).toISOString().slice(0, 10);
}

/**
 * Get the hour of day in WIB (0-23).
 * @param d
 */
export function wibHour(d: Date) {
  return new Date(d.getTime() + TZ_OFFSET * 60_000).getUTCHours();
}

// ── types ─────────────────────────────────────────────
export type DeepUnwrap<T> = T extends AnySchema
  ? UnwrapSchema<T>
  : T extends object
    ? { [K in keyof T]: DeepUnwrap<T[K]> }
    : T;
