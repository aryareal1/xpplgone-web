'use client';

import React from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Users,
  Plus,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isBefore,
  startOfDay,
} from 'date-fns';
import SectionHeader from '@/components/section-header';

import {
  muCalendar,
  nuCalendar,
  type RamadanDay,
} from '@/data/journal-ramadhan';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { motion, AnimatePresence } from 'motion/react';
import { Textarea } from '@/components/ui/textarea';

export default function RamadhanPage() {
  const today = React.useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = React.useState(today);
  const [org, setOrg] = React.useState<'MU' | 'NU' | null>(null);
  const [cellSize, setCellSize] = React.useState(176);

  React.useEffect(() => {
    const savedOrg = localStorage.getItem('ramadhan_org') as 'MU' | 'NU' | null;
    setOrg(savedOrg || 'MU');

    const savedSize = localStorage.getItem('ramadhan_calendar_size');
    if (savedSize) {
      setCellSize(parseInt(savedSize, 10));
    }
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const zoomIn = () =>
    setCellSize((p) => {
      const newSize = Math.min(p + 20, 300);
      localStorage.setItem('ramadhan_calendar_size', newSize.toString());
      return newSize;
    });
  const zoomOut = () =>
    setCellSize((p) => {
      const newSize = Math.max(p - 20, 80);
      localStorage.setItem('ramadhan_calendar_size', newSize.toString());
      return newSize;
    });

  const prevMonth = () => {
    const prev = subMonths(currentDate, 1);
    if (prev.getMonth() >= 1) setCurrentDate(prev);
  };
  const nextMonth = () => {
    const next = addMonths(currentDate, 1);
    if (next.getMonth() <= 2) setCurrentDate(next);
  };

  const currentCalendar = org === 'MU' ? muCalendar : nuCalendar;

  const getRamadanDay = React.useCallback(
    (date: Date): RamadanDay | undefined => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return currentCalendar.find((d) => d.date === dateStr);
    },
    [currentCalendar],
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 pb-20 transition-colors duration-500 dark:bg-slate-950">
      <main className="font-outfit mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section id="calendar" className="w-full">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <SectionHeader
              title="Jurnal Ramadhan"
              desc="Tulis kegiatan ramadhan harianmu!"
              color="bg-orange-500"
            />
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="overflow-hidden border-none bg-white shadow-sm dark:bg-slate-900">
              {/* Organization Switcher Header */}
              <div className="-mt-6 -mb-6 flex flex-col items-start gap-4 border-b border-slate-100 bg-[#ededee] p-6 md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-[#151f33]">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <ClipboardCheck className="h-6 w-6 text-slate-900 dark:text-slate-50" />
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">
                      Daily Check-in
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Pilih organisasi untuk menyesuaikan kalender Ramadhan.
                  </CardDescription>
                </div>
                <Tabs
                  value={org || 'MU'}
                  onValueChange={(v) => {
                    const newOrg = v as 'MU' | 'NU';
                    setOrg(newOrg);
                    localStorage.setItem('ramadhan_org', newOrg);
                  }}
                  className="w-full md:w-[300px]"
                >
                  <TabsList className="grid w-full grid-cols-2 md:w-[300px]">
                    <TabsTrigger value="MU">Muhammadiyah</TabsTrigger>
                    <TabsTrigger value="NU">Nahdlatul Ulama</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="-mb-4 flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={zoomOut}
                    disabled={cellSize <= 80}
                    className="h-8 w-8 text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800"
                    title="Perkecil kalender"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={zoomIn}
                    disabled={cellSize >= 300}
                    className="h-8 w-8 text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800"
                    title="Perbesar kalender"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevMonth}
                      disabled={currentDate.getMonth() === 1}
                      className="h-8 w-8 text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextMonth}
                      disabled={currentDate.getMonth() === 2}
                      className="h-8 w-8 text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  <h2 className="text-lg font-bold text-[#344054] dark:text-slate-200">
                    {format(currentDate, 'MMMM yyyy')}
                  </h2>
                </div>
              </div>

              {/* Scrollable Calendar Grid */}
              <div className="show-scrollbar overflow-x-auto pb-4">
                <div className="min-w-[800px] md:min-w-0">
                  <div className="grid grid-cols-7 border-y border-slate-200 dark:border-slate-800">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="py-3 text-center text-sm font-bold text-[#344054] dark:text-slate-300"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7">
                    {calendarDays.map((day) => {
                      const ramadanDay = getRamadanDay(day);
                      const isCurrentMonth = isSameMonth(day, monthStart);
                      const isToday = isSameDay(day, today);
                      const isPastOrToday =
                        isBefore(startOfDay(day), startOfDay(today)) || isToday;
                      const datePath = ramadanDay
                        ? `/ramadan/${ramadanDay.hijriDay}`
                        : `/ramadan/${format(day, 'yyyy-MM-dd')}`;

                      return (
                        <div
                          key={day.toString()}
                          style={{ minHeight: `${cellSize}px` }}
                          className={cn(
                            'group relative border-r border-b border-slate-200 p-3 transition-all duration-300 last:border-r-0 dark:border-slate-800',
                            !isCurrentMonth &&
                              'bg-slate-50/30 dark:bg-slate-900/30',
                            ramadanDay
                              ? 'bg-orange-50/20 dark:bg-orange-950/10'
                              : '',
                          )}
                        >
                          <div className="flex items-start justify-end">
                            <span
                              className={cn(
                                'flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
                                isToday
                                  ? 'border border-slate-300 bg-slate-50 text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50'
                                  : 'text-[#667085] dark:text-slate-400',
                                !isCurrentMonth &&
                                  'text-slate-300 dark:text-slate-700',
                              )}
                            >
                              {ramadanDay ? ramadanDay.hijriDay : ''}
                            </span>
                          </div>

                          {ramadanDay && isPastOrToday && (
                            <div className="mt-auto flex w-full flex-col gap-1 pt-2">
                              <Button
                                asChild
                                size="sm"
                                className="h-9 w-full border border-slate-200 bg-white px-2 py-0 text-xs font-bold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-800"
                              >
                                <Link href={datePath}>Mulai check-in</Link>
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>
        <SilaturahimSection />
      </main>
    </div>
  );
}

const rowVariants = {
  initial: {
    opacity: 0,
    y: -10,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.32, 0.72, 0, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: [0.32, 0.72, 0, 1] as const,
    },
  },
};

function SilaturahimSection() {
  const generateId = () => {
    if (
      typeof window !== 'undefined' &&
      window.crypto &&
      window.crypto.randomUUID
    ) {
      return window.crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15);
  };

  const [entries, setEntries] = React.useState<
    Array<{ id: string; name: string; note: string }>
  >([{ id: generateId(), name: '', note: '' }]);

  const handleInputChange = (
    index: number,
    field: 'name' | 'note',
    value: string,
  ) => {
    setEntries((prev) => {
      const newEntries = [...prev];
      newEntries[index] = { ...newEntries[index], [field]: value };

      const entry = newEntries[index];

      const hasName = entry.name?.trim() !== '';
      const hasNote = entry.note?.trim() !== '';
      const isComplete = hasName;
      const isEmpty = !hasName && !hasNote;

      if (isComplete && index === newEntries.length - 1) {
        newEntries.push({
          id: generateId(),
          name: '',
          note: '',
        });
      }

      if (isEmpty && newEntries.length > 1) {
        return newEntries.filter((_, i) => i !== index);
      }

      return newEntries;
    });
  };

  return (
    <section id="silaturahim" className="w-full pt-12 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="mb-5"
      >
        <SectionHeader
          title="Kegiatan Silaturahim"
          desc="Daftar kunjungan silaturahim ke sanak saudara & teman Hari Raya Idul Fitri."
          color="bg-emerald-500"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="overflow-hidden border-none bg-white shadow-sm dark:bg-slate-900">
          <div className="-mt-6 border-b border-slate-100 bg-[#ededee] p-6 dark:border-slate-800 dark:bg-[#151f33]">
            <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 uppercase dark:text-slate-50">
              <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Daftar Kunjungan Idul Fitri
            </h3>
          </div>

          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <AnimatePresence mode="sync">
                {entries.map((entry, index) => {
                  const countFilledAbove = entries
                    .slice(0, index)
                    .filter((e) => e.name.trim() !== '').length;

                  const isFilled = entry.name.trim() !== '';

                  return (
                    <motion.div
                      key={entry.id}
                      layout
                      variants={rowVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{
                        layout: { duration: 0.25 },
                      }}
                      className="flex items-start gap-4 p-4"
                    >
                      {/* Number / Plus */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-sm font-bold text-slate-800 dark:bg-slate-700 dark:text-slate-100">
                        {isFilled ? (
                          countFilledAbove + 1
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </div>

                      {/* Inputs */}
                      <div className="flex flex-1 flex-col gap-2">
                        <Input
                          placeholder="Nama yang dikunjungi"
                          value={entry.name}
                          onChange={(e) =>
                            handleInputChange(index, 'name', e.target.value)
                          }
                          className="border-slate-200 bg-[#fcfcfc] text-sm font-medium text-slate-900 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-50 dark:placeholder:text-slate-600"
                        />

                        <div className="flex items-start gap-2">
                          <Textarea
                            placeholder="Catatan kunjungan..."
                            value={entry.note}
                            onChange={(e) =>
                              handleInputChange(index, 'note', e.target.value)
                            }
                            rows={2}
                            className="w-full resize-y border-slate-200 bg-[#fcfcfc] text-sm text-slate-700 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300 dark:placeholder:text-slate-600"
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
