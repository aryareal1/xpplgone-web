'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Day } from '@/data/subject-schedule';

interface SubjectGridViewProps {
  scheduleData: Day[];
}

export function SubjectGridView({ scheduleData }: SubjectGridViewProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {scheduleData.map((day, dayIndex) => (
        <motion.div
          key={day.name}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{
            opacity: { delay: dayIndex * 0.05, duration: 0.4 },
            scale: { delay: dayIndex * 0.05, duration: 0.4 },
            y: { type: 'spring', stiffness: 300, damping: 20 },
          }}
          className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition-all hover:border-blue-400 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-600"
        >
          {/* Day Header */}
          <div className="relative overflow-hidden rounded-xl bg-slate-100 p-4 text-white dark:bg-slate-950">
            <div className="absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2 transform text-slate-200/50 dark:text-slate-800/20">
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
                  lesson.color
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase dark:text-slate-400">
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
  );
}
