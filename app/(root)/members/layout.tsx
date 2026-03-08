import { SITE_NAME } from '@/lib/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Members | ${SITE_NAME}`,
  description: `Our class members - ${SITE_NAME}`,
};

export default function MembersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
