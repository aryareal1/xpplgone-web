import Elysia, { t } from 'elysia';
import { createClient } from '@/lib/supabase/server';
import { m, r } from '../schema';

export default new Elysia({
  prefix: '/funds',
  detail: { tags: ['Funds'], security: [{ 'Bearer Auth': [] }] },
})
  // GET /funds - Get all funds data
  .get(
    '/',
    async ({ status }) => {
      const supabase = await createClient();

      const { data, error } = await supabase
        .schema('funds')
        .from('data')
        .select('*');
      if (error)
        return status(500, {
          success: false,
          message: 'Internal server error',
          error: {
            ...error,
            status: 500,
            code: error.name,
            reason: error.message,
          },
        });

      const { data: dates } = await supabase
        .schema('funds')
        .from('dates')
        .select('*');

      if (!data || !dates)
        return status(500, {
          success: false,
          message: 'Internal server error',
          error: {
            status: 500,
            code: 'MISSING_DATA',
            reason: 'Data or dates are missing',
          },
        });

      dates.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
      return status(200, {
        success: true,
        message: 'Success get all funds',
        data: { funds: data, dates },
      });
    },
    {
      detail: {
        summary: 'Get All Funds',
        description: 'Get all funds data.',
      },
      response: {
        200: r.Success(
          t.Object({
            funds: t.Array(m.Fund),
            dates: t.Array(m.FundDate),
          }),
          'Success get all funds',
          'Funds data',
        ),
        500: r.Failed('Internal server error'),
      },
    },
  )

  // POST /funds - Update funds data
  .post(
    '/',
    async ({ body, status }) => {
      const supabase = await createClient();
      if (!['data', 'dates'].includes(body.table))
        return status(400, {
          success: false,
          message: 'Invalid table name',
          error: {
            status: 400,
            code: 'INVALID_TABLE_NAME',
            reason: 'Table name is not valid',
          },
        });

      try {
        let response: any;
        const table = supabase.schema('funds').from(body.table);
        if (body.delete) {
          const del = table.delete();
          for (const key in body.value) del.eq(key, body.value[key]);
          response = await del;
        } else response = await table.upsert(body.value);

        if (response.error)
          return status(500, {
            success: false,
            message: 'Internal server error',
            error: {
              ...response.error,
              status: 500,
              code: response.error.name,
              reason: response.error.message,
            },
          });
        return status(200, {
          success: true,
          message: 'Data updated',
          data: null,
        });
      } catch (e) {
        return status(500, {
          success: false,
          message: 'Internal server error',
          error: e as any,
        });
      }
    },
    {
      detail: {
        summary: 'Update Funds',
        description: 'Update funds data.',
      },
      response: {
        200: r.Success(t.Null(), 'Data updated'),
        400: r.Failed('Invalid table name'),
        500: r.Failed('Internal server error'),
      },
      body: t.Object(
        {
          table: t.String(),
          value: t.Any(),
          delete: t.Optional(t.Boolean()),
        },
        {
          description: 'Funds data',
          example: { table: 'data', value: {}, delete: false },
        },
      ),
    },
  );
