import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BannerAdPreview } from './BannerAdPreview';

interface Ad {
  id: string;
  headline: string;
  description: string | null;
  business_name: string;
  call_to_action: string | null;
  destination_url: string;
  media_url: string | null;
}

interface BannerAdSlotProps {
  placement?: 'homepage' | 'watch';
  className?: string;
}

// Fetches an approved active banner campaign and renders it as an on-site ad.
// Records an impression on mount and a click when the ad is clicked.
export const BannerAdSlot: React.FC<BannerAdSlotProps> = ({ placement = 'watch', className }) => {
  const [ad, setAd] = useState<Ad | null>(null);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.rpc('get_active_banner_ads', { _placement: placement });
      if (cancelled || error || !data || data.length === 0) return;
      const pick = data[Math.floor(Math.random() * data.length)] as Ad;
      setAd(pick);
    })();
    return () => { cancelled = true; };
  }, [placement]);

  useEffect(() => {
    if (!ad || tracked) return;
    setTracked(true);
    supabase.rpc('record_ad_event', { _campaign_id: ad.id, _event: 'impression' }).then(() => {});
  }, [ad, tracked]);

  if (!ad) return null;

  const handleClick = () => {
    supabase.rpc('record_ad_event', { _campaign_id: ad.id, _event: 'click' }).then(() => {});
  };

  return (
    <a
      href={ad.destination_url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className={`block ${className ?? ''}`}
      aria-label={`Sponsored: ${ad.headline}`}
    >
      <BannerAdPreview
        headline={ad.headline}
        description={ad.description ?? undefined}
        businessName={ad.business_name}
        callToAction={ad.call_to_action ?? 'Learn More'}
        mediaUrl={ad.media_url ?? undefined}
      />
    </a>
  );
};
