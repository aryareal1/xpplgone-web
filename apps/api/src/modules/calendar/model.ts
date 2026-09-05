import { r } from '@be/lib/schema';
import { t } from 'elysia';

const yearPattern = '^\\d{4}$';

export const CalendarModel = {
  holidaysQuery: t.Object({
    year: t.String({ pattern: yearPattern }),
  }),
  holidaysResponse: r.Data(
    'Holidays get successful',
    t.Array(
      t.Object({
        date: t.String(),
        description: t.String(),
      }),
    ),
  ),
};
