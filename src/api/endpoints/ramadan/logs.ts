import Elysia, { t } from 'elysia';
import { m, r } from '../../schema';
import { createClient } from '@/lib/supabase/server';
import { hijriYear } from '@/data/journal-ramadhan';
import type { PostgrestError } from '@supabase/supabase-js';

const mapper = (d: any) => ({
  ramadan_day: d.ramadan_day,
  ramadan_year: d.ramadan_year,
  fasting: d.fasting ?? false,
  salat: {
    subuh: d.subuh ?? false,
    dhuhur: d.dhuhur ?? false,
    ashar: d.ashar ?? false,
    maghrib: d.maghrib ?? false,
    isya: d.isya ?? false,
  },
  salat_sunnah: {
    dhuha: d.dhuha ?? false,
    tarawih: d.tarawih ?? false,
    witir: d.witir ?? false,
    tahajud: d.tahajud ?? false,
    iftitah: d.iftitah ?? false,
  },
  jumah: {
    khotib: d.jumah_khotib,
    khutbah: d.jumah_khutbah,
  },
  tadarus: {
    place: d.tadarus_place,
    juz: d.tadarus_juz,
    surah: d.tadarus_surah,
  },
  tarawih: {
    place: d.tarawih_place,
    imam: d.tarawih_imam,
  },
  ceramah: {
    place: d.ceramah_place,
    dai: d.ceramah_dai,
    materi: d.ceramah_materi,
  },
  notes: d.notes,
});
const parser = (studentId: number, year: number, day: number, data: any) => ({
  student_id: studentId,
  ramadan_year: year,
  ramadan_day: day,

  fasting: data.fasting,
  subuh: data.salat?.subuh,
  dhuhur: data.salat?.dhuhur,
  ashar: data.salat?.ashar,
  maghrib: data.salat?.maghrib,
  isya: data.salat?.isya,
  dhuha: data.salat_sunnah?.dhuha,
  tarawih: data.salat_sunnah?.tarawih,
  witir: data.salat_sunnah?.witir,
  tahajud: data.salat_sunnah?.tahajud,
  iftitah: data.salat_sunnah?.iftitah,
  notes: data.notes,

  jumah_khotib: data.jumah?.khotib,
  jumah_khutbah: data.jumah?.khutbah,

  tadarus_place: data.tadarus?.place,
  tadarus_juz: data.tadarus?.juz,
  tadarus_surah: data.tadarus?.surah,

  tarawih_place: data.tarawih?.place,
  tarawih_imam: data.tarawih?.imam,

  ceramah_place: data.ceramah?.place,
  ceramah_dai: data.ceramah?.dai,
  ceramah_materi: data.ceramah?.materi,
});

