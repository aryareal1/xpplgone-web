import ClassOnly from '@/app/class-only';
import { SITE_NAME } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Kas | ${SITE_NAME}`,
  description: `Class funds of ${SITE_NAME} of Skansaka`,
};

export default async function FundsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return <ClassOnly />;
  return <>{children}</>;
}
