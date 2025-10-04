'use client';

import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '../ui/sidebar';
import Image from 'next/image';
import {
  AlbumIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ChevronDownIcon,
  ClipboardClockIcon,
  Code2Icon,
  HomeIcon,
  NewspaperIcon,
  NotepadTextIcon,
  PiggyBankIcon,
  UsersRoundIcon,
} from 'lucide-react';
import { motion as m } from 'motion/react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { SITE_NAME } from '@/lib/constants';

type Bars = {
  title?: string;
  items: {
    name: string;
    icon: typeof HomeIcon;
    path?: string;
    sub?: { name: string; path: string }[];
  }[];
}[];

const bars: Bars = [
  {
    items: [
      { name: 'Home', icon: HomeIcon, path: '/' },
      { name: 'Feed', icon: NewspaperIcon, path: '/feed' },
      { name: 'Album', icon: AlbumIcon, path: '/albums' },
    ],
  },
  {
    title: 'Administrasi Kelas',
    items: [
      { name: 'Anggota', icon: UsersRoundIcon, path: '/members' },
      {
        name: 'Jadwal',
        icon: ClipboardClockIcon,
        sub: [
          { name: 'Pelajaran', path: '/schedule/subject' },
          { name: 'Piket', path: '/schedule/picket' },
        ],
      },
      { name: 'Tugas', icon: NotepadTextIcon, path: '/assigments' },
      { name: 'Kas', icon: PiggyBankIcon, path: '/funds' },
    ],
  },
  {
    title: 'Developer',
    items: [{ name: 'API Documentation', icon: Code2Icon, path: '/api' }],
  },
];

export default function AppSidebar() {
  const { open, isMobile, toggleSidebar } = useSidebar();
  const path = usePathname();
  const o = isMobile || open;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <m.div
              initial={{ opacity: 0, display: 'none' }}
              animate={{ opacity: o ? 1 : 0, display: o ? 'flex' : 'none' }}
              transition={{ duration: o ? 0.4 : 0 }}
              className="mt-1 justify-between"
            >
              <Link href="/" className="flex items-center gap-2 whitespace-nowrap">
                <Image src="/favicon.ico" alt="Logo" width={35} height={35} />
                <h1 className="font-slab bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">
                  {SITE_NAME}
                </h1>
              </Link>
              <Button size="icon" variant="ghost" onClick={toggleSidebar} pointer>
                {' '}
                <AlignRightIcon />{' '}
              </Button>
            </m.div>
            <m.div
              initial={{ opacity: 0, display: 'none' }}
              animate={{ opacity: o ? 0 : 1, display: o ? 'none' : 'flex' }}
              transition={{ duration: o ? 0 : 0.4 }}
              className="mt-2 items-center justify-center"
            >
              <SidebarMenuButton
                className="cursor-pointer bg-gradient-to-r from-cyan-500 to-sky-600 dark:from-violet-600 dark:to-indigo-600"
                onClick={toggleSidebar}
              >
                <AlignLeftIcon />
              </SidebarMenuButton>
            </m.div>
            <m.div
              initial={{ display: 'flex' }}
              animate={{ display: 'none' }}
              transition={{ duration: 0 }}
              className="h-10"
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="font-outfit whitespace-nowrap">
        {bars.map((v, i) => (
          <SidebarGroup key={i}>
            {v.title && <SidebarGroupLabel className="text-sm">{v.title}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {v.items.map((w, j) =>
                  w.sub ? (
                    <Collapsible key={j} className="group/sub">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <div>
                            <SidebarMenuButton
                              asChild
                              className={cn(
                                'text-base',
                                path === w.path ||
                                  (w.sub.some((s) => s.path === w.path) &&
                                    'bg-blue-100 text-blue-600 dark:bg-blue-800/10 dark:text-blue-500')
                              )}
                            >
                              {w.path ? (
                                <Link href={w.path}>
                                  {' '}
                                  <w.icon /> {w.name}
                                </Link>
                              ) : (
                                <div>
                                  {' '}
                                  <w.icon /> {w.name}{' '}
                                </div>
                              )}
                            </SidebarMenuButton>
                            <SidebarMenuBadge>
                              <ChevronDownIcon className="size-4 transition-transform group-data-[state=open]/sub:rotate-180" />
                            </SidebarMenuBadge>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {w.sub.map((x, k) => (
                              <SidebarMenuSubItem key={k}>
                                <SidebarMenuSubButton asChild>
                                  <Link href={x.path}>{x.name}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={j}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          'text-base',
                          path === w.path &&
                            'bg-blue-100 text-blue-600 dark:bg-blue-800/10 dark:text-blue-500'
                        )}
                      >
                        {w.path ? (
                          <Link href={w.path}>
                            {' '}
                            <w.icon /> {w.name}
                          </Link>
                        ) : (
                          <div>
                            {' '}
                            <w.icon /> {w.name}{' '}
                          </div>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
