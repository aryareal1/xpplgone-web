'use client';

import {
  CheckIcon,
  ClockIcon,
  DumbbellIcon,
  LayoutDashboardIcon,
  LockIcon,
  MoonStarIcon,
  NotebookPenIcon,
  TriangleAlertIcon,
  UploadIcon,
  XIcon,
} from 'lucide-react';
import { AnimatePresence, motion as m, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button } from '@fe/components/ui/button';
import { Checkbox } from '@fe/components/ui/checkbox';
import { Input } from '@fe/components/ui/input';
import { useUser } from '@fe/hooks/use-user';
import api, { fileUrl } from '@fe/lib/api';
import { cn } from '@fe/lib/utils';
import { isAdminRole } from '../../../../data/habit-admin';
import {
  type Answer,
  attendanceCopy,
  attendanceWindow,
  type Check,
  checkinAt,
  checkinType,
  emptyJournal,
  fmtDate,
  fmtMonth,
  fmtTime,
  IBADAH,
  isLateCheck,
  isWeekend,
  type Journal,
  type JournalRecap,
  lateLabel,
  level,
  levelsByDay,
  type ModuleKey,
  moduleStatus,
  PROOF_FIELDS,
  parseDate,
  SPORT_TYPES,
  type StreakData,
  toJournalBody,
} from '../../../../data/habit-data';
import { HabitCalendar, HabitStats, InfoHint } from './widgets';

const MAX_PHOTO = 5 * 1024 * 1024;
const SAVE_DELAY = 500;

// Unggah bukti ke S3 dan kembalikan nama filenya; server yang mengompres.
async function uploadPhoto(file: File) {
  if (!file.type.startsWith('image/'))
    throw new Error('File harus berupa gambar.');
  if (file.size > MAX_PHOTO) throw new Error('Ukuran foto maksimal 5MB.');

  const { data } = await api.s3.upload.post({ file });
  const filename = data?.data?.filename;
  if (!filename) throw new Error('Gagal mengunggah foto. Coba lagi.');
  return filename;
}

// Hapus bukti yang tidak lagi dirujuk jurnal, supaya file di S3 tidak menumpuk.
function dropProofs(prev: Journal, next: Journal) {
  for (const field of PROOF_FIELDS) {
    const gone = prev[field];
    if (gone && gone !== next[field])
      api
        .s3({ filename: gone })
        .delete()
        .catch(() => {});
  }
}

