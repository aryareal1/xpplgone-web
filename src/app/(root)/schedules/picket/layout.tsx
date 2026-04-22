import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Jadwal Piket | ${SITE_NAME}`,
  description: `Picket schedule of ${SITE_NAME} of Skansaka`,
};

export default async function PicketLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
