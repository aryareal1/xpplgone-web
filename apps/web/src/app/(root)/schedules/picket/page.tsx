'use client';

import XiRplMascot from '@xirpl/shared/components/mascot';
import SectionHeader from '@fe/components/section-header';
import { cn } from '@fe/lib/utils';
import { MotionConfig, motion } from 'motion/react';

import { picketSchedule } from '../../../../../data/picket-schedule';
import { PicketCard } from './picket-card';

export default function PicketSchedule() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-background min-h-screen p-4 transition-colors duration-300 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mb-8 flex items-center justify-between gap-4"
          >
            <SectionHeader
              title="Jadwal Piket"
              desc={['Kelas XI RPL - SMKN 1 Kandeman']}
            />
          </motion.div>

          {/* pt-12 leaves room for the mascot hanging above each card. */}
          <div className="grid items-stretch gap-5 pt-12 sm:grid-cols-2 lg:grid-cols-6">
            {picketSchedule.map((item) => (
              <div
                key={item.day}
                className={cn(
                  'lg:col-span-2',
                  item.day === 'Kamis' && 'lg:col-start-2',
                  item.day === 'Jumat' && 'lg:col-start-4',
                )}
              >
                <PicketCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
