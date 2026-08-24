import { pgTable } from 'drizzle-orm/pg-core';
import { usersTable } from './auth';

export const rfidUidsTable = pgTable('rfid_uids', (t) => ({
  uid: t.text().primaryKey(),
  user_id: t
    .uuid()
    .references(() => usersTable.id)
    .notNull(),
}));
