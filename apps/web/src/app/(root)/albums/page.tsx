'use client';

import XiRplMascot from '@xirpl/shared/components/mascot';
import SectionHeader from '@fe/components/section-header';
import { ArrowLeftIcon } from 'lucide-react';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  type MouseEvent,
  useCallback,
  useEffect,
  useState,
  type WheelEvent,
} from 'react';
import { type Album, albums } from '../../../../data/albums';
import { PhotoTile } from './photo-tile';

const AlbumModal = dynamic(
  () => import('./album-modal').then((mod) => ({ default: mod.AlbumModal })),
  { ssr: false },
);

// The combined album keeps the same album/photo order as the main source.
// When video media is added, this collection becomes where it aggregates too.
const allPhotos = albums.flatMap((album) => album.photos);
const allAlbum: Album = {
  id: 0,
  title: 'Semua Foto',
  date: 'Semua momen',
  location: 'Semua album',
  cover: allPhotos[allPhotos.length - 1] ?? '',
  photos: allPhotos,
};
const albumCards = allPhotos.length ? [allAlbum, ...albums] : [];

export default function AlbumLayout() {
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

  const openPhoto = useCallback((album: Album, photoIndex = 0) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(photoIndex);
  }, []);

  const closeAlbum = useCallback(() => {
    setSelectedAlbum(null);
    setCurrentImageIndex(0);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const nextImage = useCallback(() => {
    if (selectedAlbum) {
      setCurrentImageIndex((prev) =>
        prev === selectedAlbum.photos.length - 1 ? 0 : prev + 1,
      );
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [selectedAlbum]);

  const prevImage = useCallback(() => {
    if (selectedAlbum) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedAlbum.photos.length - 1 : prev - 1,
      );
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [selectedAlbum]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (selectedAlbum) {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        setZoom((prevZoom) => {
          const newZoom = Math.min(Math.max(1, prevZoom + delta), 4);
          if (newZoom === 1) {
            setPosition({ x: 0, y: 0 });
          }
          return newZoom;
        });
      }
    },
    [selectedAlbum],
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (zoom > 1) {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setInitialPosition(position);
      }
    },
    [zoom, position],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && zoom > 1) {
        setPosition({
          x: initialPosition.x + (e.clientX - dragStart.x),
          y: initialPosition.y + (e.clientY - dragStart.y),
        });
      }
    },
    [isDragging, zoom, initialPosition, dragStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (zoom > 1) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setZoom(2);
    }
  }, [zoom]);

  const handleThumbnailClick = useCallback((idx: number) => {
    setCurrentImageIndex(idx);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

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
  }, [selectedAlbum, nextImage, prevImage, closeAlbum]);

  useEffect(() => {
    if (selectedAlbum) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedAlbum]);

  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between gap-4">
          <SectionHeader
            title="Album"
            desc={['Kelas XI RPL - SMKN 1 Kandeman', 'Galeri Momen & Kenangan']}
          />
          <XiRplMascot
            pose="cozy"
            size={150}
            className="h-auto w-28 shrink-0 sm:w-36"
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        {activeAlbum ? (
          <>
            <button
              type="button"
              onClick={() => setActiveAlbum(null)}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring mb-5 inline-flex cursor-pointer items-center gap-2 rounded-lg text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <ArrowLeftIcon className="size-4" /> Semua album
            </button>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl dark:text-white">
                {activeAlbum.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {activeAlbum.photos.length} foto · {activeAlbum.date}
              </p>
            </div>
            <div className="border-border bg-secondary duo-card columns-2 gap-0 overflow-hidden rounded-2xl sm:columns-3 lg:columns-4">
              {activeAlbum.photos.map((photo, photoIndex) => {
                const sourceAlbum =
                  activeAlbum.id === 0
                    ? albums.find((album) => album.photos.includes(photo))
                    : activeAlbum;

                return (
                  <PhotoTile
                    key={photo}
                    album={activeAlbum}
                    captionAlbum={sourceAlbum}
                    photo={photo}
                    photoIndex={photoIndex}
                    index={photoIndex}
                    onClick={openPhoto}
                  />
                );
              })}
            </div>
          </>
        ) : albumCards.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {albumCards.map((album, index) => (
              <motion.button
                key={album.id}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: Math.min(index, 8) * 0.05 }}
                onClick={() => setActiveAlbum(album)}
                aria-label={`Buka album ${album.title}, ${album.photos.length} foto`}
                className="group focus-visible:ring-ring duo-card duo-press overflow-hidden rounded-2xl text-left focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <div className="relative aspect-4/5 overflow-hidden bg-secondary">
                  {album.cover ? (
                    <Image
                      src={album.cover}
                      alt={`Sampul album ${album.title}`}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      priority={index < 4}
                    />
                  ) : null}
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm font-extrabold tracking-wide text-foreground uppercase sm:text-base dark:text-white">
                    {album.title}
                  </h3>
                  <p className="mt-1 text-xs font-bold text-muted-foreground">
                    {album.photos.length} foto
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {album.date}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="border-border bg-card duo-card flex flex-col items-center gap-3 rounded-3xl px-6 py-8 text-center">
            <XiRplMascot
              pose="cozy"
              size={160}
              className="h-auto w-full max-w-[160px]"
            />
            <p className="text-muted-foreground font-medium">
              Belum ada album. Momen pertama menunggu untuk diabadikan!
            </p>
          </div>
        )}

        {/* Slideshow Modal - dynamically imported */}
        {selectedAlbum && (
          <AlbumModal
            selectedAlbum={selectedAlbum}
            currentImageIndex={currentImageIndex}
            zoom={zoom}
            position={position}
            isDragging={isDragging}
            onClose={closeAlbum}
            onNext={nextImage}
            onPrev={prevImage}
            onThumbnailClick={handleThumbnailClick}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDoubleClick={handleDoubleClick}
          />
        )}
      </div>
    </div>
  );
}
