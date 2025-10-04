'use client';

import { Button } from '@/components/ui/button';
import { SITE_NAME } from '@/lib/constants';
import { LogInIcon } from 'lucide-react';
import { Funnel_Display, Lexend } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const lexend = Lexend({ subsets: ['latin'] });
const funnel = Funnel_Display({ subsets: ['latin'] });

export default function ClassOnly() {
  const pathname = usePathname();

  return (
    <div className="absolute top-1/2 left-1/2 flex -translate-1/2 flex-col items-center text-center">
      <h1
        className={`${lexend.className} bg-gradient-to-r from-fuchsia-500 to-rose-500 bg-clip-text text-5xl font-bold text-transparent`}
      >
        FORBIDDEN
      </h1>
      <h2 className={`${funnel.className} text-lg`}>
        Halaman ini dikhususkan untuk murid kelas {SITE_NAME}
      </h2>
      <p className={`${funnel.className} mt-5 text-gray-600 dark:text-gray-400`}>
        Silahkan login untuk melanjutkan!
      </p>
      <Button variant="special" className="mt-2" asChild>
        <Link href={`/login?r=${pathname}`}>
          <LogInIcon /> Login to Continue
        </Link>
      </Button>
    </div>
  );
}
