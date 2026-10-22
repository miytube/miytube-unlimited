/// <reference types="node" />
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { filterVideosBySubcategory } from './videoFiltering';
import type { UploadedVideo } from '@/context/UploadedVideosContext';

const makeVideo = (over: Partial<UploadedVideo> & { id: string }): UploadedVideo =>
  ({
    title: over.title || over.id,
    category: '',
    subcategory: '',
    tags: [],
    ...over,
  }) as unknown as UploadedVideo;

describe('subcategory filtering integrity', () => {
  test('a tag containing "State" never matches the /statues page', () => {
    const football = makeVideo({
      id: 'fresno-state',
      title: 'Fresno State Bulldogs vs. San Diego State Aztecs Week 7 Condensed Game',
      category: 'college-sports',
      subcategory: 'football',
      tags: ['Fresno State Bulldogs', 'miytube'],
    });
    const senator = makeVideo({
      id: 'senator',
      title: 'Minnesota state senator interview',
      category: 'news',
      subcategory: 'politics',
      tags: ['state', 'senator'],
    });
    const result = filterVideosBySubcategory(
      [football, senator],
      'Statues, Sculpture, Effigy',
      'statues'
    );
    assert.deepEqual(result.map((v) => v.id), []);
  });

  test('genuine statue and sculpture videos still land on /statues', () => {
    const gallery = makeVideo({
      id: 'gallery',
      title: 'A Gallery of Impressive Sculptures',
      category: 'history',
      subcategory: 'statues-and-sculpture',
      tags: ['statues', 'sculpture', 'gallery'],
    });
    const singular = makeVideo({
      id: 'singular',
      title: 'Statue tour',
      category: 'history',
      subcategory: 'statue',
      tags: ['statue'],
    });
    const result = filterVideosBySubcategory(
      [gallery, singular],
      'Statues, Sculpture, Effigy',
      'statues'
    );
    assert.deepEqual(result.map((v) => v.id), ['gallery', 'singular']);
  });

  test('college football stays on its own college football page', () => {
    const football = makeVideo({
      id: 'washington-state',
      title: 'Washington State vs. Oregon State FULL GAME HIGHLIGHTS',
      category: 'college-sports',
      subcategory: 'football',
      tags: ['Washington State', 'Oregon State', 'miytube'],
    });
    const result = filterVideosBySubcategory(
      [football],
      'College Football',
      'sports/college/football'
    );
    assert.equal(result.length, 1);
  });
});
