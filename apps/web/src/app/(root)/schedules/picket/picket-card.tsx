'use client';

import { CalendarDays, ShieldCheck, User2Icon } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@fe/components/ui/card';
import { cn } from '@fe/lib/utils';
import type { PicketDay } from '../../../../../data/picket-schedule';

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
      <Card className="group border-border bg-card duo-card relative h-full overflow-hidden rounded-3xl">
        {/* Background Decorative Element */}
        <div
          className={cn(
            'absolute top-0 right-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full opacity-20 transition-transform group-hover:scale-110',
            `bg-linear-to-br ${item.color}`,
          )}
        />

        <div className={cn('h-2.5 w-full bg-linear-to-r', item.color)} />

        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'border-border flex h-12 w-12 items-center justify-center rounded-2xl border-2',
                  item.lightColor,
                )}
              >
                <CalendarDays className={cn('h-6 w-6', item.iconColor)} />
              </div>
              <div>
                <h3 className="text-foreground text-2xl font-black tracking-tight">
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
                  whileHover={{ x: 8 }}
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 20 },
                  }}
                  className="bg-secondary border-border flex items-center gap-3 rounded-xl border-2 p-3"
                >
                  <div
                    className={cn(
                      'h-2.5 w-2.5 shrink-0 rounded-full bg-current',
                      item.iconColor,
                    )}
                  />
                  <span className="text-foreground text-sm font-bold">
                    {member}
                  </span>
                  <div className="ml-auto opacity-0 transition-opacity group-hover:opacity-100">
                    <User2Icon className="text-muted-foreground h-3.5 w-3.5" />
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
