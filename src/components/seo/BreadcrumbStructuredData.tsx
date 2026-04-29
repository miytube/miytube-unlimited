import { useEffect } from 'react';

const DOMAIN = 'https://miytube.com';

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
  useEffect(() => {
    if (!items.length) return;

    const data = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: `${DOMAIN}${c.path}`,
      })),
    };

    const id = 'breadcrumb-jsonld';
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);

    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [items]);

  return null;
};
