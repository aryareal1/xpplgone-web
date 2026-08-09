import Elysia, { t } from 'elysia';
import { toDateStr } from '@/lib/utils';
import { requireAdmin } from '../auth/middleware';
import { User } from '../user/service';
import { CheckinsModel } from './model';
import { Checkins } from './service';

export const checkinsAdmin = new Elysia({ tags: ['Checkins'] })
  .use(requireAdmin)
  .group('/users/:id/checkins', (g) =>
    g
      .guard({
        schema: 'standalone',
        params: CheckinsModel.idParam,
      })
      // GET /users/:id/checkins/today
      .get(
        '/today',
        async ({ params, status }) => {
          const user = await User.getByIdentifier(params.id);
          if (!user)
            return status(404, { success: false, message: 'User not found' });

          const data = await Checkins.getByDate(user.id, toDateStr());
          if (!data)
            return status(404, {
              success: false,
              message: 'Check data not available',
            });

          return status(200, {
            success: true,
            message: 'Check data get successful',
            data,
          });
        },
        {
          detail: {
            summary: "Get User's Today Check",
            description:
              "Get a user's check-in data for today. Returns 404 if the user or their check data is not found.",
          },
          response: {
            200: CheckinsModel.getCheckResponse,
            404: CheckinsModel.checkNotFound,
          },
        },
      )

      // GET /users/:id/checkins/:date
      .get(
        '/:date',
        async ({ params, status }) => {
          const user = await User.getByIdentifier(params.id);
          if (!user)
            return status(404, { success: false, message: 'User not found' });

          const data = await Checkins.getByDate(user.id, params.date);
          if (!data)
            return status(404, {
              success: false,
              message: 'Check data not available',
            });

          return status(200, {
            success: true,
            message: 'Check data get successful',
            data,
          });
        },
        {
          detail: {
            summary: "Get User's Check by Date",
            description:
              "Get a user's check-in data for a specific date. Returns 404 if the user or check data is not found.",
          },
          params: t.Object({
            date: t.String({ format: 'date' }),
          }),
          response: {
            200: CheckinsModel.getCheckResponse,
            404: CheckinsModel.checkNotFound,
          },
        },
      )

      // GET /users/:id/checkins/streak
      .get(
        '/streak',
        async ({ params, status }) => {
          const user = await User.getByIdentifier(params.id);
          if (!user)
            return status(404, { success: false, message: 'User not found' });

          const data = await Checkins.getStreak(user.id);
          return status(200, {
            success: true,
            message: 'Get streak successful',
            data,
          });
        },
        {
          detail: {
            summary: "Get User's Check-in Streak",
            description:
              "Get a user's current streak of consecutive days with a check-in, and the date the streak started.",
          },
          response: {
            200: CheckinsModel.streakResponse,
            404: CheckinsModel.userInvalid,
          },
        },
      )

      // GET /users/:id/checkins/recap
      .get(
        '/recap',
        async ({ params, query, status }) => {
          const user = await User.getByIdentifier(params.id);
          if (!user)
            return status(404, { success: false, message: 'User not found' });

          const data = await Checkins.getRecap(user.id, query.month);
          return status(200, {
            success: true,
            message: 'Get checkin monthly recap successful',
            data,
          });
        },
        {
          detail: {
            summary: "Get User's Monthly Recap",
            description:
              "Get a user's monthly recap of check-ins: every day of the month with its status, plus attendance rate, checked and missed counts.",
          },
          query: CheckinsModel.recapQuery,
          response: {
            200: CheckinsModel.recapResponse,
            404: CheckinsModel.userInvalid,
          },
        },
      ),
  )

  // GET /checkins/students
  .get(
    '/checkins/students',
    async ({ query, status }) => {
      const students = await User.getStudents();
      const data = await Checkins.getStudentRecap(
        students.map((s) => s.id),
        query.month,
      );
      return status(200, {
        success: true,
        message: "Get monthly student's checkins successful",
        data,
      });
    },
    {
      detail: {
        summary: "Get All Students' Monthly Recap",
        description:
          'Get a recap for every student for the given month: attendance rate, missed/check-in/late counts.',
      },
      query: CheckinsModel.studentsQuery,
      response: {
        200: CheckinsModel.studentsResponse,
      },
    },
  );
