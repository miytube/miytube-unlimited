import { useEffect } from 'react';

interface PageSEOOptions {
  title: string;
  description?: string;
  path?: string; // canonical path, e.g. "/about"
  ogImage?: string;
  ogType?: 'website' | 'article' | 'video.other';
}

const SITE_URL = 'https://www.miytube.com';
const DEFAULT_OG_IMAGE = 'https://storage.googleapis.com/gpt-engineer-file-uploads/LGzo1U228xWhpQlYy8pM0UdbD403/social-images/social-1777144077591-miytube-final.webp';

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!el) {
    if (selector.startsWith('link')) {
      el = document.createElement('link');
      const rel = selector.match(/rel="([^"]+)"/)?.[1];
      if (rel) (el as HTMLLinkElement).rel = rel;
    } else {
      el = document.createElement('meta');
      const prop = selector.match(/property="([^"]+)"/)?.[1];
      const name = selector.match(/name="([^"]+)"/)?.[1];
      if (prop) (el as HTMLMetaElement).setAttribute('property', prop);
      if (name) (el as HTMLMetaElement).name = name;
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

/**
 * Sets per-route document title, meta description, canonical link,
 * and Open Graph / Twitter social preview tags.
 */
export function usePageSEO({ title, description, path, ogImage, ogType = 'website' }: PageSEOOptions) {
  useEffect(() => {
    const fullTitle = title.length > 60 ? title.slice(0, 57) + '...' : title;
    document.title = fullTitle;

    const desc = (description || '').slice(0, 160);
    if (desc) {
      setMeta('meta[name="description"]', 'content', desc);
      setMeta('meta[name="twitter:description"]', 'content', desc);
      setMeta('meta[property="og:description"]', 'content', desc);
    }

    const canonicalPath = path ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;
    setMeta('link[rel="canonical"]', 'href', canonicalUrl);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[property="og:type"]', 'content', ogType);
    setMeta('meta[property="og:image"]', 'content', ogImage || DEFAULT_OG_IMAGE);
    setMeta('meta[name="twitter:image"]', 'content', ogImage || DEFAULT_OG_IMAGE);
  }, [title, description, path, ogImage, ogType]);
}
