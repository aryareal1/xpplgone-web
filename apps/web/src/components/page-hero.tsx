import type { ReactNode } from 'react';

// Same look as the leaderboard banner: pastel card, yellow ">_" pill, title, desc.
export default function PageHero(props: {
  pill: string;
  title: string;
  desc: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-brand-blue/25 bg-pastel-blue/50 relative mb-8 overflow-hidden rounded-[2rem] border-2 p-6 sm:p-8 dark:border-blue-400/20 dark:bg-blue-500/10">
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: purely decorative circle, hidden from screen readers */}
      <svg
        className="pointer-events-none absolute -top-24 -right-24 size-72 text-white/60 dark:text-white/10"
        viewBox="0 0 600 600"
        fill="none"
        aria-hidden
      >
        <circle cx="300" cy="300" r="270" stroke="currentColor" strokeWidth="36" />
        <circle cx="300" cy="300" r="170" stroke="currentColor" strokeWidth="36" />
      </svg>

      <div className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div className="min-w-0 flex-1">
          <span className="border-brand-navy bg-brand-yellow text-brand-navy inline-flex items-center gap-2 rounded-full border-2 px-3.5 py-1 text-[11px] font-black tracking-[0.14em] uppercase shadow-[0_3px_0_0_#0a2540]">
            <span className="font-mono" aria-hidden>
              &gt;_
            </span>
            {props.pill}
          </span>
          <h1 className="font-display text-brand-navy mt-3 text-3xl font-black tracking-tight sm:text-5xl dark:text-white">
            {props.title}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed font-medium sm:text-base">
            {props.desc}
          </p>
        </div>
        {props.children && (
          <div className="flex w-full shrink-0 justify-center sm:w-auto sm:justify-end">
            {props.children}
          </div>
        )}
      </div>
    </header>
  );
}
