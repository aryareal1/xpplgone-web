import { t } from 'elysia';
import { r } from '@be/lib/schema';
import type { DeepUnwrap } from '@be/lib/utils';

const enums = {
  type: t.Enum({
    school: 'school',
    morning: 'morning',
  }),
};

const Check = t.Object({
  date: t.String({ format: 'date' }),
  is_checked: t.Boolean(),
  type: t.Nullable(enums.type),
  checked_in_at: t.Nullable(t.Date()),
  checked_out_at: t.Nullable(t.Date()),
});

export const CheckinsModel = {
  enums,
  Check,

  checkInBody: t.Object({
    type: enums.type,
  }),
  checkInResponse: r.Success('Check in successful'),
  checkInAlready: r.Failed('Already checked in'),

  checkOutResponse: r.Success('Check out successful'),
  checkOutNotCheckedIn: r.Failed('Not checked in yet'),
  checkOutAlready: r.Failed('Already checked out'),

  getCheckParam: t.Object({
    date: t.String({ format: 'date' }),
  }),
  getCheckResponse: r.Data('Check data get successful', Check),
  getCheckEmpty: r.Failed('Check data not available'),
  checkNotFound: t.Union(
    [r.Failed('User not found'), r.Failed('Check data not available')],
    { description: 'User or check data not found' },
  ),

  streakResponse: r.Data(
    'Get streak successful',
    t.Object({
      streak: t.Number(),
      since: t.Nullable(t.String({ format: 'date' })),
    }),
  ),

  recapQuery: t.Object({
    month: t.String({
      pattern: '^\\d{4}-(0[1-9]|1[0-2])$',
    }),
  }),
  recapResponse: r.Data(
    'Get checkin monthly recap successful',
    t.Object({
      month: t.String({
        pattern: '^\\d{4}-(0[1-9]|1[0-2])$',
      }),
      rate: t.Number(),
      miss_count: t.Number(),
      check_count: t.Number(),
      late_count: t.Number(),
      recap: t.Array(Check),
    }),
  ),

  studentsQuery: t.Object({
    month: t.String({ pattern: '^\\d{4}-(0[1-9]|1[0-2])$' }),
  }),
  studentsResponse: r.Data(
    "Get monthly student's checkins successful",
    t.Object({
      month: t.String({ pattern: '^\\d{4}-(0[1-9]|1[0-2])$' }),
      students: t.Array(
        t.Object({
          user_id: t.String(),
          rate: t.Number(),
          miss_count: t.Number(),
          check_count: t.Number(),
          late_count: t.Number(),
        }),
      ),
    }),
  ),

  idParam: t.Object({ id: t.String() }),
  userInvalid: r.Failed('User not found'),
};

export type CheckinsModel = {
  [k in keyof typeof CheckinsModel]: DeepUnwrap<(typeof CheckinsModel)[k]>;
};
