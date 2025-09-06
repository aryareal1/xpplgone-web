import type { Metadata } from 'next';
import '../globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import NavBar from '@/components/navbar';
import { Outfit, Roboto_Slab } from 'next/font/google';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import { cookies } from 'next/headers';
import { Analytics } from '@vercel/analytics/next';
import { pageTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: pageTitle('Home'),
  description: `Website for class ${process.env.NEXT_PUBLIC_CLASS_NAME} of SMK N 1 Kandeman`,
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
      </body>
    </html>
  );
}
