/// <reference types="node" />
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildVideoSchema, isoUploadDate, isoVideoDuration, serializeJsonLd, videoWatchPath } from './seo';
import { buildLegendSchema } from './legendSEO';
import { LEGENDS_BASE_PATH, LEGENDS_SITEMAP_PATHS, SPORTS_LEGENDS } from '@/data/sportsBeginEndLegends';
import { videoSitemapEntry } from '../../supabase/functions/_shared/videoSitemap';

const actualVideo = {
  videoId: 'upload-1795342665515-cf7107dd', title: 'Caitlin Clark Documentary',
  thumbnailUrl: 'https://example.com/thumbnails/caitlin.jpg',
  contentUrl: 'https://example.com/videos/caitlin.mp4',
  uploadDate: '2026-11-22T10:17:46.007Z', duration: '21:43',
};

describe('video rich-result data', () => {
  test('keeps the local video id, source upload date and real 21:43 duration', () => {
    const result = buildVideoSchema(actualVideo);
    assert.equal(result?.url, 'https://miytube.com/watch?v=upload-1795342665515-cf7107dd');
    assert.equal(result?.uploadDate, '2026-11-22T10:17:46.007Z');
    assert.equal(result?.duration, 'PT21M43S');
    assert.ok(result && 'contentUrl' in result);
    assert.equal(result.contentUrl, actualVideo.contentUrl);
    assert.ok(!('embedUrl' in result));
  });
  test('does not invent an upload date for missing or invalid data', () => {
    assert.equal(buildVideoSchema({ ...actualVideo, uploadDate: undefined }), null);
    assert.equal(buildVideoSchema({ ...actualVideo, uploadDate: 'Just now' }), null);
    assert.equal(isoUploadDate(new Date('invalid')), undefined);
  });
  test('does not emit a VideoObject with a placeholder or temporary thumbnail', () => {
    for (const thumbnailUrl of ['/placeholder.svg', 'https://example.com/placeholder.svg', 'blob:tmp', 'data:image/png;base64,test', undefined]) {
      assert.equal(buildVideoSchema({ ...actualVideo, thumbnailUrl }), null);
    }
  });
  test('a direct video needs a publicly playable source', () => {
    assert.equal(buildVideoSchema({ ...actualVideo, contentUrl: undefined }), null);
    assert.equal(buildVideoSchema({ ...actualVideo, contentUrl: 'blob:temporary' }), null);
  });
  test('YouTube uses the actual embed rather than claiming a watch URL is a file', () => {
    const result = buildVideoSchema({ ...actualVideo, contentUrl: 'https://www.youtube.com/watch?v=abcdefghijk', youtubeId: 'abcdefghijk' });
    assert.ok(result && 'embedUrl' in result);
    assert.equal(result.embedUrl, 'https://www.youtube-nocookie.com/embed/abcdefghijk');
    assert.ok(!('contentUrl' in result));
    assert.equal(buildVideoSchema({ ...actualVideo, contentUrl: 'https://youtu.be/abcdefghijk', youtubeId: 'bad' }), null);
  });
  test('invalid and zero duration are omitted rather than represented as PT', () => {
    for (const input of ['0:00', 'PT0S', 'PT', '3:99', '1:60:00', 'unknown']) assert.equal(isoVideoDuration(input), undefined);
    assert.equal(isoVideoDuration('1:02:03'), 'PT1H2M3S');
    assert.equal(isoVideoDuration('60:00'), 'PT1H');
  });
  test('music canonical paths preserve the real music query parameters', () => {
    assert.equal(videoWatchPath('abc', true), '/watch?id=abc&type=music');
    assert.equal(buildVideoSchema({ ...actualVideo, watchPath: videoWatchPath('abc', true) })?.url, 'https://miytube.com/watch?id=abc&type=music');
  });
  test('structured data preserves a measured total without adding another source', () => {
    assert.equal(buildVideoSchema({ ...actualVideo, views: 34 })?.interactionStatistic?.userInteractionCount, 34);
  });
  test('script-like titles survive safe JSON serialization as text', () => {
    const serialized = serializeJsonLd({ name: '</script><script>bad</script>' });
    assert.ok(!serialized.includes('<'));
    assert.equal(JSON.parse(serialized).name, '</script><script>bad</script>');
  });
});

