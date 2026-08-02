import bearer from '@elysia/bearer';
import Elysia from 'elysia';
import auth from '../plugin/auth';

export default new Elysia()
  .use(bearer())
  .use(auth)
  .onBeforeHandle(({ auth, status }) => {
    if (!auth.user)
      return status(401, {
        success: false,
        message: 'Unauthorized',
      });
  })
  .resolve(({ auth }) => ({
    auth: {
      ...auth,
      user: auth.user!,
      session: auth.session!,
    },
  }))
  .as('scoped');
