import React from 'react';
import { cn } from '@/lib/utils';

// Pip positions on a 3x3 grid (0..8) for faces 1..6.
const PIPS: Record<number, number[]> = {
  1: [4],
  2: [2, 6],
  3: [2, 4, 6],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

interface DieProps {
  value: number;
  rolling?: boolean;
  size?: 'sm' | 'lg';
  className?: string;
}

/** An ivory die with red pips for 1 and 4, like a Chinese Sic Bo shaker. */
export const Die: React.FC<DieProps> = ({ value, rolling, size = 'lg', className }) => {
  const red = value === 1 || value === 4;
  return (
    <div
      aria-label={`Die showing ${value}`}
      className={cn(
        'grid grid-cols-3 grid-rows-3 rounded-xl border border-border bg-playing-card shadow-lg',
        size === 'lg' ? 'h-16 w-16 gap-1 p-2 sm:h-20 sm:w-20 sm:p-2.5' : 'h-7 w-7 gap-px rounded-md p-1',
        rolling && 'animate-bounce',
        className,
      )}
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} className="flex items-center justify-center">
          {PIPS[value]?.includes(i) && (
            <span className={cn('block rounded-full', size === 'lg' ? 'h-3 w-3 sm:h-3.5 sm:w-3.5' : 'h-1 w-1', red ? 'bg-suit-red' : 'bg-suit-black')} />
          )}
        </span>
      ))}
    </div>
  );
};
