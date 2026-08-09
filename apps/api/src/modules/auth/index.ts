import Elysia from 'elysia';
import { cookieDefaults, webUrl } from '@/lib/constants';
import { requireAuth } from './middleware';
import { AuthModel } from './model';
import { Auth } from './service';

export const auth = new Elysia({
  tags: ['Authentication'],
})
  .group('/auth', (e) =>
    e
      .use(Auth)
      // GET /auth/oauth2
      .get(
        '/oauth2',
        ({ auth, query, redirect }) =>
          redirect(auth.generateUrl(query.redirect_to)),
        {
          detail: {
            summary: 'Generate OAuth2',
            description:
              'Generate an oauth2 consent url and then redirect the user to it.',
          },
          query: AuthModel.oauthQuery,
        },
      )

      // GET /auth/callback
      .get(
        '/callback',
        async ({ auth, cookie, redirect }) => {
          const data = await auth.exchangeCode();
          if (!data) return redirect(`${webUrl}/error?code=NOT_ALLOWED`);

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
            summary: 'OAuth2 Callback',
            description:
              'Handle the OAuth2 callback, exchange the code for tokens, set cookies, and redirect the user.',
          },
        },
      )

      // GET /auth/refresh
      .post(
        '/refresh',
        async ({ cookie, auth, status }) => {
          const refreshToken = cookie.refresh_token?.value as
            | string
            | undefined;
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
            message: 'Refresh successful',
            data: {
              access_token: accessToken,
            },
          });
        },
        {
          detail: {
            summary: 'Refresh Access Token',
            description:
              'Exchange a valid refresh token for a new access token and rotate the refresh token expiry.',
          },
          response: {
            200: AuthModel.refreshResponse,
            401: AuthModel.unauthorized,
          },
        },
      )

      .use(requireAuth)
      // POST /auth/logout
      .post(
        '/logout',
        async ({ cookie, auth, status }) => {
          await auth.revoke(auth.session.access_token);
          cookie.access_token?.remove();
          cookie.refresh_token?.remove();

          return status(200, {
            success: true,
            message: 'Logout successful',
          });
        },
        {
          detail: {
            summary: 'Logout',
            description:
              'Revoke the current access token, clear both auth cookies, and end the session.',
          },
          response: {
            200: AuthModel.logoutResponse,
          },
        },
      ),
  )
  .use(requireAuth)
  // GET /me
  .get(
    '/me',
    ({ auth, status }) =>
      status(200, {
        success: true,
        message: 'Me successful',
        data: auth.user,
      }),
    {
      detail: {
        summary: 'Get Current User',
        description: "Return the authenticated user's profile information.",
      },
      response: {
        200: AuthModel.meResponse,
      },
    },
  );
