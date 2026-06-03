import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Re-triggers AdSense Auto Ads on every SPA route change.
 *
 * AdSense Auto Ads only scans the page on the initial load. In a single-page
 * app, subsequent route changes never trigger a new scan, so most pages a
 * visitor sees produce zero ad impressions. Pushing an empty object onto
 * adsbygoogle prompts AdSense to re-evaluate the current DOM and place ads
 * where appropriate.
 *
 * Safe to call repeatedly — AdSense de-duplicates its own placements.
 */
export const AutoAdsRefresh = () => {
  const location = useLocation();

  useEffect(() => {
    // Skip the very first render — the AdSense script in index.html already
    // handles the initial page load on its own.
    if (typeof window === 'undefined') return;

    try {
      // @ts-ignore – injected by the AdSense script in index.html
      (window.adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: 'ca-pub-3759206856597376',
        enable_page_level_ads: true,
      });
    } catch (err) {
      // Ad blockers / offline / etc. — fail silently.
      console.debug('Auto Ads refresh skipped:', err);
    }
  }, [location.pathname]);

  return null;
};

export default AutoAdsRefresh;
