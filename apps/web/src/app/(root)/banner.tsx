'use client';

import { SITE_NAME } from '@xirpl/shared';
import {
  motion as m,
  stagger,
  useReducedMotion,
  type Variants,
} from 'motion/react';
import Image from 'next/image';
import XiRplMascot from '@fe/components/mascot/Mascot';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.12),
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Banner() {
  const reduce = useReducedMotion();

  return (
    <section
      id="banner"
      className="relative mb-8 w-full overflow-hidden border-b-4 border-[#1268b8] bg-[#1E88E5] py-10 sm:mb-12 sm:py-14 md:py-18 lg:py-22"
    >
      {/* Repeating diagonal line stripes (45deg) for the entire banner width
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #ffffff 0,
              #ffffff 1px,
              transparent 2px,
              transparent 26px
            )`,
          }}
          aria-hidden="true"
        /> */}

        {/* Repeating diagonal line stripes (-45deg) for the entire banner width */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              #ffffff 0,
              #ffffff 1px,
              transparent 2px,
              transparent 26px
            )`,
          }}
          aria-hidden="true"
        />
      
      {/* Decorative wide-band concentric circles at bottom-left */}
      <svg
        className="pointer-events-none absolute -bottom-48 -left-48 size-[580px] sm:size-[680px] text-white/10"
        viewBox="0 0 600 600"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="300" cy="300" r="270" stroke="currentColor" strokeWidth="36" />
        <circle cx="300" cy="300" r="190" stroke="currentColor" strokeWidth="36" />
        <circle cx="300" cy="300" r="110" stroke="currentColor" strokeWidth="36" />
      </svg>

      {/* Decorative wide-band concentric circles at top-right */}
      <svg
        className="pointer-events-none absolute -top-48 -right-48 size-[580px] sm:size-[680px] text-white/10"
        viewBox="0 0 600 600"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="300" cy="300" r="270" stroke="currentColor" strokeWidth="36" />
        <circle cx="300" cy="300" r="190" stroke="currentColor" strokeWidth="36" />
        <circle cx="300" cy="300" r="110" stroke="currentColor" strokeWidth="36" />
      </svg>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-360 px-4 sm:px-8 lg:px-12">
        <m.div
          className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-8 lg:gap-14"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Left Column: Heading & Branding */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            {/* Yellow pill badge */}
            <m.div variants={itemVariants} className="mb-4 sm:mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#0a2540] bg-brand-yellow px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-brand-navy shadow-[0_3px_0_0_#0a2540]">
                <span className="font-mono text-[11px] font-black" aria-hidden="true">
                  &gt;_
                </span>
                CLASS PORTAL
              </span>
            </m.div>

            {/* Subheading */}
            <m.p
              variants={itemVariants}
              className="font-display text-lg font-bold tracking-tight text-white uppercase sm:text-xl md:text-2xl lg:text-3xl"
            >
              Welcome to the class of
            </m.p>

            {/* Dominant Display Heading */}
            <m.h1
              variants={itemVariants}
              className="font-display my-2 text-6xl font-black tracking-tight text-white sm:text-7xl md:my-3 md:text-8xl lg:text-9xl leading-none drop-shadow-md"
            >
              {SITE_NAME}
            </m.h1>

            {/* Subline */}
            <m.p
              variants={itemVariants}
              className="font-display text-lg font-bold text-white sm:text-xl md:text-2xl lg:text-3xl"
            >
              of{' '}
              <strong className="font-black text-brand-yellow drop-shadow-xs">
                SMK N 1 Kandeman
              </strong>
            </m.p>
          </div>

          {/* Right Column: Polaroid Photo Frame with Stickers & Robot Terminal */}
          <m.div
            variants={itemVariants}
            className="flex items-center justify-center md:justify-end"
          >
            <m.div
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-full max-w-[360px] sm:max-w-[440px] md:max-w-[480px] lg:max-w-[520px]"
            >
              {/* Dark Navy Shadow Plate / Backing Layer */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl sm:rounded-[2.25rem] bg-[#0c3e70] opacity-80" />

              {/* White Polaroid Card */}
              <div className="relative rotate-[-3deg] rounded-3xl sm:rounded-[2.25rem] border-[3px] border-[#0a2540] bg-white p-3 pb-4 sm:p-4 sm:pb-5 shadow-2xl dark:bg-white">
                {/* Main Photo */}
                <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl border-2 border-[#0a2540] bg-slate-900 shadow-inner">
                  <Image
                    src="/images/banner-1.jpg"
                    alt="Foto Bersama Siswa XI RPL"
                    fill
                    priority
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 540px"
                    className="object-cover"
                  />

                  {/* Bottom-left sticker on photo: </> RPL */}
                  <div className="absolute bottom-3 left-3 z-20">
                    <span className="inline-flex -rotate-6 items-center gap-1 rounded-xl border-2 border-[#0a2540] bg-brand-yellow px-3 py-1 text-xs font-black text-brand-navy shadow-[0_3px_0_0_#0a2540] sm:text-sm">
                      &lt;/&gt; RPL
                    </span>
                  </div>
                </div>

                {/* Sticker on right edge of polaroid: </> */}
                <div className="absolute -right-3.5 top-1/2 z-30 -translate-y-8">
                  <span className="inline-flex rotate-12 items-center justify-center rounded-xl border-2 border-[#0a2540] bg-brand-yellow px-2.5 py-1.5 text-xs font-black text-brand-navy shadow-[0_3px_0_0_#0a2540] sm:px-3 sm:py-2 sm:text-sm">
                    &lt;/&gt;
                  </span>
                </div>

                {/* Overlapping Mascot on bottom right */}
                <div className="pointer-events-none absolute -bottom-8 -right-6 z-30 w-44 sm:-bottom-10 sm:-right-8 sm:w-56 md:-bottom-12 md:-right-10 md:w-64 lg:w-72">
                  <XiRplMascot
                    size={360}
                    className="h-auto w-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.35)]"
                  />
                </div>

                {/* Polaroid Frame Footer */}
                <div className="flex items-center justify-between px-1.5 pt-3 sm:pt-4">
                  <p className="text-sm font-black tracking-tight text-slate-800 sm:text-base">
                    SMK N 1 Kandeman
                  </p>

                  <div className="relative size-10 overflow-hidden rounded-xl border-2 border-[#0a2540] shadow-sm sm:size-12">
                    <Image
                      src="/images/banner-2.jpg"
                      alt="Thumbnail kegiatan"
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </m.div>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
