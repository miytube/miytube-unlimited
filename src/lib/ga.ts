/**
 * Thin Google Analytics 4 helper.
 *
 * The gtag script itself is loaded in index.html. This module gives the app a
 * single, type-safe place to send custom events so GA4 gets more than bare
 * page views (which is all it received before).
 */

type GaParams = Record<string, string | number | boolean | undefined | null>;

export const gaEvent = (name: string, params: GaParams = {}): void => {
  if (typeof window === 'undefined') return;
  const gtag = (window as any).gtag;
  if (typeof gtag !== 'function') return;
  try {
    // Strip undefined/null so GA doesn't record empty dimensions.
    const clean: GaParams = {};
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') clean[k] = v;
    });
    gtag('event', name, clean);
  } catch {
    // Analytics must never break the app.
  }
};

/** Associate the signed-in user with GA sessions (cross-device reporting). */
export const gaSetUser = (userId: string | null): void => {
  if (typeof window === 'undefined') return;
  const gtag = (window as any).gtag;
  if (typeof gtag !== 'function') return;
  try {
    gtag('set', { user_id: userId || undefined });
  } catch {
    // ignore
  }
};

/**
 * Derive a GA4 "content group" from the URL so reports can be read by section
 * (music, sports, watch, blog, ...) instead of thousands of individual paths.
 */
export const contentGroupFromPath = (pathname: string): string => {
  const seg = pathname.split('/').filter(Boolean);
  if (seg.length === 0) return 'home';
  if (seg[0] === 'watch' || seg[0] === 'shorts' || seg[0] === 'audio-watch') return 'watch';
  if (seg[0] === 'blog') return 'articles';
  if (seg[0] === 'search') return 'search';
  if (seg[0] === 'upload' || seg[0].includes('upload')) return 'upload';
  return seg[0];
};
