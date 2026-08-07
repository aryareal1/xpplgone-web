'use client';

import { ChevronLeftIcon, ChevronRightIcon, FlameIcon } from 'lucide-react';
import { AnimatePresence, motion as m, useReducedMotion } from 'motion/react';
import { useId, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  consistency,
  dailySeries,
  type HabitDay,
  level,
  MODULES,
  monthStats,
  streakInfo,
} from '../../../../data/habit-data';

/** 0 done .. 4 done. Soft emerald ramp, commit-graph style. */
const HEAT_BG = [
  'bg-slate-100 dark:bg-slate-800/60',
  'bg-emerald-100 dark:bg-emerald-950',
  'bg-emerald-200 dark:bg-emerald-900',
  'bg-emerald-300 dark:bg-emerald-700',
  'bg-emerald-400 dark:bg-emerald-500',
];

const HEAT_TEXT = [
  'text-slate-400 dark:text-slate-500',
  'text-emerald-900 dark:text-emerald-200',
  'text-emerald-900 dark:text-emerald-100',
  'text-emerald-950 dark:text-white',
  'text-emerald-950 dark:text-white',
];

const WEEKDAYS = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];
const MONTHS = Array.from({ length: 12 }, (_, i) =>
  new Date(2000, i, 1).toLocaleDateString('id-ID', { month: 'long' }),
);

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export function HabitCalendar({
  selected,
  month,
  days,
  onSelect,
  onMonthChange,
}: {
  selected: Date;
  month: Date;
  days: Map<number, HabitDay | null>;
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
          {WEEKDAYS.map((d, i) => (
            <span
              key={i}
              className="text-center text-xs font-medium text-slate-400"
            >
              {d}
            </span>
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
                const lvl = level(days.get(day) ?? null);

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
  days,
  onMonthChange,
}: {
  month: Date;
  days: Map<number, HabitDay | null>;
  onMonthChange: (d: Date) => void;
}) {
  const stats = useMemo(() => monthStats([...days.values()]), [days]);
  const series = useMemo(() => dailySeries(days), [days]);
  const rate = useMemo(() => consistency(days), [days]);
  const streak = useMemo(() => streakInfo(new Date()), [days]);
  const reduce = useReducedMotion();

  const average = series.length
    ? Math.round(series.reduce((a, p) => a + p.value, 0) / series.length)
    : 0;
  const delta = (series.at(-1)?.value ?? 0) - (series.at(-2)?.value ?? 0);

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
          className="cursor-pointer rounded-lg border border-slate-200 bg-transparent px-2 py-1 text-sm font-medium text-slate-600 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:border-slate-700 dark:text-slate-300"
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
          <span
            className={cn(
              'text-sm font-semibold tabular-nums',
              delta > 0 && 'text-emerald-600 dark:text-emerald-400',
              delta < 0 && 'text-rose-600 dark:text-rose-400',
              delta === 0 && 'text-slate-400',
            )}
          >
            {delta > 0 ? '+' : ''}
            {delta}%
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            rata-rata harian
          </span>
        </div>

        <TrendChart series={series} />

        <div className="mt-7 border-t border-slate-200/70 pt-5 dark:border-slate-800">
          <div
            className={cn(
              'flex items-center gap-3 rounded-xl p-3',
              streak.count > 0
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
                streak.count > 0
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500',
              )}
            >
              <FlameIcon className="size-5" />
            </m.div>

            <div className="min-w-0">
              <p className="text-2xl leading-none font-bold tabular-nums text-slate-900 dark:text-slate-50">
                {streak.count}{' '}
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  hari beruntun
                </span>
              </p>
              <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                {streak.todayDone
                  ? `Aman untuk hari ini · terpanjang ${streak.best} hari`
                  : streak.atRisk
                    ? 'Absen sebelum 07:00 agar streak tidak putus'
                    : 'Absen sebelum 07:00 untuk memulai streak'}
              </p>
            </div>
          </div>

          <div className="mt-5 mb-3 flex items-baseline justify-between">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Konsistensi
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {rate.perfect} dari {rate.total} hari penuh
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <m.div
                initial={{ width: 0 }}
                animate={{ width: `${rate.percent}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="h-full rounded-full bg-linear-to-r from-emerald-400 to-emerald-600"
              />
            </div>
            <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-slate-50">
              {rate.percent}%
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-slate-200/70 pt-5 dark:border-slate-800">
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
