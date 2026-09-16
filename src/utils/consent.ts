/**
 * GDPR/ePrivacy consent gate.
 *
 * Non-essential vendors (Google Analytics, Microsoft Clarity, Google AdSense)
 * must NOT load at all for visitors in regions that require prior consent.
 * Consent Mode alone is not enough — merely loading the vendor script already
 * transmits IP address and browser information.
 *
 * Outside those regions tracking stays enabled without a banner, and visitors
 * can still change their choice at any time via "Cookie Preferences".
 */

export type ConsentChoice = 'granted' | 'denied';

const STORAGE_KEY = 'miytube_consent_v1';
const REGION_CACHE_KEY = 'miytube_consent_region_v1';
export const CONSENT_CHANGE_EVENT = 'miytube:consent-change';
export const CONSENT_OPEN_EVENT = 'miytube:consent-open';

/** EEA + UK + Switzerland — prior consent required before any non-essential vendor. */
const CONSENT_REQUIRED_REGIONS = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO',
  'SK', 'SI', 'ES', 'SE', 'GB', 'CH',
]);

export const getStoredConsent = (): ConsentChoice | null => {
  if (typeof window === 'undefined') return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
};

export const setStoredConsent = (choice: ConsentChoice): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* storage blocked — the choice still applies for this page view */
  }
  updateGoogleConsentMode(choice);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: choice }));
};

/** Mirror the choice into Google Consent Mode so Google tags honour it too. */
export const updateGoogleConsentMode = (choice: ConsentChoice): void => {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== 'function') return;
  const value = choice === 'granted' ? 'granted' : 'denied';
  try {
    gtag('consent', 'update', {
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
      analytics_storage: value,
    });
  } catch {
    /* ignore */
  }
};

/**
 * Resolve the visitor's country from the same-origin Cloudflare trace endpoint.
 * On failure, timeout, unknown (XX) or Tor (T1) we assume consent is required.
 */
const resolveCountry = async (): Promise<string> => {
  if (typeof window === 'undefined') return 'XX';
  try {
    const cached = sessionStorage.getItem(REGION_CACHE_KEY);
    if (cached) return cached;
  } catch {
    /* ignore */
  }

  let country = 'XX';
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch('/cdn-cgi/trace', { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const text = await res.text();
      const match = text.match(/^loc=([A-Z0-9]{2})$/m);
      if (match) country = match[1];
    }
  } catch {
    country = 'XX';
  }

  try {
    sessionStorage.setItem(REGION_CACHE_KEY, country);
  } catch {
    /* ignore */
  }
  return country;
};

export const isConsentRequiredRegion = async (): Promise<boolean> => {
  const country = await resolveCountry();
  if (country === 'XX' || country === 'T1') return true; // unknown / Tor → be strict
  return CONSENT_REQUIRED_REGIONS.has(country);
};

/**
 * Whether non-essential vendors may load right now.
 * - Consent region: only after an explicit "granted".
 * - Elsewhere: allowed unless the visitor explicitly opted out.
 */
export const mayLoadTracking = async (): Promise<boolean> => {
  const stored = getStoredConsent();
  if (stored === 'denied') return false;
  if (stored === 'granted') return true;
  return !(await isConsentRequiredRegion());
};

/** Open the cookie preferences panel from anywhere (e.g. the footer link). */
export const openCookiePreferences = (): void => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
};
