import { checkinsTable, db, habitJournalsTable } from '@xirpl/db';
import { and, between, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { toDateStr, wibHour } from '@be/lib/utils';
import { User } from '../user/service';
import type { JournalModel } from './model';

type JournalRow = typeof habitJournalsTable.$inferSelect;
type CheckinRow = typeof checkinsTable.$inferSelect;

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
 * One student's month totals: per-day score (0-100), module counts, perfect
 * days and late check-ins.
 */
const monthlySummary = (
  month: string,
  journals: Map<string, JournalRow>,
  checkins: Map<string, CheckinRow>,
) => {
  const cap = elapsedDays(month);
  const days: { date: string; score: number }[] = [];
  const counts = { checkins: 0, prays: 0, sports: 0, studies: 0 };
  let perfect = 0;
  let late = 0;
  let sum = 0;
  for (let d = 1; d <= cap; d++) {
    const date = `${month}-${String(d).padStart(2, '0')}`;
    const m = moduleDone(
      journals.get(date),
      !!checkins.get(date)?.checked_in_at,
    );
    const score =
      (Number(m.checkins) +
        Number(m.prays) +
        Number(m.sports) +
        Number(m.studies)) *
      25;
    counts.checkins += Number(m.checkins);
    counts.prays += Number(m.prays);
    counts.sports += Number(m.sports);
    counts.studies += Number(m.studies);
    sum += score;
    if (score === 100) perfect++;
    const c = checkins.get(date);
    if (c && isLate(c.checked_in_at, c.type)) late++;
    days.push({ date, score });
  }
  const n = cap || 1;
  return {
    days,
    score: cap ? Math.round(sum / n) : 0,
    counts,
    perfect,
    late,
    pct: (v: number) => Math.round((v / n) * 100),
  };
};

/** Streak: consecutive on-time days ending today; done[0] = today. */
const streakFrom = (done: boolean[]) => {
  let run = 0;
  for (let i = done[0] ? 0 : 1; i < done.length && done[i]; i++) run++;
  return run;
};

/**
 * Module completion for one day. Mirrors web `moduleStatus`: a module only
 * counts when its proof is present.
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

/** Postgres interval `HH:MM:SS` (or `HH:MM:SS.fff`) -> minutes. */
const intervalToMinutes = (v: string | null) => {
  if (!v) return null;
  const [h = 0, m = 0] = v.split(':').map(Number);
  return Math.round(h * 60 + m);
};

/** Row -> response `Journal` shape; interval arrives as minutes. */
const toJournal = (row: JournalRow) => ({
  prayed_dhuha: row.prayed_dhuha,
  prayed_tahajud: row.prayed_tahajud,
  prayed_qabliyah_fajr: row.prayed_qabliyah_fajr,
  prayed_badiyah_isya: row.prayed_badiyah_isya,

  did_sport: row.did_sport,
  sport_type: row.sport_type,
  sport_duration: intervalToMinutes(row.sport_duration),
  sport_proof_url: row.sport_proof_url,
  sport_skip_reason: row.sport_skip_reason,

  did_study: row.did_study,
  study_about: row.study_about,
  study_media: row.study_media,
  study_start_proof_url: row.study_start_proof_url,
  study_end_proof_url: row.study_end_proof_url,
  study_skip_reason: row.study_skip_reason,
});

export const Journal = {
  /**
   * Create or update today's journal. Only provided fields are written, so a
   * partial body never wipes existing data.
   */
  async upsert(userId: string, body: JournalModel['upsertBody']) {
    const { sport_duration, ...rest } = body;
    const values = {
      user_id: userId,
      date: toDateStr(),
      ...rest,
      ...(sport_duration !== undefined && {
        sport_duration:
          sport_duration === null
            ? null
            : sql`make_interval(mins => ${sport_duration})`,
      }),
    };
    const { user_id, date, ...set } = values;
    await db
      .insert(habitJournalsTable)
      .values(values)
      .onConflictDoUpdate({
        target: [habitJournalsTable.user_id, habitJournalsTable.date],
        set,
      });
  },

  /** Get journal for a date, or null. */
  async getByDate(userId: string, date: string) {
    const [row] = await db
      .select()
      .from(habitJournalsTable)
      .where(
        and(
          eq(habitJournalsTable.user_id, userId),
          eq(habitJournalsTable.date, date),
        ),
      )
      .limit(1);
    return row ? toJournal(row) : null;
  },

  /**
   * Monthly recap: every elapsed day of the month with per-module completion
   * (0/1), day average (0..100), month rate (% perfect days) and module rates.
   */
  async getRecap(userId: string, month: string) {
    const { first, last } = monthBounds(month);
    const [rows, checks] = await Promise.all([
      db
        .select()
        .from(habitJournalsTable)
        .where(
          and(
            eq(habitJournalsTable.user_id, userId),
            between(habitJournalsTable.date, first, last),
          ),
        ),
      db
        .select({
          date: checkinsTable.date,
          checked_in_at: checkinsTable.checked_in_at,
        })
        .from(checkinsTable)
        .where(
          and(
            eq(checkinsTable.user_id, userId),
            between(checkinsTable.date, first, last),
          ),
        ),
    ]);

    const journalByDate = new Map(rows.map((r) => [r.date, r]));
    const checkedDates = new Set(
      checks.filter((c) => c.checked_in_at).map((c) => c.date),
    );

    const scores: { date: string; score: number }[] = [];
    const moduleCounts = { checkins: 0, prays: 0, sports: 0, studies: 0 };
    for (let d = 1; d <= elapsedDays(month); d++) {
      const date = `${month}-${String(d).padStart(2, '0')}`;
      const m = moduleDone(journalByDate.get(date), checkedDates.has(date));
      scores.push({
        date,
        score:
          (Number(m.checkins) +
            Number(m.prays) +
            Number(m.sports) +
            Number(m.studies)) *
          25,
      });
      moduleCounts.checkins += Number(m.checkins);
      moduleCounts.prays += Number(m.prays);
      moduleCounts.sports += Number(m.sports);
      moduleCounts.studies += Number(m.studies);
    }

    const n = scores.length || 1;
    const pct = (v: number) => Math.round((v / n) * 100);

    return {
      month,
      rate: pct(scores.filter((s) => s.score === 100).length),
      average_score: Math.round(scores.reduce((a, s) => a + s.score, 0) / n),
      average_score_each: {
        checkins: pct(moduleCounts.checkins),
        prays: pct(moduleCounts.prays),
        sports: pct(moduleCounts.sports),
        studies: pct(moduleCounts.studies),
      },
      scores,
    };
  },

  /**
   * Class-wide monthly stats: per-day class average scores, per-module
   * averages, score distribution, perfect days, streaks, late and attention.
   */
  async getStats(month: string) {
    const students = await User.getStudents();
    const ids = students.map((s) => s.id);
    const { first, last } = monthBounds(month);
    const retroStart = toDateStr(
      new Date(
        new Date(`${toDateStr()}T00:00:00`).getTime() - (RETRO - 1) * DAY_MS,
      ),
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
            .select()
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
            .select()
            .from(checkinsTable)
            .where(
              and(
                inArray(checkinsTable.user_id, ids),
                gte(checkinsTable.date, retroStart),
                lte(checkinsTable.date, last),
              ),
            )
        : [],
    ]);

    const jByUser = new Map<string, Map<string, JournalRow>>();
    for (const r of jrows) {
      if (!jByUser.has(r.user_id)) jByUser.set(r.user_id, new Map());
      jByUser.get(r.user_id)!.set(r.date, r);
    }
    const cByUser = new Map<string, Map<string, CheckinRow>>();
    for (const r of crows) {
      if (!cByUser.has(r.user_id)) cByUser.set(r.user_id, new Map());
      cByUser.get(r.user_id)!.set(r.date, r);
    }
    const onTime = new Map<string, Set<string>>();
    for (const r of hrows) {
      if (isLate(r.checked_in_at, r.type)) continue;
      if (!onTime.has(r.user_id)) onTime.set(r.user_id, new Set());
      onTime.get(r.user_id)!.add(r.date);
    }

    const todayMs = new Date(`${toDateStr()}T00:00:00`).getTime();
    const stats = students.map((s) => {
      const m = monthlySummary(
        month,
        jByUser.get(s.id) ?? new Map(),
        cByUser.get(s.id) ?? new Map(),
      );
      const done: boolean[] = [];
      const set = onTime.get(s.id) ?? new Set();
      for (let i = 0; i < RETRO; i++)
        done.push(set.has(toDateStr(new Date(todayMs - i * DAY_MS))));
      return { ...m, streak: streakFrom(done) };
    });

    const n = stats.length || 1;
    const mean = (f: (s: (typeof stats)[number]) => number) =>
      Math.round(stats.reduce((a, s) => a + f(s), 0) / n);
    const count = (f: (s: (typeof stats)[number]) => number) =>
      stats.reduce((a, s) => a + f(s), 0);

    const distribution = { '0-39': 0, '40-59': 0, '60-79': 0, '80-100': 0 };
    for (const s of stats) {
      const k =
        s.score < 40
          ? '0-39'
          : s.score < 60
            ? '40-59'
            : s.score < 80
              ? '60-79'
              : '80-100';
      distribution[k]++;
    }

    const scores = Array.from({ length: elapsedDays(month) }, (_, i) => {
      const date = `${month}-${String(i + 1).padStart(2, '0')}`;
      const sum = stats.reduce(
        (a, s) => a + (s.days.find((d) => d.date === date)?.score ?? 0),
        0,
      );
      return { date, score: Math.round(sum / n) };
    });

    return {
      month,
      average_score: mean((s) => s.score),
      average_score_each: {
        checkins: mean((s) => s.pct(s.counts.checkins)),
        prays: mean((s) => s.pct(s.counts.prays)),
        sports: mean((s) => s.pct(s.counts.sports)),
        studies: mean((s) => s.pct(s.counts.studies)),
      },
      scores,
      score_distribution: distribution,
      completed_days: count((s) => s.perfect),
      students_on_streaks: stats.filter((s) => s.streak >= 3).length,
      late_count: count((s) => s.late),
      need_attention_count: stats.filter((s) => s.score < 50).length,
    };
  },

  /** Per-student monthly score summary for a list of student ids. */
  async getStudentRecap(studentIds: string[], month: string) {
    const { first, last } = monthBounds(month);
    const [jrows, crows] = await Promise.all([
      studentIds.length
        ? db
            .select()
            .from(habitJournalsTable)
            .where(
              and(
                inArray(habitJournalsTable.user_id, studentIds),
                between(habitJournalsTable.date, first, last),
              ),
            )
        : [],
      studentIds.length
        ? db
            .select()
            .from(checkinsTable)
            .where(
              and(
                inArray(checkinsTable.user_id, studentIds),
                between(checkinsTable.date, first, last),
              ),
            )
        : [],
    ]);
    const jByUser = new Map<string, Map<string, JournalRow>>();
    for (const r of jrows) {
      if (!jByUser.has(r.user_id)) jByUser.set(r.user_id, new Map());
      jByUser.get(r.user_id)!.set(r.date, r);
    }
    const cByUser = new Map<string, Map<string, CheckinRow>>();
    for (const r of crows) {
      if (!cByUser.has(r.user_id)) cByUser.set(r.user_id, new Map());
      cByUser.get(r.user_id)!.set(r.date, r);
    }

    const students = studentIds.map((id) => {
      const m = monthlySummary(
        month,
        jByUser.get(id) ?? new Map(),
        cByUser.get(id) ?? new Map(),
      );
      return {
        user_id: id,
        average_score: m.score,
        average_score_each: {
          checkins: m.pct(m.counts.checkins),
          prays: m.pct(m.counts.prays),
          sports: m.pct(m.counts.sports),
          studies: m.pct(m.counts.studies),
        },
      };
    });

    return { month, students };
  },
};
