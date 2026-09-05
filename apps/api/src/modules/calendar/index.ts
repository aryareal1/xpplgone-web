import Elysia from 'elysia';
import { CalendarModel } from './model';
import { Calendar } from './service';

export const calendar = new Elysia({ prefix: '/calendar', tags: ['Calendar'] })
  // GET /calendar/holidays
  .get(
    '/holidays',
    async ({ query, status }) => {
      const data = await Calendar.getHolidays(query.year);
      return status(200, {
        success: true,
        message: 'Holidays get successful',
        data,
      });
    },
    {
      detail: {
        summary: 'Get Public Holidays',
        description:
          'Get the list of Indonesian public holidays for a given year, proxied from the hari-libur API.',
      },
      query: CalendarModel.holidaysQuery,
      response: {
        200: CalendarModel.holidaysResponse,
      },
    },
  );
