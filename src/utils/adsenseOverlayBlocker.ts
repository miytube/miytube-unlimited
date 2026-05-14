/**
 * Safety net: removes any AdSense anchor (sticky bottom) or vignette
 * (full-page interstitial) overlays that Google injects despite the
 * dashboard toggle being off.
 *
 * Detection strategy: walk every fixed-position element on the page and
 * remove it if it contains a Google ad iframe (googleads.g.doubleclick.net /
 * googlesyndication / tpc.googlesyndication / id starting "google_ads_iframe"
 * or "aswift_") AND covers a large portion of the viewport or is anchored
 * to the bottom edge.
 */

const GOOGLE_AD_IFRAME_SELECTOR = [
  'iframe[id^="google_ads_iframe"]',
  'iframe[id^="aswift_"]',
  'iframe[src*="googleads.g.doubleclick.net"]',
  'iframe[src*="googlesyndication.com"]',
  'iframe[src*="tpc.googlesyndication.com"]',
  'ins.adsbygoogle',
].join(',');

const containsGoogleAd = (el: Element): boolean => {
  if (el.matches?.(GOOGLE_AD_IFRAME_SELECTOR)) return true;
  return !!el.querySelector?.(GOOGLE_AD_IFRAME_SELECTOR);
};

const isAdminAdSlot = (el: Element): boolean => {
  // Don't nuke the in-app AdSlot wrapper — those are intentional manual units
  return !!el.closest?.('[data-ad-slot-wrapper]');
};

const isOverlayCandidate = (el: HTMLElement): boolean => {
  const cs = window.getComputedStyle(el);
  if (cs.position !== 'fixed' && cs.position !== 'sticky') return false;
  if (cs.display === 'none' || cs.visibility === 'hidden') return false;

  const rect = el.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Vignette ONLY: covers most of the viewport. Anchor ads (top/bottom
  // sticky strips) are intentionally left alone.
  return rect.width >= vw * 0.6 && rect.height >= vh * 0.6;
};

const cleanup = () => {
  // Remove URL hash that Google sets when vignette triggers
  if (window.location.hash === '#google_vignette') {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  // Find every fixed/sticky element that contains a Google ad and looks like
  // an overlay (covering the viewport or anchored to an edge). Skip our own
  // intentional ad slots.
  const all = document.querySelectorAll<HTMLElement>('body *');
  for (const el of Array.from(all)) {
    if (isAdminAdSlot(el)) continue;
    if (!containsGoogleAd(el)) continue;
    if (!isOverlayCandidate(el)) continue;
    el.remove();
  }

  // Class-based catch-all for Google's own overlay wrappers
  document
    .querySelectorAll('.google-vignette, .google-anchor, [id^="google_anchor"]')
    .forEach((el) => {
      if (!isAdminAdSlot(el)) el.remove();
    });

  // Restore body scroll / pointer events if vignette locked them
  if (document.body.style.overflow === 'hidden') document.body.style.overflow = '';
  if (document.documentElement.style.overflow === 'hidden')
    document.documentElement.style.overflow = '';
};

export const installAdsenseOverlayBlocker = () => {
  if (typeof window === 'undefined') return;
  cleanup();
  const run = () => {
    // Defer to next frame so we evaluate after Google finishes injecting
    requestAnimationFrame(cleanup);
  };
  const observer = new MutationObserver(run);
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('hashchange', cleanup);
  // Periodic safety sweep in case a mutation slips past the observer
  window.setInterval(cleanup, 1500);
};
