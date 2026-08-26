'use client';

import { Check, Clock, MapPin, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@fe/lib/utils';
import type { Lesson, TimeSlot } from '../../../../../data/subject-schedule';

// Gaya "slab" dipakai bersama oleh ketiga item timeline.
const NODE =
  'absolute top-2 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 transition-all md:left-4 md:h-10 md:w-10';

const nodeState = (isPassed: boolean, isActive: boolean) =>
  isPassed
    ? 'border-pastel-green bg-emerald-500 text-white'
    : isActive
      ? 'border-pastel-yellow bg-brand-yellow text-brand-navy animate-pulse'
      : 'border-border bg-secondary text-muted-foreground';

const CARD = 'group border-border bg-card duo-card rounded-3xl p-5 md:p-6';

const cardState = (isPassed: boolean, isActive: boolean) =>
  cn(
    isActive && 'border-brand-blue bg-pastel-blue/40 dark:bg-blue-500/15',
    isPassed && 'opacity-50',
  );

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
      <div className={cn(NODE, nodeState(isPassed, isActive))}>
        {isPassed ? (
          <Check className="h-5 w-5" strokeWidth={3} />
        ) : isActive ? (
          <Clock className="h-5 w-5" strokeWidth={3} />
        ) : (
          <div className="bg-muted-foreground h-2 w-2 rounded-full opacity-60" />
        )}
      </div>

      <div className={cn(CARD, cardState(isPassed, isActive))}>
        <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="flex-1">
            <div className="text-muted-foreground mb-1 text-xs font-black tracking-widest uppercase">
              {lesson.startTime} - {lesson.endTime}
            </div>
            <h3 className="text-foreground mb-2 text-2xl font-black tracking-tight">
              {lesson.subject}
            </h3>
            <p className="text-muted-foreground flex items-center gap-2 font-bold">
              <Users className="h-4 w-4" />
              {lesson.teacher}
            </p>
          </div>

          {countdown && (
            <div className="bg-brand-yellow text-brand-navy duo-card shrink-0 rounded-2xl border-transparent p-4 [--duo-shade:#e0a800]">
              <div className="text-[10px] font-black tracking-widest uppercase opacity-80">
                Berakhir Dalam
              </div>
              <div className="text-xl font-black tabular-nums">{countdown}</div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-secondary text-muted-foreground border-border rounded-full border-2 px-3 py-1.5 text-[10px] font-black uppercase">
            {displayTime || lesson.time}
          </div>
          {lesson.room && (
            <div className="bg-pastel-blue text-brand-blue border-brand-blue/30 flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-[10px] font-black uppercase dark:bg-blue-500/20 dark:text-blue-200">
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
      <div className={cn(NODE, nodeState(isPassed, isActive))}>
        {isPassed ? (
          <Check className="h-5 w-5" strokeWidth={3} />
        ) : (
          <div className="bg-muted-foreground h-2 w-2 rounded-full opacity-60" />
        )}
      </div>

      <div
        className={cn(
          CARD,
          'bg-secondary p-4',
          isActive &&
            'border-brand-yellow bg-pastel-yellow dark:bg-amber-400/15',
          isPassed && 'opacity-50',
        )}
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="bg-pastel-green border-border flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
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
                <path
                  fill="none"
                  d="M6 16h4l-4 4h4M4 4h7l-7 8h7m3-3h6l-6 6h6"
                />
              </svg>
            </div>
            <div>
              <div className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                {breakItem.start} - {breakItem.end}
              </div>
              <h3 className="text-foreground text-lg font-extrabold">
                {breakItem.period}
              </h3>
            </div>
          </div>
          {isActive && (
            <div className="bg-brand-yellow text-brand-navy duo-card flex h-10 items-center gap-2 rounded-full border-transparent px-4 text-xs font-extrabold uppercase [--duo-depth:3px] [--duo-shade:#e0a800]">
              <span className="bg-brand-navy h-2 w-2 animate-ping rounded-full"></span>
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
      <div className={cn(NODE, nodeState(isPassed, isActive))}>
        {isPassed ? (
          <Check className="h-5 w-5" strokeWidth={3} />
        ) : isActive ? (
          <Clock className="h-5 w-5" strokeWidth={3} />
        ) : (
          <div className="bg-muted-foreground h-2 w-2 rounded-full opacity-60" />
        )}
      </div>

      <div className={cn(CARD, cardState(isPassed, isActive))}>
        <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="flex-1">
            <div className="text-muted-foreground mb-1 text-xs font-black tracking-widest uppercase">
              {eventItem.start} - {eventItem.end}
            </div>
            <h3 className="text-foreground mb-2 text-2xl font-black tracking-tight">
              {eventItem.period}
            </h3>
            <p className="text-muted-foreground flex items-center gap-2 font-bold">
              <Users className="h-4 w-4" />
              Guru Pengampu Jam Ke-1
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-secondary text-muted-foreground border-border rounded-full border-2 px-3 py-1.5 text-[10px] font-black uppercase">
            Jam 0
          </div>
        </div>
      </div>
    </motion.div>
  );
}
