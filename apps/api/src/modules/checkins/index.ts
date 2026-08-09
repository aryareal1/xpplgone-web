import Elysia from 'elysia';
import { toDateStr } from '@be/lib/utils';
import { requireAuth } from '../auth/middleware';
import { CheckinsModel } from './model';
import { Checkins } from './service';

export const checkins = new Elysia({ prefix: '/checkins', tags: ['Checkins'] })
  .use(requireAuth)
  // POST /checkins/check-in
  .post(
    '/check-in',
    async ({ auth, body, status }) => {
      const data = await Checkins.checkIn(auth.user.id, body.type);
      if (!data)
        return status(409, {
          success: false,
          message: 'Already checked in',
        });

      return status(200, {
        success: true,
        message: 'Check in successful',
      });
    },
    {
      detail: {
        summary: 'Check In',
        description:
          'Record a check-in for today. Only one check-in is allowed per day; returns an error if you already checked in.',
      },
      body: CheckinsModel.checkInBody,
      response: {
        200: CheckinsModel.checkInResponse,
        409: CheckinsModel.checkInAlready,
      },
    },
  )

  // POST /checkins/check-out
  .post(
    '/check-out',
    async ({ auth, status }) => {
      const result = await Checkins.checkOut(auth.user.id);
      if (!result.ok) {
        if (result.reason === 'already-out')
          return status(409, {
            success: false,
            message: 'Already checked out',
          });
        return status(400, {
          success: false,
          message: 'Not checked in yet',
        });
      }

      return status(200, {
        success: true,
        message: 'Check out successful',
      });
    },
    {
      detail: {
        summary: 'Check Out',
        description:
          'Record a check-out for today. Requires an existing check-in; returns an error if you already checked out.',
      },
      response: {
        200: CheckinsModel.checkOutResponse,
        400: CheckinsModel.checkOutNotCheckedIn,
        409: CheckinsModel.checkOutAlready,
      },
    },
  )

  // GET /checkins/today
  .get(
    '/today',
    async ({ auth, status }) => {
      const data = await Checkins.getByDate(auth.user.id, toDateStr());
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
        summary: "Get Today's Check",
        description:
          "Get the check-in data for today. Returns 404 if you haven't checked in yet.",
      },
      response: {
        200: CheckinsModel.getCheckResponse,
        404: CheckinsModel.getCheckEmpty,
      },
    },
  )

  // GET /checkins/:date
  .get(
    '/:date',
    async ({ auth, params, status }) => {
      const data = await Checkins.getByDate(auth.user.id, params.date);
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
        summary: 'Get Check by Date',
        description:
          'Get the check-in data for a specific date. Returns 404 if no check exists for that date.',
      },
      params: CheckinsModel.getCheckParam,
      response: {
        200: CheckinsModel.getCheckResponse,
        404: CheckinsModel.getCheckEmpty,
      },
    },
  )

  // GET /checkins/streak
  .get(
    '/streak',
    async ({ auth, status }) => {
      const data = await Checkins.getStreak(auth.user.id);
      return status(200, {
        success: true,
        message: 'Get streak successful',
        data,
      });
    },
    {
      detail: {
        summary: 'Get Check-in Streak',
        description:
          'Get the current streak of consecutive days with a check-in, and the date the streak started.',
      },
      response: {
        200: CheckinsModel.streakResponse,
      },
    },
  )

  // GET /checkins/recap
  .get(
    '/recap',
    async ({ auth, query, status }) => {
      const data = await Checkins.getRecap(auth.user.id, query.month);
      return status(200, {
        success: true,
        message: 'Get checkin monthly recap successful',
        data,
      });
    },
    {
      detail: {
        summary: 'Get Monthly Recap',
        description:
          'Get a monthly recap of check-ins: every day of the month with its status, plus attendance rate, checked and missed counts.',
      },
      query: CheckinsModel.recapQuery,
      response: {
        200: CheckinsModel.recapResponse,
      },
    },
  );
