'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';

export function WeekendView({ dayWeekend }: { dayWeekend: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="rounded-3xl bg-white p-12 text-center shadow-2xl dark:bg-slate-900"
    >
      <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-3xl bg-linear-to-br from-green-400/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10">
        <Calendar className="h-16 w-16 text-emerald-500" />
      </div>
      <h2 className="mb-2 text-3xl font-bold tracking-tight uppercase">Happy {dayWeekend}!</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400">
        Ngapain lihat jadwal pas hari {dayWeekend || 'libur'}? Pengen sekolah tah?
      </p>
    </motion.div>
  );
}
