import './globals.css';
import { Funnel_Display, Lexend } from 'next/font/google';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

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
          <h1
            className={`${lexend.className} bg-gradient-to-r from-fuchsia-500 to-rose-500 bg-clip-text text-7xl font-bold text-transparent`}
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
