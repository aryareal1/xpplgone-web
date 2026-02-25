'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Check, Clock, Users, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Lesson, TimeSlot } from '@/data/subject-schedule';

interface TimelineLessonItemProps {
  lesson: Lesson;
  index: number;
  isActive: boolean;
  isPassed: boolean;
  countdown: string | null;
  displayTime: string | undefined;
}

export function TimelineLessonItem({
  lesson,
  index,
  isActive,
  isPassed,
  countdown,
  displayTime,
}: TimelineLessonItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{
        opacity: { delay: 0.4 + index * 0.1, duration: 0.4 },
        scale: { delay: 0.4 + index * 0.1, duration: 0.4 },
        y: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      className="relative pl-14 md:pl-20"
    >
      {/* Status Node */}
      <div
        className={cn(
          'absolute top-2 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 transition-all md:left-4 md:h-10 md:w-10',
          isPassed
            ? 'border-emerald-100 bg-emerald-500 text-white dark:border-emerald-950'
            : isActive
              ? 'animate-pulse border-white bg-yellow-400 text-white dark:border-slate-900'
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
            {displayTime || lesson.time}
          </div>
          {lesson.room && (
            <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-[10px] font-black text-indigo-600 uppercase dark:bg-indigo-900/30 dark:text-indigo-400">
              <MapPin className="h-3.5 w-3.5" />
              {lesson.room}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface TimelineBreakItemProps {
  breakItem: TimeSlot;
  index: number;
  isActive: boolean;
  isPassed: boolean;
}

export function TimelineBreakItem({
  breakItem,
  index,
  isActive,
  isPassed,
}: TimelineBreakItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{
        opacity: { delay: 0.4 + index * 0.1, duration: 0.4 },
        scale: { delay: 0.4 + index * 0.1, duration: 0.4 },
        y: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      className="relative pl-14 md:pl-20"
    >
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
          'group rounded-2xl border bg-slate-100 p-4 shadow-sm transition-all md:p-6 dark:bg-slate-900',
          isActive
            ? 'border-yellow-400 ring-4 ring-yellow-400/10 dark:border-yellow-900/50'
            : 'border-slate-100 hover:border-slate-200 hover:shadow-md dark:border-slate-800 dark:hover:border-slate-700',
          isPassed && 'opacity-40'
        )}
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="19"
                height="19"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.9 }}
                className="h-5 w-5"
              >
                <path fill="none" d="M6 16h4l-4 4h4M4 4h7l-7 8h7m3-3h6l-6 6h6" />
              </svg>
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
              Saatnya Istirahat
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function TimelineEventItem({
  eventItem,
  index,
  isActive,
  isPassed,
}: {
  eventItem: TimeSlot;
  index: number;
  isActive: boolean;
  isPassed: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{
        opacity: { delay: 0.4 + index * 0.1, duration: 0.4 },
        scale: { delay: 0.4 + index * 0.1, duration: 0.4 },
        y: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      className="relative pl-14 md:pl-20"
    >
      {/* Status Node */}
      <div
        className={cn(
          'absolute top-2 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 transition-all md:left-4 md:h-10 md:w-10',
          isPassed
            ? 'border-emerald-100 bg-emerald-500 text-white dark:border-emerald-950'
            : isActive
              ? 'animate-pulse border-white bg-yellow-400 text-white dark:border-slate-900'
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
            ? `scale-[1.02] border-blue-500 shadow-xl ring-4 ring-blue-500/10`
            : 'border-slate-100 hover:border-slate-200 hover:shadow-lg dark:border-slate-800 dark:hover:border-slate-700',
          isPassed && 'opacity-40 grayscale-[0.5]'
        )}
      >
        <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="flex-1">
            <div className="mb-1 text-xs font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
              {eventItem.start} - {eventItem.end}
            </div>
            <h3 className="mb-2 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {eventItem.period}
            </h3>
            <p className="flex items-center gap-2 font-bold text-slate-500 dark:text-slate-400">
              <Users className="h-4 w-4" />
              Guru Pengampu Jam Ke-1
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-[10px] font-black text-slate-600 uppercase dark:bg-slate-800 dark:text-slate-400">
            Jam 0
          </div>
        </div>
      </div>
    </motion.div>
  );
}
