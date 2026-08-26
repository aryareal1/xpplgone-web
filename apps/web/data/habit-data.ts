import type { CheckinsModel } from '@be/modules/checkins/model';
import type { JournalModel } from '@be/modules/journal/model';
import type { LeaderboardModel } from '@be/modules/leaderboard/model';

export type Journal = JournalModel['Journal'];
export type JournalBody = JournalModel['upsertBody'];

/** Tiga keadaan jawaban modul: ya, tidak, belum dijawab. */
export type Answer = Journal['did_sport'];
export type JournalRecap = JournalModel['recapResponse']['data'];
export type JournalStats = JournalModel['statsResponse']['data'];
export type ModuleAverages = JournalRecap['average_score_each'];
export type DayScore = JournalRecap['scores'][number];

export type Check = CheckinsModel['Check'];
export type CheckinType = CheckinsModel['checkInBody']['type'];
export type CheckinRecap = CheckinsModel['recapResponse']['data'];
export type StreakData = CheckinsModel['streakResponse']['data'];

export type LeaderboardEntry =
  LeaderboardModel['response']['data']['entries'][number];

/** Kolom salat, urut sesuai tampilan. `field` menunjuk kolom jurnal di server. */
export const IBADAH = [
  { label: 'Salat Duha', field: 'prayed_dhuha' },
  { label: 'Salat Tahajud', field: 'prayed_tahajud' },
  { label: 'Salat Qobliyah Subuh', field: 'prayed_qabliyah_fajr' },
  { label: "Salat Ba'diah Isya", field: 'prayed_badiyah_isya' },
] as const satisfies readonly { label: string; field: keyof Journal }[];

/** Kolom yang isinya nama file di S3, dipakai untuk membersihkan bukti lepas. */
export const PROOF_FIELDS = [
  'sport_proof_url',
  'study_start_proof_url',
  'study_end_proof_url',
] as const satisfies readonly (keyof Journal)[];

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

/** Bangun pagi lewat jam ini tercatat kesorean, lalu kemalaman. */
export const AFTERNOON_HOUR = 15;
export const NIGHT_HOUR = 18;

export const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

// Tipe check-in mengikuti hari: Sabtu dan Minggu jadi bangun pagi.
export const checkinType = (d: Date): CheckinType =>
  isWeekend(d) ? 'morning' : 'school';

/** Batas telat per tipe, angka yang sama dipakai server. */
export const LATE_HOURS: Record<CheckinType, number> = {
  school: LATE_HOUR,
  morning: WAKE_HOUR,
};

// Jam absen sebagai Date, null kalau hari itu belum tercatat.
export const checkinAt = (c: Check | null) =>
  c?.checked_in_at ? new Date(c.checked_in_at) : null;

// Absen lewat batas jam tipenya, dasar label terlambat/kesiangan.
export function isLateCheck(c: Check | null) {
  const at = checkinAt(c);
  return !!at && !!c && at.getHours() >= LATE_HOURS[c.type ?? checkinType(at)];
}

/**
 * Streak ditentukan di frontend dari status check-in yang diterima dari API.
 * Check-in telat tetap hadir, namun selalu mematikan streak yang ditampilkan.
 */
export const streakForCheckStatus = (
  streak: StreakData | null,
  checks: Check[],
  today = new Date(),
): StreakData | null => {
  const todayDate = fmtDate(today);
  const byDate = new Map(checks.map((check) => [check.date, check]));
  const onTime = (check: Check | undefined) =>
    !!check?.checked_in_at && !isLateCheck(check);
  const isPastWeekend = (date: string) => {
    const day = toLocalDate(date);
    return (
      isWeekend(day) && (date < todayDate || today.getHours() >= WAKE_HOUR)
    );
  };

  // Telat pada hari apa pun, atau weekend yang lewat tanpa Bangun Pagi,
  // memutus streak. Hari ini baru dihitung gagal setelah lewat pukul 06:00.
  const lastBreak = checks
    .filter((check) => check.date <= todayDate)
    .filter(
      (check) =>
        isLateCheck(check) || (isPastWeekend(check.date) && !onTime(check)),
    )
    .map((check) => check.date)
    .sort()
    .at(-1);

  if (!lastBreak) return streak;

  const lastOnTime = checks
    .filter((check) => check.date > lastBreak && onTime(check))
    .map((check) => check.date)
    .sort()
    .at(-1);
  if (!lastOnTime) return { streak: 0, since: null };

  let count = 0;
  let cursor = toLocalDate(lastOnTime);
  while (onTime(byDate.get(fmtDate(cursor)))) {
    count++;
    cursor = new Date(
      cursor.getFullYear(),
      cursor.getMonth(),
      cursor.getDate() - 1,
    );
  }
  return { streak: count, since: lastOnTime };
};

export type AttendanceWindow = 'closed' | 'open' | 'late';

// Status jendela absen saat ini, dipakai untuk mengunci tombol.
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

/**
 * Label untuk catatan yang sudah lewat batas, dihitung dari jam check-in.
 * Bangun pagi bertingkat: kesiangan, lalu kesorean (15:00), lalu kemalaman (18:00).
 */
