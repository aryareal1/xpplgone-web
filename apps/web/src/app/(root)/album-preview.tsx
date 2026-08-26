'use client';

import { motion as m } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import SectionHeader from '@fe/components/section-header';
import { AspectRatio } from '@fe/components/ui/aspect-ratio';
import { albums } from '../../../data/albums';

// Empat album terakhir, urutan terbaru dulu. Datanya tetap dari sumber yang ada.
const recent = albums.slice(-4).reverse();

export default function AlbumPreview() {
  return (
    <section id="pictures">
      <SectionHeader
        title="Album"
        desc="Foto kita adalah kenangan kita di masa lampau. Bernostalgialah!"
      />

      {recent.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {recent.map((a, i) => (
            <m.div
              key={a.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href="/albums"
                className="group focus-visible:ring-ring flex flex-col gap-2 rounded-3xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <AspectRatio
                  ratio={4 / 5}
                  className="border-border duo-card duo-press overflow-hidden rounded-2xl"
                >
                  <Image
                    src={a.cover}
                    alt={`Album ${a.title}`}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </AspectRatio>
                <div className="px-1">
                  <p className="text-sm font-extrabold tracking-wide uppercase md:text-base">
                    {a.title}
                  </p>
                  <p className="text-muted-foreground text-xs font-bold">
                    {a.date}
                  </p>
                </div>
              </Link>
            </m.div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground border-border bg-card duo-card rounded-3xl px-6 py-8 text-center font-medium">
          Belum ada album. Momen pertama menunggu untuk diabadikan!
        </p>
      )}

      <Link
        href="/albums"
        className="text-brand-blue border-brand-blue/40 bg-card duo-card duo-press mt-5 inline-flex h-11 items-center rounded-2xl px-5 text-sm font-extrabold tracking-wide uppercase dark:text-blue-300"
      >
        Lihat semua album →
      </Link>
    </section>
  );
}
