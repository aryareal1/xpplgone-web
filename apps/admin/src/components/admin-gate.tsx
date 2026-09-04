'use client';

import { useEffect } from 'react';
import { isAdminRole } from '../data/habit-admin';
import { useUser } from '../hooks/use-user';

// Client-side role gate: only ADMIN_ROLES may stay; everyone else is bounced
// to the web app's login, which returns them here via /callback?redirect.
export function AdminGate({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated, user } = useUser();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !isAdminRole(user?.role)) {
      const web = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3600";
      window.location.replace(
        `${web}/login?r=${encodeURIComponent(window.location.origin)}`,
      );
    }
  }, [loading, isAuthenticated, user?.role]);

  if (loading || !isAuthenticated || !isAdminRole(user?.role)) return null;
  return children;
}
