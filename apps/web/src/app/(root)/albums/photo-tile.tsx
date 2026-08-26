'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import type { Album } from '../../../../data/albums';
import { photoSizes } from '../../../../data/photo-sizes';

interface PhotoTileProps {
  album: Album;
  photo: string;
  /** Posisi foto di dalam albumnya, dipakai untuk membuka modal di foto ini. */
  photoIndex: number;
  /** Posisi di kolase, hanya untuk menentukan prioritas muat gambar. */
  index: number;
  onClick: (album: Album, photoIndex: number) => void;
}

// Rasio cadangan kalau ada foto baru yang belum terdaftar di photoSizes.
const FALLBACK: [number, number] = [4, 3];

export function PhotoTile({
  album,
  photo,
  photoIndex,
  index,
  onClick,
}: PhotoTileProps) {
  const [width, height] = photoSizes[photo] ?? FALLBACK;
  const isFirst = photoIndex === 0;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick(album, photoIndex)}
      aria-label={`Buka album ${album.title}, foto ${photoIndex + 1} dari ${album.photos.length}`}
      className="group bg-secondary focus-visible:ring-ring relative block w-full break-inside-avoid overflow-hidden focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:outline-none"
    >
      {/* width/height asli file: tinggi tile mengikuti rasio foto, bukan dipaksa kotak. */}
      <Image
        src={photo}
        alt={
          isFirst
            ? `Album ${album.title}`
            : `Foto ${photoIndex + 1} album ${album.title}`
        }
        width={width}
        height={height}
        className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        quality={70}
        priority={index < 6}
      />

      {/* Judul album hanya pada foto pertamanya, supaya kolase tidak penuh teks. */}
      {isFirst ? (
        <div className="from-brand-navy/90 via-brand-navy/20 absolute inset-0 flex flex-col justify-end bg-linear-to-t to-transparent p-3 text-left sm:p-4">
          <h3 className="text-sm font-extrabold tracking-wide text-white uppercase sm:text-base">
            {album.title}
          </h3>
          <p className="text-[10px] font-bold text-white/80 sm:text-xs">
            {album.photos.length} Foto &middot; {album.date}
          </p>
        </div>
      ) : (
        <div className="bg-brand-navy/40 absolute inset-0 flex items-end p-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="text-[10px] font-extrabold tracking-wide text-white uppercase">
            {album.title}
          </span>
        </div>
      )}
    </motion.button>
  );
}
