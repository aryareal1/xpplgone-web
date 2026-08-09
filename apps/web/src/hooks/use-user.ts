import type { AuthModel } from '@be/modules/auth/model';
import { useEffect, useState } from 'react';
import api from '@fe/lib/api';

export function useUser() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthModel['meResponse']['data']>();

  useEffect(() => {
    api.me.get().then(({ data }) => {
      const u = data?.data;
      if (u) {
        setUser(u);
        setIsAuthenticated(true);
      }
      setLoading(false);
    });
  }, []);

  return { loading, isAuthenticated, user };
}
