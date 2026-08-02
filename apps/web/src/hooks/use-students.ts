import type { Student } from '@xirpl/api/schema';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export function useStudents() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    api.users.students.get().then(({ data }) => {
      if (!data) return;
      setStudents(data.data);
      setLoading(false);
    });
  }, []);

  return [students, loading] as [Student[], boolean];
}
