import React, { useEffect, useState } from 'react';
import { Eye, Megaphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import videoAsset from '@/assets/ceo-thank-you.mp4.asset.json';

const KEY = 'ceo-thank-you-2026-10';
// Runs for 10 days.
export const ANNOUNCEMENT_START = new Date('2026-10-21T00:00:00Z');
export const ANNOUNCEMENT_END = new Date('2026-10-31T00:00:00Z');

export const isAnnouncementActive = (now = new Date()) =>
  now >= ANNOUNCEMENT_START && now < ANNOUNCEMENT_END;

const viewerKey = () => {
  let k = localStorage.getItem('miytube_viewer_key');
  if (!k) {
    k = crypto.randomUUID();
    localStorage.setItem('miytube_viewer_key', k);
  }
  return k;
};

export const CeoAnnouncement: React.FC = () => {
  const [views, setViews] = useState<number | null>(null);
  const active = isAnnouncementActive();

  useEffect(() => {
    if (!active) return;
    supabase
      .rpc('record_announcement_view', { _key: KEY, _viewer: viewerKey() })
      .then(({ data }) => typeof data === 'number' && setViews(data));
  }, [active]);

  if (!active) return null;

  return (
    <section className="mb-8 overflow-hidden rounded-xl border bg-card" aria-label="Special announcement">
      <div className="relative aspect-video w-full">
        <video src={videoAsset.url} className="absolute inset-0 h-full w-full object-cover" autoPlay loop muted playsInline />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          <Megaphone size={14} /> Featured Special Announcement
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <p className="max-w-3xl text-2xl font-semibold leading-tight text-foreground md:text-4xl">
            “Thank You for allowing MiyTube into your homes.”
          </p>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">— Mark Hayes, CEO</p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Eye size={16} /> {views === null ? '…' : `${views.toLocaleString()} ${views === 1 ? 'person has' : 'people have'} seen this`}
          </p>
        </div>
      </div>
    </section>
  );
};
