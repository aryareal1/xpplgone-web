import Elysia, { t } from 'elysia';
import authMiddleware from '../middleware/auth';
import auth from '../plugin/auth';
import { m, r } from '../schema';
import { cookieDefaults, webUrl } from '../utils';

export default new Elysia({ prefix: '/auth', detail: { tags: ['Auth'] } })
  .use(auth)
  // GET /auth/oauth - Generate OAuth consent URL
  .get(
    '/oauth',
    ({ query, auth, redirect }) =>
      redirect(auth.generateUrl(query.redirect_url)),
    {
      detail: {
        summary: 'Generate OAuth',
        description:
          'Generate Google OAuth URL and redirect the user for authentication.',
      },
      query: t.Object({
        redirect_url: t.Optional(
          t.String({ description: 'Redirect URL after OAuth' }),
        ),
      }),
    },
  )

  // GET /auth/callback - Exchange code for session
  .get(
    '/callback',
    async ({ auth, cookie, redirect }) => {
      const data = await auth.exchangeCode();
      if (!data) return redirect(`${webUrl}/error?code=DISALLOWED`);

      cookie.access_token?.set({
        value: data.accessToken,
        ...cookieDefaults,
      });
      cookie.refresh_token?.set({
        value: data.refreshToken,
        ...cookieDefaults,
        maxAge: 30 * 24 * 60 * 60,
      });

      return redirect(`${webUrl}${data.redirectUrl}`);
    },
    {
      detail: {
        summary: 'Callback',
        description:
          'Exchange Google OAuth code for user session and tokens then redirect back.',
      },
    },
  )

  // POST /auth/refresh - Refresh session
  .post(
    '/refresh',
    async ({ cookie, auth, status }) => {
      const refreshToken = cookie.refresh_token?.value as string | undefined;
      if (!refreshToken)
        return status(401, {
          success: false,
          message: 'Unauthorized',
        });

      const accessToken = await auth.refresh(refreshToken);
      if (!accessToken)
        return status(401, {
          success: false,
          message: 'Unauthorized',
        });

      cookie.access_token?.set({
        value: accessToken,
        ...cookieDefaults,
      });
      cookie.refresh_token?.update({
        maxAge: 30 * 24 * 60 * 60,
      });

      return status(200, {
        success: true,
        message: 'Refresh success',
        data: {
          access_token: accessToken,
        },
      });
    },
    {
      detail: {},
      response: {
        200: r.Success(
          t.Object({
            access_token: t.String(),
          }),
          'Refresh success',
        ),
        401: r.Failed('Unauthorized'),
      },
    },
  )

  .use(authMiddleware)
  // GET /auth/me
  .get(
    '/me',
    ({ auth }) => {
      const {
        id,
        email,
        username,
        display_name,
        avatar_url,
        bio,
        gender,
        role,
        nis,
        islamic_org,
        created_at,
      } = auth.user;
      return {
        success: true,
        message: 'Get successful',
        data: {
          id,
          email,
          username,
          display_name,
          avatar_url,
          bio,
          gender,
          role,
          nis,
          islamic_org,
          created_at,
        },
      };
    },
    {
      detail: {
        summary: 'Me',
        description: 'Get authenticated user info.',
        security: [{ 'Bearer Auth': [] }],
      },
      response: {
        200: r.Success(m.User, 'Successfully get user info'),
        401: r.Failed('Unauthorized'),
      },
    },
  )

  // POST /auth/logout - Revoke tokens
  .post(
    '/logout',
    async ({ cookie, auth, status }) => {
      await auth.revoke(auth.session.access_token);
      cookie.access_token?.remove();
      cookie.refresh_token?.remove();

      return status(200, {
        success: true,
        message: 'Successfully logged out',
        data: null,
      });
    },
    {
      detail: {
        summary: 'Logout',
        description: 'Logout user and clear session.',
        security: [{ 'Bearer Auth': [] }],
      },
      response: {
        200: r.Success(t.Null(), 'Successfully logged out'),
        401: r.Failed('Unauthorized'),
      },
    },
  );
