import { useEffect } from 'react';

const DOMAIN = 'https://miytube.com';

/**
 * Injects schema.org Organization + WebSite JSON-LD into <head>.
 * Helps Google understand the brand and enables sitelinks searchbox.
 */
export const OrganizationStructuredData: React.FC = () => {
  useEffect(() => {
    const data = [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'MiyTube',
        url: DOMAIN,
        logo: `${DOMAIN}/placeholder.svg`,
        sameAs: [],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'MiyTube',
        url: DOMAIN,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${DOMAIN}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ];

    const id = 'org-jsonld';
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
  }, []);

  return null;
};
