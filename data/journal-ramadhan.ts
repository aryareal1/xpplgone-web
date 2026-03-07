import { LucideIcon, BookOpen, MessageSquare, Moon, Sun, User, MapPin } from 'lucide-react';

export interface RamadanDay {
  hijriDay: number;
  date: string;
}

export const muCalendar: RamadanDay[] = [
  { hijriDay: 1, date: '2026-02-18' },
  { hijriDay: 2, date: '2026-02-19' },
  { hijriDay: 3, date: '2026-02-20' },
  { hijriDay: 4, date: '2026-02-21' },
  { hijriDay: 5, date: '2026-02-22' },
  { hijriDay: 6, date: '2026-02-23' },
  { hijriDay: 7, date: '2026-02-24' },
  { hijriDay: 8, date: '2026-02-25' },
  { hijriDay: 9, date: '2026-02-26' },
  { hijriDay: 10, date: '2026-02-27' },
  { hijriDay: 11, date: '2026-02-28' },
  { hijriDay: 12, date: '2026-03-01' },
  { hijriDay: 13, date: '2026-03-02' },
  { hijriDay: 14, date: '2026-03-03' },
  { hijriDay: 15, date: '2026-03-04' },
  { hijriDay: 16, date: '2026-03-05' },
  { hijriDay: 17, date: '2026-03-06' },
  { hijriDay: 18, date: '2026-03-07' },
  { hijriDay: 19, date: '2026-03-08' },
  { hijriDay: 20, date: '2026-03-09' },
  { hijriDay: 21, date: '2026-03-10' },
  { hijriDay: 22, date: '2026-03-11' },
  { hijriDay: 23, date: '2026-03-12' },
  { hijriDay: 24, date: '2026-03-13' },
  { hijriDay: 25, date: '2026-03-14' },
  { hijriDay: 26, date: '2026-03-15' },
  { hijriDay: 27, date: '2026-03-16' },
  { hijriDay: 28, date: '2026-03-17' },
  { hijriDay: 29, date: '2026-03-18' },
  { hijriDay: 30, date: '2026-03-19' },
];

export const nuCalendar: RamadanDay[] = [
  { hijriDay: 1, date: '2026-02-19' },
  { hijriDay: 2, date: '2026-02-20' },
  { hijriDay: 3, date: '2026-02-21' },
  { hijriDay: 4, date: '2026-02-22' },
  { hijriDay: 5, date: '2026-02-23' },
  { hijriDay: 6, date: '2026-02-24' },
  { hijriDay: 7, date: '2026-02-25' },
  { hijriDay: 8, date: '2026-02-26' },
  { hijriDay: 9, date: '2026-02-27' },
  { hijriDay: 10, date: '2026-02-28' },
  { hijriDay: 11, date: '2026-03-01' },
  { hijriDay: 12, date: '2026-03-02' },
  { hijriDay: 13, date: '2026-03-03' },
  { hijriDay: 14, date: '2026-03-04' },
  { hijriDay: 15, date: '2026-03-05' },
  { hijriDay: 16, date: '2026-03-06' },
  { hijriDay: 17, date: '2026-03-07' },
  { hijriDay: 18, date: '2026-03-08' },
  { hijriDay: 19, date: '2026-03-09' },
  { hijriDay: 20, date: '2026-03-10' },
  { hijriDay: 21, date: '2026-03-11' },
  { hijriDay: 22, date: '2026-03-12' },
  { hijriDay: 23, date: '2026-03-13' },
  { hijriDay: 24, date: '2026-03-14' },
  { hijriDay: 25, date: '2026-03-15' },
  { hijriDay: 26, date: '2026-03-16' },
  { hijriDay: 27, date: '2026-03-17' },
  { hijriDay: 28, date: '2026-03-18' },
  { hijriDay: 29, date: '2026-03-19' },
  { hijriDay: 30, date: '2026-03-20' },
];

export interface JournalSection {
  id: string;
  name: string;
}

export const physicalSpiritualJournal: JournalSection[] = [
  { id: 'subuh', name: 'Subuh' },
  { id: 'dhuhur', name: 'Dhuhur' },
  { id: 'ashar', name: 'Ashar' },
  { id: 'maghrib', name: 'Maghrib' },
  { id: 'isya', name: 'Isya' },
];

