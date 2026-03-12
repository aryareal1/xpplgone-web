import type { Profile } from '@/api/schema';
import api from '@/lib/api';
import { useEffect, useState } from 'react';

export function useUser() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Profile>();

  useEffect(() => {
    api.users.me.get().then(({ data }) => {
      if (data) {
        setUser(data.data);
        setIsAuthenticated(true);
      }
      setLoading(false);
    });
  }, []);

  return { loading, isAuthenticated, user };
}
