import type { CheckinsModel, JournalModel, Student } from '@xirpl/api/schema';
import api from '@/lib/api';
import {
  type Check,
  dailySeries,
  EMPTY_MODULE_AVERAGES,
  fmtMonth,
  type Journal,
  levelsByDay,
  type ModuleKey,
  moduleStats,
} from './habit-data';

export type Member = Student;
export type AdminRole = Extract<
  Member['role'],
  'developer' | 'teacher' | 'homeroom_teacher'
>;

/** Sama dengan `ADMIN_ROLES` di server, penentu akses menu dasbor. */
export const ADMIN_ROLES = [
  'developer',
  'teacher',
  'homeroom_teacher',
] as const satisfies readonly AdminRole[];

export const isAdminRole = (role?: string | null): role is AdminRole =>
  !!role && (ADMIN_ROLES as readonly string[]).includes(role);

/** Recharts paints SVG, so the module palette needs literal colors, not classes. */
export const MODULE_HEX: Record<ModuleKey, string> = {
  ibadah: '#8b5cf6',
  hadir: '#0ea5e9',
  olahraga: '#10b981',
  belajar: '#f59e0b',
};

type ScoreBucket =
  keyof JournalModel['statsResponse']['data']['score_distribution'];

/** Urutan tetap, supaya batang sebaran tidak ikut urutan kunci dari server. */
const BUCKETS = [
  '0-39',
  '40-59',
  '60-79',
  '80-100',
] as const satisfies readonly ScoreBucket[];

const BUCKET_LABEL: Record<ScoreBucket, string> = {
  '0-39': '0–39%',
  '40-59': '40–59%',
  '60-79': '60–79%',
  '80-100': '80–100%',
};

// Semua anggota berperan siswa, dipakai sebagai baris tabel dasbor.
export async function fetchMembers(): Promise<Member[]> {
  const { data } = await api.users.students.get();
  return data?.data ?? [];
}

/** Rekap sekelas: kartu ringkas, tren harian, sebaran skor. */
export async function fetchClassSummary(month: Date) {
  const { data } = await api.journals.stats.get({
    query: { month: fmtMonth(month) },
  });
  const stats = data?.data;

  return {
    score: stats?.average_score ?? 0,
    modules: moduleStats(stats?.average_score_each ?? EMPTY_MODULE_AVERAGES),
    perfect: stats?.completed_days ?? 0,
    streaking: stats?.students_on_streaks ?? 0,
    late: stats?.late_count ?? 0,
    atRisk: stats?.need_attention_count ?? 0,
    trend: dailySeries(stats?.scores ?? []),
    buckets: BUCKETS.map((b) => ({
      range: BUCKET_LABEL[b],
      count: stats?.score_distribution[b] ?? 0,
    })),
  };
}

export type ClassSummary = Awaited<ReturnType<typeof fetchClassSummary>>;

export type MemberRow = {
  member: Member;
  score: number;
  modules: Record<ModuleKey, number>;
  late: number;
  absent: number;
  present: number;
};

/**
 * Satu baris per anggota. Dua endpoint sekaligus: skor modul dari jurnal, telat
 * dan absen dari check-in.
 */
export async function fetchMemberRows(
  members: Member[],
  month: Date,
): Promise<MemberRow[]> {
  const query = { month: fmtMonth(month) };
  const [journals, checkins] = await Promise.all([
    api.journals.students.get({ query }),
    api.checkins.students.get({ query }),
  ]);

  type JournalStudent =
    JournalModel['studentsResponse']['data']['students'][number];
  type CheckStudent =
    CheckinsModel['studentsResponse']['data']['students'][number];

  const scores = new Map<string, JournalStudent>(
    (journals.data?.data.students ?? []).map((s) => [s.user_id, s]),
  );
  const checks = new Map<string, CheckStudent>(
    (checkins.data?.data.students ?? []).map((s) => [s.user_id, s]),
  );

  return members.map((member) => {
    const j = scores.get(member.id);
    const c = checks.get(member.id);
    return {
      member,
      score: j?.average_score ?? 0,
      modules: moduleStats(j?.average_score_each ?? EMPTY_MODULE_AVERAGES),
      late: c?.late_count ?? 0,
      absent: c?.miss_count ?? 0,
      present: c?.check_count ?? 0,
    };
  });
}

/** Halaman detail satu anggota: rekap bulan, rekap check-in, dan streak. */
export async function fetchMemberDetail(id: string, month: Date) {
  const query = { month: fmtMonth(month) };
  const [journal, checkin, streak] = await Promise.all([
    api.users({ id }).journals.recap.get({ query }),
    api.users({ id }).checkins.recap.get({ query }),
    api.users({ id }).checkins.streak.get(),
  ]);

  const recap = journal.data?.data;
  const checks = checkin.data?.data;
  const scores = recap?.scores ?? [];

  return {
    scores,
    series: dailySeries(scores),
    levels: levelsByDay(scores),
    score: recap?.average_score ?? 0,
    modules: moduleStats(recap?.average_score_each ?? EMPTY_MODULE_AVERAGES),
    perfect: scores.filter((s) => s.score === 100).length,
    tracked: scores.length,
    logged: scores.filter((s) => s.score > 0).length,
    late: checks?.late_count ?? 0,
    absent: checks?.miss_count ?? 0,
    streak: streak.data?.data.streak ?? 0,
    since: streak.data?.data.since ?? null,
  };
}

export type MemberDetail = Awaited<ReturnType<typeof fetchMemberDetail>>;

/** Catatan satu anggota pada satu tanggal, untuk kartu rincian hari. */
export async function fetchMemberDay(id: string, date: string) {
  const [journal, checkin] = await Promise.all([
    api.users({ id }).journals({ date }).get(),
    api.users({ id }).checkins({ date }).get(),
  ]);

  return {
    journal: (journal.data?.data ?? null) as Journal | null,
    check: (checkin.data?.data ?? null) as Check | null,
  };
}

export type MemberDay = Awaited<ReturnType<typeof fetchMemberDay>>;
