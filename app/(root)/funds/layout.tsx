import ClassOnly from '@/app/class-only';
import { createClient } from '@/lib/supabase/server';
import { pageTitle } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: pageTitle('Kas'),
  description: `Class funds of ${process.env.NEXT_PUBLIC_CLASS_NAME} of Skansaka`,
};

export default async function FundsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return <ClassOnly />;
  return <>{children}</>;
}
