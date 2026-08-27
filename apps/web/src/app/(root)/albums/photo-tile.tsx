'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import type { Album } from '../../../../data/albums';
import { photoSizes } from '../../../../data/photo-sizes';

interface PhotoTileProps {
  album: Album;
  /** Source album for tile metadata when showing the all-photos collection. */
  captionAlbum?: Album;
  photo: string;
  /** Photo position inside its album, used to open the modal on this photo. */
  photoIndex: number;
  /** Position in the collage, only used to set image loading priority. */
  index: number;
  onClick: (album: Album, photoIndex: number) => void;
}

// Fallback ratio for new photos not yet registered in photoSizes.
const FALLBACK: [number, number] = [4, 3];

export function PhotoTile({
  album,
  captionAlbum,
  photo,
  photoIndex,
  index,
  onClick,
}: PhotoTileProps) {
  const [width, height] = photoSizes[photo] ?? FALLBACK;
  const displayAlbum = captionAlbum ?? album;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick(album, photoIndex)}
      aria-label={`Buka album ${displayAlbum.title}, foto ${photoIndex + 1} dari ${album.photos.length}`}
      className="group bg-secondary focus-visible:ring-ring relative block w-full break-inside-avoid overflow-hidden focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:outline-none"
    >
      {/* Original file width/height: tile height follows the photo's ratio, not forced into a box. */}
      <Image
        src={photo}
        alt={`Foto ${photoIndex + 1} album ${displayAlbum.title}`}
        width={width}
        height={height}
        className="h-auto w-full"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        quality={70}
        priority={index < 6}
      />

    </motion.button>
  );
}
