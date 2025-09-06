'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function LoginPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const handleLogin = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/callback/?redirect=${encodeURIComponent(searchParams.get('r') || '/')}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

  return (
    <>
      <header className="absolute top-5 flex scale-110 items-center gap-2 lg:scale-120">
        <Image src="/favicon.ico" alt="Logo" width={35} height={35} />
        <h1 className="font-slab bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">
          {process.env.NEXT_PUBLIC_CLASS_NAME}
        </h1>
      </header>
      <Card className="font-outfit w-80 scale-120 bg-gray-100 dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Login ke {process.env.NEXT_PUBLIC_CLASS_NAME}</CardTitle>
          <CardDescription>Dapatkan akses fitur khusus kelas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="secondary"
            className="w-full bg-gray-50 dark:bg-gray-700"
            pointer
            onClick={handleLogin}
          >
            <Avatar className="size-5">
              <AvatarImage src="/images/google_icon.webp" />
            </Avatar>
            <p className="font-outfit">Lanjutkan dengan Google</p>
          </Button>
          <p className="mt-1 text-xs">*Pastikan untuk menggunakan akun sekolah</p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Dengan melanjutkan, pastikan kamu menyetujui{' '}
            <Link href="/guideline/privacy-police" className="underline">
              persyaratan pengguna
            </Link>{' '}
            dan{' '}
            <Link href="/guideline/terms-of-service" className="underline">
              ketentuan layanan
            </Link>{' '}
            kami.
          </p>
        </CardFooter>
      </Card>
    </>
  );
}
