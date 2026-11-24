import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getCurrentSite } from '@/config/sites';
import { usePageSEOState } from '@/hooks/usePageSEO';
import { publicMediaUrl, SEO_ORIGIN } from '@/lib/seo';

const DEFAULT_OG_IMAGE = 'https://storage.googleapis.com/gpt-engineer-file-uploads/LGzo1U228xWhpQlYy8pM0UdbD403/social-images/social-1777144077591-miytube-final.webp';

/** One metadata owner prevents duplicate canonical tags across route changes. */
export function PageSEOHead() {
  const location = useLocation();
  const entry = usePageSEOState();
  const active = entry?.locationKey === location.key ? entry : undefined;
  const site = getCurrentSite();
  const rawTitle = active?.title || site.metaTitle;
  const title = rawTitle.length > 60 ? `${rawTitle.slice(0, 57)}...` : rawTitle;
  const description = (active?.description || site.metaDescription).slice(0, 160);
  const canonical = `${SEO_ORIGIN}${active?.path || location.pathname}`;
  const image = publicMediaUrl(active?.ogImage) || DEFAULT_OG_IMAGE;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={active?.ogType || 'website'} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}