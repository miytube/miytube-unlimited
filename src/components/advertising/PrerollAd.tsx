import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentSiteId } from '@/config/sites';
import { Button } from '@/components/ui/button';
import { SkipForward, ExternalLink, Volume2, VolumeX } from 'lucide-react';

interface PrerollCampaign {
  id: string;
  headline: string;
  description: string | null;
  business_name: string;
  call_to_action: string | null;
  destination_url: string;
  media_url: string;
  ad_format: string;
}

const SKIP_AFTER_SECONDS = 5;
const SESSION_KEY = 'miytube_preroll_last_shown';
const MIN_GAP_MS = 10 * 60 * 1000; // at most one pre-roll per 10 minutes

const isSafeHttpUrl = (raw: string) => {
  try {
    const u = new URL(raw);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
};

/**
 * Wraps a video player and plays a pre-roll video ad first (when one is available).
 * - Skippable formats show a "Skip Ad" button after 5 seconds.
 * - Bumper / non-skippable play through.
 * - When no ad fills, the child player renders immediately.
 */
export const PrerollAd: React.FC<{ children: React.ReactNode; disabled?: boolean }> = ({
  children,
  disabled = false,
}) => {
  const [ad, setAd] = useState<PrerollCampaign | null>(null);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (disabled) return;
    let cancelled = false;

    const last = Number(sessionStorage.getItem(SESSION_KEY) || 0);
    if (Date.now() - last < MIN_GAP_MS) return;

    (async () => {
      const { data, error } = await supabase.rpc('get_active_preroll_ads', { _site: getCurrentSiteId() });
      if (cancelled || error || !data || data.length === 0) return;
      const pick = (data as PrerollCampaign[]).find(a => a.media_url && isSafeHttpUrl(a.media_url));
      if (!pick) return;
      sessionStorage.setItem(SESSION_KEY, String(Date.now()));
      setAd(pick);
      supabase.rpc('record_ad_event', { _campaign_id: pick.id, _event: 'impression' }).then(() => {});
    })();

    return () => { cancelled = true; };
  }, [disabled]);

  if (!ad || finished) return <>{children}</>;

  const skippable = ad.ad_format === 'skippable_instream';
  const canSkip = skippable && elapsed >= SKIP_AFTER_SECONDS;

  const handleClickThrough = () => {
    supabase.rpc('record_ad_event', { _campaign_id: ad.id, _event: 'click' }).then(() => {});
    window.open(ad.destination_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={ad.media_url}
        className="w-full h-full object-contain cursor-pointer"
        autoPlay
        muted={muted}
        playsInline
        onClick={handleClickThrough}
        onTimeUpdate={e => {
          const el = e.currentTarget;
          setElapsed(el.currentTime);
          if (el.duration && isFinite(el.duration)) setRemaining(Math.ceil(el.duration - el.currentTime));
        }}
        onEnded={() => setFinished(true)}
        onError={() => setFinished(true)}
      />

      <div className="absolute top-3 left-3 flex items-center gap-2">
        <span className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs font-semibold">Ad</span>
        {remaining !== null && (
          <span className="px-2 py-1 rounded bg-background/80 text-foreground text-xs">
            {skippable ? `Your video plays in ${remaining}s` : `Ad ends in ${remaining}s`}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => setMuted(m => !m)}
        aria-label={muted ? 'Unmute ad' : 'Mute ad'}
        className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background text-foreground"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between gap-3 bg-gradient-to-t from-black/80 to-transparent">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{ad.headline}</p>
          <p className="text-xs text-white/80 truncate">{ad.business_name}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="secondary" onClick={handleClickThrough}>
            {ad.call_to_action || 'Learn More'}
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
          {skippable && (
            <Button size="sm" variant="outline" disabled={!canSkip} onClick={() => setFinished(true)}>
              {canSkip ? (
                <>Skip Ad<SkipForward className="ml-1 h-3 w-3" /></>
              ) : (
                `Skip in ${Math.max(0, Math.ceil(SKIP_AFTER_SECONDS - elapsed))}s`
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
