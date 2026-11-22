/// <reference types="node" />
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { groupVideosByLegend, resolveVideoLegend, isLegendsVideo } from './legendsGrouping';
import { SPORTS_LEGENDS, getLegendBySlug } from '@/data/sportsBeginEndLegends';

const v = (title: string, extra: Record<string, unknown> = {}) => ({
  id: title,
  title,
  category: 'sports-begin-end-legends',
  subcategory: 'legends-sports-begin-end',
  ...extra,
});

describe('Sports Begins End legends', () => {
  test('there are exactly 27 legends with unique ids 1-27 and unique slugs', () => {
    assert.deepEqual(SPORTS_LEGENDS.map((l) => l.id), Array.from({ length: 27 }, (_, i) => i + 1));
    assert.equal(new Set(SPORTS_LEGENDS.map((l) => l.slug)).size, 27);
  });

  test('a video uploaded under Michael Jordan goes under Michael Jordan', () => {
    const video = v('Some random highlight', { subcategory: 'legend-michael-jordan' });
    assert.equal(resolveVideoLegend(video)?.name, 'Michael Jordan');
    assert.equal(isLegendsVideo({ ...video, category: 'sports' }), true);
  });

  test('explicit legend choice beats a different name in the title', () => {
    assert.equal(resolveVideoLegend(v('Kobe vs Jordan', { subcategory: 'legend-michael-jordan' }))?.name, 'Michael Jordan');
  });

  test('older uploads are placed by the legend named in the title', () => {
    assert.equal(resolveVideoLegend(v('Cassius Clay (Muhammad Ali) vs. Sonny Liston 1'))?.name, 'Muhammad Ali');
    assert.equal(resolveVideoLegend(v("Ali's IMPOSSIBLE Victory Explained"))?.name, 'Muhammad Ali');
    assert.equal(resolveVideoLegend(v("Pele's Best Skills   FIFA World Cup"))?.name, 'Pelé');
    assert.equal(resolveVideoLegend(v('RARE  KAREEM ABDUL-JABBAR  1965 POWER MEMORIAL vs RICE'))?.name, 'Kareem Abdul-Jabbar');
    assert.equal(resolveVideoLegend(v('Michael Jordan last 3 minutes in his FINAL BULLS GAME'))?.name, 'Michael Jordan');
  });

  test('"Jordan" alone does not claim a video for Michael Jordan', () => {
    assert.equal(resolveVideoLegend(v('Jordan River documentary')), undefined);
  });

  test('videos with no legend go to the unassigned group', () => {
    const { shelves, unassigned } = groupVideosByLegend([
      v('Walter Payton - Beyond The Glory'),
      v('1985 Bears Road to the Super Bowl'),
      v('Babe Ruth The Complete Story'),
    ]);
    assert.deepEqual(shelves.map((s) => s.legend.name), ['Babe Ruth', 'Walter Payton']);
    assert.deepEqual(unassigned.map((x) => x.title), ['1985 Bears Road to the Super Bowl']);
  });

  test('legend slugs are looked up case-insensitively', () => {
    assert.equal(getLegendBySlug('LEGEND-PELE')?.id, 20);
  });
});

import { getUploadDestinationRoute as legendRoute } from './categoryRoute';

test('legend watchpage links use the real 3-tier legend page, not the hub', () => {
  assert.equal(legendRoute('sports-begin-end-legends', 'legend-caitlin-clark'),
    '/c/sports-begin-end-legends/legends-sports-begin-end/legend-caitlin-clark'
  );
  assert.equal(legendRoute('sports-begin-end-legends', 'legend-walter-payton'),
    '/c/sports-begin-end-legends/legends-sports-begin-end/legend-walter-payton'
  );
  assert.equal(legendRoute('sports-begin-end-legends', 'legends-sports-begin-end'),
    '/c/sports-begin-end-legends/legends-sports-begin-end'
  );
});
