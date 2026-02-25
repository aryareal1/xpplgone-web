'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { MapPin, Calendar } from 'lucide-react';
import { Album } from '@/data/albums';

interface AlbumCardProps {
  album: Album;
  index: number;
  onClick: (album: Album) => void;
}

export function AlbumCard({ album, index, onClick }: AlbumCardProps) {
  return (
    <motion.div
      key={album.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
      onClick={() => onClick(album)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
    >
      {/* Cover Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          fill
          src={album.cover}
          alt={album.title}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Photo Count Badge */}
        <div className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900 backdrop-blur-md dark:bg-slate-900/90 dark:text-white">
          {album.photos.length} Foto
        </div>
      </div>

      {/* Album Info */}
      <div className="p-5">
        <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
          {album.title}
        </h3>

        <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            <span className="font-medium">{album.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            <span className="font-medium">{album.date}</span>
          </div>

          {/* Preview Thumbnails */}
          <div className="mt-4 flex gap-2 overflow-hidden pt-2">
            {album.photos.slice(0, 4).map((photo, idx) => (
              <div
                key={idx}
                className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-100 dark:border-slate-700"
              >
                <Image fill src={photo} alt="" className="object-cover" sizes="40px" />
              </div>
            ))}
            {album.photos.length > 4 && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                +{album.photos.length - 4}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
