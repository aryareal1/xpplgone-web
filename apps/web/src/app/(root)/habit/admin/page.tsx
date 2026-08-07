import { SITE_NAME } from '@xirpl/shared';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import AdminDashboard from './dashboard';

export const metadata: Metadata = {
  title: `Dasbor Kebiasaan | ${SITE_NAME}`,
  description: `Rekap kebiasaan seluruh anggota ${SITE_NAME}`,
};

export default function HabitAdminPage() {
  return (
    <Suspense>
      <AdminDashboard />
    </Suspense>
  );
}
