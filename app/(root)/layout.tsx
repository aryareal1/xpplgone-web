import type { Metadata } from 'next';
import '../globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import NavBar from '@/components/layout/navbar';
import { Outfit, Roboto_Slab } from 'next/font/google';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/sidebar';
import { cookies } from 'next/headers';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Home | ${SITE_NAME}`,
  description: `Website for class ${SITE_NAME} of SMK N 1 Kandeman`,
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
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <html lang="id" suppressHydrationWarning>
      <head />
      <body className={`antialiased ${robotoSlab.variable} ${outfit.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="w-full">
              <NavBar />
              {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
