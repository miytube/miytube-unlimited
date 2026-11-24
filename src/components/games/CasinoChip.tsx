import React from 'react';
import { ChipDenomination, chipBreakdown, chipDenomination } from '@/lib/chips';
import { cn } from '@/lib/utils';

/** CSS variables that color a chip from the design tokens. */
export const chipStyle = (value: number): React.CSSProperties => {
  const d: ChipDenomination = chipDenomination(value);
  const vars: Record<string, string> = { '--chip': `var(--chip-${d})` };
  if (d === 1) {
    vars['--chip-stripe-local'] = 'var(--chip-10)';
    vars['--chip-ink-local'] = 'var(--suit-black)';
  }
  return vars as React.CSSProperties;
};

const SIZES = {
  sm: 'h-8 w-8',
  md: 'h-11 w-11',
  lg: 'h-11 w-11 min-[400px]:h-14 min-[400px]:w-14 sm:h-16 sm:w-16',
} as const;

interface CasinoChipProps {
  value: number;
  size?: keyof typeof SIZES;
  label?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** A molded clay casino chip in the denomination's color. */
export const CasinoChip: React.FC<CasinoChipProps> = ({ value, size = 'md', label = true, className, style }) => (
  <span className={cn('casino-chip shrink-0', SIZES[size], className)} style={{ ...chipStyle(value), ...style }} aria-hidden="true">
    {label && <span className="font-serif text-[30cqw] font-extrabold tracking-tight">{value}</span>}
  </span>
);

const MAX_VISIBLE = 9;

/** A stack of chips that adds up to the amount, with the total on a tag below. */
export const ChipStack: React.FC<{ amount: number; className?: string; animation?: string; delay?: number }> = ({
  amount,
  className,
  animation = 'animate-chip-drop',
  delay = 0,
}) => {
  const chips = chipBreakdown(amount).slice(0, MAX_VISIBLE);
  if (chips.length === 0) return null;
  return (
    <div className={cn('flex flex-col items-center', animation, className)} style={{ animationDelay: `${delay}ms` }}>
      <div className="relative h-11 w-11" style={{ marginTop: `${(chips.length - 1) * 4}px` }}>
        {chips.map((v, i) => (
          <CasinoChip
            key={i}
            value={v}
            label={i === chips.length - 1}
            className="absolute inset-0"
            style={{ transform: `translateY(${-i * 4}px)`, zIndex: i }}
          />
        ))}
      </div>
      <span className="mt-1 rounded-full bg-rail-leather/80 px-2 text-[11px] font-bold tabular-nums text-gold">{amount.toLocaleString()}</span>
    </div>
  );
};

/** A silkscreened betting circle on the felt. */
export const BetSpot: React.FC<{
  label: string;
  amount?: number;
  payout?: number;
  payoutDelay?: number;
  /** Fade the stack out once the dealer takes it. */
  lost?: boolean;
  className?: string;
}> = ({ label, amount = 0, payout = 0, payoutDelay = 0, lost, className }) => (
  <div className={cn('flex items-end gap-3', className)}>
    <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold/60 shadow-[inset_0_0_18px_hsl(var(--suit-black)/0.35)]">
      <span className="absolute inset-1.5 rounded-full border border-dashed border-gold/40" />
      {amount > 0 ? (
        <div
          className={cn('relative -mt-2 transition-all duration-500', lost && '-translate-y-6 opacity-0')}
          style={{ transitionDelay: lost ? `${payoutDelay}ms` : '0ms' }}
        >
          <ChipStack key={amount} amount={amount} />
        </div>
      ) : (
        <span className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-gold/80">{label}</span>
      )}
    </div>
    {payout > 0 && (
      <ChipStack key={`p-${payout}`} amount={payout} animation="animate-payout-slide" delay={payoutDelay} className="mb-1" />
    )}
  </div>
);

/** The chip tray players tap to pick a bet. */
export const ChipPicker: React.FC<{
  values: readonly number[];
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  isAffordable: (v: number) => boolean;
  label: string;
}> = ({ values, value, onChange, disabled, isAffordable, label }) => (
  <div
    className="flex flex-wrap justify-center gap-2 rounded-2xl bg-rail-leather/70 px-2 py-2.5 sm:px-3 shadow-[inset_0_2px_6px_hsl(var(--suit-black)/0.6)] max-[399px]:gap-1 sm:gap-3"
    role="radiogroup"
    aria-label={label}
  >
    {values.map((v) => {
      const selected = value === v;
      return (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={selected}
          aria-label={`${v} coins`}
          onClick={() => onChange(v)}
          disabled={disabled}
          className={cn(
            'rounded-full transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
            selected ? '-translate-y-2 drop-shadow-[0_0_10px_hsl(var(--gold)/0.7)]' : 'hover:-translate-y-1',
            !isAffordable(v) && 'opacity-40',
          )}
        >
          <CasinoChip value={v} size="lg" className={cn(selected && 'ring-2 ring-gold ring-offset-2 ring-offset-rail-leather')} />
        </button>
      );
    })}
  </div>
);
