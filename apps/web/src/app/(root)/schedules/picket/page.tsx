'use client';

import SectionHeader from '@fe/components/section-header';
import { cn } from '@fe/lib/utils';
import { CalendarDays, Users2 } from 'lucide-react';
import { motion } from 'motion/react';

import { picketSchedule } from '../../../../../data/picket-schedule';
import { PicketCard } from './picket-card';

// Jumlah baris papan = hari dengan petugas terbanyak.
const SLOTS = Math.max(...picketSchedule.map((d) => d.members.length));
const ROWS = Array.from({ length: SLOTS }, (_, i) => i + 1);
const TOTAL = picketSchedule.reduce((n, d) => n + d.members.length, 0);

export default function PicketSchedule() {
  return (
    <div className="bg-background min-h-screen p-4 transition-colors duration-300 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"
        >
          <SectionHeader
            title="Jadwal Piket"
            desc={['Kelas XI RPL - SMKN 1 Kandeman']}
          />

          <div className="border-border bg-card duo-card flex items-center gap-4 rounded-2xl p-4">
            <div className="border-border bg-pastel-purple text-brand-navy flex size-11 items-center justify-center rounded-xl border-2 dark:bg-violet-500/20 dark:text-white">
              <Users2 className="size-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-extrabold tracking-wide uppercase">
                Total Petugas
              </p>
              <p className="text-foreground font-extrabold">{TOTAL} Siswa</p>
            </div>
          </div>
        </motion.div>

        {/* Papan piket: kolom = hari, baris = urutan petugas. */}
        <div className="border-border bg-card duo-card hidden overflow-hidden rounded-3xl md:block">
          <table className="w-full table-fixed border-collapse">
            <caption className="sr-only">
              Jadwal piket satu minggu, kolom hari dan baris urutan petugas
            </caption>
            <thead>
              <tr>
                <th className="border-border bg-secondary text-muted-foreground w-16 border-b-2 p-3 text-xs font-extrabold uppercase">
                  No
                </th>
                {picketSchedule.map((day) => (
                  <th
                    key={day.day}
                    scope="col"
                    className={cn(
                      'border-border text-foreground border-b-2 border-l-2 p-3 text-base font-extrabold tracking-wide uppercase',
                      day.lightColor,
                    )}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <CalendarDays
                        className={cn('size-4 shrink-0', day.iconColor)}
                      />
                      {day.day}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((no) => (
                <motion.tr
                  key={no}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: no * 0.04, duration: 0.3 }}
                >
                  <th
                    scope="row"
                    className={cn(
                      'border-border bg-secondary text-muted-foreground p-3 text-sm font-extrabold tabular-nums',
                      no < SLOTS && 'border-b-2',
                    )}
                  >
                    {no}
                  </th>
                  {picketSchedule.map((day) => {
                    const member = day.members[no - 1];
                    return (
                      <td
                        key={day.day}
                        className={cn(
                          'border-border border-l-2 p-3 text-center',
                          no < SLOTS && 'border-b-2',
                          member ? day.lightColor : 'bg-secondary/40',
                        )}
                      >
                        {member ? (
                          <span className="text-foreground text-sm font-bold">
                            {member}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm font-bold">
                            &mdash;
                            <span className="sr-only">Kosong</span>
                          </span>
                        )}
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: papan lima kolom terlalu sempit, jadi ditumpuk per hari. */}
        <div className="flex flex-col gap-5 md:hidden">
          {picketSchedule.map((item, index) => (
            <PicketCard key={item.day} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
