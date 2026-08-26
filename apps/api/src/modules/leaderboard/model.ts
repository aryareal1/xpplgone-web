import { r } from '@be/lib/schema';
import type { DeepUnwrap } from '@be/lib/utils';
import { t } from 'elysia';

const monthPattern = '^\\d{4}-(0[1-9]|1[0-2])$';

const Entry = t.Object({
  rank: t.Number(),
  user_id: t.String(),
  nis: t.Number(),
  name: t.String(),
  avatar_url: t.Nullable(t.String()),
  streak: t.Number(),
  points: t.Number(),
});

export const LeaderboardModel = {
  query: t.Object({
    month: t.Optional(t.String({ pattern: monthPattern })),
  }),

  entry: Entry,

  response: r.Data(
    'Get leaderboard successful',
    t.Object({
      month: t.String({ pattern: monthPattern }),
      entries: t.Array(Entry),
    }),
  ),
};

export type LeaderboardModel = {
  [k in keyof typeof LeaderboardModel]: DeepUnwrap<
    (typeof LeaderboardModel)[k]
  >;
};
