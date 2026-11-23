import React from 'react';
import { CHINESE_NUMERALS, DRAGON_CHARS, TileFace, WIND_CHARS } from '@/lib/mahjong';
import { cn } from '@/lib/utils';

const DOT_COLORS = ['bg-tile-blue', 'bg-jade', 'bg-suit-red'];

/** Face artwork for one tile; sizes scale with the board via container units. */
export const TileArt: React.FC<{ face: TileFace }> = ({ face }) => {
  switch (face.suit) {
    case 'characters':
      return (
        <span className="flex flex-col items-center leading-none">
          <span className="font-serif text-[3.6cqw] font-bold text-suit-black">{CHINESE_NUMERALS[face.rank - 1]}</span>
          <span className="font-serif text-[3.6cqw] font-bold text-suit-red">萬</span>
        </span>
      );
    case 'dots':
      return (
        <span className="grid grid-cols-3 place-items-center gap-[0.35cqw] px-[0.6cqw]">
          {Array.from({ length: face.rank }).map((_, i) => (
            <span key={i} className={cn('block h-[1.5cqw] w-[1.5cqw] rounded-full', DOT_COLORS[i % 3])} />
          ))}
        </span>
      );
    case 'bamboo':
      return (
        <span className="grid grid-cols-3 place-items-center gap-x-[0.5cqw] gap-y-[0.4cqw] px-[0.6cqw]">
          {Array.from({ length: face.rank }).map((_, i) => (
            <span key={i} className={cn('block h-[2.4cqw] w-[0.9cqw] rounded-sm', i % 4 === 3 ? 'bg-suit-red' : 'bg-jade')} />
          ))}
        </span>
      );
    case 'wind':
      return <span className="font-serif text-[5.5cqw] font-bold text-suit-black">{WIND_CHARS[face.rank - 1]}</span>;
    case 'dragon':
      return face.rank === 3 ? (
        <span className="block h-[6cqw] w-[4.2cqw] rounded-sm border-[0.6cqw] border-tile-blue" />
      ) : (
        <span className={cn('font-serif text-[5.5cqw] font-bold', face.rank === 1 ? 'text-suit-red' : 'text-jade')}>{DRAGON_CHARS[face.rank - 1]}</span>
      );
  }
};

export const faceLabel = (face: TileFace) => {
  if (face.suit === 'wind') return `${['East', 'South', 'West', 'North'][face.rank - 1]} wind`;
  if (face.suit === 'dragon') return `${['Red', 'Green', 'White'][face.rank - 1]} dragon`;
  return `${face.rank} of ${face.suit}`;
};
