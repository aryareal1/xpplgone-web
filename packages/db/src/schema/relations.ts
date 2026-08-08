import { defineRelations } from 'drizzle-orm';
import { googleIdentitiesTable, sessionsTable, usersTable } from './auth';
import { attendancesTable, habitJournalsTable } from './journal';

export default defineRelations(
  {
    usersTable,
    sessionsTable,
    googleIdentitiesTable,
    habitJournalsTable,
    attendancesTable,
  },
  (r) => ({
    usersTable: {
      sessions: r.many.sessionsTable(),
      googleIdentities: r.many.googleIdentitiesTable(),
      habitJournals: r.many.habitJournalsTable(),
      attendances: r.many.attendancesTable(),
    },
    habitJournalsTable: {
      user: r.one.usersTable({
        from: r.habitJournalsTable.user_id,
        to: r.usersTable.id,
      }),
    },
    attendancesTable: {
      user: r.one.usersTable({
        from: r.attendancesTable.user_id,
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
