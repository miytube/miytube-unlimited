import React from 'react';
import promoAsset from '@/assets/miytube-promo-ad.mp4.asset.json';

export const PROMO_VIDEO_URL: string = promoAsset.url;

interface PromoVideoProps {
  className?: string;
  /** Shown to screen readers / when the video cannot play. */
  label?: string;
}

/**
 * MiyTube brand promo clip. Muted, looping and inline so it can sit in
 * marketing surfaces (homepage hero, advertising page) without hijacking audio.
 */
export const PromoVideo: React.FC<PromoVideoProps> = ({ className = '', label = 'MiyTube promotional video' }) => (
  <video
    src={PROMO_VIDEO_URL}
    className={`w-full h-full object-cover ${className}`}
    autoPlay
    loop
    muted
    playsInline
    preload="metadata"
    aria-label={label}
  />
);
