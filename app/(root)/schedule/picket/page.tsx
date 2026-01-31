'use client';

import { useEffect, useState } from 'react';
import SectionHeader from '@/components/section-header';
import { Card, CardContent } from '@/components/ui/card';
import { User2Icon, Sparkles, CalendarDays, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const picketSchedule = [
  {
    day: 'Senin',
    members: ['Dila', 'Intan', 'Fadhil', 'Vina', 'Syifa', 'Khansa', 'Roichan', 'Auliya'],
    color: 'from-blue-600 to-indigo-700',
    lightColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    day: 'Selasa',
    members: ['Talita', 'Dwi', 'Rizka', 'Dita', 'Viko', 'Raya', 'Nafa'],
    color: 'from-emerald-600 to-teal-700',
    lightColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-900',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    day: 'Rabu',
    members: ['Fayakun', 'Nikma', 'Iqbal', 'Fatimah', 'Gading', 'Noval', 'Vano'],
    color: 'from-amber-500 to-orange-600',
    lightColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-900',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    day: 'Kamis',
    members: ['Bambang', 'Salwa', 'Arya', 'Nadia', 'Natasya', 'Yunita', 'Leny'],
    color: 'from-indigo-600 to-violet-700',
    lightColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    borderColor: 'border-indigo-200 dark:border-indigo-900',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    day: 'Jumat',
    members: ['Bunga', 'Akmal', 'Tyas', 'Adit', 'Siti', 'Fajri', 'Nanda'],
    color: 'from-rose-600 to-pink-700',
    lightColor: 'bg-rose-50 dark:bg-rose-950/30',
    borderColor: 'border-rose-200 dark:border-rose-900',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
];

export default function PicketSchedule() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="font-outfit min-h-screen bg-slate-50 p-4 transition-colors duration-300 sm:p-6 lg:p-8 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <SectionHeader
            title="Jadwal Piket"
            desc={['Kelas X PPLG 1 - SMKN 1 Kandeman']}
            color="h-16 w-2 bg-linear-to-b from-blue-600 to-indigo-600"
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {picketSchedule.map((item, index) => {
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
                          {item.members.map((member, mIdx) => (
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
                              <div
                                className={cn(
                                  'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold shadow-sm',
                                  'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                                )}
                              >
                                {mIdx + 1}
                              </div>
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
            })}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <Sparkles className="h-6 w-6 text-slate-400" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Quotes</h4>
            <p className="mx-auto max-w-md text-sm text-slate-500 dark:text-slate-400">
              &quot;Minimal piket rasah kakean alasan, piket we gur seminggu sekali o tok&quot;
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
