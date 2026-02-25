export interface TimeSlot {
  period: string;
  start: string;
  end: string;
  type?: 'class' | 'break' | 'event';
}

export interface Lesson {
  time: string;
  subject: string;
  teacher: string;
  room?: string;
  color: string;
  startTime: string;
  endTime: string;
}

export interface Day {
  name: string;
  subtitle: string;
  lessons: Lesson[];
}

// --- NORMAL SCHEDULE ---
export const mondaySchedule: TimeSlot[] = [
  { period: 'Jam 0/Apel/Upacara', start: '07:00', end: '07:40', type: 'event' },
  { period: 'Jam 1', start: '07:40', end: '08:20', type: 'class' },
  { period: 'Jam 2', start: '08:20', end: '09:00', type: 'class' },
  { period: 'Istirahat', start: '09:00', end: '09:30', type: 'break' },
  { period: 'Jam 3', start: '09:30', end: '10:10', type: 'class' },
  { period: 'Jam 4', start: '10:10', end: '10:50', type: 'class' },
  { period: 'Jam 5', start: '10:50', end: '11:30', type: 'class' },
  { period: 'Istirahat 2', start: '11:30', end: '12:30', type: 'break' },
  { period: 'Jam 6', start: '12:30', end: '13:05', type: 'class' },
  { period: 'Jam 7', start: '13:05', end: '13:40', type: 'class' },
  { period: 'Jam 8', start: '13:40', end: '14:15', type: 'class' },
  { period: 'Jam 9', start: '14:15', end: '14:50', type: 'class' },
  { period: 'Jam 10', start: '14:50', end: '15:25', type: 'class' },
  { period: 'Check', start: '15:25', end: '15:30', type: 'class' },
];

export const timeSchedule: TimeSlot[] = [
  { period: 'Jam 1', start: '07:00', end: '07:40', type: 'class' },
  { period: 'Jam 2', start: '07:40', end: '08:20', type: 'class' },
  { period: 'Jam 3', start: '08:20', end: '09:00', type: 'class' },
  { period: 'Istirahat', start: '09:00', end: '09:30', type: 'break' },
  { period: 'Jam 4', start: '09:30', end: '10:10', type: 'class' },
  { period: 'Jam 5', start: '10:10', end: '10:50', type: 'class' },
  { period: 'Jam 6', start: '10:50', end: '11:30', type: 'class' },
  { period: 'Istirahat 2', start: '11:30', end: '12:30', type: 'break' },
  { period: 'Jam 7', start: '12:30', end: '13:05', type: 'class' },
  { period: 'Jam 8', start: '13:05', end: '13:40', type: 'class' },
  { period: 'Jam 9', start: '13:40', end: '14:15', type: 'class' },
  { period: 'Jam 10', start: '14:15', end: '14:50', type: 'class' },
  { period: 'Jam 11', start: '14:50', end: '15:25', type: 'class' },
  { period: 'Check', start: '15:25', end: '15:30', type: 'class' },
];

export const fridaySchedule: TimeSlot[] = [
  { period: 'Jam 0/Kegiatan Jumat', start: '07:00', end: '07:45', type: 'event' },
  { period: 'Jam 1', start: '07:45', end: '08:25', type: 'class' },
  { period: 'Jam 2', start: '08:25', end: '09:05', type: 'class' },
  { period: 'Istirahat', start: '09:05', end: '09:25', type: 'break' },
  { period: 'Jam 3', start: '09:25', end: '10:05', type: 'class' },
  { period: 'Jam 4', start: '10:05', end: '10:45', type: 'class' },
  { period: 'Jam 5', start: '10:45', end: '11:15', type: 'class' },
  { period: 'Istirahat 2', start: '11:15', end: '12:30', type: 'break' },
  { period: 'Jam 6', start: '12:30', end: '13:15', type: 'class' },
  { period: 'Jam 7', start: '13:15', end: '13:55', type: 'class' },
  { period: 'Check', start: '13:55', end: '14:00', type: 'class' },
];

