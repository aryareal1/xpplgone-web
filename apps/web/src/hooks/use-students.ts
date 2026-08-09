import type { UserModel } from '@be/modules/user/model';

type Student = UserModel['Student'];
import { useEffect, useState } from 'react';
import api from '@fe/lib/api';

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
