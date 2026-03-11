/** biome-ignore-all lint/a11y/noStaticElementInteractions: AI use static element interactions */
'use client';

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  type ChangeEvent,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2,
  BookmarkCheck,
  ChevronLeft,
  CalendarDays,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format, parseISO, isFriday } from 'date-fns';
import { id } from 'date-fns/locale';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn, sleep } from '@/lib/utils';
import {
  muCalendar,
  nuCalendar,
  type RamadanDay,
  physicalSpiritualJournal,
  sunahJournal,
  type FormData,
  type Shalat5,
  type ShalatSunah,
  initialFormData,
  Extra_Section,
  type ExtraSection,
  hijriYear,
} from '@/data/journal-ramadhan';
import { motion, AnimatePresence } from 'motion/react';
import api from '@/lib/api';

// --- Utility Functions ---
const parseJuzToNumbers = (str: string): number[] => {
  if (!str) return [];
  const nums = new Set<number>();
  const parts = str.split(/[, ]+/);
  parts.forEach((part) => {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map((s) => parseInt(s.trim(), 10));
      if (!Number.isNaN(start) && !Number.isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(30, Math.max(start, end));
        for (let i = min; i <= max; i++) nums.add(i);
      }
    } else {
      const n = parseInt(part.trim(), 10);
      if (!Number.isNaN(n) && n >= 1 && n <= 30) nums.add(n);
    }
  });
  return Array.from(nums).sort((a, b) => a - b);
};

const numbersToJuzRange = (nums: number[]): string => {
  if (nums.length === 0) return '';
  const result: (string | number)[] = [];
  let i = 0;
  while (i < nums.length) {
    let j = i;
    while (j < nums.length - 1 && nums[j + 1] === nums[j] + 1) j++;
    if (i === j) result.push(nums[i]);
    else result.push(`${nums[i]}-${nums[j]}`);
    i = j + 1;
  }
  return result.join(', ');
};

// 1. Header Component
const RamadhanHeader = memo(function RamadhanHeader({
  ramadanDayInfo,
  gregorianDate,
  dateStr,
}: {
  ramadanDayInfo: { hijriDay: number; org: string } | null;
  gregorianDate: Date | null;
  dateStr: string;
}) {
  const displayDate = useMemo(() => {
    return gregorianDate
      ? format(gregorianDate, 'EEEE, d MMMM yyyy', { locale: id })
      : dateStr;
  }, [gregorianDate, dateStr]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-2"
    >
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/ramadan">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            {ramadanDayInfo
              ? `${ramadanDayInfo.hijriDay} Ramadhan 1447 H`
              : 'Check-in Harian'}
          </h1>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {displayDate}
            {ramadanDayInfo && ` (${ramadanDayInfo.org})`}
          </p>
        </div>
      </div>
    </motion.header>
  );
});

