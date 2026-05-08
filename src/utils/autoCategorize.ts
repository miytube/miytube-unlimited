/**
 * Auto-categorize an upload by scanning the title/description/filename/tags
 * for keywords that map to a known category (and optional subcategory).
 *
 * Used ONLY when the uploader did not pick a category. If they picked one,
 * their choice always wins.
 */

interface CategoryRule {
  category: string;
  subcategory?: string;
  // Words that strongly indicate this category. Whole-word match, case-insensitive.
  keywords: string[];
}

// Order matters: more specific rules first. The first rule with the most
// keyword hits wins; ties are broken by the order below.
const RULES: CategoryRule[] = [
  // Music
  { category: 'music', subcategory: 'music-artists-news',
    keywords: ['music news', 'artist news', 'album drop', 'tour announce'] },
  { category: 'music',
    keywords: ['song', 'songs', 'album', 'track', 'single', 'remix', 'cover',
               'lyrics', 'lyric video', 'concert', 'live performance', 'mv',
               'official video', 'official audio', 'feat.', 'feat ', 'ft.',
               'beat', 'beats', 'instrumental', 'acoustic', 'band', 'rapper',
               'singer', 'producer', 'dj set'] },

  // News & Politics
  { category: 'news', subcategory: 'breaking-news',
    keywords: ['breaking news', 'breaking:', 'just in', 'developing'] },
  { category: 'news', subcategory: 'politics',
    keywords: ['politics', 'political', 'election', 'senate', 'congress',
               'president', 'biden', 'trump', 'governor', 'campaign', 'vote'] },
  { category: 'news',
    keywords: ['news', 'report', 'reports', 'reported', 'update', 'headline',
               'headlines', 'press conference'] },

  // Sports
  { category: 'sports',
    keywords: ['nba', 'nfl', 'nhl', 'mlb', 'wnba', 'soccer', 'football',
               'basketball', 'baseball', 'hockey', 'highlights', 'game recap',
               'playoff', 'playoffs', 'championship', 'season opener'] },

  // Gaming
  { category: 'gaming',
    keywords: ['gameplay', 'walkthrough', 'speedrun', 'gamer', 'gaming',
               'esports', 'twitch', 'playthrough', 'lets play', "let's play"] },

  // Comedy
  { category: 'comedy',
    keywords: ['standup', 'stand-up', 'stand up', 'comedian', 'comedy special',
               'sketch', 'parody', 'prank'] },

  // Cars & Vehicles
  { category: 'autos-vehicles',
    keywords: ['car review', 'engine', 'horsepower', 'dyno', 'drift', 'drag race',
               'supercar', 'racing', 'motorcycle', 'truck review', 'test drive'] },

  // Pets & Animals
  { category: 'pets-animals',
    keywords: ['puppy', 'kitten', 'dog', 'cat', 'wildlife', 'aquarium', 'zoo',
               'pet', 'pets', 'rescue animal'] },

  // Cooking / Food
  { category: 'food',
    keywords: ['recipe', 'recipes', 'cooking', 'baking', 'kitchen', 'chef',
               'how to cook', 'restaurant review', 'taste test'] },

  // Education
  { category: 'education',
    keywords: ['tutorial', 'how to', 'lesson', 'learn', 'course', 'lecture',
               'study guide', 'explained', 'beginners guide'] },

  // Fitness
  { category: 'fitness',
    keywords: ['workout', 'exercise', 'gym', 'training routine', 'yoga',
               'pilates', 'cardio', 'crossfit'] },

  // Military
  { category: 'military',
    keywords: ['military', 'army', 'navy', 'marines', 'air force', 'soldier',
               'tank', 'fighter jet', 'submarine', 'war footage'] },

  // Hollywood / Film
  { category: 'film',
    keywords: ['trailer', 'movie trailer', 'official trailer', 'film review',
               'box office', 'movie scene'] },
  { category: 'hollywood',
    keywords: ['celebrity', 'celebrities', 'red carpet', 'oscar', 'oscars',
               'hollywood', 'premiere', 'paparazzi', 'gossip'] },

  // Podcasts
  { category: 'podcasts',
    keywords: ['podcast', 'episode', 'interview with'] },

  // Weather / Disasters
  { category: 'weather',
    keywords: ['hurricane', 'tornado', 'storm', 'blizzard', 'forecast',
               'severe weather'] },
  { category: 'disasters',
    keywords: ['earthquake', 'tsunami', 'wildfire', 'flooding', 'landslide',
               'volcano eruption', 'disaster footage'] },

  // Comedy/Funny shorts catch-all
  { category: 'comedy',
    keywords: ['funny', 'hilarious', 'lol moment'] },
];

const matchCount = (haystack: string, keywords: string[]): number => {
  let count = 0;
  for (const kw of keywords) {
    const k = kw.toLowerCase();
    if (k.includes(' ')) {
      if (haystack.includes(k)) count++;
    } else {
      const re = new RegExp(`(^|[^a-z0-9])${k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}([^a-z0-9]|$)`, 'i');
      if (re.test(haystack)) count++;
    }
  }
  return count;
};

export interface AutoCategoryResult {
  category: string;
  subcategory?: string;
  matchedKeywords: string[];
}

/**
 * Pick the best-fit category from text. Returns undefined when nothing matches.
 */
export const autoCategorize = (
  title: string,
  description: string,
  fileName: string,
  tags?: string[]
): AutoCategoryResult | undefined => {
  const haystack = [title, description, fileName, ...(tags || [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  if (!haystack.trim()) return undefined;

  let best: { rule: CategoryRule; score: number; hits: string[] } | undefined;

  for (const rule of RULES) {
    const score = matchCount(haystack, rule.keywords);
    if (score > 0 && (!best || score > best.score)) {
      const hits = rule.keywords.filter(k => haystack.includes(k.toLowerCase()));
      best = { rule, score, hits };
    }
  }

  if (!best) return undefined;
  return {
    category: best.rule.category,
    subcategory: best.rule.subcategory,
    matchedKeywords: best.hits,
  };
};
