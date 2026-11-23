import React from 'react';
import type { Suit } from '@/lib/blackjack';
import { isRedSuit } from '@/lib/blackjack';
import { SuitIcon } from './SuitIcon';
import { cn } from '@/lib/utils';

type Court = 'J' | 'Q' | 'K';

const INK = 'stroke-suit-black';

/** One half of a double-ended court card; the card draws it twice, mirrored. */
const Half: React.FC<{ rank: Court; suit: Suit }> = ({ rank, suit }) => {
  const red = isRedSuit(suit);
  const robe = red ? 'fill-suit-red' : 'fill-court-blue';
  const panel = red ? 'fill-court-blue' : 'fill-suit-red';
  const suitColor = red ? 'text-suit-red' : 'text-suit-black';

  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {/* Suit badge printed inside the frame */}
      <SuitIcon suit={suit} x={rank === 'Q' ? 82 : 5} y={5} width={13} height={13} className={suitColor} />

      {/* Held item, behind the robe */}
      {rank === 'K' && (
        <g>
          <path d="M80 14 L82.4 18 L82.4 57 L79.6 57 L79.6 18 Z" className={cn('fill-playing-card', INK)} strokeWidth={0.7} />
          <path d="M81 19 L81 55" className="stroke-court-blue" strokeWidth={0.5} opacity={0.5} />
          <rect x={74.5} y={57} width={13} height={2.8} rx={1} className={cn('fill-gold', INK)} strokeWidth={0.5} />
          <rect x={80} y={59.8} width={2} height={6} className="fill-rail-wood" />
          <circle cx={81} cy={64.5} r={3.4} className={cn('fill-court-skin', INK)} strokeWidth={0.6} />
        </g>
      )}
      {rank === 'Q' && (
        <g>
          <path d="M22 64 C23 52 20 42 22 31" fill="none" className="stroke-jade" strokeWidth={1.4} />
          <path d="M22 46 C26 43 28 44 30 41 C26 41 24 42 22 46 Z" className="fill-jade" />
          {[
            [22, 23.5],
            [25.5, 27],
            [22, 30.5],
            [18.5, 27],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={3.2} className={cn('fill-suit-red', INK)} strokeWidth={0.5} />
          ))}
          <circle cx={22} cy={27} r={1.8} className="fill-gold" />
          <circle cx={22} cy={63} r={3.4} className={cn('fill-court-skin', INK)} strokeWidth={0.6} />
        </g>
      )}
      {rank === 'J' && (
        <g>
          <path d="M80 6 L80 66" className="stroke-rail-wood" strokeWidth={1.8} />
          <path d="M80 2 L82.2 9 L77.8 9 Z" className={cn('fill-playing-card', INK)} strokeWidth={0.6} />
          <path d="M80.5 12 L89 16 L89 25 L80.5 21 Z" className={cn('fill-gold', INK)} strokeWidth={0.6} />
          <circle cx={80} cy={62} r={3.4} className={cn('fill-court-skin', INK)} strokeWidth={0.6} />
        </g>
      )}

      {/* Robe and center panel */}
      <path d="M8 70 C10 58 16 50 28 47 L40 44 L50 50 L60 44 L72 47 C84 50 90 58 92 70 Z" className={cn(robe, INK)} strokeWidth={0.8} />
      <path d="M40 44 L50 50 L60 44 L62.5 70 L37.5 70 Z" className={cn(panel, INK)} strokeWidth={0.6} />
      {[54, 60, 66].map((y) => (
        <path key={y} d={`M50 ${y - 2.4} L52.2 ${y} L50 ${y + 2.4} L47.8 ${y} Z`} className="fill-gold" />
      ))}
      <path d="M14 66 C18 60 22 56 30 53" fill="none" className="stroke-gold" strokeWidth={1.2} />
      <path d="M86 66 C82 60 78 56 70 53" fill="none" className="stroke-gold" strokeWidth={1.2} />
      {/* Ermine collar */}
      <path d="M27 47.5 L40 44 L50 50.5 L60 44 L73 47.5" fill="none" className="stroke-playing-card" strokeWidth={3.4} />
      {[31, 37, 63, 69].map((x) => (
        <circle key={x} cx={x} cy={x < 50 ? 46.3 - (x - 31) * 0.1 : 45.7 + (x - 63) * 0.1} r={0.7} className="fill-suit-black" />
      ))}

      {/* Neck, hair and head */}
      <rect x={45.5} y={38} width={9} height={8} className="fill-court-skin" />
      {rank === 'Q' && (
        <path d="M38.5 26 C35.5 40 37 49 41 52 L45 41 Z M61.5 26 C64.5 40 63 49 59 52 L55 41 Z" className={cn('fill-gold', INK)} strokeWidth={0.5} />
      )}
      <ellipse cx={50} cy={29} rx={10.5} ry={12.5} className={cn('fill-court-skin', INK)} strokeWidth={0.7} />
      {rank !== 'Q' && (
        <path d="M39.6 28 C39 19 44 16 50 16 C56 16 61 19 60.4 28 C58 23 54 21.5 50 21.5 C46 21.5 42 23 39.6 28 Z" className="fill-suit-black" />
      )}
      {rank === 'Q' && <path d="M40 25 C42 19 46 17.5 50 17.5 C54 17.5 58 19 60 25 C56 22 53 21.5 50 21.5 C47 21.5 44 22 40 25 Z" className="fill-gold" />}
      {/* Face */}
      <path d="M44 25.6 L47.6 25" className={INK} strokeWidth={0.7} />
      <path d="M52.4 25 L56 25.6" className={INK} strokeWidth={0.7} />
      <ellipse cx={46} cy={28} rx={1.2} ry={0.9} className="fill-suit-black" />
      <ellipse cx={54} cy={28} rx={1.2} ry={0.9} className="fill-suit-black" />
      <path d="M50 29 L48.9 33.2 L50.8 33.4" fill="none" className={INK} strokeWidth={0.6} />
      <path d="M47.4 36.2 Q50 37.8 52.6 36.2" fill="none" className="stroke-suit-red" strokeWidth={1} />
      {rank === 'K' && (
        <>
          <path d="M39.8 30 C40 42 45 47.5 50 47.5 C55 47.5 60 42 60.2 30 C57.5 37 54 38.8 50 38.8 C46 38.8 42.5 37 39.8 30 Z" className="fill-suit-black" opacity={0.88} />
          <path d="M44.5 35.4 Q50 33 55.5 35.4 Q50 36.8 44.5 35.4 Z" className="fill-suit-black" />
        </>
      )}

      {/* Headwear */}
      {rank === 'K' && (
        <g>
          <path d="M38 20 L38 8 L43 13 L46.5 4.5 L50 12 L53.5 4.5 L57 13 L62 8 L62 20 Z" className={cn('fill-gold', INK)} strokeWidth={0.6} />
          <rect x={37.5} y={16.5} width={25} height={4} className={cn(panel, INK)} strokeWidth={0.5} />
          {[43, 50, 57].map((x) => (
            <circle key={x} cx={x} cy={18.5} r={1.2} className="fill-gold" />
          ))}
        </g>
      )}
      {rank === 'Q' && (
        <g>
          <path d="M39.5 19.5 C39.5 13.5 42 10.5 44.3 12.4 C45 8.4 48 7.4 50 9.6 C52 7.4 55 8.4 55.7 12.4 C58 10.5 60.5 13.5 60.5 19.5 Z" className={cn('fill-gold', INK)} strokeWidth={0.6} />
          <circle cx={50} cy={6.2} r={2} className={cn('fill-gold', INK)} strokeWidth={0.5} />
          <rect x={39} y={17} width={22} height={3.4} className={cn(robe, INK)} strokeWidth={0.5} />
          {[44, 50, 56].map((x) => (
            <circle key={x} cx={x} cy={18.7} r={1} className="fill-court-blue" />
          ))}
        </g>
      )}
      {rank === 'J' && (
        <g>
          <path d="M61 13 C64 5 69 3.5 74 1.5 C72 8 67.5 12 63 16 Z" className={cn('fill-gold', INK)} strokeWidth={0.5} />
          <path d="M37 21 C37 12.5 44 9.5 51 9.5 C59 9.5 63.5 13 63 21 Z" className={cn(panel, INK)} strokeWidth={0.6} />
          <rect x={36} y={18.6} width={28} height={3.6} rx={1} className={cn('fill-gold', INK)} strokeWidth={0.5} />
        </g>
      )}
    </g>
  );
};

/** Illustrated, double-ended Jack, Queen or King inside a gold frame. */
export const CourtFigure: React.FC<{ rank: Court; suit: Suit; className?: string }> = ({ rank, suit, className }) => (
  <svg viewBox="0 0 100 140" className={className} aria-hidden="true">
    <rect x={1} y={1} width={98} height={138} rx={3} className="fill-playing-card" />
    <Half rank={rank} suit={suit} />
    <g transform="rotate(180 50 70)">
      <Half rank={rank} suit={suit} />
    </g>
    <path d="M3 71.5 L97 68.5" className="stroke-gold" strokeWidth={0.9} />
    <rect x={1} y={1} width={98} height={138} rx={3} fill="none" className="stroke-gold" strokeWidth={1.6} />
    <rect x={3.2} y={3.2} width={93.6} height={133.6} rx={2} fill="none" className={isRedSuit(suit) ? 'stroke-suit-red' : 'stroke-court-blue'} strokeWidth={0.6} />
  </svg>
);
