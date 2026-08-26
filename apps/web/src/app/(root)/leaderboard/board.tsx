'use client';

import XiRplMascot from '@fe/components/mascot/Mascot';
import { Button } from '@fe/components/ui/button';
import { Skeleton } from '@fe/components/ui/skeleton';
import { useStudents } from '@fe/hooks/use-students';
import { useUser } from '@fe/hooks/use-user';
import api, { fileUrl } from '@fe/lib/api';
import { cn } from '@fe/lib/utils';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CrownIcon,
  FlameIcon,
  ListOrderedIcon,
  RotateCcwIcon,
  TrophyIcon,
} from 'lucide-react';
import { AnimatePresence, motion as m, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  fmtMonth,
  type LeaderboardEntry,
  MONTHS,
} from '../../../../data/habit-data';
import { InfoHint } from '../habit/widgets';

/** Warna podium: emas, perak, perunggu untuk tiga peringkat teratas. */
const MEDALS = [
  {
    tile: 'border-brand-yellow bg-pastel-yellow [--duo-shade:#e0a800]',
    badge: 'bg-brand-yellow text-brand-navy',
    avatar: 'size-18 text-lg',
    minH: 'sm:min-h-64',
    points: 'text-3xl',
  },
  {
    tile: 'border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-800/60 [--duo-shade:#a8b6c5]',
    badge: 'bg-slate-300 text-slate-700',
    avatar: 'size-16 text-base',
    minH: 'sm:min-h-54',
    points: 'text-2xl',
  },
  {
    tile: 'border-[#eab68a] bg-[#ffe3cf] dark:border-[#a06a3f] dark:bg-[#43291a]/50 [--duo-shade:#cd8b52]',
    badge: 'bg-[#e0995f] text-white',
    avatar: 'size-14 text-base',
    minH: 'sm:min-h-48',
    points: 'text-2xl',
  },
];

// Posisi kolom podium di desktop: perak kiri, emas tengah, perunggu kanan.
const PODIUM_PLACE = [
  'sm:col-start-2 sm:row-start-1',
  'sm:col-start-1 sm:row-start-1',
  'sm:col-start-3 sm:row-start-1',
];

// Inisial nama untuk lingkaran avatar tanpa foto.
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');

function BoardAvatar({
  name,
  avatarUrl,
  className,
}: {
  name: string;
  /** URL/foto profil siswa dari `GET /users/students`. */
  avatarUrl?: string | null;
  className?: string;
}) {
  return avatarUrl ? (
    <img
      src={fileUrl(avatarUrl)}
      alt={`Avatar ${name}`}
      loading="lazy"
      className={cn(
        'shrink-0 rounded-full border-2 border-white/80 object-cover',
        className,
      )}
    />
  ) : (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center rounded-full border-2 border-white/80 bg-white font-black text-brand-blue dark:border-white/20 dark:bg-secondary',
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

function StreakPill({ value }: { value: number }) {
  return (
    <span className="flex shrink-0 items-center gap-0.5 text-xs font-bold text-muted-foreground">
      <FlameIcon className="size-3.5 text-amber-500" aria-hidden />
      {value}
      <span className="sr-only">hari streak</span>
    </span>
  );
}

function PodiumCard({
  entry,
  place,
  selfId,
  avatarUrl,
  reduce,
}: {
  entry: LeaderboardEntry;
  place: number;
  selfId?: string;
  avatarUrl?: string | null;
  reduce: boolean | null;
}) {
  const medal = MEDALS[place];
  const me = entry.user_id === selfId;

  return (
    <m.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.08 * place,
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        'duo-card relative flex min-h-44 flex-col items-center gap-1.5 rounded-3xl border-2 p-4 text-center',
        medal.tile,
        PODIUM_PLACE[place],
        medal.minH,
        me && 'ring-2 ring-brand-blue ring-offset-2 ring-offset-background',
      )}
    >
      {place === 0 && (
        <m.div
          animate={
            reduce ? undefined : { y: [0, -5, 0], rotate: [-10, -5, -10] }
          }
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-5 left-1/2 -translate-x-1/2"
        >
          <CrownIcon
            className="size-9 fill-amber-400 text-amber-600 drop-shadow-md"
            aria-hidden
          />
        </m.div>
      )}

      <span
        className={cn(
          'mt-1 grid size-8 place-items-center rounded-full border-2 border-white/70 text-sm font-black shadow-sm',
          medal.badge,
        )}
      >
        {entry.rank}
      </span>

      <BoardAvatar name={entry.name} avatarUrl={avatarUrl} className={medal.avatar} />

      <p
        className="max-w-full truncate text-sm font-extrabold text-brand-navy dark:text-white"
        title={entry.name}
      >
        {entry.name}
      </p>

      <p className="flex items-baseline justify-center gap-1">
        <span
          className={cn(
            'font-black tabular-nums text-brand-navy dark:text-white',
            medal.points,
          )}
        >
          {entry.points}
        </span>
        <span className="text-xs font-bold text-muted-foreground">poin</span>
      </p>

      <StreakPill value={entry.streak} />

      {me && (
        <span className="absolute top-2 right-2 rounded-full bg-brand-blue px-2 py-0.5 text-[10px] font-black tracking-wide text-white uppercase">
          Kamu
        </span>
      )}
    </m.div>
  );
}

