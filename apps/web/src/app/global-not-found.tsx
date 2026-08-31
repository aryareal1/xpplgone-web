import './globals.css';
import { SITE_NAME } from '@xirpl/shared';
import { HomeIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { Funnel_Display, Lexend } from 'next/font/google';
import Link from 'next/link';
import XiRplMascot from '@fe/components/mascot/Mascot';
import { ThemeProvider } from '@fe/components/theme-provider';
import { Button } from '@fe/components/ui/button';

const lexend = Lexend({ subsets: ['latin'] });
const funnel = Funnel_Display({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `Not Found | ${SITE_NAME}`,
  description: "The page you're looking for doesn't exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="id" suppressHydrationWarning>
      <head />
      <body className="flex h-dvh flex-col items-center justify-center gap-2 antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <XiRplMascot
            pose="search"
            size={200}
            className="h-auto w-full max-w-[220px]"
          />
          <h1
            className={`${lexend.className} text-brand-blue text-7xl font-bold`}
          >
            404
          </h1>
          <p className={`${funnel.className} text-lg`}>
            The page you&apos;re looking for dosen&apos;t exist!
          </p>
          <Button variant="special" className="mt-2" asChild>
            <Link href="/">
              <HomeIcon /> Back to Homepage
            </Link>
          </Button>
        </ThemeProvider>
      </body>
    </html>
  );
}