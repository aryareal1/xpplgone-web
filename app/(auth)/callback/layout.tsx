import { pageTitle } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: pageTitle(),
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
