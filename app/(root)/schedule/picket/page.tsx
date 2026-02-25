'use client';

import { useEffect, useState } from 'react';
import SectionHeader from '@/components/section-header';
import { motion, AnimatePresence } from 'motion/react';

import { picketSchedule } from '@/data/picket-schedule';
import { PicketCard } from './picket-card';

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
            {picketSchedule.map((item, index) => (
              <PicketCard key={item.day} item={item} index={index} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
