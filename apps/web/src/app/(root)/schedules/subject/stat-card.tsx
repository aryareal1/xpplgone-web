'use client';

import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@fe/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}

export function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    indigo:
      'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    purple:
      'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  };

  const colorClass =
    colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.15 }}
      className="group border-border bg-card duo-card flex items-center gap-4 rounded-2xl p-4"
    >
      <div
        className={cn(
          'border-border flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-transform group-hover:scale-110',
          colorClass
            .split('')
            .filter((c) => c.startsWith('bg-') || c.includes('/30'))
            .join(''),
        )}
      >
        <Icon
          className={cn(
            'h-5 w-5',
            colorClass
              .split('')
              .filter(
                (c) => c.startsWith('text-') || c.startsWith('dark:text-'),
              )
              .join(''),
          )}
        />
      </div>
      <div>
        <p className="text-muted-foreground text-xs font-extrabold tracking-wide uppercase">
          {label}
        </p>
        <p className="text-foreground font-extrabold">{value}</p>
      </div>
    </motion.div>
  );
}
