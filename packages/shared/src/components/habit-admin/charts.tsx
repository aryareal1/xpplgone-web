'use client';

import { type ReactNode, useId, useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '../../utils';
import { useHabitAdmin } from './context';
import type { ModuleKey } from './types';

const AXIS = { fontSize: 11, fill: 'currentColor' };

/** Recharts renders outside Tailwind's tree, so tooltips are styled by hand. */
function ChartTip({
  active,
  payload,
  label,
  suffix = '%',
  labelPrefix = '',
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string }[];
  label?: string | number;
  suffix?: string;
  labelPrefix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border-border bg-card duo-card rounded-xl px-3 py-2 text-xs">
      {label !== undefined && (
        <p className="mb-1 font-semibold text-foreground dark:text-foreground">
          {labelPrefix}
          {label}
        </p>
      )}
      {payload.map((p) => (
        <p
          key={p.name}
          className="flex items-center gap-1.5 text-muted-foreground dark:text-foreground"
        >
          <span
            className="size-2 rounded-full"
            style={{ background: p.color }}
          />
          {p.name}:{' '}
          <span className="font-semibold tabular-nums text-foreground dark:text-foreground">
            {p.value}
            {suffix}
          </span>
        </p>
      ))}
    </div>
  );
}

export function TrendArea({
  series,
  height = 220,
  color = '#10b981',
  name = 'Rata-rata kelas',
}: {
  series: { day: number; value: number }[];
  height?: number;
  color?: string;
  name?: string;
}) {
  const gradientId = useId();

  if (series.length < 2)
    return <Empty height={height}>Belum cukup data untuk bulan ini.</Empty>;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={series}
        margin={{ top: 8, right: 8, bottom: 0, left: -18 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-border dark:stroke-border"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tick={AXIS}
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground"
        />
        <YAxis
          domain={[0, 100]}
          tick={AXIS}
          tickLine={false}
          axisLine={false}
          width={44}
          className="text-muted-foreground"
        />
        <Tooltip
          content={<ChartTip labelPrefix="Tgl " />}
          cursor={{ stroke: color, strokeDasharray: '4 4' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          name={name}
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ModuleRadar({
  stats,
  height = 220,
}: {
  stats: Record<ModuleKey, number>;
  height?: number;
}) {
  const { MODULES } = useHabitAdmin();
  const data = MODULES.map((m) => ({ label: m.label, value: stats[m.key] }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid className="stroke-border dark:stroke-border" />
        <PolarAngleAxis
          dataKey="label"
          tick={AXIS}
          className="text-muted-foreground"
        />
        <Tooltip content={<ChartTip />} />
        <Radar
          name="Ketuntasan"
          dataKey="value"
          stroke="#0ea5e9"
          fill="#0ea5e9"
          fillOpacity={0.28}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function ModuleBars({
  stats,
  height = 220,
}: {
  stats: Record<ModuleKey, number>;
  height?: number;
}) {
  const { MODULES, MODULE_HEX } = useHabitAdmin();
  const data = MODULES.map((m) => ({
    label: m.label,
    value: stats[m.key],
    fill: MODULE_HEX[m.key],
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-border dark:stroke-border"
          vertical={false}
        />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis
          domain={[0, 100]}
          tick={AXIS}
          tickLine={false}
          axisLine={false}
          width={44}
        />
        <Tooltip content={<ChartTip />} cursor={{ fill: 'transparent' }} />
        <Bar dataKey="value" name="Ketuntasan" radius={[6, 6, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.label} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

const BUCKET_HEX = ['#f43f5e', '#f59e0b', '#0ea5e9', '#10b981'];

export function DistributionBars({
  data,
  height = 220,
}: {
  data: { range: string; count: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-border dark:stroke-border"
          vertical={false}
        />
        <XAxis dataKey="range" tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis
          allowDecimals={false}
          tick={AXIS}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip
          content={<ChartTip suffix=" anggota" />}
          cursor={{ fill: 'transparent' }}
        />
        <Bar dataKey="count" name="Anggota" radius={[6, 6, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={d.range} fill={BUCKET_HEX[i % BUCKET_HEX.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function Empty({ height, children }: { height: number; children: ReactNode }) {
  return (
    <p
      style={{ height }}
      className="flex items-center justify-center rounded-xl bg-secondary text-sm text-muted-foreground dark:bg-secondary/40"
    >
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Read-only heat calendar
// ---------------------------------------------------------------------------

/**
 * Same heat ramp as the student journal, but every cell is a button that only
 * selects a day for inspection — a teacher must never be able to edit a
 * student's record from here.
 */
export function HeatCalendar({
  month,
  levels,
  selected,
  onSelect,
}: {
  month: Date;
  levels: Map<number, number>;
  selected: number | null;
  onSelect: (day: number) => void;
}) {
  const { HEAT_BG, HEAT_TEXT, MONTHS, WEEKDAYS, sameDay } = useHabitAdmin();
  const today = useMemo(() => new Date(), []);
  const year = month.getFullYear();
  const mo = month.getMonth();
  const total = new Date(year, mo + 1, 0).getDate();
  const lead = (new Date(year, mo, 1).getDay() + 6) % 7;

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-2">
        {WEEKDAYS.map((d) => (
          <abbr
            key={d}
            title={d}
            className="text-center text-xs font-medium text-muted-foreground no-underline"
          >
            {d[0]}
          </abbr>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
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
              disabled={future || !levels.has(day)}
              onClick={() => onSelect(day)}
              aria-label={`${day} ${MONTHS[mo]}, ${lvl} dari 4 modul selesai`}
              aria-pressed={selected === day}
              className={cn(
                'flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition-all',
                future || !levels.has(day)
                  ? 'cursor-not-allowed text-muted-foreground/40'
                  : cn('cursor-pointer', HEAT_BG[lvl], HEAT_TEXT[lvl]),
                sameDay(cell, today) &&
                  'ring-2 ring-orange-400 ring-offset-2 ring-offset-background',
                selected === day &&
                  !sameDay(cell, today) &&
                  'ring-2 ring-ring ring-offset-2 ring-offset-background dark:ring-ring',
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
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
    </div>
  );
}
