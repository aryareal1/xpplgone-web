import type { Metadata } from 'next';
import '../globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Outfit, Roboto_Slab } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { pageTitle } from '@/lib/utils';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: pageTitle('Login'),
  description: `Login to the website of class ${process.env.NEXT_PUBLIC_CLASS_NAME} of SMK N 1 Kandeman`,
};

const robotoSlab = Roboto_Slab({
  variable: '--font-roboto-slab',
  subsets: ['latin'],
});
const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head />
      <body
        className={`antialiased ${robotoSlab.variable} ${outfit.variable} flex h-dvh items-center justify-center`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Suspense>{children}</Suspense>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