export default function HabitJournal() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const { user } = useUser();

  const [data, setData] = useState<Journal>(emptyJournal);
  const dataRef = useRef(data);
  const [check, setCheck] = useState<Check | null>(null);
  const [recap, setRecap] = useState<JournalRecap | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [month, setMonth] = useState(() => new Date());
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [version, setVersion] = useState(0);
  const [now, setNow] = useState(() => new Date());

  const today = useMemo(() => new Date(), []);
  const todayStr = fmtDate(today);
  const date = fmtDate(parseDate(params.get('date')) ?? today);
  const selected = parseDate(date) ?? today;
  const editable = date === todayStr;

  // Jurnal dan check-in tanggal terpilih; 404 dari server berarti hari kosong.
  useEffect(() => {
    let alive = true;
    Promise.all([api.journals({ date }).get(), api.checkins({ date }).get()])
      .then(([j, c]) => {
        if (!alive) return;
        const loaded = j.data?.data ?? emptyJournal();
        dataRef.current = loaded;
        setData(loaded);
        setCheck(c.data?.data ?? null);
      })
      .catch(() => {
        if (alive) setError('Gagal memuat catatan. Periksa koneksi kamu.');
      });
    return () => {
      alive = false;
    };
  }, [date]);

  useEffect(() => {
    const d = parseDate(date);
    if (!d) return;
    setMonth((prev) =>
      d.getMonth() !== prev.getMonth() || d.getFullYear() !== prev.getFullYear()
        ? new Date(d.getFullYear(), d.getMonth(), 1)
        : prev,
    );
  }, [date]);

  // Rekap bulan dan streak; `version` naik tiap simpanan sukses supaya segar.
  useEffect(() => {
    let alive = true;
    Promise.all([
      api.journals.recap.get({ query: { month: fmtMonth(month) } }),
      api.checkins.streak.get(),
    ])
      .then(([r, s]) => {
        if (!alive) return;
        setRecap(r.data?.data ?? null);
        setStreak(s.data?.data ?? null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [month, version]);

  const levels = useMemo(() => {
    const map = levelsByDay(recap?.scores ?? []);
    if (
      selected.getMonth() === month.getMonth() &&
      selected.getFullYear() === month.getFullYear()
    )
      map.set(selected.getDate(), level(data, check));
    return map;
  }, [recap, selected, month, data, check]);

  const setDate = (d: Date) =>
    router.replace(`${pathname}?date=${fmtDate(d)}`, { scroll: false });

  const gate = attendanceWindow(now);
  const copy = attendanceCopy(selected);
  const checkedAt = checkinAt(check);
  const waitingForOpen = editable && !checkedAt && gate === 'closed';
  useEffect(() => {
    if (!waitingForOpen) return;
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, [waitingForOpen]);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    },
    [],
  );

  // Ubah state lalu kirim seluruh jurnal hari ini, ditunda agar mengetik tidak
  // memicu satu request per huruf.
  const update = useCallback((fn: (prev: Journal) => Journal) => {
    const prev = dataRef.current;
    const next = fn(prev);
    dataRef.current = next;
    setData(next);
    dropProofs(prev, next);

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      api.journals
        .put(toJournalBody(next))
        .then(({ error: failed }) => {
          setError(failed ? 'Gagal menyimpan ke server. Coba lagi.' : null);
          if (!failed) setVersion((v) => v + 1);
        })
        .catch(() => setError('Gagal menyimpan ke server. Coba lagi.'));
    }, SAVE_DELAY);
  }, []);

  const pickPhoto = async (
    file: File | undefined,
    apply: (prev: Journal, filename: string) => Journal,
  ) => {
    if (!file) return;
    setBusy(true);
    try {
      const filename = await uploadPhoto(file);
      update((prev) => apply(prev, filename));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  // Absen hari ini lewat endpoint check-in, bukan lewat jurnal.
  const checkIn = async () => {
    const clicked = new Date();
    if (attendanceWindow(clicked) === 'closed') {
      setNow(clicked);
      setError('Absensi baru dibuka pukul 06:00.');
      return;
    }

    const type = checkinType(clicked);
    setBusy(true);
    const { error: failed } = await api.checkins['check-in'].post({ type });
    setBusy(false);
    if (failed) {
      setError('Gagal mencatat kehadiran. Coba lagi.');
      return;
    }

    setError(null);
    setCheck({
      date,
      is_checked: true,
      type,
      checked_in_at: clicked,
      checked_out_at: null,
    });
    setVersion((v) => v + 1);
  };

  const status = moduleStatus(data, check);

  return (
    <div className="font-outfit min-h-screen bg-linear-to-b from-slate-50 to-white transition-colors duration-300 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <m.header
          initial={reduce ? false : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
            Jurnal Kebiasaan
          </h1>
          <p className="mt-1.5 text-base text-slate-500 dark:text-slate-400">
            {selected.toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            {!editable && ' · hanya bisa dibaca'}
          </p>
          {isAdminRole(user?.role) && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="mt-4"
              pointer
            >
              <Link href="/habit/admin">
                <LayoutDashboardIcon /> Dasbor Admin
              </Link>
            </Button>
          )}
        </m.header>

        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-[1fr_360px]">
          <div>
            {error && (
              <p
                role="alert"
                className="mb-6 flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
              >
                <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" />
                {error}
              </p>
            )}

            {!editable && (
              <p className="mb-6 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                <LockIcon className="size-4 shrink-0" />
                Catatan tanggal ini terkunci.
                <button
                  type="button"
                  onClick={() => setDate(today)}
                  className="ml-auto cursor-pointer font-semibold underline underline-offset-2"
                >
                  Ke hari ini
                </button>
              </p>
            )}

            <Section
              icon={MoonStarIcon}
              title="Ibadah"
              tone="ibadah"
              index={0}
              info="Centang tiap salat sunah yang kamu kerjakan hari ini. Modul dihitung selesai hanya kalau keempatnya tercentang."
              done={status.ibadah}
              reduce={reduce}
              first
            >
              <ul className="divide-y divide-slate-200/70 dark:divide-slate-800">
                {IBADAH.map(({ label, field }) => (
                  <li key={field}>
                    <div
                      className={cn(
                        'flex items-center gap-3 py-3',
                        editable
                          ? 'cursor-pointer'
                          : 'cursor-not-allowed opacity-70',
                      )}
                    >
                      <Checkbox
                        id={field}
                        checked={data[field] === true}
                        disabled={!editable}
                        onCheckedChange={(checked) =>
                          update((d) => ({
                            ...d,
                            [field]:
                              typeof checked === 'boolean' ? checked : null,
                          }))
                        }
                      />
                      <label
                        htmlFor={field}
                        className={cn(
                          'text-sm font-medium text-slate-700 dark:text-slate-200',
                          editable && 'cursor-pointer',
                        )}
                      >
                        {label}
                      </label>
                      <span className="ml-auto">
                        <Tick show={data[field] === true} />
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>

            <Section
              icon={ClockIcon}
              title={copy.title}
              tone="hadir"
              index={1}
              info={
                isWeekend(selected)
                  ? 'Sabtu dan Minggu modul ini jadi Bangun Pagi: tekan tombolnya paling lambat 06:00. Lewat jam itu tetap tercatat, tapi berstatus kesiangan, kesorean setelah 15:00, kemalaman setelah 18:00, dan semuanya memutus streak.'
                  : 'Tekan tombolnya untuk absen. Dibuka 06:00, dan lewat 07:00 tercatat terlambat sehingga streak putus. Waktu absen ikut tersimpan.'
              }
              done={status.hadir}
              reduce={reduce}
            >
              {checkedAt && (
                <p className="mb-4 text-sm">
                  <span
                    className={cn(
                      'font-bold',
                      isLateCheck(check)
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400',
                    )}
                  >
                    {isLateCheck(check) ? lateLabel(checkedAt) : copy.ok}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {' '}
                    pada {fmtTime(checkedAt)}
                  </span>
                </p>
              )}
              <Button
                variant="special"
                size="lg"
                pointer
                disabled={!editable || !!checkedAt || gate === 'closed' || busy}
                className="w-full sm:w-auto sm:min-w-48"
                onClick={checkIn}
              >
                {checkedAt ? (
                  <>
                    <CheckIcon /> {copy.doneAction}
                  </>
                ) : !editable ? (
                  'Tidak tercatat'
                ) : gate === 'closed' ? (
                  'Absensi belum dibuka'
                ) : (
                  copy.action
                )}
              </Button>
              {!checkedAt && editable && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {gate === 'closed'
                    ? 'Absensi dibuka pukul 06:00.'
                    : gate === 'open'
                      ? `${copy.verb} sebelum ${copy.deadline} supaya tidak tercatat ${copy.late.toLowerCase()}.`
                      : `Lewat ${copy.deadline}, ${copy.noun} akan tercatat ${lateLabel(now).toLowerCase()}.`}
                </p>
              )}
              {!checkedAt && !editable && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Tidak ada catatan {copy.noun} pada tanggal ini.
                </p>
              )}
            </Section>

            <Section
              icon={DumbbellIcon}
              title="Olahraga"
              tone="olahraga"
              index={2}
              info="Jawab Ya lalu isi jenis, durasi, dan foto bukti. Modul dihitung selesai setelah fotonya masuk. Jawab Tidak tetap dicatat beserta alasannya, tapi tidak menambah skor hari itu."
              done={status.olahraga}
              reduce={reduce}
            >
              <Question
                text="Apakah kamu berolahraga hari ini?"
                value={data.did_sport}
                disabled={!editable}
                onChange={(done) =>
                  update((d) => ({
                    ...d,
                    did_sport: done,
                    sport_skip_reason: null,
                    ...(done === true
                      ? {}
                      : {
                          sport_type: null,
                          sport_duration: null,
                          sport_proof_url: null,
                        }),
                  }))
                }
              />

              <Reveal show={data.did_sport === true} reduce={reduce}>
                <div className="grid gap-4 pt-4 sm:grid-cols-2">
                  <Field label="Olahraga apa yang kamu lakukan?">
                    <select
                      value={data.sport_type ?? ''}
                      disabled={!editable}
                      onChange={(e) =>
                        update((d) => ({
                          ...d,
                          sport_type: e.target.value || null,
                        }))
                      }
                      className="h-9 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    >
                      <option
                        value=""
                        className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                      >
                        Pilih jenis olahraga
                      </option>
                      {SPORT_TYPES.map((s) => (
                        <option
                          key={s}
                          value={s}
                          className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                        >
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Berapa menit kamu berolahraga?">
                    <Input
                      type="number"
                      min={1}
                      max={600}
                      inputMode="numeric"
                      placeholder="30"
                      disabled={!editable}
                      value={data.sport_duration ?? ''}
                      onChange={(e) =>
                        update((d) => ({
                          ...d,
                          sport_duration: e.target.value
                            ? Number(e.target.value)
                            : null,
                        }))
                      }
                      className="h-9"
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <PhotoBox
                      label="Mana bukti olahragamu?"
                      photo={data.sport_proof_url}
                      disabled={!editable || busy}
                      onPick={(file) =>
                        pickPhoto(file, (d, sport_proof_url) => ({
                          ...d,
                          sport_proof_url,
                        }))
                      }
                      onClear={() =>
                        update((d) => ({ ...d, sport_proof_url: null }))
                      }
                    />
                  </div>
                </div>
              </Reveal>

              <Reveal show={data.did_sport === false} reduce={reduce}>
                <div className="pt-4">
                  <Field
                    label="Kenapa kamu tidak berolahraga?"
                    done={!!data.sport_skip_reason?.trim()}
                  >
                    <Input
                      placeholder="Contoh: saya capek"
                      disabled={!editable}
                      value={data.sport_skip_reason ?? ''}
                      onChange={(e) =>
                        update((d) => ({
                          ...d,
                          sport_skip_reason: e.target.value,
                        }))
                      }
                      className="h-9"
                    />
                  </Field>
                </div>
              </Reveal>
            </Section>

            <Section
              icon={NotebookPenIcon}
              title="Gemar Belajar"
              tone="belajar"
              index={3}
              info="Jawab Ya lalu isi topik, media, dan dua foto bukti (mulai dan selesai). Modul baru dihitung selesai setelah keduanya terupload. Jawab Tidak tetap dicatat beserta alasannya, tapi tidak menambah skor hari itu."
              done={status.belajar}
              reduce={reduce}
              last
            >
              <Question
                text="Apakah kamu belajar hari ini?"
                value={data.did_study}
                disabled={!editable}
                onChange={(done) =>
                  update((d) => ({
                    ...d,
                    did_study: done,
                    study_skip_reason: null,
                    ...(done === true
                      ? {}
                      : {
                          study_about: null,
                          study_media: null,
                          study_start_proof_url: null,
                          study_end_proof_url: null,
                        }),
                  }))
                }
              />

              <Reveal show={data.did_study === true} reduce={reduce}>
                <div className="grid gap-4 pt-4 sm:grid-cols-2">
                  <Field label="Kamu belajar tentang apa?">
                    <Input
                      placeholder="Contoh: struktur data - linked list"
                      disabled={!editable}
                      value={data.study_about ?? ''}
                      onChange={(e) =>
                        update((d) => ({ ...d, study_about: e.target.value }))
                      }
                      className="h-9"
                    />
                  </Field>

                  <Field label="Kamu belajar pakai media apa?">
                    <Input
                      placeholder="Contoh: buku paket, video YouTube"
                      disabled={!editable}
                      value={data.study_media ?? ''}
                      onChange={(e) =>
                        update((d) => ({ ...d, study_media: e.target.value }))
                      }
                      className="h-9"
                    />
                  </Field>

                  <PhotoBox
                    label="Mana bukti kamu mulai belajar?"
                    photo={data.study_start_proof_url}
                    disabled={!editable || busy}
                    onPick={(file) =>
                      pickPhoto(file, (d, study_start_proof_url) => ({
                        ...d,
                        study_start_proof_url,
                      }))
                    }
                    onClear={() =>
                      update((d) => ({
                        ...d,
                        study_start_proof_url: null,
                        study_end_proof_url: null,
                      }))
                    }
                  />
                  <PhotoBox
                    label="Mana bukti kamu selesai belajar?"
                    photo={data.study_end_proof_url}
                    disabled={!editable || busy || !data.study_start_proof_url}
                    lockedHint={
                      data.study_start_proof_url
                        ? undefined
                        : 'Upload bukti mulai dulu'
                    }
                    onPick={(file) =>
                      pickPhoto(file, (d, study_end_proof_url) => ({
                        ...d,
                        study_end_proof_url,
                      }))
                    }
                    onClear={() =>
                      update((d) => ({ ...d, study_end_proof_url: null }))
                    }
                  />

                  {!(
                    data.study_start_proof_url && data.study_end_proof_url
                  ) && (
                    <p className="text-xs text-slate-500 sm:col-span-2 dark:text-slate-400">
                      Status belajar baru tercatat setelah kedua bukti
                      terupload.
                    </p>
                  )}
                </div>
              </Reveal>

              <Reveal show={data.did_study === false} reduce={reduce}>
                <div className="pt-4">
                  <Field
                    label="Kenapa kamu tidak belajar?"
                    done={!!data.study_skip_reason?.trim()}
                  >
                    <Input
                      placeholder="Contoh: saya tertidur"
                      disabled={!editable}
                      value={data.study_skip_reason ?? ''}
                      onChange={(e) =>
                        update((d) => ({
                          ...d,
                          study_skip_reason: e.target.value,
                        }))
                      }
                      className="h-9"
                    />
                  </Field>
                </div>
              </Reveal>
            </Section>
          </div>

          <aside className="space-y-8 lg:sticky lg:top-20 lg:self-start">
            <HabitCalendar
              selected={selected}
              month={month}
              levels={levels}
              onSelect={setDate}
              onMonthChange={setMonth}
            />
            <HabitStats
              month={month}
              recap={recap}
              streak={streak}
              onMonthChange={setMonth}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}

const TONES: Record<ModuleKey, string> = {
  ibadah: 'text-violet-500',
  hadir: 'text-sky-500',
  olahraga: 'text-emerald-500',
  belajar: 'text-amber-500',
};

/** Flat section: hairline divider instead of a card, no elevation. */
function Section({
  icon: Icon,
  title,
  info,
  tone,
  index,
  done,
  reduce,
  first,
  last,
  children,
}: {
  icon: typeof ClockIcon;
  title: string;
  info: string;
  tone: ModuleKey;
  index: number;
  done: boolean;
  reduce: boolean | null;
  first?: boolean;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <m.section
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className={cn(
        'border-slate-200/70 py-8 dark:border-slate-800',
        !first && 'border-t',
        first && 'pt-0',
        last && 'pb-0',
      )}
    >
      <h2 className="mb-5 flex items-center gap-2.5">
        <Icon className={cn('size-5', TONES[tone])} />
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {title}
        </span>
        <InfoHint label={title} text={info} />
        <Tick show={done} />
      </h2>
      {children}
    </m.section>
  );
}

/** Instant visual feedback: a check that springs in when something is logged. */
function Tick({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <m.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white"
        >
          <CheckIcon className="size-3" strokeWidth={3} />
        </m.span>
      )}
    </AnimatePresence>
  );
}

/** Ya / Tidak / belum dijawab. Clicking the active choice clears it back to null. */
function TriState({
  value,
  disabled,
  label,
  onChange,
}: {
  value: Answer;
  disabled: boolean;
  label: string;
  onChange: (v: Answer) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
    >
      {[true, false].map((choice) => {
        const active = value === choice;
        return (
          <button
            key={String(choice)}
            type="button"
            disabled={disabled}
            aria-pressed={active}
            onClick={() => onChange(active ? null : choice)}
            className={cn(
              'px-3 py-1.5 text-xs font-semibold transition-colors',
              !disabled && 'cursor-pointer',
              disabled && 'cursor-not-allowed opacity-60',
              choice
                ? 'border-r border-slate-200 dark:border-slate-700'
                : undefined,
              active && choice && 'bg-emerald-500 text-white',
              active && !choice && 'bg-slate-600 text-white dark:bg-slate-500',
              !active &&
                'bg-transparent text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
            )}
          >
            {choice ? 'Ya' : 'Tidak'}
          </button>
        );
      })}
    </div>
  );
}

function Question({
  text,
  value,
  disabled,
  onChange,
}: {
  text: string;
  value: Answer;
  disabled: boolean;
  onChange: (v: Answer) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {text}
      </p>
      <TriState
        value={value}
        disabled={disabled}
        label={text}
        onChange={onChange}
      />
    </div>
  );
}

function Reveal({
  show,
  reduce,
  children,
}: {
  show: boolean;
  reduce: boolean | null;
  children: ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <m.div
          initial={reduce ? false : { height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  hint,
  done,
  children,
}: {
  label: string;
  hint?: string;
  done?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
        <Tick show={!!done} />
      </span>
      {children}
      {hint && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </span>
      )}
    </div>
  );
}

function PhotoBox({
  label,
  photo,
  disabled,
  lockedHint,
  onPick,
  onClear,
}: {
  label: string;
  photo: string | null;
  disabled: boolean;
  lockedHint?: string;
  onPick: (file: File | undefined) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
        <Tick show={!!photo} />
      </span>
      <div className="relative">
        {photo && !disabled && (
          <button
            type="button"
            onClick={onClear}
            aria-label={`Hapus ${label.toLowerCase()}`}
            className="absolute top-2 right-2 z-10 grid size-8 cursor-pointer place-items-center rounded-full bg-slate-900/70 text-white transition-colors hover:bg-slate-900/90 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
          >
            <XIcon className="size-4" />
          </button>
        )}
        <label
          className={cn(
            'relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50/60 transition-colors dark:border-slate-700 dark:bg-slate-800/40',
            !photo && 'min-h-36',
            disabled
              ? 'cursor-not-allowed opacity-70'
              : 'cursor-pointer hover:border-slate-400 hover:bg-slate-100/60 dark:hover:border-slate-600',
          )}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={disabled}
            onChange={(e) => onPick(e.target.files?.[0])}
          />
          {photo ? (
            <img
              src={fileUrl(photo)}
              alt={label}
              className="h-auto max-h-[70vh] w-full object-contain"
            />
          ) : (
            <>
              {lockedHint ? (
                <LockIcon className="mb-2 size-6 text-slate-400" />
              ) : (
                <UploadIcon className="mb-2 size-6 text-slate-400" />
              )}
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {lockedHint ?? 'Klik untuk upload'}
              </p>
              {!lockedHint && (
                <p className="text-xs text-slate-400">Otomatis dikompres</p>
              )}
            </>
          )}
        </label>
      </div>
    </div>
  );
}
