export type Photo = { data: string; at: string };

export type Answer = boolean | null;

export type HabitDay = {
  ibadah: Answer[];
  hadir: { at: string; late: boolean } | null;
  olahraga: {
    done: Answer;
    sport: string;
    minutes: number | null;
    photo: Photo | null;
    alt: string;
  };
  belajar: {
    done: Answer;
    start: Photo | null;
    end: Photo | null;
    alt: string;
    topic: string;
    media: string;
  };
};

export const IBADAH = [
  'Salat Duha',
  'Salat Tahajud',
  'Salat Qobliyah Subuh',
  "Salat Ba'diah Isya",
] as const;

export const SPORT_TYPES = [
  'Lari',
  'Lari Trail',
  'Lari Treadmill',
  'Jalan Kaki',
  'Hiking',
  'Bersepeda',
  'Sepeda Gunung',
  'Sepeda Statis',
  'Renang',
  'Angkat Beban',
  'Latihan Fungsional',
  'Yoga',
  'Pilates',
  'Sepak Bola',
  'Futsal',
  'Basket',
  'Badminton',
  'Tenis',
  'Tenis Meja',
  'Voli',
  'Panjat Dinding',
  'Skateboard',
  'Bela Diri',
  'Lompat Tali',
  'Elliptical',
  'Mesin Rowing',
  'Tangga',
  'Peregangan',
  'Lainnya',
] as const;

export const OPEN_HOUR = 6;
export const LATE_HOUR = 7;

/** Weekend: modul kehadiran berganti jadi bangun pagi, batas 06:00. */
export const WAKE_HOUR = 6;

export const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

export type AttendanceWindow = 'closed' | 'open' | 'late';

export const attendanceWindow = (d: Date): AttendanceWindow =>
  isWeekend(d)
    ? d.getHours() < WAKE_HOUR
      ? 'open'
      : 'late'
    : d.getHours() < OPEN_HOUR
      ? 'closed'
      : d.getHours() < LATE_HOUR
        ? 'open'
        : 'late';

export const isLate = (d: Date) => attendanceWindow(d) === 'late';

/** Satu sumber teks untuk jurnal, statistik, dan dasbor admin. */
export function attendanceCopy(d: Date) {
  const w = isWeekend(d);
  return {
    title: w ? 'Bangun Pagi' : 'Kehadiran',
    noun: w ? 'bangun pagi' : 'kehadiran',
    action: w ? 'Bangun Pagi' : 'Hadir',
    doneAction: w ? 'Sudah Dicatat' : 'Sudah Absen',
    ok: w ? 'Bangun Pagi' : 'Hadir',
    late: w ? 'Kesiangan' : 'Terlambat',
    deadline: w ? '06:00' : '07:00',
    verb: w ? 'Catat bangun pagi' : 'Absen',
  };
}

export const MODULES = [
  {
    key: 'ibadah',
    label: 'Ibadah',
    dot: 'bg-violet-500',
    text: 'text-violet-500',
  },
  { key: 'hadir', label: 'Kehadiran', dot: 'bg-sky-500', text: 'text-sky-500' },
  {
    key: 'olahraga',
    label: 'Olahraga',
    dot: 'bg-emerald-500',
    text: 'text-emerald-500',
  },
  {
    key: 'belajar',
    label: 'Belajar',
    dot: 'bg-amber-500',
    text: 'text-amber-500',
  },
] as const;

export type ModuleKey = (typeof MODULES)[number]['key'];

/** Monday first, matching the calendar grid. Full names so keys are unique. */
export const WEEKDAYS = [
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
  'Minggu',
] as const;

export const MONTHS = Array.from({ length: 12 }, (_, i) =>
  new Date(2000, i, 1).toLocaleDateString('id-ID', { month: 'long' }),
);

/** 0 done .. 4 done. Soft emerald ramp, commit-graph style. */
export const HEAT_BG = [
  'bg-slate-100 dark:bg-slate-800/60',
  'bg-emerald-100 dark:bg-emerald-950',
  'bg-emerald-200 dark:bg-emerald-900',
  'bg-emerald-300 dark:bg-emerald-700',
  'bg-emerald-400 dark:bg-emerald-500',
];

export const HEAT_TEXT = [
  'text-slate-400 dark:text-slate-500',
  'text-emerald-900 dark:text-emerald-200',
  'text-emerald-900 dark:text-emerald-100',
  'text-emerald-950 dark:text-white',
  'text-emerald-950 dark:text-white',
];

