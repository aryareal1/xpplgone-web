'use client';

import { ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import {
  type MouseEvent,
  useCallback,
  useEffect,
  useState,
  type WheelEvent,
} from 'react';
import SectionHeader from '@fe/components/section-header';
import { type Album, albums } from '../../../../data/albums';
import { PhotoTile } from './photo-tile';

const AlbumModal = dynamic(
  () => import('./album-modal').then((mod) => ({ default: mod.AlbumModal })),
  { ssr: false },
);

// Semua foto dipecah jadi tile sendiri; urutannya tetap mengikuti album.
const tiles = albums.flatMap((album) =>
  album.photos.map((photo, photoIndex) => ({ album, photo, photoIndex })),
);

export default function AlbumLayout() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

  const openAlbum = useCallback((album: Album, photoIndex = 0) => {
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
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <SectionHeader
            title="Album"
            desc={['Kelas XI RPL - SMKN 1 Kandeman', 'Galeri Momen & Kenangan']}
          />
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
          <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl dark:text-white">
            Foto Kita Adalah Kenangan Kita
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground dark:text-muted-foreground">
            Bernostalgialah dengan momen-momen indah yang telah kita lalui
            bersama
          </p>
        </motion.div>

        {/* Kolase masonry: tinggi tile ikut rasio asli foto, tanpa jarak */}
        <div className="border-border bg-secondary duo-card columns-2 gap-0 overflow-hidden rounded-2xl sm:columns-3 lg:columns-4">
          {tiles.map((tile, index) => (
            <PhotoTile
              key={tile.photo}
              album={tile.album}
              photo={tile.photo}
              photoIndex={tile.photoIndex}
              index={index}
              onClick={openAlbum}
            />
          ))}
        </div>

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
