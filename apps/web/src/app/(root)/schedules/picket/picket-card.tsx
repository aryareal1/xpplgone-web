'use client';

import XiRplMascot from '@xirpl/shared/components/mascot';
import { Card, CardContent } from '@xirpl/shared/components/ui/card';
import { cn } from '@fe/lib/utils';
import { CalendarDays, Users2Icon } from 'lucide-react';
import type { PicketDay } from '../../../../../data/picket-schedule';

interface PicketCardProps {
  item: PicketDay;
}

export function PicketCard({ item }: PicketCardProps) {
  return (
    // Mascot hangs outside the card, so it can't live inside `overflow-hidden`.
    <div className="relative h-full">
      <XiRplMascot
        pose={item.pose}
        tool={item.tool}
        size={112}
        aria-hidden
        className="pointer-events-none absolute -top-11 -right-3 z-10 h-auto w-28"
      />

      <Card className="border-border bg-card duo-card h-full gap-0 overflow-hidden rounded-2xl p-0">
        <div className="border-border flex items-center justify-between gap-3 border-b-2 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-xl',
                item.lightColor,
              )}
            >
              <CalendarDays
                className={cn('size-5', item.iconColor)}
                aria-hidden
              />
            </div>
            <h3 className="text-foreground min-w-0 truncate text-lg font-black tracking-tight">
              {item.day}
            </h3>
          </div>
          <span
            className={cn(
              'text-muted-foreground flex shrink-0 items-center gap-1 text-xs font-bold',
              item.iconColor,
            )}
          >
            <Users2Icon className="size-4" aria-hidden />
            {item.members.length}
          </span>
        </div>

        <CardContent className="p-4">
          <ol
            className="space-y-2"
            aria-label={`Petugas piket hari ${item.day}`}
          >
            {item.members.map((member, memberIndex) => (
              <li
                key={member}
                className="bg-secondary/70 flex items-center gap-3 rounded-lg px-3 py-2.5"
              >
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-black tabular-nums',
                    item.lightColor,
                    item.iconColor,
                  )}
                  aria-hidden
                >
                  {memberIndex + 1}
                </span>
                <span className="text-foreground min-w-0 truncate text-sm font-semibold">
                  {member}
                </span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
