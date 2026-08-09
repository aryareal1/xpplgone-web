'use client';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FlameIcon,
  InfoIcon,
} from 'lucide-react';
import { AnimatePresence, motion as m, useReducedMotion } from 'motion/react';
import { useId, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  attendanceCopy,
  averageScore,
  dailySeries,
  EMPTY_MODULE_AVERAGES,
  HEAT_BG,
  HEAT_TEXT,
  type JournalRecap,
  MODULES,
  MONTHS,
  moduleStats,
  type StreakData,
  sameDay,
  toLocalDate,
  WEEKDAYS,
} from '../../../../data/habit-data';

/**
 * Explains what a number means. Controlled open so a tap works on touch, where
 * Radix's hover trigger never fires.
 */
export function InfoHint({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`Info: ${label}`}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center self-center leading-none text-slate-400 transition-colors hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none dark:hover:text-slate-200"
        >
          <InfoIcon className="size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-64 leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

export function HabitCalendar({
  selected,
  month,
  levels,
  onSelect,
  onMonthChange,
}: {
  selected: Date;
  month: Date;
  levels: Map<number, number>;
  onSelect: (d: Date) => void;
  onMonthChange: (d: Date) => void;
}) {
  const reduce = useReducedMotion();
  const [dir, setDir] = useState(1);
  const today = useMemo(() => new Date(), []);

  const year = month.getFullYear();
  const mo = month.getMonth();
  const total = new Date(year, mo + 1, 0).getDate();
  const lead = (new Date(year, mo, 1).getDay() + 6) % 7;

  const step = (delta: number) => {
    setDir(delta);
    onMonthChange(new Date(year, mo + delta, 1));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <m.div
            key={`${year}-${mo}`}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {MONTHS[mo]}{' '}
              <span className="font-normal text-slate-400">{year}</span>
            </CardTitle>
          </m.div>
          <InfoHint
            label="Kalender"
            text="Tiap kotak adalah satu hari, makin hijau berarti makin banyak dari 4 modul yang selesai. Klik satu tanggal untuk melihat catatannya. Tanggal selain hari ini hanya bisa dibaca."
          />
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Bulan sebelumnya"
            onClick={() => step(-1)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <ChevronLeftIcon className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Bulan berikutnya"
            onClick={() => step(1)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-2 grid grid-cols-7 gap-2.5">
          {WEEKDAYS.map((d) => (
            <abbr
              key={d}
              title={d}
              className="text-center text-xs font-medium text-slate-400 no-underline"
            >
              {d[0]}
            </abbr>
          ))}
        </div>

        <div className="-m-1 overflow-hidden p-1">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={`${year}-${mo}`}
              initial={reduce ? false : { opacity: 0, x: dir * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -24 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-7 gap-2.5"
            >
              {Array.from({ length: lead }, (_, i) => (
                <span key={`lead-${i}`} />
              ))}
              {Array.from({ length: total }, (_, i) => {
                const day = i + 1;
                const cell = new Date(year, mo, day);
                const future = cell > today && !sameDay(cell, today);
                const lvl = levels.get(day) ?? 0;

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={future}
                    aria-label={`${day} ${MONTHS[mo]}, ${lvl} dari 4 modul selesai`}
                    aria-current={sameDay(cell, today) ? 'date' : undefined}
                    onClick={() => onSelect(cell)}
                    className={cn(
                      'flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition-all',
                      future
                        ? 'cursor-not-allowed text-slate-300 dark:text-slate-700'
                        : cn('cursor-pointer', HEAT_BG[lvl], HEAT_TEXT[lvl]),
                      sameDay(cell, today) &&
                        'ring-2 ring-orange-400 ring-offset-2 ring-offset-background',
                      sameDay(cell, selected) &&
                        !sameDay(cell, today) &&
                        'ring-2 ring-slate-400 ring-offset-2 ring-offset-background dark:ring-slate-500',
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </m.div>
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-center justify-end gap-1.5 text-xs text-slate-400">
          <span>Sedikit</span>
          {HEAT_BG.map((c, i) => (
            <span
              key={c}
              title={`${i} modul selesai`}
              className={cn('size-3 rounded-sm', c)}
            />
          ))}
          <span>Banyak</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function HabitStats({
  month,
  recap,
  streak,
  onMonthChange,
}: {
  month: Date;
  recap: JournalRecap | null;
  streak: StreakData | null;
  onMonthChange: (d: Date) => void;
}) {
  const scores = useMemo(() => recap?.scores ?? [], [recap]);
  const series = useMemo(() => dailySeries(scores), [scores]);
  const stats = moduleStats(recap?.average_score_each ?? EMPTY_MODULE_AVERAGES);
  const perfect = scores.filter((s) => s.score === 100).length;
  const copy = useMemo(() => attendanceCopy(new Date()), []);
  const reduce = useReducedMotion();

  const average = recap?.average_score ?? averageScore(scores);
  const count = streak?.streak ?? 0;
  // Server mengirim tanggal absen terakhir, jadi hari ini aman bila sama.
  const since = streak?.since ? toLocalDate(streak.since) : null;
  const todayDone = !!since && sameDay(since, new Date());
  const atRisk = !todayDone && count > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Statistik
        </CardTitle>
        <select
          aria-label="Filter bulan"
          value={month.getMonth()}
          onChange={(e) =>
            onMonthChange(
              new Date(month.getFullYear(), Number(e.target.value), 1),
            )
          }
          className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          {MONTHS.map((n, i) => (
            <option key={n} value={i}>
              {n}
            </option>
          ))}
        </select>
      </CardHeader>

      <CardContent>
        <div className="mb-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
            {average}%
          </span>
          <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            rata-rata harian
            <InfoHint
              label="Rata-rata harian"
              text="Rata-rata modul yang selesai per hari di bulan ini. Empat modul selesai berarti 100% untuk hari itu."
            />
          </span>
        </div>

        <TrendChart series={series} />

        <div className="mt-7 border-t border-slate-200/70 pt-5 dark:border-slate-800">
          <div
            className={cn(
              'flex items-center gap-3 rounded-xl p-3',
              count > 0
                ? 'bg-linear-to-r from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/30'
                : 'bg-slate-50 dark:bg-slate-800/40',
            )}
          >
            <m.div
              initial={reduce ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-xl',
                count > 0
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500',
              )}
            >
              <FlameIcon className="size-5" />
            </m.div>

            <div className="min-w-0">
              <p className="flex items-center gap-2 text-2xl leading-none font-bold tabular-nums text-slate-900 dark:text-slate-50">
                {count}{' '}
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  hari beruntun
                </span>
                <InfoHint
                  label="Hari beruntun"
                  text={`Jumlah hari berturut-turut kamu ${copy.verb.toLowerCase()}. Dihitung dari seluruh riwayat di server, bukan per bulan, jadi tidak ikut berubah saat kamu ganti bulan. Satu hari terlewat memutus hitungan.`}
                />
              </p>
              <p className="mt-1 text-xs leading-snug text-slate-500 dark:text-slate-400">
                {todayDone
                  ? 'Aman untuk hari ini'
                  : atRisk
                    ? `${copy.verb} sebelum ${copy.deadline} agar streak tidak putus`
                    : `${copy.verb} sebelum ${copy.deadline} untuk memulai streak`}
              </p>
            </div>
          </div>

          <div className="mt-5 mb-3 flex items-baseline justify-between gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Konsistensi
              <InfoHint
                label="Konsistensi"
                text="Porsi hari di bulan ini yang keempat modulnya selesai semua. Hari yang cuma sebagian terisi tidak dihitung di sini."
              />
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {perfect} dari {scores.length} hari penuh
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <m.div
                initial={{ width: 0 }}
                animate={{ width: `${recap?.rate ?? 0}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="h-full rounded-full bg-linear-to-r from-emerald-400 to-emerald-600"
              />
            </div>
            <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-slate-50">
              {recap?.rate ?? 0}%
            </span>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200/70 pt-5 dark:border-slate-800">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Per modul
            </span>
            <InfoHint
              label="Per modul"
              text="Porsi hari di bulan ini tiap modul tercatat selesai. Kehadiran memakai batas 07:00 pada hari sekolah, dan pada Sabtu serta Minggu memakai Bangun Pagi dengan batas 06:00."
            />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {MODULES.map((mod) => (
              <div key={mod.key} className="flex items-center gap-2">
                <span className={cn('size-2 shrink-0 rounded-full', mod.dot)} />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {mod.label}
                </span>
                <span className="ml-auto text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                  {stats[mod.key]}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const W = 300;
const H = 88;

function TrendChart({ series }: { series: { day: number; value: number }[] }) {
  const gradientId = useId();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  if (series.length < 2) {
    return (
      <p className="flex h-22 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
        Belum cukup data bulan ini.
      </p>
    );
  }

  const x = (i: number) => (i / (series.length - 1)) * W;
  const y = (v: number) => H - (v / 100) * H;

  const line = series.map((p, i) => `${x(i)},${y(p.value)}`).join(' ');
  const area = `${x(0)},${H} ${line} ${x(series.length - 1)},${H}`;
  const point = active === null ? null : series[active];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-22 w-full overflow-visible"
        preserveAspectRatio="none"
        role="img"
        aria-label="Grafik tren penyelesaian harian"
      >
        <title>Tren penyelesaian harian</title>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              className="text-emerald-500"
              stopColor="currentColor"
              stopOpacity="0.3"
            />
            <stop
              offset="100%"
              className="text-emerald-500"
              stopColor="currentColor"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {[0, 50, 100].map((v) => (
          <line
            key={v}
            x1="0"
            x2={W}
            y1={y(v)}
            y2={y(v)}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <polygon points={area} fill={`url(#${gradientId})`} />

        <m.polyline
          points={line}
          fill="none"
          className="stroke-emerald-500"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {point && (
          <circle
            cx={x(active as number)}
            cy={y(point.value)}
            r="4"
            className="fill-emerald-500 stroke-white dark:stroke-slate-900"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* Hit areas: one invisible column per day, so hover needs no pointer math. */}
        {series.map((p, i) => (
          <rect
            key={p.day}
            role="presentation"
            x={x(i) - W / series.length / 2}
            y="0"
            width={W / series.length}
            height={H}
            fill="transparent"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          />
        ))}
      </svg>

      {point && (
        <span
          className="pointer-events-none absolute -top-1 z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 px-2 py-1 text-xs font-medium whitespace-nowrap text-white dark:bg-slate-100 dark:text-slate-900"
          style={{
            left: `${((active as number) / (series.length - 1)) * 100}%`,
          }}
        >
          Tgl {point.day}: {point.value}%
        </span>
      )}
    </div>
  );
}
