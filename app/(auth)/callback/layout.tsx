import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'X PPLG 1',
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
