import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import ClassOnly from '@/app/class-only';
import { SITE_NAME } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: `Jurnal Ramadhan | ${SITE_NAME}`,
  description: `Jurnal Ramadhan of ${SITE_NAME} of Skansaka`,
};

export default async function RamadanLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return <ClassOnly />;
  return <>{children}</>;
}
