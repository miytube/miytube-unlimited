import React from 'react';
import { SUIT_SYMBOL, cardRank, cardSuit, isRedSuit } from '@/lib/blackjack';
import { cn } from '@/lib/utils';

interface PlayingCardProps {
  card?: number;
  faceDown?: boolean;
  index?: number;
  className?: string;
}

/** One ivory playing card, or a gold-trimmed back when face down. */
export const PlayingCard: React.FC<PlayingCardProps> = ({ card, faceDown, index = 0, className }) => {
  const style = { animationDelay: `${index * 90}ms` } as React.CSSProperties;
  const base =
    'relative h-28 w-20 sm:h-36 sm:w-[6.5rem] shrink-0 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-6 fill-mode-both duration-300';

  if (faceDown || card === undefined) {
    return (
      <div
        style={style}
        aria-label="Face-down card"
        className={cn(base, 'border-2 border-gold bg-felt-deep p-1.5', className)}
      >
        <div className="flex h-full w-full items-center justify-center rounded-md border border-gold/50 bg-[repeating-linear-gradient(45deg,hsl(var(--gold)/0.18)_0_6px,transparent_6px_12px)]">
          <span className="font-serif text-lg font-bold tracking-widest text-gold">M</span>
        </div>
      </div>
    );
  }

  const rank = cardRank(card);
  const suit = cardSuit(card);
  const symbol = SUIT_SYMBOL[suit];
  const color = isRedSuit(suit) ? 'text-suit-red' : 'text-suit-black';

  return (
    <div
      style={style}
      aria-label={`${rank} of ${suit}`}
      className={cn(base, 'border border-border bg-playing-card', color, className)}
    >
      <div className="absolute left-1.5 top-1 flex flex-col items-center leading-none">
        <span className="font-serif text-base font-bold sm:text-lg">{rank}</span>
        <span className="text-sm sm:text-base">{symbol}</span>
      </div>
      <div className="flex h-full items-center justify-center text-4xl sm:text-5xl">{symbol}</div>
      <div className="absolute bottom-1 right-1.5 flex rotate-180 flex-col items-center leading-none">
        <span className="font-serif text-base font-bold sm:text-lg">{rank}</span>
        <span className="text-sm sm:text-base">{symbol}</span>
      </div>
    </div>
  );
};
