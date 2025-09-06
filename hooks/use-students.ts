import type { IProfile } from '@/app/api/user/route';
import axios from 'axios';
import React from 'react';

export function useStudents() {
  const [loading, setLoading] = React.useState(true);
  const [students, setStudents] = React.useState<IProfile[]>([]);

  React.useEffect(() => {
    axios.get(`/api/user/students`).then((r) => {
      setStudents(r.data);
      setLoading(false);
    });
  }, []);

  return [students, loading] as [IProfile[], boolean];
}
