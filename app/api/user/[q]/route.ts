import { createClient } from '@/lib/supabase/admin';
import { UserResponse } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { IProfile, IUser } from '../route';

export async function GET(req: NextRequest, { params }: { params: Promise<{ q: string }> }) {
  const supabase = await createClient();
  let q = (await params).q;
  let response: UserResponse, profile: IProfile;

  q = q.replace(/^@/, '');
  if (q === 'me') response = await supabase.auth.getUser();
  else {
    if (
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
        q
      )
    )
      response = await supabase.auth.admin.getUserById(q);
    else {
      profile = (await supabase.from('profiles').select('*').eq('id', q).single()).data;
      if (!profile)
        return Response.json({ error: true, message: 'User not found' }, { status: 404 });
      response = await supabase.auth.admin.getUserById(profile.uid);
    }
  }

  const { data, error } = response;
  if (error) {
    if (error.name === 'AuthSessionMissingError')
      return Response.json({ error: true, message: 'Unauthorized' }, { status: 401 });
    return Response.json({ error: true, ...error }, { status: error.status });
  }
  if (!data.user) return Response.json({ error: true, message: 'User not found' }, { status: 404 });

  const { user } = data;
  // @ts-expect-error "profile is always there"
  if (!profile)
    profile = (await supabase.from('profiles').select('*').eq('uid', user.id).single()).data;

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
