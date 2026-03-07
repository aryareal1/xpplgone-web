'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, BookmarkCheck, ChevronLeft, CalendarDays } from 'lucide-react';
import { format, parseISO, isFriday } from 'date-fns';
import { id } from 'date-fns/locale';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  muCalendar,
  nuCalendar,
  RamadanDay,
  physicalSpiritualJournal,
  sunahJournal,
  FormData,
  Shalat5,
  ShalatSunah,
  INITIAL_FORM_DATA,
  EXTRA_SECTIONS,
} from '@/data/journal-ramadhan';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'motion/react';

export default function RamadanCheckinPage() {
  const params = useParams();
  const dateStr = params.date as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [userGender, setUserGender] = useState<string | null>(null);
  const [isFridayDay, setIsFridayDay] = useState(false);
  const [ramadanDayInfo, setRamadanDayInfo] = useState<{ hijriDay: number; org: string } | null>(
    null
  );
  const [gregorianDate, setGregorianDate] = useState<Date | null>(null);

  // Form State
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch User Gender
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('gender')
            .eq('uid', user.id)
            .single();

          if (profile) {
            setUserGender(profile.gender);
          }
        }

        // Determine Date Info
        let actualDate: Date | null = null;
        const hijriDay = parseInt(dateStr);
        if (!isNaN(hijriDay)) {
          const savedOrg = localStorage.getItem('ramadhan_org') as 'MU' | 'NU' | null;
          const calendar = savedOrg === 'NU' ? nuCalendar : muCalendar;
          const dayData = calendar.find((d: RamadanDay) => d.hijriDay === hijriDay);

          if (dayData) {
            actualDate = parseISO(dayData.date);
            setRamadanDayInfo({ hijriDay, org: savedOrg || 'MU' });
          }
        } else {
          actualDate = parseISO(dateStr);
        }

        if (actualDate) {
          setGregorianDate(actualDate);
          setIsFridayDay(isFriday(actualDate));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateStr, supabase]);

  const handleCheckboxChange = (
    section: 'shalat5' | 'shalatSunah' | 'root',
    field: string,
    value: boolean
  ) => {
    setFormData((prev) => {
      if (section === 'shalat5' || section === 'shalatSunah') {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        };
      }
      return { ...prev, [field]: value } as FormData;
    });
  };

  const handleInputChange = (
    section: 'jumat' | 'tadarrus' | 'tarawihWitir' | 'ceramah' | null,
    field: string,
    value: string
  ) => {
    // Enforce 1-30 range for 'juz' field
    if (section === 'tadarrus' && field === 'juz') {
      const numValue = parseInt(value);
      if (value !== '' && (isNaN(numValue) || numValue < 1 || numValue > 30)) {
        return;
      }
    }

    setFormData((prev) => {
      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        };
      }
      return { ...prev, [field]: value } as FormData;
    });
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <main className="font-outfit mx-auto mt-5 flex max-w-[800px] flex-col gap-6 px-4 pb-20">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/ramadhan">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              {ramadanDayInfo ? `${ramadanDayInfo.hijriDay} Ramadhan 1447 H` : 'Check-in Harian'}
            </h1>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {gregorianDate ? format(gregorianDate, 'EEEE, d MMMM yyyy', { locale: id }) : dateStr}
              {ramadanDayInfo && ` (${ramadanDayInfo.org})`}
            </p>
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 gap-6"
      >
        {/* Section 1: Jurnal Kegiatan Harian */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950/50">
              <CalendarDays className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
              Jurnal Kegiatan Harian
            </h2>
          </div>

          <Card className="overflow-hidden border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/40 dark:backdrop-blur-md">
            <CardContent className="grid gap-6 p-6">
              {/* Puasa Checkbox */}
              <div className="flex items-center justify-between rounded-lg border border-orange-100 bg-orange-50/30 p-4 dark:border-orange-900/30 dark:bg-orange-950/10">
                <div className="space-y-0.5">
                  <span className="text-base font-bold text-neutral-900 italic dark:text-neutral-100">
                    Puasa
                  </span>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Niat dan menjalankan puasa hari ini
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.puasa}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleCheckboxChange('root', 'puasa', e.target.checked)
                  }
                  className="h-5 w-5 cursor-pointer rounded border-neutral-300 accent-orange-600"
                />
              </div>

              {/* Shalat 5 Waktu */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold tracking-wider text-neutral-500 uppercase">
                  Shalat 5 Waktu
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {physicalSpiritualJournal.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-900/50"
                    >
                      <span className="text-xs font-bold capitalize">{item.name}</span>
                      <input
                        type="checkbox"
                        checked={formData.shalat5[item.id as keyof Shalat5]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleCheckboxChange('shalat5', item.id, e.target.checked)
                        }
                        className="h-5 w-5 cursor-pointer rounded border-neutral-300 accent-orange-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Shalat Sunah */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold tracking-wider text-neutral-500 uppercase">
                  Sholat Sunah
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {sunahJournal.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-900/50"
                    >
                      <span className="text-xs font-bold capitalize">{item.name}</span>
                      <input
                        type="checkbox"
                        checked={formData.shalatSunah[item.id as keyof ShalatSunah]}
                        onChange={(e) =>
                          handleCheckboxChange('shalatSunah', item.id, e.target.checked)
                        }
                        className="h-5 w-5 cursor-pointer rounded border-neutral-300 accent-orange-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Keterangan */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                  Keterangan
                </h3>
                <Textarea
                  placeholder="Catatan tambahan kegiatan hari ini..."
                  value={formData.keterangan}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange(null, 'keterangan', e.target.value)
                  }
                  className="min-h-[120px] bg-neutral-50/50 dark:bg-neutral-900/50"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Extra Sections (Tadarrus, Tarawih, Ceramah, etc.) */}
        {EXTRA_SECTIONS.map((section) => {
          // Check if section should be shown based on condition (if any)
          if (section.condition && !section.condition(userGender, isFridayDay)) return null;

          return (
            <section key={section.id} className="animate-in fade-in zoom-in space-y-4 duration-500">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    section.color.split(' ')[0], // bg-xxx-xxx
                    'dark:bg-opacity-20'
                  )}
                >
                  <section.icon
                    className={cn('h-5 w-5', section.color.split(' ')[1] || section.color)}
                  />
                </div>
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
                  {section.title}
                </h2>
              </div>

              <Card className="border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/40 dark:backdrop-blur-md">
                <CardContent className="grid gap-4 p-6">
                  <div
                    className={cn(
                      'grid gap-4',
                      section.fields.length === 1
                        ? 'grid-cols-1'
                        : section.fields.length === 2
                          ? 'sm:grid-cols-2'
                          : 'sm:grid-cols-2 lg:grid-cols-3'
                    )}
                  >
                    {section.fields.map((field) => (
                      <div
                        key={field.id}
                        className={cn('space-y-2', field.id === 'materi' && 'lg:col-span-1')}
                      >
                        <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                          {field.label}
                        </h3>
                        <div className="relative">
                          {field.icon && (
                            <field.icon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                          )}
                          <Input
                            type={field.type || 'text'}
                            className={cn(field.icon && 'pl-10')}
                            placeholder={field.placeholder}
                            min={field.id === 'juz' ? 1 : undefined}
                            max={field.id === 'juz' ? 30 : undefined}
                            value={formData[section.id][field.id]}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange(section.id, field.id, e.target.value)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          );
        })}

        {/* Submit Button */}
        <div className="mt-4 flex flex-col gap-4">
          <Button className="h-12 w-full rounded-xl bg-orange-600 font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-700 dark:shadow-none">
            <BookmarkCheck className="mr-2 h-5 w-5" />
            Simpan Jurnal Hari Ini
          </Button>
          <p className="text-center text-xs text-neutral-500">
            Pastikan kalian tidak bohong dalam mengisi jurnal ini. Ingat, Allah Maha Melihat dan
            Maha Mengetahui.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
