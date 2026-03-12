'use client';

import { motion as m, Variants } from 'motion/react';
import Image from 'next/image';
import { members, classStructure } from '@/data/members';
import { cn } from '@/lib/utils';

// Variants for sequential entrance animation
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 20, stiffness: 100 },
  },
};

const lineVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

function getMember(name: string) {
  return members.find((m) => name.toLowerCase().includes(m.name.toLowerCase()));
}

interface NodeProps {
  role: string;
  name: string;
  className?: string;
}

function Node({ role, name, className }: NodeProps) {
  const member = getMember(name);
  const photo = member?.photo || '/images/profile_picture.jpg';

  return (
    <m.div
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.05, transition: { duration: 0.2 } }}
      className={cn(
        'group relative z-20 flex w-56 items-center gap-3 rounded-full border border-slate-200 bg-white p-1.5 pr-5 shadow-sm transition-colors duration-300 md:w-64 md:gap-4 md:pr-6 dark:border-slate-800 dark:bg-slate-900',
        className
      )}
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-slate-100 bg-slate-100 shadow-inner md:h-12 md:w-12 dark:border-slate-800 dark:bg-slate-900">
        <Image
          src={photo}
          alt={name}
          fill
          className={cn('object-cover', !name.toLowerCase().includes('arya') && 'scale-125')}
        />
      </div>
      <div className="min-w-0 text-left">
        <p className="truncate text-[9px] font-black tracking-widest text-blue-600 uppercase md:text-[10px] dark:text-blue-400">
          {role}
        </p>
        <p className="truncate text-xs font-bold text-slate-800 md:text-sm dark:text-white">
          {name}
        </p>
      </div>
    </m.div>
  );
}

function Line({
  orientation = 'v',
  size = 'h-10',
  className = '',
}: {
  orientation?: 'v' | 'h';
  size?: string;
  className?: string;
}) {
  return (
    <m.div
      variants={lineVariants}
      style={{ originX: 0.5, originY: 0 }}
      className={cn(
        'bg-blue-500',
        orientation === 'v' ? cn('w-1', size) : cn('h-1', size),
        className
      )}
    />
  );
}

export function HierarchyView() {
  const { top, wali, ketua, wakil, core, sections } = classStructure;

  return (
    <m.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="scrollbar-hide w-full overflow-x-auto pb-24"
    >
      <div className="font-outfit flex min-w-[1100px] flex-col items-center py-10 lg:min-w-0">
        {/* Level 1: BK & Kejuruan */}
        <div className="relative flex w-full max-w-3xl justify-between px-10">
          <Node role={top[0].role} name={top[0].name} />
          <Node role={top[1].role} name={top[1].name} />

          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            {/* Horizontal Bridge */}
            <m.div
              variants={lineVariants}
              className="absolute top-1/2 right-[calc(10%+128px)] left-[calc(10%+128px)] h-1 bg-blue-500"
            />
          </div>
        </div>

        {/* Connection from Top Row to Wali Kelas*/}
        <Line size="h-16" className="-mt-[27px]" />

        {/* Level 2-4: Wali, Ketua, Wakil (Vertical Chain) */}
        <div className="flex flex-col items-center">
          <Node role={wali.role} name={wali.name} />
          <Line size="h-12" className="-my-[2px]" />

          <Node role={ketua.role} name={ketua.name} />
          <Line size="h-12" className="-my-[2px]" />

          <Node role={wakil.role} name={wakil.name} />
          <Line size="h-16" className="-my-[2px]" />
        </div>

        {/* Level 5: Core Split (Sekretaris & Bendahara) */}
        <div className="relative flex w-full max-w-4xl flex-col items-center">
          {/* Main Horizontal Bridge for Split */}
          <m.div
            variants={lineVariants}
            className="absolute top-0 right-[25%] left-[25%] z-0 h-1 bg-blue-500"
          />

          <div className="flex w-full">
            {/* Left Wing: Sekretaris */}
            <div className="flex flex-1 flex-col items-center">
              <Line size="h-10" className="z-10 -mb-[2px]" />
              <div className="flex flex-col items-center">
                <Node role={core[0].members[0].role} name={core[0].members[0].name} />
                <Line size="h-10" className="-my-[2px]" />
                <Node role={core[0].members[1].role} name={core[0].members[1].name} />
              </div>
              <Line size="h-16" className="-my-[2px]" />
            </div>

            {/* Right Wing: Bendahara */}
            <div className="flex flex-1 flex-col items-center">
              <Line size="h-10" className="z-10 -mb-[2px]" />
              <div className="flex flex-col items-center">
                <Node role={core[1].members[0].role} name={core[1].members[0].name} />
                <Line size="h-10" className="-my-[2px]" />
                <Node role={core[1].members[1].role} name={core[1].members[1].name} />
              </div>
              <Line size="h-16" className="-my-[2px]" />
            </div>
          </div>

          {/* Junction Bridge for Sections */}
          <div className="relative h-1 w-full">
            <m.div
              variants={lineVariants}
              className="absolute top-0 right-[24.8%] left-[24.8%] h-1 bg-blue-500"
            />
            <m.div
              variants={lineVariants}
              className="absolute top-px left-1/2 h-18 w-1 -translate-x-1/2 bg-blue-500"
            />
          </div>
        </div>

        {/* Level 6: Sections Triple Split */}
        <div className="h-16" />
        <div className="relative w-full max-w-6xl">
          <m.div
            variants={lineVariants}
            className="absolute top-0 right-[16.66%] left-[16.66%] h-1 bg-blue-500"
          />

          <div className="flex w-full">
            {sections.map((section, i) => (
              <div key={i} className="flex flex-1 flex-col items-center">
                <Line size="h-12" className="z-10 -mb-[2px]" />
                <div className="flex flex-col items-center">
                  {section.members.map((name, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <Node
                        role={idx === 0 ? section.title : 'Anggota'}
                        name={name}
                        className="w-52 md:w-56"
                      />
                      {idx < section.members.length - 1 && (
                        <Line size="h-10" className="-my-[2px]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </m.div>
  );
}
