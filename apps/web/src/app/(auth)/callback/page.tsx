'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Absolute targets are only honored for our own web/admin origins; anything
// else falls back to home, so /callback?redirect=https://evil can't bounce you.
function safeTarget(to: string | null): string {
  if (!to) return '/';
  if (!to.startsWith('http')) return to;
  const allowed = [
    window.location.origin,
    process.env.NEXT_PUBLIC_ADMIN_URL,
  ].filter(Boolean);
  return allowed.some((o) => to.startsWith(o as string)) ? to : '/';
}

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const loop = setInterval(() => setDots((v) => (v + 1) % 4), 500);
    const to = safeTarget(searchParams.get('redirect'));
    // Cross-origin (admin app) needs a real navigation, not a router push.
    if (/^https?:\/\//.test(to)) window.location.replace(to);
    else router.replace(to);

    return () => {
      clearInterval(loop);
    };
  }, [router, searchParams]);

  return <h1 className="text-xl font-bold">Signin in{'.'.repeat(dots)}</h1>;
}
