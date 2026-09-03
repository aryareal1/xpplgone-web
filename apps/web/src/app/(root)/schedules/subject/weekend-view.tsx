'use client';

import { motion } from 'motion/react';
import XiRplMascot from '@xirpl/shared/components/mascot';

export function WeekendView({ dayWeekend }: { dayWeekend: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="border-border bg-card duo-card flex flex-col items-center gap-4 rounded-3xl p-8 text-center sm:p-12"
    >
      <div className="w-full max-w-[280px]">
        <XiRplMascot size={320} pose="sleep" className="h-auto w-full" />
      </div>
      <h2 className="text-brand-navy text-3xl font-black tracking-tight uppercase dark:text-white">
        Happy {dayWeekend}!
      </h2>
      <p className="text-muted-foreground max-w-md text-lg font-bold">
        Ngapain lihat jadwal pas hari {dayWeekend || 'libur'}? Pengen sekolah
        tah?
      </p>
    </motion.div>
  );
}
