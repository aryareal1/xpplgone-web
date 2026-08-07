import { db, habitJournalsTable } from '@xirpl/db';
import Elysia, { t } from 'elysia';
import auth from '../middleware/auth';
import { m, r } from '../schema';
import { fetchMonthJournals, toDay, toRow } from './journals';

/**
 * Roles allowed to view and manage other users' journals.
 */
const STAFF_ROLES = ['developer', 'teacher', 'homeroom_teacher'] as const;

export default new Elysia({
  prefix: '/users/:id/journals',
  detail: { tags: ['Journals'] },
})
  .use(auth)
  .guard(
    {
      detail: { security: [{ 'Bearer Auth': [] }] },
    },
    (app) =>
      app
        .onBeforeHandle(({ auth, status }) => {
          if (!STAFF_ROLES.includes(auth.user.role as any))
            return status(403, {
              success: false,
              message: 'Forbidden',
            });
        })
        .resolve(async ({ params, status }) => {
          const user = await db.query.usersTable.findFirst({
            where: { id: params.id },
            columns: { id: true },
          });

          if (!user)
            return status(404, {
              success: false,
              message: 'User not found',
            });

          return { targetUser: user };
        })
        .get(
          '/',
          async ({ query, targetUser, status }) => {
            const journals = await fetchMonthJournals(
              targetUser.id,
              query.month,
            );

            return status(200, {
              success: true,
              message: 'Habit journals get successful',
              data: journals.map(toDay),
            });
          },
          {
            detail: {
              summary: 'Get User Journals by Month',
              description: 'Get all habit journals of a user in a month.',
            },
            query: t.Object({
              month: t.String({
                description: 'The month of the journals in YYYY-MM format',
                pattern: '^\\d{4}-\\d{2}$',
              }),
            }),
            response: {
              200: r.Success(
                t.Array(m.HabitDay),
                'Habit journals get successful',
              ),
              401: r.Failed('Unauthorized'),
              403: r.Failed('Forbidden'),
              404: r.Failed('User not found'),
              500: r.Failed('Internal server error'),
            },
          },
        )
        .get(
          '/:date',
          async ({ params, targetUser, status }) => {
            const journal = await db.query.habitJournalsTable.findFirst({
              where: {
                user_id: targetUser.id,
                date: params.date,
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
              summary: 'Get User Journal by Date',
              description: 'Get a habit journal of a user by date.',
            },
            params: t.Object({
              date: t.String({
                description: 'The date of the journal in YYYY-MM-DD format',
                pattern: '^\\d{4}-\\d{2}-\\d{2}$',
              }),
            }),
            response: {
              200: r.Success(
                t.Nullable(m.HabitDay),
                'Habit journal get successful',
              ),
              401: r.Failed('Unauthorized'),
              403: r.Failed('Forbidden'),
              404: r.Failed('User not found'),
              500: r.Failed('Internal server error'),
            },
          },
        )
        .put(
          '/:date',
          async ({ body, params, targetUser, status }) => {
            const values = toRow(params.date, body);

            const saved = await db
              .insert(habitJournalsTable)
              .values({ user_id: targetUser.id, ...values })
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
              summary: 'Create or Update User Journal',
              description:
                'Create or update a habit journal of a user for a date.',
            },
            params: t.Object({
              date: t.String({
                description: 'The date of the journal in YYYY-MM-DD format',
                pattern: '^\\d{4}-\\d{2}-\\d{2}$',
              }),
            }),
            body: m.HabitDay,
            response: {
              200: r.Success(m.HabitDay, 'Habit journal saved successfully'),
              401: r.Failed('Unauthorized'),
              403: r.Failed('Forbidden'),
              404: r.Failed('User not found'),
              500: r.Failed('Internal server error'),
            },
          },
        ),
  );
