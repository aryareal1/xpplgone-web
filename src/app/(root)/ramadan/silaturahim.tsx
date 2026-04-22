'use client';

import { Loader2, Plus, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import type { EidVisit } from '@/api/schema';
import SectionHeader from '@/components/section-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { hijriYear } from '@/data/journal-ramadhan';
import { useDebounce } from '@/hooks/use-debounce';
import api from '@/lib/api';
import { generateUid } from '@/lib/utils';

const rowVariants = {
  initial: {
    opacity: 0,
    y: -10,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.32, 0.72, 0, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: [0.32, 0.72, 0, 1] as const,
    },
  },
};

export function SilaturahimSection() {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [entries, setEntries] = useState<
    ((Omit<EidVisit, 'ramadan_year'> & { uid: string }) | { uid: string })[]
  >([]);

  useEffect(() => {
    api.ramadan['eid-visits'].get().then(({ data }) => {
      if (!data) return;
      setEntries([
        ...data.data.map((d) => ({ uid: generateUid(), ...d })),
        { uid: generateUid() },
      ]);
      setLoading(false);
    });
  }, []);

  return (
    <section id="silaturahim" className="w-full pt-12 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="mb-5"
      >
        <SectionHeader
          title="Kegiatan Silaturahim"
          desc="Daftar kunjungan silaturahim ke sanak saudara & teman Hari Raya Idul Fitri."
          color="bg-emerald-500"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="overflow-hidden border-none bg-white shadow-sm dark:bg-slate-900">
          <div className="-mt-6 flex items-center justify-between border-b border-slate-100 bg-[#ededee] p-6 pb-4 dark:border-slate-800 dark:bg-[#151f33]">
            <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 uppercase dark:text-slate-50">
              <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Daftar Kunjungan Idul Fitri
            </h3>
            {syncing && (
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyinkronkan...
              </div>
            )}
          </div>

          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                  <p className="mt-2 text-sm font-medium">Memuat daftar...</p>
                </div>
              ) : (
                <AnimatePresence mode="sync">
                  {entries.map((entry, idx) => (
                    <SilaturahimItem
                      key={entry.uid}
                      {...entry}
                      count={idx + 1}
                      setEntries={setEntries}
                      setSyncing={setSyncing}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}

function SilaturahimItem(
  props: Partial<Omit<EidVisit, 'ramadan_year'>> & {
    uid: string;
    count?: number;
    setEntries: Dispatch<
      SetStateAction<
        ((Omit<EidVisit, 'ramadan_year'> & { uid: string }) | { uid: string })[]
      >
    >;
    setSyncing: Dispatch<SetStateAction<boolean>>;
  },
) {
  const { setEntries, setSyncing, count, id, uid } = props;

  const [name, setName] = useState(props.visited_name ?? '');
  const [notes, setNotes] = useState(props.notes ?? '');
  const debouncedName = useDebounce(name, 1000);
  const debouncedNotes = useDebounce(notes, 1000);

  useEffect(() => {
    (async () => {
      if (!debouncedName) return;
      setSyncing(true);
      if (id) {
        setEntries((entries) =>
          entries.map((e) =>
            e.uid === uid
              ? { ...e, visited_name: debouncedName, notes: debouncedNotes }
              : e,
          ),
        );
        await api.ramadan['eid-visits']({ id }).patch({
          visited_name: debouncedName,
          notes: debouncedNotes,
        });
      } else {
        const { data } = await api.ramadan['eid-visits'].post({
          ramadan_year: hijriYear,
          visited_name: debouncedName,
          notes: debouncedNotes,
        });
        if (!data) return;
        setEntries((entries) => [
          ...entries.slice(0, entries.length - 1),
          { uid, ...data.data },
          { uid: generateUid() },
        ]);
      }
      setSyncing(false);
    })();
  }, [debouncedName, debouncedNotes, id, uid, setEntries, setSyncing]);

  const handleRemove = useCallback(async () => {
    if (!id) return;
    setSyncing(true);
    setEntries((entries) => entries.filter((e) => e.uid !== uid));
    await api.ramadan['eid-visits']({ id }).delete();
    setSyncing(false);
  }, [id, uid, setEntries, setSyncing]);

  return (
    <motion.div
      layout
      variants={rowVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        layout: { duration: 0.25 },
      }}
      className="flex items-start gap-4 p-4"
    >
      {/* Number / Plus */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-sm font-bold text-slate-800 dark:bg-slate-700 dark:text-slate-100">
        {id ? count : <Plus className="h-4 w-4" />}
      </div>

      {/* Inputs */}
      <div className="flex flex-1 flex-col gap-2">
        <Input
          placeholder="Nama yang dikunjungi"
          value={name}
          onInput={(e) => setName(e.currentTarget.value)}
          onBlur={(e) => !e.currentTarget.value && handleRemove()}
          className="border-slate-200 bg-[#fcfcfc] text-sm font-medium text-slate-900 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-50 dark:placeholder:text-slate-600"
        />

        <div className="flex items-start gap-2">
          <Textarea
            placeholder="Catatan kunjungan..."
            value={notes}
            onInput={(e) => setNotes(e.currentTarget.value)}
            rows={2}
            className="w-full resize-y border-slate-200 bg-[#fcfcfc] text-sm text-slate-700 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300 dark:placeholder:text-slate-600"
          />
        </div>
      </div>
    </motion.div>
  );
}
