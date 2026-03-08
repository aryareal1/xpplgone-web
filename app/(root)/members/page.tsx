'use client';

import { useState } from 'react';
import { motion as m, AnimatePresence } from 'motion/react';
import { Users as UsersIcon, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { members } from '@/data/members';
import { HierarchyView } from './hierarchy-view';
import { MemberGridView, MemberStats } from './member-grid-view';
import SectionHeader from '@/components/section-header';

export default function MembersPage() {
  const [viewMode, setViewMode] = useState<'hierarchy' | 'grid'>('hierarchy');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleViewChange = (mode: 'hierarchy' | 'grid') => {
    setIsTransitioning(true);
    setTimeout(() => {
      setViewMode(mode);
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 pb-20 transition-colors duration-500 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header & Switcher */}
        <m.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mb-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"
        >
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <m.div
                key={viewMode}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <SectionHeader
                  color="bg-indigo-600"
                  title={viewMode === 'hierarchy' ? 'Struktur Kelas' : 'Anggota Kelas'}
                  desc={[
                    'X PPLG 1 - SMKN 1 Kandeman',
                    viewMode === 'hierarchy'
                      ? 'Struktur Organisasi Kelas X PPLG 1'
                      : 'Daftar Seluruh Siswa X PPLG 1',
                  ]}
                />
              </m.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {viewMode === 'grid' && (
                <m.div
                  key="stats"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <MemberStats />
                </m.div>
              )}
            </AnimatePresence>
          </div>

          {/* Switcher Tabs */}
          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
            {[
              { id: 'hierarchy', label: 'Struktur', icon: UsersIcon },
              { id: 'grid', label: 'Anggota', icon: LayoutGrid },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id as 'hierarchy' | 'grid')}
                className={cn(
                  'group relative flex items-center gap-2.5 rounded-xl px-6 py-3 transition-all duration-300 outline-none',
                  viewMode === item.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                )}
              >
                {viewMode === item.id && (
                  <m.div
                    layoutId="active-nav-tab"
                    className="absolute inset-0 rounded-xl bg-white shadow-sm dark:bg-slate-700"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  <item.icon
                    className={cn(
                      'h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110',
                      viewMode === item.id
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 dark:text-slate-400'
                    )}
                  />
                  <span className="text-sm font-bold tracking-tight">{item.label}</span>
                </span>
              </button>
            ))}
          </div>
        </m.header>

        {/* Content Area */}
        <div
          className={cn(
            'transition-all duration-500',
            isTransitioning ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          )}
        >
          <AnimatePresence mode="wait">
            {viewMode === 'hierarchy' ? (
              <m.div
                key="hierarchy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <HierarchyView />
              </m.div>
            ) : (
              <m.div
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <MemberGridView members={members} />
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
