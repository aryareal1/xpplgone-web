'use client';

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

interface Lesson {
  time: string;
  subject: string;
  teacher: string;
  room?: string;
  color: string;
}

interface Day {
  name: string;
  subtitle: string;
  lessons: Lesson[];
}

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
      },
      {
        time: 'Jam 3-4',
        subject: 'Sejarah',
        teacher: 'Wahyu Dwi Yulianti S.Pd',
        color: 'border-cyan-400',
      },
      {
        time: 'Jam 5-6',
        subject: 'Matematika',
        teacher: 'Dwi Herni Noviyanti S.Pd',
        color: 'border-emerald-400',
      },
      {
        time: 'Jam 7-8',
        subject: 'Seni Budaya',
        teacher: 'Sigit Purnomo, S.Pd',
        color: 'border-violet-400',
      },
      {
        time: 'Jam 9-11',
        subject: 'PIPAS',
        teacher: 'Satria Nur Karim Amrullah, S.Pd',
        color: 'border-fuchsia-500',
      },
    ],
  },
  {
    name: 'Rabu',
    subtitle: 'Hari Umum',
    lessons: [
      {
        time: 'Jam 1-3',
        subject: 'PABP',
        teacher: 'Laely Hilallijah, S.Fil.I, M.Pd',
        color: 'border-pink-400',
      },
      {
        time: 'Jam 4-5',
        subject: 'Matematika',
        teacher: 'Dwi Herni Noviyanti S.Pd',
        color: 'border-emerald-400',
      },
      {
        time: 'Jam 6-7',
        subject: 'Bimbingan Konseling',
        teacher: 'Yeni Sri Utami, S.Pd',
        color: 'border-yellow-400',
      },
      {
        time: 'Jam 8-9',
        subject: 'Bahasa Inggris',
        teacher: 'Yuli Rahayu, S.Pd',
        color: 'border-orange-400',
      },
      {
        time: 'Jam 10-11',
        subject: 'Bahasa Indonesia',
        teacher: 'Chanifah Ulfah, S.Pd',
        color: 'border-blue-500',
      },
    ],
  },
  {
    name: 'Kamis',
    subtitle: 'Hari Umum',
    lessons: [
      {
        time: 'Jam 1-4',
        subject: 'Informatika',
        teacher: 'Riris Yuniaratri, S.Pd',
        room: 'Lab RPL',
        color: 'border-sky-400',
      },
      {
        time: 'Jam 5-6',
        subject: 'Bahasa Jawa',
        teacher: 'Rinta Dwi Jayanti, S.Pd',
        color: 'border-orange-400',
      },
      {
        time: 'Jam 7-8',
        subject: 'Bahasa Indonesia',
        teacher: 'Chanifah Ulfah, S.Pd',
        color: 'border-blue-500',
      },
      {
        time: 'Jam 9-11',
        subject: 'PJOK',
        teacher: 'Drs. Budi Setiyadi',
        color: 'border-green-400',
      },
    ],
  },
  {
    name: 'Jumat',
    subtitle: 'Hari Pendek',
    lessons: [
      {
        time: 'Jam 1-2',
        subject: 'Pendidikan Pancasila',
        teacher: 'Maria Ulfa, S.Pd',
        color: 'border-sky-300',
      },
      {
        time: 'Jam 3-4',
        subject: 'Bahasa Inggris',
        teacher: 'Yuli Rahayu, S.Pd',
        color: 'border-orange-400',
      },
      {
        time: 'Jam 5-7',
        subject: 'PIPAS',
        teacher: 'Satria Nur Karim Amrullah, S.Pd',
        color: 'border-fuchsia-500',
      },
    ],
  },
];

export default function SchedulePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

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

            <div className="hidden md:col-span-2 md:block">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-center text-white">
                <div className="text-3xl font-bold">X PPLG 1</div>
                <div className="mt-2 text-xs opacity-90">Pengembangan Perangkat Lunak dan Gim</div>
              </div>
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
                    <div className="mb-1 text-sm leading-tight font-semibold">{lesson.subject}</div>
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
    </div>
  );
}
