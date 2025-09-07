import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  let { data, error, status } = await supabase
    .schema('funds')
    .from('data')
    .select<'*', IFundsData>('*');
  if (error) return Response.json({ error: true, ...error }, { status });
  let { data: dates } = await supabase.schema('funds').from('dates').select<'*', IFundsDate>('*');
  if (!data || !dates)
    return Response.json({ error: true, message: 'Something went wrong' }, { status: 500 });

  dates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return Response.json({ data, dates });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  let o = await req.json();
  if (!['data', 'dates'].includes(o.table))
    return Response.json({ error: true, message: 'Invalid table name' }, { status: 400 });

  try {
    let response;
    const table = supabase.schema('funds').from(o.table);
    if (o.delete) {
      let del = table.delete();
      for (let key in o.value) del.eq(key, o.value[key]);
      response = await del;
    } else response = await table.upsert(o.value);

    if (response.error) return Response.json(response.error, { status: 500 });
    return new Response('OK');
  } catch {
    return Response.json({ error: true, message: 'Something went wrong' }, { status: 500 });
  }
}

export interface IFundsData {
  id: number;
  user: string;
  date: string;
  amount: number;
  created_at: string;
  updated_at: string;
  updated_by: string;
}
export interface IFundsDate {
  date: string;
  created_at: string;
  created_by: string;
}
