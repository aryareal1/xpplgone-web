import type { IUser } from '@/app/api/user/route';
import React from 'react';

export function useUser(id = '') {
  const [aud, setAud] = React.useState<'loading' | 'anon' | 'authenticated'>('loading');
  const [user, setUser] = React.useState<IUser | null>(null);

  React.useEffect(() => {
    fetch(`/api/user${id ? `/${id}` : ''}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error && d.message === 'Unauthorized') {
          setAud('anon');
          return;
        }
        setUser(d);
        setAud('authenticated');
      });
  }, [id]);

  return { user, aud };
}
