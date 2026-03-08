'use client';

import { useState } from 'react';
import { motion as m, Variants } from 'motion/react';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { Member, members } from '@/data/members';
import { Mars, Venus, Users } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
  active: (name: string) => ({
    opacity: 1,
    y: -10,
    transition: {
      duration: name === 'akmal' ? 0.8 : 0.3,
      ease: 'easeOut',
    },
  }),
};

const imageVariants: Variants = {
  hidden: { scale: 1 },
  visible: {
    scale: 1,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] },
  },
  active: {
    scale: 1.1,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] },
  },
};
interface MemberGridViewProps {
  members: Member[];
}

export function MemberStats() {
  const maleCount = members.filter((m) => m.gender === 'L').length;
  const femaleCount = members.filter((m) => m.gender === 'P').length;

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <m.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
      >
        <Mars className="h-4 w-4" />
        <span className="text-sm font-bold tracking-wider uppercase">{maleCount} Laki-laki</span>
      </m.div>
      <m.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 rounded-lg bg-pink-50 px-4 py-2 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400"
      >
        <Venus className="h-4 w-4" />
        <span className="text-sm font-bold tracking-wider uppercase">{femaleCount} Perempuan</span>
      </m.div>
      <m.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
      >
        <Users className="h-4 w-4" />
        <span className="text-sm font-bold tracking-wider uppercase">{members.length} Total</span>
      </m.div>
    </div>
  );
}

export function MemberGridView({ members }: MemberGridViewProps) {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      {members.map((member) => (
        <m.div
          key={member.id}
          custom={member.name.toLowerCase()}
          variants={cardVariants}
          whileHover="active"
          animate={activeId === member.id ? 'active' : 'visible'}
          onClick={() => setActiveId(activeId === member.id ? null : member.id)}
          data-active={activeId === member.id}
          className="group relative overflow-hidden rounded-2xl bg-white/50 p-2 shadow-sm ring-1 ring-slate-200/50 transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-500/10 data-[active=true]:bg-white data-[active=true]:shadow-xl data-[active=true]:shadow-indigo-500/10 dark:bg-slate-900/50 dark:ring-slate-800/50 dark:hover:bg-slate-900 dark:data-[active=true]:bg-slate-900"
        >
          <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-xl">
            <m.div variants={imageVariants} className="h-full w-full">
              <Image
                src={member.photo}
                alt={member.name}
                fill
                className={cn(
                  'object-cover transition-all duration-500 group-hover:blur-[2px] group-data-[active=true]:blur-[2px]',
                  !member.name.toLowerCase().includes('arya') && 'scale-125'
                )}
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-data-[active=true]:opacity-100" />

              {/* Top Vignette for Badge Visibility */}
              <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-data-[active=true]:opacity-100" />

              {/* Attendance Number Badge - Top Right Corner */}
              <div className="absolute top-3 right-3 translate-y-[-10px] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/30 bg-slate-900/40 text-xs font-black text-white shadow-xl backdrop-blur-md">
                  {String(member.id).padStart(2, '0')}
                </div>
              </div>

              <div className="absolute inset-0 flex translate-y-4 flex-col items-center justify-end p-4 text-center opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100">
                <div className="flex items-center gap-1.5">
                  <p className="font-outfit text-sm font-bold tracking-wider text-white uppercase">
                    {member.name}
                  </p>
                  {member.gender === 'L' ? (
                    <Mars className="h-4 w-4 text-blue-400" />
                  ) : (
                    <Venus className="h-4 w-4 text-pink-400" />
                  )}
                </div>
                <div className="mt-1 flex flex-col gap-0.5">
                  <p className="text-[10px] font-medium text-indigo-300">
                    Absen: {String(member.id).padStart(2, '0')} - NIS: {member.nis}
                  </p>
                  <p className="text-[10px] font-medium text-indigo-300">X PPLG 1 Member</p>
                </div>
              </div>
            </m.div>
          </AspectRatio>

          <div className="mt-3 px-1 transition-opacity duration-300 group-hover:opacity-0 group-data-[active=true]:opacity-0">
            <div className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-slate-100 text-[9px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {member.id}
              </span>
              <h3 className="font-outfit line-clamp-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                {member.name}
              </h3>
              {member.gender === 'L' ? (
                <Mars className="h-3 w-3 shrink-0 text-blue-500" />
              ) : (
                <Venus className="h-3 w-3 shrink-0 text-pink-500" />
              )}
            </div>
            <p className="font-outfit ml-5.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
              NIS: {member.nis}
            </p>
          </div>
        </m.div>
      ))}
    </m.div>
  );
}
