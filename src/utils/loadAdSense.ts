/**
 * Load Google AdSense unconditionally.
 *
 * Previously this file gated the AdSense script behind bot/datacenter/proxy
 * checks to protect AdSense quality signals. Per the site owner's decision,
 * we no longer filter — AdSense loads for every visitor.
 */

const ADSENSE_CLIENT = 'ca-pub-3759206856597376';
const ADSENSE_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

export const loadAdSenseIfHuman = (): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (document.querySelector('script[data-adsense-loader="1"]')) return;
  const s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = ADSENSE_SRC;
  s.setAttribute('data-adsense-loader', '1');
  document.head.appendChild(s);
};
