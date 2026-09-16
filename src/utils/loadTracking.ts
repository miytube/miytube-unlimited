/**
 * Consent-gated loader for all non-essential third-party vendors.
 *
 * Nothing here runs until `mayLoadTracking()` resolves true, so visitors in
 * consent regions never contact Google or Microsoft before they accept.
 */

import {
  CONSENT_CHANGE_EVENT,
  mayLoadTracking,
  updateGoogleConsentMode,
  getStoredConsent,
} from './consent';
import { loadAdSenseIfHuman } from './loadAdSense';

const GA_MEASUREMENT_ID = 'G-SNLTDDVSNH';
const CLARITY_ID = 'na123du7fz';

let started = false;

const appendScript = (src: string, attrs: Record<string, string> = {}) => {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement('script');
  s.src = src;
  s.async = true;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
};

const loadGoogleAnalytics = () => {
  appendScript(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
  }
};

const loadClarity = () => {
  if (document.querySelector('script[data-clarity-loader="1"]')) return;
  const w = window as unknown as Record<string, unknown> & {
    clarity?: ((...a: unknown[]) => void) & { q?: unknown[] };
  };
  w.clarity =
    w.clarity ||
    function (...args: unknown[]) {
      (w.clarity!.q = w.clarity!.q || []).push(args);
    };
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  s.setAttribute('data-clarity-loader', '1');
  document.head.appendChild(s);
};

const startVendors = () => {
  if (started) return;
  started = true;
  updateGoogleConsentMode('granted');
  loadGoogleAnalytics();
  loadClarity();
  loadAdSenseIfHuman();
};

/**
 * Call once after first paint. Loads vendors immediately where permitted, and
 * otherwise waits for the visitor's decision from the cookie banner.
 */
export const initTracking = (): void => {
  if (typeof window === 'undefined') return;

  const stored = getStoredConsent();
  if (stored) updateGoogleConsentMode(stored);

  window.addEventListener(CONSENT_CHANGE_EVENT, (e) => {
    const choice = (e as CustomEvent).detail;
    if (choice === 'granted') startVendors();
    // A withdrawal cannot un-send past events; it stops all future ones. The
    // page reloads from the banner so already-loaded vendors are torn down.
  });

  void mayLoadTracking().then((allowed) => {
    if (allowed) startVendors();
  });
};
