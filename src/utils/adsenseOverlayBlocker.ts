/**
 * Safety net: removes any AdSense anchor (sticky bottom) or vignette
 * (full-page interstitial) overlays that Google injects despite the
 * dashboard toggle being off.
 *
 * Identification heuristics (Google's overlay containers):
 *  - Anchor: <ins> / <div> with id starting "google_ads_iframe" inside a
 *    fixed-position container at bottom of viewport, or class
 *    "google-anchor" / data attr "google_reactive_ads_frame".
 *  - Vignette: full-screen <ins class="adsbygoogle"> with style position:fixed
 *    covering 100vw/100vh, often with id starting "aswift_".
 */

const isAnchorEl = (el: Element): boolean => {
  const tag = el.tagName?.toLowerCase();
  if (tag !== 'div' && tag !== 'ins' && tag !== 'iframe') return false;
  const id = (el.id || '').toLowerCase();
  const cls = (el.className && typeof el.className === 'string' ? el.className : '').toLowerCase();
  if (cls.includes('google-anchor')) return true;
  if (id.startsWith('google_anchor')) return true;
  // Fixed bottom container holding an adsbygoogle iframe
  const style = (el as HTMLElement).style;
  if (style?.position === 'fixed' && (style.bottom === '0px' || style.bottom === '0')) {
    if (el.querySelector('iframe[id^="google_ads_iframe"], ins.adsbygoogle')) return true;
  }
  return false;
};

const isVignetteEl = (el: Element): boolean => {
  const id = (el.id || '').toLowerCase();
  const cls = (el.className && typeof el.className === 'string' ? el.className : '').toLowerCase();
  if (cls.includes('google-vignette')) return true;
  if (id.includes('vignette')) return true;
  const style = (el as HTMLElement).style;
  if (style?.position === 'fixed' && (style.width === '100%' || style.width === '100vw') && (style.height === '100%' || style.height === '100vh')) {
    if (el.querySelector('iframe[id^="google_ads_iframe"], ins.adsbygoogle')) return true;
  }
  return false;
};

const cleanup = () => {
  // Remove URL hash that Google sets when vignette triggers
  if (window.location.hash === '#google_vignette') {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  document.querySelectorAll('body > div, body > ins, body > iframe').forEach((el) => {
    if (isAnchorEl(el) || isVignetteEl(el)) {
      el.remove();
    }
  });
  // Restore body scroll if vignette locked it
  if (document.body.style.overflow === 'hidden') {
    document.body.style.overflow = '';
  }
};

export const installAdsenseOverlayBlocker = () => {
  if (typeof window === 'undefined') return;
  cleanup();
  const observer = new MutationObserver(() => cleanup());
  observer.observe(document.body, { childList: true, subtree: false });
  window.addEventListener('hashchange', cleanup);
};
