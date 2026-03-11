'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
  hijriYear,
  muCalendar,
  nuCalendar,
  type RamadanDay,
} from '@/data/journal-ramadhan';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { motion } from 'motion/react';
import { SilaturahimSection } from './silaturahim';
import api from '@/lib/api';

export default function RamadhanPage() {
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(today);
  const [org, setOrg] = useState<'mu' | 'nu' | null>(null);
  const [isChangingOrg, setIsChangingOrg] = useState(false);
  const [showOrmasModal, setShowOrmasModal] = useState(false);
  const [cellSize, setCellSize] = useState(176);
  const [checkedInDays, setCheckedInDays] = useState<number[]>([]);

  useEffect(() => {
    const savedSize = localStorage.getItem('ramadhan_calendar_size');
    if (savedSize) {
      setCellSize(parseInt(savedSize, 10));
    }

    const init = async () => {
      try {
        // 1. Fetch data ormas dari database
        const { data: ormasData } = await api.ramadan.ormas.get();

        if (ormasData?.success) {
          if (ormasData.data.ormas === null) {
            // Jika data masih null, tampilkan modal pilihan
            setShowOrmasModal(true);
          } else {
            // Jika sudah ada, langsung set ke state
            setOrg(ormasData.data.ormas);
          }
        } else {
          // Fallback jika API bermasalah (default ke NU atau sesuai kebijakan)
          setOrg('nu');
        }

        // 2. Gather checked in days
        const { data: logsData } = await api.ramadan.logs.get({
          query: { ramadan_year: hijriYear },
        });
        if (logsData?.success) {
          setCheckedInDays(logsData.data.map((d) => d.ramadan_day));
        }
      } catch (error) {
        console.error('Init Error:', error);
      }
    };

    init();
  }, []);

  // Handler untuk menyimpan pilihan ormas dari modal
  const handleInitialOrgSelect = async (selectedOrg: 'mu' | 'nu') => {
    setIsChangingOrg(true);
    try {
      const { data } = await api.ramadan.ormas.put({ ormas: selectedOrg });
      if (data?.success) {
        setOrg(selectedOrg);
        setShowOrmasModal(false);
      }
    } catch (err) {
      console.error('Gagal menyimpan pilihan ormas', err);
    } finally {
      setIsChangingOrg(false);
    }
  };

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

  const currentCalendar = org === 'mu' ? muCalendar : nuCalendar;

  const getRamadanDay = useCallback(
    (date: Date): RamadanDay | undefined => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return currentCalendar.find((d) => d.date === dateStr);
    },
    [currentCalendar],
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 pb-20 transition-colors duration-500 dark:bg-slate-950">
      {/* Modal Ormas */}
      <Dialog open={showOrmasModal}>
        <DialogContent
          className="sm:max-w-[540px] p-8 [&>button]:hidden bg-[#f8f9fa] dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-left space-y-3">
            <DialogTitle className="text-2xl font-semibold text-slate-900 dark:text-white">
              Pilih Kalender
            </DialogTitle>
            <DialogDescription className="text-base text-slate-500 dark:text-slate-400">
              Ramadan kali ini kamu mengikuti kalender yang mana? Data ini akan
              menyesuaikan jadwal jurnalmu.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleInitialOrgSelect('mu')}
              disabled={isChangingOrg}
              className="h-15 rounded-xl border-slate-200 bg-transparent text-slate-900 font-semibold text-base hover:bg-white hover:shadow-sm dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Muhammadiyah
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleInitialOrgSelect('nu')}
              disabled={isChangingOrg}
              className="h-15 rounded-xl border-slate-200 bg-transparent text-slate-900 font-semibold text-base hover:bg-white hover:shadow-sm dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Nahdlatul Ulama
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                  value={org || 'nu'}
                  onValueChange={async (v) => {
                    const newOrg = v as 'mu' | 'nu';
                    setIsChangingOrg(true);
                    try {
                      await api.ramadan.ormas.put({ ormas: newOrg });
                      setOrg(newOrg);
                    } finally {
                      setIsChangingOrg(false);
                    }
                  }}
                  className="w-full md:w-[300px]"
                >
                  <TabsList className="grid w-full grid-cols-2 md:w-[300px]">
                    <TabsTrigger value="mu" disabled={isChangingOrg}>
                      Muhammadiyah
                    </TabsTrigger>
                    <TabsTrigger value="nu" disabled={isChangingOrg}>
                      Nahdlatul Ulama
                    </TabsTrigger>
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
                              {checkedInDays.includes(ramadanDay.hijriDay) ? (
                                <Button
                                  asChild
                                  size="sm"
                                  className="h-9 w-full border border-emerald-200 bg-emerald-50 px-2 py-0 text-xs font-bold text-emerald-700 shadow-sm hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                                >
                                  <Link href={datePath}>Selesai check-in</Link>
                                </Button>
                              ) : (
                                <Button
                                  asChild
                                  size="sm"
                                  className="h-9 w-full border border-slate-200 bg-white px-2 py-0 text-xs font-bold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-800"
                                >
                                  <Link href={datePath}>Mulai check-in</Link>
                                </Button>
                              )}
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
