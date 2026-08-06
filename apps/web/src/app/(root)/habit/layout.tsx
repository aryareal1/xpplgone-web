import { SITE_NAME } from '@xirpl/shared';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: `Jurnal Kebiasaan | ${SITE_NAME}`,
  description: `Journal Habit ${SITE_NAME} of Skansaka`,
};

export default function HabitLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
