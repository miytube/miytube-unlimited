import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Upload, Sparkles } from 'lucide-react';

export const SLOGAN = 'We Got your Snapshot';

/** Variant A — Homepage hero band. Large, centered, gradient wordmark. */
export const SloganHero: React.FC = () => (
  <section className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/15 via-background to-primary/5 px-6 py-10 text-center animate-fade-in">
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
      <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
        <Camera className="h-3.5 w-3.5" /> MiyTube
      </span>
      <h2 className="bg-gradient-to-r from-primary to-foreground bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
        {SLOGAN}
      </h2>
      <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
        Every moment, every highlight, every clip — uploaded, shared and watched
        without limits.
      </p>
      <Link
        to="/upload"
        className="mt-1 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Upload className="h-4 w-4" /> Start uploading
      </Link>
    </div>
  </section>
);

/** Variant B — Thin scrolling ticker strip that sits above the header. */
export const SloganTicker: React.FC = () => {
  const items = Array.from({ length: 6 });
  return (
    <div className="w-full overflow-hidden border-b border-border bg-primary text-primary-foreground">
      <div className="flex whitespace-nowrap py-1.5 [animation:slogan-marquee_25s_linear_infinite]">
        {items.map((_, i) => (
          <span
            key={i}
            className="mx-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {SLOGAN}
          </span>
        ))}
        {items.map((_, i) => (
          <span
            key={`dup-${i}`}
            className="mx-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {SLOGAN}
          </span>
        ))}
      </div>
    </div>
  );
};

/** Variant C — Bold dedicated announcement banner pinned above the navigation. */
export const SloganBanner: React.FC = () => (
  <div className="w-full bg-gradient-to-r from-primary via-primary/80 to-primary/60">
    <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-4 py-3 text-primary-foreground sm:flex-row">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15">
          <Camera className="h-4.5 w-4.5" />
        </span>
        <div className="leading-tight">
          <p className="text-lg font-extrabold tracking-tight sm:text-xl">{SLOGAN}</p>
          <p className="text-xs opacity-85">Upload it. Share it. Watch it. On MiyTube.</p>
        </div>
      </div>
      <Link
        to="/upload"
        className="rounded-md bg-primary-foreground px-4 py-2 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
      >
        Upload now
      </Link>
    </div>
  </div>
);
