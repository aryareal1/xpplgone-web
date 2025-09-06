import type { Metadata } from 'next';
import '../globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Outfit, Roboto_Slab } from 'next/font/google';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import { pageTitle } from '@/lib/utils';

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
  const supabase = await createClient();
  if ((await supabase.auth.getUser()).data.user) return redirect('/');

  return (
    <html lang="id" suppressHydrationWarning>
      <head />
      <body
        className={`antialiased ${robotoSlab.variable} ${outfit.variable} flex h-dvh items-center justify-center`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
