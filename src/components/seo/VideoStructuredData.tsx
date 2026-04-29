import { useEffect } from 'react';

interface VideoStructuredDataProps {
  videoId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  uploadDate?: string | Date;
  duration?: string; // ISO 8601 (PT1M30S) or "mm:ss" / "hh:mm:ss"
  contentUrl?: string;
  views?: number;
  tags?: string[];
}

const DOMAIN = 'https://miytube.com';

const toIsoDuration = (d?: string): string | undefined => {
  if (!d) return undefined;
  if (/^PT/.test(d)) return d;
  const parts = d.split(':').map(Number);
  if (parts.some(isNaN)) return undefined;
  let h = 0, m = 0, s = 0;
  if (parts.length === 2) [m, s] = parts;
  else if (parts.length === 3) [h, m, s] = parts;
  else return undefined;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s ? `${s}S` : ''}` || 'PT0S';
};

const toIsoDate = (d?: string | Date): string => {
  if (!d) return new Date().toISOString();
  try { return new Date(d).toISOString(); } catch { return new Date().toISOString(); }
};

/**
 * Injects schema.org VideoObject JSON-LD into <head>.
 * Helps Google show video rich results (thumbnail + duration in search).
 */
export const VideoStructuredData: React.FC<VideoStructuredDataProps> = ({
  videoId,
  title,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl,
  views,
  tags,
}) => {
  useEffect(() => {
    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: title,
      description: description || title,
      thumbnailUrl: thumbnailUrl || `${DOMAIN}/placeholder.svg`,
      uploadDate: toIsoDate(uploadDate),
      embedUrl: `${DOMAIN}/watch/${videoId}`,
      contentUrl: contentUrl || undefined,
      duration: toIsoDuration(duration),
      publisher: {
        '@type': 'Organization',
        name: 'MiyTube',
        logo: {
          '@type': 'ImageObject',
          url: `${DOMAIN}/placeholder.svg`,
        },
      },
    };
    if (typeof views === 'number' && views > 0) {
      data.interactionStatistic = {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'WatchAction' },
        userInteractionCount: views,
      };
    }
    if (tags && tags.length) data.keywords = tags.slice(0, 32).join(', ');

    // Strip undefined keys
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    const id = 'video-jsonld';
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);

    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [videoId, title, description, thumbnailUrl, uploadDate, duration, contentUrl, views, tags]);

  return null;
};
