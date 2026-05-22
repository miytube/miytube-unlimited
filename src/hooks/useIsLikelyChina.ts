import { useEffect, useState } from 'react';

/**
 * Lightweight, client-side heuristic to detect visitors likely located in mainland China.
 * Google AdSense is blocked by the Great Firewall, so we use this to swap ad slots
 * for a house promo panel rather than showing blank space.
 *
 * Heuristic (no network call):
 *   - Timezone is one of the mainland China zones (Asia/Shanghai, Asia/Chongqing,
 *     Asia/Urumqi, Asia/Harbin, Asia/Kashgar), OR
 *   - Primary browser language is Simplified Chinese (zh-CN, zh-Hans, zh).
 *
 * We intentionally exclude Asia/Hong_Kong, Asia/Macau, and Asia/Taipei because
 * AdSense works there.
 */
const CN_TIMEZONES = new Set([
  'Asia/Shanghai',
  'Asia/Chongqing',
  'Asia/Urumqi',
  'Asia/Harbin',
  'Asia/Kashgar',
]);

export const useIsLikelyChina = (): boolean => {
  const [isCN, setIsCN] = useState(false);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const lang = (navigator.language || '').toLowerCase();
      const langs = (navigator.languages || []).map((l) => l.toLowerCase());

      const tzMatch = CN_TIMEZONES.has(tz);
      const langMatch =
        lang === 'zh-cn' ||
        lang === 'zh' ||
        lang.startsWith('zh-hans') ||
        langs.includes('zh-cn') ||
        langs.includes('zh-hans');

      setIsCN(tzMatch || langMatch);
    } catch {
      setIsCN(false);
    }
  }, []);

  return isCN;
};
