import type { MascotPose, MascotTool } from '@fe/components/mascot/Mascot';

export interface PicketDay {
  day: string;
  members: string[];
  color: string;
  lightColor: string;
  borderColor: string;
  iconColor: string;
  /** Mascot on the card: a different mood and tool per day. */
  pose: MascotPose;
  tool: MascotTool;
}

export const picketSchedule: PicketDay[] = [
  {
    day: 'Senin',
    members: [
      'Fatimah',
      'Akmal',
      'Talita',
      'Aulia',
      'Nafa',
      'Rizka',
      'Fadhil',
      'Viko',
    ],
    color: 'from-blue-600 to-indigo-700',
    lightColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400',
    pose: 'cheer',
    tool: 'broom',
  },
  {
    day: 'Selasa',
    members: ['Bambang', 'Dila', 'Syifa', 'Iqbal', 'Dwi', 'Intan', 'Gading'],
    color: 'from-emerald-600 to-teal-700',
    lightColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-900',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    pose: 'happy',
    tool: 'mop',
  },
  {
    day: 'Rabu',
    members: ['Leny', 'Roichan', 'Bunga', 'Noval', 'Tyas', 'Arya', 'Nadia'],
    color: 'from-amber-500 to-orange-600',
    lightColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-900',
    iconColor: 'text-amber-600 dark:text-amber-400',
    pose: 'cozy',
    tool: 'bucket',
  },
  {
    day: 'Kamis',
    members: ['Nanda', 'Khansa', 'Ani', 'Salwa', 'Fajri', 'Nikmah', 'Tivano'],
    color: 'from-indigo-600 to-violet-700',
    lightColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    borderColor: 'border-indigo-200 dark:border-indigo-900',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    pose: 'search',
    tool: 'duster',
  },
  {
    day: 'Jumat',
    members: ['Adit', 'Fayakun', 'Sakha', 'Natasya', 'Yunita', 'Vina', 'Raya'],
    color: 'from-rose-600 to-pink-700',
    lightColor: 'bg-rose-50 dark:bg-rose-950/30',
    borderColor: 'border-rose-200 dark:border-rose-900',
    iconColor: 'text-rose-600 dark:text-rose-400',
    pose: 'cheer',
    tool: 'dustpan',
  },
];
