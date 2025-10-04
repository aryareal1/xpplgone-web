import type { IProfile } from '@/app/api/user/route';
import React from 'react';

export function useStudents() {
  const [loading, setLoading] = React.useState(true);
  const [students, setStudents] = React.useState<IProfile[]>([]);

  React.useEffect(() => {
    fetch('/api/user/students')
      .then((r) => r.json())
      .then((d) => {
        setStudents(d);
        setLoading(false);
      });
  }, []);

  return [students, loading] as [IProfile[], boolean];
}