export default new Elysia({ prefix: '/logs' })
  // GET /ramadan/logs - Get Logs
  .get(
    '/',
    async ({ query, status }) => {
      const { day_start, day_end, ramadan_year } = query;

      if (day_start && day_end && day_start > day_end) {
        return status(400, {
          success: false,
          message: 'Invalid query parameters',
          error: {
            status: 400,
            code: 'INVALID_QUERY_PARAMETERS',
            reason: 'start_day should be less than end_day',
          },
        });
      }

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

      const q = supabase
        .from('ramadan_logs')
        .select(`
        *,
        user_profiles!inner (id, uid)
      `)
        .eq('user_profiles.uid', user.id)
        .order('ramadan_day');
      if (day_start) q.gte('ramadan_day', day_start);
      if (day_end) q.lte('ramadan_day', day_end);
      if (ramadan_year) q.eq('ramadan_year', ramadan_year);

      const { data, error } = await q;
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
        message: 'Success get ramadan logs',
        data: data.map(mapper),
      });
    },
    {
      detail: {
        summary: 'Get Logs',
        description: "Get student's ramadan logs.",
        security: [{ 'Bearer Auth': [] }],
      },
      query: t.Object({
        day_start: t.Optional(
          t.Number({
            minimum: 1,
            maximum: 30,
            description: 'Filter by day (start)',
          }),
        ),
        day_end: t.Optional(
          t.Number({
            minimum: 1,
            maximum: 30,
            description: 'Filter by day (end)',
          }),
        ),
        ramadan_year: t.Optional(
          t.Number({
            minimum: 1400,
            description: 'Filter by year',
            default: hijriYear,
          }),
        ),
      }),
      response: {
        200: r.Success(
          t.Array(m.RamadanLog),
          'Success get ramadan logs',
          'Logs',
        ),
        400: r.Failed('Invalid query parameters'),
        401: r.Failed('Unauthorized'),
        500: r.Failed('Internal server error'),
      },
    },
  )

  // GET /ramadan/logs/{year}/{day} - Get Log of Day
  .get(
    '/:year/:day',
    async ({ params, status }) => {
      const { year, day } = params;

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
        .from('ramadan_logs')
        .select(`
        *,
        user_profiles!inner (id, uid)
      `)
        .eq('user_profiles.uid', user.id)
        .eq('ramadan_day', day)
        .eq('ramadan_year', year);

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

      if (!data.length)
        return status(404, {
          success: false,
          message: 'Not found',
          error: {
            status: 404,
            code: 'NOT_FOUND',
            reason: 'Data cannot be found in the database',
          },
        });

      return status(200, {
        success: true,
        message: 'Success get ramadan logs',
        data: mapper(data[0]),
      });
    },
    {
      detail: {
        summary: 'Get Log of Day',
        description: "Get student's log of spesific ramadan day.",
        security: [{ 'Bearer Auth': [] }],
      },
      params: t.Object({
        year: t.Number({
          minimum: 1400,
          description: 'Specify the hijra year',
          default: hijriYear,
        }),
        day: t.Number({
          minimum: 1,
          maximum: 30,
          description: 'Specify the ramadan day',
        }),
      }),
      response: {
        200: r.Success(m.RamadanLog, 'Success get log', 'Log'),
        401: r.Failed('Unauthorized'),
        404: r.Failed('Not found'),
        500: r.Failed('Internal server error'),
      },
    },
  )

  // PUT /ramadan/logs/{year}/{day} - Upsert Log
  .put(
    '/:year/:day',
    async ({ params, body, status }) => {
      const { year, day } = params;

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

      const { data: student } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('uid', user.id)
        .single();

      const { data: logs, error: logError } = await supabase
        .from('ramadan_logs')
        .select(`
          *,
          user_profiles!inner (id, uid)
        `)
        .eq('user_profiles.uid', user.id)
        .eq('ramadan_day', day)
        .eq('ramadan_year', year);

      if (logError) {
        return status(500, {
          success: false,
          message: 'Internal server error',
          error: {
            ...logError,
            status: 500,
            code: logError.name ?? 'INTERNAL_SERVER_ERROR',
            reason: logError.message,
          },
        });
      }

      let data: any, error: PostgrestError | null;
      if (!logs.length) {
        // INSERT
        ({ data, error } = await supabase
          .from('ramadan_logs')
          .insert(parser(student?.id!, year, day, body))
          .select('*')
          .single());
      } else {
        // UPDATE
        ({ data, error } = await supabase
          .from('ramadan_logs')
          .update({
            ...parser(student?.id!, year, day, body),
            updated_at: new Date().toISOString(),
          })
          .eq('id', logs[0].id)
          .select('*')
          .single());
      }

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
        message: 'Success upsert log',
        data: mapper(data),
      });
    },
    {
      detail: {
        summary: 'Upsert Log',
        description:
          "Update existing or insert new student's log of spesific ramadan day.",
        security: [{ 'Bearer Auth': [] }],
      },
      params: t.Object({
        year: t.Number({
          minimum: 1400,
          description: 'Specify the hijra year',
          default: hijriYear,
        }),
        day: t.Number({
          minimum: 1,
          maximum: 30,
          description: 'Specify the ramadan day',
        }),
      }),
      body: t.Omit(m.RamadanLog, ['ramadan_day', 'ramadan_year']),
      response: {
        200: r.Success(m.RamadanLog, 'Success upsert log', 'Upsert'),
        401: r.Failed('Unauthorized'),
        404: r.Failed('Not found'),
        500: r.Failed('Internal server error'),
      },
    },
  )

  // DELETE /ramadan/logs/{year}/{day} - Delete Log
  .delete(
    '/:year/:day',
    async ({ params, status }) => {
      const { year, day } = params;

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

      const { data: logs, error: logError } = await supabase
        .from('ramadan_logs')
        .select(`
          *,
          user_profiles!inner (id, uid)
        `)
        .eq('user_profiles.uid', user.id)
        .eq('ramadan_day', day)
        .eq('ramadan_year', year);

      if (logError) {
        return status(500, {
          success: false,
          message: 'Internal server error',
          error: {
            ...logError,
            status: 500,
            code: logError.name ?? 'INTERNAL_SERVER_ERROR',
            reason: logError.message,
          },
        });
      }

      if (!logs.length)
        return status(404, {
          success: false,
          message: 'Not found',
          error: {
            status: 404,
            code: 'NOT_FOUND',
            reason:
              'Cannot find data with that day and year. Save one with POST.',
          },
        });

      const { error } = await supabase
        .from('ramadan_logs')
        .delete()
        .eq('id', logs[0].id);

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
        message: 'Success delete log',
        data: null,
      });
    },
    {
      detail: {
        summary: 'Delete Log',
        description: "Delete existing student's log of spesific ramadan day.",
        security: [{ 'Bearer Auth': [] }],
      },
      params: t.Object({
        year: t.Number({
          minimum: 1400,
          description: 'Specify the hijra year',
          default: hijriYear,
        }),
        day: t.Number({
          minimum: 1,
          maximum: 30,
          description: 'Specify the ramadan day',
        }),
      }),
      response: {
        200: r.Success(t.Null(), 'Success delete log', 'Deleted'),
        401: r.Failed('Unauthorized'),
        404: r.Failed('Not found'),
        500: r.Failed('Internal server error'),
      },
    },
  );
