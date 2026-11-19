import {
  SPORTS_LEGENDS,
  LEGENDS_CATEGORY_SLUG,
  getLegendBySlug,
  type SportsLegend,
} from '@/data/sportsBeginEndLegends';

export interface LegendVideoLike {
  id: string;
  title?: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
}

const normalizeText = (value: string) =>
  ` ${value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]s\b/g, '')
    .replace(/[^a-z0-9-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;

/** Position of the earliest whole-word alias hit in the text, or -1. */
const firstAliasPosition = (text: string, aliases: string[]) => {
  let best = -1;
  for (const alias of aliases) {
    const idx = text.indexOf(` ${alias} `);
    if (idx !== -1 && (best === -1 || idx < best)) best = idx;
  }
  return best;
};

const matchByText = (text: string): SportsLegend | undefined => {
  let winner: SportsLegend | undefined;
  let winnerPos = -1;
  for (const l of SPORTS_LEGENDS) {
    const pos = firstAliasPosition(text, l.aliases);
    if (pos !== -1 && (winnerPos === -1 || pos < winnerPos)) {
      winner = l;
      winnerPos = pos;
    }
  }
  return winner;
};

const norm = (v?: string) => (v || '').toLowerCase().trim();

/** True when the video belongs on the Legends page. */
export const isLegendsVideo = (video: LegendVideoLike) =>
  norm(video.category) === LEGENDS_CATEGORY_SLUG || !!getLegendBySlug(video.subcategory);

/**
 * Which legend a video belongs to. An explicit legend chosen at upload wins;
 * older uploads fall back to the legend named first in the title, then tags.
 */
export const resolveVideoLegend = (video: LegendVideoLike): SportsLegend | undefined => {
  const explicit = getLegendBySlug(video.subcategory);
  if (explicit) return explicit;
  const fromTitle = matchByText(normalizeText(video.title || ''));
  if (fromTitle) return fromTitle;
  return matchByText(normalizeText((video.tags || []).join(' ')));
};

export interface LegendShelf<T> {
  legend: SportsLegend;
  videos: T[];
}

/** Groups videos into per-legend shelves (alphabetical) plus unassigned ones. */
export const groupVideosByLegend = <T extends LegendVideoLike>(videos: T[]) => {
  const byId = new Map<number, T[]>();
  const unassigned: T[] = [];
  for (const video of videos) {
    const l = resolveVideoLegend(video);
    if (!l) {
      unassigned.push(video);
      continue;
    }
    const list = byId.get(l.id) || [];
    list.push(video);
    byId.set(l.id, list);
  }
  const shelves: LegendShelf<T>[] = SPORTS_LEGENDS.filter((l) => byId.has(l.id))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((l) => ({ legend: l, videos: byId.get(l.id)! }));
  return { shelves, unassigned };
};
