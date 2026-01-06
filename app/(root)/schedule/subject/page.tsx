'use client';

import { useEffect, useState } from 'react';
import { Check, Clock, MapPin, Calendar, Grid3x3 } from 'lucide-react';

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
  { period: 'Senam/Literasi', start: '07:00', end: '07:45', type: 'class' },
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
        color: 'border-purple-500',
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
        color: 'border-sky-400',
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
  const [showModal, setShowModal] = useState(false);

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

  const todaySchedule = scheduleData[currentDay];
  const dayName = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'][currentDay];
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;

  const getCurrentSchedule = () => {
    if (dayName === 'Senin') return mondaySchedule;
    if (dayName === 'Jumat') return fridaySchedule;
    return timeSchedule;
  };

  const currentSchedule = getCurrentSchedule();

  const getTimelineItems = () => {
    if (!todaySchedule) return [];

    const breaks = currentSchedule.filter((slot) => slot.type === 'break');
    const finalItems: Array<{
      type: 'lesson' | 'break';
      data: Lesson | TimeSlot;
      startTime: string;
    }> = [];

    // Process each lesson and check for breaks
    todaySchedule.lessons.forEach((lesson) => {
      // Find breaks that overlap with this lesson
      const overlappingBreaks = breaks.filter(
        (b) => b.start < lesson.endTime && b.end > lesson.startTime
      );

      if (overlappingBreaks.length === 0) {
        // No overlapping breaks, add lesson as is
        finalItems.push({
          type: 'lesson',
          data: lesson,
          startTime: lesson.startTime,
        });
      } else {
        // Sort breaks by start time
        overlappingBreaks.sort((a, b) => a.start.localeCompare(b.start));

        let currentStart = lesson.startTime;

        overlappingBreaks.forEach((breakSlot) => {
          // Add lesson part before break (if exists)
          if (currentStart < breakSlot.start) {
            finalItems.push({
              type: 'lesson',
              data: {
                ...lesson,
                startTime: currentStart,
                endTime: breakSlot.start,
              },
              startTime: currentStart,
            });
          }

          // Add the break
          finalItems.push({
            type: 'break',
            data: breakSlot,
            startTime: breakSlot.start,
          });

          // Move current start to after this break
          currentStart = breakSlot.end;
        });

        // Add lesson part after last break (if exists)
        if (currentStart < lesson.endTime) {
          finalItems.push({
            type: 'lesson',
            data: {
              ...lesson,
              startTime: currentStart,
              endTime: lesson.endTime,
            },
            startTime: currentStart,
          });
        }
      }
    });

    // Add breaks that don't overlap with any lesson (standalone breaks)
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

    // Sort all items by start time
    finalItems.sort((a, b) => a.startTime.localeCompare(b.startTime));

    return finalItems;
  };

  if (viewMode === 'grid') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-900 dark:text-slate-100">
        <div className="mx-auto max-w-7xl px-5 py-5">
          {/* Header */}
          <header className="animate-in fade-in mb-5 rounded-xl bg-white p-6 shadow-lg duration-500 dark:bg-slate-800">
            <div className="grid grid-cols-1 items-end gap-5 md:grid-cols-5">
              <div className="md:col-span-3">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-20 w-2 rounded bg-gradient-to-b from-blue-600 to-indigo-600"></div>
                  <div>
                    <h1 className="text-2xl font-bold md:text-3xl">Jadwal Pelajaran</h1>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">
                      Kelas X PPLG 1 - SMKN 1 Kandeman
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Semester Gasal Tahun Ajaran 2025/2026
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                    <p className="text-sm text-slate-600 dark:text-slate-300">Wali Kelas</p>
                    <p className="font-semibold">Satria Nur Karim Amrullah, S.Pd</p>
                  </div>

                  <div className="rounded-lg bg-indigo-50 p-3 dark:bg-indigo-900/20">
                    <p className="text-sm text-slate-600 dark:text-slate-300">Jam Pelajaran</p>
                    <p className="font-semibold">07:00 - 15:30 WIB</p>
                  </div>

                  <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                    <p className="text-sm text-slate-600 dark:text-slate-300">Total Pelajaran</p>
                    <p className="font-semibold">13 Mata Pelajaran</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end md:col-span-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="rounded-lg bg-slate-200 px-6 py-3 text-slate-700 shadow-md transition-all hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">Timeline View</span>
                  </div>
                </button>
              </div>
            </div>
          </header>

          {/* Schedule Grid */}
          <div className="mt-5 grid h-[calc(100vh-280px)] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {scheduleData.map((day, dayIndex) => (
              <div key={day.name} className="flex flex-col gap-4">
                {/* Day Header */}
                <div className="rounded-xl bg-gradient-to-r from-gray-800 via-blue-800 to-blue-600 p-5 text-center text-white shadow-lg">
                  <h3 className="text-xl font-bold">{day.name}</h3>
                  <p className="mt-1 text-sm opacity-90">{day.subtitle}</p>
                </div>

                {/* Day Content */}
                <div className="scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-slate-100 dark:scrollbar-track-slate-700 flex-1 overflow-y-auto pr-1">
                  {day.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className={`mb-4 rounded-lg border-l-4 bg-white p-4 shadow-sm dark:bg-slate-800 ${lesson.color} transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
                      style={{ animationDelay: `${(dayIndex * 5 + lessonIndex) * 50}ms` }}
                    >
                      <div className="mb-2 inline-block rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-slate-600">
                        {lesson.time}
                      </div>
                      <div className="mb-1 text-sm leading-tight font-semibold">
                        {lesson.subject}
                      </div>
                      <div className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                        {lesson.teacher}
                      </div>
                      {lesson.room && (
                        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium dark:bg-slate-700">
                          <MapPin className="mr-1 h-4 w-4" />
                          <span>{lesson.room}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800">
              <h3 className="mb-4 text-xl font-bold">Ubah Tampilan</h3>
              <p className="mb-6 text-slate-600 dark:text-slate-300">
                Pilih tampilan yang Anda inginkan untuk melihat jadwal pelajaran.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setViewMode('timeline');
                    setShowModal(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl bg-slate-200 p-4 text-slate-700 transition-all hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                >
                  <Clock className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-semibold">Timeline View</div>
                    <div className="text-sm opacity-75">Lihat jadwal per hari dengan waktu</div>
                  </div>
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex w-full items-center gap-3 rounded-xl bg-blue-100 p-4 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                >
                  <Grid3x3 className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-semibold">Grid View (Aktif)</div>
                    <div className="text-sm opacity-75">Lihat semua jadwal dalam grid</div>
                  </div>
                </button>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 w-full rounded-xl border border-slate-300 p-3 transition-all hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <header className="mb-6 rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:bg-slate-800/80">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Jadwal Hari Ini
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                  Kelas X PPLG 1 - SMKN 1 Kandeman
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg bg-slate-200 px-6 py-3 text-slate-700 shadow-md transition-all hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              <div className="flex items-center gap-2">
                <Grid3x3 className="h-5 w-5" />
                <span className="font-medium">Grid View</span>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
              <div className="mb-2 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm opacity-90">Hari</span>
              </div>
              <div className="text-2xl font-bold">{isWeekend ? 'Libur' : dayName}</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 text-white">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm opacity-90">Waktu Sekarang</span>
              </div>
              <div className="text-2xl font-bold">{getCurrentTimeString()}</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white">
              <div className="mb-2 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm opacity-90">Total Pelajaran</span>
              </div>
              <div className="text-2xl font-bold">
                {isWeekend ? '0' : todaySchedule?.lessons.length || 0} Mapel
              </div>
            </div>
          </div>
        </header>

        {isWeekend ? (
          <div className="rounded-2xl bg-white/80 p-12 text-center shadow-xl backdrop-blur-sm dark:bg-slate-800/80">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500">
              <Calendar className="h-12 w-12 text-white" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Hari Libur</h2>
            <p className="text-slate-600 dark:text-slate-300">Selamat menikmati akhir pekan!</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:bg-slate-800/80">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>
              {todaySchedule?.name} - {todaySchedule?.subtitle}
            </h2>

            <div className="space-y-6">
              {getTimelineItems().map((item, index) => {
                if (item.type === 'break') {
                  const breakItem = item.data as TimeSlot;
                  const isActive = isTimeInRange(breakItem.start, breakItem.end);
                  const isPassed = isTimePassed(breakItem.end);

                  return (
                    <div key={`break-${index}`} className="relative pl-12">
                      {index < getTimelineItems().length - 1 && (
                        <div
                          className={`absolute top-12 bottom-0 left-5 w-0.5 ${
                            isPassed ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        ></div>
                      )}

                      <div
                        className={`absolute top-2 left-0 flex h-10 w-10 items-center justify-center rounded-full border-4 transition-all ${
                          isPassed
                            ? 'border-green-200 bg-green-500 dark:border-green-800'
                            : isActive
                              ? 'animate-pulse border-yellow-200 bg-yellow-400 dark:border-yellow-700'
                              : 'border-slate-100 bg-slate-200 dark:border-slate-800 dark:bg-slate-700'
                        }`}
                      >
                        {isPassed ? (
                          <Check className="h-5 w-5 text-white" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                        )}
                      </div>

                      <div
                        className={`rounded-xl p-4 transition-all ${
                          isActive
                            ? 'border-2 border-yellow-400 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/20'
                            : isPassed
                              ? 'bg-slate-50 opacity-75 dark:bg-slate-800/50'
                              : 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="mb-1 text-sm font-semibold text-slate-600 dark:text-slate-400">
                              {breakItem.start} - {breakItem.end}
                            </div>
                            <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                              {breakItem.period}
                            </h3>
                          </div>
                          {isActive && (
                            <span className="animate-pulse rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-white">
                              ISTIRAHAT
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Render lesson
                const lesson = item.data as Lesson;
                const isActive = isTimeInRange(lesson.startTime, lesson.endTime);
                const isPassed = isTimePassed(lesson.endTime);
                const countdown = isActive ? getCountdown(lesson.endTime) : null;

                return (
                  <div key={`lesson-${index}`} className="relative pl-12">
                    {index < getTimelineItems().length - 1 && (
                      <div
                        className={`absolute top-12 bottom-0 left-5 w-0.5 transition-colors duration-300 ${
                          isPassed
                            ? 'bg-green-500'
                            : 'bg-slate-300 group-hover:bg-indigo-400 dark:bg-slate-600 dark:group-hover:bg-indigo-500'
                        }`}
                      ></div>
                    )}

                    <div
                      className={`absolute top-2 left-0 flex h-10 w-10 items-center justify-center rounded-full border-4 transition-all ${
                        isPassed
                          ? 'border-green-200 bg-green-500 dark:border-green-800'
                          : isActive
                            ? `${lesson.color.replace('border-', 'bg-')} animate-pulse border-white dark:border-slate-800`
                            : 'border-slate-100 bg-slate-200 dark:border-slate-800 dark:bg-slate-700'
                      }`}
                    >
                      {isPassed ? (
                        <Check className="h-5 w-5 text-white" />
                      ) : isActive ? (
                        <Clock className="h-5 w-5 text-white" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                      )}
                    </div>

                    <div
                      className={`group rounded-xl border-l-4 p-5 transition-all duration-300 ${lesson.color} ${
                        isActive
                          ? `scale-105 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-xl dark:from-blue-900/20 dark:to-indigo-900/20`
                          : isPassed
                            ? 'bg-slate-50 opacity-75 dark:bg-slate-800/50'
                            : 'bg-white shadow-md hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800'
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <div className="mb-1 text-sm font-semibold text-slate-600 dark:text-slate-400">
                            {lesson.startTime} - {lesson.endTime}
                          </div>
                          <h3 className="mb-1 text-xl font-bold">{lesson.subject}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {lesson.teacher}
                          </p>
                        </div>
                        {countdown && (
                          <div className="rounded-full bg-red-500 px-4 py-2 text-center">
                            <div className="text-xs font-semibold text-white opacity-90">
                              Berakhir dalam
                            </div>
                            <div className="text-sm font-bold text-white">{countdown}</div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium dark:bg-slate-700">
                          {lesson.time}
                        </span>
                        {lesson.room && (
                          <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium dark:bg-slate-700">
                            <MapPin className="h-3 w-3" />
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
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800">
              <h3 className="mb-4 text-xl font-bold">Ubah Tampilan</h3>
              <p className="mb-6 text-slate-600 dark:text-slate-300">
                Pilih tampilan yang Anda inginkan untuk melihat jadwal pelajaran.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex w-full items-center gap-3 rounded-xl bg-blue-100 p-4 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                >
                  <Clock className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-semibold">Timeline View (Aktif)</div>
                    <div className="text-sm opacity-75">Lihat jadwal per hari dengan waktu</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setViewMode('grid');
                    setShowModal(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl bg-slate-200 p-4 text-slate-700 transition-all hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                >
                  <Grid3x3 className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-semibold">Grid View</div>
                    <div className="text-sm opacity-75">Lihat semua jadwal dalam grid</div>
                  </div>
                </button>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 w-full rounded-xl border border-slate-300 p-3 transition-all hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
