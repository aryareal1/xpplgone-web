'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, X, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface Album {
  id: number;
  title: string;
  date: string;
  location: string;
  cover: string;
  photos: string[];
}

export default function AlbumLayout() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

  const albums: Album[] = [
    {
      id: 1,
      title: 'MPLS',
      date: '14 Jul 2025',
      location: 'SMK N 1 Kandeman',
      cover: '/images/albums/WhatsApp Image 2025-12-21 at 15.50.58_50405e6b.webp',
      photos: [
        '/images/albums/WhatsApp Image 2025-12-21 at 15.50.58_419c06d0.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.50.58_50405e6b.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.50.59_4b3e2b24.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.53.32_31110955.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.53.36_ea6bc8e1.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.20_57a574e2.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.02_866cf483.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.50.54_ff6b1a2f.webp',
      ],
    },
    {
      id: 2,
      title: 'Juara',
      date: 'Macam-Macam',
      location: 'SMK N 1 Kandeman',
      cover: '/images/albums/WhatsApp Image 2025-12-21 at 15.49.14_b1e98350.webp',
      photos: [
        '/images/albums/WhatsApp Image 2025-12-21 at 15.49.14_b1e98350.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.49.16_e6f71613.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.53.38_5bb80b44.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.53.38_84fd7de1.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.53.45_c77ec35a.webp',
      ],
    },
    {
      id: 3,
      title: 'Foto Random',
      date: 'Anytime',
      location: 'Everywhere',
      cover: '/images/albums/WhatsApp Image 2025-12-21 at 18.51.21_0edb9d51.webp',
      photos: [
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.21_0edb9d51.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.20_63190e44.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.25_127cbaee.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.24_00b4b441.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.20_a79df95c.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.21_09380717.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.21_3f01696c.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.46.52_a983f621.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.46.52_56942b98.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.46.53_8bc243a3.webp',
        '/images/albums/1769854144041.webp',
        '/images/albums/1769854144064.webp',
        '/images/albums/1769854144089.webp',
        '/images/albums/1769854144109.webp',
        '/images/albums/1769854144135.webp',
        '/images/albums/1769854144185.webp',
        '/images/albums/1769866282831.webp',
        '/images/albums/1769866282851.webp',
        '/images/albums/IMG-20251124-WA0024.webp',
        '/images/albums/IMG-20251211-WA0024.webp',
      ],
    },
    {
      id: 4,
      title: 'Maulid Nabi',
      date: '8 Sep 2025',
      location: 'SMK N 1 Kandeman',
      cover: '/images/albums/WhatsApp Image 2025-12-21 at 15.55.18_759453fa.webp',
      photos: [
        '/images/albums/WhatsApp Image 2025-12-21 at 15.55.53_f2e4b216.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.55.19_fb55869d.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.55.18_759453fa.webp',
      ],
    },
    {
      id: 5,
      title: 'Hari Guru',
      date: '25 Nov 2025',
      location: 'SMK N 1 Kandeman',
      cover: '/images/albums/WhatsApp Image 2025-12-21 at 15.55.57_0a9c637a.webp',
      photos: [
        '/images/albums/WhatsApp Image 2025-12-21 at 15.55.57_0a9c637a.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.55.57_81e2d99f.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.55.58_4c40b741.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.57.03_9d0c86c4.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.57.20_5ffc7f2f.webp',
      ],
    },
    {
      id: 6,
      title: 'Renang',
      date: '20 Nov 2025',
      location: 'Gajah Mada Sport Center',
      cover: '/images/albums/WhatsApp Image 2025-12-21 at 15.55.54_ab86e9f2.webp',
      photos: [
        '/images/albums/WhatsApp Image 2025-12-21 at 15.55.54_ab86e9f2.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.55.54_d13d9aab.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.56.54_6ae1acce.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.56.53_e840ccf9.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.56.54_5befa79b.webp',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.56.53_b86dff10.webp',
      ],
    },
  ];

  const openAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(0);
    setTimeout(() => setIsOpening(true), 10);
  };

  const closeAlbum = () => {
    setIsOpening(false);
    setTimeout(() => {
      setSelectedAlbum(null);
      setCurrentImageIndex(0);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }, 300);
  };

  const nextImage = useCallback(() => {
    if (selectedAlbum) {
      setCurrentImageIndex((prev) => (prev === selectedAlbum.photos.length - 1 ? 0 : prev + 1));
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [selectedAlbum]);

  const prevImage = useCallback(() => {
    if (selectedAlbum) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedAlbum.photos.length - 1 : prev - 1));
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [selectedAlbum]);

  const handleWheel = (e: React.WheelEvent) => {
    if (selectedAlbum) {
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      const newZoom = Math.min(Math.max(1, zoom + delta), 4);
      setZoom(newZoom);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
      setInitialPosition(position);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: initialPosition.x + (e.clientX - dragStart.x),
        y: initialPosition.y + (e.clientY - dragStart.y),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    if (zoom > 1) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setZoom(2);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedAlbum) return;

      if (e.key === 'Escape') closeAlbum();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAlbum, nextImage, prevImage]);

  return (
    <div className="font-outfit min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="h-20 w-2 rounded-full bg-linear-to-b from-blue-600 to-indigo-600"></div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                Album
              </h1>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-slate-600 md:text-base dark:text-slate-400">
                  Kelas X PPLG 1 - SMKN 1 Kandeman
                </p>
                <p className="text-sm font-medium text-slate-500 md:text-base dark:text-slate-500">
                  Galeri Momen & Kenangan
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="group flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-slate-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 transition-transform group-hover:scale-110 dark:bg-indigo-900/30 dark:text-indigo-400">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase dark:text-slate-400">
                  Total Momen
                </p>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {albums.length} Album
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        {/* Intro Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-2 text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
            Foto Kita Adalah Kenangan Kita
          </h2>
          <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
            Bernostalgialah dengan momen-momen indah yang telah kita lalui bersama
          </p>
        </motion.div>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {albums.map((album, index) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
              onClick={() => openAlbum(album)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
            >
              {/* Cover Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
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
          ))}
        </div>

        {/* Slideshow Modal */}
        <AnimatePresence>
          {selectedAlbum && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md"
            >
              {/* Header */}
              <div className="z-50 border-b border-white/10 bg-slate-900/50 backdrop-blur-md">
                <div className="mx-auto max-w-[1920px] px-4 py-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <h2 className="text-xl font-bold">{selectedAlbum.title}</h2>
                      <p className="mt-0.5 text-sm font-medium text-slate-400">
                        {currentImageIndex + 1} dari {selectedAlbum.photos.length} Foto
                        {zoom > 1 && (
                          <span className="ml-2 rounded bg-indigo-500/20 px-1.5 py-0.5 text-xs text-indigo-300">
                            Zoom: {zoom.toFixed(1)}x
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={closeAlbum}
                      className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 hover:text-red-400"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Image Display */}
              <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4">
                {/* Previous Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 z-20 rounded-full p-3 text-white transition-all hover:scale-110 hover:bg-black/40 sm:left-8"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>

                {/* Image Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={currentImageIndex}
                  transition={{ duration: 0.3 }}
                  className="relative h-full w-full"
                  onWheel={handleWheel}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onDoubleClick={handleDoubleClick}
                  style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                >
                  <Image
                    fill
                    src={selectedAlbum.photos[currentImageIndex]}
                    alt={`${selectedAlbum.title} - ${currentImageIndex + 1}`}
                    className="object-contain select-none"
                    quality={90}
                    priority
                    sizes="100vw"
                    style={{
                      transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                      transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                    }}
                    draggable={false}
                  />
                </motion.div>

                {/* Next Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 z-20 rounded-full p-3 text-white transition-all hover:scale-110 hover:bg-black/40 sm:right-8"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </div>

              {/* Thumbnail Strip */}
              <div className="z-50 border-t border-white/10 bg-slate-900/80 py-4 backdrop-blur-md">
                <div className="mx-auto max-w-7xl overflow-x-auto px-4">
                  <div className="flex min-w-max justify-center gap-3 sm:justify-start">
                    {selectedAlbum.photos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentImageIndex(idx);
                          setZoom(1);
                          setPosition({ x: 0, y: 0 });
                        }}
                        className={cn(
                          'relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                          idx === currentImageIndex
                            ? 'scale-95 border-indigo-500 opacity-100'
                            : 'border-transparent opacity-40 hover:scale-105 hover:opacity-100'
                        )}
                      >
                        <Image
                          fill
                          src={photo}
                          alt={`Thumbnail ${idx + 1}`}
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