export const scheduleData: Day[] = [
  {
    name: 'Senin',
    subtitle: 'Hari Produktif',
    lessons: [
      {
        time: 'Jam 1-10',
        subject: 'RPL - Dasar PPLG',
        teacher: 'Mukti Widodo, S.T',
        room: 'RPL-GV',
        color: 'border-amber-500',
        startTime: '07:40',
        endTime: '15:25',
      },
    ],
  },
  {
    name: 'Selasa',
    subtitle: 'Hari Umum',
    lessons: [
      {
        time: 'Jam 1-2',
        subject: 'RPL - Dasar PPLG',
        teacher: 'Mukti Widodo, S.T',
        room: 'RPL-GV',
        color: 'border-amber-500',
        startTime: '07:00',
        endTime: '08:20',
      },
      {
        time: 'Jam 3-4',
        subject: 'Bahasa Inggris',
        teacher: 'Yuli Rahayu, S.Pd',
        color: 'border-orange-400',
        startTime: '08:20',
        endTime: '10:10',
      },
      {
        time: 'Jam 5-6',
        subject: 'Sejarah',
        teacher: 'Wahyu Dwi Yulianti, S.Pd',
        color: 'border-sky-400',
        startTime: '10:10',
        endTime: '11:30',
      },
      {
        time: 'Jam 7-8',
        subject: 'Matematika',
        teacher: 'Dwi Herni Noviyanti S.Pd',
        color: 'border-emerald-400',
        startTime: '12:30',
        endTime: '13:40',
      },
      {
        time: 'Jam 9-11',
        subject: 'PIPAS',
        teacher: 'Satria Nur Karim Amrullah, S.Pd',
        color: 'border-fuchsia-500',
        startTime: '13:40',
        endTime: '15:25',
      },
    ],
  },
  {
    name: 'Rabu',
    subtitle: 'Hari Umum',
    lessons: [
      {
        time: 'Jam 1-3',
        subject: 'PJOK',
        teacher: 'Drs. Budi Setiyadi',
        color: 'border-green-400',
        startTime: '07:00',
        endTime: '09:00',
      },
      {
        time: 'Jam 4-5',
        subject: 'Seni Budaya',
        teacher: 'Sigit Purnomo, S.Pd',
        color: 'border-indigo-400',
        startTime: '09:30',
        endTime: '10:50',
      },
      {
        time: 'Jam 6-7',
        subject: 'Bahasa Jawa',
        teacher: 'Rinta Dwi Jayanti, S.Pd',
        color: 'border-orange-500',
        startTime: '10:50',
        endTime: '13:05',
      },
      {
        time: 'Jam 8-9',
        subject: 'Bahasa Indonesia',
        teacher: 'Chanifah Ulfah, S.Pd',
        color: 'border-blue-500',
        startTime: '13:05',
        endTime: '14:15',
      },
      {
        time: 'Jam 10-11',
        subject: 'Koding dan Kecerdasan Artifisial',
        teacher: 'Riris Yuniaratri, S.Pd',
        color: 'border-blue-500',
        room: 'Lab Kom 3',
        startTime: '14:15',
        endTime: '15:25',
      },
    ],
  },
  {
    name: 'Kamis',
    subtitle: 'Hari Umum',
    lessons: [
      {
        time: 'Jam 1-3',
        subject: 'PABP',
        teacher: 'Laely Hilalliyah, S.Fil.I, M.Pd',
        color: 'border-pink-400',
        startTime: '07:00',
        endTime: '09:00',
      },
      {
        time: 'Jam 4-7',
        subject: 'Informatika',
        teacher: 'Riris Yuniaratri, S.Pd',
        color: 'border-blue-500',
        room: 'RPL-Lab RPL',
        startTime: '09:30',
        endTime: '13:05',
      },
      {
        time: 'Jam 8-9',
        subject: 'Matematika',
        teacher: 'Dwi Herni Noviyanti S.Pd',
        color: 'border-emerald-400',
        startTime: '13:05',
        endTime: '14:15',
      },
      {
        time: 'Jam 10-11',
        subject: 'Pendidikan Pancasila',
        teacher: 'Maria Ulfa, S.Pd',
        color: 'border-sky-400',
        startTime: '14:15',
        endTime: '15:25',
      },
    ],
  },
  {
    name: 'Jumat',
    subtitle: 'Hari Pendek',
    lessons: [
      {
        time: 'Jam 1-2',
        subject: 'Bahasa Indonesia',
        teacher: 'Chanifah Ulfah, S.Pd',
        color: 'border-blue-500',
        startTime: '07:45',
        endTime: '09:05',
      },
      {
        time: 'Jam 3-4',
        subject: 'Bahasa Inggris',
        teacher: 'Yuli Rahayu, S.Pd',
        color: 'border-orange-400',
        startTime: '09:25',
        endTime: '10:45',
      },
      {
        time: 'Jam 5-7',
        subject: 'PIPAS',
        teacher: 'Satria Nur Karim Amrullah, S.Pd',
        color: 'border-fuchsia-500',
        startTime: '10:45',
        endTime: '13:55',
      },
    ],
  },
];

