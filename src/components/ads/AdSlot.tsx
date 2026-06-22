import { CSSProperties, useEffect, useRef } from 'react';
import { useIsLikelyChina } from '@/hooks/useIsLikelyChina';
import { HouseAd } from './HouseAd';


/**
 * Reusable Google AdSense ad slot.
 *
 * Replace the default `slot` prop with your real ad slot ID from AdSense
 * (Ads → By ad unit → Display ads → copy the data-ad-slot value).
 *
 * IMPORTANT: the global AdSense script is no longer loaded in index.html
 * because Auto Ads were injecting floating overlays (e.g. the "Movies" chip).
 * This component loads the AdSense script on demand, so only explicit
 * manual ad slots render ads.
 */
interface AdSlotProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical' | 'autorelaxed';
  layout?: string;
  className?: string;
  /** When true, ad uses full container width and responsive layout. */
  responsive?: boolean;
  /** Visual label so admins can spot empty slots in dev. */
  label?: string;
  /** Style applied to the wrapper div (use for fixed sizes like leaderboard/skyscraper). */
  style?: CSSProperties;
  /** Style applied directly to the <ins> element. */
  insStyle?: CSSProperties;
}

const PUBLISHER_ID = 'ca-pub-3759206856597376';
const ADSENSE_SCRIPT_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + PUBLISHER_ID;

let scriptLoadPromise: Promise<void> | null = null;

const loadAdSenseScript = (): Promise<void> => {
  if (typeof document === 'undefined') return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${ADSENSE_SCRIPT_URL}"]`) as HTMLScriptElement | null;
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = ADSENSE_SCRIPT_URL;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoadPromise = null;
      reject(new Error('Failed to load AdSense script'));
    };
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
};

export const AdSlot = ({
  slot = '0000000000',
  format = 'auto',
  layout,
  className = '',
  responsive = true,
  label,
  style,
  insStyle,
}: AdSlotProps) => {
  const insRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);
  const isLikelyChina = useIsLikelyChina();

  useEffect(() => {
    if (pushedRef.current || isLikelyChina) return;

    let cancelled = false;
    loadAdSenseScript()
      .then(() => {
        if (cancelled || pushedRef.current) return;
        try {
          // @ts-ignore – adsbygoogle is injected by the AdSense script
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushedRef.current = true;
        } catch (err) {
          console.debug('AdSlot push failed (likely ad blocker):', err);
        }
      })
      .catch((err) => {
        console.debug('AdSense script load failed:', err);
      });

    return () => {
      cancelled = true;
    };
  }, [isLikelyChina]);

  // For visitors where AdSense is blocked (mainland China), show a house ad
  // instead of leaving the slot blank.
  if (isLikelyChina) {
    return <HouseAd className={className} />;
  }

  return (
    <div
      data-ad-slot-wrapper
      className={`w-full overflow-hidden rounded-md ${className}`}
      aria-label={label || 'Advertisement'}
      style={style}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', ...insStyle }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};
