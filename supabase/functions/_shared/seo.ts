export const SEO_ORIGIN = 'https://miytube.com';

export const videoWatchPath = (id: string, music = false) =>
  music ? `/watch?id=${encodeURIComponent(id)}&type=music` : `/watch?v=${encodeURIComponent(id)}`;

/** Never advertise temporary, data, or placeholder assets to crawlers. */
export function publicMediaUrl(value?: string): string | undefined {
  if (!value || /placeholder\.(svg|png|jpe?g|webp)(?:[?#]|$)/i.test(value)) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined;
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return undefined;
    return url.href;
  } catch { return undefined; }
}

export function isoUploadDate(value?: string | Date): string | undefined {
  if (!value) return undefined;
  // Display labels such as "Just now" or locale-formatted dates aren't source metadata.
  if (typeof value === 'string' && !/^\d{4}-\d{2}-\d{2}(?:T|\s)/.test(value)) return undefined;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : undefined;
}

export function isoVideoDuration(value?: string): string | undefined {
  if (!value) return undefined;
  const iso = value.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/);
  if (iso) return Number(iso[1] || 0) * 3600 + Number(iso[2] || 0) * 60 + Number(iso[3] || 0) > 0 ? value : undefined;
  if (!/^\d+:\d{2}(?::\d{2})?$/.test(value)) return undefined;
  const parts = value.split(':').map(Number);
  const seconds = parts.pop() ?? 0;
  const minutes = parts.pop() ?? 0;
  const hours = parts.pop() ?? 0;
  if (seconds >= 60 || (value.split(':').length === 3 && minutes >= 60)) return undefined;
  const total = hours * 3600 + minutes * 60 + seconds;
  if (total <= 0) return undefined;
  const h = Math.floor(total / 3600), m = Math.floor(total % 3600 / 60), s = total % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s ? `${s}S` : ''}`;
}

export interface VideoSchemaInput {
  videoId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  uploadDate?: string | Date;
  duration?: string;
  contentUrl?: string;
  youtubeId?: string;
  watchPath?: string;
  views?: number;
  tags?: string[];
}

export function buildVideoSchema(input: VideoSchemaInput) {
  const thumbnailUrl = publicMediaUrl(input.thumbnailUrl);
  const uploadDate = isoUploadDate(input.uploadDate);
  const isYouTube = typeof input.youtubeId === 'string' && /^[\w-]{11}$/.test(input.youtubeId);
  const source = publicMediaUrl(input.contentUrl);
  // A YouTube watch page is not the raw video file. Use the actual iframe instead.
  const contentUrl = source && !/^(?:www\.|m\.)?(?:youtube\.com|youtu\.be|youtube-nocookie\.com)$/.test(new URL(source).hostname)
    ? source : undefined;
  if (!input.videoId || !input.title.trim() || !thumbnailUrl || !uploadDate || (!contentUrl && !isYouTube)) return null;
  const url = `${SEO_ORIGIN}${input.watchPath || videoWatchPath(input.videoId)}`;
  const duration = isoVideoDuration(input.duration);
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `${url}#video`,
    url,
    mainEntityOfPage: url,
    name: input.title,
    description: input.description?.trim() || input.title,
    thumbnailUrl: [thumbnailUrl],
    uploadDate,
    ...(isYouTube ? { embedUrl: `https://www.youtube-nocookie.com/embed/${input.youtubeId}` } : { contentUrl }),
    ...(duration ? { duration } : {}),
    publisher: { '@type': 'Organization', name: 'MiyTube', url: SEO_ORIGIN },
    ...(Number.isInteger(input.views) && Number(input.views) >= 0 ? {
      interactionStatistic: {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'WatchAction' },
        userInteractionCount: input.views,
      },
    } : {}),
    ...(input.tags?.length ? { keywords: input.tags.slice(0, 32).join(', ') } : {}),
  };
}

/** Safe even if an uploaded title contains script-like text. */
export const serializeJsonLd = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c');