// --- RAMADHAN SCHEDULE ---
export const nameRamadhanSchedule = '(Ramadhan)';

export const mondayRamadhanSchedule: TimeSlot[] = [
  { period: 'Jam 0/Religi', start: '07:30', end: '07:45', type: 'event' },
  { period: 'Jam 1', start: '07:45', end: '08:25', type: 'class' },
  { period: 'Jam 2', start: '08:25', end: '09:05', type: 'class' },
  { period: 'Istirahat', start: '09:05', end: '09:35', type: 'break' },
  { period: 'Jam 3', start: '09:35', end: '10:05', type: 'class' },
  { period: 'Jam 4', start: '10:05', end: '10:35', type: 'class' },
  { period: 'Jam 5', start: '10:35', end: '11:05', type: 'class' },
  { period: 'Jam 6', start: '11:05', end: '11:35', type: 'class' },
  { period: 'Istirahat 2', start: '11:35', end: '12:35', type: 'break' },
  { period: 'Jam 7', start: '12:35', end: '13:05', type: 'class' },
  { period: 'Jam 8', start: '13:05', end: '13:35', type: 'class' },
  { period: 'Jam 9', start: '13:35', end: '14:05', type: 'class' },
  { period: 'Jam 10', start: '14:05', end: '14:35', type: 'class' },
  { period: 'Kebersihan', start: '14:35', end: '14:45', type: 'class' },
];

export const timeRamadhanSchedule: TimeSlot[] = [
  { period: 'Jam 0/Religi', start: '07:30', end: '07:45', type: 'event' },
  { period: 'Jam 1', start: '07:45', end: '08:25', type: 'class' },
  { period: 'Jam 2', start: '08:25', end: '09:05', type: 'class' },
  { period: 'Istirahat', start: '09:05', end: '09:35', type: 'break' },
  { period: 'Jam 3', start: '09:35', end: '10:05', type: 'class' },
  { period: 'Jam 4', start: '10:05', end: '10:35', type: 'class' },
  { period: 'Jam 5', start: '10:35', end: '11:05', type: 'class' },
  { period: 'Jam 6', start: '11:05', end: '11:35', type: 'class' },
  { period: 'Istirahat 2', start: '11:35', end: '12:35', type: 'break' },
  { period: 'Jam 7', start: '12:35', end: '13:00', type: 'class' },
  { period: 'Jam 8', start: '13:00', end: '13:25', type: 'class' },
  { period: 'Jam 9', start: '13:25', end: '13:50', type: 'class' },
  { period: 'Jam 10', start: '13:50', end: '14:15', type: 'class' },
  { period: 'Jam 11', start: '14.15', end: '14:40', type: 'class' },
  { period: 'Kebersihan', start: '14:40', end: '14:45', type: 'class' },
];

export const fridayRamadhanSchedule: TimeSlot[] = [
  { period: 'Jam 0/Religi', start: '07:30', end: '07:45', type: 'event' },
  { period: 'Jam 1', start: '07:45', end: '08:25', type: 'class' },
  { period: 'Jam 2', start: '08:25', end: '09:05', type: 'class' },
  { period: 'Istirahat', start: '09:05', end: '09:35', type: 'break' },
  { period: 'Jam 3', start: '09:35', end: '10:15', type: 'class' },
  { period: 'Jam 4', start: '10:15', end: '10.55', type: 'class' },
  { period: 'Jam 5', start: '10.55', end: '11:30', type: 'class' },
  { period: 'Istirahat 2', start: '11:30', end: '12:35', type: 'break' },
  { period: 'Jam 6', start: '12:35', end: '13:15', type: 'class' },
  { period: 'Jam 7', start: '13:15', end: '13:55', type: 'class' },
  { period: 'Kebersihan', start: '13:55', end: '14:00', type: 'class' },
];

