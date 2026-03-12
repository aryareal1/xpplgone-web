import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SectionHeader from '@/components/section-header';
import MemberRecapList from './MemberRecapList';
import { SITE_NAME } from '@/lib/constants';

export const metadata = {
  title: `Ramadhan Admin | ${SITE_NAME}`,
  description: 'Rekap data harian Ramadhan peserta didik.',
};

export default async function RamadanAdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/ramadan/admin');
  }

  // Check role
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('uid', user.id)
    .single();

  if (profileError || !profile) {
    redirect('/ramadan');
  }

  const allowedRoles = ['owner', 'admin', 'teacher', 'homeroom_teacher'];
  if (!allowedRoles.includes(profile.role)) {
    redirect('/ramadan');
  }

  // Fetch students via RPC
  const { data: students, error: studentsError } =
    await supabase.rpc('get_students_recap');

  if (studentsError) {
    console.error('Error fetching students:', studentsError);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <main className="mx-auto max-w-[800px] px-4 py-12">
        <SectionHeader
          title="Rekap Data Ramadhan"
          desc="Daftar peserta didik X PPLG 1"
          color="bg-orange-500"
        />

        <div className="mt-8">
          <MemberRecapList students={students || []} />
        </div>
      </main>
    </div>
  );
}
