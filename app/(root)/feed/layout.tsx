import { SITE_NAME } from '@/lib/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Feed | ${SITE_NAME}`,
  description: `Feed of ${SITE_NAME} of Skansaka`,
};

export default async function FeedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
