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
  Users,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { muCalendar, nuCalendar } from '@/data/journal-ramadhan';
import StudentRecapContent from './StudentRecapContent';
import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: `Ramadhan Admin | ${SITE_NAME}`,
  description: 'Melihat data rekap siswa',
};

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
    .select('id, display_name, username, nis, gender, islamic_org')
    .eq('nis', parseInt(nis, 10))
    .single();

  if (!student) return notFound();

  // Fetch all 30 days logs
  const { data: logs } = await supabase
    .from('ramadan_logs')
    .select('*')
    .eq('student_id', student.id)
    .order('ramadan_day', { ascending: true });

  // Fetch eid visits
  const { data: eidVisits } = await supabase
    .from('eid_visits')
    .select('*')
    .eq('student_id', student.id)
    .order('id', { ascending: true });

  // Calculate Stats
  const filledDays = logs?.length || 0;
  const fastingDays = logs?.filter((l) => l.fasting).length || 0;
  const tarawihDays = logs?.filter((l) => l.tarawih).length || 0;
  const tadarusJuz = logs?.length
    ? Math.max(...logs.map((l) => l.tadarus_juz || 0))
    : 0;

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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  value={tadarusJuz}
                  sub="Juz"
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
          calendar={student.islamic_org === 'mu' ? muCalendar : nuCalendar}
        />

        {/* Daftar Kunjungan Silaturahmi */}
        <section className="mt-12">
          <header className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-black flex items-center gap-2 tracking-tight">
              <Users className="h-5 w-5 text-emerald-500" />
              Daftar Kunjungan Silaturahmi
            </h2>
          </header>

          {eidVisits && eidVisits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eidVisits.map((visit, idx) => (
                <Card
                  key={visit.id}
                  className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 border-l-4 border-l-emerald-500 dark:border-l-emerald-500 shadow-sm"
                >
                  <CardContent className="p-4">
                    <div
                      className={cn(
                        'flex gap-3',
                        visit.notes ? 'items-start' : 'items-center',
                      )}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {idx + 1}
                      </div>
                      <div className="flex-1 flex-col min-w-0">
                        <p className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                          {visit.visited_name}
                        </p>
                        {visit.notes && (
                          <div className="mt-2 flex items-start gap-1.5">
                            <MessageSquare className="h-3 w-3 text-slate-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
                              {visit.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/40">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-10 w-10 text-slate-200 dark:text-slate-800 mb-3" />
                <p className="text-sm text-slate-400 italic">
                  Belum ada data kunjungan silaturahmi
                </p>
              </CardContent>
            </Card>
          )}
        </section>
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
