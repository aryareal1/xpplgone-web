'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Clock, Calendar, Grid3x3, LayoutList, GraduationCap, Users, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import {
  TimeSlot,
  Lesson,
  scheduleData,
  scheduleDataRamadhan,
  mondayRamadhanSchedule,
  fridayRamadhanSchedule,
  timeRamadhanSchedule,
  mondaySchedule,
  fridaySchedule,
  timeSchedule,
  nameRamadhanSchedule,
} from '@/data/subject-schedule';
import { StatCard } from './stat-card';
import { SubjectGridView } from './grid-view';
import { TimelineLessonItem, TimelineBreakItem, TimelineEventItem } from './timeline-items';
import { WeekendView } from './weekend-view';

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

  const getCurrentTimeString = useCallback(() => {
    return currentTime.toTimeString().slice(0, 5);
  }, [currentTime]);

  const isTimeInRange = useCallback(
    (start: string, end: string) => {
      const current = getCurrentTimeString();
      return current >= start && current <= end;
    },
    [getCurrentTimeString]
  );

  const isTimePassed = useCallback(
    (end: string) => {
      return getCurrentTimeString() > end;
    },
    [getCurrentTimeString]
  );

  const getCountdown = useCallback(
    (endTime: string) => {
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
    },
    [currentTime]
  );

  const handleViewChange = (checked: boolean) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setViewMode(checked ? 'grid' : 'timeline');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const today = currentTime.getDay();
  const isWeekend = today === 0 || today === 6;
  const todaySchedule = useMemo(() => scheduleDataRamadhan[currentDay], [currentDay]);
  const dayName = useMemo(
    () => ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'][currentDay],
    [currentDay]
  );
  const dayWeekend = useMemo(() => (today === 6 ? 'Sabtu' : 'Minggu'), [today]);
  const isGrid = viewMode === 'grid';

  const currentSchedule = useMemo(() => {
    if (dayName === 'Senin') return mondayRamadhanSchedule;
    if (dayName === 'Jumat') return fridayRamadhanSchedule;
    return timeRamadhanSchedule;
  }, [dayName]);

  const getClassPeriodsInRange = useCallback(
    (startTime: string, endTime: string) => {
      const classPeriods = currentSchedule.filter(
        (slot) => slot.type === 'class' && slot.period.startsWith('Jam')
      );
      return classPeriods.filter((period) => period.start >= startTime && period.end <= endTime);
    },
    [currentSchedule]
  );

  const formatClassPeriods = useCallback((periods: TimeSlot[]) => {
    if (periods.length === 0) return '';
    if (periods.length === 1) return periods[0].period;

    const firstNum = periods[0].period.replace('Jam ', '');
    const lastNum = periods[periods.length - 1].period.replace('Jam ', '');
    return `Jam ${firstNum}-${lastNum}`;
  }, []);

  const timelineItems = useMemo(() => {
    if (!todaySchedule) return [];

    const breaks = currentSchedule.filter((slot) => slot.type === 'break');
    const events = currentSchedule.filter((slot) => slot.type === 'event');
    const finalItems: Array<{
      type: 'lesson' | 'break' | 'event';
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

    events.forEach((eventSlot) => {
      finalItems.push({
        type: 'event',
        data: eventSlot,
        startTime: eventSlot.start,
      });
    });

    finalItems.sort((a, b) => a.startTime.localeCompare(b.startTime));

    return finalItems;
  }, [todaySchedule, currentSchedule, getClassPeriodsInRange, formatClassPeriods]);

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
                  Jadwal Pelajaran {nameRamadhanSchedule}
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
            <StatCard
              icon={Users}
              label="Wali Kelas"
              value="Satria Nur Karim A, S.Pd"
              color="blue"
            />
            <StatCard icon={Clock} label="Jam Pelajaran" value="07:30 - 14:45 WIB" color="indigo" />
            <StatCard
              icon={BookOpen}
              label="Total Pelajaran"
              value="13 Mata Pelajaran"
              color="purple"
            />
          </div>

          <SubjectGridView scheduleData={scheduleDataRamadhan} />
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
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"
        >
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
        </motion.header>

        <div className="mt-8 mb-8 flex flex-wrap gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
          >
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-bold tracking-wider uppercase">
              {isWeekend ? dayWeekend : dayName}
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
          >
            <Clock className="h-4 w-4" />
            <span className="text-sm font-bold whitespace-nowrap">
              {getCurrentTimeString()} WIB
            </span>
          </motion.div>
          {!isWeekend && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="text-sm font-bold tracking-wider uppercase">
                {todaySchedule?.lessons.length || 0} Mapel
              </span>
            </motion.div>
          )}
        </div>

        {isWeekend ? (
          <WeekendView dayWeekend={dayWeekend} />
        ) : (
          <div className="relative space-y-4">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-8 flex items-center gap-3"
            >
              <div className="h-10 w-2 rounded-full bg-linear-to-b from-blue-600 to-indigo-600"></div>
              <h2 className="text-2xl font-bold tracking-tight uppercase">{todaySchedule?.name}</h2>
            </motion.div>

            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute top-4 bottom-4 left-6 w-1 bg-slate-200 md:left-8 dark:bg-slate-800"></div>

              <div className="space-y-8">
                <AnimatePresence mode="popLayout">
                  {timelineItems.map((item, index) => {
                    if (item.type === 'break') {
                      const breakItem = item.data as TimeSlot;
                      return (
                        <TimelineBreakItem
                          key={`break-${index}`}
                          breakItem={breakItem}
                          index={index}
                          isActive={isTimeInRange(breakItem.start, breakItem.end)}
                          isPassed={isTimePassed(breakItem.end)}
                        />
                      );
                    }

                    if (item.type === 'event') {
                      const eventItem = item.data as TimeSlot;
                      return (
                        <TimelineEventItem
                          key={`event-${index}`}
                          eventItem={eventItem}
                          index={index}
                          isActive={isTimeInRange(eventItem.start, eventItem.end)}
                          isPassed={isTimePassed(eventItem.end)}
                        />
                      );
                    }

                    const lesson = item.data as Lesson;
                    const isActive = isTimeInRange(lesson.startTime, lesson.endTime);
                    return (
                      <TimelineLessonItem
                        key={`lesson-${index}`}
                        lesson={lesson}
                        index={index}
                        isActive={isActive}
                        isPassed={isTimePassed(lesson.endTime)}
                        countdown={isActive ? getCountdown(lesson.endTime) : null}
                        displayTime={item.displayTime}
                      />
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
