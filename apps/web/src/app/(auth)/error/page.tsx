'use client';

import { Button } from '@xirpl/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@xirpl/shared/components/ui/card';
import { SITE_NAME } from '@xirpl/shared';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const COPY: Record<string, string> = {
  NOT_ALLOWED:
    'Akun Google kamu belum terdaftar sebagai anggota kelas. Daftar dulu lewat admin, lalu coba masuk lagi.',
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') ?? '';

  return (
    <Card className="border-border duo-card w-[min(88vw,24rem)] rounded-3xl">
      <CardHeader>
        <CardTitle className="text-lg font-extrabold">
          Gagal masuk ke {SITE_NAME}
        </CardTitle>
        <CardDescription className="font-medium">
          {COPY[code] ?? 'Terjadi kesalahan saat memproses login kamu.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="special" pointer className="w-full">
          <Link href="/">Ke beranda</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
