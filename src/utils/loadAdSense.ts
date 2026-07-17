/**
 * Dynamically load Google AdSense ONLY for high-quality human visitors.
 *
 * This is a defense-in-depth measure to protect AdSense signals from:
 *   - Known bots/crawlers (client-side UA heuristics)
 *   - Datacenter/hosting/VPN/proxy IPs (server-side ip-api lookup)
 *   - The site owner ("exclude me" localStorage flag) so self-testing
 *     never triggers ad impressions on his own account
 *
 * If any check flags the visitor, the AdSense script is NEVER injected,
 * so the browser makes zero requests to pagead2.googlesyndication.com.
 * Legitimate <ins class="adsbygoogle"> slots simply stay empty for those
 * visitors — no error, no impression, no revenue.
 */

import { isLikelyBot } from './botDetection';

const ADSENSE_CLIENT = 'ca-pub-3759206856597376';
const ADSENSE_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
const VISITOR_QUALITY_KEY = 'analytics_visitor_quality';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

type VisitorQuality = { is_datacenter: boolean; is_proxy: boolean };

const injectAdSense = () => {
  if (document.querySelector('script[data-adsense-loader="1"]')) return;
  const s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = ADSENSE_SRC;
  s.setAttribute('data-adsense-loader', '1');
  document.head.appendChild(s);
};

const getCachedQuality = (): VisitorQuality | null => {
  try {
    const raw = sessionStorage.getItem(VISITOR_QUALITY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const fetchQuality = async (): Promise<VisitorQuality | null> => {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/check-visitor-quality`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: '{}',
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const result: VisitorQuality = {
      is_datacenter: !!data.is_datacenter,
      is_proxy: !!data.is_proxy,
    };
    try {
      sessionStorage.setItem(VISITOR_QUALITY_KEY, JSON.stringify(result));
    } catch {
      // storage disabled — ignore
    }
    return result;
  } catch {
    return null;
  }
};

export const loadAdSenseIfHuman = async (): Promise<void> => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // 1. Owner opt-out — never load ads on the developer's own browser.
  try {
    if (localStorage.getItem('analytics_exclude_me') === 'true') return;
  } catch {
    // storage disabled — continue with other checks
  }

  // 2. Client-side bot/headless heuristic
  if (isLikelyBot()) return;

  // 3. Server-side datacenter / proxy / VPN check (cached per session)
  const cached = getCachedQuality();
  const quality = cached ?? (await fetchQuality());
  if (quality && (quality.is_datacenter || quality.is_proxy)) return;

  // Passed every filter — load AdSense.
  injectAdSense();
};
