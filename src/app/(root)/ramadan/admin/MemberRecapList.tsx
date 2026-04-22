'use client';

import { ChevronRight, Hash, Mail, Search, User } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Student {
  uid: string;
  display_name: string;
  username: string;
  nis: number;
  email: string;
}

export default function MemberRecapList({ students }: { students: Student[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nis?.toString().includes(searchTerm),
    );
  }, [students, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Cari berdasarkan nama atau NIS..."
          className="pl-10 h-11 border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-3">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student, idx) => (
            <motion.div
              key={student.uid}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <Link href={`/ramadan/admin/${student.nis}`}>
                <Card className="group overflow-hidden border-slate-200 bg-white transition-all hover:border-orange-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-900/50">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 group-hover:bg-orange-100 transition-colors dark:bg-slate-800 dark:group-hover:bg-orange-950/30">
                        <User className="h-6 w-6 text-slate-500 group-hover:text-orange-600 dark:text-slate-400 dark:group-hover:text-orange-400" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                          {student.display_name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            {student.nis}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {student.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-orange-500 transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
            <User className="h-12 w-12 mb-3 opacity-20" />
            <p className="font-medium">Tidak ada data peserta ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
