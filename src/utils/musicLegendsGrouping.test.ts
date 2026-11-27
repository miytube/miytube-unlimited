/// <reference types="node" />
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { groupVideosByMusicLegend, resolveVideoMusicLegend } from './musicLegendsGrouping';
import { MUSIC_LEGENDS, MUSIC_LEGENDS_SITEMAP_PATHS, getMusicLegendBySlug } from '@/data/musicLegends';
import { buildMusicLegendSchema } from '@/lib/musicLegendSEO';

const v = (title: string, category = 'music', extra: Record<string, unknown> = {}) =>
  ({ id: title, title, category, subcategory: 'randb-and-soul', ...extra });
const who = (video: ReturnType<typeof v>) => resolveVideoMusicLegend(video)?.name;

describe('Music Legends', () => {
  test('the inaugural class is the eleven artists the owner chose, in order', () => {
    assert.deepEqual(MUSIC_LEGENDS.map((item) => item.name), [
      'Jimi Hendrix', 'The Beatles', 'Led Zeppelin', 'The Rolling Stones', 'Bob Dylan', 'Aretha Franklin',
      'Stevie Wonder', 'Elvis Presley', 'David Bowie', 'Prince', 'Michael Jackson',
    ]);
    assert.equal(new Set(MUSIC_LEGENDS.map((item) => item.slug)).size, 11);
    assert.equal(getMusicLegendBySlug('jimi-hendrix')?.name, 'Jimi Hendrix');
    assert.equal(getMusicLegendBySlug('beatles')?.name, 'The Beatles');
  });

  test('the sitemap lists the hub and every artist page', () => {
    assert.equal(MUSIC_LEGENDS_SITEMAP_PATHS.length, 12);
    assert.ok(MUSIC_LEGENDS_SITEMAP_PATHS.includes('/music-legends/michael-jackson'));
  });

  test('music videos land on the artist named in the title', () => {
    assert.equal(who(v('Michael Jackson - Billie Jean (Official Video)')), 'Michael Jackson');
    assert.equal(who(v('Prince - Call My Name (Official Music Video)')), 'Prince');
    assert.equal(who(v('Prince & The Revolution - Kiss')), 'Prince');
    assert.equal(who(v('The Rolling Stones Interview on The Ed Sullivan Show')), 'The Rolling Stones');
    assert.equal(who(v('Elvis - Suspicious Minds (Live)')), 'Elvis Presley');
    assert.equal(who(v('Woodstock 1969: Jimi Hendrix plays The Star-Spangled Banner')), 'Jimi Hendrix');
    assert.equal(who(v('Live set', 'music', { tags: ['Aretha Franklin'] })), 'Aretha Franklin');
  });

  test('look-alike names and non-music videos stay off the shelves', () => {
    assert.equal(who(v('Prince Royce - Corazon Sin Cara')), undefined);
    assert.equal(who(v('Doja Cat - Vegas (From the Original Motion Picture Soundtrack ELVIS)')), undefined);
    assert.equal(who(v('The Crown Prince & the President (full documentary)', 'news')), undefined);
    assert.equal(who(v('Eddie Murphy On Michael Jackson', 'entertainment')), undefined);
    assert.equal(who(v('Prince Auditions - SNL', 'comedy')), undefined);
    assert.equal(who(v('Quincy Jones, who worked with Michael Jackson, dies at 91', 'music-artists', { subcategory: 'music-artists-news' })), undefined);
  });

  test('videos are grouped per artist without duplicates or invented entries', () => {
    const groups = groupVideosByMusicLegend([v('Michael Jackson - Bad'), v('Michael Jackson - Beat It'), v('Sia - Chandelier')]);
    assert.equal(groups.size, 1);
    assert.equal(groups.get(11)?.length, 2);
  });

  test('bands are described as groups and solo artists as people', () => {
    const types = (slug: string) => buildMusicLegendSchema(getMusicLegendBySlug(slug), [], 0)['@graph'].map((node) => node['@type']);
    assert.ok(types('beatles').includes('MusicGroup'));
    assert.ok(types('prince').includes('Person'));
    assert.ok(!types('prince').includes('VideoObject'));
  });
});
