import { useEffect, useRef } from 'react';

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
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  layout?: string;
  className?: string;
  /** When true, ad uses full container width and responsive layout. */
  responsive?: boolean;
  /** Visual label so admins can spot empty slots in dev. */
  label?: string;
}

const PUBLISHER_ID = 'ca-pub-3759206856597376';

export const AdSlot = ({
  slot = '0000000000',
  format = 'auto',
  layout,
  className = '',
  responsive = true,
  label,
}: AdSlotProps) => {
  const insRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    try {
      // @ts-ignore – adsbygoogle is injected by the AdSense script in index.html
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch (err) {
      // Silently ignore — ad blocker or script not loaded yet
      console.debug('AdSlot push failed (likely ad blocker):', err);
    }
  }, []);

  return (
    <div
      className={`my-4 w-full overflow-hidden rounded-md bg-muted/20 ${className}`}
      aria-label={label || 'Advertisement'}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 90 }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};
