import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  let role = req.nextUrl.searchParams.get('role'),
    sort = req.nextUrl.searchParams.get('sort') ?? 'full_name';
  const supabase = await createClient();

  let { data, error, status } = await supabase.from('profiles').select('*').order(sort);
  if (error) return Response.json({ error: true, ...error }, { status });
  if (!data)
    return Response.json({ error: true, message: 'Something went wrong' }, { status: 500 });

  role = (role ? role + ',' : '') + '!owner,!admin';
  if (!role) return Response.json(data);
  let isAnd = role.split(',').some((r) => !r.startsWith('!'));
  return Response.json(
    data.filter((u) =>
      isAnd
        ? role.split(',').includes(u.role) && !role.split(',').includes('!' + u.role)
        : role.split(',').includes(u.role) || !role.split(',').includes('!' + u.role)
    )
  );
}
