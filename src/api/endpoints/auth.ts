import Elysia, { t } from 'elysia';
import { createClient } from '@/lib/supabase/server';
import { m, r } from '../schema';

export default new Elysia({ prefix: '/auth', detail: { tags: ['Auth'] } })
  // GET /auth/oauth - Generate OAuth URL
  .get(
    '/oauth',
    async ({ query, status }) => {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: query.redirect_url,
        },
      });

      if (error) {
        return status(500, {
          success: false,
          message: 'Internal server error',
          error: {
            ...error,
            status: error.status ?? 500,
            code: error.name,
            reason: error.message,
          },
        });
      }

      return status(200, {
        success: true,
        message: 'OAuth generated',
        data,
      });
    },
    {
      detail: {
        summary: 'Generate OAuth',
        description: 'Generate Google OAuth URL for user authentication.',
      },
      query: t.Object({
        redirect_url: t.Optional(
          t.String({ description: 'Redirect URL after OAuth' }),
        ),
      }),
      response: {
        200: r.Success(m.OAuth, 'OAuth generated'),
        500: r.Failed('Internal server error'),
      },
    },
  )

  // POST /auth/token - Exchange code for session
  .post(
    '/token',
    async ({ body, status }) => {
      if (!body?.code) {
        return status(400, {
          success: false,
          message: 'Missing code',
          error: {
            status: 400,
            code: 'MISSING_CODE',
            reason: 'Missing code',
          },
        });
      }

      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(
        body.code,
      );

      if (error) {
        if (error.name === 'AuthPKCECodeVerifierMissingError')
          return status(401, {
            success: false,
            message: 'Invalid code',
            error: {
              status: 401,
              code: 'INVALID_CODE',
              reason: 'AuthPKCECodeVerifierMissingError',
            },
          });

        return status(500, {
          success: false,
          message: 'Internal server error',
          error: {
            ...error,
            status: error.status ?? 500,
            code: error.name,
            reason: error.message,
          },
        });
      }

      return status(200, {
        success: true,
        message: 'New session generated',
        data: {
          ...data.session,
          user: data.user,
        },
      });
    },
    {
      detail: {
        summary: 'Exchange Code',
        description: 'Exchange Google OAuth code for user session and tokens.',
      },
      body: t.Object({
        code: t.String({ description: 'The callback code to exchange.' }),
      }),
      response: {
        200: r.Success(m.AuthSession, 'New session generated', 'Session'),
        400: r.Failed('Missing code'),
        401: r.Failed('Invalid code'),
        500: r.Failed('Internal server error'),
      },
    },
  )

  .post(
    '/logout',
    async ({ status }) => {
      const supabase = await createClient();

      const { user } = (await supabase.auth.getUser()).data;
      if (!user) {
        return status(401, {
          success: false,
          message: 'Unauthorized',
          error: {
            status: 401,
            code: 'UNAUTHORIZED',
            reason: 'User are not logged in',
          },
        });
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        return status(500, {
          success: false,
          message: 'Internal server error',
          error: {
            ...error,
            status: error.status ?? 500,
            code: error.name,
            reason: error.message,
          },
        });
      }

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
        500: r.Failed('Internal server error'),
      },
    },
  )

  // GET /auth/me - Get current user
  .get(
    '/me',
    async ({ status }) => {
      const supabase = await createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || !session || error) {
        if (error?.name === 'AuthSessionMissingError')
          return status(401, {
            success: false,
            message: 'Unauthorized',
            error: {
              status: 401,
              code: 'UNAUTHORIZED',
              reason: 'AuthSessionMissingError',
            },
          });

        return status(500, {
          success: false,
          message: 'Internal server error',
          error: {
            ...error,
            status: error?.status ?? 500,
            code: error?.name || 'INTERNAL_SERVER_ERROR',
            reason: error?.message || 'Internal server error',
          },
        });
      }

      return status(200, {
        success: true,
        message: 'Successfully get authenticated user',
        data: { user, session },
      });
    },
    {
      detail: {
        summary: 'Get Auth User',
        description: 'Get current authenticated user.',
        security: [{ 'Bearer Auth': [] }],
      },
      response: {
        200: r.Success(
          t.Object({
            user: m.AuthUser,
            session: m.AuthSession,
          }),
          'Successfully get authenticated user',
          'Auth user and session',
        ),
        401: r.Failed('Unauthorized'),
        500: r.Failed('Internal server error'),
      },
    },
  );
