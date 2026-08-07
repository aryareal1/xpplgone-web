import { sql } from 'drizzle-orm';
import { timestamp, uuid } from 'drizzle-orm/pg-core';

export const timestamps = {
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
};
export const id = uuid().default(sql`uuidv7()`).primaryKey();