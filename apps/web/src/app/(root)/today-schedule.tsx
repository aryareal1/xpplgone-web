'use client';

import { CheckIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import { motion as m } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import XiRplMascot from '@fe/components/mascot/Mascot';
import SectionHeader from '@fe/components/section-header';
import { Skeleton } from '@fe/components/ui/skeleton';
import { cn } from '@fe/lib/utils';
import { scheduleData } from '../../../data/subject-schedule';

const mins = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

const fmtDay = (d: Date) =>
  d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

export default function TodaySchedule() {
  // Tanggal dihitung di klien saja supaya render server tidak beda dari klien.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const day = now?.getDay();
  const lessons = day && day >= 1 && day <= 5 ? scheduleData[day - 1] : null;
  const clock = now?.toTimeString().slice(0, 5);

  return (
    <section id="today-schedule">
      <SectionHeader
        title="Jadwal Hari Ini"
        desc={now ? fmtDay(now) : 'Memuat hari ini...'}
      />

      {!now ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 rounded-3xl" />
          ))}
        </div>
      ) : lessons?.lessons.length ? (
        <ol className="flex flex-col gap-3">
          {lessons.lessons.map((l, i) => {
            const active =
              !!clock && clock >= l.startTime && clock <= l.endTime;
            const done = !!clock && clock > l.endTime;
            // Progres jam pelajaran yang sedang berjalan, dari data waktu asli.
            const pct =
              active && clock
                ? Math.min(
                    100,
                    Math.max(
                      0,
                      ((mins(clock) - mins(l.startTime)) /
                        (mins(l.endTime) - mins(l.startTime) || 1)) *
                        100,
                    ),
                  )
                : 0;
            return (
              <m.li
                key={l.time}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'bg-card duo-card duo-press flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border-l-[10px] px-5 py-4',
                  l.color,
                  active &&
                    'bg-pastel-blue/50 [--duo-depth:6px] dark:bg-blue-500/15',
                  done && 'opacity-55',
                )}
              >
                <span className="text-brand-navy w-24 shrink-0 font-mono text-base font-extrabold tabular-nums dark:text-white">
                  {l.startTime}
                  <span className="text-muted-foreground block font-sans text-xs font-bold">
                    {l.endTime}
                  </span>
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-base font-extrabold md:text-lg">
                    {l.subject}
                  </span>
                  <span className="text-muted-foreground text-sm font-medium">
                    {l.teacher}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  {l.room && (
                    <span className="bg-secondary text-secondary-foreground border-border flex items-center gap-1 rounded-full border-2 px-3 py-1 text-xs font-extrabold uppercase">
                      <MapPinIcon className="size-3.5" /> {l.room}
                    </span>
                  )}
                  {active && (
                    <span className="bg-brand-blue duo-card flex items-center gap-1 rounded-full border-transparent px-3 py-1 text-xs font-extrabold tracking-wide text-white uppercase [--duo-depth:3px] [--duo-shade:#1565c0]">
                      <ClockIcon className="size-3.5" /> Sekarang
                    </span>
                  )}
                  {done && (
                    <span
                      title="Sudah selesai"
                      className="bg-pastel-green flex size-7 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                    >
                      <CheckIcon className="size-4" strokeWidth={3} />
                      <span className="sr-only">Sudah selesai</span>
                    </span>
                  )}
                </span>

                {active && (
                  <span className="bg-secondary border-border mt-1 h-3 w-full overflow-hidden rounded-full border-2">
                    <span
                      className="bg-brand-yellow block h-full rounded-full transition-[width] duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                )}
              </m.li>
            );
          })}
        </ol>
      ) : (
        <div className="border-border bg-card duo-card flex flex-col items-center gap-2 rounded-3xl px-6 py-10 text-center">
          <XiRplMascot size={180} className="h-auto w-full max-w-[180px]" />
          <p className="text-lg font-extrabold uppercase">
            Tidak ada jadwal hari ini.
          </p>
          <p className="text-muted-foreground text-sm font-medium">
            Selamat berakhir pekan! Istirahat dulu, besok ngoding lagi.
          </p>
        </div>
      )}

      <Link
        href="/schedules/subject"
        className="text-brand-blue border-brand-blue/40 bg-card duo-card duo-press mt-5 inline-flex h-11 items-center rounded-2xl px-5 text-sm font-extrabold tracking-wide uppercase dark:text-blue-300"
      >
        Lihat jadwal lengkap →
      </Link>
    </section>
  );
}
