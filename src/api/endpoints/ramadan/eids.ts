import { m, r } from '@/api/schema';
import { hijriYear } from '@/data/journal-ramadhan';
import { createClient } from '@/lib/supabase/server';
import Elysia, { t } from 'elysia';

export default new Elysia({ prefix: '/eid-visits' })
  // GET /eid-visits - Get Eid Visits
  .get(
    '/',
    async ({ query, status }) => {
      const { ramadan_year } = query;

      const supabase = await createClient();

      const { user } = (await supabase.auth.getUser()).data;
      if (!user)
        return status(401, {
          success: false,
          message: 'Unauthorized',
          error: {
            status: 401,
            code: 'UNAUTHORIZED',
            reason: 'You are not logged in',
          },
        });

      const q = supabase
        .from('eid_visits')
        .select(`
          *,
          user_profiles (id, uid)
        `)
        .eq('user_profiles.uid', user.id)
        .order('ramadan_year', { ascending: false });
      if (ramadan_year) q.eq('ramadan_year', ramadan_year);

      const { data, error } = await q;
      if (error)
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

      return status(200, {
        success: true,
        message: 'Success get eid visits',
        data,
      });
    },
    {
      detail: {
        summary: 'Get Eid Visits',
        description: "Get student's eid visits.",
        security: [{ 'Bearer Auth': [] }],
      },
      query: t.Object({
        ramadan_year: t.Optional(
          t.Number({
            minimum: 1400,
            description: 'Specify the hijra year',
            default: hijriYear,
          }),
        ),
      }),
      response: {
        200: r.Success(
          t.Array(m.EidVisit),
          'Success get eid visits',
          'Eid Visits',
        ),
        401: r.Failed('Unauthorized'),
        500: r.Failed('Internal server error'),
      },
    },
  )

  // POST /eid-visits/{year} - Create Eid Visit
  .post(
    '/:year',
    async ({ params, body, status }) => {
      const { year } = params;

      const supabase = await createClient();

      const { user } = (await supabase.auth.getUser()).data;
      if (!user)
        return status(401, {
          success: false,
          message: 'Unauthorized',
          error: {
            status: 401,
            code: 'UNAUTHORIZED',
            reason: 'You are not logged in',
          },
        });

      const { data: student } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('uid', user.id)
        .single();

      const { data, error } = await supabase
        .from('eid_visits')
        .insert({
          ramadan_year: year,
          student_id: student?.id,
          ...body,
        })
        .select('*')
        .single();

      if (error)
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

      return status(200, {
        success: true,
        message: 'Success add eid visit',
        data,
      });
    },
    {
      detail: {
        summary: 'Add Eid Visit',
        description: "Add student's eid visit.",
        security: [{ 'Bearer Auth': [] }],
      },
      params: t.Object({
        year: t.Number({
          minimum: 1400,
          description: 'Specify the hijra year',
          default: hijriYear,
        }),
      }),
      body: t.Omit(m.EidVisit, ['id', 'ramadan_year']),
      response: {
        200: r.Success(m.EidVisit, 'Success add eid visit', 'Created'),
        401: r.Failed('Unauthorized'),
        500: r.Failed('Internal server error'),
      },
    },
  )

  // PATCH /eid-visits/{id} - Update Eid Visit by ID
  .patch(
    '/:id',
    async ({ params, body, status }) => {
      const { id } = params;

      const supabase = await createClient();

      const { user } = (await supabase.auth.getUser()).data;
      if (!user)
        return status(401, {
          success: false,
          message: 'Unauthorized',
          error: {
            status: 401,
            code: 'UNAUTHORIZED',
            reason: 'You are not logged in',
          },
        });

      const { data: visit } = await supabase
        .from('eid_visits')
        .select('id')
        .eq('id', id)
        .maybeSingle();

      if (!visit)
        return status(404, {
          success: false,
          message: 'Not found',
          error: {
            status: 404,
            code: 'NOT_FOUND',
            reason: "Data doesn't exist",
          },
        });

      const { data, error } = await supabase
        .from('eid_visits')
        .update(body)
        .eq('id', visit.id)
        .select('*')
        .single();

      if (error)
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

      return status(200, {
        success: true,
        message: 'Updated successfully',
        data,
      });
    },
    {
      detail: {
        summary: 'Update Eid Visit by ID',
        description: "Update student's eid visit.",
        security: [{ 'Bearer Auth': [] }],
      },
      params: t.Object({
        id: t.Number(),
      }),
      body: t.Partial(t.Omit(m.EidVisit, ['id'])),
      response: {
        200: r.Success(m.EidVisit, 'Updated successfully', 'Updated'),
        401: r.Failed('Unauthorized'),
        404: r.Failed('Not Found'),
        500: r.Failed('Internal server error'),
      },
    },
  )

  // DELETE /eid-visits/{id} - Delete Eid Visit by ID
  .delete(
    '/:id',
    async ({ params, status }) => {
      const { id } = params;

      const supabase = await createClient();

      const { user } = (await supabase.auth.getUser()).data;
      if (!user)
        return status(401, {
          success: false,
          message: 'Unauthorized',
          error: {
            status: 401,
            code: 'UNAUTHORIZED',
            reason: 'You are not logged in',
          },
        });

      const { data: visit } = await supabase
        .from('eid_visits')
        .select('id')
        .eq('id', id)
        .maybeSingle();

      if (!visit)
        return status(404, {
          success: false,
          message: 'Not found',
          error: {
            status: 404,
            code: 'NOT_FOUND',
            reason: "Data doesn't exist",
          },
        });

      const { error } = await supabase
        .from('eid_visits')
        .delete()
        .eq('id', visit.id);

      if (error)
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

      return status(200, {
        success: true,
        message: 'Deleted successfully',
        data: null,
      });
    },
    {
      detail: {
        summary: 'Delete Eid Visit by ID',
        description: "Delete student's eid visit.",
        security: [{ 'Bearer Auth': [] }],
      },
      params: t.Object({
        id: t.Number(),
      }),
      response: {
        200: r.Success(t.Null(), 'Deleted successfully', 'Deleted'),
        401: r.Failed('Unauthorized'),
        404: r.Failed('Not Found'),
        500: r.Failed('Internal server error'),
      },
    },
  );
