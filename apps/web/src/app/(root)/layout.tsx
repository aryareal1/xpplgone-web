import type { Metadata } from 'next';
import '../globals.css';
import { Analytics } from '@fe/components/analytics';
import NavBar from '@fe/components/layout/navbar';
import AppSidebar from '@fe/components/layout/sidebar';
import { ThemeProvider } from '@fe/components/theme-provider';
import { SidebarProvider } from '@fe/components/ui/sidebar';
import { TooltipProvider } from '@fe/components/ui/tooltip';
import { SITE_NAME } from '@xirpl/shared';
import { DM_Sans, Fredoka } from 'next/font/google';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: `Home | ${SITE_NAME}`,
  description: `Website for class ${SITE_NAME} of SMK N 1 Kandeman`,
};

const fredoka = Fredoka({
  variable: '--font-fredoka',
  subsets: ['latin'],
});
const dmSans = DM_Sans({
  variable: '--font-dm-sans',
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
      <head>
        <Analytics />
      </head>
      <body className={`antialiased ${fredoka.variable} ${dmSans.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSidebar />
              <main className="min-w-0 flex-1">
                <NavBar />
                {children}
              </main>
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