function BoardSkeleton() {
  return (
    <div aria-hidden>
      <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
        <Skeleton className="order-1 h-64 rounded-3xl sm:order-none" />
        <Skeleton className="order-2 h-54 rounded-3xl sm:order-none" />
        <Skeleton className="order-3 h-48 rounded-3xl sm:order-none" />
      </div>
      <Skeleton className="mt-8 h-24 rounded-3xl" />
      <div className="mt-4 space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function LeaderboardBoard() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { user, loading: userLoading } = useUser();
  // Foto profil siswa diambil dari GET /users/students.
  const [students] = useStudents();
  const avatars = useMemo(
    () => new Map(students.map((s) => [s.id, s.avatar_url ?? null])),
    [students],
  );

  const now = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(() => new Date());
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [failed, setFailed] = useState(false);

  // Halaman privat: arahkan pengunjung anonim ke login seperti jurnal.
  useEffect(() => {
    if (userLoading || user) return;
    router.replace('/login?r=%2Fhabit%2Fleaderboard');
  }, [router, user, userLoading]);

  // Muat ulang papan tiap bulan berganti; dipanggil ulang juga oleh tombol coba lagi.
  const load = useCallback(() => {
    setEntries(null);
    setFailed(false);
    let alive = true;
    api.leaderboard
      .get({ query: { month: fmtMonth(month) } })
      .then(({ data }) => {
        if (alive) setEntries(data?.data.entries ?? []);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [month]);

  useEffect(() => {
    if (userLoading || !user) return;
    return load();
  }, [load, user, userLoading]);

  const step = (delta: number) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));

  const atCurrent =
    month.getFullYear() === now.getFullYear() &&
    month.getMonth() === now.getMonth();

  const top = entries?.slice(0, 3) ?? [];
  const self = entries?.find((e) => e.user_id === user?.id);
  // `failed` menampilkan kartu coba lagi, jadi daftar kosong aman di sini.
  const list = entries ?? [];

  if (userLoading || !user || (entries === null && !failed)) {
    return (
      <div className="mx-auto max-w-360 px-4 py-8 pb-16 sm:px-6">
        <Skeleton className="h-44 rounded-[2rem]" />
        <div className="mx-auto mt-8 max-w-3xl">
          <BoardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-360 px-4 py-8 pb-16 sm:px-6">
      {/* Sambutan berwarna dengan pil kuning ala spanduk utama */}
      <m.header
        initial={reduce ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-8 overflow-hidden rounded-[2rem] border-2 border-brand-blue/25 bg-pastel-blue/50 p-6 sm:p-8 dark:border-blue-400/20 dark:bg-blue-500/10"
      >
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: lingkaran dekoratif murni, disembunyikan dari pembaca layar */}
        <svg
          className="pointer-events-none absolute -top-24 -right-24 size-72 text-white/60 dark:text-white/10"
          viewBox="0 0 600 600"
          fill="none"
          aria-hidden
        >
          <circle
            cx="300"
            cy="300"
            r="270"
            stroke="currentColor"
            strokeWidth="36"
          />
          <circle
            cx="300"
            cy="300"
            r="170"
            stroke="currentColor"
            strokeWidth="36"
          />
        </svg>

        <div className="relative flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-brand-navy bg-brand-yellow px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-brand-navy shadow-[0_3px_0_0_#0a2540]">
              <span className="font-mono" aria-hidden>
                &gt;_
              </span>
              Leaderboard
            </span>
            <h1 className="font-display mt-3 text-4xl font-black tracking-tight text-brand-navy sm:text-5xl dark:text-white">
              Papan Peringkat
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed font-medium sm:text-base">
              Peringkat teman sekelas dari poin bulan terpilih: tiap modul yang
              selesai bernilai 25 poin per hari, jadi hari sempurna bernilai 100
              poin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              aria-label="Bulan sebelumnya"
              className="size-11 rounded-2xl"
              pointer
              onClick={() => step(-1)}
            >
              <ChevronLeftIcon />
            </Button>
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={fmtMonth(month)}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                aria-live="polite"
                className="rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-extrabold whitespace-nowrap text-foreground"
              >
                {MONTHS[month.getMonth()]} {month.getFullYear()}
              </m.span>
            </AnimatePresence>
            <Button
              size="icon"
              variant="outline"
              aria-label="Bulan berikutnya"
              disabled={atCurrent}
              className="size-11 rounded-2xl"
              pointer
              onClick={() => step(1)}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </m.header>

      <div className="mx-auto max-w-3xl">
        {failed ? (
          <div className="flex flex-col items-center gap-3 rounded-[2rem] border-2 border-dashed border-border px-6 py-14 text-center">
            <TrophyIcon
              className="size-9 text-muted-foreground/50"
              aria-hidden
            />
            <p className="text-lg font-extrabold text-foreground">
              Gagal memuat papan peringkat
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Periksa koneksi kamu lalu coba lagi.
            </p>
            <Button
              variant="special"
              className="mt-1"
              pointer
              onClick={() => load()}
            >
              <RotateCcwIcon /> Coba Lagi
            </Button>
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[2rem] border-2 border-dashed border-border px-6 py-12 text-center">
            <XiRplMascot
              size={220}
              className="h-auto w-full max-w-[200px] opacity-95"
            />
            <p className="mt-2 text-lg font-extrabold text-foreground">
              Belum ada peringkat bulan ini
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Isi jurnal dan absen hari ini untuk mengumpulkan poin pertamamu.
            </p>
            <Button asChild variant="special" className="mt-1" pointer>
              <Link href="/habit">Buka Jurnal Kebiasaan</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
              {top.map((entry, i) => (
                <PodiumCard
                  key={entry.user_id}
                  entry={entry}
                  place={i}
                  selfId={user.id}
                  avatarUrl={avatars.get(entry.user_id) ?? entry.avatar_url}
                  reduce={reduce}
                />
              ))}
            </div>

            {self && self.rank > 3 && (
              <m.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="duo-card mt-6 flex items-center gap-3 rounded-2xl border-2 border-brand-blue/40 bg-pastel-blue/70 px-4 py-3 [--duo-shade:rgba(30,136,229,0.35)] dark:bg-blue-500/15"
              >
                <span className="rounded-full bg-brand-blue px-2 py-0.5 text-[10px] font-black tracking-wide text-white uppercase">
                  Kamu
                </span>
                <span className="text-sm font-extrabold tabular-nums text-foreground">
                  #{self.rank}
                </span>
                <span className="ml-auto text-sm font-bold tabular-nums text-foreground">
                  {self.points}{' '}
                  <span className="text-xs font-semibold text-muted-foreground">
                    poin
                  </span>
                </span>
                <StreakPill value={self.streak} />
              </m.div>
            )}

            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-foreground">
                <ListOrderedIcon
                  className="size-5 text-brand-blue"
                  aria-hidden
                />
                Peringkat Lengkap
                <InfoHint
                  label="Peringkat Lengkap"
                  text="Urutan seluruh siswa berdasarkan poin bulan terpilih. Bila poin sama, yang ditentukan adalah streak absen lebih panjang, lalu NIS terkecil."
                />
              </h2>

              <div className="duo-card mt-3 overflow-hidden rounded-3xl border-2 border-border/70 bg-card">
                <ul className="divide-y divide-border/70 dark:divide-border">
                  {list.map((entry) => {
                    const me = entry.user_id === user.id;
                    const medal =
                      entry.rank <= 3 ? MEDALS[entry.rank - 1] : null;
                    return (
                      <li key={entry.user_id}>
                        <div
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 transition-colors sm:px-5',
                            me
                              ? 'bg-pastel-blue/70 dark:bg-blue-500/15'
                              : 'hover:bg-secondary/50 dark:hover:bg-secondary/50',
                          )}
                        >
                          {medal ? (
                            <span
                              className={cn(
                                'grid size-8 shrink-0 place-items-center rounded-full border-2 border-white/70 text-sm font-black shadow-sm',
                                medal.badge,
                              )}
                            >
                              {entry.rank}
                            </span>
                          ) : (
                            <span className="w-8 shrink-0 text-center text-sm font-black tabular-nums text-muted-foreground">
                              {entry.rank}
                            </span>
                          )}

                          <BoardAvatar
                            name={entry.name}
                            avatarUrl={
                              avatars.get(entry.user_id) ?? entry.avatar_url
                            }
                            className="size-10 text-xs"
                          />

                          <span
                            className="min-w-0 truncate text-sm font-bold text-foreground"
                            title={entry.name}
                          >
                            {entry.name}
                          </span>
                          {me && (
                            <span className="shrink-0 rounded-full bg-brand-blue px-1.5 py-0.5 text-[10px] font-black tracking-wide text-white uppercase">
                              Kamu
                            </span>
                          )}

                          <span className="ml-auto flex shrink-0 items-center gap-3">
                            <span className="hidden min-[420px]:block">
                              <StreakPill value={entry.streak} />
                            </span>
                            <span className="min-w-14 text-right text-sm font-extrabold tabular-nums text-foreground">
                              {entry.points}
                              <span className="sr-only"> poin</span>
                            </span>
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
