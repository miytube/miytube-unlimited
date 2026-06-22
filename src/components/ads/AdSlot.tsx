import { CSSProperties, useEffect, useRef } from 'react';
import { useIsLikelyChina } from '@/hooks/useIsLikelyChina';
import { HouseAd } from './HouseAd';


/**
 * Reusable Google AdSense ad slot.
 *
 * Replace the default `slot` prop with your real ad slot ID from AdSense
 * (Ads → By ad unit → Display ads → copy the data-ad-slot value).
 *
 * Until you create real slots, the existing publisher script will render
 * "Auto ads" in available spaces, and these slots will reserve layout space.
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
    try {
      // @ts-ignore – adsbygoogle is injected by the AdSense script in index.html
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch (err) {
      // Silently ignore — ad blocker or script not loaded yet
      console.debug('AdSlot push failed (likely ad blocker):', err);
    }
  }, [isLikelyChina]);

  // For visitors where AdSense is blocked (mainland China), show a house ad
  // instead of leaving the slot blank.
  if (isLikelyChina) {
    return <HouseAd className={className} />;
  }

  return (
    <div
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
