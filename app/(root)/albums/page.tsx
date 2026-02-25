'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';

import { Album, albums } from '@/data/albums';
import { AlbumCard } from './album-card';
import { AlbumModal } from './album-modal';

export default function AlbumLayout() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

  const openAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(0);
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setCurrentImageIndex(0);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
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
            <AlbumCard key={album.id} album={album} index={index} onClick={openAlbum} />
          ))}
        </div>

        {/* Slideshow Modal */}
        <AlbumModal
          selectedAlbum={selectedAlbum}
          currentImageIndex={currentImageIndex}
          zoom={zoom}
          position={position}
          isDragging={isDragging}
          onClose={closeAlbum}
          onNext={nextImage}
          onPrev={prevImage}
          onThumbnailClick={(idx) => {
            setCurrentImageIndex(idx);
            setZoom(1);
            setPosition({ x: 0, y: 0 });
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDoubleClick={handleDoubleClick}
        />
      </div>
    </div>
  );
}
