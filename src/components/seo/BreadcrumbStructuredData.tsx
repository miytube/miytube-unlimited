import { Helmet } from 'react-helmet-async';
import { SEO_ORIGIN, serializeJsonLd } from '@/lib/seo';

interface Crumb {
  name: string;
  path: string; // e.g. "/music" or "/watch/123"
}

interface Props {
  items: Crumb[];
}

/**
 * Injects schema.org BreadcrumbList JSON-LD into <head>.
 * Helps Google show category breadcrumbs in search results.
 */
export const BreadcrumbStructuredData: React.FC<Props> = ({ items }) => {
    if (!items.length) return null;
    const data = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: `${SEO_ORIGIN}${c.path}`,
      })),
    };

    return <Helmet><script id="breadcrumb-jsonld" type="application/ld+json">{serializeJsonLd(data)}</script></Helmet>;
};
