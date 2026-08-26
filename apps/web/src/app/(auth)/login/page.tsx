'use client';

import { SITE_NAME } from '@xirpl/shared';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Avatar, AvatarImage } from '@fe/components/ui/avatar';
import { Button } from '@fe/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@fe/components/ui/card';
import { API_URL } from '@fe/lib/api';

export default function LoginPage() {
  const searchParams = useSearchParams();

  const handleLogin = () => {
    const redirect = encodeURIComponent(
      `/callback?redirect=${encodeURIComponent(searchParams.get('r') || '/')}`,
    );
    window.location.href = `${API_URL}/auth/oauth2?redirect_to=${redirect}`;
  };

  return (
    <>
      <header className="absolute top-5 flex scale-110 items-center gap-2 lg:scale-120">
        <Image src="/favicon.ico" alt="Logo" width={35} height={35} />
        <h1 className="font-display text-brand-navy text-xl font-extrabold uppercase dark:text-white">
          {SITE_NAME}
        </h1>
      </header>
      <Card className="border-border duo-card w-80 scale-120 rounded-3xl">
        <CardHeader>
          <CardTitle className="text-lg font-extrabold">
            Login ke {SITE_NAME}
          </CardTitle>
          <CardDescription className="font-medium">
            Dapatkan akses fitur khusus kelas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="secondary"
            className="h-11 w-full rounded-2xl"
            pointer
            onClick={handleLogin}
          >
            <Avatar className="size-5">
              <AvatarImage src="/images/google_icon.webp" />
            </Avatar>
            <p className="">Lanjutkan dengan Google</p>
          </Button>
          <p className="mt-1 text-xs">
            *Pastikan untuk menggunakan akun sekolah
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-xs">
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
