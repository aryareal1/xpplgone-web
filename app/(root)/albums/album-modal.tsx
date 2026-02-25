'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Album } from '@/data/albums';

interface AlbumModalProps {
  selectedAlbum: Album | null;
  currentImageIndex: number;
  zoom: number;
  position: { x: number; y: number };
  isDragging: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onThumbnailClick: (index: number) => void;
  onWheel: (e: React.WheelEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onDoubleClick: () => void;
}

export function AlbumModal({
  selectedAlbum,
  currentImageIndex,
  zoom,
  position,
  isDragging,
  onClose,
  onNext,
  onPrev,
  onThumbnailClick,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onDoubleClick,
}: AlbumModalProps) {
  return (
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
                  onClick={onClose}
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
                onPrev();
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
              onWheel={onWheel}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onDoubleClick={onDoubleClick}
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
                onNext();
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
                    onClick={() => onThumbnailClick(idx)}
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
  );
}
