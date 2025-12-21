'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users, X } from 'lucide-react';

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

  const albums = [
    {
      id: 1,
      title: 'MPLS',
      date: '14 Jul 2025',
      location: 'SMK N 1 Kandeman',
      cover: 'https://i.ibb.co.com/0b5fCXm/Whats-App-Image-2025-12-21-at-15-50-58-50405e6b.jpg',
      photos: [
        'https://i.ibb.co.com/MkJdPpRx/Whats-App-Image-2025-12-21-at-15-50-58-419c06d0.jpg',
        'https://i.ibb.co.com/0b5fCXm/Whats-App-Image-2025-12-21-at-15-50-58-50405e6b.jpg',
        'https://i.ibb.co.com/gb6L6nTX/Whats-App-Image-2025-12-21-at-15-50-59-4b3e2b24.jpg',
        'https://i.ibb.co.com/0p0LPQ6m/Whats-App-Image-2025-12-21-at-15-53-32-31110955.jpg',
        'https://i.ibb.co.com/Kj1BC4wR/Whats-App-Image-2025-12-21-at-15-53-36-ea6bc8e1.jpg',
        'https://i.ibb.co.com/G3cqR5Cf/Whats-App-Image-2025-12-21-at-18-51-20-57a574e2.jpg',
        'https://i.ibb.co.com/hJR1ThwC/Whats-App-Image-2025-12-21-at-18-51-02-866cf483.jpg',
        'https://i.ibb.co.com/8gJ3fy7g/Whats-App-Image-2025-12-21-at-18-50-54-ff6b1a2f.jpg',
      ],
    },
    {
      id: 2,
      title: 'Juara',
      date: 'Macam-Macam',
      location: 'SMK N 1 Kandeman',
      cover: 'https://i.ibb.co.com/kVGVyfdF/WAhats-App-Image-2025-12-21-at-15-49-14-b1e98350.jpg',
      photos: [
        'https://i.ibb.co.com/Kp2K2DwC/Whats-App-Image-2025-12-21-at-15-49-14-b1e98350.jpg',
        'https://i.ibb.co.com/vvXBxMxb/Whats-App-Image-2025-12-21-at-15-49-16-e6f71613.jpg',
        'https://i.ibb.co.com/BHVDb4jd/Whats-App-Image-2025-12-21-at-15-53-38-5bb80b44.jpg',
        'https://i.ibb.co.com/bgSX1c74/Whats-App-Image-2025-12-21-at-15-53-38-84fd7de1.jpg',
        'https://i.ibb.co.com/XfRS0K2Y/Whats-App-Image-2025-12-21-at-15-53-45-c77ec35a.jpg',
      ],
    },
    {
      id: 3,
      title: 'Foto Random',
      date: 'Anytime',
      location: 'Everywhere',
      cover: 'https://i.ibb.co.com/7NNcs3t2/Whats-App-Image-2025-12-21-at-18-51-21-0edb9d51.jpg',
      photos: [
        'https://i.ibb.co.com/7NNcs3t2/Whats-App-Image-2025-12-21-at-18-51-21-0edb9d51.jpg',
        'https://i.ibb.co.com/cX7K0DLb/Whats-App-Image-2025-12-21-at-18-51-20-63190e44.jpg',
        'https://i.ibb.co.com/6pN0VFt/Whats-App-Image-2025-12-21-at-18-46-53-6639cd95.jpg',
        'https://i.ibb.co.com/Y4SgxVbJ/Whats-App-Image-2025-12-21-at-18-51-25-127cbaee.jpg',
        'https://i.ibb.co.com/CpMJ1mwF/Whats-App-Image-2025-12-21-at-18-51-24-00b4b441.jpg',
        'https://i.ibb.co.com/k6rFTTJP/Whats-App-Image-2025-12-21-at-18-51-20-a79df95c.jpg',
        'https://i.ibb.co.com/99zJcxHT/Whats-App-Image-2025-12-21-at-18-51-21-09380717.jpg',
        'https://i.ibb.co.com/bjsJLVMM/Whats-App-Image-2025-12-21-at-18-51-21-3f01696c.jpg',
        'https://i.ibb.co.com/PGvx9jFR/Whats-App-Image-2025-12-21-at-18-46-52-a983f621.jpg',
        'https://i.ibb.co.com/j9LmbLRp/Whats-App-Image-2025-12-21-at-18-46-52-56942b98.jpg',
      ],
    },
    {
      id: 4,
      title: 'Maulid Nabi',
      date: '8 Sep 2025',
      location: 'SMK N 1 Kandeman',
      cover: 'https://i.ibb.co.com/ZzC0k1Wn/Whats-App-Image-2025-12-21-at-15-55-18-759453fa.jpg',
      photos: [
        'https://i.ibb.co.com/v46ymV5R/Whats-App-Image-2025-12-21-at-15-55-53-f2e4b216.jpg',
        'https://i.ibb.co.com/4nZT54hQ/Whats-App-Image-2025-12-21-at-15-55-19-fb55869d.jpg',
        'https://i.ibb.co.com/ZzC0k1Wn/Whats-App-Image-2025-12-21-at-15-55-18-759453fa.jpg',
      ],
    },
    {
      id: 5,
      title: 'Hari Guru',
      date: '25 Nov 2025',
      location: 'SMK N 1 Kandeman',
      cover: 'https://i.ibb.co.com/7xTgnxsj/Whats-App-Image-2025-12-21-at-15-55-57-0a9c637a.jpg',
      photos: [
        'https://i.ibb.co.com/7xTgnxsj/Whats-App-Image-2025-12-21-at-15-55-57-0a9c637a.jpg',
        'https://i.ibb.co.com/hFkTKLP7/Whats-App-Image-2025-12-21-at-15-55-57-81e2d99f.jpg',
        'https://i.ibb.co.com/vxcVhwPf/Whats-App-Image-2025-12-21-at-15-55-58-4c40b741.jpg',
        'https://i.ibb.co.com/qFgJxvgy/Whats-App-Image-2025-12-21-at-15-57-03-9d0c86c4.jpg',
        'https://i.ibb.co.com/0VndhjdF/Whats-App-Image-2025-12-21-at-15-57-20-5ffc7f2f.jpg',
      ],
    },
    {
      id: 6,
      title: 'Renang',
      date: '20 Nov 2025',
      location: 'Gajah Mada Sport Center',
      cover: 'https://i.ibb.co.com/vxPLdTVM/WShats-App-Image-2025-12-21-at-15-55-54-ab86e9f2.jpg',
      photos: [
        'https://i.ibb.co.com/TBGRKkSc/Whats-App-Image-2025-12-21-at-15-55-54-ab86e9f2.jpg',
        'https://i.ibb.co.com/xKJ9bGZ0/Whats-App-Image-2025-12-21-at-15-55-54-d13d9aab.jpg',
        'https://i.ibb.co.com/1G7NPYcN/Whats-App-Image-2025-12-21-at-18-56-54-6ae1acce.jpg',
        'https://i.ibb.co.com/0y51x6qZ/Whats-App-Image-2025-12-21-at-18-56-53-e840ccf9.jpg',
        'https://i.ibb.co.com/YmqytZw/Whats-App-Image-2025-12-21-at-18-56-54-5befa79b.jpg',
        'https://i.ibb.co.com/mCn3W81q/Whats-App-Image-2025-12-21-at-18-56-53-b86dff10.jpg',
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
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
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
              className="group transform cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800"
            >
              {/* Cover Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={album.cover}
                  alt={album.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                        <img src={photo} alt="" className="h-full w-full object-cover" />
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
            <div
              className="relative flex flex-1 items-center justify-center overflow-hidden p-4"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              {/* Previous Button */}
              <button
                onClick={prevImage}
                className={`absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20 ${
                  isOpening ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
                } delay-200 duration-500`}
              >
                <ChevronLeft className="h-8 w-8" />
              </button>

              {/* Image */}
              <div
                className={`flex max-h-full max-w-5xl items-center justify-center transition-all duration-700 ${
                  isOpening ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                } delay-100`}
                onDoubleClick={handleDoubleClick}
              >
                <img
                  src={selectedAlbum.photos[currentImageIndex]}
                  alt={`${selectedAlbum.title} - ${currentImageIndex + 1}`}
                  className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-2xl select-none"
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
                className={`absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20 ${
                  isOpening ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
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
                      className={`relative h-13 w-13 flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                        idx === currentImageIndex
                          ? 'scale-90 border-2 ring-4 ring-indigo-500'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
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
