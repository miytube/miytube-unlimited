import {
  LEGENDS_BASE_PATH, LEGENDS_CATEGORY_SLUG, type SportsLegend,
} from '@/data/sportsBeginEndLegends';
import { SEO_ORIGIN, videoWatchPath } from './seo';

export interface LegendSEOItem { id: string; title: string; category?: string; }

export function legendPageMetadata(legend?: SportsLegend) {
  return {
    title: legend ? `${legend.name} Videos & Highlights | MiyTube` : 'Sports Begins End Legends & Videos | MiyTube',
    description: legend
      ? `Watch ${legend.name} ${legend.sport.toLowerCase()} highlights, interviews and archival videos. Explore the career timeline on Sports Begins End.`
      : 'Explore Sports Begins End legends: archival sports videos, career highlights and interviews, with links to each athlete’s full career timeline.',
    path: legend ? `${LEGENDS_BASE_PATH}/${legend.slug}` : LEGENDS_BASE_PATH,
  };
}

/** The shelf is a collection, not a video watch page or a biography article. */
export function buildLegendSchema(legend: SportsLegend | undefined, visibleVideos: LegendSEOItem[], totalVideos: number, offset = 0) {
  const metadata = legendPageMetadata(legend);
  const url = `${SEO_ORIGIN}${metadata.path}`;
  const personId = `${url}#athlete`;
  const listId = `${url}#videos`;
  const breadcrumbs = [
    { name: 'MiyTube', path: '/' },
    { name: 'Sports Begins End Legends', path: `/c/${LEGENDS_CATEGORY_SLUG}` },
    { name: 'Legends', path: LEGENDS_BASE_PATH },
    ...(legend ? [{ name: legend.name, path: metadata.path }] : []),
  ];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage', '@id': `${url}#page`, url,
        name: legend ? `${legend.name} Videos` : 'Sports Begins End Legends',
        description: metadata.description,
        breadcrumb: { '@id': `${url}#breadcrumbs` },
        mainEntity: { '@id': listId },
        ...(legend ? { about: { '@id': personId } } : {}),
      },
      ...(legend ? [{
        '@type': 'Person', '@id': personId, name: legend.name,
        jobTitle: `${legend.sport} athlete`,
        sameAs: [`https://sportsbeginend.com/profile/${legend.id}`],
      }] : []),
      {
        '@type': 'ItemList', '@id': listId,
        numberOfItems: totalVideos,
        itemListElement: visibleVideos.map((video, index) => ({
          '@type': 'ListItem', position: offset + index + 1, name: video.title,
          url: `${SEO_ORIGIN}${video.category?.toLowerCase() === 'shorts' ? `/shorts/feed?v=${encodeURIComponent(video.id)}` : videoWatchPath(video.id)}`,
        })),
      },
      {
        '@type': 'BreadcrumbList', '@id': `${url}#breadcrumbs`,
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem', position: index + 1,
          name: item.name, item: `${SEO_ORIGIN}${item.path}`,
        })),
      },
    ],
  };
}