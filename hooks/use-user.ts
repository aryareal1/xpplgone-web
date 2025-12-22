import type { IUser } from '@/app/api/user/route';
import React from 'react';

export function useUser(id = '') {
  const [aud, setAud] = React.useState<'loading' | 'anon' | 'authenticated'>('loading');
  const [user, setUser] = React.useState<IUser | null>(null);

  React.useEffect(() => {
    fetch(`/api/user${id ? `/${id}` : ''}`)
      .then(async (r) => {
        // Check if response is ok
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        // Check if response is JSON
        const contentType = r.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await r.text();
          throw new Error(`Expected JSON, got: ${text.substring(0, 100)}`);
        }
        return r.json();
      })
      .then((d) => {
        if (d.error && d.message === 'Unauthorized') {
          setAud('anon');
          return;
        }
        setUser(d);
        setAud('authenticated');
      })
      .catch((error) => {
        console.error('Failed to fetch user:', error);
        setAud('anon'); // Treat errors as unauthorized
        setUser(null);
      });
  }, [id]);

  return { user, aud };
}