export const lateLabel = (at: Date) =>
  !isWeekend(at)
    ? 'Terlambat'
    : at.getHours() >= NIGHT_HOUR
      ? 'Kemalaman'
      : at.getHours() >= AFTERNOON_HOUR
        ? 'Kesorean'
        : 'Kesiangan';

// Satu sumber teks untuk jurnal, statistik, dan dasbor admin.
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

/** `api` memetakan modul UI ke nama rata-rata yang dipakai server. */
export const MODULES = [
  {
    key: 'ibadah',
    label: 'Ibadah',
    api: 'prays',
    dot: 'bg-violet-500',
    text: 'text-violet-500',
  },
  {
    key: 'hadir',
    label: 'Kehadiran',
    api: 'checkins',
    dot: 'bg-sky-500',
    text: 'text-sky-500',
  },
  {
    key: 'olahraga',
    label: 'Olahraga',
    api: 'sports',
    dot: 'bg-emerald-500',
    text: 'text-emerald-500',
  },
  {
    key: 'belajar',
    label: 'Belajar',
    api: 'studies',
    dot: 'bg-amber-500',
    text: 'text-amber-500',
  },
] as const satisfies readonly {
  key: string;
  label: string;
  api: keyof ModuleAverages;
  dot: string;
  text: string;
}[];

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

/** Jurnal kosong: tiap kolom `null`, sama seperti baris yang belum diisi. */
export const emptyJournal = (): Journal => ({
  prayed_dhuha: null,
  prayed_tahajud: null,
  prayed_qabliyah_fajr: null,
  prayed_badiyah_isya: null,

  did_sport: null,
  sport_type: null,
  sport_duration: null,
  sport_proof_url: null,
  sport_skip_reason: null,

  did_study: null,
  study_about: null,
  study_media: null,
  study_start_proof_url: null,
  study_end_proof_url: null,
  study_skip_reason: null,
});

const pad = (n: number) => String(n).padStart(2, '0');

/** `YYYY-MM-DD`, bentuk yang diminta dan dikembalikan tiap endpoint. */
export const fmtDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** `YYYY-MM`, bentuk tiap query `month`. */
export const fmtMonth = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;

export function parseDate(s?: string | null): Date | null {
  const m = s?.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!m) return null;
  const [, y, mo, d] = m;
  const dt = new Date(Number(y), Number(mo) - 1, Number(d));
  return dt.getMonth() === Number(mo) - 1 && dt.getDate() === Number(d)
    ? dt
    : null;
}

export const fmtTime = (at: Date | string) =>
  `${new Date(at).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })} WIB`;

// `YYYY-MM-DD` dari server jadi Date lokal, jam nol.
export const toLocalDate = (date: string) => new Date(`${date}T00:00:00`);

// Ambil tanggal (1..31) dari `YYYY-MM-DD`.
export const dayOf = (date: string) => Number(date.slice(8, 10));

/**
 * Modul selesai, cerminan `moduleDone` di server: bukti wajib ada, alasan saja
 * tidak menaikkan skor.
 */
export const moduleStatus = (j: Journal | null, c: Check | null) => ({
  ibadah: !!j && IBADAH.every(({ field }) => j[field] === true),
  hadir: !!c?.checked_in_at,
  olahraga: j?.did_sport === true && !!j.sport_proof_url,
  belajar:
    j?.did_study === true &&
    !!j.study_start_proof_url &&
    !!j.study_end_proof_url,
});

export const level = (j: Journal | null, c: Check | null) =>
  Object.values(moduleStatus(j, c)).filter(Boolean).length;

/** Skor server 0..100 jadi 0..4 modul, satuan yang dipakai peta panas. */
export const scoreLevel = (score: number) => Math.round(score / 25);

// Ubah `scores` dari recap jadi peta tanggal -> level, untuk grid kalender.
export function levelsByDay(scores: DayScore[]) {
  const out = new Map<number, number>();
  for (const s of scores) out.set(dayOf(s.date), scoreLevel(s.score));
  return out;
}

// Ubah `scores` jadi seri grafik harian.
export const dailySeries = (scores: DayScore[]) =>
  scores.map((s) => ({ day: dayOf(s.date), value: s.score }));

export const averageScore = (scores: DayScore[]) =>
  scores.length
    ? Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length)
    : 0;

// Petakan rata-rata per modul dari nama server ke kunci yang dipakai UI.
export const moduleStats = (
  avg: ModuleAverages,
): Record<ModuleKey, number> => ({
  ibadah: avg.prays,
  hadir: avg.checkins,
  olahraga: avg.sports,
  belajar: avg.studies,
});

export const EMPTY_MODULE_AVERAGES: ModuleAverages = {
  checkins: 0,
  prays: 0,
  sports: 0,
  studies: 0,
};

const blank = (s: string) => (s.trim() ? s.trim() : null);

/** Rapikan input teks sebelum dikirim, string kosong disimpan sebagai `null`. */
export const toJournalBody = (j: Journal): JournalBody => ({
  ...j,
  sport_type: j.sport_type && blank(j.sport_type),
  sport_skip_reason: j.sport_skip_reason && blank(j.sport_skip_reason),
  study_about: j.study_about && blank(j.study_about),
  study_media: j.study_media && blank(j.study_media),
  study_skip_reason: j.study_skip_reason && blank(j.study_skip_reason),
});
