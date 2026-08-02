import { sql } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import { genders, islamicOrgs, roles } from './enums';
import { timestamps } from './helpers';

export const users = pgTable('users', (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  email: t.text().unique().notNull(),
  username: t.varchar({ length: 255 }).unique().notNull(),
  display_name: t.varchar({ length: 255 }),
  avatar_url: t.text(),
  nis: t.integer(),
  bio: t.text(),
  gender: t.text({ enum: genders }),
  role: t.text({ enum: roles }).notNull(),
  islamic_org: t.text({ enum: islamicOrgs }),
  identity_data: t.jsonb(),
  last_sign_in_at: t.timestamp({ withTimezone: true }),
  google_access_token_hash: t.text(),
  google_access_token_expired_at: t.timestamp({ withTimezone: true }),
  google_refresh_token_hash: t.text(),
  ...timestamps,
}));

export const sessions = pgTable('sessions', (t) => ({
  id: t.uuid().primaryKey().default(sql`uuidv7()`),
  user_id: t
    .uuid()
    .references(() => users.id)
    .notNull(),
  user_agent: t.text(),
  ip: t.inet(),
  refresh_token_hash: t.text().unique().notNull(),
  refreshed_at: t.timestamp({ withTimezone: true }),
  expired_at: t
    .timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now() + INTERVAL '30 days'`),
  ...timestamps,
}));
