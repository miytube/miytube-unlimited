/**
 * Multi-site configuration.
 *
 * One codebase + one backend serves two public websites. Every row of content
 * carries a `site` tag; the active site is resolved from the browser hostname
 * (with a `?site=` override for previewing inside the Lovable editor).
 */

export type SiteId = 'miytube' | 'iwin';

export interface SiteConfig {
  id: SiteId;
  /** Display name used in the header/footer wordmark and page titles. */
  name: string;
  /** Wordmark split so the first part can be accent-colored. */
  wordmark: [string, string];
  tagline: string;
  domain: string;
  metaTitle: string;
  metaDescription: string;
  /** Hostnames (lowercase, no port) that resolve to this site. */
  hostnames: string[];
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  contactEmail: string;
}

export const SITES: Record<SiteId, SiteConfig> = {
  miytube: {
    id: 'miytube',
    name: 'MiyTube',
    wordmark: ['Miy', 'Tube'],
    tagline: 'Your platform for unlimited video content. Upload, share, and discover with no restrictions.',
    domain: 'miytube.com',
    metaTitle: 'MiyTube - Watch, Upload & Share Videos',
    metaDescription:
      'MiyTube is a free video platform. Watch, upload and share videos, shorts, music and live moments with no restrictions.',
    hostnames: ['miytube.com', 'www.miytube.com', 'miytube-com.lovable.app'],
    social: {
      facebook: 'https://www.facebook.com/miytube',
      twitter: 'https://x.com/miytube',
      instagram: 'https://www.instagram.com/miytube',
      youtube: 'https://www.youtube.com/@miytube',
      linkedin: 'https://www.linkedin.com/company/miytube',
    },
    contactEmail: 'miytube@aol.com',
  },
};


export const DEFAULT_SITE: SiteId = 'miytube';

const normalizeHost = (host: string) => host.toLowerCase().split(':')[0];

/** Resolve the active site id from a hostname + optional query string. */
export const resolveSiteId = (hostname: string, search = ''): SiteId => {
  const override = new URLSearchParams(search).get('site');
  if (override && override in SITES) return override as SiteId;

  const host = normalizeHost(hostname);
  for (const site of Object.values(SITES)) {
    if (site.hostnames.some((h) => host === h || host.endsWith(`.${h}`))) {
      return site.id;
    }
  }
  return DEFAULT_SITE;
};

let cachedSiteId: SiteId | null = null;

/**
 * Active site id. Safe to call from plain (non-React) data functions.
 * A `?site=` override is remembered for the session so it survives navigation.
 */
export const getCurrentSiteId = (): SiteId => {
  if (typeof window === 'undefined') return DEFAULT_SITE;
  if (cachedSiteId) return cachedSiteId;

  let stored: string | null = null;
  try {
    stored = window.sessionStorage.getItem('active-site-override');
  } catch {
    stored = null;
  }

  const fromUrl = new URLSearchParams(window.location.search).get('site');
  if (fromUrl && fromUrl in SITES) {
    try {
      window.sessionStorage.setItem('active-site-override', fromUrl);
    } catch {
      /* ignore */
    }
    cachedSiteId = fromUrl as SiteId;
    return cachedSiteId;
  }

  const hostResolved = resolveSiteId(window.location.hostname);
  // Only honour a stored override on hosts that are not a real site domain.
  const isKnownHost = Object.values(SITES).some((s) =>
    s.hostnames.some((h) => normalizeHost(window.location.hostname) === h)
  );
  cachedSiteId = !isKnownHost && stored && stored in SITES ? (stored as SiteId) : hostResolved;
  return cachedSiteId;
};

export const getCurrentSite = (): SiteConfig => SITES[getCurrentSiteId()];

/** True when the active site is MiyTube (the site with the hardcoded legacy category tree). */
export const isMiyTube = () => getCurrentSiteId() === 'miytube';

/** Namespaced localStorage key so the two sites never share cached content. */
export const siteKey = (key: string) => {
  const id = getCurrentSiteId();
  return id === DEFAULT_SITE ? key : `${id}:${key}`;
};
