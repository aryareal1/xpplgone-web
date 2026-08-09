import Elysia from 'elysia';
import { toDateStr } from '@be/lib/utils';
import { requireAdmin } from '../auth/middleware';
import { User } from '../user/service';
import { JournalModel } from './model';
import { Journal } from './service';

export const journalAdmin = new Elysia({ tags: ['Journals'] })
  .use(requireAdmin)
  .group('/users/:id/journals', (g) =>
    g
      .guard({
        schema: 'standalone',
        params: JournalModel.idParam,
      })
      // GET /users/:id/journals/today
      .get(
        '/today',
        async ({ params, status }) => {
          const user = await User.getByIdentifier(params.id);
          if (!user)
            return status(404, { success: false, message: 'User not found' });

          const data = await Journal.getByDate(user.id, toDateStr());
          if (!data)
            return status(404, {
              success: false,
              message: 'Journal is empty',
            });

          return status(200, {
            success: true,
            message: 'Get journal successful',
            data,
          });
        },
        {
          detail: {
            summary: "Get User's Today Journal",
            description:
              "Get a user's journal for today. Returns 404 if the user or their journal is not found.",
          },
          response: {
            200: JournalModel.getJournalResponse,
            404: JournalModel.journalNotFound,
          },
        },
      )

      // GET /users/:id/journals/:date
      .get(
        '/:date',
        async ({ params, status }) => {
          const user = await User.getByIdentifier(params.id);
          if (!user)
            return status(404, { success: false, message: 'User not found' });

          const data = await Journal.getByDate(user.id, params.date);
          if (!data)
            return status(404, {
              success: false,
              message: 'Journal is empty',
            });

          return status(200, {
            success: true,
            message: 'Get journal successful',
            data,
          });
        },
        {
          detail: {
            summary: "Get User's Journal by Date",
            description:
              "Get a user's journal for a specific date. Returns 404 if the user or journal is not found.",
          },
          params: JournalModel.getJournalParam,
          response: {
            200: JournalModel.getJournalResponse,
            404: JournalModel.journalNotFound,
          },
        },
      )

      // GET /users/:id/journals/recap
      .get(
        '/recap',
        async ({ params, query, status }) => {
          const user = await User.getByIdentifier(params.id);
          if (!user)
            return status(404, { success: false, message: 'User not found' });

          const data = await Journal.getRecap(user.id, query.month);
          return status(200, {
            success: true,
            message: 'Get journal recap successful',
            data,
          });
        },
        {
          detail: {
            summary: "Get User's Monthly Journal Recap",
            description:
              "Get a user's monthly journal recap: every elapsed day's score, month rate, average score and per-module averages.",
          },
          query: JournalModel.recapQuery,
          response: {
            200: JournalModel.recapResponse,
            404: JournalModel.userInvalid,
          },
        },
      ),
  )

  .group('/journals', (g) =>
    g
      // GET /journals/stats
      .get(
        '/stats',
        async ({ query, status }) => {
          const data = await Journal.getStats(query.month);
          return status(200, {
            success: true,
            message: 'Get monthly journal stats successful',
            data,
          });
        },
        {
          detail: {
            summary: 'Get Monthly Journal Stats',
            description:
              'Get class-wide monthly journal stats: average scores, per-module averages, score distribution, completed days, streaks, late and need-attention counts.',
          },
          query: JournalModel.statsQuery,
          response: {
            200: JournalModel.statsResponse,
          },
        },
      )

      // GET /journals/students
      .get(
        '/students',
        async ({ query, status }) => {
          const students = await User.getStudents();
          const data = await Journal.getStudentRecap(
            students.map((s) => s.id),
            query.month,
          );
          return status(200, {
            success: true,
            message: "Get monthly student's journal stats successful",
            data,
          });
        },
        {
          detail: {
            summary: "Get All Students' Monthly Journal Stats",
            description:
              'Get a monthly journal score summary for every student: average score and per-module averages.',
          },
          query: JournalModel.studentsQuery,
          response: {
            200: JournalModel.studentsResponse,
          },
        },
      ),
  );
