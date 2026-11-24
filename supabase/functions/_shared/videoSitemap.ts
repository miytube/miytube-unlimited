import { buildVideoSchema, isoUploadDate, SEO_ORIGIN, videoWatchPath } from './seo.ts';

export interface SitemapVideo {
  id: string;
  local_id?: string | null;
  title: string;
  description?: string | null;
  thumbnail_url?: string | null;
  cloud_url?: string | null;
  video_url?: string | null;
  youtube_video_id?: string | null;
  is_youtube_embed?: boolean | null;
  duration?: string | null;
  category?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export function videoSitemapEntry(video: SitemapVideo): string {
  const id = video.local_id || video.id;
  // Shorts redirect away from /watch, so advertise their actual individual page.
  const path = video.category?.toLowerCase() === 'shorts' ? `/shorts/${encodeURIComponent(id)}` : videoWatchPath(id);
  const schema = buildVideoSchema({
    videoId: id, title: video.title, description: video.description || undefined,
    thumbnailUrl: video.thumbnail_url || undefined, uploadDate: video.created_at,
    contentUrl: video.cloud_url || video.video_url || undefined,
    youtubeId: video.is_youtube_embed ? video.youtube_video_id || undefined : undefined,
    duration: video.duration || undefined, watchPath: path,
  });
  const lastmod = isoUploadDate(video.updated_at || video.created_at);
  let xml = `  <url>\n    <loc>${escapeXml(SEO_ORIGIN + path)}</loc>\n`;
  if (lastmod) xml += `    <lastmod>${lastmod}</lastmod>\n`;
  if (schema) {
    xml += `    <video:video>\n      <video:thumbnail_loc>${escapeXml(schema.thumbnailUrl[0])}</video:thumbnail_loc>\n`;
    xml += `      <video:title>${escapeXml(schema.name.substring(0, 100))}</video:title>\n`;
    xml += `      <video:description>${escapeXml(schema.description.substring(0, 2048))}</video:description>\n`;
    if ('contentUrl' in schema && schema.contentUrl) xml += `      <video:content_loc>${escapeXml(schema.contentUrl)}</video:content_loc>\n`;
    if ('embedUrl' in schema && schema.embedUrl) xml += `      <video:player_loc>${escapeXml(schema.embedUrl)}</video:player_loc>\n`;
    if (schema.duration) {
      const units = schema.duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/);
      const seconds = units ? Number(units[1] || 0) * 3600 + Number(units[2] || 0) * 60 + Number(units[3] || 0) : 0;
      if (seconds >= 1 && seconds <= 28800) xml += `      <video:duration>${Math.floor(seconds)}</video:duration>\n`;
    }
    xml += `      <video:publication_date>${schema.uploadDate}</video:publication_date>\n    </video:video>\n`;
  }
  return xml + '  </url>\n';
}