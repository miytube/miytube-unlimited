/// <reference types="node" />
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { filterVideosBySubcategory } from './videoFiltering';
import type { UploadedVideo } from '@/context/UploadedVideosContext';
import { canonicalizeCategoryAssignment, getKnownParentCategoryOptions } from './categoryAssignment';
import { getSubcategoryOptionsForCategory } from './subcategoryOptions';
import { getUploadDestinationRoute } from './categoryRoute';
import { debateWatchRoute, debateWatchSlug, debateWatchTitle } from '@/data/subcategoryMappings/debate';

const makeVideo = (over: Partial<UploadedVideo> & { id: string }): UploadedVideo =>
  ({
    title: over.title || over.id,
    category: '',
    subcategory: '',
    tags: [],
    ...over,
  }) as unknown as UploadedVideo;

describe('subcategory filtering integrity', () => {
  test('both Calisthenics upload batches reach both watchpage aliases without unrelated workouts', () => {
    const videos = [
      makeVideo({ id: 'earlier', category: 'fitness-and-workout', subcategory: 'fitness-calisthenics' }),
      makeVideo({ id: 'newer', category: 'fitness-and-workout', subcategory: 'calisthenics-workout' }),
      makeVideo({ id: 'yoga', category: 'fitness-and-workout', subcategory: 'fitness-yoga-workout', tags: ['calisthenics'] }),
      makeVideo({ id: 'weights', category: 'fitness-and-workout', subcategory: 'fitness-weight-lifting' }),
    ];
    for (const key of ['physical-fitness/calisthenics', 'fitness/calisthenics', 'physical-fitness-calisthenics', 'fitness-calisthenics']) {
      assert.deepEqual(filterVideosBySubcategory(videos, 'Calisthenics Workout', key).map((v) => v.id), ['earlier', 'newer']);
    }
  });
  test('Debate uploads retain their category and reach the requested watchpage', () => {
    assert.ok(getKnownParentCategoryOptions().some((option) => option.id === 'debate'));
    const choices = getSubcategoryOptionsForCategory('debate');
    assert.ok(choices.some((option) => option.id === debateWatchSlug));
    assert.deepEqual(canonicalizeCategoryAssignment('Debate', debateWatchTitle), {
      category: 'debate', subcategory: debateWatchSlug,
    });
    assert.equal(getUploadDestinationRoute('Debate', debateWatchTitle), debateWatchRoute);
  });

  test('Debate watchpage only includes its assigned debates, never other politics or sports', () => {
    const videos = [
      makeVideo({ id: 'governors', category: 'debate', subcategory: debateWatchSlug }),
      makeVideo({ id: 'attorneys', category: 'Debate', subcategory: debateWatchTitle }),
      makeVideo({ id: 'other-debate', category: 'debate', subcategory: 'other-topic' }),
      makeVideo({ id: 'politics', category: 'news', subcategory: 'politics', tags: ['debate', debateWatchRoute.slice(1)] }),
      makeVideo({ id: 'sports', category: 'college-sports', subcategory: 'football', tags: ['debate'] }),
    ];
    assert.deepEqual(filterVideosBySubcategory(videos, debateWatchTitle, debateWatchRoute.slice(1)).map((v) => v.id), ['governors', 'attorneys']);
    assert.deepEqual(filterVideosBySubcategory(videos, 'Debate', 'debate').map((v) => v.id), ['governors', 'attorneys', 'other-debate']);
  });
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
