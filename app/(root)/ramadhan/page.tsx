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
import { Card, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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

import { muCalendar, nuCalendar, RamadanDay } from '@/data/journal-ramadhan';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { motion } from 'motion/react';

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
    [currentCalendar]
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
            <Card className="overflow-hidden border-none bg-white shadow-sm dark:bg-[#0f172b]">
              {/* Organization Switcher Header */}
              <div className="-mt-6 -mb-6 flex flex-col items-start gap-4 border-b border-neutral-100 bg-[#ededee] p-6 md:flex-row md:items-center md:justify-between dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <ClipboardCheck className="h-6 w-6 text-neutral-900 dark:text-neutral-50" />
                    <CardTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                      Daily Check-in
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
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
                    className="h-8 w-8 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-900"
                    title="Perkecil kalender"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={zoomIn}
                    disabled={cellSize >= 300}
                    className="h-8 w-8 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-900"
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
                      className="h-8 w-8 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-900"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextMonth}
                      disabled={currentDate.getMonth() === 2}
                      className="h-8 w-8 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-900"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  <h2 className="text-lg font-bold text-[#344054] dark:text-neutral-200">
                    {format(currentDate, 'MMMM yyyy')}
                  </h2>
                </div>
              </div>

              {/* Scrollable Calendar Grid */}
              {/* Scrollable Calendar Grid */}
              <div className="show-scrollbar overflow-x-auto pb-4">
                <div className="min-w-[800px] md:min-w-0">
                  <div className="grid grid-cols-7 border-y border-neutral-200 dark:border-neutral-800">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="py-3 text-center text-sm font-bold text-[#344054] dark:text-neutral-300"
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
                      const isPastOrToday = isBefore(startOfDay(day), startOfDay(today)) || isToday;
                      const datePath = ramadanDay
                        ? `/ramadhan/${ramadanDay.hijriDay}`
                        : `/ramadhan/${format(day, 'yyyy-MM-dd')}`;

                      return (
                        <div
                          key={day.toString()}
                          style={{ minHeight: `${cellSize}px` }}
                          className={cn(
                            'group relative border-r border-b border-neutral-200 p-3 transition-all duration-300 last:border-r-0 dark:border-neutral-800',
                            !isCurrentMonth && 'bg-neutral-50/30 dark:bg-neutral-900/30',
                            ramadanDay ? 'bg-orange-50/20 dark:bg-orange-950/10' : ''
                          )}
                        >
                          <div className="flex items-start justify-end">
                            <span
                              className={cn(
                                'flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
                                isToday
                                  ? 'border border-neutral-300 bg-neutral-50 text-neutral-900 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50'
                                  : 'text-[#667085] dark:text-neutral-400',
                                !isCurrentMonth && 'text-neutral-300 dark:text-neutral-700'
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
                                className="h-9 w-full border border-neutral-200 bg-white px-2 py-0 text-xs font-bold text-neutral-900 shadow-sm hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:bg-neutral-900"
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

function SilaturahimSection() {
  const [entries, setEntries] = React.useState<Array<{ name: string; note: string }>>([
    { name: '', note: '' },
  ]);

  const addEntry = () => {
    setEntries([...entries, { name: '', note: '' }]);
  };

  const handleInputChange = (index: number, field: 'name' | 'note', value: string) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setEntries(newEntries);
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
        <Card className="overflow-hidden border-none bg-white shadow-sm dark:bg-[#0f172b]">
          <div className="-mt-6 border-b border-neutral-100 bg-neutral-50/50 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
            <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-neutral-900 uppercase dark:text-neutral-50">
              <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Daftar Kunjungan Idul Fitri
            </h3>
          </div>

          <CardContent className="p-0">
            <div className="show-scrollbar overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/30 dark:border-neutral-800 dark:bg-neutral-900/30">
                    <th className="w-16 px-6 py-4 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                      NO
                    </th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                      NAMA ORANG YANG DIKUNJUNGI
                    </th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                      KETERANGAN
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {entries.map((entry, index) => (
                    <tr
                      key={index}
                      className="group transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30"
                    >
                      <td className="px-6 py-3 text-sm font-bold text-neutral-400">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          placeholder="Masukkan nama..."
                          value={entry.name}
                          onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                          className="h-10 border border-neutral-200 bg-white px-4 font-medium dark:border-neutral-800 dark:bg-neutral-950"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          placeholder="Masukkan keterangan..."
                          value={entry.note}
                          onChange={(e) => handleInputChange(index, 'note', e.target.value)}
                          className="h-10 border border-neutral-200 bg-white px-4 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400"
                        />
                      </td>
                    </tr>
                  ))}
                  {/* Add Row Button Row */}
                  <tr className="border-t border-neutral-100 bg-neutral-50/10 dark:border-neutral-800">
                    <td className="px-5 py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={addEntry}
                        className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </td>
                    <td colSpan={2} className="px-4 py-3">
                      <button
                        onClick={addEntry}
                        className="text-sm font-bold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        Tambah baris baru
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-2 border-t border-neutral-100 bg-neutral-50/30 p-4 dark:border-neutral-800 dark:bg-neutral-900/30"></div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
