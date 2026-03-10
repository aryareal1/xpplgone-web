import type { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import SectionHeader from '@/components/section-header';
import { Card, CardContent } from '@/components/ui/card';
import {
  ClipboardCheck,
  CheckCircle2,
  ChevronLeft,
  BookOpen,
  Calendar,
  Moon,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { muCalendar } from '@/data/journal-ramadhan';
import StudentRecapContent from './StudentRecapContent';

export default async function StudentRecapPage({
  params,
}: {
  params: Promise<{ nis: string }>;
}) {
  const { nis } = await params;
  const supabase = await createClient();

  // Access Control
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('uid', user.id)
    .single();

  const allowedRoles = ['owner', 'admin', 'teacher', 'homeroom_teacher'];
  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect('/ramadan');
  }

  // Fetch student info
  const { data: student } = await supabase
    .from('user_profiles')
    .select('id, display_name, username, nis, gender')
    .eq('nis', parseInt(nis, 10))
    .single();

  if (!student) return notFound();

  // Fetch all 30 days logs
  const { data: logs } = await supabase
    .from('ramadan_logs')
    .select('*')
    .eq('student_id', student.id)
    .order('ramadan_day', { ascending: true });

  // Calculate Stats
  const filledDays = logs?.length || 0;
  const fastingDays = logs?.filter((l) => l.fasting).length || 0;
  const tarawihDays = logs?.filter((l) => l.tarawih).length || 0;
  const tadarusDays = logs?.filter((l) => l.tadarus_juz).length || 0;
  const totalPrays =
    logs?.reduce((acc, l) => {
      let count = 0;
      if (l.subuh) count++;
      if (l.dhuhur) count++;
      if (l.ashar) count++;
      if (l.maghrib) count++;
      if (l.isya) count++;
      return acc + count;
    }, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <main className="mx-auto max-w-[1000px] px-4 py-8">
        <header className="mb-8 flex flex-col gap-4">
          <Button variant="ghost" asChild className="w-fit -ml-2 rounded-full">
            <Link href="/ramadan/admin" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Kembali ke Daftar
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <SectionHeader
              title={`Rekap Ramadhan`}
              desc={[
                `${student.display_name || student.username}`,
                `${student.nis}`,
              ]}
              color="bg-orange-500"
            />
          </div>
        </header>

        {/* Summary Stats Card */}
        <section className="mb-10">
          <Card className="border-none bg-orange-500 text-white shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Moon className="h-32 w-32 rotate-12" />
            </div>
            <CardContent className="p-6 relative z-10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ClipboardCheck className="h-6 w-6" />
                Ringkasan Capaian Ramadhan
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatBox
                  icon={<Calendar className="h-4 w-4" />}
                  label="Terisi"
                  value={`${filledDays}/30`}
                  sub="Hari"
                />
                <StatBox
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  label="Puasa"
                  value={fastingDays}
                  sub="Hari"
                />
                <StatBox
                  icon={<Moon className="h-4 w-4" />}
                  label="Tarawih"
                  value={tarawihDays}
                  sub="Malam"
                />
                <StatBox
                  icon={<BookOpen className="h-4 w-4" />}
                  label="Tadarus"
                  value={tadarusDays}
                  sub="Selesai"
                />
                <StatBox
                  icon={<Clock className="h-4 w-4" />}
                  label="Shalat"
                  value={totalPrays}
                  sub="Waktu"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        <header className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-black flex items-center gap-2 tracking-tight">
            <Calendar className="h-5 w-5 text-orange-500" />
            Jurnal Harian
          </h2>
        </header>

        <StudentRecapContent
          student={student}
          logs={logs || []}
          calendar={muCalendar}
        />
      </main>
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  sub,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2 flex items-center gap-2">
        {icon}
        {label}
      </p>
      <div className="flex items-baseline gap-1.5 mt-auto">
        <span className="text-3xl font-black tracking-tight">{value}</span>
        {sub && (
          <span className="text-[10px] font-black uppercase opacity-60">
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}
