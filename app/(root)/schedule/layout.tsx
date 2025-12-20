import type { Metadata } from 'next';
import { Outfit, Roboto_Slab } from 'next/font/google';
import { pageTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: pageTitle('Jadwal'),
  description: `Manage schedule for class ${process.env.NEXT_PUBLIC_CLASS_NAME} of SMK N 1 Kandeman`,
};
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const robotoSlab = Roboto_Slab({ subsets: ['latin'], variable: '--font-roboto-slab' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head />
      <body className={`antialiased ${robotoSlab.variable} ${outfit.variable}`}>{children}</body>
    </html>
  );
}
