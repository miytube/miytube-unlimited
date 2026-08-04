import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentSiteId } from '@/config/sites';
import { BannerAdPreview } from './BannerAdPreview';
import { pickHouseAdForNow, HOUSE_AD_INTERVAL_HOURS } from './houseAds';

interface Ad {
  id: string;
  headline: string;
  description: string | null;
  business_name: string;
  call_to_action: string | null;
  destination_url: string;
  media_url: string | null;
  isHouse?: boolean;
}

interface BannerAdSlotProps {
  placement?: 'homepage' | 'watch';
  className?: string;
}

// Fetches an approved active banner campaign and renders it as an on-site ad.
// Rotates in a MiyTube "house ad" every HOUSE_AD_INTERVAL_HOURS hours.
// Records an impression on mount and a click when the ad is clicked.
export const BannerAdSlot: React.FC<BannerAdSlotProps> = ({ placement = 'watch', className }) => {
  const [ad, setAd] = useState<Ad | null>(null);
  const [tracked, setTracked] = useState(false);
  const [tick, setTick] = useState(0);

  // Recompute the house-ad window periodically so the slot flips without a reload.
  const houseAd = useMemo(() => pickHouseAdForNow(placement), [placement, tick]);

  useEffect(() => {
    let cancelled = false;

    // If we're currently in a house-ad window, show the house ad and skip the paid fetch.
    if (houseAd) {
      setAd({
        id: houseAd.id,
        headline: houseAd.headline,
        description: houseAd.description,
        business_name: houseAd.businessName,
        call_to_action: houseAd.callToAction,
        destination_url: houseAd.destinationUrl,
        media_url: houseAd.mediaUrl ?? null,
        isHouse: true,
      });
      return () => { cancelled = true; };
    }

    (async () => {
      const { data, error } = await supabase.rpc('get_active_banner_ads', { _placement: placement, _site: getCurrentSiteId() });
      if (cancelled || error || !data || data.length === 0) return;
      const pick = data[Math.floor(Math.random() * data.length)] as Ad;
      setAd(pick);
    })();
    return () => { cancelled = true; };
  }, [placement, houseAd]);

  // Re-render when a house-ad window boundary is crossed so the slot flips live.
  useEffect(() => {
    const intervalMs = HOUSE_AD_INTERVAL_HOURS * 60 * 60 * 1000;
    const msUntilNextBoundary = intervalMs - (Date.now() % intervalMs) + 1000;
    const timeout = window.setTimeout(() => {
      setAd(null);
      setTracked(false);
      setTick(t => t + 1);
    }, msUntilNextBoundary);
    return () => window.clearTimeout(timeout);
  }, [tick]);

  useEffect(() => {
    if (!ad || tracked) return;
    setTracked(true);
    if (ad.isHouse) return; // don't log paid-ad events for house ads
    supabase.rpc('record_ad_event', { _campaign_id: ad.id, _event: 'impression' }).then(() => {});
  }, [ad, tracked]);

  if (!ad) return null;

  const handleClick = () => {
    if (ad.isHouse) return;
    supabase.rpc('record_ad_event', { _campaign_id: ad.id, _event: 'click' }).then(() => {});
  };

  const isInternal = ad.destination_url.startsWith('/');

  return (
    <a
      href={ad.destination_url}
      target={isInternal ? undefined : '_blank'}
      rel={isInternal ? undefined : 'noopener noreferrer sponsored'}
      onClick={handleClick}
      className={`block ${className ?? ''}`}
      aria-label={`${ad.isHouse ? 'Promo' : 'Sponsored'}: ${ad.headline}`}
    >
      <BannerAdPreview
        headline={ad.headline}
        description={ad.description ?? undefined}
        businessName={ad.business_name}
        callToAction={ad.call_to_action ?? 'Learn More'}
        mediaUrl={ad.media_url ?? undefined}
        theme={ad.isHouse ? (houseAd?.theme ?? 'blue') : 'blue'}
      />
    </a>
  );
};
