'use client';

import { cn } from '@fe/lib/utils';
import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import {
  type Day,
  TIMETABLE_PERIODS,
  timetableCells,
} from '../../../../../data/subject-schedule';

interface SubjectGridViewProps {
  scheduleData: Day[];
}

const PERIODS = Array.from({ length: TIMETABLE_PERIODS }, (_, i) => i + 1);

export function SubjectGridView({ scheduleData }: SubjectGridViewProps) {
  return (
    <>
      {/* Class-board-style timetable: rows = days, columns = periods. */}
      <div className="border-border bg-card duo-card hidden overflow-hidden rounded-3xl md:block">
        <table className="w-full table-fixed border-collapse">
          <caption className="sr-only">
            Jadwal pelajaran satu minggu, baris hari dan kolom jam pelajaran
          </caption>
          <thead>
            <tr>
              <th className="border-border bg-secondary text-muted-foreground w-24 border-b-2 p-3 text-xs font-extrabold tracking-widest uppercase">
                Hari
              </th>
              {PERIODS.map((p) => (
                <th
                  key={p}
                  scope="col"
                  className="border-border bg-secondary text-foreground border-b-2 border-l-2 p-3 text-base font-extrabold tabular-nums"
                >
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((day, dayIndex) => {
              // The last row doesn't need a bottom border; the card edge covers it.
              const rowLine =
                dayIndex < scheduleData.length - 1 && 'border-b-2';

              return (
                <motion.tr
                  key={day.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dayIndex * 0.06, duration: 0.35 }}
                >
                  <th
                    scope="row"
                    className={cn(
                      'border-border bg-pastel-blue text-brand-navy p-3 text-left text-lg font-extrabold tracking-wide uppercase dark:bg-blue-500/20 dark:text-white',
                      rowLine,
                    )}
                  >
                    {day.name}
                  </th>
                  {timetableCells(day.lessons).map((cell) =>
                    cell.lesson ? (
                      <td
                        key={cell.period}
                        colSpan={cell.span}
                        className={cn(
                          'border-border border-l-2 p-2 align-top',
                          cell.lesson.bg,
                          rowLine,
                        )}
                      >
                        <p className="text-center text-sm leading-tight font-extrabold text-black text-balance">
                          {cell.lesson.subject}
                        </p>
                        <p className="mt-1 text-center text-[11px] leading-tight font-bold text-black text-balance">
                          {cell.lesson.teacher}
                        </p>
                        {cell.lesson.room && (
                          <p className="mt-2 flex items-center gap-1 text-[10px] font-extrabold text-black uppercase">
                            <MapPin className="size-2.5 shrink-0" />
                            {cell.lesson.room}
                          </p>
                        )}
                      </td>
                    ) : (
                      <td
                        key={cell.period}
                        className={cn(
                          'border-border bg-secondary/40 border-l-2',
                          rowLine,
                        )}
                      />
                    ),
                  )}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: an 11-column table is unreadable, so stack it per day. */}
      <div className="flex flex-col gap-5 md:hidden">
        {scheduleData.map((day, dayIndex) => (
          <motion.section
            key={day.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIndex * 0.06, duration: 0.35 }}
            className="border-border bg-card duo-card flex flex-col gap-3 rounded-3xl p-3"
          >
            <div className="bg-pastel-blue border-border flex items-baseline justify-between rounded-2xl border-2 px-4 py-3 dark:bg-blue-500/15">
              <h3 className="text-brand-navy text-lg font-extrabold tracking-widest uppercase dark:text-white">
                {day.name}
              </h3>
              <p className="text-brand-blue text-[11px] font-extrabold uppercase dark:text-blue-200">
                {day.subtitle}
              </p>
            </div>

            {day.lessons.map((lesson) => (
              <div
                key={lesson.time}
                className={cn(
                  'border-border rounded-2xl border-l-[6px] p-4',
                  lesson.color,
                  lesson.bg,
                )}
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold text-black uppercase">
                    {lesson.time}
                  </span>
                  {lesson.room && (
                    <span className="border-border bg-card flex items-center gap-1 rounded-full border-2 px-2 py-0.5 text-[9px] font-extrabold uppercase">
                      <MapPin className="size-2.5" />
                      {lesson.room}
                    </span>
                  )}
                </div>
                <h4 className="text-base leading-tight font-extrabold text-black">
                  {lesson.subject}
                </h4>
                <p className="text-[11px] font-bold text-black">
                  {lesson.teacher}
                </p>
              </div>
            ))}
          </motion.section>
        ))}
      </div>
    </>
  );
}
