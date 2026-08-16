/**
 * Lightweight client-side bot/crawler detection.
 *
 * Used to skip analytics tracking for obvious automated traffic so that
 * page_views and active_sessions reflect real human visitors. This protects
 * AdSense quality signals (high bounce rates from bots hurt fill rate).
 *
 * NOTE: This is a defense-in-depth measure. Real bots can spoof user agents.
 * Server-side filtering is more reliable but is not used here for analytics.
 */

const BOT_PATTERNS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /slurp/i,
  /facebookexternalhit/i,
  /bingpreview/i,
  /headless/i,
  /phantom/i,
  /puppeteer/i,
  /playwright/i,
  /selenium/i,
  /lighthouse/i,
  /pagespeed/i,
  /chrome-lighthouse/i,
  /python-requests/i,
  /curl\//i,
  /wget/i,
  /go-http-client/i,
  /node-fetch/i,
  /scrapy/i,
  /ahrefs/i,
  /semrush/i,
  /mj12/i,
  /dotbot/i,
  /Mediapartners-Google/i,
];

const SUSPICIOUS_CHROME_VERSION_THRESHOLD = 140;

const hasFakeChromeVersion = (ua: string): boolean => {
  // Spoofed headless bots often report impossible Chrome versions (e.g., 148/150/151)
  // while stable Chrome is still two-digit. Treat them as bots.
  const match = ua.match(/Chrome\/(\d+)\.0\.0\.0/);
  if (!match) return false;
  const version = parseInt(match[1], 10);
  return version >= SUSPICIOUS_CHROME_VERSION_THRESHOLD;
};

export const isLikelyBot = (): boolean => {
  if (typeof navigator === 'undefined') return true;
  const ua = navigator.userAgent || '';
  if (!ua) return true;
  if (BOT_PATTERNS.some((p) => p.test(ua))) return true;

  // Headless Chrome heuristic
  // @ts-ignore
  if (navigator.webdriver) return true;

  // No real browser features
  if (typeof window === 'undefined') return true;
  if (!('onscroll' in window)) return true;

  return false;
};
