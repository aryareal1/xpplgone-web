'use client';

import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  DumbbellIcon,
  FlameIcon,
  LoaderCircleIcon,
  MoonStarIcon,
  NotebookPenIcon,
  SearchIcon,
  ShieldAlertIcon,
  TrendingUpIcon,
  XIcon,
  type UsersIcon,
} from 'lucide-react';
import { treaty } from '@elysia/eden';
import type { App } from '@be/app';
import { motion as m, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Button } from '@fe/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@fe/components/ui/card';
import { Input } from '@fe/components/ui/input';
import { Skeleton } from '@fe/components/ui/skeleton';
import { useUser } from '@fe/hooks/use-user';
import { API_URL, fileUrl } from '@fe/lib/api';
import { cn } from '@fe/lib/utils';
import {
  type ClassSummary,
  fetchClassSummary,
  fetchMemberDay,
  fetchMemberDetail,
  fetchMemberRows,
  fetchMembers,
  isAdminRole,
  type Member,
  type MemberDay,
  type MemberDetail as MemberDetailData,
  type MemberRow,
} from '../../../../../data/habit-admin';
import {
  attendanceCopy,
  checkinAt,
  fmtDate,
  fmtTime,
  IBADAH,
  isLateCheck,
  lateLabel,
  level,
  MODULES,
  MONTHS,
  toLocalDate,
} from '../../../../../data/habit-data';
import { InfoHint } from '../widgets';
import {
  DistributionBars,
  HeatCalendar,
  ModuleBars,
  ModuleRadar,
  TrendArea,
} from './charts';

type SortKey = 'score' | 'name' | 'late' | 'absent';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'score', label: 'Skor tertinggi' },
  { key: 'name', label: 'Nama A–Z' },
  { key: 'late', label: 'Paling sering telat' },
  { key: 'absent', label: 'Paling sering absen' },
];

// @ts-expect-error Elysia adapter is duplicated across workspace packages.
const proofApi = treaty<App>(API_URL, {
  fetch: { credentials: 'include' },
  parseDate: false,
  onResponse: async (response) => {
    if (response.headers.get('content-type')?.startsWith('image/'))
      return response.blob();
  },
});

