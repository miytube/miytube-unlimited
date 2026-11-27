import {
  MUSIC_LEGENDS, MUSIC_LEGENDS_CATEGORY_SLUG, getMusicLegendBySubcategory, type MusicLegend,
} from '@/data/musicLegends';

export interface MusicLegendVideoLike {
  id: string;
  title?: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
}

const norm = (value?: string) => (value || '').toLowerCase().trim();

const normalizeText = (value: string) =>
  ` ${value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/['’]s\b/g, '').replace(/[^a-z0-9]+/g, ' ').trim()} `;

/** Only music uploads qualify; news items merely mentioning an artist do not. */
export const isMusicCategoryVideo = (video: MusicLegendVideoLike) => {
  const category = norm(video.category);
  const isMusic = category === 'music' || category.startsWith('music-') || category === 'audio-music-videos';
  return isMusic && !norm(video.subcategory).includes('news');
};

const escapeRe = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** "Prince - Kiss" opens with the artist; "Prince Royce" or "Crown Prince" does not. */
const opensWith = (title: string, alias: string) =>
  new RegExp(`^[^a-z0-9]*(the\\s+)?${escapeRe(alias)}\\s*([-–—:|,(&]|$)`, 'i').test(title);

/**
 * Which legend a music video belongs to: the artist picked on a Music Legends
 * upload, otherwise the artist named first in the title,
 * otherwise an exact artist tag. Non-music videos never match.
 */
export const resolveVideoMusicLegend = (video: MusicLegendVideoLike): MusicLegend | undefined => {
  if (!isMusicCategoryVideo(video)) return undefined;
  // An upload filed under Music Legends with an artist picked goes to that
  // artist, whatever the title says.
  if (norm(video.category) === MUSIC_LEGENDS_CATEGORY_SLUG) {
    const picked = getMusicLegendBySubcategory(video.subcategory);
    if (picked) return picked;
  }
  const rawTitle = video.title || '';
  const title = normalizeText(rawTitle);
  let winner: MusicLegend | undefined;
  let winnerPos = -1;
  for (const item of MUSIC_LEGENDS) {
    let pos = item.leadAliases.some((alias) => opensWith(rawTitle, alias)) ? 0 : -1;
    for (const alias of item.aliases) {
      const idx = title.indexOf(` ${alias} `);
      if (idx !== -1 && (pos === -1 || idx < pos)) pos = idx;
    }
    if (pos !== -1 && (winnerPos === -1 || pos < winnerPos)) { winner = item; winnerPos = pos; }
  }
  if (winner) return winner;
  const tags = (video.tags || []).map((tag) => normalizeText(tag).trim());
  return MUSIC_LEGENDS.find((item) => item.aliases.some((alias) => tags.includes(alias)));
};

/** Videos per legend id, keeping the incoming (newest-first) order. */
export const groupVideosByMusicLegend = <T extends MusicLegendVideoLike>(videos: T[]) => {
  const byId = new Map<number, T[]>();
  for (const video of videos) {
    const item = resolveVideoMusicLegend(video);
    if (!item) continue;
    byId.set(item.id, [...(byId.get(item.id) || []), video]);
  }
  return byId;
};
