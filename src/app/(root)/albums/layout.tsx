import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Album Foto | ${SITE_NAME}`,
  description: `Photo album of ${SITE_NAME} of Skansaka`,
};

export default async function AlbumLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
