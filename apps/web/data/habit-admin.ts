import type { Student } from '@xirpl/api/schema';
import {
  AFTERNOON_HOUR,
  emptyDay,
  fmtDate,
  type HabitDay,
  IBADAH,
  isWeekend,
  LATE_HOUR,
  level,
  type ModuleKey,
  monthStats,
  NIGHT_HOUR,
  OPEN_HOUR,
  SPORT_TYPES,
  streakFrom,
  WAKE_HOUR,
} from './habit-data';
import { picketSchedule } from './picket-schedule';
export const ADMIN_ROLES = [
  'developer',
  'teacher',
  'homeroom_teacher',
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const isAdminRole = (role?: string | null): role is AdminRole =>
  !!role && (ADMIN_ROLES as readonly string[]).includes(role);

export type Member = Student;

/** Recharts paints SVG, so the module palette needs literal colors, not classes. */
export const MODULE_HEX: Record<ModuleKey, string> = {
  ibadah: '#8b5cf6',
  hadir: '#0ea5e9',
  olahraga: '#10b981',
  belajar: '#f59e0b',
};

/**
 * The class roster already lives in the picket schedule (36 names), so it is
 * the fallback when the API returns nothing — an empty dashboard is useless to
 * a teacher checking whether the feature works at all.
 */
export const FALLBACK_MEMBERS: Member[] = picketSchedule
  .flatMap((d) => d.members)
  .map((name, i) => ({
    id: `roster-${name.toLowerCase()}`,
    name,
    nis: 240001 + i,
    role: 'member',
    gender: null,
    islamic_org: null,
  }));

// ---------------------------------------------------------------------------
// Data source
//
// ponytail: habit entries are written to each student's own localStorage by
// `journal.tsx` — there is no `habits` table and no API to read them from, so a
// teacher's browser has no access to anyone else's records. Until that backend
// exists, member days are derived deterministically from the member id: stable
// across renders, reloads and month switches, and shaped like real entries so
// every aggregate below is exercised. Replace ONE function — `memberDay` — with
// the real fetch when the table lands; nothing else here needs to change.
// ---------------------------------------------------------------------------

export const IS_SIMULATED = true;

/** 1x1 transparent GIF: a truthy Photo whose `data` is still a valid img src. */
const STUB_PHOTO =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const SPORT_EXCUSES = [
  'Badan capek setelah praktikum',
  'Hujan seharian',
  'Sedang sakit',
  'Bantu orang tua di rumah',
];

const STUDY_EXCUSES = [
  'Ketiduran habis magrib',
  'Ada acara keluarga',
  'Kurang enak badan',
  'Kehabisan waktu setelah organisasi',
];

const TOPICS = [
  'Struktur data - linked list',
  'Basis data - normalisasi',
  'Pemrograman web - React state',
  'Jaringan - subnetting',
  'Matematika - limit fungsi',
  'Bahasa Inggris - reported speech',
];

const MEDIA = [
  'Buku paket',
  'Video YouTube',
  'Modul sekolah',
  'Dokumentasi resmi',
  'Catatan kelas',
];

/** FNV-1a: same string in, same number out, on every device. */
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const rand = (...parts: (string | number)[]) =>
  hash(parts.join('|')) / 4294967296;

const pick = <T>(list: readonly T[], r: number) =>
  list[Math.min(list.length - 1, Math.floor(r * list.length))] as T;

/** Per-member baseline, 0.38..0.96, so the class spreads instead of clumping. */
const discipline = (id: string) => 0.38 + rand(id, 'discipline') * 0.58;

export function memberDay(id: string, date: Date): HabitDay | null {
  const key = fmtDate(date);
  const weekend = isWeekend(date);
  const p = discipline(id) * (weekend ? 0.82 : 1);

  // Some days are never opened at all.
  if (rand(id, key, 'logged') > 0.08 + p) return null;

  const day = emptyDay();
  day.ibadah = IBADAH.map((_, i) => rand(id, key, 'ibadah', i) < p);

  if (rand(id, key, 'hadir') < p + 0.08) {
    const late = rand(id, key, 'late') > p;
    const at = new Date(date);
    at.setHours(
      weekend
        ? late
          ? // Sebar ke kesiangan/kesorean/kemalaman supaya label bertingkat kelihatan.
            pick(
              [WAKE_HOUR, AFTERNOON_HOUR, NIGHT_HOUR],
              rand(id, key, 'jam-bangun'),
            )
          : WAKE_HOUR - 1
        : late
          ? LATE_HOUR
          : OPEN_HOUR,
      Math.floor(rand(id, key, 'menit-absen') * 59),
      0,
      0,
    );
    day.hadir = { at: at.toISOString(), late };
  }

  const trained = rand(id, key, 'olahraga') < p;
  day.olahraga = trained
    ? {
        done: true,
        sport: pick(SPORT_TYPES, rand(id, key, 'jenis')),
        minutes: 20 + Math.floor(rand(id, key, 'durasi') * 70),
        photo:
          rand(id, key, 'bukti-olahraga') < 0.92
            ? { data: STUB_PHOTO, at: date.toISOString() }
            : null,
        alt: '',
      }
    : {
        done: false,
        sport: '',
        minutes: null,
        photo: null,
        alt:
          rand(id, key, 'alasan-olahraga') < 0.75
            ? pick(SPORT_EXCUSES, rand(id, key, 'alasan-o-teks'))
            : '',
      };

  const studied = rand(id, key, 'belajar') < p;
  const proof = { data: STUB_PHOTO, at: date.toISOString() };
  const bothProofs = rand(id, key, 'bukti-belajar') < 0.88;
  day.belajar = studied
    ? {
        done: true,
        start: proof,
        end: bothProofs ? proof : null,
        alt: '',
        topic: pick(TOPICS, rand(id, key, 'topik')),
        media: pick(MEDIA, rand(id, key, 'media')),
      }
    : {
        done: false,
        start: null,
        end: null,
        topic: '',
        media: '',
        alt:
          rand(id, key, 'alasan-belajar') < 0.75
            ? pick(STUDY_EXCUSES, rand(id, key, 'alasan-b-teks'))
            : '',
      };

  return day;
}

const DAY_MS = 86400000;

/** Same shape and same today-cap as `loadMonth`, but for another member. */
export function memberMonth(
  id: string,
  year: number,
  month: number,
  today: Date,
) {
  const last = new Date(year, month + 1, 0).getDate();
  const midnight = +new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const cap = Math.min(
    last,
    Math.round((midnight - +new Date(year, month, 1)) / DAY_MS) + 1,
  );
  const out = new Map<number, HabitDay | null>();
  for (let d = 1; d <= cap; d++)
    out.set(d, memberDay(id, new Date(year, month, d)));
  return out;
}

const STREAK_WINDOW = 180;

/** Streaks cross month boundaries, so this walks back from today, not the grid. */
export function memberStreak(id: string, today: Date) {
  const midnight = +new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const done: boolean[] = [];
  for (let i = 0; i < STREAK_WINDOW; i++) {
    const hadir = memberDay(id, new Date(midnight - i * DAY_MS))?.hadir;
    done.push(!!hadir && !hadir.late);
  }
  return streakFrom(done);
}

// ---------------------------------------------------------------------------
// Aggregates
// ---------------------------------------------------------------------------

export type MemberSummary = {
  member: Member;
  days: Map<number, HabitDay | null>;
  modules: ReturnType<typeof monthStats>;
  /** Mean daily completion, 0..100. */
  score: number;
  tracked: number;
  logged: number;
  perfect: number;
  late: number;
  absent: number;
  streak: ReturnType<typeof streakFrom>;
};

export function summarize(
  member: Member,
  year: number,
  month: number,
  today: Date,
): MemberSummary {
  const days = memberMonth(member.id, year, month, today);
  const list = [...days.values()];

  let logged = 0;
  let perfect = 0;
  let late = 0;
  let present = 0;
  let total = 0;

  for (const d of list) {
    total += level(d);
    if (!d) continue;
    logged++;
    if (level(d) === 4) perfect++;
    if (d.hadir) {
      present++;
      if (d.hadir.late) late++;
    }
  }

  return {
    member,
    days,
    modules: monthStats(list),
    score: list.length ? Math.round((total / (list.length * 4)) * 100) : 0,
    tracked: list.length,
    logged,
    perfect,
    late,
    absent: list.length - present,
    streak: memberStreak(member.id, today),
  };
}

export function classSummary(rows: MemberSummary[]) {
  const n = rows.length || 1;
  const mean = (f: (r: MemberSummary) => number) =>
    Math.round(rows.reduce((a, r) => a + f(r), 0) / n);
  const sum = (f: (r: MemberSummary) => number) =>
    rows.reduce((a, r) => a + f(r), 0);

  return {
    members: rows.length,
    score: mean((r) => r.score),
    modules: {
      ibadah: mean((r) => r.modules.ibadah),
      hadir: mean((r) => r.modules.hadir),
      olahraga: mean((r) => r.modules.olahraga),
      belajar: mean((r) => r.modules.belajar),
    },
    perfect: sum((r) => r.perfect),
    late: sum((r) => r.late),
    absent: sum((r) => r.absent),
    atRisk: rows.filter((r) => r.score < 50).length,
    streaking: rows.filter((r) => r.streak.count >= 3).length,
  };
}

/** Class-average completion per calendar day — the dashboard's trend line. */
export function classDaily(rows: MemberSummary[]) {
  const acc = new Map<number, { sum: number; n: number }>();
  for (const r of rows) {
    for (const [day, d] of r.days) {
      const cell = acc.get(day) ?? { sum: 0, n: 0 };
      cell.sum += (level(d) / 4) * 100;
      cell.n++;
      acc.set(day, cell);
    }
  }
  return [...acc.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([day, cell]) => ({ day, value: Math.round(cell.sum / cell.n) }));
}

const BUCKETS = [
  { range: '0–39%', min: 0, max: 39 },
  { range: '40–59%', min: 40, max: 59 },
  { range: '60–79%', min: 60, max: 79 },
  { range: '80–100%', min: 80, max: 100 },
];

export function scoreBuckets(rows: MemberSummary[]) {
  return BUCKETS.map((b) => ({
    range: b.range,
    count: rows.filter((r) => r.score >= b.min && r.score <= b.max).length,
  }));
}