export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const emptyDay = (): HabitDay => ({
  ibadah: IBADAH.map(() => null),
  hadir: null,
  olahraga: { done: null, sport: '', minutes: null, photo: null, alt: '' },
  belajar: {
    done: null,
    start: null,
    end: null,
    alt: '',
    topic: '',
    media: '',
  },
});

export const fmtDate = (d: Date) =>
  `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;

export function parseDate(s?: string | null): Date | null {
  const m = s?.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (!m) return null;
  const [, y, mo, d] = m;
  const dt = new Date(Number(y), Number(mo) - 1, Number(d));
  return dt.getMonth() === Number(mo) - 1 && dt.getDate() === Number(d)
    ? dt
    : null;
}

export const storageKey = (date: string) => `habit-${date}`;

export const fmtTime = (iso: string) =>
  `${new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })} WIB`;

export const moduleStatus = (d: HabitDay) => ({
  ibadah: d.ibadah.every((v) => v === true),
  hadir: !!d.hadir,
  olahraga:
    d.olahraga.done === true
      ? !!d.olahraga.photo
      : d.olahraga.done === false && d.olahraga.alt.trim().length > 0,
  belajar:
    d.belajar.done === true
      ? !!d.belajar.start && !!d.belajar.end
      : d.belajar.done === false && d.belajar.alt.trim().length > 0,
});

export const level = (d: HabitDay | null) =>
  d ? Object.values(moduleStatus(d)).filter(Boolean).length : 0;

const pct = (v: number, n: number) => Math.round((v / n) * 100);

export function monthStats(days: (HabitDay | null)[]) {
  const n = days.length || 1;
  const sum = { ibadah: 0, hadir: 0, olahraga: 0, belajar: 0 };

  for (const d of days) {
    if (!d) continue;
    sum.ibadah += d.ibadah.filter((v) => v === true).length / d.ibadah.length;
    const m = moduleStatus(d);
    if (m.hadir) sum.hadir++;
    if (m.olahraga) sum.olahraga++;
    if (m.belajar) sum.belajar++;
  }

  return {
    ibadah: pct(sum.ibadah, n),
    hadir: pct(sum.hadir, n),
    olahraga: pct(sum.olahraga, n),
    belajar: pct(sum.belajar, n),
  };
}

export function dailySeries(days: Map<number, HabitDay | null>) {
  return [...days.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([day, data]) => ({ day, value: pct(level(data), 4) }));
}

export function consistency(days: Map<number, HabitDay | null>) {
  const total = days.size;
  let perfect = 0;
  for (const data of days.values()) if (level(data) === 4) perfect++;
  return { percent: pct(perfect, total || 1), perfect, total };
}

const DAY_MS = 86400000;
const STREAK_WINDOW = 400;

export function streakFrom(done: boolean[]) {
  const todayDone = done[0] ?? false;

  let count = 0;
  for (let i = todayDone ? 0 : 1; i < done.length; i++) {
    if (!done[i]) break;
    count++;
  }

  let best = 0;
  let run = 0;
  for (const ok of done) {
    run = ok ? run + 1 : 0;
    best = Math.max(best, run);
  }

  return { count, best, todayDone, atRisk: !todayDone && count > 0 };
}

export function streakInfo(today: Date) {
  const midnight = +new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const done: boolean[] = [];

  for (let i = 0; i < STREAK_WINDOW; i++) {
    const key = fmtDate(new Date(midnight - i * DAY_MS));
    const hadir = load(key).hadir;
    done.push(!!hadir && !hadir.late);
  }

  return streakFrom(done);
}

export function load(date: string): HabitDay {
  if (typeof window === 'undefined') return emptyDay();
  const raw = localStorage.getItem(storageKey(date));
  if (!raw) return emptyDay();
  try {
    const saved = JSON.parse(raw) as Partial<HabitDay>;
    const base = emptyDay();
    return {
      ...base,
      ...saved,
      olahraga: { ...base.olahraga, ...saved.olahraga },
      belajar: { ...base.belajar, ...saved.belajar },
    };
  } catch {
    return emptyDay();
  }
}

export function loadMonth(year: number, month: number, today: Date) {
  const last = new Date(year, month + 1, 0).getDate();
  const midnight = +new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const cap = Math.min(
    last,
    Math.round((midnight - +new Date(year, month, 1)) / 86400000) + 1,
  );
  const out = new Map<number, HabitDay | null>();

  for (let d = 1; d <= cap; d++) {
    const date = fmtDate(new Date(year, month, d));
    out.set(d, localStorage.getItem(storageKey(date)) ? load(date) : null);
  }
  return out;
}

export function save(date: string, data: HabitDay) {
  try {
    localStorage.setItem(storageKey(date), JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
