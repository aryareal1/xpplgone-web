import type { IUser } from '@/app/api/user/route';
import axios from 'axios';
import React from 'react';

export function useUser(id = '') {
  const [aud, setAud] = React.useState<'loading' | 'anon' | 'authenticated'>('loading');
  const [user, setUser] = React.useState<IUser | null>(null);

  React.useEffect(() => {
    axios
      .get(`/api/user${id ? `/${id}` : ''}`)
      .then((r) => {
        setUser(r.data);
        setAud('authenticated');
      })
      .catch(() => setAud('anon'));
  }, [id]);

  return { user, aud };
}