export default function AdminDashboard() {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const reduce = useReducedMotion();

  const [members, setMembers] = useState<Member[] | null>(null);
  const [rows, setRows] = useState<MemberRow[]>([]);
  const [rowsLoading, setRowsLoading] = useState(true);
  const [klass, setKlass] = useState<ClassSummary | null>(null);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('score');

  const allowed = isAdminRole(user?.role);
  const selectedId = params.get('member');

  useEffect(() => {
    if (!allowed) return;
    let alive = true;
    fetchMembers()
      .then((list) => alive && setMembers(list))
      .catch(() => alive && setMembers([]));
    return () => {
      alive = false;
    };
  }, [allowed]);

  useEffect(() => {
    if (!allowed) return;
    let alive = true;
    fetchClassSummary(month)
      .then((s) => alive && setKlass(s))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [allowed, month]);

  useEffect(() => {
    if (!members) return;
    // Empty class: nothing to load.
    if (!members.length) {
      setRowsLoading(false);
      return;
    }
    let alive = true;
    setRowsLoading(true);
    fetchMemberRows(members, month)
      .then((list) => alive && setRows(list))
      .catch(() => {})
      .finally(() => {
        if (alive) setRowsLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [members, month]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? rows.filter(
          (r) =>
            r.member.name.toLowerCase().includes(q) ||
            String(r.member.nis).includes(q),
        )
      : [...rows];

    return list.sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.member.name.localeCompare(b.member.name);
        case 'late':
          return b.late - a.late;
        case 'absent':
          return b.absent - a.absent;
        default:
          return b.score - a.score;
      }
    });
  }, [rows, query, sort]);

  const selected = useMemo(
    () => members?.find((mb) => String(mb.nis) === selectedId) ?? null,
    [members, selectedId],
  );

  const setMember = (nis: number) =>
    router.push(`${pathname}?member=${encodeURIComponent(String(nis))}`, {
      scroll: false,
    });

  const stepMonth = (delta: number) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));

  if (loading) return <DashboardSkeleton />;

  if (!allowed)
    return (
      <Guard
        title="Halaman khusus pengajar"
        body={
          user
            ? 'Akun kamu tidak punya akses ke dasbor ini. Hanya developer, guru, dan wali kelas yang bisa membukanya.'
            : 'Masuk dengan akun pengajar untuk melihat rekap kebiasaan seluruh anggota.'
        }
        action={
          user ? (
            <Button asChild variant="special" pointer>
              <Link href="/habit">Ke jurnal saya</Link>
            </Button>
          ) : (
            <Button asChild variant="special" pointer>
              <Link href="/login?r=/habit/admin">Masuk</Link>
            </Button>
          )
        }
      />
    );

  return (
    <div className="bg-background min-h-screen transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <m.header
          initial={reduce ? false : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl dark:text-white">
              Dasbor Kebiasaan
            </h1>
            <p className="mt-1.5 text-base text-muted-foreground">
              {members?.length ?? 0} anggota ·{' '}
              {month.toLocaleDateString('id-ID', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-border p-1 dark:border-border">
            <button
              type="button"
              aria-label="Bulan sebelumnya"
              onClick={() => stepMonth(-1)}
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground dark:hover:bg-secondary dark:hover:text-foreground"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <select
              aria-label="Pilih bulan"
              value={month.getMonth()}
              onChange={(e) =>
                setMonth(
                  new Date(month.getFullYear(), Number(e.target.value), 1),
                )
              }
              className="cursor-pointer rounded-lg border border-border bg-card px-2 py-1 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:border-border dark:bg-secondary dark:text-foreground"
            >
              {MONTHS.map((n, i) => (
                <option
                  key={n}
                  value={i}
                  className="bg-card text-foreground dark:bg-secondary dark:text-foreground"
                >
                  {n}
                </option>
              ))}
            </select>
            <button
              type="button"
              aria-label="Bulan berikutnya"
              onClick={() => stepMonth(1)}
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground dark:hover:bg-secondary dark:hover:text-foreground"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
        </m.header>

        {!members || !klass ? (
          <DashboardSkeleton bare />
        ) : selected ? (
          <MemberDetail
            member={selected}
            month={month}
            onBack={() => router.back()}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Stat
                icon={TrendingUpIcon}
                label="Rata-rata kelas"
                value={`${klass.score}%`}
                hint={`${klass.perfect} hari penuh tercatat`}
                tone="emerald"
                info="Rata-rata skor seluruh anggota bulan ini. Skor tiap anggota adalah porsi modul yang selesai dari 4 modul per hari."
              />
              <Stat
                icon={FlameIcon}
                label="Sedang streak"
                value={`${klass.streaking}`}
                hint="anggota ≥ 3 hari beruntun"
                tone="orange"
                info="Berapa anggota yang sedang punya rentetan minimal 3 hari berturut-turut hadir tepat waktu. Dihitung mundur dari hari ini, jadi tidak ikut berubah saat kamu ganti bulan."
              />
              <Stat
                icon={ClockIcon}
                label="Keterlambatan"
                value={`${klass.late}`}
                hint="absen lewat batas bulan ini"
                tone="sky"
                info="Total kejadian absen lewat batas bulan ini. Batasnya 07:00 pada hari sekolah, dan 06:00 untuk Bangun Pagi di Sabtu dan Minggu."
              />
              <Stat
                icon={ShieldAlertIcon}
                label="Perlu perhatian"
                value={`${klass.atRisk}`}
                hint="skor di bawah 50%"
                tone="rose"
                info="Jumlah anggota dengan skor bulan ini di bawah 50%. Pakai ini untuk memilih siapa yang perlu ditindaklanjuti lebih dulu."
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
                    Tren harian kelas
                    <InfoHint
                      label="Tren harian kelas"
                      text="Tiap titik adalah satu tanggal: rata-rata persen modul selesai seluruh anggota pada hari itu. Lembah yang dalam menandai hari yang perlu ditanyakan."
                    />
                  </CardTitle>
                  <CardDescription>
                    Rata-rata modul selesai per tanggal.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TrendArea series={klass.trend} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
                    Ketuntasan modul
                    <InfoHint
                      label="Ketuntasan modul"
                      text="Radar empat sumbu, satu per modul, berisi rata-rata kelas. Sumbu yang mengempis menunjukkan modul yang paling sering tidak selesai."
                    />
                  </CardTitle>
                  <CardDescription>Rata-rata seluruh anggota.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ModuleRadar stats={klass.modules} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
                    Sebaran skor
                    <InfoHint
                      label="Sebaran skor"
                      text="Berapa anggota yang jatuh di tiap rentang skor. Menunjukkan apakah kelas merata atau terbelah antara yang rajin dan yang tertinggal."
                    />
                  </CardTitle>
                  <CardDescription>Jumlah anggota per rentang.</CardDescription>
                </CardHeader>
                <CardContent>
                  <DistributionBars data={klass.buckets} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
                    Perbandingan modul
                    <InfoHint
                      label="Perbandingan modul"
                      text="Angka yang sama dengan radar, tapi berdampingan sebagai batang supaya selisih antarmodul lebih mudah dibaca."
                    />
                  </CardTitle>
                  <CardDescription>
                    Modul mana yang paling sering tertinggal.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ModuleBars stats={klass.modules} />
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
                    Daftar anggota
                    <InfoHint
                      label="Daftar anggota"
                      text="Kolom Ibadah sampai Belajar adalah persen hari modul itu selesai bulan ini. Hadir memakai batas 07:00 pada hari sekolah dan 06:00 untuk Bangun Pagi di Sabtu dan Minggu."
                    />
                  </CardTitle>
                  <CardDescription>
                    Klik satu nama untuk melihat statistik lengkapnya.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Cari nama atau NIS"
                      className="h-9 w-52 pl-8"
                    />
                  </div>
                  <select
                    aria-label="Urutkan"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="h-9 cursor-pointer rounded-lg border border-border bg-card px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:border-border dark:bg-secondary dark:text-foreground"
                  >
                    {SORTS.map((s) => (
                      <option
                        key={s.key}
                        value={s.key}
                        className="bg-card text-foreground dark:bg-secondary dark:text-foreground"
                      >
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </CardHeader>

              <CardContent className="px-0">
                {rowsLoading ? (
                  <MemberTableSkeleton />
                ) : (
                  <MemberTable rows={visible} onPick={setMember} />
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function MemberTable({
  rows,
  onPick,
}: {
  rows: MemberRow[];
  onPick: (nis: number) => void;
}) {
  if (!rows.length)
    return (
      <p className="px-4 py-10 text-center text-sm text-muted-foreground">
        Tidak ada anggota yang cocok.
      </p>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-3xl text-sm">
        <thead>
          <tr className="border-b border-border/70 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase dark:border-border">
            <th className="px-4 py-2.5">Anggota</th>
            <th className="px-4 py-2.5">Skor</th>
            <th className="px-4 py-2.5">Ibadah</th>
            <th className="px-4 py-2.5">Hadir</th>
            <th className="px-4 py-2.5">Olahraga</th>
            <th className="px-4 py-2.5">Belajar</th>
            <th className="px-4 py-2.5">Telat</th>
            <th className="px-4 py-2.5">Absen</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.member.id}
              tabIndex={0}
              onClick={() => onPick(r.member.nis)}
              onKeyDown={(e) => e.key === 'Enter' && onPick(r.member.nis)}
              className="cursor-pointer border-b border-border/50 transition-colors last:border-0 hover:bg-secondary focus-visible:bg-secondary dark:border-border/60 dark:hover:bg-secondary/40 dark:focus-visible:bg-secondary/40"
            >
              <td className="px-4 py-3">
                <p className="font-semibold text-foreground dark:text-foreground">
                  {r.member.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  NIS {r.member.nis}
                </p>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary dark:bg-secondary">
                    <div
                      className={cn('h-full rounded-full', scoreBar(r.score))}
                      style={{ width: `${r.score}%` }}
                    />
                  </div>
                  <span className="font-semibold tabular-nums text-foreground dark:text-foreground">
                    {r.score}%
                  </span>
                </div>
              </td>
              {MODULES.map((mod) => (
                <td
                  key={mod.key}
                  className="px-4 py-3 tabular-nums text-muted-foreground dark:text-foreground"
                >
                  {r.modules[mod.key]}%
                </td>
              ))}
              <td className="px-4 py-3 tabular-nums text-muted-foreground dark:text-foreground">
                {r.late}
              </td>
              <td className="px-4 py-3 tabular-nums text-muted-foreground dark:text-foreground">
                {r.absent}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const scoreBar = (v: number) =>
  v >= 80
    ? 'bg-emerald-500'
    : v >= 60
      ? 'bg-sky-500'
      : v >= 40
        ? 'bg-amber-500'
        : 'bg-rose-500';

function MemberTableSkeleton() {
  return (
    <div className="overflow-x-auto px-4 py-3">
      <Skeleton className="mb-4 h-7 w-full max-w-3xl rounded-lg" />
      <div className="space-y-2.5">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-11 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function MemberDetail({
  member,
  month,
  onBack,
}: {
  member: Member;
  month: Date;
  onBack: () => void;
}) {
  const reduce = useReducedMotion();
  const [row, setRow] = useState<MemberDetailData | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [detail, setDetail] = useState<MemberDay | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [proof, setProof] = useState<{
    label: string;
    filename: string;
  } | null>(null);

  useEffect(() => {
    let alive = true;
    setRow(null);
    setDay(null);
    setProof(null);
    fetchMemberDetail(member.id, month)
      .then((d) => alive && setRow(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [member.id, month]);

  // Per-day details are fetched separately so the monthly recap stays light.
  useEffect(() => {
    if (day === null) {
      setDetail(null);
      setDetailLoading(false);
      return;
    }

    let alive = true;
    setDetail(null);
    setDetailLoading(true);
    const date = fmtDate(new Date(month.getFullYear(), month.getMonth(), day));
    fetchMemberDay(member.id, date)
      .then((d) => alive && setDetail(d))
      .catch(() => alive && setDetail(null))
      .finally(() => alive && setDetailLoading(false));
    return () => {
      alive = false;
    };
  }, [member.id, month, day]);

  if (!row) return <DashboardSkeleton bare />;

  return (
    <m.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-2 flex cursor-pointer items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" /> Semua anggota
          </button>
          <h2 className="text-2xl font-bold tracking-tight text-foreground dark:text-white">
            {member.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            NIS {member.nis} · {row.logged} dari {row.tracked} hari terisi
          </p>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tabular-nums text-foreground dark:text-foreground">
            {row.score}%
          </span>
          <span className="text-sm text-muted-foreground">skor bulan ini</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          icon={FlameIcon}
          label="Streak berjalan"
          value={`${row.streak}`}
          hint={
            row.since
              ? `terakhir absen ${toLocalDate(row.since).toLocaleDateString(
                  'id-ID',
                  { day: 'numeric', month: 'long' },
                )}`
              : 'belum pernah absen'
          }
          tone="orange"
          info="Rentetan hari berturut-turut anggota ini punya catatan absen, dihitung mundur dari absen terakhir lintas bulan. Satu hari terlewat memutusnya."
        />
        <Stat
          icon={CalendarDaysIcon}
          label="Hari penuh"
          value={`${row.perfect}`}
          hint={`dari ${row.tracked} hari`}
          tone="emerald"
          info="Jumlah hari di bulan ini yang keempat modulnya selesai semua. Hari yang cuma sebagian terisi tidak dihitung."
        />
        <Stat
          icon={ClockIcon}
          label="Terlambat"
          value={`${row.late}`}
          hint="absen lewat batas"
          tone="sky"
          info="Berapa kali anggota ini absen lewat batas bulan ini. Batasnya 07:00 pada hari sekolah, dan 06:00 untuk Bangun Pagi di Sabtu dan Minggu — kesiangan, kesorean setelah 15:00, kemalaman setelah 18:00. Tetap tercatat hadir."
        />
        <Stat
          icon={ShieldAlertIcon}
          label="Tanpa absen"
          value={`${row.absent}`}
          hint="tidak tercatat hadir"
          tone="rose"
          info="Hari di bulan ini yang sama sekali tidak diabsen. Beda dengan Terlambat: di sini tidak ada catatan kehadiran sama sekali."
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
              Tren harian
              <InfoHint
                label="Tren harian"
                text="Persen modul selesai anggota ini per tanggal. 100% berarti keempat modul beres, 0% berarti hari itu kosong."
              />
            </CardTitle>
            <CardDescription>
              Persentase modul selesai tiap tanggal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendArea series={row.series} name={member.name} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
              Profil modul
              <InfoHint
                label="Profil modul"
                text="Persen ketuntasan per modul untuk anggota ini bulan ini. Angka di daftar bawah radar adalah nilai yang sama dalam bentuk pasti."
              />
            </CardTitle>
            <CardDescription>Kekuatan dan kelemahan.</CardDescription>
          </CardHeader>
          <CardContent>
            <ModuleRadar stats={row.modules} />
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-border/70 pt-4 dark:border-border">
              {MODULES.map((mod) => (
                <div key={mod.key} className="flex items-center gap-2">
                  <span
                    className={cn('size-2 shrink-0 rounded-full', mod.dot)}
                  />
                  <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                    {mod.label}
                  </span>
                  <span className="ml-auto text-sm font-semibold tabular-nums text-foreground dark:text-foreground">
                    {row.modules[mod.key]}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
              Kalender {MONTHS[month.getMonth()]}
              <InfoHint
                label="Kalender"
                text="Warna tiap tanggal menunjukkan berapa dari 4 modul yang selesai hari itu. Klik satu tanggal untuk melihat rinciannya di kartu sebelahnya."
              />
            </CardTitle>
            <CardDescription>
              Warna makin pekat berarti makin banyak modul selesai.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HeatCalendar
              month={month}
              levels={row.levels}
              selected={day}
              onSelect={setDay}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold tracking-tight">
              {day === null
                ? 'Rincian hari'
                : `Rincian ${day} ${MONTHS[month.getMonth()]}`}
            </CardTitle>
            <CardDescription>
              {day === null
                ? 'Pilih satu tanggal di kalender.'
                : 'Catatan yang diisi anggota pada tanggal ini.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DayDetail
              day={detail}
              picked={day !== null}
              loading={detailLoading}
              date={
                day === null
                  ? null
                  : new Date(month.getFullYear(), month.getMonth(), day)
              }
              onProofOpen={setProof}
            />
          </CardContent>
        </Card>
      </div>
      <ProofModal proof={proof} onClose={() => setProof(null)} />
    </m.div>
  );
}

function DayDetail({
  day,
  picked,
  loading,
  date,
  onProofOpen,
}: {
  day: MemberDay | null;
  picked: boolean;
  loading: boolean;
  date: Date | null;
  onProofOpen: (proof: { label: string; filename: string }) => void;
}) {
  if (!picked)
    return (
      <p className="flex h-40 items-center justify-center rounded-xl bg-secondary text-sm text-muted-foreground dark:bg-secondary/40">
        Belum ada tanggal yang dipilih.
      </p>
    );

  if (loading) return <DayDetailSkeleton />;

  if (!day)
    return (
      <p className="flex h-40 items-center justify-center rounded-xl bg-secondary text-sm text-muted-foreground dark:bg-secondary/40">
        Tidak ada catatan pada tanggal ini.
      </p>
    );

  const { journal, check } = day;
  const copy = attendanceCopy(date ?? new Date());
  const checkedAt = checkinAt(check);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <DetailBlock icon={MoonStarIcon} title="Ibadah" tone="text-violet-500">
        <ul className="space-y-1.5">
          {IBADAH.map(({ label, field }) => (
            <li key={field} className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground dark:text-foreground">
                {label}
              </span>
              <Pill ok={journal?.[field] === true}>
                {journal?.[field] === true ? 'Selesai' : 'Belum'}
              </Pill>
            </li>
          ))}
        </ul>
      </DetailBlock>

      <DetailBlock
        icon={ClockIcon}
        title={copy.title}
        tone="text-sky-500"
        info={
          copy.title === 'Bangun Pagi'
            ? 'Sabtu dan Minggu modul ini jadi Bangun Pagi dengan batas 06:00. Lewat jam itu tetap tercatat, tapi berstatus kesiangan, kesorean setelah 15:00, kemalaman setelah 18:00, dan semuanya memutus streak.'
            : 'Absensi dibuka 06:00. Lewat 07:00 tetap tercatat hadir tapi berstatus terlambat, dan streak anggota putus.'
        }
      >
        {checkedAt ? (
          <p className="text-sm text-muted-foreground dark:text-foreground">
            <span
              className={cn(
                'font-bold',
                isLateCheck(check)
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400',
              )}
            >
              {isLateCheck(check) ? lateLabel(checkedAt) : copy.ok}
            </span>{' '}
            pada {fmtTime(checkedAt)}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Tidak absen.</p>
        )}
      </DetailBlock>

      <DetailBlock icon={DumbbellIcon} title="Olahraga" tone="text-emerald-500">
        {journal?.did_sport === true ? (
          <dl className="space-y-1 text-sm text-muted-foreground dark:text-foreground">
            <Row label="Jenis" value={journal.sport_type || '—'} />
            <Row
              label="Durasi"
              value={
                journal.sport_duration ? `${journal.sport_duration} menit` : '—'
              }
            />
            <Proofs
              items={[{ label: 'Olahraga', url: journal.sport_proof_url }]}
              onOpen={onProofOpen}
            />
          </dl>
        ) : journal?.did_sport === false ? (
          <p className="text-sm text-muted-foreground dark:text-foreground">
            Tidak olahraga
            {journal.sport_skip_reason
              ? ` — ${journal.sport_skip_reason}`
              : '.'}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Belum dijawab.</p>
        )}
      </DetailBlock>

      <DetailBlock
        icon={NotebookPenIcon}
        title="Gemar Belajar"
        tone="text-amber-500"
      >
        {journal?.did_study === true ? (
          <dl className="space-y-1 text-sm text-muted-foreground dark:text-foreground">
            <Row label="Topik" value={journal.study_about || '—'} />
            <Row label="Media" value={journal.study_media || '—'} />
            <Proofs
              items={[
                { label: 'Mulai', url: journal.study_start_proof_url },
                { label: 'Selesai', url: journal.study_end_proof_url },
              ]}
              onOpen={onProofOpen}
            />
          </dl>
        ) : journal?.did_study === false ? (
          <p className="text-sm text-muted-foreground dark:text-foreground">
            Tidak belajar
            {journal.study_skip_reason
              ? ` — ${journal.study_skip_reason}`
              : '.'}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Belum dijawab.</p>
        )}
      </DetailBlock>

      <p className="text-xs text-muted-foreground sm:col-span-2">
        {level(journal, check)} dari 4 modul selesai pada tanggal ini.
      </p>
    </div>
  );
}

function DayDetailSkeleton() {
  const blocks = ['ibadah', 'hadir', 'olahraga', 'belajar'] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {blocks.map((block) => (
        <div
          key={block}
          className="rounded-xl bg-secondary p-4 dark:bg-secondary/40"
        >
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="space-y-2.5">
            <Skeleton className="h-3.5 w-4/5" />
            <Skeleton className="h-3.5 w-3/5" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        </div>
      ))}
      <Skeleton className="h-3.5 w-56 sm:col-span-2" />
    </div>
  );
}

// Photo proofs are stored as S3 keys, so the URL is built from fileUrl.
function Proofs({
  items,
  onOpen,
}: {
  items: { label: string; url: string | null }[];
  onOpen: (proof: { label: string; filename: string }) => void;
}) {
  return (
    <>
      {items.map((it) => {
        if (!it.url)
          return <Row key={it.label} label={it.label} value="Belum ada" />;
        const filename = it.url;
        return (
          <div
            key={it.label}
            className="flex items-center justify-between gap-3"
          >
            <dt className="text-muted-foreground">{it.label}</dt>
            <dd>
              <button
                type="button"
                onClick={() => onOpen({ label: it.label, filename })}
                className="font-medium text-sky-600 underline-offset-2 hover:underline dark:text-sky-400"
              >
                Lihat bukti
              </button>
            </dd>
          </div>
        );
      })}
    </>
  );
}

function ProofModal({
  proof,
  onClose,
}: {
  proof: { label: string; filename: string } | null;
  onClose: () => void;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    if (!proof) return;
    let active = true;
    let objectUrl: string | null = null;
    setImageUrl(null);
    setImageError(false);

    proofApi
      .s3({ filename: proof.filename })
      .get()
      .then(({ data, error }) => {
        if (error || !data || !(data instanceof Blob))
          throw new Error('Bukti tidak dapat dimuat.');
        objectUrl = URL.createObjectURL(data);
        if (active) setImageUrl(objectUrl);
      })
      .catch(() => active && setImageError(true));

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [proof]);

  if (!proof) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/70 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Bukti ${proof.label}`}
        className="border-border bg-card duo-card relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3 dark:border-border">
          <h3 className="font-semibold text-foreground dark:text-foreground">
            Bukti {proof.label}
          </h3>
          <button
            type="button"
            aria-label="Tutup bukti"
            onClick={onClose}
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground dark:hover:bg-secondary dark:hover:text-foreground"
          >
            <XIcon className="size-5" />
          </button>
        </div>
        <div className="flex max-h-[calc(90vh-4rem)] justify-center overflow-auto bg-secondary p-3 dark:bg-card">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Bukti ${proof.label}`}
              className="max-h-[calc(90vh-6rem)] max-w-full rounded-lg object-contain"
            />
          ) : imageError ? (
            <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
              <p>Gambar bukti tidak dapat dimuat.</p>
              <a
                href={fileUrl(proof.filename)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sky-600 underline-offset-2 hover:underline dark:text-sky-400"
              >
                Buka bukti di tab baru
              </a>
            </div>
          ) : (
            <div className="flex min-h-56 items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircleIcon className="size-5 animate-spin" /> Memuat bukti…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium text-foreground dark:text-foreground">
        {value}
      </dd>
    </div>
  );
}

function Pill({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-xs font-semibold',
        ok
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
          : 'bg-secondary text-muted-foreground dark:bg-secondary',
      )}
    >
      {children}
    </span>
  );
}

function DetailBlock({
  icon: Icon,
  title,
  tone,
  info,
  children,
}: {
  icon: typeof ClockIcon;
  title: string;
  tone: string;
  info?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-secondary p-4 dark:bg-secondary/40">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground dark:text-foreground">
        <Icon className={cn('size-4', tone)} />
        {title}
        {info && <InfoHint label={title} text={info} />}
      </h3>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------

const TONES = {
  emerald: 'bg-emerald-500',
  orange: 'bg-orange-500',
  sky: 'bg-sky-500',
  rose: 'bg-rose-500',
} as const;

function Stat({
  icon: Icon,
  label,
  value,
  hint,
  tone,
  info,
}: {
  icon: typeof UsersIcon;
  label: string;
  value: string;
  hint: string;
  tone: keyof typeof TONES;
  info: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3">
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-xl text-white',
            TONES[tone],
          )}
        >
          <Icon className="size-4.5" />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            {label}
            <InfoHint label={label} text={info} />
          </p>
          <p className="text-2xl leading-tight font-bold tabular-nums text-foreground dark:text-foreground">
            {value}
          </p>
          <p className="truncate text-xs text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Guard({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action: ReactNode;
}) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-md text-center">
        <CardContent className="flex flex-col items-center gap-3 py-6">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-rose-500 text-white">
            <ShieldAlertIcon className="size-6" />
          </span>
          <h1 className="text-xl font-bold text-foreground dark:text-white">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">{body}</p>
          <div className="mt-2">{action}</div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton({ bare }: { bare?: boolean }) {
  const body = (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {['skor', 'streak', 'telat', 'perhatian'].map((k) => (
          <Skeleton key={k} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-xl lg:col-span-2" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
      <Skeleton className="mt-6 h-96 rounded-xl" />
    </>
  );

  if (bare) return body;

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="mb-8 h-10 w-64 rounded-xl" />
        {body}
      </div>
    </div>
  );
}
