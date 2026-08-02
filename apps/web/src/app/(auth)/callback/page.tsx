'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const loop = setInterval(() => setDots((v) => (v + 1) % 4), 500);

    // Cookies are already set by the API /auth/callback redirect.
    router.replace(searchParams.get('redirect') || '/');

    return () => {
      clearInterval(loop);
    };
  }, [router, searchParams]);

  return <h1 className="text-xl font-bold">Signin in{'.'.repeat(dots)}</h1>;
}
