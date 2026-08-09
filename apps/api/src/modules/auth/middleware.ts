import Elysia from 'elysia';
import { Auth } from './service';
import { ADMIN_ROLES, DEV_ROLE } from '@/lib/constants';
import { AuthModel } from './model';

export const authResolver = new Elysia({ name: 'Auth.authResolver' })
  .use(Auth)
  .resolve(async ({ auth, bearer, cookie }) => {
    const accessToken = (bearer || cookie.access_token?.value) as
      | string
      | undefined;
    if (!accessToken) return { auth: { ...auth, session: null, user: null } };

    const data = await auth.resolveToken(accessToken);
    if (!data) return { auth: { ...auth, session: null, user: null } };

    const refreshToken = cookie.refresh_token?.value as string | undefined;

    return {
      auth: {
        ...auth,
        user: data.user,
        session: {
          ...data.session,
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      },
    };
  })
  .as('scoped');

export const requireAuth = new Elysia({ name: 'Auth.requireAuth' })
  .use(authResolver)
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
  .guard({
    response: {
      401: AuthModel.unauthorized,
    },
  })
  .as('scoped');

export const requireAdmin = new Elysia({ name: 'Auth.requireAdmin' })
  .use(authResolver)
  .onBeforeHandle(({ auth, status }) => {
    if (!auth.user)
      return status(401, {
        success: false,
        message: 'Unauthorized',
      });

    // @ts-expect-error
    if (!ADMIN_ROLES.includes(auth.user.role))
      return status(403, {
        success: false,
        message: 'Forbidden',
      });
  })
  .guard({
    response: {
      401: AuthModel.unauthorized,
      403: AuthModel.forbidden,
    },
  })
  .as('scoped');

export const requireDev = new Elysia({ name: 'Auth.requireDev' })
  .use(authResolver)
  .onBeforeHandle(({ auth, status }) => {
    if (!auth.user)
      return status(401, {
        success: false,
        message: 'Unauthorized',
      });

    if (auth.user.role !== DEV_ROLE)
      return status(403, {
        success: false,
        message: 'Forbidden',
      });
  })
  .guard({
    response: {
      401: AuthModel.unauthorized,
      403: AuthModel.forbidden,
    },
  })
  .as('scoped');