// 2. Daily Journal Section (Puasa, Shalat 5 Waktu, Shalat Sunah)
const DailyJournalSection = memo(function DailyJournalSection({
  formData,
  handleCheckboxChange,
  handleInputChange,
}: {
  formData: FormData;
  handleCheckboxChange: (
    section: 'salat' | 'salat_sunnah' | 'root',
    field: string,
    value: boolean,
  ) => void;
  handleInputChange: (
    section: 'jumah' | 'tadarus' | 'tarawih' | 'ceramah' | null,
    field: string,
    value: string,
  ) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950/50">
          <CalendarDays className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        </div>
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
          Jurnal Kegiatan Harian
        </h2>
      </div>

      <Card className="overflow-hidden border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-[#0f172b]">
        <CardContent className="grid gap-6 p-6">
          {/* Puasa Checkbox */}
          <label className="flex cursor-pointer touch-manipulation items-center justify-between rounded-lg border border-orange-100 bg-orange-50/30 p-4 select-none dark:border-orange-900/30 dark:bg-orange-950/10">
            <div className="space-y-0.5">
              <span className="text-base font-bold text-neutral-900 italic dark:text-neutral-100">
                Puasa
              </span>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Niat dan menjalankan puasa hari ini
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.fasting ?? false}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleCheckboxChange('root', 'fasting', e.target.checked)
              }
              className="h-5 w-5 cursor-pointer rounded border-neutral-300 accent-orange-600"
            />
          </label>

          {/* Shalat 5 Waktu */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold tracking-wider text-neutral-500 uppercase">
              Shalat 5 Waktu
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {physicalSpiritualJournal.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer touch-manipulation flex-col items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50/50 p-3 select-none dark:border-[#2e3647] dark:bg-[#0f172b]"
                >
                  <span className="text-xs font-bold capitalize">
                    {item.name}
                  </span>
                  <input
                    type="checkbox"
                    checked={
                      formData.salat?.[item.id as keyof Shalat5] ?? false
                    }
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleCheckboxChange('salat', item.id, e.target.checked)
                    }
                    className="h-5 w-5 cursor-pointer rounded border-neutral-300 accent-orange-600"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Shalat Sunah */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold tracking-wider text-neutral-500 uppercase">
              Sholat Sunah
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {sunahJournal.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer touch-manipulation flex-col items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50/50 p-3 select-none dark:border-[#2e3647] dark:bg-[#0f172b]"
                >
                  <span className="text-xs font-bold capitalize">
                    {item.name}
                  </span>
                  <input
                    type="checkbox"
                    checked={
                      formData.salat_sunnah?.[item.id as keyof ShalatSunah] ??
                      false
                    }
                    onChange={(e) =>
                      handleCheckboxChange(
                        'salat_sunnah',
                        item.id,
                        e.target.checked,
                      )
                    }
                    className="h-5 w-5 cursor-pointer rounded border-neutral-300 accent-orange-600"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Keterangan */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              Keterangan
            </h3>
            <Textarea
              placeholder="Catatan tambahan kegiatan hari ini..."
              value={formData.notes ?? ''}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange(null, 'notes', e.target.value)
              }
              className="min-h-[120px] bg-neutral-50/50 dark:border-[#2e3647] dark:bg-[#0f172b]"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
});

// 3. Juz Grid Selector
const JuzGridSelector = memo(function JuzGridSelector({
  juzValue,
  handleInputChange,
  placeholder,
}: {
  juzValue: string;
  handleInputChange: (
    section: 'jumah' | 'tadarus' | 'tarawih' | 'ceramah' | null,
    field: string,
    value: string,
  ) => void;
  placeholder?: string;
}) {
  const [isJuzGridVisible, setIsJuzGridVisible] = useState(true);

  const selectedJuzNumbers = useMemo(
    () => parseJuzToNumbers(juzValue),
    [juzValue],
  );

  const toggleJuz = useCallback(
    (n: number) => {
      const isSelected = selectedJuzNumbers.includes(n);
      let next: number[];
      if (isSelected) {
        next = selectedJuzNumbers.filter((x) => x !== n);
      } else {
        next = [...selectedJuzNumbers, n].sort((a, b) => a - b);
      }
      handleInputChange('tadarus', 'juz', numbersToJuzRange(next));
    },
    [selectedJuzNumbers, handleInputChange],
  );

  return (
    <>
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              '-mt-2.5 text-sm transition-colors',
              !juzValue
                ? 'text-muted-foreground'
                : 'text-black dark:text-white',
            )}
          >
            {juzValue || placeholder}
          </span>
        </div>
        <div className="-mt-2.5 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsJuzGridVisible((prev) => !prev)}
            className="hidden h-6 gap-2 rounded-lg px-2 text-xs font-bold text-slate-500 hover:bg-slate-100 md:flex dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {isJuzGridVisible ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsJuzGridVisible((prev) => !prev)}
            className="h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {isJuzGridVisible ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isJuzGridVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-5 gap-2 pt-1 sm:grid-cols-6 lg:grid-cols-10">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => {
                const isSelected = selectedJuzNumbers.includes(n);
                return (
                  <motion.button
                    key={n}
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleJuz(n)}
                    className={cn(
                      'flex h-10 items-center justify-center rounded-lg text-xs font-bold transition-all',
                      isSelected
                        ? 'bg-emerald-500 text-white shadow-md ring-0 dark:shadow-none'
                        : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
                    )}
                  >
                    {n}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

// 4. Action Buttons (Submit & Clear)
const ActionButtons = memo(function ActionButtons({
  onClearClick,
  formData,
  hijriDay,
}: {
  onClearClick: () => void;
  formData: FormData;
  hijriDay: number;
}) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSimpan = useCallback(async () => {
    setIsLoading(true);

    const { data, error } = await api.ramadan
      .logs({ year: hijriYear })({ day: hijriDay })
      .put(formData);

    if (error) throw error;

    setIsLoading(false);
    setIsSuccess(true);

    await sleep(3000);
    setIsSuccess(false);

    await sleep(1000);
    router.push('/ramadan');

    console.log(data);
  }, [formData, hijriDay, router]);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={handleSimpan}
          disabled={isLoading || isSuccess}
          className={cn(
            'h-12 sm:flex-1 rounded-xl font-bold text-white shadow-lg transition-all duration-300',
            isSuccess
              ? 'bg-emerald-500 shadow-emerald-200 hover:bg-emerald-600 dark:shadow-none'
              : isLoading
                ? 'bg-orange-400 shadow-none'
                : 'bg-orange-600 shadow-orange-200 hover:bg-orange-700 dark:shadow-none',
          )}
        >
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center"
              >
                <BookmarkCheck className="mr-2 h-5 w-5 animate-bounce" />
                Berhasil Disimpan!
              </motion.div>
            ) : isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center"
              >
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Menyimpan...
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center"
              >
                <BookmarkCheck className="mr-2 h-5 w-5" />
                Simpan Jurnal Hari Ini
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        <Button
          variant="outline"
          onClick={onClearClick}
          className="h-12 rounded-xl border-slate-200 font-bold text-slate-500 transition-all hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-red-950/20"
        >
          <Trash2 className="mr-2 h-5 w-5" />
          Hapus Semua
        </Button>
      </div>
      <p className="text-center text-xs text-neutral-500">
        Pastikan kalian tidak bohong dalam mengisi jurnal ini. Ingat, Allah Maha
        Melihat dan Maha Mengetahui.
      </p>
    </div>
  );
});

// --- Main Page Component ---
export default function RamadanCheckinPage() {
  const params = useParams();
  const dateStr = params.date as string;

  // State
  const [loading, setLoading] = useState(true);
  const [userGender, setUserGender] = useState<string | null>(null);
  const [isFridayDay, setIsFridayDay] = useState(false);
  const [ramadanDayInfo, setRamadanDayInfo] = useState<{
    hijriDay: number;
    org: string;
  } | null>(null);
  const [gregorianDate, setGregorianDate] = useState<Date | null>(null);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Load Data Effect
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: userData } = await api.users.me.get();
        if (!userData?.data) return;
        setUserGender(userData.data.gender);

        const { data: ormasData } = await api.ramadan.ormas.get();
        const ormas =
          ormasData?.success && ormasData.data.ormas
            ? ormasData.data.ormas
            : 'nu';

        let actualDate: Date | null = null;
        const hijriDay = parseInt(dateStr, 10);
        let currentRamadanInfo = null;

        if (!Number.isNaN(hijriDay)) {
          const calendar = ormas === 'mu' ? muCalendar : nuCalendar;
          const dayData = calendar.find(
            (d: RamadanDay) => d.hijriDay === hijriDay,
          );

          if (dayData) {
            actualDate = parseISO(dayData.date);
            currentRamadanInfo = {
              hijriDay,
              org: ormas === 'mu' ? 'MU' : 'NU',
            };
          }
        } else {
          try {
            actualDate = parseISO(dateStr);
          } catch (e) {
            console.error('Invalid date format', e);
          }
        }

        if (isMounted) {
          if (currentRamadanInfo) setRamadanDayInfo(currentRamadanInfo);
          if (actualDate) {
            setGregorianDate(actualDate);
            setIsFridayDay(isFriday(actualDate));
          }

          await api.ramadan
            .logs({ year: hijriYear })({ day: hijriDay })
            .get()
            .then(({ data }) => {
              if (data) setFormData(data.data);
            });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [dateStr]);

  const handleCheckboxChange = useCallback(
    (
      section: 'salat' | 'salat_sunnah' | 'root',
      field: string,
      value: boolean,
    ) => {
      setFormData((prev) => {
        if (section === 'salat' || section === 'salat_sunnah') {
          return {
            ...prev,
            [section]: {
              ...prev[section],
              [field]: value,
            },
          };
        }
        return { ...prev, [field]: value } as FormData;
      });
    },
    [],
  );

  const handleInputChange = useCallback(
    (
      section: 'jumah' | 'tadarus' | 'tarawih' | 'ceramah' | null,
      field: string,
      value: string,
    ) => {
      if (section === 'tadarus' && field === 'juz') {
        const numbers = value.match(/\d+/g);
        if (numbers?.some((n) => parseInt(n, 10) > 30)) {
          return;
        }
      }
      setFormData((prev) => {
        if (section) {
          return {
            ...prev,
            [section]: {
              ...prev[section],
              [field]: value,
            },
          };
        }
        return { ...prev, [field]: value } as FormData;
      });
    },
    [],
  );

  const handleClear = useCallback(async () => {
    if (!ramadanDayInfo?.hijriDay) return;

    setIsClearing(true);
    try {
      const { error } = await api.ramadan
        .logs({ year: hijriYear })({ day: ramadanDayInfo.hijriDay })
        .delete();

      if (error) throw error;

      setFormData(initialFormData);
      setShowConfirmClear(false);
    } catch (error) {
      console.error('Failed to clear data:', error);
    } finally {
      setIsClearing(false);
    }
  }, [ramadanDayInfo]);

  const handleClearClick = useCallback(() => {
    setShowConfirmClear(true);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 pb-20 transition-colors duration-500 dark:bg-slate-950">
      <main className="font-outfit mx-auto mt-5 flex max-w-[800px] flex-col gap-6 px-4 pb-20">
        <RamadhanHeader
          ramadanDayInfo={ramadanDayInfo}
          gregorianDate={gregorianDate}
          dateStr={dateStr}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 gap-6"
        >
          <DailyJournalSection
            formData={formData}
            handleCheckboxChange={handleCheckboxChange}
            handleInputChange={handleInputChange}
          />

          {/* Extra Sections (Tadarrus, Tarawih, Ceramah, etc.) */}
          {Extra_Section.map((section: ExtraSection) => {
            // Check if section should be shown based on condition (if any)
            if (
              section.condition &&
              !section.condition(userGender, isFridayDay)
            )
              return null;

            return (
              <section
                key={section.id}
                className="animate-in fade-in zoom-in space-y-4 duration-500"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl',
                      section.color.split(' ')[0],
                      'dark:bg-opacity-20',
                    )}
                  >
                    <section.icon
                      className={cn(
                        'h-5 w-5',
                        section.color.split(' ')[1] || section.color,
                      )}
                    />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
                    {section.title}
                  </h2>
                </div>

                <Card className="border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#0f172b]">
                  <CardContent className="grid gap-4 p-6">
                    <div
                      className={cn(
                        'grid gap-4',
                        section.fields.length === 1
                          ? 'grid-cols-1'
                          : section.fields.length === 2
                            ? 'sm:grid-cols-2'
                            : 'sm:grid-cols-2 lg:grid-cols-3',
                      )}
                    >
                      {section.fields.map((field) => (
                        <div
                          key={field.id}
                          className={cn(
                            'space-y-2',
                            field.id === 'materi' && 'lg:col-span-1',
                          )}
                        >
                          <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                            {field.label}
                          </h3>
                          {field.id === 'juz' ? (
                            <div className="border-input rounded-md border bg-[#fcfcfc] p-3 shadow-xs dark:bg-slate-900">
                              <JuzGridSelector
                                juzValue={formData.tadarus?.juz ?? ''}
                                handleInputChange={handleInputChange}
                                placeholder={field.placeholder}
                              />
                            </div>
                          ) : (
                            <div className="relative">
                              {field.icon && (
                                <field.icon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                              )}
                              <Input
                                type={field.type || 'text'}
                                className={cn(
                                  field.icon && 'pl-10',
                                  'bg-[#fcfcfc] dark:bg-slate-900',
                                )}
                                placeholder={field.placeholder}
                                // @ts-expect-error The type of formData is not matching with the section.id and field.id
                                value={formData[section.id]?.[field.id] || ''}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                  handleInputChange(
                                    section.id,
                                    field.id,
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            );
          })}

          <ActionButtons
            onClearClick={handleClearClick}
            formData={formData}
            hijriDay={ramadanDayInfo?.hijriDay ?? 0}
          />
        </motion.div>

        {/* Clear Confirmation Modal Contextualized Out */}
        <AlertDialog open={showConfirmClear} onOpenChange={setShowConfirmClear}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <AlertDialogTitle className="text-center">
                Hapus Semua Isian?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                Tindakan ini akan menghapus semua inputan yang sudah kamu isi di
                jurnal hari ini.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <Button
                onClick={handleClear}
                disabled={isClearing}
                className="bg-red-600 font-bold text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              >
                {isClearing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  'Ya, Hapus Semua'
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
