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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';
import { isAdminRole } from '../../../../data/habit-admin';
import {
  type Answer,
  attendanceCopy,
  attendanceWindow,
  emptyDay,
  fmtDate,
  fmtTime,
  type HabitDay,
  IBADAH,
  isWeekend,
  lateLabel,
  load,
  loadMonth,
  type ModuleKey,
  parseDate,
  type Photo,
  save,
  SPORT_TYPES,
} from '../../../../data/habit-data';
import { HabitCalendar, HabitStats, InfoHint } from './widgets';

const MAX_PHOTO = 5 * 1024 * 1024;
const MAX_EDGE = 1280;

const readPhoto = (file: File) =>
  new Promise<Photo>((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File harus berupa gambar.'));
      return;
    }
    if (file.size > MAX_PHOTO) {
      reject(new Error('Ukuran foto maksimal 5MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gagal membaca foto.'));
      img.onload = () => {
        const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Browser tidak mendukung kompresi foto.'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve({
          data: canvas.toDataURL('image/jpeg', 0.72),
          at: new Date().toISOString(),
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });

export default function HabitJournal() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const { user } = useUser();

  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<HabitDay>(emptyDay);
  const dataRef = useRef(data);
  const [month, setMonth] = useState(() => new Date());
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => setMounted(true), []);

  const today = useMemo(() => new Date(), []);
  const todayStr = fmtDate(today);
  const date = fmtDate(parseDate(params.get('date')) ?? today);
  const selected = parseDate(date) ?? today;
  const editable = date === todayStr;

  useEffect(() => {
    if (!mounted) return;
    const loaded = load(date);
    dataRef.current = loaded;
    setData(loaded);
    setError(null);
    setMonth((prev) => {
      const d = parseDate(date);
      return d &&
        (d.getMonth() !== prev.getMonth() ||
          d.getFullYear() !== prev.getFullYear())
        ? new Date(d.getFullYear(), d.getMonth(), 1)
        : prev;
    });
  }, [date, mounted]);

  const days = useMemo(() => {
    const map = mounted
      ? loadMonth(month.getFullYear(), month.getMonth(), today)
      : new Map<number, HabitDay | null>();
    if (
      selected.getMonth() === month.getMonth() &&
      selected.getFullYear() === month.getFullYear()
    ) {
      map.set(selected.getDate(), data);
    }
    return map;
  }, [month, today, mounted, selected, data]);

  const setDate = (d: Date) =>
    router.replace(`${pathname}?date=${fmtDate(d)}`, { scroll: false });

  const gate = attendanceWindow(now);
  const copy = attendanceCopy(selected);
  const waitingForOpen = editable && !data.hadir && gate === 'closed';
  useEffect(() => {
    if (!waitingForOpen) return;
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, [waitingForOpen]);

  const update = useCallback(
    (fn: (prev: HabitDay) => HabitDay) => {
      const next = fn(dataRef.current);
      if (!save(date, next)) {
        setError(
          'Penyimpanan browser penuh. Hapus catatan foto lama untuk melanjutkan.',
        );
        return;
      }
      dataRef.current = next;
      setError(null);
      setData(next);
    },
    [date],
  );

  const pickPhoto = async (
    file: File | undefined,
    apply: (prev: HabitDay, photo: Photo) => HabitDay,
  ) => {
    if (!file) return;
    try {
      const photo = await readPhoto(file);
      update((prev) => apply(prev, photo));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (!mounted) return null;

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
              info="Centang tiap salat sunah yang kamu kerjakan hari ini. Modul dihitung selesai hanya kalau keempatnya tercentang, dan nilai Ibadah di statistik memakai rata-rata jumlah centang."
              done={data.ibadah.every((v) => v === true)}
              reduce={reduce}
              first
            >
              <ul className="divide-y divide-slate-200/70 dark:divide-slate-800">
                {IBADAH.map((name, i) => (
                  <li key={name}>
                    <div
                      className={cn(
                        'flex items-center gap-3 py-3',
                        editable
                          ? 'cursor-pointer'
                          : 'cursor-not-allowed opacity-70',
                      )}
                    >
                      <Checkbox
                        id={`ibadah-${i}`}
                        checked={data.ibadah[i] === true}
                        disabled={!editable}
                        onCheckedChange={(checked) =>
                          update((d) => ({
                            ...d,
                            ibadah: d.ibadah.map((old, j) =>
                              j === i
                                ? typeof checked === 'boolean'
                                  ? checked
                                  : null
                                : old,
                            ),
                          }))
                        }
                      />
                      <label
                        htmlFor={`ibadah-${i}`}
                        className={cn(
                          'text-sm font-medium text-slate-700 dark:text-slate-200',
                          editable && 'cursor-pointer',
                        )}
                      >
                        {name}
                      </label>
                      <span className="ml-auto">
                        <Tick show={data.ibadah[i] === true} />
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
              done={!!data.hadir}
              reduce={reduce}
            >
              {data.hadir && (
                <p className="mb-4 text-sm">
                  <span
                    className={cn(
                      'font-bold',
                      data.hadir.late
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400',
                    )}
                  >
                    {data.hadir.late
                      ? lateLabel(new Date(data.hadir.at))
                      : copy.ok}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {' '}
                    pada {fmtTime(data.hadir.at)}
                  </span>
                </p>
              )}
              <Button
                variant="special"
                size="lg"
                pointer
                disabled={!editable || !!data.hadir || gate === 'closed'}
                className="w-full sm:w-auto sm:min-w-48"
                onClick={() => {
                  const clicked = new Date();
                  const state = attendanceWindow(clicked);
                  if (state === 'closed') {
                    setNow(clicked);
                    setError('Absensi baru dibuka pukul 06:00.');
                    return;
                  }
                  update((d) => ({
                    ...d,
                    hadir: {
                      at: clicked.toISOString(),
                      late: state === 'late',
                    },
                  }));
                }}
              >
                {data.hadir ? (
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
              {!data.hadir && editable && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {gate === 'closed'
                    ? 'Absensi dibuka pukul 06:00.'
                    : gate === 'open'
                      ? `${copy.verb} sebelum ${copy.deadline} supaya tidak tercatat ${copy.late.toLowerCase()}.`
                      : `Lewat ${copy.deadline}, ${copy.noun} akan tercatat ${lateLabel(now).toLowerCase()}.`}
                </p>
              )}
              {!data.hadir && !editable && (
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
              info="Jawab Ya lalu isi jenis, durasi, dan foto bukti. Modul selesai setelah fotonya masuk. Jawab Tidak juga sah selesai asal alasannya diisi."
              done={
                data.olahraga.done === true
                  ? !!data.olahraga.photo
                  : data.olahraga.done === false &&
                    data.olahraga.alt.trim().length > 0
              }
              reduce={reduce}
            >
              <Question
                text="Apakah kamu berolahraga hari ini?"
                value={data.olahraga.done}
                disabled={!editable}
                onChange={(done) =>
                  update((d) => ({
                    ...d,
                    olahraga:
                      done === true
                        ? { ...d.olahraga, done, alt: '' }
                        : {
                            done,
                            sport: '',
                            minutes: null,
                            photo: null,
                            alt: '',
                          },
                  }))
                }
              />

              <Reveal show={data.olahraga.done === true} reduce={reduce}>
                <div className="grid gap-4 pt-4 sm:grid-cols-2">
                  <Field label="Olahraga apa yang kamu lakukan?">
                    <select
                      value={data.olahraga.sport}
                      disabled={!editable}
                      onChange={(e) =>
                        update((d) => ({
                          ...d,
                          olahraga: { ...d.olahraga, sport: e.target.value },
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
                      value={data.olahraga.minutes ?? ''}
                      onChange={(e) =>
                        update((d) => ({
                          ...d,
                          olahraga: {
                            ...d.olahraga,
                            minutes: e.target.value
                              ? Number(e.target.value)
                              : null,
                          },
                        }))
                      }
                      className="h-9"
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <PhotoBox
                      label="Mana bukti olahragamu?"
                      photo={data.olahraga.photo}
                      disabled={!editable}
                      onPick={(file) =>
                        pickPhoto(file, (d, photo) => ({
                          ...d,
                          olahraga: { ...d.olahraga, photo },
                        }))
                      }
                    />
                  </div>
                </div>
              </Reveal>

              <Reveal show={data.olahraga.done === false} reduce={reduce}>
                <div className="pt-4">
                  <Field
                    label="Kenapa kamu tidak berolahraga?"
                    done={data.olahraga.alt.trim().length > 0}
                  >
                    <Input
                      placeholder="Contoh: saya capek"
                      disabled={!editable}
                      value={data.olahraga.alt}
                      onChange={(e) =>
                        update((d) => ({
                          ...d,
                          olahraga: { ...d.olahraga, alt: e.target.value },
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
              info="Jawab Ya lalu isi topik, media, dan dua foto bukti (mulai dan selesai). Modul baru selesai setelah keduanya terupload. Jawab Tidak sah selesai asal alasannya diisi."
              done={
                data.belajar.done === true
                  ? !!data.belajar.start && !!data.belajar.end
                  : data.belajar.done === false &&
                    data.belajar.alt.trim().length > 0
              }
              reduce={reduce}
              last
            >
              <Question
                text="Apakah kamu belajar hari ini?"
                value={data.belajar.done}
                disabled={!editable}
                onChange={(done) =>
                  update((d) => ({
                    ...d,
                    belajar:
                      done === true
                        ? { ...d.belajar, done, alt: '' }
                        : {
                            done,
                            start: null,
                            end: null,
                            alt: '',
                            topic: '',
                            media: '',
                          },
                  }))
                }
              />

              <Reveal show={data.belajar.done === true} reduce={reduce}>
                <div className="grid gap-4 pt-4 sm:grid-cols-2">
                  <Field label="Kamu belajar tentang apa?">
                    <Input
                      placeholder="Contoh: struktur data - linked list"
                      disabled={!editable}
                      value={data.belajar.topic}
                      onChange={(e) =>
                        update((d) => ({
                          ...d,
                          belajar: { ...d.belajar, topic: e.target.value },
                        }))
                      }
                      className="h-9"
                    />
                  </Field>

                  <Field label="Kamu belajar pakai media apa?">
                    <Input
                      placeholder="Contoh: buku paket, video YouTube"
                      disabled={!editable}
                      value={data.belajar.media}
                      onChange={(e) =>
                        update((d) => ({
                          ...d,
                          belajar: { ...d.belajar, media: e.target.value },
                        }))
                      }
                      className="h-9"
                    />
                  </Field>

                  <PhotoBox
                    label="Mana bukti kamu mulai belajar?"
                    photo={data.belajar.start}
                    disabled={!editable}
                    onPick={(file) =>
                      pickPhoto(file, (d, start) => ({
                        ...d,
                        belajar: { ...d.belajar, start },
                      }))
                    }
                  />
                  <PhotoBox
                    label="Mana bukti kamu selesai belajar?"
                    photo={data.belajar.end}
                    disabled={!editable || !data.belajar.start}
                    lockedHint={
                      data.belajar.start ? undefined : 'Upload bukti mulai dulu'
                    }
                    onPick={(file) =>
                      pickPhoto(file, (d, end) => ({
                        ...d,
                        belajar: { ...d.belajar, end },
                      }))
                    }
                  />

                  {!(data.belajar.start && data.belajar.end) && (
                    <p className="text-xs text-slate-500 sm:col-span-2 dark:text-slate-400">
                      Status belajar baru tercatat setelah kedua bukti
                      terupload.
                    </p>
                  )}
                </div>
              </Reveal>

              <Reveal show={data.belajar.done === false} reduce={reduce}>
                <div className="pt-4">
                  <Field
                    label="Kenapa kamu tidak belajar?"
                    done={data.belajar.alt.trim().length > 0}
                  >
                    <Input
                      placeholder="Contoh: saya tertidur"
                      disabled={!editable}
                      value={data.belajar.alt}
                      onChange={(e) =>
                        update((d) => ({
                          ...d,
                          belajar: { ...d.belajar, alt: e.target.value },
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
              days={days}
              onSelect={setDate}
              onMonthChange={setMonth}
            />
            <HabitStats month={month} days={days} onMonthChange={setMonth} />
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
}: {
  label: string;
  photo: Photo | null;
  disabled: boolean;
  lockedHint?: string;
  onPick: (file: File | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
        <Tick show={!!photo} />
      </span>
      <label
        className={cn(
          'relative flex min-h-36 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50/60 transition-colors dark:border-slate-700 dark:bg-slate-800/40',
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
            src={photo.data}
            alt={label}
            className="h-36 w-full object-cover"
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
      {photo && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Diupload {fmtTime(photo.at)}
        </span>
      )}
    </div>
  );
}
