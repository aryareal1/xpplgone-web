/**
 * Visual QA harness: render the recap from synthetic-but-realistic data, no DB.
 *
 *   bun src/modules/journal/pdf/preview.ts [YYYY-MM] [out.pdf]
 */
import type { MonthlyJournalRecap } from '../service';
import { renderJournalRecap } from './journal-recap';

const month = process.argv[2] ?? '2026-08';
const out = process.argv[3] ?? '/tmp/opencode/recap.pdf';

const NAMES = [
  'Akmal Ridho Maulana',
  'Arya Dwiputra',
  'Bagas Nurcahyo',
  'Citra Ayu Lestari',
  'Dimas Prasetyo',
  'Elang Samudra',
  'Fajar Nugroho',
  'Gilang Ramadhan',
  'Hanif Kurniawan',
  'Indah Permatasari',
  'Joko Susilo',
  'Kiran Maheswari',
  'Lutfi Hakim',
  'Maya Anggraini',
  'Naufal Aditya',
  'Okta Wijaya',
  'Putri Rahmawati',
  'Qiara Salsabila',
  'Rizky Firmansyah',
  'Salma Nabila',
  'Taufik Hidayat',
  'Umar Abdullah',
  'Vina Oktaviani',
  'Wahyu Setiawan',
  'Xena Puspita',
  'Yoga Pratama',
  'Zahra Fauziah',
  'Adi Nugraha',
  'Bella Kusuma',
  'Candra Wibowo',
  'Dewi Sartika',
  'Eko Purnomo',
  'Farah Nadhira',
  'Galih Saputra',
  'Hilda Maharani',
  'Irfan Maulana',
];

const MODULE_KEYS = ['checkins', 'prays', 'sports', 'studies'] as const;

/** Deterministic PRNG so reruns produce byte-identical output. */
const rng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const [year = 0, monthNo = 0] = month.split('-').map(Number);
const days = new Date(year, monthNo, 0).getDate();
const rand = rng(year * 100 + monthNo);

const students = NAMES.map((name, i) => {
  const modules = MODULE_KEYS.map((key, m) => {
    const chance = [0.62, 0.14, 0.4, 0.33][m]!;
    const list: number[] = [];
    for (let d = 1; d <= days; d++) if (rand() < chance) list.push(d);
    return { key, days: list };
  });
  const done = modules.reduce((a, m) => a + m.days.length, 0);
  return {
    id: `student-${i}`,
    nis: 258707 + i,
    name,
    modules,
    rate: Math.round((done / (days * 4)) * 100),
    streaks: Math.floor(rand() * 12),
  };
});

const totals = MODULE_KEYS.map((key) =>
  students.reduce(
    (a, s) => a + (s.modules.find((m) => m.key === key)?.days.length ?? 0),
    0,
  ),
);
const grand = totals.reduce((a, v) => a + v, 0) || 1;

const buckets = [
  { min: 0, max: 20 },
  { min: 21, max: 40 },
  { min: 41, max: 60 },
  { min: 61, max: 80 },
  { min: 81, max: 100 },
].map((b) => ({
  ...b,
  count: students.filter((s) => s.rate >= b.min && s.rate <= b.max).length,
}));

const recap: MonthlyJournalRecap = {
  month: {
    year,
    month: monthNo,
    label: new Date(year, monthNo - 1, 1).toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    }),
    days,
    elapsed: days,
  },
  overview: {
    rate: Math.round(
      students.reduce((a, s) => a + s.rate, 0) / students.length,
    ),
    checkins: totals[0]!,
    late: 132,
    needAttention: students.filter((s) => s.rate < 50).length,
  },
  dailyTrend: Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    const active = students.reduce(
      (a, s) =>
        a + s.modules.reduce((b, m) => b + (m.days.includes(day) ? 25 : 0), 0),
      0,
    );
    return { day, value: Math.round(active / students.length) };
  }),
  modules: MODULE_KEYS.map((key, i) => ({
    key,
    value: Math.round((totals[i]! / grand) * 1000) / 10,
  })),
  scoreDistribution: buckets,
  students,
};

const pdf = await renderJournalRecap(recap);
await Bun.write(out, pdf);
console.log(`${out} \u2014 ${(pdf.byteLength / 1024).toFixed(1)} KB`);
