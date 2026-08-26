import { SITE_NAME } from '@xirpl/shared';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: `Papan Peringkat | ${SITE_NAME}`,
  description: `Habit leaderboard ${SITE_NAME} of Skansaka`,
};

export default function LeaderboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
