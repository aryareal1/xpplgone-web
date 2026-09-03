import { SITE_NAME } from '@xirpl/shared/constants';
import AdminDashboard from '@xirpl/shared/components/habit-admin/dashboard';
import { HabitAdminProvider } from '@xirpl/shared/components/habit-admin/context';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { adminCtx } from '../../data/admin-ctx';

export const metadata: Metadata = {
  title: `Dasbor Kebiasaan | ${SITE_NAME}`,
  description: `Rekap kebiasaan seluruh anggota ${SITE_NAME}`,
};

export default function Home() {
  return (
    <HabitAdminProvider value={adminCtx}>
      <Suspense>
        <AdminDashboard />
      </Suspense>
    </HabitAdminProvider>
  );
}
