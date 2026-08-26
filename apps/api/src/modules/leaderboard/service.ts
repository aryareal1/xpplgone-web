import { toDateStr, wibHour } from '@be/lib/utils';
import { checkinsTable, db, habitJournalsTable } from '@xirpl/db';
import { and, between, gte, inArray } from 'drizzle-orm';
import { User } from '../user/service';

type JournalRow = typeof habitJournalsTable.$inferSelect;

const DAY_MS = 86_400_000;
const RETRO = 180; // streak window in days

/** Late if check-in hour in WIB is at/after this, per type. */
const LATE_HOURS: Record<'school' | 'morning', number> = {
  school: 7,
  morning: 6,
};
const isLate = (at: Date | null, type: 'school' | 'morning') =>
  !!at && wibHour(at) >= LATE_HOURS[type];

/** `YYYY-MM` -> inclusive `{ first, last }` bounds of that month. */
const monthBounds = (month: string) => {
  const [y = 0, m = 0] = month.split('-').map(Number);
  const last = new Date(y, m, 0).getDate();
  return {
    first: `${month}-01`,
    last: `${month}-${String(last).padStart(2, '0')}`,
  };
};

/** Days of `month` that have already happened (today inclusive). */
const elapsedDays = (month: string) => {
  const today = toDateStr();
  if (month > today.slice(0, 7)) return 0;
  const [y = 0, m = 0] = month.split('-').map(Number);
  const full = new Date(y, m, 0).getDate();
  return month === today.slice(0, 7)
    ? Math.min(full, Number(today.slice(8, 10)))
    : full;
};

/**
 * Module completion for one day; mirrors `moduleDone` in the journal service:
 * a module only counts when its proof is present.
 */
const moduleDone = (row: JournalRow | undefined, hasCheckin: boolean) => ({
  checkins: hasCheckin,
  prays: !!(
    row?.prayed_dhuha &&
    row.prayed_tahajud &&
    row.prayed_qabliyah_fajr &&
    row.prayed_badiyah_isya
  ),
  sports: row?.did_sport === true && !!row.sport_proof_url,
  studies:
    row?.did_study === true &&
    !!row.study_start_proof_url &&
    !!row.study_end_proof_url,
});

export const Leaderboard = {
  /**
   * Students ranked by monthly points — every finished module is worth 25 per
   * day, so a perfect day earns 100 — each with their current streak.
   */
  async getBoard(month: string) {
    const students = await User.getStudents();
    const ids = students.map((s) => s.id);
    const today = toDateStr();
    const { first, last } = monthBounds(month);
    const retroStart = toDateStr(
      new Date(new Date(`${today}T00:00:00`).getTime() - (RETRO - 1) * DAY_MS),
    );

    const [jrows, crows, hrows] = await Promise.all([
      ids.length
        ? db
            .select()
            .from(habitJournalsTable)
            .where(
              and(
                inArray(habitJournalsTable.user_id, ids),
                between(habitJournalsTable.date, first, last),
              ),
            )
        : [],
      ids.length
        ? db
            .select({
              date: checkinsTable.date,
              user_id: checkinsTable.user_id,
            })
            .from(checkinsTable)
            .where(
              and(
                inArray(checkinsTable.user_id, ids),
                between(checkinsTable.date, first, last),
              ),
            )
        : [],
      ids.length
        ? db
            .select({
              user_id: checkinsTable.user_id,
              date: checkinsTable.date,
              checked_in_at: checkinsTable.checked_in_at,
              type: checkinsTable.type,
            })
            .from(checkinsTable)
            .where(
              and(
                inArray(checkinsTable.user_id, ids),
                gte(checkinsTable.date, retroStart),
              ),
            )
        : [],
    ]);

    const jByUser = new Map<string, Map<string, JournalRow>>();
    for (const r of jrows) {
      if (!jByUser.has(r.user_id)) jByUser.set(r.user_id, new Map());
      jByUser.get(r.user_id)!.set(r.date, r);
    }
    const checkedByUser = new Map<string, Set<string>>();
    for (const r of crows) {
      if (!checkedByUser.has(r.user_id))
        checkedByUser.set(r.user_id, new Set());
      checkedByUser.get(r.user_id)!.add(r.date);
    }
    const onTimeByUser = new Map<string, Set<string>>();
    for (const r of hrows) {
      if (isLate(r.checked_in_at, r.type)) continue;
      if (!onTimeByUser.has(r.user_id)) onTimeByUser.set(r.user_id, new Set());
      onTimeByUser.get(r.user_id)!.add(r.date);
    }

    const cap = elapsedDays(month);
    const todayMs = new Date(`${today}T00:00:00`).getTime();

    const entries = students.map((s) => {
      const journals = jByUser.get(s.id) ?? new Map();
      const checked = checkedByUser.get(s.id) ?? new Set();
      let points = 0;
      for (let d = 1; d <= cap; d++) {
        const date = `${month}-${String(d).padStart(2, '0')}`;
        const md = moduleDone(journals.get(date), checked.has(date));
        points +=
          (Number(md.checkins) +
            Number(md.prays) +
            Number(md.sports) +
            Number(md.studies)) *
          25;
      }

      // Same semantics as Checkins.getStreak: consecutive on-time days ending
      // at the most recent on-time check-in.
      const set = onTimeByUser.get(s.id) ?? new Set();
      const done: boolean[] = [];
      for (let i = 0; i < RETRO; i++)
        done.push(set.has(toDateStr(new Date(todayMs - i * DAY_MS))));
      let streak = 0;
      for (let i = done[0] ? 0 : 1; i < done.length && done[i]; i++) streak++;

      return {
        user_id: s.id,
        nis: s.nis,
        name: s.name,
        avatar_url: s.avatar_url,
        streak,
        points,
      };
    });

    entries.sort(
      (a, b) => b.points - a.points || b.streak - a.streak || a.nis - b.nis,
    );
    return { month, entries: entries.map((e, i) => ({ ...e, rank: i + 1 })) };
  },
};
