import React from 'react';
import { CHINESE_NUMERALS, DRAGON_CHARS, TileFace, WIND_CHARS } from '@/lib/mahjong';

/**
 * Tile face artwork drawn in a 30x40 box so it stays sharp at any tile size.
 * Layouts follow real mahjong tiles: dot circles, jointed bamboo stalks, red 萬 characters.
 */
type Pt = [number, number];

const DOTS: Record<number, { pts: Pt[]; r: number }> = {
  1: { pts: [[15, 20]], r: 10 },
  2: { pts: [[15, 11], [15, 29]], r: 6.4 },
  3: { pts: [[7.5, 9], [15, 20], [22.5, 31]], r: 5.4 },
  4: { pts: [[9, 12], [21, 12], [9, 28], [21, 28]], r: 5.4 },
  5: { pts: [[8.5, 10], [21.5, 10], [15, 20], [8.5, 30], [21.5, 30]], r: 4.8 },
  6: { pts: [[9, 9], [21, 9], [9, 20], [21, 20], [9, 31], [21, 31]], r: 4.6 },
  7: { pts: [[6.5, 6.5], [15, 10], [23.5, 13.5], [9.5, 24], [20.5, 24], [9.5, 33], [20.5, 33]], r: 3.8 },
  8: { pts: [[9, 6.5], [21, 6.5], [9, 15.5], [21, 15.5], [9, 24.5], [21, 24.5], [9, 33.5], [21, 33.5]], r: 3.9 },
  9: { pts: [[7, 8.5], [15, 8.5], [23, 8.5], [7, 20], [15, 20], [23, 20], [7, 31.5], [15, 31.5], [23, 31.5]], r: 3.8 },
};

// Which dots are red (the rest alternate blue/green), matching classic tile colouring.
const RED_DOTS: Record<number, number[]> = { 1: [0], 3: [1], 5: [2], 6: [2, 3, 4, 5], 7: [3, 4, 5, 6], 9: [3, 4, 5] };

const Dot: React.FC<{ c: Pt; r: number; tone: string }> = ({ c: [cx, cy], r, tone }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} className={tone} />
    <circle cx={cx} cy={cy} r={r * 0.68} className="fill-none stroke-playing-card" strokeWidth={r * 0.16} />
    <circle cx={cx} cy={cy} r={r * 0.3} className="fill-playing-card" />
    {r > 8 && <circle cx={cx} cy={cy} r={r * 0.48} className="fill-none stroke-playing-card" strokeWidth={0.6} strokeDasharray="1.4 1.1" />}
  </g>
);

const BAMBOO: Record<number, { pts: Pt[]; h: number; red?: number[] }> = {
  1: { pts: [[15, 20]], h: 28, red: [] },
  2: { pts: [[15, 11], [15, 29]], h: 15 },
  3: { pts: [[15, 11], [9, 29], [21, 29]], h: 15 },
  4: { pts: [[9.5, 11], [20.5, 11], [9.5, 29], [20.5, 29]], h: 15 },
  5: { pts: [[8, 11], [22, 11], [15, 20], [8, 29], [22, 29]], h: 15, red: [2] },
  6: { pts: [[7, 11], [15, 11], [23, 11], [7, 29], [15, 29], [23, 29]], h: 15 },
  7: { pts: [[15, 7.5], [7, 20], [15, 20], [23, 20], [7, 32], [15, 32], [23, 32]], h: 10.5, red: [0] },
  8: { pts: [[5.5, 11], [12, 11], [18, 11], [24.5, 11], [5.5, 29], [12, 29], [18, 29], [24.5, 29]], h: 15 },
  9: { pts: [[7, 8], [15, 8], [23, 8], [7, 20], [15, 20], [23, 20], [7, 32], [15, 32], [23, 32]], h: 10.5, red: [1, 4, 7] },
};

const Stalk: React.FC<{ c: Pt; h: number; w: number; red: boolean }> = ({ c: [cx, cy], h, w, red }) => {
  const top = cy - h / 2;
  const body = red ? 'fill-suit-red' : 'fill-jade';
  return (
    <g>
      <rect x={cx - w / 2} y={top} width={w} height={h} rx={w / 2.2} className={body} />
      <rect x={cx - w * 0.16} y={top + h * 0.12} width={w * 0.22} height={h * 0.76} rx={w * 0.1} className="fill-playing-card opacity-50" />
      {[0.04, 0.5, 0.96].map((f) => (
        <rect key={f} x={cx - w * 0.68} y={top + h * f - 0.75} width={w * 1.36} height={1.5} rx={0.75} className={red ? 'fill-suit-red' : 'fill-tile-blue'} />
      ))}
    </g>
  );
};

const Glyph: React.FC<{ y: number; size: number; tone: string; children: React.ReactNode }> = ({ y, size, tone, children }) => (
  <text x={15} y={y} textAnchor="middle" dominantBaseline="central" fontSize={size} fontWeight={700} className={tone} style={{ fontFamily: '"Noto Serif SC", "Songti SC", "SimSun", serif' }}>
    {children}
  </text>
);

export const TileArt: React.FC<{ face: TileFace }> = ({ face }) => {
  let art: React.ReactNode = null;
  switch (face.suit) {
    case 'dots': {
      const { pts, r } = DOTS[face.rank];
      const red = RED_DOTS[face.rank] ?? [];
      art = pts.map((c, i) => <Dot key={i} c={c} r={r} tone={red.includes(i) ? 'fill-suit-red' : i % 2 ? 'fill-jade' : 'fill-tile-blue'} />);
      break;
    }
    case 'bamboo': {
      const { pts, h, red = [] } = BAMBOO[face.rank];
      const w = face.rank === 1 ? 7 : face.rank === 8 ? 3.6 : 4.4;
      art = pts.map((c, i) => <Stalk key={i} c={c} h={h} w={w} red={red.includes(i)} />);
      break;
    }
    case 'characters':
      art = (
        <>
          <Glyph y={11.5} size={15} tone="fill-tile-blue">{CHINESE_NUMERALS[face.rank - 1]}</Glyph>
          <Glyph y={28.5} size={16} tone="fill-suit-red">萬</Glyph>
        </>
      );
      break;
    case 'wind':
      art = <Glyph y={20} size={23} tone="fill-suit-black">{WIND_CHARS[face.rank - 1]}</Glyph>;
      break;
    case 'dragon':
      art =
        face.rank === 3 ? (
          <g className="fill-none stroke-tile-blue">
            <rect x={5} y={5} width={20} height={30} rx={2} strokeWidth={2.2} />
            <rect x={8.5} y={8.5} width={13} height={23} rx={1} strokeWidth={1} />
          </g>
        ) : (
          <Glyph y={20} size={23} tone={face.rank === 1 ? 'fill-suit-red' : 'fill-jade'}>{DRAGON_CHARS[face.rank - 1]}</Glyph>
        );
      break;
  }
  return (
    <svg viewBox="0 0 30 40" className="pointer-events-none h-[86%] w-[86%]" aria-hidden="true">
      {art}
    </svg>
  );
};

export const faceLabel = (face: TileFace) => {
  if (face.suit === 'wind') return `${['East', 'South', 'West', 'North'][face.rank - 1]} wind`;
  if (face.suit === 'dragon') return `${['Red', 'Green', 'White'][face.rank - 1]} dragon`;
  return `${face.rank} of ${face.suit}`;
};
