import { pgTable, unique } from 'drizzle-orm/pg-core';
import { usersTable } from './auth';
import { id, timestamps } from './helpers';

export const habitJournalsTable = pgTable(
  'habit_journals',
  (t) => ({
    id,
    user_id: t
      .uuid()
      .references(() => usersTable.id)
      .notNull(),
    date: t.date().notNull(),

    prayed_dhuha: t.boolean(),
    prayed_tahajud: t.boolean(),
    prayed_qabliyah_fajr: t.boolean(),
    prayed_badiyah_isya: t.boolean(),

    did_sport: t.boolean(),
    sport_type: t.text(),
    sport_duration: t.interval(),
    sport_proof_url: t.text(),

    did_study: t.boolean(),
    study_about: t.text(),
    study_media: t.text(),
    study_start_proof_url: t.text(),
    study_end_proof_url: t.text(),

    ...timestamps,
  }),
  (c) => [unique().on(c.user_id, c.date)],
);

export const attendancesTable = pgTable(
  'attendances',
  (t) => ({
    id,
    user_id: t
      .uuid()
      .references(() => usersTable.id)
      .notNull(),
    date: t.date().notNull(),
    checked_in_at: t.timestamp({ withTimezone: true }).notNull(),
    checked_out_at: t.timestamp({ withTimezone: true }).notNull(),
    ...timestamps,
  }),
  (c) => [unique().on(c.user_id, c.date)],
);
