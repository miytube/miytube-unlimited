import { MUSIC_LEGENDS_BASE_PATH, MUSIC_LEGENDS_TAGLINE, musicLegendPath, type MusicLegend } from '@/data/musicLegends';
import { SEO_ORIGIN, videoWatchPath } from './seo';

export interface MusicLegendSEOItem { id: string; title: string; category?: string; }

export function musicLegendPageMetadata(legend?: MusicLegend) {
  return {
    title: legend ? `${legend.name} Videos – Music Legends | MiyTube` : 'Music Legends – Greatest Artists of All Time | MiyTube',
    description: legend
      ? `Watch ${legend.name} music videos, performances and interviews on MiyTube Music Legends. ${legend.description}`
      : `MiyTube Music Legends. ${MUSIC_LEGENDS_TAGLINE} Watch videos from Jimi Hendrix, The Beatles, Michael Jackson, Prince, Aretha Franklin and more.`,
    path: legend ? musicLegendPath(legend) : MUSIC_LEGENDS_BASE_PATH,
  };
}

/** A shelf is a collection about an artist; only watch pages describe videos. */
export function buildMusicLegendSchema(legend: MusicLegend | undefined, visibleVideos: MusicLegendSEOItem[], totalVideos: number, offset = 0) {
  const metadata = musicLegendPageMetadata(legend);
  const url = `${SEO_ORIGIN}${metadata.path}`;
  const artistId = `${url}#artist`;
  const listId = `${url}#videos`;
  const breadcrumbs = [
    { name: 'MiyTube', path: '/' },
    { name: 'Music', path: '/music' },
    { name: 'Music Legends', path: MUSIC_LEGENDS_BASE_PATH },
    ...(legend ? [{ name: legend.name, path: metadata.path }] : []),
  ];
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'CollectionPage', '@id': `${url}#page`, url,
      name: legend ? `${legend.name} Videos` : 'MiyTube Music Legends',
      description: metadata.description,
      breadcrumb: { '@id': `${url}#breadcrumbs` },
      mainEntity: { '@id': listId },
      ...(legend ? { about: { '@id': artistId } } : {}),
    },
    ...(legend ? [{ '@type': legend.kind, '@id': artistId, name: legend.name, genre: legend.genre, description: legend.description }] : []),
    {
      '@type': 'ItemList', '@id': listId, numberOfItems: totalVideos,
      itemListElement: visibleVideos.map((video, index) => ({
        '@type': 'ListItem', position: offset + index + 1, name: video.title,
        url: `${SEO_ORIGIN}${video.category?.toLowerCase() === 'shorts' ? `/shorts/feed?v=${encodeURIComponent(video.id)}` : videoWatchPath(video.id)}`,
      })),
    },
    {
      '@type': 'BreadcrumbList', '@id': `${url}#breadcrumbs`,
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem', position: index + 1, name: item.name, item: `${SEO_ORIGIN}${item.path}`,
      })),
    },
  ];
  return { '@context': 'https://schema.org', '@graph': graph };
}
