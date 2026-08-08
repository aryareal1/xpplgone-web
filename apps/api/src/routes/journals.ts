import { db, habitJournalsTable } from '@xirpl/db';
import { and, between, eq, sql } from 'drizzle-orm';
import Elysia, { t } from 'elysia';
import auth from '../middleware/auth';
import { m, r } from '../schema';

const fmtDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;

/**
 * HabitDay <-> DB row. Dates arrive from the client as `YYYY/MM/DD` (see
 * web/data/habit-data.ts), normalize to `YYYY-MM-DD` for Postgres.
 */
export const toRow = (date: string, body: any) => ({
  date: date.replaceAll('/', '-'),
  prayed_dhuha: body.ibadah[0],
  prayed_tahajud: body.ibadah[1],
  prayed_qabliyah_fajr: body.ibadah[2],
  prayed_badiyah_isya: body.ibadah[3],
  did_sport: body.olahraga.done,
  sport_type: body.olahraga.sport || null,
  sport_duration: body.olahraga.minutes
    ? sql`make_interval(mins => ${body.olahraga.minutes})`
    : null,
  sport_proof_url: body.olahraga.photo?.data ?? null,
  did_study: body.belajar.done,
  study_about: body.belajar.topic || null,
  study_media: body.belajar.media || null,
  study_start_proof_url: body.belajar.start?.data ?? null,
  study_end_proof_url: body.belajar.end?.data ?? null,
});

export const toDay = (row: any): any => ({
  date: row.date,
  ibadah: [
    row.prayed_dhuha,
    row.prayed_tahajud,
    row.prayed_qabliyah_fajr,
    row.prayed_badiyah_isya,
  ],
  hadir: row.checked_in_at
    ? { at: new Date(row.checked_in_at).toISOString(), late: row.late }
    : null,
  olahraga: {
    done: row.did_sport,
    sport: row.sport_type ?? '',
    minutes: row.sport_minutes ?? null,
    photo: row.sport_proof_url
      ? { data: row.sport_proof_url, at: row.updated_at }
      : null,
    alt: '',
  },
  belajar: {
    done: row.did_study,
    start: row.study_start_proof_url
      ? { data: row.study_start_proof_url, at: row.updated_at }
      : null,
    end: row.study_end_proof_url
      ? { data: row.study_end_proof_url, at: row.updated_at }
      : null,
    alt: '',
    topic: row.study_about ?? '',
    media: row.study_media ?? '',
  },
});

export const fetchMonthJournals = (userId: string, month: string) =>
  db
    .select({
      date: habitJournalsTable.date,
      prayed_dhuha: habitJournalsTable.prayed_dhuha,
      prayed_tahajud: habitJournalsTable.prayed_tahajud,
      prayed_qabliyah_fajr: habitJournalsTable.prayed_qabliyah_fajr,
      prayed_badiyah_isya: habitJournalsTable.prayed_badiyah_isya,
      did_sport: habitJournalsTable.did_sport,
      sport_type: habitJournalsTable.sport_type,
      sport_minutes: sql`EXTRACT(EPOCH FROM ${habitJournalsTable.sport_duration}) / 60`,
      sport_proof_url: habitJournalsTable.sport_proof_url,
      did_study: habitJournalsTable.did_study,
      study_about: habitJournalsTable.study_about,
      study_media: habitJournalsTable.study_media,
      study_start_proof_url: habitJournalsTable.study_start_proof_url,
      study_end_proof_url: habitJournalsTable.study_end_proof_url,
      updated_at: habitJournalsTable.updated_at,
    })
    .from(habitJournalsTable)
    .where(
      and(
        eq(habitJournalsTable.user_id, userId),
        between(habitJournalsTable.date, `${month}-01`, `${month}-31`),
      ),
    )
    .orderBy(habitJournalsTable.date);

export default new Elysia({
  prefix: '/journals',
  detail: { tags: ['Journals'] },
})
  .use(auth)
  // GET /journals?date=YYYY-MM-DD - Get a single journal day
  .get(
    '/',
    async ({ query, auth, status }) => {
      const { date } = query;

      const journal = await db.query.habitJournalsTable.findFirst({
        where: {
          user_id: auth.user.id,
          date,
        },
      });

      if (!journal)
        return status(200, {
          success: true,
          message: 'Habit journal not found',
          data: null,
        });

      return status(200, {
        success: true,
        message: 'Habit journal get successful',
        data: toDay(journal),
      });
    },
    {
      detail: {
        summary: 'Get Habit Journal by Date',
        description: 'Get a single habit journal by date.',
        security: [{ 'Bearer Auth': [] }],
      },
      query: t.Object({
        date: t.String({
          description: 'The date of the journal in YYYY-MM-DD format',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        }),
      }),
      response: {
        200: r.Success(t.Nullable(m.HabitDay), 'Habit journal get successful'),
        401: r.Failed('Unauthorized'),
        500: r.Failed('Internal server error'),
      },
    },
  )

  // PUT /journals - Create or update a journal day
  .put(
    '/',
    async ({ body, auth, status }) => {
      const values = toRow(body.date, body);

      const saved = await db
        .insert(habitJournalsTable)
        .values({ user_id: auth.user.id, ...values })
        .onConflictDoUpdate({
          target: [habitJournalsTable.user_id, habitJournalsTable.date],
          set: {
            prayed_dhuha: values.prayed_dhuha,
            prayed_tahajud: values.prayed_tahajud,
            prayed_qabliyah_fajr: values.prayed_qabliyah_fajr,
            prayed_badiyah_isya: values.prayed_badiyah_isya,
            did_sport: values.did_sport,
            sport_type: values.sport_type,
            sport_duration: values.sport_duration,
            sport_proof_url: values.sport_proof_url,
            did_study: values.did_study,
            study_about: values.study_about,
            study_media: values.study_media,
            study_start_proof_url: values.study_start_proof_url,
            study_end_proof_url: values.study_end_proof_url,
          },
        })
        .returning();

      if (!saved[0])
        return status(500, {
          success: false,
          message: 'Internal server error',
        });

      return status(200, {
        success: true,
        message: 'Habit journal saved successfully',
        data: toDay(saved[0]),
      });
    },
    {
      detail: {
        summary: 'Create or Update Habit Journal',
        description: 'Create or update a habit journal for a date.',
        security: [{ 'Bearer Auth': [] }],
      },
      body: m.HabitDay,
      response: {
        200: r.Success(m.HabitDay, 'Habit journal saved successfully'),
        401: r.Failed('Unauthorized'),
        500: r.Failed('Internal server error'),
      },
    },
  )

  // GET /journals/month?month=YYYY-MM - Get all journals in a month
  .get(
    '/month',
    async ({ query, auth, status }) => {
      const { month } = query;

      const journals = await fetchMonthJournals(auth.user.id, month);

      return status(200, {
        success: true,
        message: 'Habit journals get successful',
        data: journals.map(toDay),
      });
    },
    {
      detail: {
        summary: 'Get Habit Journals by Month',
        description: 'Get all habit journals in a month.',
        security: [{ 'Bearer Auth': [] }],
      },
      query: t.Object({
        month: t.String({
          description: 'The month of the journals in YYYY-MM format',
          pattern: '^\\d{4}-\\d{2}$',
        }),
      }),
      response: {
        200: r.Success(t.Array(m.HabitDay), 'Habit journals get successful'),
        401: r.Failed('Unauthorized'),
        500: r.Failed('Internal server error'),
      },
    },
  );
