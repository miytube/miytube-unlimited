import React from 'react';
import { cn } from '@/lib/utils';
import { chipStyle } from './CasinoChip';
import { TableActivity } from './TableActivity';

/**
 * A casino table: mahogany bumper, padded leather armrest and felt under an
 * overhead spotlight. "half-moon" is a blackjack table, "oval" a poker table,
 * "rounded" a banker table with room for two hands each.
 */
export const CasinoTable: React.FC<{ shape?: 'half-moon' | 'oval' | 'rounded'; className?: string; children: React.ReactNode }> = ({
  shape = 'oval',
  className,
  children,
}) => {
  const radius =
    shape === 'half-moon'
      ? 'rounded-t-[1.75rem] rounded-b-[3.5rem] sm:rounded-b-[50%_22%]'
      : shape === 'oval'
        ? 'rounded-[2.5rem] sm:rounded-[7rem]'
        : 'rounded-[2rem] sm:rounded-[3rem]';
  return (
    <>
    <TableActivity />
    <div className={cn('casino-rail p-3 sm:p-5', radius, className)}>
      <div className={cn('casino-felt overflow-hidden text-felt-foreground', radius)}>{children}</div>
    </div>
    </>
  );
};

/** Printed house rules stay readable instead of shrinking with an SVG viewport. */
export const TableArc: React.FC<{ lines: [string, string?]; className?: string }> = ({ lines, className }) => {
  return (
    <div className={cn('w-full max-w-2xl py-4 text-center text-gold', className)}>
      <p className="font-serif text-lg font-bold">{lines[0]}</p>
      {lines[1] && <p className="mt-1 text-base font-semibold text-felt-foreground">{lines[1]}</p>}
    </div>
  );
};

const RACK = [500, 250, 100, 50, 25, 10];

/** The dealer's chip rack: columns of chips seen edge-on. */
export const ChipRack: React.FC<{ className?: string }> = ({ className }) => (
  <div
    aria-hidden="true"
    className={cn('flex gap-1 rounded-b-xl bg-rail-wood px-2 pb-2 pt-1 shadow-[inset_0_-3px_6px_hsl(var(--suit-black)/0.5),0_6px_12px_-4px_hsl(var(--suit-black)/0.6)]', className)}
  >
    {RACK.map((v, i) => (
      <span key={v} className="chip-column block w-3.5 rounded-sm sm:w-4" style={{ ...chipStyle(v), height: `${34 + ((i * 7) % 12)}px` }} />
    ))}
  </div>
);

/** A dealing shoe with the next card peeking out. */
export const DealerShoe: React.FC<{ className?: string }> = ({ className }) => (
  <div aria-hidden="true" className={cn('relative h-16 w-14 rotate-12', className)}>
    <div className="absolute inset-x-1 top-1 h-12 rounded-sm bg-card-back shadow-md" />
    <div className="absolute inset-0 rounded-md bg-rail-leather shadow-[inset_0_2px_0_hsl(var(--chip-stripe)/0.15),0_8px_14px_-4px_hsl(var(--suit-black)/0.7)] [clip-path:polygon(0_22%,100%_0,100%_100%,0_100%)]" />
    <div className="absolute bottom-1 left-1 right-1 h-1 rounded-full bg-gold/60" />
  </div>
);

/** A discard tray with a few spent cards. */
export const DiscardTray: React.FC<{ className?: string }> = ({ className }) => (
  <div aria-hidden="true" className={cn('relative h-14 w-12 -rotate-12', className)}>
    <div className="absolute inset-0 rounded-md border border-gold/30 bg-rail-leather/60" />
    {[0, 1, 2].map((i) => (
      <div key={i} className="absolute inset-x-1.5 h-10 rounded-sm bg-card-back ring-2 ring-playing-card" style={{ top: `${6 - i * 2}px`, transform: `rotate(${i * 4 - 4}deg)` }} />
    ))}
  </div>
);

/** Shared result banner that waits for the cards to land before showing. */
export const ResultBanner: React.FC<{ title: string; tone: 'win' | 'push' | 'lose'; delay?: number }> = ({ title, tone, delay = 0 }) => (
  <div
    style={{ animationDelay: `${delay}ms` }}
    className={cn(
      'max-w-full rounded-lg px-5 py-3 text-center font-serif text-xl font-bold shadow-xl animate-in zoom-in-75 fade-in fill-mode-both duration-300',
      tone === 'win' && 'bg-gold text-gold-foreground ring-2 ring-playing-card/60',
      tone === 'push' && 'bg-felt-foreground text-felt-deep',
      tone === 'lose' && 'bg-rail-leather text-felt-foreground ring-1 ring-gold/40',
    )}
  >
    {title}
  </div>
);

/** Small leather tag naming a seat and its total or hand. */
export const SeatTag: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <span className="max-w-full rounded-lg bg-rail-leather px-3 py-2 text-center text-lg font-semibold text-felt-foreground shadow-inner">
    {label}
    {value && <span className="ml-1.5 text-gold">{value}</span>}
  </span>
);
