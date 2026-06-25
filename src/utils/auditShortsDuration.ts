import { supabase } from '@/integrations/supabase/client';

const SHORTS_MAX_SECONDS = 60;
const PROBE_TIMEOUT_MS = 8000;
const STORAGE_KEY = 'miytube_shorts_audit_done_v1';

const parseDurationSeconds = (duration?: string | null): number | null => {
  if (!duration) return null;
  const parts = duration.split(':');
  if (parts.length !== 2) return null;
  const m = Number(parts[0]);
  const s = Number(parts[1]);
  if (!isFinite(m) || !isFinite(s)) return null;
  return m * 60 + s;
};

const probeVideoDuration = (url: string): Promise<number> =>
  new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.crossOrigin = 'anonymous';
    let done = false;

    const finish = (seconds: number) => {
      if (done) return;
      done = true;
      try { video.src = ''; video.load(); } catch {}
      const safe = isFinite(seconds) && seconds > 0 ? seconds : 0;
      resolve(safe);
    };

    const tryRead = () => {
      if (video.duration === Infinity || isNaN(video.duration)) {
        video.currentTime = 1e10;
        video.ontimeupdate = () => {
          video.ontimeupdate = null;
          finish(video.duration);
        };
      } else {
        finish(video.duration);
      }
    };

    video.onloadedmetadata = tryRead;
    video.onerror = () => finish(0);
    setTimeout(() => finish(video.duration || 0), PROBE_TIMEOUT_MS);
    video.src = url;
  });

const formatDuration = (seconds: number): string => {
  const safe = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

/**
 * One-time audit: re-measures the duration of videos in category='shorts'
 * whose stored duration is missing or invalid, and reclassifies any that
 * are longer than 60 seconds to category='video'.
 */
export const auditShortsDurations = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  if (window.sessionStorage.getItem(STORAGE_KEY) === '1') return;

  try {
    const { data, error } = await supabase
      .from('uploaded_videos')
      .select('id, title, category, duration, cloud_url, video_url')
      .eq('category', 'shorts')
      .limit(500);
    if (error || !data) return;

    let reclassified = 0;
    let fixed = 0;

    for (const v of data) {
      const seconds = parseDurationSeconds(v.duration as string);
      const needsProbe = seconds === null;
      if (!needsProbe && seconds !== null && seconds <= SHORTS_MAX_SECONDS) continue;

      let realSeconds = seconds ?? 0;
      const url = (v.cloud_url || v.video_url) as string | null;
      if (needsProbe && url) {
        realSeconds = await probeVideoDuration(url);
      }
      if (realSeconds <= 0) continue; // can't determine — skip

      const updates: Record<string, unknown> = { duration: formatDuration(realSeconds) };
      if (realSeconds > SHORTS_MAX_SECONDS) {
        updates.category = 'video';
        reclassified++;
      } else if (needsProbe) {
        fixed++;
      }

      await supabase.from('uploaded_videos').update(updates as never).eq('id', v.id);
    }

    window.sessionStorage.setItem(STORAGE_KEY, '1');
    if (reclassified > 0 || fixed > 0) {
      console.log(`Shorts audit: reclassified ${reclassified} long videos, fixed ${fixed} durations.`);
    }
  } catch (err) {
    console.error('Shorts audit failed:', err);
  }
};
