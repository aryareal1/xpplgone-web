import type React from 'react';
import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Jurnal Ramadhan | ${SITE_NAME}`,
  description: `Jurnal Ramadhan of ${SITE_NAME} of Skansaka`,
};

export default function RamadanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
