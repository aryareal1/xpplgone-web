'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CallbackPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const loop = setInterval(() => setDots((v) => (v + 1) % 4), 500);

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(searchParams.get('redirect') || '/');
      else router.replace('/login');
    });

    return () => {
      clearInterval(loop);
    };
  }, [router, searchParams, supabase.auth]);

  return <h1 className="text-xl font-bold">Signin in{'.'.repeat(dots)}</h1>;
}
