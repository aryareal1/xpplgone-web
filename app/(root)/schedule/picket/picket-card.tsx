'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, CalendarDays, User2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { PicketDay } from '@/data/picket-schedule';

interface PicketCardProps {
  item: PicketDay;
  index: number;
}

export function PicketCard({ item, index }: PicketCardProps) {
  return (
    <motion.div
      key={item.day}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{
        opacity: { delay: index * 0.1, duration: 0.4 },
        scale: { delay: index * 0.1, duration: 0.4 },
        y: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      className="group relative"
    >
      <Card
        className={cn(
          'group relative h-full overflow-hidden border-2 border-slate-200 transition-all duration-300 hover:border-slate-300/50 dark:border-slate-800 dark:hover:border-slate-700/50',
          'bg-white dark:bg-slate-900'
        )}
      >
        {/* Background Decorative Element */}
        <div
          className={cn(
            'absolute top-0 right-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full opacity-10 transition-transform group-hover:scale-110',
            `bg-linear-to-br ${item.color}`
          )}
        />

        <div className={cn('h-1.5 w-full bg-linear-to-r', item.color)} />

        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-xl shadow-inner',
                  item.lightColor
                )}
              >
                <CalendarDays className={cn('h-6 w-6', item.iconColor)} />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                  {item.day.toUpperCase()}
                </h3>
              </div>
            </div>
            <ShieldCheck className={cn('h-6 w-6 opacity-20', item.iconColor)} />
          </div>

          <CardContent className="p-0">
            <div className="grid grid-cols-1 gap-2.5">
              {item.members.map((member) => (
                <motion.div
                  key={member}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 8, scale: 1.02 }}
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 20 },
                    scale: { duration: 0.15 },
                  }}
                  className={cn(
                    'flex items-center gap-3 rounded-xl p-3 transition-all',
                    'bg-slate-50/50 ring-1 ring-slate-200/50 dark:bg-slate-800/40 dark:ring-slate-700/30',
                    'hover:bg-white hover:shadow-md hover:ring-slate-300 dark:hover:bg-slate-800 dark:hover:ring-slate-600'
                  )}
                >
                  <div className={cn('h-2 w-2 shrink-0 rounded-full bg-current', item.iconColor)} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {member}
                  </span>
                  <div className="ml-auto opacity-0 transition-opacity group-hover:opacity-100">
                    <User2Icon className="h-3.5 w-3.5 text-slate-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
