import type { User } from '@xirpl/api/schema';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export function useUser() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    api.auth.me.get().then(({ data }) => {
      const u = data?.data;
      if (u) {
        // ponytail: API /auth/me returns raw DB row (camelCase), not Profile
        // shape — map here; fix API response schema later.
        setUser(u);
        setIsAuthenticated(true);
      }
      setLoading(false);
    });
  }, []);

  return { loading, isAuthenticated, user };
}
