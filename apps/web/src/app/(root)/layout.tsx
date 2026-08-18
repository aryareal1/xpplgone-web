import type { Metadata } from 'next';
import '../globals.css';
import { SITE_NAME } from '@xirpl/shared';
import { Outfit, Roboto_Slab } from 'next/font/google';
import { cookies } from 'next/headers';
import NavBar from '@fe/components/layout/navbar';
import AppSidebar from '@fe/components/layout/sidebar';
import { ThemeProvider } from '@fe/components/theme-provider';
import { SidebarProvider } from '@fe/components/ui/sidebar';
import { TooltipProvider } from '@fe/components/ui/tooltip';
import { Analytics } from '@fe/components/analytics';

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
      <head>
        <Analytics />
      </head>
      <body className={`antialiased ${robotoSlab.variable} ${outfit.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSidebar />
              <main className="w-full">
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
