'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, X } from 'lucide-react';
import Image from 'next/image';

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

  const albums = [
    {
      id: 1,
      title: 'MPLS',
      date: '14 Jul 2025',
      location: 'SMK N 1 Kandeman',
      cover: '/images/albums/WhatsApp Image 2025-12-21 at 15.50.58_50405e6b.jpg',
      photos: [
        '/images/albums/WhatsApp Image 2025-12-21 at 15.50.58_419c06d0.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.50.58_50405e6b.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.50.59_4b3e2b24.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.53.32_31110955.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.53.36_ea6bc8e1.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.20_57a574e2.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.02_866cf483.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.50.54_ff6b1a2f.jpg',
      ],
    },
    {
      id: 2,
      title: 'Juara',
      date: 'Macam-Macam',
      location: 'SMK N 1 Kandeman',
      cover: '/images/albums/WhatsApp Image 2025-12-21 at 15.49.14_b1e98350.jpg',
      photos: [
        '/images/albums/WhatsApp Image 2025-12-21 at 15.49.14_b1e98350.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.49.16_e6f71613.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.53.38_5bb80b44.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.53.38_84fd7de1.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.53.45_c77ec35a.jpg',
      ],
    },
    {
      id: 3,
      title: 'Foto Random',
      date: 'Anytime',
      location: 'Everywhere',
      cover: '/images/albums/WhatsApp Image 2025-12-21 at 18.51.21_0edb9d51.jpg',
      photos: [
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.21_0edb9d51.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.20_63190e44.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.25_127cbaee.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.24_00b4b441.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.20_a79df95c.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.21_09380717.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.51.21_3f01696c.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.46.52_a983f621.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.46.52_56942b98.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.46.53_8bc243a3.jpg',
        '/images/albums/1769854144041.jpg',
        '/images/albums/1769854144064.jpg',
        '/images/albums/1769854144089.jpg',
        '/images/albums/1769854144109.jpg',
        '/images/albums/1769854144135.jpg',
        '/images/albums/1769854144185.jpg',
        '/images/albums/1769866282831.jpg',
        '/images/albums/1769866282851.jpg',
        '/images/albums/IMG-20251124-WA0024.jpg',
        '/images/albums/IMG-20251211-WA0024.jpg',
      ],
    },
    {
      id: 4,
      title: 'Maulid Nabi',
      date: '8 Sep 2025',
      location: 'SMK N 1 Kandeman',
      cover: '/images/albums/WhatsApp Image 2025-12-21 at 15.55.18_759453fa.jpg',
      photos: [
        '/images/albums/WhatsApp Image 2025-12-21 at 15.55.53_f2e4b216.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.55.19_fb55869d.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.55.18_759453fa.jpg',
      ],
    },
    {
      id: 5,
      title: 'Hari Guru',
      date: '25 Nov 2025',
      location: 'SMK N 1 Kandeman',
      cover: '/images/albums/WhatsApp Image 2025-12-21 at 15.55.57_0a9c637a.jpg',
      photos: [
        '/images/albums/WhatsApp Image 2025-12-21 at 15.55.57_0a9c637a.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.55.57_81e2d99f.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.55.58_4c40b741.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.57.03_9d0c86c4.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.57.20_5ffc7f2f.jpg',
      ],
    },
    {
      id: 6,
      title: 'Renang',
      date: '20 Nov 2025',
      location: 'Gajah Mada Sport Center',
      cover: '/images/albums/WhatsApp Image 2025-12-21 at 15.55.54_ab86e9f2.jpg',
      photos: [
        '/images/albums/WhatsApp Image 2025-12-21 at 15.55.54_ab86e9f2.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 15.55.54_d13d9aab.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.56.54_6ae1acce.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.56.53_e840ccf9.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.56.54_5befa79b.jpg',
        '/images/albums/WhatsApp Image 2025-12-21 at 18.56.53_b86dff10.jpg',
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

  const nextImage = () => {
    if (selectedAlbum) {
      setCurrentImageIndex((prev) => (prev === selectedAlbum.photos.length - 1 ? 0 : prev + 1));
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const prevImage = () => {
    if (selectedAlbum) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedAlbum.photos.length - 1 : prev - 1));
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newZoom = Math.min(Math.max(1, zoom + delta), 4);
    setZoom(newZoom);
    if (newZoom === 1) {
      setPosition({ x: 0, y: 0 });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 transition-colors duration-300 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm backdrop-blur-lg transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900/95">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-15 w-2 rounded bg-indigo-500"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Album Kelas</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">X PPLG 1 - SMK N 1 Kandeman</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Momen</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {albums.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Foto Kita Adalah Kenangan Kita
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
            Bernostalgialah dengan momen-momen indah yang telah kita lalui bersama
          </p>
        </div>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <div
              key={album.id}
              onClick={() => openAlbum(album)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  openAlbum(album);
                }
              }}
              role="button"
              tabIndex={0}
              className="group transform cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800"
            >
              {/* Cover Image */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  fill
                  src={album.cover}
                  alt={album.title}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Photo Count Badge */}
                <div className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-gray-900 backdrop-blur-sm dark:bg-gray-900/90 dark:text-white">
                  {album.photos.length} Foto
                </div>
              </div>

              {/* Album Info */}
              <div className="p-5">
                <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-indigo-500 dark:text-white">
                  {album.title}
                </h3>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                      <span>{album.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                    <span>{album.date}</span>
                  </div>

                  {/* Preview Thumbnails */}
                  <div className="mt-4 flex gap-2 overflow-hidden">
                    {album.photos.slice(0, 4).map((photo, idx) => (
                      <div key={idx} className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                        <Image width={48} height={48} src={photo} alt="" className="object-cover" />
                      </div>
                    ))}
                    {album.photos.length > 4 && (
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200 text-xs font-semibold dark:bg-gray-700">
                        +{album.photos.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slideshow Modal */}
        {selectedAlbum && (
          <div
            className={`fixed inset-0 z-50 flex flex-col bg-black/95 transition-opacity duration-300 ${
              isOpening ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Header */}
            <div
              className={`border-b border-white/10 bg-black/50 backdrop-blur-sm transition-transform duration-500 ${
                isOpening ? 'translate-y-0' : '-translate-y-full'
              }`}
            >
              <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{selectedAlbum.title}</h2>
                    <p className="mt-1 text-sm text-gray-300">
                      {currentImageIndex + 1} / {selectedAlbum.photos.length}{' '}
                      {zoom > 1 && `• Zoom: ${zoom.toFixed(1)}x`}
                    </p>
                  </div>
                  <button
                    onClick={closeAlbum}
                    className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Image Display */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden">
              {/* Previous Button */}
              <button
                onClick={prevImage}
                className={`absolute left-4 z-10 rounded-full p-3 text-white transition-all hover:scale-110 hover:bg-white/20 ${
                  isOpening ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
                } delay-200 duration-500`}
              >
                <ChevronLeft className="h-8 w-8" />
              </button>

              {/* Image Container */}
              <div
                className={`relative flex h-full w-full max-w-5xl items-center justify-center transition-all duration-700 ${
                  isOpening ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                } delay-100`}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDoubleClick={handleDoubleClick}
                style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                role="button"
                tabIndex={0}
              >
                <Image
                  fill
                  src={selectedAlbum.photos[currentImageIndex]}
                  alt={`${selectedAlbum.title} - ${currentImageIndex + 1}`}
                  className="rounded-lg object-contain shadow-2xl select-none"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  style={{
                    transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                  }}
                  draggable={false}
                />
              </div>

              {/* Next Button */}
              <button
                onClick={nextImage}
                className={`absolute right-4 z-10 rounded-full p-3 text-white transition-all hover:scale-110 hover:bg-white/20 ${
                  isOpening ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
                } delay-200 duration-500`}
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div
              className={`border-t border-white/10 bg-black/50 py-6 backdrop-blur-sm transition-transform duration-500 ${
                isOpening ? 'translate-y-0' : 'translate-y-full'
              } delay-150`}
            >
              <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-2.5 pb-2">
                <div className="flex min-w-max gap-3">
                  {selectedAlbum.photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentImageIndex(idx);
                        setZoom(1);
                        setPosition({ x: 0, y: 0 });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setCurrentImageIndex(idx);
                          setZoom(1);
                          setPosition({ x: 0, y: 0 });
                        }
                      }}
                      tabIndex={0}
                      className={`relative h-13 w-13 shrink-0 overflow-hidden rounded-lg transition-all ${
                        idx === currentImageIndex
                          ? 'scale-90 border-2 ring-4 ring-indigo-500'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        fill
                        src={photo}
                        alt={`Thumbnail ${idx + 1}`}
                        sizes="52px"
                        className="object-cover"
                      />
                      {idx === currentImageIndex && (
                        <div className="absolute inset-0 bg-indigo-500/20" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
