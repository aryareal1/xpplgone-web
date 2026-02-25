'use client';

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}

export function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  };

  const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <motion.div
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
        <Icon
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
        <p className="text-xs font-bold text-slate-500 uppercase dark:text-slate-400">{label}</p>
        <p className="font-bold text-slate-900 dark:text-slate-100">{value}</p>
      </div>
    </motion.div>
  );
}
