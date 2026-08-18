import type { Metadata } from 'next';
import '../globals.css';
import { SITE_NAME } from '@xirpl/shared';
import { Outfit, Roboto_Slab } from 'next/font/google';
import { type ReactNode, Suspense } from 'react';
import { ThemeProvider } from '@fe/components/theme-provider';
import { Analytics } from '@fe/components/analytics';

export const metadata: Metadata = {
  title: `Login | ${SITE_NAME}`,
  description: `Login to the website of class ${SITE_NAME} of SMK N 1 Kandeman`,
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
  children: ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <Analytics />
      </head>
      <body
        className={`antialiased ${robotoSlab.variable} ${outfit.variable} flex h-dvh items-center justify-center`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Suspense>{children}</Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