describe('the 27-legend archive', () => {
  test('every roster entry has exactly one sitemap path including Caitlin, Kobe and Tiger', () => {
    assert.equal(SPORTS_LEGENDS.length, 27);
    assert.equal(LEGENDS_SITEMAP_PATHS.length, 29);
    assert.equal(new Set(LEGENDS_SITEMAP_PATHS).size, 29);
    for (const name of ['caitlin-clark', 'kobe-bryant', 'tiger-woods']) assert.ok(LEGENDS_SITEMAP_PATHS.includes(`${LEGENDS_BASE_PATH}/legend-${name}`));
    for (const legend of SPORTS_LEGENDS) assert.ok(LEGENDS_SITEMAP_PATHS.includes(`${LEGENDS_BASE_PATH}/${legend.slug}`));
    const sitemap = readFileSync('public/sitemap.xml', 'utf8');
    for (const path of LEGENDS_SITEMAP_PATHS) assert.equal(sitemap.split(`<loc>https://miytube.com${path}</loc>`).length - 1, 1);
  });
  test('a shelf describes its athlete, not an invented Article or main video', () => {
    const caitlin = SPORTS_LEGENDS.find((legend) => legend.id === 5);
    assert.ok(caitlin);
    const graph = buildLegendSchema(caitlin, [], 0)['@graph'];
    assert.deepEqual(graph.map((node) => node['@type']), ['CollectionPage', 'Person', 'ItemList', 'BreadcrumbList']);
    const person = graph.find((node) => node['@type'] === 'Person');
    assert.equal(person?.name, 'Caitlin Clark');
    assert.deepEqual(person?.sameAs, ['https://sportsbeginend.com/profile/5']);
  });
  test('a 52-video shelf advertises only its visible 20 videos, including pagination offsets', () => {
    const videos = Array.from({ length: 52 }, (_, index) => ({ id: `video-${index}`, title: `Video ${index}` }));
    const graph = buildLegendSchema(SPORTS_LEGENDS[4], videos.slice(20, 40), 52, 20)['@graph'];
    const list = graph.find((node) => node['@type'] === 'ItemList');
    assert.equal(list?.numberOfItems, 52);
    assert.equal(list?.itemListElement?.length, 20);
    assert.equal(list?.itemListElement?.[0].position, 21);
    const first = list?.itemListElement?.[0];
    assert.ok(first && 'url' in first);
    assert.equal(first.url, 'https://miytube.com/watch?v=video-20');
    assert.ok(!JSON.stringify(list).includes('video-40'));
  });
  test('the hub does not claim to be a single athlete', () => {
    assert.equal(buildLegendSchema(undefined, [], 0)['@graph'].some((node) => node['@type'] === 'Person'), false);
  });
  test('a visible short points to its card destination, not the regular watch player', () => {
    const graph = buildLegendSchema(SPORTS_LEGENDS[4], [{ id: 'clark-short', title: 'Clark clip', category: 'shorts' }], 1)['@graph'];
    const first = graph.find((node) => node['@type'] === 'ItemList')?.itemListElement?.[0];
    assert.ok(first && 'url' in first);
    assert.equal(first.url, 'https://miytube.com/shorts/feed?v=clark-short');
  });
});

describe('video sitemap matches watch-page data', () => {
  const row = {
    id: 'database-uuid', local_id: actualVideo.videoId, title: actualVideo.title,
    thumbnail_url: actualVideo.thumbnailUrl, created_at: actualVideo.uploadDate,
    cloud_url: actualVideo.contentUrl, duration: actualVideo.duration,
  };
  test('uses the playable local-id URL and real 21:43 duration', () => {
    const xml = videoSitemapEntry(row);
    assert.ok(xml.includes('<loc>https://miytube.com/watch?v=upload-1795342665515-cf7107dd</loc>'));
    assert.ok(xml.includes('<video:duration>1303</video:duration>'));
    assert.ok(xml.includes('<video:publication_date>2026-11-22T10:17:46.007Z</video:publication_date>'));
    assert.ok(!xml.includes('/watch/database-uuid'));
  });
  test('missing thumbnail keeps a discoverable page URL without fake video markup', () => {
    const xml = videoSitemapEntry({ ...row, thumbnail_url: '/placeholder.svg' });
    assert.ok(xml.includes('<loc>'));
    assert.ok(!xml.includes('<video:video>'));
  });
  test('YouTube sitemap advertises a real player and escapes XML correctly', () => {
    const xml = videoSitemapEntry({ ...row, title: 'Clark & Iowa <highlights>', is_youtube_embed: true,
      youtube_video_id: 'abcdefghijk', cloud_url: 'https://youtu.be/abcdefghijk' });
    assert.ok(xml.includes('<video:player_loc>https://www.youtube-nocookie.com/embed/abcdefghijk</video:player_loc>'));
    assert.ok(!xml.includes('<video:content_loc>'));
    assert.ok(xml.includes('Clark &amp; Iowa &lt;highlights&gt;'));
  });
});