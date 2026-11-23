import React, { useState } from 'react';
import { cardRank, cardSuit, isRedSuit } from '@/lib/blackjack';
import { cn } from '@/lib/utils';
import { SuitIcon } from './SuitIcon';
import { CourtFigure } from './CourtFigure';

interface PlayingCardProps {
  card?: number;
  faceDown?: boolean;
  /** Deal order; staggers the slide-in when no dealDelay is given. */
  index?: number;
  /** Milliseconds before this card slides in from the shoe (read once, on first draw). */
  dealDelay?: number;
  /** Milliseconds before a face-down card turns over when it is revealed. */
  flipDelay?: number;
  className?: string;
}

// Pip centers as [x%, y%] of the card, standard casino layouts.
const L = 31;
const C = 50;
const R = 69;
const PIPS: Record<string, [number, number][]> = {
  '2': [[C, 18], [C, 82]],
  '3': [[C, 18], [C, 50], [C, 82]],
  '4': [[L, 18], [R, 18], [L, 82], [R, 82]],
  '5': [[L, 18], [R, 18], [C, 50], [L, 82], [R, 82]],
  '6': [[L, 18], [R, 18], [L, 50], [R, 50], [L, 82], [R, 82]],
  '7': [[L, 18], [R, 18], [C, 34], [L, 50], [R, 50], [L, 82], [R, 82]],
  '8': [[L, 18], [R, 18], [C, 34], [L, 50], [R, 50], [C, 66], [L, 82], [R, 82]],
  '9': [[L, 18], [R, 18], [L, 39], [R, 39], [C, 50], [L, 61], [R, 61], [L, 82], [R, 82]],
  '10': [[L, 18], [R, 18], [C, 29], [L, 39], [R, 39], [L, 61], [R, 61], [C, 71], [L, 82], [R, 82]],
};

const CornerIndex: React.FC<{ rank: string; suit: ReturnType<typeof cardSuit>; flipped?: boolean }> = ({ rank, suit, flipped }) => (
  <div
    className={cn(
      'absolute flex w-[15cqw] flex-col items-center leading-none',
      flipped ? 'bottom-[4cqw] right-[3.5cqw] rotate-180' : 'left-[3.5cqw] top-[4cqw]',
    )}
  >
    <span className={cn('font-serif font-bold', rank === '10' ? 'text-[16cqw] tracking-[-0.12em]' : 'text-[19cqw]')}>{rank}</span>
    <SuitIcon suit={suit} className="mt-[1.5cqw] w-[13cqw]" />
  </div>
);

const CardFace: React.FC<{ card: number }> = ({ card }) => {
  const rank = cardRank(card);
  const suit = cardSuit(card);
  const court = rank === 'J' || rank === 'Q' || rank === 'K';

  return (
    <div className={cn('playing-card-face h-full w-full rounded-[7cqw]', isRedSuit(suit) ? 'text-suit-red' : 'text-suit-black')}>
      <CornerIndex rank={rank} suit={suit} />
      <CornerIndex rank={rank} suit={suit} flipped />
      {court ? (
        <CourtFigure rank={rank} suit={suit} className="absolute inset-x-[18cqw] inset-y-[16%] h-[68%] w-[64cqw]" />
      ) : rank === 'A' ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {suit === 'spades' ? (
            <span className="relative flex h-[56cqw] w-[56cqw] items-center justify-center rounded-full border-[1.2cqw] border-double border-gold">
              <SuitIcon suit={suit} className="w-[40cqw]" />
            </span>
          ) : (
            <SuitIcon suit={suit} className="w-[40cqw]" />
          )}
        </div>
      ) : (
        PIPS[rank]?.map(([x, y], i) => (
          <SuitIcon
            key={i}
            suit={suit}
            className={cn('absolute w-[20cqw] -translate-x-1/2 -translate-y-1/2', y > 50 && 'rotate-180')}
            style={{ left: `${x}%`, top: `${y}%` }}
          />
        ))
      )}
    </div>
  );
};

const CardBack = () => (
  <div className="playing-card-back h-full w-full rounded-[7cqw]">
    <div className="playing-card-back-inner flex h-full w-full items-center justify-center rounded-[4cqw]">
      <span className="font-serif text-[20cqw] font-bold text-gold">M</span>
    </div>
  </div>
);

/**
 * A casino playing card: linen cardstock, standard pip layouts and illustrated
 * court cards. It slides in from the shoe, and turns over in 3D when revealed.
 */
export const PlayingCard: React.FC<PlayingCardProps> = ({ card, faceDown, index = 0, dealDelay, flipDelay = 0, className }) => {
  // The slide-in plays once per card; later prop changes must not re-time it.
  const [deal] = useState(() => dealDelay ?? index * 90);
  const down = faceDown || card === undefined;
  const label = down ? 'Face-down card' : `${cardRank(card!)} of ${cardSuit(card!)}`;

  return (
    <div
      aria-label={label}
      role="img"
      style={{ animationDelay: `${deal}ms`, containerType: 'inline-size' } as React.CSSProperties}
      className={cn('card-3d card-shadow animate-deal-in relative h-28 w-20 shrink-0 rounded-md sm:h-36 sm:w-[6.5rem] sm:rounded-lg', className)}
    >
      <div className={cn('card-3d-inner rounded-[7cqw]', down && 'is-down')} style={{ transitionDelay: `${flipDelay}ms` }}>
        <div className="card-3d-side">{card !== undefined && <CardFace card={card} />}</div>
        <div className="card-3d-side card-3d-back">
          <CardBack />
        </div>
      </div>
    </div>
  );
};
