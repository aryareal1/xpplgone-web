import { SITE_NAME } from '@/lib/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: SITE_NAME,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
