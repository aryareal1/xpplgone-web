'use client';

import { useEffect, useState } from 'react';
import {
  Check,
  Clock,
  MapPin,
  Calendar,
  Grid3x3,
  LayoutList,
  GraduationCap,
  Users,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface TimeSlot {
  period: string;
  start: string;
  end: string;
  type?: 'class' | 'break';
}

interface Lesson {
  time: string;
  subject: string;
  teacher: string;
  room?: string;
  color: string;
  startTime: string;
  endTime: string;
}

interface Day {
  name: string;
  subtitle: string;
  lessons: Lesson[];
}

const mondaySchedule: TimeSlot[] = [
  { period: 'Upacara/Apel', start: '07:00', end: '07:40', type: 'class' },
  { period: 'Jam 1', start: '07:40', end: '08:20', type: 'class' },
  { period: 'Jam 2', start: '08:20', end: '09:00', type: 'class' },
  { period: 'Istirahat', start: '09:00', end: '09:30', type: 'break' },
  { period: 'Jam 3', start: '09:30', end: '10:10', type: 'class' },
  { period: 'Jam 4', start: '10:10', end: '10:50', type: 'class' },
  { period: 'Jam 5', start: '10:50', end: '11:30', type: 'class' },
  { period: 'Istirahat 2', start: '11:30', end: '12:30', type: 'break' },
  { period: 'Jam 6', start: '12:30', end: '13:05', type: 'class' },
  { period: 'Jam 7', start: '13:05', end: '13:40', type: 'class' },
  { period: 'Jam 8', start: '13:40', end: '14:15', type: 'class' },
  { period: 'Jam 9', start: '14:15', end: '14:50', type: 'class' },
  { period: 'Jam 10', start: '14:50', end: '15:25', type: 'class' },
  { period: 'Check', start: '15:25', end: '15:30', type: 'class' },
];

const timeSchedule: TimeSlot[] = [
  { period: 'Jam 1', start: '07:00', end: '07:40', type: 'class' },
  { period: 'Jam 2', start: '07:40', end: '08:20', type: 'class' },
  { period: 'Jam 3', start: '08:20', end: '09:00', type: 'class' },
  { period: 'Istirahat', start: '09:00', end: '09:30', type: 'break' },
  { period: 'Jam 4', start: '09:30', end: '10:10', type: 'class' },
  { period: 'Jam 5', start: '10:10', end: '10:50', type: 'class' },
  { period: 'Jam 6', start: '10:50', end: '11:30', type: 'class' },
  { period: 'Istirahat 2', start: '11:30', end: '12:30', type: 'break' },
  { period: 'Jam 7', start: '12:30', end: '13:05', type: 'class' },
  { period: 'Jam 8', start: '13:05', end: '13:40', type: 'class' },
  { period: 'Jam 9', start: '13:40', end: '14:15', type: 'class' },
  { period: 'Jam 10', start: '14:15', end: '14:50', type: 'class' },
  { period: 'Jam 11', start: '14:50', end: '15:25', type: 'class' },
  { period: 'Check', start: '15:25', end: '15:30', type: 'class' },
];

const fridaySchedule: TimeSlot[] = [
  { period: 'Kegiatan Jumat', start: '07:00', end: '07:45', type: 'class' },
  { period: 'Jam 1', start: '07:45', end: '08:25', type: 'class' },
  { period: 'Jam 2', start: '08:25', end: '09:05', type: 'class' },
  { period: 'Istirahat', start: '09:05', end: '09:25', type: 'break' },
  { period: 'Jam 3', start: '09:25', end: '10:05', type: 'class' },
  { period: 'Jam 4', start: '10:05', end: '10:45', type: 'class' },
  { period: 'Jam 5', start: '10:45', end: '11:15', type: 'class' },
  { period: 'Istirahat 2', start: '11:15', end: '12:30', type: 'break' },
  { period: 'Jam 6', start: '12:30', end: '13:15', type: 'class' },
  { period: 'Jam 7', start: '13:15', end: '13:55', type: 'class' },
  { period: 'Check', start: '13:55', end: '14:00', type: 'class' },
];

const scheduleData: Day[] = [
  {
    name: 'Senin',
    subtitle: 'Hari Produktif',
    lessons: [
      {
        time: 'Jam 1-10',
        subject: 'RPL - Dasar PPLG',
        teacher: 'Mukti Widodo, S.T',
        room: 'RPL-GV',
        color: 'border-amber-500',
        startTime: '07:40',
        endTime: '15:25',
      },
    ],
  },
  {
    name: 'Selasa',
    subtitle: 'Hari Umum',
    lessons: [
      {
        time: 'Jam 1-2',
        subject: 'RPL - Dasar PPLG',
        teacher: 'Mukti Widodo, S.T',
        room: 'RPL-GV',
        color: 'border-amber-500',
        startTime: '07:00',
        endTime: '08:20',
      },
      {
        time: 'Jam 3-4',
        subject: 'Bahasa Inggris',
        teacher: 'Yuli Rahayu, S.Pd',
        color: 'border-orange-400',
        startTime: '08:20',
        endTime: '10:10',
      },
      {
        time: 'Jam 5-6',
        subject: 'Sejarah',
        teacher: 'Wahyu Dwi Yulianti, S.Pd',
        color: 'border-sky-400',
        startTime: '10:10',
        endTime: '11:30',
      },
      {
        time: 'Jam 7-8',
        subject: 'Matematika',
        teacher: 'Dwi Herni Noviyanti S.Pd',
        color: 'border-emerald-400',
        startTime: '12:30',
        endTime: '13:40',
      },
      {
        time: 'Jam 9-11',
        subject: 'PIPAS',
        teacher: 'Satria Nur Karim Amrullah, S.Pd',
        color: 'border-fuchsia-500',
        startTime: '13:40',
        endTime: '15:25',
      },
    ],
  },
  {
    name: 'Rabu',
    subtitle: 'Hari Umum',
    lessons: [
      {
        time: 'Jam 1-3',
        subject: 'PJOK',
        teacher: 'Drs. Budi Setiyadi',
        color: 'border-green-400',
        startTime: '07:00',
        endTime: '09:00',
      },
      {
        time: 'Jam 4-5',
        subject: 'Seni Budaya',
        teacher: 'Sigit Purnomo, S.Pd',
        color: 'border-indigo-400',
        startTime: '09:30',
        endTime: '10:50',
      },
      {
        time: 'Jam 6-7',
        subject: 'Bahasa Jawa',
        teacher: 'Rinta Dwi Jayanti, S.Pd',
        color: 'border-orange-500',
        startTime: '10:50',
        endTime: '13:05',
      },
      {
        time: 'Jam 8-9',
        subject: 'Bahasa Indonesia',
        teacher: 'Chanifah Ulfah, S.Pd',
        color: 'border-blue-500',
        startTime: '13:05',
        endTime: '14:15',
      },
      {
        time: 'Jam 10-11',
        subject: 'Koding dan Kecerdasan Artifisial',
        teacher: 'Riris Yuniaratri, S.Pd',
        color: 'border-blue-500',
        room: 'Lab Kom 3',
        startTime: '14:15',
        endTime: '15:25',
      },
    ],
  },
  {
    name: 'Kamis',
    subtitle: 'Hari Umum',
    lessons: [
      {
        time: 'Jam 1-3',
        subject: 'PABP',
        teacher: 'Laely Hilalliyah, S.Fil.I, M.Pd',
        color: 'border-pink-400',
        startTime: '07:00',
        endTime: '09:00',
      },
      {
        time: 'Jam 4-7',
        subject: 'Informatika',
        teacher: 'Riris Yuniaratri, S.Pd',
        color: 'border-blue-500',
        room: 'RPL-Lab RPL',
        startTime: '09:30',
        endTime: '13:05',
      },
      {
        time: 'Jam 8-9',
        subject: 'Matematika',
        teacher: 'Dwi Herni Noviyanti S.Pd',
        color: 'border-emerald-400',
        startTime: '13:05',
        endTime: '14:15',
      },
      {
        time: 'Jam 10-11',
        subject: 'Pendidikan Pancasila',
        teacher: 'Maria Ulfa, S.Pd',
        color: 'border-sky-400',
        startTime: '14:15',
        endTime: '15:25',
      },
    ],
  },
  {
    name: 'Jumat',
    subtitle: 'Hari Pendek',
    lessons: [
      {
        time: 'Jam 1-2',
        subject: 'Bahasa Indonesia',
        teacher: 'Chanifah Ulfah, S.Pd',
        color: 'border-blue-500',
        startTime: '07:45',
        endTime: '09:05',
      },
      {
        time: 'Jam 3-4',
        subject: 'Bahasa Inggris',
        teacher: 'Yuli Rahayu, S.Pd',
        color: 'border-orange-400',
        startTime: '09:25',
        endTime: '10:45',
      },
      {
        time: 'Jam 5-7',
        subject: 'PIPAS',
        teacher: 'Satria Nur Karim Amrullah, S.Pd',
        color: 'border-fuchsia-500',
        startTime: '10:45',
        endTime: '13:55',
      },
    ],
  },
];

export default function TimelineSchedule() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDay, setCurrentDay] = useState(0);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const today = new Date().getDay();
    if (today >= 1 && today <= 5) {
      setCurrentDay(today - 1);
    }

    return () => clearInterval(timer);
  }, []);

  const getCurrentTimeString = () => {
    return currentTime.toTimeString().slice(0, 5);
  };

  const isTimeInRange = (start: string, end: string) => {
    const current = getCurrentTimeString();
    return current >= start && current <= end;
  };

  const isTimePassed = (end: string) => {
    return getCurrentTimeString() > end;
  };

  const getCountdown = (endTime: string) => {
    const [hours, minutes] = endTime.split(':').map(Number);
    const now = currentTime;
    const end = new Date(now);
    end.setHours(hours, minutes, 0, 0);

    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return null;

    const totalMinutes = Math.floor(diff / 60000);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const secs = Math.floor((diff % 60000) / 1000);

    if (hrs > 0) {
      return `${hrs}j ${mins}m ${secs}d`;
    } else if (mins > 0) {
      return `${mins}m ${secs}d`;
    } else {
      return `${secs}d`;
    }
  };

  const handleViewChange = (checked: boolean) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setViewMode(checked ? 'grid' : 'timeline');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const todaySchedule = scheduleData[currentDay];
  const dayName = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'][currentDay];
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
  const dayWeekend = ['Sabtu', 'Minggu'][currentDay];
  const isGrid = viewMode === 'grid';

  const getCurrentSchedule = () => {
    if (dayName === 'Senin') return mondaySchedule;
    if (dayName === 'Jumat') return fridaySchedule;
    return timeSchedule;
  };

  const currentSchedule = getCurrentSchedule();

  const getClassPeriodsInRange = (startTime: string, endTime: string) => {
    const classPeriods = currentSchedule.filter(
      (slot) => slot.type === 'class' && slot.period.startsWith('Jam')
    );
    return classPeriods.filter((period) => period.start >= startTime && period.end <= endTime);
  };

  const formatClassPeriods = (periods: TimeSlot[]) => {
    if (periods.length === 0) return '';
    if (periods.length === 1) return periods[0].period;

    const firstNum = periods[0].period.replace('Jam ', '');
    const lastNum = periods[periods.length - 1].period.replace('Jam ', '');
    return `Jam ${firstNum}-${lastNum}`;
  };

  const getTimelineItems = () => {
    if (!todaySchedule) return [];

    const breaks = currentSchedule.filter((slot) => slot.type === 'break');
    const finalItems: Array<{
      type: 'lesson' | 'break';
      data: Lesson | TimeSlot;
      startTime: string;
      displayTime?: string;
    }> = [];

    todaySchedule.lessons.forEach((lesson) => {
      const overlappingBreaks = breaks.filter(
        (b) => b.start < lesson.endTime && b.end > lesson.startTime
      );

      if (overlappingBreaks.length === 0) {
        const periods = getClassPeriodsInRange(lesson.startTime, lesson.endTime);
        finalItems.push({
          type: 'lesson',
          data: lesson,
          startTime: lesson.startTime,
          displayTime: formatClassPeriods(periods),
        });
      } else {
        overlappingBreaks.sort((a, b) => a.start.localeCompare(b.start));

        let currentStart = lesson.startTime;

        overlappingBreaks.forEach((breakSlot) => {
          if (currentStart < breakSlot.start) {
            const periods = getClassPeriodsInRange(currentStart, breakSlot.start);
            finalItems.push({
              type: 'lesson',
              data: {
                ...lesson,
                startTime: currentStart,
                endTime: breakSlot.start,
              },
              startTime: currentStart,
              displayTime: formatClassPeriods(periods),
            });
          }

          finalItems.push({
            type: 'break',
            data: breakSlot,
            startTime: breakSlot.start,
          });

          currentStart = breakSlot.end;
        });

        if (currentStart < lesson.endTime) {
          const periods = getClassPeriodsInRange(currentStart, lesson.endTime);
          finalItems.push({
            type: 'lesson',
            data: {
              ...lesson,
              startTime: currentStart,
              endTime: lesson.endTime,
            },
            startTime: currentStart,
            displayTime: formatClassPeriods(periods),
          });
        }
      }
    });

    breaks.forEach((breakSlot) => {
      const isOverlapping = todaySchedule.lessons.some(
        (lesson) => breakSlot.start < lesson.endTime && breakSlot.end > lesson.startTime
      );

      if (!isOverlapping) {
        finalItems.push({
          type: 'break',
          data: breakSlot,
          startTime: breakSlot.start,
        });
      }
    });

    finalItems.sort((a, b) => a.startTime.localeCompare(b.startTime));

    return finalItems;
  };

  if (viewMode === 'grid') {
    return (
      <div className="font-outfit min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <div
          className={`mx-auto max-w-[1400px] px-4 py-8 transition-all duration-500 sm:px-6 lg:px-8 ${
            isTransitioning ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          {/* Schematic Header */}
          <header className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="h-20 w-2 rounded-full bg-linear-to-b from-blue-600 to-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                  Jadwal Pelajaran
                </h1>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-slate-600 md:text-base dark:text-slate-400">
                    Kelas X PPLG 1 - SMKN 1 Kandeman
                  </p>
                  <p className="text-sm font-medium text-slate-500 md:text-base dark:text-slate-500">
                    Semester Genap Tahun Ajaran 2025/2026
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
              {[
                { label: 'Timeline', icon: LayoutList, grid: false },
                { label: 'Semua Hari', icon: Grid3x3, grid: true },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleViewChange(item.grid)}
                  className={cn(
                    'group relative flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all duration-300 outline-none',
                    isGrid === item.grid
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  )}
                >
                  {isGrid === item.grid && (
                    <motion.div
                      layoutId="active-tab-grid"
                      className="absolute inset-0 rounded-xl bg-white shadow-sm dark:bg-slate-700"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <item.icon
                      className={cn(
                        'h-4 w-4 transition-transform group-hover:scale-110',
                        isGrid === item.grid
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-500 dark:text-slate-400'
                      )}
                    />
                    <span className="text-sm font-bold">{item.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </header>

          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: Users,
                label: 'Wali Kelas',
                value: 'Satria Nur Karim A, S.Pd',
                color: 'blue',
              },
              {
                icon: Clock,
                label: 'Jam Pelajaran',
                value: '07:00 - 15:30 WIB',
                color: 'indigo',
              },
              {
                icon: BookOpen,
                label: 'Total Pelajaran',
                value: '13 Mata Pelajaran',
                color: 'purple',
              },
            ].map((stat, i) => {
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
                purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
              };
              const colorClass =
                colorClasses[stat.color as keyof typeof colorClasses] || colorClasses.blue;

              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.15 }}
                  className="group flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-slate-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110',
                      colorClass
                        .split(' ')
                        .filter((c) => c.startsWith('bg-') || c.includes('/30'))
                        .join(' ')
                    )}
                  >
                    <stat.icon
                      className={cn(
                        'h-5 w-5',
                        colorClass
                          .split(' ')
                          .filter((c) => c.startsWith('text-') || c.startsWith('dark:text-'))
                          .join(' ')
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase dark:text-slate-400">
                      {stat.label}
                    </p>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Blueprint Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {scheduleData.map((day, dayIndex) => (
              <motion.div
                key={day.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                transition={{
                  delay: dayIndex * 0.05,
                  y: { duration: 0.15 },
                  opacity: { duration: 0.3 },
                }}
                className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition-all hover:border-blue-400 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-600"
              >
                {/* Day Header */}
                <div className="relative overflow-hidden rounded-xl bg-slate-100 p-4 text-white dark:bg-slate-950">
                  <div className="absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2 transform text-slate-800/20">
                    <Calendar className="h-24 w-24" />
                  </div>
                  <h3 className="relative z-10 text-xl font-bold tracking-widest text-slate-900 uppercase dark:text-slate-100">
                    {day.name}
                  </h3>
                  <p className="relative z-10 text-xs font-bold text-blue-400 uppercase">
                    {day.subtitle}
                  </p>
                </div>

                {/* Lessons List */}
                <div className="flex flex-1 flex-col gap-3 p-2">
                  {day.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className={cn(
                        'relative rounded-xl border-l-[3px] bg-slate-50 p-4 transition-all hover:bg-white hover:shadow-md dark:bg-slate-800/50 dark:hover:bg-slate-800',
                        lesson.color.replace('border-', 'border-')
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-tighter text-slate-500 uppercase dark:text-slate-400">
                          {lesson.time}
                        </span>
                        {lesson.room && (
                          <div className="flex items-center gap-1 rounded-sm bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold dark:bg-slate-700">
                            <MapPin className="h-2.5 w-2.5" />
                            {lesson.room}
                          </div>
                        )}
                      </div>
                      <h4 className="mb-1 text-sm leading-tight font-bold text-slate-900 dark:text-slate-100">
                        {lesson.subject}
                      </h4>
                      <p className="line-clamp-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        {lesson.teacher}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-outfit min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div
        className={`mx-auto max-w-4xl px-4 py-8 transition-all duration-500 sm:px-6 lg:px-8 ${
          isTransitioning ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Timeline Header */}
        <header className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="h-20 w-2 rounded-full bg-linear-to-b from-blue-600 to-indigo-600" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                Jadwal Hari Ini
              </h1>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-slate-600 md:text-base dark:text-slate-400">
                  Kelas X PPLG 1 - SMKN 1 Kandeman
                </p>
                <p className="text-sm font-medium text-slate-500 md:text-base dark:text-slate-500">
                  Semester Genap Tahun Ajaran 2025/2026
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
            {[
              { label: 'Hari Ini', icon: LayoutList, grid: false },
              { label: 'Grid', icon: Grid3x3, grid: true },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => handleViewChange(item.grid)}
                className={cn(
                  'group relative flex items-center gap-2 rounded-xl px-4 py-2 transition-all duration-300 outline-none',
                  isGrid === item.grid
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                )}
              >
                {isGrid === item.grid && (
                  <motion.div
                    layoutId="active-tab-timeline"
                    className="absolute inset-0 rounded-xl bg-white shadow-sm dark:bg-slate-700"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <item.icon
                    className={cn(
                      'h-4 w-4 transition-transform group-hover:scale-110',
                      isGrid === item.grid
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 dark:text-slate-400'
                    )}
                  />
                  <span className="text-sm font-bold">{item.label}</span>
                </span>
              </button>
            ))}
          </div>
        </header>

        <div className="mt-8 mb-8 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-bold tracking-wider uppercase">
              {isWeekend ? dayWeekend : dayName}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-bold whitespace-nowrap">
              {getCurrentTimeString()} WIB
            </span>
          </div>
          {!isWeekend && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
              <GraduationCap className="h-4 w-4" />
              <span className="text-sm font-bold tracking-wider uppercase">
                {todaySchedule?.lessons.length || 0} Mapel
              </span>
            </div>
          )}
        </div>

        {isWeekend ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-2xl dark:bg-slate-900">
            <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-3xl bg-linear-to-br from-green-400/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10">
              <Calendar className="h-16 w-16 text-emerald-500" />
            </div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight uppercase">Hari Libur</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Ngapain lihat jadwal pas hari libur? Pengen sekolah tah?
            </p>
          </div>
        ) : (
          <div className="relative space-y-4">
            {/* Title */}
            <div className="mb-8 flex items-center gap-3">
              <div className="h-10 w-2 rounded-full bg-linear-to-b from-blue-600 to-indigo-600"></div>
              <h2 className="text-2xl font-bold tracking-tight uppercase">
                {todaySchedule?.name} <span className="text-blue-600 opacity-50">/</span>{' '}
                <span className="text-slate-400 dark:text-slate-500">
                  {todaySchedule?.subtitle}
                </span>
              </h2>
            </div>

            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute top-4 bottom-4 left-6 w-1 bg-slate-200 md:left-8 dark:bg-slate-800"></div>

              <div className="space-y-8">
                {getTimelineItems().map((item, index) => {
                  if (item.type === 'break') {
                    const breakItem = item.data as TimeSlot;
                    const isActive = isTimeInRange(breakItem.start, breakItem.end);
                    const isPassed = isTimePassed(breakItem.end);

                    return (
                      <div key={`break-${index}`} className="relative pl-14 md:pl-20">
                        {/* Status Node */}
                        <div
                          className={cn(
                            'absolute top-2 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 transition-all md:left-4 md:h-10 md:w-10',
                            isPassed
                              ? 'border-emerald-100 bg-emerald-500 text-white dark:border-emerald-950'
                              : isActive
                                ? 'animate-pulse border-yellow-100 bg-yellow-400 text-white dark:border-yellow-950'
                                : 'border-slate-100 bg-slate-300 dark:border-slate-800 dark:bg-slate-800'
                          )}
                        >
                          {isPassed ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-white opacity-40" />
                          )}
                        </div>

                        <div
                          className={cn(
                            'group rounded-2xl border bg-white p-4 shadow-sm transition-all md:p-6 dark:bg-slate-900',
                            isActive
                              ? 'border-yellow-400 ring-4 ring-yellow-400/10 dark:border-yellow-900/50'
                              : 'border-slate-100 hover:border-slate-200 hover:shadow-md dark:border-slate-800 dark:hover:border-slate-700',
                            isPassed && 'opacity-40'
                          )}
                        >
                          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                                Istirahat
                              </div>
                              <div>
                                <div className="text-xs font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                                  {breakItem.start} - {breakItem.end}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                  {breakItem.period}
                                </h3>
                              </div>
                            </div>
                            {isActive && (
                              <div className="flex h-10 items-center gap-2 rounded-full bg-yellow-400 px-4 text-xs font-bold text-white">
                                <span className="h-2 w-2 animate-ping rounded-full bg-white"></span>
                                Aktif Sekarang
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  const lesson = item.data as Lesson;
                  const isActive = isTimeInRange(lesson.startTime, lesson.endTime);
                  const isPassed = isTimePassed(lesson.endTime);
                  const countdown = isActive ? getCountdown(lesson.endTime) : null;

                  return (
                    <div key={`lesson-${index}`} className="relative pl-14 md:pl-20">
                      {/* Status Node */}
                      <div
                        className={cn(
                          'absolute top-2 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 transition-all md:left-4 md:h-10 md:w-10',
                          isPassed
                            ? 'border-emerald-100 bg-emerald-500 text-white dark:border-emerald-950'
                            : isActive
                              ? `animate-pulse border-white ${lesson.color.replace('border-', 'bg-')} text-white dark:border-slate-900`
                              : 'border-slate-100 bg-slate-300 dark:border-slate-800 dark:bg-slate-800'
                        )}
                      >
                        {isPassed ? (
                          <Check className="h-5 w-5" />
                        ) : isActive ? (
                          <Clock className="h-5 w-5" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-white opacity-40" />
                        )}
                      </div>

                      <div
                        className={cn(
                          'group rounded-2xl border bg-white p-5 shadow-sm transition-all md:p-6 dark:bg-slate-900',
                          isActive
                            ? `scale-[1.02] ${lesson.color} shadow-xl ring-4 ${lesson.color.replace('border-', 'ring-')}/10`
                            : 'border-slate-100 hover:border-slate-200 hover:shadow-lg dark:border-slate-800 dark:hover:border-slate-700',
                          isPassed && 'opacity-40 grayscale-[0.5]'
                        )}
                      >
                        <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                          <div className="flex-1">
                            <div className="mb-1 text-xs font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                              {lesson.startTime} - {lesson.endTime}
                            </div>
                            <h3 className="mb-2 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                              {lesson.subject}
                            </h3>
                            <p className="flex items-center gap-2 font-bold text-slate-500 dark:text-slate-400">
                              <Users className="h-4 w-4" />
                              {lesson.teacher}
                            </p>
                          </div>

                          {countdown && (
                            <div className="shrink-0 rounded-2xl bg-linear-to-br from-red-500 to-rose-600 p-4 text-white shadow-lg shadow-red-500/20">
                              <div className="text-[10px] font-black tracking-widest uppercase opacity-80">
                                Berakhir Dalam
                              </div>
                              <div className="text-xl font-black tabular-nums">{countdown}</div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-[10px] font-black text-slate-600 uppercase dark:bg-slate-800 dark:text-slate-400">
                            {item.displayTime || lesson.time}
                          </div>
                          {lesson.room && (
                            <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-[10px] font-black text-indigo-600 uppercase dark:bg-indigo-900/30 dark:text-indigo-400">
                              <MapPin className="h-3.5 w-3.5" />
                              {lesson.room}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
