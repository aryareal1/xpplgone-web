import { SITE_NAME } from '@xirpl/shared';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Jadwal Pelajaran | ${SITE_NAME}`,
  description: `Lesson schedule of ${SITE_NAME} of Skansaka`,
};

export default async function SubjectLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
