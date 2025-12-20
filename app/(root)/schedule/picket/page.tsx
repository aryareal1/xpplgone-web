'use client';

import React from 'react';
import { useEffect, useState } from 'react';

export default function PicketSchedule() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  0;

  if (!mounted) {
    return null;
  }
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950">
        {/* Header */}
        <div className="px-4 pt-12 pb-8">
          <h1 className="mb-2 text-center text-5xl font-black tracking-tight md:text-7xl">
            <span className="animate-pulse bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-2xl">
              JADWAL PIKET
            </span>
          </h1>
          <h2 className="text-center text-4xl font-black tracking-tight md:text-6xl">
            <span className="animate-pulse bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-2xl">
              X PPLG 1
            </span>
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* SENIN */}
            <div
              className="animate-in slide-in-from-bottom-4 fade-in relative rounded-3xl border-2 border-blue-500/30 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl shadow-[0_0_5px_rgba(59,130,246,0.5),0_0_10px_rgba(59,130,246,0.3),inset_0_0_5px_rgba(59,130,246,0.2)] transition-all duration-300 duration-700 hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-blue-500/40"
              style={{ animationDelay: '0ms' }}
            >
              {/* Globe Icon */}
              <div className="absolute -top-6 -left-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-blue-500 bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl shadow-blue-500/50">
                <div className="text-3xl">🌐</div>
              </div>

              {/* Computer Screen Header */}
              <div className="relative mt-4 mb-6">
                <div className="relative rounded-2xl border-2 border-blue-400/50 bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg shadow-blue-500/30">
                  <div className="absolute -top-2 -left-2 h-8 w-8 rounded border-2 border-blue-400 bg-cyan-400/20"></div>
                  <h3 className="text-center text-2xl font-black tracking-wider text-white">
                    SENIN
                  </h3>
                </div>
                <div className="mx-auto h-4 w-2 bg-gradient-to-b from-blue-600 to-transparent"></div>
                <div className="mx-auto h-2 w-16 rounded-full bg-blue-500/50"></div>
              </div>

              {/* Names List */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Dila</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Intan</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Fadhil</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Vina</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Syifa</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Khansa</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Roichan</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Auliya</span>
                </div>
              </div>

              {/* Illustration Icon */}
              <div className="absolute -right-4 -bottom-4 rotate-12 transform text-6xl opacity-70 drop-shadow-lg transition-transform duration-300 hover:scale-110 hover:rotate-0">
                🧹
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-cyan-400/50 shadow-sm shadow-cyan-400/50"></div>
              <div className="absolute bottom-8 left-4 h-2 w-2 rounded-full bg-blue-400/50 shadow-sm shadow-blue-400/50"></div>
            </div>

            {/* SELASA */}
            <div
              className="animate-in slide-in-from-bottom-4 fade-in relative rounded-3xl border-2 border-blue-500/30 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl shadow-[0_0_5px_rgba(59,130,246,0.5),0_0_10px_rgba(59,130,246,0.3),inset_0_0_5px_rgba(59,130,246,0.2)] transition-all duration-300 duration-700 hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-blue-500/40"
              style={{ animationDelay: '100ms' }}
            >
              <div className="absolute -top-6 -left-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-blue-500 bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl shadow-blue-500/50">
                <div className="text-3xl">🌐</div>
              </div>

              <div className="relative mt-4 mb-6">
                <div className="relative rounded-2xl border-2 border-blue-400/50 bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg shadow-blue-500/30">
                  <div className="absolute -top-2 -left-2 h-8 w-8 rounded border-2 border-blue-400 bg-cyan-400/20"></div>
                  <h3 className="text-center text-2xl font-black tracking-wider text-white">
                    SELASA
                  </h3>
                </div>
                <div className="mx-auto h-4 w-2 bg-gradient-to-b from-blue-600 to-transparent"></div>
                <div className="mx-auto h-2 w-16 rounded-full bg-blue-500/50"></div>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Talita</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Dwi</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Rizka</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Dita</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Viko</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Raya</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Nafa</span>
                </div>
              </div>

              <div className="absolute -right-4 -bottom-4 rotate-12 transform text-6xl opacity-70 drop-shadow-lg transition-transform duration-300 hover:scale-110 hover:rotate-0">
                🌿
              </div>
              <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-cyan-400/50 shadow-sm shadow-cyan-400/50"></div>
              <div className="absolute bottom-8 left-4 h-2 w-2 rounded-full bg-blue-400/50 shadow-sm shadow-blue-400/50"></div>
            </div>

            {/* RABU */}
            <div
              className="animate-in slide-in-from-bottom-4 fade-in relative rounded-3xl border-2 border-blue-500/30 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl shadow-[0_0_5px_rgba(59,130,246,0.5),0_0_10px_rgba(59,130,246,0.3),inset_0_0_5px_rgba(59,130,246,0.2)] transition-all duration-300 duration-700 hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-blue-500/40"
              style={{ animationDelay: '200ms' }}
            >
              <div className="absolute -top-6 -left-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-blue-500 bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl shadow-blue-500/50">
                <div className="text-3xl">🌐</div>
              </div>

              <div className="relative mt-4 mb-6">
                <div className="relative rounded-2xl border-2 border-blue-400/50 bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg shadow-blue-500/30">
                  <div className="absolute -top-2 -left-2 h-8 w-8 rounded border-2 border-blue-400 bg-cyan-400/20"></div>
                  <h3 className="text-center text-2xl font-black tracking-wider text-white">
                    RABU
                  </h3>
                </div>
                <div className="mx-auto h-4 w-2 bg-gradient-to-b from-blue-600 to-transparent"></div>
                <div className="mx-auto h-2 w-16 rounded-full bg-blue-500/50"></div>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Fayakun</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Nikma</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Iqbal</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Fatimah</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Gading</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Noval</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Vano</span>
                </div>
              </div>

              <div className="absolute -right-4 -bottom-4 rotate-12 transform text-6xl opacity-70 drop-shadow-lg transition-transform duration-300 hover:scale-110 hover:rotate-0">
                🧼
              </div>
              <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-cyan-400/50 shadow-sm shadow-cyan-400/50"></div>
              <div className="absolute bottom-8 left-4 h-2 w-2 rounded-full bg-blue-400/50 shadow-sm shadow-blue-400/50"></div>
            </div>

            {/* KAMIS */}
            <div
              className="animate-in slide-in-from-bottom-4 fade-in relative rounded-3xl border-2 border-blue-500/30 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl shadow-[0_0_5px_rgba(59,130,246,0.5),0_0_10px_rgba(59,130,246,0.3),inset_0_0_5px_rgba(59,130,246,0.2)] transition-all duration-300 duration-700 hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-blue-500/40"
              style={{ animationDelay: '300ms' }}
            >
              <div className="absolute -top-6 -left-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-blue-500 bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl shadow-blue-500/50">
                <div className="text-3xl">🌐</div>
              </div>

              <div className="relative mt-4 mb-6">
                <div className="relative rounded-2xl border-2 border-blue-400/50 bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg shadow-blue-500/30">
                  <div className="absolute -top-2 -left-2 h-8 w-8 rounded border-2 border-blue-400 bg-cyan-400/20"></div>
                  <h3 className="text-center text-2xl font-black tracking-wider text-white">
                    KAMIS
                  </h3>
                </div>
                <div className="mx-auto h-4 w-2 bg-gradient-to-b from-blue-600 to-transparent"></div>
                <div className="mx-auto h-2 w-16 rounded-full bg-blue-500/50"></div>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Bambang</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Salwa</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Arya</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Nadia</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Natasya</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Yunita</span>
                </div>
                <div className="flex items-center text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Leny</span>
                </div>
              </div>

              <div className="absolute -right-4 -bottom-4 rotate-12 transform text-6xl opacity-70 drop-shadow-lg transition-transform duration-300 hover:scale-110 hover:rotate-0">
                🧴
              </div>
              <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-cyan-400/50 shadow-sm shadow-cyan-400/50"></div>
              <div className="absolute bottom-8 left-4 h-2 w-2 rounded-full bg-blue-400/50 shadow-sm shadow-blue-400/50"></div>
            </div>

            {/* JUM'AT */}
            <div
              className="animate-in slide-in-from-bottom-4 fade-in relative col-span-1 mx-auto w-full max-w-md rounded-3xl border-2 border-blue-500/30 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl shadow-[0_0_5px_rgba(59,130,246,0.5),0_0_10px_rgba(59,130,246,0.3),inset_0_0_5px_rgba(59,130,246,0.2)] transition-all duration-300 duration-700 hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-blue-500/40 md:col-span-2"
              style={{ animationDelay: '400ms' }}
            >
              <div className="absolute -top-6 -left-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-blue-500 bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl shadow-blue-500/50">
                <div className="text-3xl">🌐</div>
              </div>

              <div className="relative mt-4 mb-6">
                <div className="relative rounded-2xl border-2 border-blue-400/50 bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg shadow-blue-500/30">
                  <div className="absolute -top-2 -left-2 h-8 w-8 rounded border-2 border-blue-400 bg-cyan-400/20"></div>
                  <h3 className="text-center text-2xl font-black tracking-wider text-white">
                    JUM&apos;AT
                  </h3>
                </div>
                <div className="mx-auto h-4 w-2 bg-gradient-to-b from-blue-600 to-transparent"></div>
                <div className="mx-auto h-2 w-16 rounded-full bg-blue-500/50"></div>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-3 text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Bunga</span>
                </div>
                <div className="flex items-center gap-3 text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Akmal</span>
                </div>
                <div className="flex items-center gap-3 text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Tyas</span>
                </div>
                <div className="flex items-center gap-3 text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Adit</span>
                </div>
                <div className="flex items-center gap-3 text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Siti</span>
                </div>
                <div className="flex items-center gap-3 text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Fajri</span>
                </div>
                <div className="flex items-center gap-3 text-gray-100">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                  <span className="flex-1 text-center text-lg font-bold">Nanda</span>
                </div>
              </div>

              <div className="absolute -right-4 -bottom-4 rotate-12 transform text-6xl opacity-70 drop-shadow-lg transition-transform duration-300 hover:scale-110 hover:rotate-0">
                🧽
              </div>
              <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-cyan-400/50 shadow-sm shadow-cyan-400/50"></div>
              <div className="absolute bottom-8 left-4 h-2 w-2 rounded-full bg-blue-400/50 shadow-sm shadow-blue-400/50"></div>
            </div>
          </div>

          {/* Info Footer */}
          <div
            className="animate-in slide-in-from-bottom-4 fade-in mt-8 text-center duration-700"
            style={{ animationDelay: '500ms' }}
          >
            <div className="inline-block rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-[0_0_5px_rgba(59,130,246,0.5),0_0_10px_rgba(59,130,246,0.3),inset_0_0_5px_rgba(59,130,246,0.2)] shadow-xl shadow-blue-500/20">
              <p className="text-lg font-bold text-cyan-400">📋 Jadwal Piket Kelas X PPLG 1</p>
              <p className="mt-2 text-sm text-blue-300">
                Pastikan untuk mengikuti jadwal piket dengan baik! 🧹✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
