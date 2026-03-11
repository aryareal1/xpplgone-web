import { e, r } from '@/api/schema';
import { createClient } from '@/lib/supabase/server';
import Elysia, { t } from 'elysia';

export default new Elysia({ prefix: '/ormas' })
  .get(
    '/',
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
            reason: 'User not found',
          },
        });
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('islamic_org')
        .eq('uid', user.id)
        .single();

      if (error) {
        return status(500, {
          success: false,
          message: 'Internal server error',
          error: {
            ...error,
            status: 500,
            code: error.name ?? 'INTERNAL_SERVER_ERROR',
            reason: error.message,
          },
        });
      }

      return status(200, {
        success: true,
        message: 'Success get ormas',
        data: {
          ormas: data.islamic_org,
        },
      });
    },
    {
      detail: {
        summary: 'Get Ormas',
        description: "Get the student's ormas",
      },
      response: {
        200: r.Success(
          t.Object({ ormas: t.Nullable(e.IslamicOrg) }),
          'Success get ormas',
          'Get',
        ),
        401: r.Failed('Unauthorized'),
        500: r.Failed('Internal server error'),
      },
    },
  )
  .put(
    '/',
    async ({ body, status }) => {
      const supabase = await createClient();
      const { user } = (await supabase.auth.getUser()).data;
      if (!user) {
        return status(401, {
          success: false,
          message: 'Unauthorized',
          error: {
            status: 401,
            code: 'UNAUTHORIZED',
            reason: 'User not found',
          },
        });
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ islamic_org: body })
        .eq('uid', user.id)
        .select('islamic_org')
        .single();

      if (error) {
        return status(500, {
          success: false,
          message: 'Internal server error',
          error: {
            ...error,
            status: 500,
            code: error.name ?? 'INTERNAL_SERVER_ERROR',
            reason: error.message,
          },
        });
      }

      return status(200, {
        success: true,
        message: 'Update success',
        data: data.islamic_org,
      });
    },
    {
      detail: {
        summary: 'Update Ormas',
        description: 'Update the ormas for student.',
      },
      body: t.Object({ ormas: e.IslamicOrg }),
      response: {
        200: r.Success(
          t.Object({ ormas: t.Nullable(e.IslamicOrg) }),
          'Update success',
          'Updated',
        ),
        401: r.Failed('Unauthorized'),
        500: r.Failed('Internal server error'),
      },
    },
  );
