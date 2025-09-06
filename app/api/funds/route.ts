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

  try {
    if (o.table === 'data') await supabase.schema('funds').from('data').upsert(o.data);

    if (o.table === 'dates')
      await supabase.schema('funds').from('dates').upsert<Partial<IFundsDate>>({ date: o.date });

    return new Response();
  } catch {
    return Response.json({ error: true, message: 'Something went wrong' }, { status: 5000 });
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
