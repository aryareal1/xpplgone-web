import { defineRelations } from 'drizzle-orm';
import { googleIdentitiesTable, sessionsTable, usersTable } from './auth';
import { checkinsTable, habitJournalsTable } from './journal';

export default defineRelations(
  {
    usersTable,
    sessionsTable,
    googleIdentitiesTable,
    habitJournalsTable,
    checkinsTable,
  },
  (r) => ({
    usersTable: {
      sessions: r.many.sessionsTable(),
      googleIdentities: r.many.googleIdentitiesTable(),
      habitJournals: r.many.habitJournalsTable(),
      checkins: r.many.checkinsTable(),
    },
    habitJournalsTable: {
      user: r.one.usersTable({
        from: r.habitJournalsTable.user_id,
        to: r.usersTable.id,
      }),
    },
    checkinsTable: {
      user: r.one.usersTable({
        from: r.checkinsTable.user_id,
        to: r.usersTable.id,
      }),
    },
    sessionsTable: {
      user: r.one.usersTable({
        from: r.sessionsTable.user_id,
        to: r.usersTable.id,
      }),
    },
    googleIdentitiesTable: {
      user: r.one.usersTable({
        from: r.googleIdentitiesTable.user_id,
        to: r.usersTable.id,
      }),
    },
  }),
);
