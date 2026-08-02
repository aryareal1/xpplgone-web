import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
};
