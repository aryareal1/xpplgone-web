'use client';

import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  Calendar,
  MessageSquare,
  Moon,
  User as UserIcon,
  ExternalLink,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { RamadanDay } from '@/data/journal-ramadhan';

interface Student {
  id: string;
  display_name: string;
  username: string;
  nis: number;
  gender: string | null;
}

export default function StudentRecapContent({
  student,
  logs,
  calendar,
}: {
  student: Student;
  logs: any[];
  calendar: RamadanDay[];
}) {
  const logsMap = new Map();
  logs?.forEach((log) => {
    logsMap.set(log.ramadan_day, log);
  });

  const getCalendarDay = (dayNum: number) => {
    return calendar.find((d) => d.hijriDay === dayNum);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
        const log = logsMap.get(day);
        const calDay = getCalendarDay(day);
        const isFilled = !!log;

        const dateObj = calDay ? parseISO(calDay.date) : null;

        if (dateObj && dateObj > new Date()) {
          return null;
        }

        const dayName = dateObj ? format(dateObj, 'EEEE', { locale: id }) : '';
        const displayDate = dateObj
          ? format(dateObj, 'd MMMM yyyy', { locale: id })
          : '';

        return (
          <Card
            key={day}
            className={cn(
              'overflow-hidden transition-all border-slate-200 dark:border-slate-800',
              isFilled
                ? 'bg-white dark:bg-slate-900 border-l-4 border-l-orange-500 dark:border-l-orange-500 shadow-sm'
                : 'bg-slate-100/50 dark:bg-slate-900/40 opacity-70',
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
              <div className="flex flex-col">
                <CardTitle className="text-lg font-bold">
                  Hari ke-{day}
                </CardTitle>
                {dayName && (
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                      {dayName}, {displayDate}
                    </span>
                  </div>
                )}
              </div>
              {isFilled ? (
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50"
                >
                  Terisi
                </Badge>
              ) : null}
            </CardHeader>
            <CardContent className="p-4 pt-2">
              {isFilled ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <IbadahItem label="Puasa" status={log.fasting} />
                    <IbadahItem label="Subuh" status={log.subuh} />
                    <IbadahItem label="Dhuhur" status={log.dhuhur} />
                    <IbadahItem label="Ashar" status={log.ashar} />
                    <IbadahItem label="Maghrib" status={log.maghrib} />
                    <IbadahItem label="Isya" status={log.isya} />
                    <IbadahItem label="Tarawih" status={log.tarawih} />
                    <IbadahItem label="Tadarus" status={!!log.tadarus_juz} />
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-[10px] h-8 font-bold border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-950/50 dark:text-orange-400 dark:hover:bg-orange-950/30 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Selengkapnya
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="p-10 min-w-[50vw] max-h-[90vh] overflow-y-auto border-none shadow-2xl dark:bg-slate-950">
                      <DialogHeader>
                        <DialogTitle className="flex flex-col gap-1">
                          <span className="text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-[0.2em]">
                            Detail Jurnal Harian
                          </span>
                          <span className="text-2xl font-black">
                            Hari ke-{day}
                          </span>
                          <span className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4" />
                            {dayName},{' '}
                            {calDay
                              ? format(parseISO(calDay.date), 'd MMMM yyyy', {
                                  locale: id,
                                })
                              : ''}
                          </span>
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-6 pt-6 pb-2">
                        {/* Shalat & Puasa Grid */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/50">
                          <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">
                            Ibadah Wajib
                          </h4>
                          <div className="grid grid-cols-1 gap-y-3">
                            <IbadahRow
                              label="Puasa Ramadhan"
                              status={log.fasting}
                            />
                            <div className="h-px bg-slate-200/50 dark:bg-slate-800/50 my-1" />
                            <IbadahRow
                              label="Shalat Subuh"
                              status={log.subuh}
                            />
                            <IbadahRow
                              label="Shalat Dhuhur"
                              status={log.dhuhur}
                            />
                            <IbadahRow
                              label="Shalat Ashar"
                              status={log.ashar}
                            />
                            <IbadahRow
                              label="Shalat Maghrib"
                              status={log.maghrib}
                            />
                            <IbadahRow label="Shalat Isya" status={log.isya} />
                          </div>
                        </div>

                        {/* Sunnah Prayers */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/50">
                          <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">
                            Ibadah Sunnah
                          </h4>
                          <div className="grid grid-cols-1 gap-y-3">
                            <IbadahRow
                              label="Shalat Dhuha"
                              status={log.dhuha}
                            />
                            <IbadahRow
                              label="Shalat Tarawih"
                              status={log.tarawih}
                            />
                            <IbadahRow
                              label="Shalat Witir"
                              status={log.witir}
                            />
                            <IbadahRow
                              label="Shalat Tahajjud"
                              status={log.tahajud}
                            />
                            <IbadahRow
                              label="Shalat Iftitah"
                              status={log.iftitah}
                            />
                          </div>
                        </div>

                        {/* Tadarus Detail */}
                        {log.tadarus_juz && (
                          <div className="rounded-2xl bg-orange-50/50 p-5 border border-orange-100 dark:bg-orange-950/10 dark:border-orange-900/20">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                <BookOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                              </div>
                              <span className="text-xs font-black text-orange-800 dark:text-orange-400 uppercase tracking-widest">
                                Tadarus Al-Qur'an
                              </span>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-orange-900/60 font-medium dark:text-orange-400/60">
                                  Juz
                                </span>
                                <span className="font-bold text-orange-900 dark:text-orange-100">
                                  {log.tadarus_juz}
                                </span>
                              </div>
                              {log.tadarus_surah && (
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-orange-900/60 font-medium dark:text-orange-400/60">
                                    Surah / Ayat
                                  </span>
                                  <span className="font-bold text-orange-900 dark:text-orange-100">
                                    {log.tadarus_surah}
                                  </span>
                                </div>
                              )}
                              {log.tadarus_place && (
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-orange-900/60 font-medium dark:text-orange-400/60">
                                    Tempat
                                  </span>
                                  <span className="font-bold text-orange-900 dark:text-orange-100">
                                    {log.tadarus_place}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Tarawih Detail */}
                        {log.tarawih_place && (
                          <div className="rounded-2xl bg-purple-50/50 p-5 border border-purple-100 dark:bg-purple-950/10 dark:border-purple-900/20">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                <Moon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="text-xs font-black text-purple-800 dark:text-purple-400 uppercase tracking-widest">
                                Detail Tarawih
                              </span>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-purple-900/60 font-medium dark:text-purple-400/60">
                                  Lokasi
                                </span>
                                <span className="font-bold text-purple-900 dark:text-purple-100">
                                  {log.tarawih_place}
                                </span>
                              </div>
                              {log.tarawih_imam && (
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-purple-900/60 font-medium dark:text-purple-400/60">
                                    Imam
                                  </span>
                                  <span className="font-bold text-purple-900 dark:text-purple-100">
                                    {log.tarawih_imam}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Friday / Jumatan Logic */}
                        {dayName === 'Jumat' && student.gender === 'male' && (
                          <div className="rounded-2xl bg-blue-50/50 p-5 border border-blue-100 dark:bg-blue-950/10 dark:border-blue-900/20">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-xs font-black text-blue-800 dark:text-blue-400 uppercase tracking-widest">
                                Shalat Jum'at
                              </span>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-blue-900/60 font-medium dark:text-blue-400/60">
                                  Khotib / Imam
                                </span>
                                <span className="font-bold text-blue-900 dark:text-blue-200">
                                  {log.jumah_khotib || '-'}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1 text-sm">
                                <span className="text-blue-900/60 font-medium dark:text-blue-400/60">
                                  Tema Khutbah
                                </span>
                                <p className="font-bold text-blue-900 dark:text-blue-200 text-xs leading-relaxed">
                                  {log.jumah_khutbah || '-'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Ceramah Detail */}
                        {log.ceramah_place && (
                          <div className="rounded-2xl bg-amber-50/50 p-5 border border-amber-100 dark:bg-amber-950/10 dark:border-amber-900/20">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                <MessageSquare className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              </div>
                              <span className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-widest">
                                Kultum / Ceramah
                              </span>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-amber-900/60 font-medium dark:text-amber-400/60">
                                  Penceramah
                                </span>
                                <span className="font-bold text-amber-900 dark:text-amber-100">
                                  {log.ceramah_dai || '-'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-amber-900/60 font-medium dark:text-amber-400/60">
                                  Materi
                                </span>
                                <p className="font-bold text-amber-900 dark:text-amber-100 text-xs leading-relaxed">
                                  {log.ceramah_materi || '-'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {log.notes && (
                          <div className="border-t border-slate-100 dark:border-slate-800/50 pt-6">
                            <div className="flex items-center gap-2 mb-3">
                              <MessageSquare className="h-4 w-4 text-slate-400" />
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Catatan Harian
                              </span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                              <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                                {log.notes}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <Calendar className="h-8 w-8 text-slate-200 dark:text-slate-800 mb-2" />
                  <p className="text-xs text-slate-400 italic">Data kosong</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function IbadahItem({ label, status }: { label: string; status: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-1">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      {status ? (
        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
      ) : (
        <XCircle className="h-3 w-3 text-slate-300 dark:text-slate-700" />
      )}
    </div>
  );
}

function IbadahRow({ label, status }: { label: string; status: boolean }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>
      {status ? (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">
            Sudah
          </span>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </div>
      ) : (
        <XCircle className="h-4 w-4 text-slate-200 dark:text-slate-800" />
      )}
    </div>
  );
}