export const sunahJournal: JournalSection[] = [
  { id: 'dhuha', name: 'Dhuha' },
  { id: 'terawih', name: 'Terawih' },
  { id: 'witir', name: 'Witir' },
  { id: 'tahajud', name: 'Tahajud' },
  { id: 'iftitah', name: 'Iftitah' },
];

export interface Shalat5 {
  subuh: boolean;
  dhuhur: boolean;
  ashar: boolean;
  maghrib: boolean;
  isya: boolean;
}

export interface ShalatSunah {
  dhuha: boolean;
  terawih: boolean;
  witir: boolean;
  tahajud: boolean;
  iftitah: boolean;
}

export interface Jumat {
  khotib: string;
  tema: string;
  [key: string]: string;
}

export interface Tadarrus {
  tempat: string;
  juz: string;
  suratAyat: string;
  [key: string]: string;
}

export interface TarawihWitir {
  tempat: string;
  [key: string]: string;
}

export interface Ceramah {
  tempat: string;
  dai: string;
  materi: string;
  [key: string]: string;
}

export interface FormData {
  puasa: boolean;
  shalat5: Shalat5;
  shalatSunah: ShalatSunah;
  keterangan: string;
  jumat: Jumat;
  tadarrus: Tadarrus;
  tarawihWitir: TarawihWitir;
  ceramah: Ceramah;
}

export const INITIAL_FORM_DATA: FormData = {
  puasa: false,
  shalat5: {
    subuh: false,
    dhuhur: false,
    ashar: false,
    maghrib: false,
    isya: false,
  },
  shalatSunah: {
    dhuha: false,
    terawih: false,
    witir: false,
    tahajud: false,
    iftitah: false,
  },
  keterangan: '',
  jumat: {
    khotib: '',
    tema: '',
  },
  tadarrus: {
    tempat: '',
    juz: '',
    suratAyat: '',
  },
  tarawihWitir: {
    tempat: '',
  },
  ceramah: {
    tempat: '',
    dai: '',
    materi: '',
  },
};

export interface FormField {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  icon?: LucideIcon;
}

export interface ExtraSection {
  id: 'jumat' | 'tadarrus' | 'tarawihWitir' | 'ceramah';
  title: string;
  icon: LucideIcon;
  color: string;
  fields: FormField[];
  condition?: (gender: string | null, isFriday: boolean) => boolean;
}

export const EXTRA_SECTIONS: ExtraSection[] = [
  {
    id: 'jumat',
    title: "Jumat'an",
    icon: Sun,
    color: 'bg-blue-100 text-blue-600',
    condition: (gender, isFriday) => isFriday && gender === 'male',
    fields: [
      { id: 'khotib', label: 'Khotib / Imam', placeholder: 'Nama Khotib/Imam', icon: User },
      { id: 'tema', label: 'Tema Khutbah', placeholder: 'Materi yang disampaikan' },
    ],
  },
  {
    id: 'tadarrus',
    title: "Kegiatan Tadarrus Al Qur'an",
    icon: BookOpen,
    color: 'bg-emerald-100 text-emerald-600',
    fields: [
      { id: 'tempat', label: 'Tempat', placeholder: 'Lokasi tadarrus', icon: MapPin },
      { id: 'juz', label: 'Juz', placeholder: 'Contoh: 1', type: 'number' },
      { id: 'suratAyat', label: 'Surat - Ayat', placeholder: 'Al-Baqarah: 1-10' },
    ],
  },
  {
    id: 'tarawihWitir',
    title: 'Kegiatan Sholat Tarawih dan Witir',
    icon: Moon,
    color: 'bg-purple-100 text-purple-600',
    fields: [
      { id: 'tempat', label: 'Tempat', placeholder: 'Nama Masjid / Lokasi', icon: MapPin },
      { id: 'imam', label: 'Imam', placeholder: 'Nama Imam', icon: User },
    ],
  },
  {
    id: 'ceramah',
    title: 'Kegiatan Ceramah Agama / Kultum',
    icon: MessageSquare,
    color: 'bg-amber-100 text-amber-600',
    fields: [
      { id: 'tempat', label: 'Tempat', placeholder: 'Lokasi ceramah', icon: MapPin },
      { id: 'dai', label: "Da'i", placeholder: 'Nama Penceramah', icon: User },
      { id: 'materi', label: 'Materi', placeholder: 'Judul atau poin ceramah' },
    ],
  },
];
