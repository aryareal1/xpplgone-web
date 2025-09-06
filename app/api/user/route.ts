import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (!data.user || error) {
    if (error?.name === 'AuthSessionMissingError')
      return Response.json({ error: true, message: 'Unauthorized' }, { status: 401 });
    return Response.json({ error: true, ...error }, { status: error?.status });
  }

  const { user } = data;
  const profile = (await supabase.from('profiles').select('*').eq('uid', user.id).single()).data;
  return Response.json({
    id: profile.id,
    uid: user.id,
    name: profile.full_name,
    full_name: profile.full_name,
    original_name: user.user_metadata.name,
    avatar_url: user.user_metadata.avatar_url,
    role: profile.role,
    email: user.user_metadata.email,
  } satisfies IUser);
}

export interface IUser {
  id: string;
  uid: string;
  name: string;
  full_name: string;
  original_name: string;
  avatar_url: string;
  role: string;
  email: string;
}

export interface IProfile {
  id: string;
  uid: string;
  full_name: string;
  role: string;
}
