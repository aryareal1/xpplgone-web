'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { AlignLeftIcon, LogOutIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';
import { motion as m, stagger, Variants } from 'motion/react';
import { useSidebar } from './ui/sidebar';
import { useUser } from '@/hooks/use-user';
import { IUser } from '@/app/api/user/route';

const navigations = [
  { name: 'Home', path: '/' },
  { name: 'Tugas', path: '/assigments' },
  { name: 'Jadwal', path: '/schedules' },
  { name: 'Album', path: '/albums' },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.2),
    },
  },
};
const item: Variants = {
  hidden: { opacity: 0, y: -30 },
  show: { opacity: 1, y: 0, transition: { type: 'tween' } },
};

export default function NavBar() {
  const { resolvedTheme: theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, aud } = useUser();
  const pathname = usePathname();
  const sb = useSidebar();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 h-15 w-full border-b bg-gray-50/80 backdrop-blur-sm dark:bg-gray-950/70">
      <div className="mx-auto flex h-full max-w-[90rem] items-center justify-between px-4">
        <m.div
          initial={{ opacity: 0, y: -30 }}
          animate={{
            opacity: sb.open && !sb.isMobile ? 0 : 1,
            y: sb.open && !sb.isMobile ? -30 : 0,
          }}
          transition={{ duration: 1, type: 'spring' }}
          className="flex gap-1"
        >
          <Button
            size="icon"
            variant="ghost"
            className="flex md:hidden"
            pointer
            onClick={sb.toggleSidebar}
          >
            {' '}
            <AlignLeftIcon className="size-5" />{' '}
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/favicon.ico" alt="Logo" width={35} height={35} priority />
            <h1 className="font-slab bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">
              {process.env.NEXT_PUBLIC_CLASS_NAME}
            </h1>
          </Link>
        </m.div>
        <m.div variants={container} initial="hidden" animate="show" className="flex gap-2">
          {navigations.map((v, i) => (
            <m.div variants={item} key={i}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'hidden md:flex',
                  'text-md hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-800/10 dark:hover:text-blue-500',
                  pathname === v.path &&
                    'cursor-default bg-blue-100 text-blue-600 dark:bg-blue-800/10 dark:text-blue-500'
                )}
                asChild
              >
                <Link href={v.path}>{v.name}</Link>
              </Button>
            </m.div>
          ))}
          {mounted ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                pointer
                className="ml-2 size-8 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-800/10 dark:hover:text-blue-500"
                onClick={() => {
                  let n = theme === 'dark' ? 'light' : 'dark';
                  if (n === systemTheme) n = 'system';
                  setTheme(n);
                }}
              >
                {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </>
          ) : null}

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="ml-2 cursor-pointer self-center">
              <Avatar>
                <AvatarImage src={user?.avatar_url ?? '/images/profile_picture.jpg'} />
                <AvatarFallback>{user?.full_name.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0" align="end">
              {user ? (
                <Profile user={user} />
              ) : (
                <Link href={`/login?r=${pathname}`}>
                  {' '}
                  <Profile />{' '}
                </Link>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </m.div>
      </div>
    </nav>
  );
}

function Profile({ user }: { user?: IUser }) {
  const supabase = createClient();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-x-2 px-4 py-2',
          !user && 'hover:bg-accent'
        )}
      >
        <Avatar className="row-span-2 self-center">
          <AvatarImage src={user?.avatar_url ?? '/images/profile_picture.jpg'} />
          <AvatarFallback>{user?.full_name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="font-outfit font-bold">{user?.full_name ?? 'Masuk'}</h2>
        <p className="font-outfit text-sm text-gray-400">{user?.email ?? 'Klik untuk log in'}</p>
      </div>
      {user && (
        <>
          <DropdownMenuSeparator className="m-0" />
          <DropdownMenuItem
            className="h-10 cursor-pointer justify-center font-bold"
            onClick={handleLogout}
          >
            <LogOutIcon /> Log Out
          </DropdownMenuItem>
        </>
      )}
    </>
  );
}
