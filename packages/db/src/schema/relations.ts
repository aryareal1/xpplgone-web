import { defineRelations } from 'drizzle-orm';
import { sessions, users } from './auth';

export default defineRelations({ users, sessions }, (r) => ({
  users: {
    sessions: r.many.sessions(),
  },
  sessions: {
    user: r.one.users({ from: r.sessions.user_id, to: r.users.id }),
  },
}));