export const scheduleDataRamadhan: Day[] = [
  {
    name: 'Senin',
    subtitle: 'Hari Produktif (Ramadhan)',
    lessons: [
      {
        time: 'Jam 1-10',
        subject: 'RPL - Dasar PPLG',
        teacher: 'Mukti Widodo, S.T',
        room: 'RPL-GV',
        color: 'border-amber-500',
        startTime: '07:45',
        endTime: '14:35',
      },
    ],
  },
  {
    name: 'Selasa',
    subtitle: 'Hari Umum (Ramadhan)',
    lessons: [
      {
        time: 'Jam 1-2',
        subject: 'RPL - Dasar PPLG',
        teacher: 'Mukti Widodo, S.T',
        room: 'RPL-GV',
        color: 'border-amber-500',
        startTime: '07:45',
        endTime: '09:05',
      },
      {
        time: 'Jam 3-4',
        subject: 'Bahasa Inggris',
        teacher: 'Yuli Rahayu, S.Pd',
        color: 'border-orange-400',
        startTime: '09:35',
        endTime: '10:35',
      },
      {
        time: 'Jam 5-6',
        subject: 'Sejarah',
        teacher: 'Wahyu Dwi Yulianti, S.Pd',
        color: 'border-sky-400',
        startTime: '10:35',
        endTime: '11:35',
      },
      {
        time: 'Jam 7-8',
        subject: 'Matematika',
        teacher: 'Dwi Herni Noviyanti S.Pd',
        color: 'border-emerald-400',
        startTime: '12:35',
        endTime: '13:25',
      },
      {
        time: 'Jam 9-11',
        subject: 'PIPAS',
        teacher: 'Satria Nur Karim Amrullah, S.Pd',
        color: 'border-fuchsia-500',
        startTime: '13:25',
        endTime: '14:40',
      },
    ],
  },
  {
    name: 'Rabu',
    subtitle: 'Hari Umum (Ramadhan)',
    lessons: [
      {
        time: 'Jam 1-3',
        subject: 'PJOK',
        teacher: 'Drs. Budi Setiyadi',
        color: 'border-green-400',
        startTime: '07:45',
        endTime: '10:05',
      },
      {
        time: 'Jam 4-5',
        subject: 'Seni Budaya',
        teacher: 'Sigit Purnomo, S.Pd',
        color: 'border-indigo-400',
        startTime: '10:05',
        endTime: '11:05',
      },
      {
        time: 'Jam 6-7',
        subject: 'Bahasa Jawa',
        teacher: 'Rinta Dwi Jayanti, S.Pd',
        color: 'border-orange-500',
        startTime: '11:05',
        endTime: '13:00',
      },
      {
        time: 'Jam 8-9',
        subject: 'Bahasa Indonesia',
        teacher: 'Chanifah Ulfah, S.Pd',
        color: 'border-blue-500',
        startTime: '13:00',
        endTime: '13:50',
      },
      {
        time: 'Jam 10-11',
        subject: 'Koding dan Kecerdasan Artifisial',
        teacher: 'Riris Yuniaratri, S.Pd',
        color: 'border-blue-500',
        room: 'Lab Kom 3',
        startTime: '13:50',
        endTime: '14:40',
      },
    ],
  },
  {
    name: 'Kamis',
    subtitle: 'Hari Umum (Ramadhan)',
    lessons: [
      {
        time: 'Jam 1-3',
        subject: 'PABP',
        teacher: 'Laely Hilalliyah, S.Fil.I, M.Pd',
        color: 'border-pink-400',
        startTime: '07:45',
        endTime: '10:05',
      },
      {
        time: 'Jam 4-7',
        subject: 'Informatika',
        teacher: 'Riris Yuniaratri, S.Pd',
        color: 'border-blue-500',
        room: 'RPL-Lab RPL',
        startTime: '10:05',
        endTime: '13:00',
      },
      {
        time: 'Jam 8-9',
        subject: 'Matematika',
        teacher: 'Dwi Herni Noviyanti S.Pd',
        color: 'border-emerald-400',
        startTime: '13:00',
        endTime: '13:50',
      },
      {
        time: 'Jam 10-11',
        subject: 'Pendidikan Pancasila',
        teacher: 'Maria Ulfa, S.Pd',
        color: 'border-sky-400',
        startTime: '13:50',
        endTime: '14:40',
      },
    ],
  },
  {
    name: 'Jumat',
    subtitle: 'Hari Pendek (Ramadhan)',
    lessons: [
      {
        time: 'Jam 1-2',
        subject: 'Bahasa Indonesia',
        teacher: 'Chanifah Ulfah, S.Pd',
        color: 'border-blue-500',
        startTime: '07:45',
        endTime: '09:05',
      },
      {
        time: 'Jam 3-4',
        subject: 'Bahasa Inggris',
        teacher: 'Yuli Rahayu, S.Pd',
        color: 'border-orange-400',
        startTime: '09:35',
        endTime: '10:55',
      },
      {
        time: 'Jam 5-7',
        subject: 'PIPAS',
        teacher: 'Satria Nur Karim Amrullah, S.Pd',
        color: 'border-fuchsia-500',
        startTime: '10:55',
        endTime: '13:55',
      },
    ],
  },
];
