import { useEffect, useState } from 'react';
import type { StudentProfile } from '@/api/schema';
import api from '@/lib/api';

export function useStudents() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentProfile[]>([]);

  useEffect(() => {
    api.users.students.get().then(({ data }) => {
      if (!data) return;
      setStudents(data.data);
      setLoading(false);
    });
  }, []);

  return [students, loading] as [StudentProfile[], boolean];
}
