/**
 * Strict video filtering utility to prevent loose matching issues.
 * Videos should only appear in categories/subcategories they were explicitly assigned to.
 * Includes fuzzy matching to handle common typos.
 */

import { UploadedVideo } from '@/context/UploadedVideosContext';
import { normalizeCategoryValue } from '@/utils/normalizeCategory';

/**
 * True Levenshtein edit distance — used for tight typo tolerance only.
 */
const editDistance = (a: string, b: string): number => {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[] = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      if (a[i - 1] === b[j - 1]) {
        dp[j] = prev;
      } else {
        dp[j] = 1 + Math.min(prev, dp[j], dp[j - 1]);
      }
      prev = tmp;
    }
  }
  return dp[n];
};

/**
 * Tight typo tolerance: allow 1 edit for words ≥6 chars, 2 edits for ≥10 chars.
 * NEVER matches substrings or different-length strings beyond that budget.
 */
const isFuzzyMatch = (input: string, target: string): boolean => {
  const a = input.toLowerCase().trim();
  const b = target.toLowerCase().trim();
  if (!a || !b) return false;
  if (a === b) return true;
  // Length must be close
  if (Math.abs(a.length - b.length) > 2) return false;
  const longer = Math.max(a.length, b.length);
  if (longer < 6) return false; // too short, would cause false positives
  const budget = longer >= 10 ? 2 : 1;
  return editDistance(a, b) <= budget;
};

const sportsLeaguePatterns = [
  { league: 'nba', pattern: /(^|[\s\-/])nba($|[\s\-/])/ },
  { league: 'wnba', pattern: /(^|[\s\-/])wnba($|[\s\-/])/ },
  { league: 'nhl', pattern: /(^|[\s\-/])nhl($|[\s\-/])/ },
  { league: 'mlb', pattern: /(^|[\s\-/])mlb($|[\s\-/])/ },
  { league: 'nfl', pattern: /(^|[\s\-/])nfl($|[\s\-/])/ },
];

const detectSportsLeague = (text: string): string | undefined => {
  const normalized = text.toLowerCase().replace(/_/g, '-');
  return sportsLeaguePatterns.find(({ pattern }) => pattern.test(normalized))?.league;
};

// Detect playoff conference (east/west) so that fuzzy matching can't pull a
// "west-playoffs" video into the "east-playoffs" page (only 2 edits apart).
const detectConference = (text: string): 'east' | 'west' | undefined => {
  const t = text.toLowerCase();
  const hasEast = /(^|[\s\-/])east(ern)?($|[\s\-/])/.test(t);
  const hasWest = /(^|[\s\-/])west(ern)?($|[\s\-/])/.test(t);
  if (hasEast && !hasWest) return 'east';
  if (hasWest && !hasEast) return 'west';
  return undefined;
};

const routeValueAliases: Record<string, string[]> = {
  'music/rock': ['randb-pop-soul-rock', 'rock-soul-pop-randb', 'rock-soul-pop-and-randb', 'rock-soul-pop-r-and-b', 'music-rock-soul-pop', 'rock-soul-pop'],
  'music-rock': ['randb-pop-soul-rock', 'rock-soul-pop-randb', 'rock-soul-pop-and-randb', 'rock-soul-pop-r-and-b', 'music-rock-soul-pop', 'rock-soul-pop'],
  'music/pop': ['rock-soul-pop-randb', 'rock-soul-pop-and-randb', 'rock-soul-pop-r-and-b', 'music-rock-soul-pop', 'rock-soul-pop', 'pop-rnb'],
  'music-pop': ['rock-soul-pop-randb', 'rock-soul-pop-and-randb', 'rock-soul-pop-r-and-b', 'music-rock-soul-pop', 'rock-soul-pop', 'pop-rnb'],
  'music/soul': ['rock-soul-pop-randb', 'rock-soul-pop-and-randb', 'rock-soul-pop-r-and-b', 'randb-and-soul', 'r-and-b-and-soul', 'music-rock-soul-pop', 'rock-soul-pop'],
  'music-soul': ['rock-soul-pop-randb', 'rock-soul-pop-and-randb', 'rock-soul-pop-r-and-b', 'randb-and-soul', 'r-and-b-and-soul', 'music-rock-soul-pop', 'rock-soul-pop'],
  'music/rnb': ['randb', 'r-and-b', 'randb-and-soul', 'r-and-b-and-soul', 'rock-soul-pop-randb', 'rock-soul-pop-and-randb', 'rock-soul-pop-r-and-b'],
  'music-rnb': ['randb', 'r-and-b', 'randb-and-soul', 'r-and-b-and-soul', 'rock-soul-pop-randb', 'rock-soul-pop-and-randb', 'rock-soul-pop-r-and-b'],
  'music/r-and-b': ['randb', 'rnb', 'randb-and-soul', 'r-and-b-and-soul', 'rock-soul-pop-randb', 'rock-soul-pop-and-randb', 'rock-soul-pop-r-and-b'],
  'music-r-and-b': ['randb', 'rnb', 'randb-and-soul', 'r-and-b-and-soul', 'rock-soul-pop-randb', 'rock-soul-pop-and-randb', 'rock-soul-pop-r-and-b'],
  'court-trials': ['courts-trials', 'courts-police-trails', 'courts-police-trials'],
  'courts-trials': ['court-trials', 'courts-police-trails', 'courts-police-trials'],
  'courts/courts-trials': ['courts-trials', 'court-trials', 'courts-police-trails', 'courts-police-trials'],
  'courts-courts-trials': ['courts-trials', 'court-trials', 'courts-police-trails', 'courts-police-trials'],
  'sports/nhl': ['nhl-hockey', 'all-nhl-hockey'],
  'sports-nhl': ['nhl-hockey', 'all-nhl-hockey'],
  'sports/nba/east-playoffs': ['nba-playoffs-25-26', 'nba-east-playoffs'],
  'sports-nba-east-playoffs': ['nba-playoffs-25-26', 'nba-east-playoffs'],
  'sports/nba/west-playoffs': ['nba-playoffs-25-26', 'nba-west-playoffs'],
  'sports-nba-west-playoffs': ['nba-playoffs-25-26', 'nba-west-playoffs'],
  'sports/nba/season': ['nba-season', 'nba-basketball-season', 'nba-regular-season'],
  'sports-nba-season': ['nba-season', 'nba-basketball-season', 'nba-regular-season'],
  'sports/nba': ['nba', 'nba-basketball'],
  'sports/mlb': ['mlb', 'mlb-baseball', 'all-mlb-baseball'],
  'sports-mlb': ['mlb', 'mlb-baseball', 'all-mlb-baseball'],
  'sports/college/bowl': ['football-bowl-games', 'sports-college-bowl', 'sports-college-football-bowl', 'college-football-bowl-games'],
  'sports-college-bowl': ['football-bowl-games', 'sports-college-football-bowl', 'college-football-bowl-games'],
  'college-sports/football-bowl-games': ['football-bowl-games', 'sports-college-bowl', 'sports-college-football-bowl'],
  'college-sports-football-bowl-games': ['football-bowl-games', 'sports-college-bowl', 'sports-college-football-bowl'],
  // Street food sidebar links use multiple aliases; videos are stored under
  // category=travel-and-events / subcategory=travel-street-food.
  'travel-events/street-foods': ['travel-street-food'],
  'travel-events-street-foods': ['travel-street-food'],
  'foods/street': ['travel-street-food'],
  'foods-street': ['travel-street-food'],
  'street-food': ['travel-street-food'],
  'travel/street-food': ['travel-street-food'],
  'babies/funny': ['funny-and-comedy', 'babies-funny-and-comedy', 'babies-and-infants-funny-and-comedy'],
  '/babies/funny': ['funny-and-comedy', 'babies-funny-and-comedy', 'babies-and-infants-funny-and-comedy'],
  'babies-funny': ['funny-and-comedy', 'babies-funny-and-comedy', 'babies-and-infants-funny-and-comedy'],
  'babies/fails': ['baby-fails', 'babies-fails', 'babies-and-infants-baby-fails'],
  '/babies/fails': ['baby-fails', 'babies-fails', 'babies-and-infants-baby-fails'],
  'comedy/snl': ['snl-saturday-night-live', 'snl', 'snl-skits', 'saturday-night-live'],
  'comedy-snl': ['snl-saturday-night-live', 'snl', 'snl-skits', 'saturday-night-live'],
  'hollywood/celebrities/news': ['celebrity-news', 'celebrities-news', 'hollywood-celebrity-news', 'hollywood-celebrities-news'],
  'hollywood-celebrities-news': ['celebrity-news', 'celebrities-news', 'hollywood-celebrity-news'],
  'hollywood/celebrities/actors': ['celebrity-actors', 'celebrities-actors', 'hollywood-celebrity-actors', 'hollywood-celebrities-actors'],
  'hollywood-celebrities-actors': ['celebrity-actors', 'celebrities-actors', 'hollywood-celebrity-actors'],
  // Car repair watch pages — accept legacy / sidebar-label variants that
  // got stored under autos-vehicles or with shorter subcategory ids.
  'cars/repairs/major': ['cars-repairs-major', 'major-repairs', 'cars-major-repairs', 'major-car-repairs'],
  'cars-repairs-major': ['major-repairs', 'cars-major-repairs', 'major-car-repairs'],
  'cars/repairs/minor': ['cars-repairs-minor', 'minor-repairs', 'cars-minor-repairs', 'minor-car-repairs'],
  'cars-repairs-minor': ['minor-repairs', 'cars-minor-repairs', 'minor-car-repairs'],
  'cars/repairs/hacks': ['cars-repairs-hacks', 'car-hacks', 'cars-hacks', 'car-repair-hacks'],
  'cars-repairs-hacks': ['car-hacks', 'cars-hacks', 'car-repair-hacks'],
  'cars/repairs/maintenance': ['cars-repairs-maintenance', 'car-maintenance', 'cars-maintenance'],
  'cars-repairs-maintenance': ['car-maintenance', 'cars-maintenance'],
};


/**
 * Filter videos by exact category match or keyword-based matching for parent categories.
 * For parent categories (like "Business", "Cars"), we match if the video's category
 * starts with or equals that category name. Includes fuzzy matching for typos.
 */
export const filterVideosByCategory = (
  videos: UploadedVideo[],
  categoryName: string,
  keywords?: string[]
): UploadedVideo[] => {
  const categoryLower = categoryName.toLowerCase().trim();
  
  return videos.filter(video => {
    const vidCategory = video.category?.toLowerCase().trim() || '';
    const vidSubcategory = video.subcategory?.toLowerCase().trim() || '';
    const vidTags = video.tags?.map(t => t.toLowerCase().trim()) || [];
    
    // Exact match on category
    if (vidCategory === categoryLower) return true;
    
    // Check if category starts with the parent category name
    // e.g., "business-cryptocurrency" starts with "business"
    if (vidCategory.startsWith(categoryLower + '-') || vidCategory.startsWith(categoryLower + ' ')) return true;
    
    // Check subcategory exact match
    if (vidSubcategory === categoryLower) return true;
    
    // Check tags for exact match only
    if (vidTags.includes(categoryLower)) return true;
    
    // If keywords provided, check for exact or fuzzy keyword matches in category/subcategory
    if (keywords && keywords.length > 0) {
      return keywords.some(keyword => {
        const keywordLower = keyword.toLowerCase().trim();
        return (
          vidCategory === keywordLower ||
          vidSubcategory === keywordLower ||
          vidTags.includes(keywordLower)
        );
      });
    }
    
    return false;
  });
};

/**
 * Filter videos by subcategory with STRICT matching.
 *
 * A video matches only when its category/subcategory equals (or is a near-exact
 * typo variant of) the page's mapping key — including hyphen/space/no-separator
 * variants and the parent+child path form. Tag-based fallbacks, substring
 * `includes()`, and single-word title matching were removed because they leaked
 * videos across categories (e.g. cartoons appearing under Music/Rock).
 */
export const filterVideosBySubcategory = (
  videos: UploadedVideo[],
  pageTitle: string,
  mappingKey: string
): UploadedVideo[] => {
  const titleLower = pageTitle.toLowerCase().trim();
  const keyLower = mappingKey.toLowerCase().trim();

  const keySegments = keyLower.split('/');
  const lastSegment = keySegments[keySegments.length - 1];
  const parentSegment = keySegments.length > 1 ? keySegments[0] : '';

  const lastSegmentSpaced = lastSegment.replace(/-/g, ' ');
  const lastSegmentNoSep = lastSegment.replace(/[-\s]/g, '');
  const keyHyphenated = keyLower.replace(/\//g, '-');
  const keyNoSep = keyLower.replace(/[-\s/]/g, '');
  const titleNoSep = titleLower.replace(/[-\s]/g, '');

  // Build the canonical accepted-value set for this page.
  // For multi-segment paths (e.g. hollywood/celebrities/news), the bare last
  // segment ("news") and the page title ("Celebrity News") are too generic to
  // accept on their own — they leak unrelated videos in. Require parent context
  // for those via the parent+child rule below.
  const isMultiSegment = keySegments.length > 1;
  const acceptedBase = [
    keyLower,
    keyHyphenated,
    keyNoSep,
    `${parentSegment}-${lastSegment}`,
    `${parentSegment}/${lastSegment}`,
  ];
  // Strip a top-level domain prefix like "sports-", "music-", "news-" so that
  // a page keyed "sports-nba-basketball" also matches videos stored as just
  // "nba-basketball" (and vice-versa). Common when uploaders pick a leaf
  // category but the route lives under the parent hub.
  const domainPrefixes = ['sports-', 'music-', 'news-', 'gaming-', 'military-', 'hollywood-'];
  // Top-level domain names that must NEVER be accepted on their own as a
  // stripped key — otherwise a page like /sports/news would absorb every video
  // whose category or subcategory equals "news" (i.e. all News & Politics).
  const topLevelDomainSet = new Set(['news', 'news-and-politics', 'sports', 'music', 'gaming', 'military', 'hollywood', 'entertainment', 'comedy', 'film', 'education', 'business', 'health', 'fitness', 'food', 'travel', 'podcasts', 'podcast']);
  let strippedKey = keyHyphenated;
  for (const p of domainPrefixes) {
    if (keyHyphenated.startsWith(p)) {
      strippedKey = keyHyphenated.slice(p.length);
      // Block the stripped variant when it is a bare top-level domain
      // (e.g. "sports-news" → "news") OR when it BEGINS with a different
      // top-level domain prefix (e.g. "sports-news-podcasts" → "news-podcasts"),
      // which would otherwise pull videos from that other domain in.
      const startsWithOtherDomain = domainPrefixes.some(dp => strippedKey.startsWith(dp));
      if (!topLevelDomainSet.has(strippedKey) && !startsWithOtherDomain) {
        acceptedBase.push(strippedKey, strippedKey.replace(/[-\s]/g, ''));
      }
      break;
    }
  }
  // For deep paths (e.g. sports/nba/east-playoffs), also accept every contiguous
  // suffix of length >=2 in both slash and hyphen forms. This lets a video stored
  // as "nba-east-playoffs" match the /sports/nba/east-playoffs page.
  if (keySegments.length >= 3) {
    for (let start = 1; start < keySegments.length - 1; start++) {
      const suffix = keySegments.slice(start);
      const slashed = suffix.join('/');
      const hyphenated = suffix.join('-');
      acceptedBase.push(slashed, hyphenated, hyphenated.replace(/[-\s]/g, ''));
    }
  }
  if (!isMultiSegment) {
    acceptedBase.push(lastSegment, lastSegmentSpaced, lastSegmentNoSep, titleLower, titleNoSep);
  }
  const accepted = new Set<string>([
    ...acceptedBase,
    ...(routeValueAliases[keyLower] || []),
    ...(routeValueAliases[keyHyphenated] || []),
  ].filter(Boolean));

  const acceptedFuzzyTargets = isMultiSegment
    ? [keyLower, keyHyphenated]
    : [keyLower, keyHyphenated, lastSegment, lastSegmentSpaced];

  const norm = (s: string) => normalizeCategoryValue(s) || s.toLowerCase().trim().replace(/^\/+/, '');
  const normNoSep = (s: string) => norm(s).replace(/[-\s/]/g, '');

  return videos.filter(video => {
    const vidCategory = norm(video.category || '');
    const vidSubcategory = norm(video.subcategory || '');
    const vidCategoryNoSep = normNoSep(video.category || '');
    const vidSubcategoryNoSep = normNoSep(video.subcategory || '');
    const vidTags = (video.tags || []).map(t => norm(t));

    // Sports league isolation (NBA vs NHL etc.)
    const requestedLeague = detectSportsLeague(`${keyLower} ${titleLower}`);
    const videoLeague = detectSportsLeague(`${vidCategory} ${vidSubcategory} ${vidTags.join(' ')}`);
    if (requestedLeague && videoLeague && requestedLeague !== videoLeague) return false;

    // Playoff conference isolation (east vs west)
    const requestedConf = detectConference(`${keyLower} ${titleLower}`);
    const videoConf = detectConference(`${vidCategory} ${vidSubcategory}`);
    if (requestedConf && videoConf && requestedConf !== videoConf) return false;

    // 1) Exact match on category or subcategory (including normalized variants)
    if (accepted.has(vidCategory) || accepted.has(vidSubcategory)) return true;
    if (accepted.has(vidCategoryNoSep) || accepted.has(vidSubcategoryNoSep)) return true;

    // 1b) Hub aggregation: a multi-segment page like /sports/nba should also
    // include child videos stored under sports-nba-<child>. We deliberately do
    // NOT strip the top-level segment here — doing so caused pages like
    // /music-artists/news to absorb every "news-*" video on the site.
    if (isMultiSegment) {
      const hubPrefixes = [`${keyHyphenated}-`].filter(p => p.length > 1);
      // Only allow stripping the top segment when the path is deep (>=3 segments),
      // e.g. /sports/nba/east-playoffs → also accept "nba-east-playoffs".
      if (keySegments.length >= 3) {
        hubPrefixes.push(`${keySegments.slice(1).join('-')}-`);
      }
      for (const prefix of hubPrefixes) {
        if (vidCategory.startsWith(prefix) || vidSubcategory.startsWith(prefix)) return true;
      }
    }

    // 2) Parent + child match: video.category == parent AND video.subcategory == child
    if (parentSegment) {
      const parentNoSep = parentSegment.replace(/[-\s]/g, '');
      // Parent aliases: route slugs may differ from the canonical normalized
      // category stored on the video (e.g. route "how-to-style" vs normalized
      // "how-to-and-style" because "&" → "and").
      const parentAliases: Record<string, string[]> = {
        'sports': ['racing-sports'],
        'how-to-style': ['how-to-and-style'],
        'how-to-and-style': ['how-to-style'],
        'news': ['news-and-politics'],
        'news-and-politics': ['news'],
        'pets': ['pets-and-animals'],
        'pets-animals': ['pets-and-animals'],
        'pets-and-animals': ['pets-animals', 'pets'],
        'autos': ['autos-and-vehicles', 'autos-vehicles'],
        'autos-vehicles': ['autos-and-vehicles'],
        'autos-and-vehicles': ['autos-vehicles'],
        'oceans': ['waters-and-oceans', 'waters-oceans'],
        'waters-and-oceans': ['oceans', 'waters-oceans'],
        'waters-oceans': ['oceans', 'waters-and-oceans'],
      };
      const parentVariants = new Set<string>([parentSegment, ...(parentAliases[parentSegment] || [])]);
      const parentMatches = parentVariants.has(vidCategory) ||
        [...parentVariants].some(p => p.replace(/[-\s]/g, '') === vidCategoryNoSep);
      const childMatches =
        vidSubcategory === lastSegment ||
        vidSubcategory === lastSegmentSpaced ||
        vidSubcategoryNoSep === lastSegmentNoSep;
      if (parentMatches && childMatches) return true;

      // 2b) Parent + leaf-token match (OPT-IN ONLY): only fires for parents
      // explicitly listed in the synonym map. Previously this rule fired for
      // every parent and pulled in any video whose title/tags happened to
      // mention the leaf word — e.g. /motorcycles/harley absorbed videos
      // sub-categorized as "souped-up-motorcycles" merely because their tags
      // included "Harley Davidson". User rule: if the page was not chosen, the
      // video does not belong there.
      const synonymMap: Record<string, Record<string, string[]>> = {
        hair: {
          cuts: ['cut', 'cuts', 'haircut', 'haircuts', 'barber', 'barbershop', 'fade', 'taper', 'shave', 'beard', 'trim', 'bald', 'mickeydabarber', 'unit', 'units', 'weave', 'weaves', 'wig', 'wigs', 'man unit', 'hair unit'],
          styles: ['style', 'styles', 'hairstyle', 'hairstyles', 'braid', 'braids', 'curls', 'updo', 'ponytail'],
          extensions: ['extension', 'extensions', 'weave', 'weaves', 'wig', 'wigs', 'unit', 'units', 'lacefront', 'closure'],
        },
      };
      if (parentMatches && synonymMap[parentSegment]?.[lastSegment]) {
        const leafTokens = new Set<string>(synonymMap[parentSegment][lastSegment]);
        const haystacks: string[] = [video.title?.toLowerCase() || '', ...vidTags];
        const hayJoined = haystacks.join(' ');
        for (const tok of leafTokens) {
          if (!tok || tok.length < 3) continue;
          const re = new RegExp(`(^|[^a-z0-9])${tok.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}([^a-z0-9]|$)`, 'i');
          if (re.test(hayJoined)) return true;
        }
      }
    }

    // 3) Tight typo tolerance ONLY against the page key/title — not against tags,
    //    not against substrings, not against single words.
    for (const target of acceptedFuzzyTargets) {
      if (isFuzzyMatch(vidSubcategory, target) || isFuzzyMatch(vidCategory, target)) return true;
    }

    // 4) Exact tag match against the FULL page key (and title only for single-segment pages).
    //    Multi-segment pages skip the title-tag match because phrases like
    //    "celebrity news" appear on tons of unrelated news videos.
    if (vidTags.includes(keyLower) || vidTags.includes(keyHyphenated)) return true;
    if (vidTags.includes(keyNoSep)) return true;
    // Title-only tag fallback: require the video's category to be in the same
    // top-level domain as the page. Otherwise generic tags like "politics" on
    // an entertainment/late-night video would leak it into /news/politics.
    if (!isMultiSegment && vidTags.includes(titleLower)) {
      const topLevelDomains = ['entertainment', 'music', 'sports', 'news', 'news-politics', 'gaming', 'military', 'hollywood', 'hair', 'cars', 'autos-vehicles', 'pets-animals', 'education', 'comedy', 'film', 'business', 'health', 'fitness', 'food', 'travel', 'podcasts'];
      const pageDomain = topLevelDomains.find(d => keyHyphenated === d || keyHyphenated.startsWith(d + '-'));
      const vidDomain = topLevelDomains.find(d => vidCategory === d || vidCategory.startsWith(d + '-'));
      if (!pageDomain || !vidDomain || pageDomain === vidDomain ||
          // treat news and news-politics as the same domain
          (pageDomain.startsWith('news') && vidDomain.startsWith('news'))) {
        return true;
      }
      // domain mismatch — fall through and reject
    }

    // 5) Tag plural/singular tolerance against the FULL page key only.
    //    e.g. tag "haircut" should match page "hair-cuts" (and vice versa).
    //    Only applies to keys >=6 chars to avoid generic short-word leakage.
    const tagTargets = [keyHyphenated, keyNoSep].filter(t => t.length >= 6);
    const tagVariants = (s: string): string[] => {
      const out = new Set<string>([s]);
      if (s.endsWith('s')) out.add(s.slice(0, -1));
      else out.add(s + 's');
      return [...out];
    };
    for (const target of tagTargets) {
      const variants = tagVariants(target);
      for (const tag of vidTags) {
        const tagNoSep = tag.replace(/[-\s]/g, '');
        for (const v of variants) {
          if (tag === v || tagNoSep === v) return true;
          // Tight typo/plural via fuzzy (length-bounded, edit-budget tight)
          if (isFuzzyMatch(tag, v) || isFuzzyMatch(tagNoSep, v)) return true;
        }
      }
    }

    return false;
  });
};

/**
 * Filter videos by music genre with STRICT matching.
 * Requires the video to be a music-categorized upload AND the genre to match
 * the category/subcategory/tag exactly (or as a hyphen/space variant).
 * No fuzzy matching and no substring matching — short genre names like "rock"
 * were leaking unrelated videos (cartoons, sports) via loose includes/fuzzy logic.
 */
export const filterVideosByMusicGenre = (
  videos: UploadedVideo[],
  genre: string
): UploadedVideo[] => {
  const genreLower = genre.toLowerCase().trim();
  if (!genreLower) return [];

  const genreAliases: Record<string, string[]> = {
    rock: ['randb-pop-soul-rock', 'rock-soul-pop-randb', 'rock-soul-pop-and-randb', 'rock-soul-pop-r-and-b', 'music-rock-soul-pop', 'rock-soul-pop'],
    pop: ['rock-soul-pop-randb', 'rock-soul-pop-and-randb', 'rock-soul-pop-r-and-b', 'music-rock-soul-pop', 'rock-soul-pop', 'pop-rnb'],
    soul: ['rock-soul-pop-randb', 'rock-soul-pop-and-randb', 'rock-soul-pop-r-and-b', 'randb-and-soul', 'r-and-b-and-soul', 'music-rock-soul-pop', 'rock-soul-pop'],
    rnb: ['randb', 'r-and-b', 'randb-and-soul', 'r-and-b-and-soul', 'rock-soul-pop-randb', 'rock-soul-pop-and-randb', 'rock-soul-pop-r-and-b'],
    'r-and-b': ['randb', 'rnb', 'randb-and-soul', 'r-and-b-and-soul', 'rock-soul-pop-randb', 'rock-soul-pop-and-randb', 'rock-soul-pop-r-and-b'],
  };

  // Build accepted genre variants (hyphen / space / no-separator)
  const genreSpaced = genreLower.replace(/-/g, ' ');
  const genreNoSep = genreLower.replace(/[-\s]/g, '');
  const variants = new Set<string>([
    genreLower,
    genreSpaced,
    genreNoSep,
    `music-${genreLower}`,
    `music ${genreLower}`,
    `music-${genreSpaced}`,
    `music ${genreSpaced}`,
    ...(genreAliases[genreLower] || []),
  ]);

  const norm = (s: string) => s.toLowerCase().trim();
  const normNoSep = (s: string) => norm(s).replace(/[-\s]/g, '');

  return videos.filter(video => {
    const categoryLower = norm(video.category || '');
    const subcategoryLower = norm(video.subcategory || '');

    // MUST be a music video — prevents cartoons, sports, etc. from appearing
    const isMusicVideo =
      categoryLower === 'music' ||
      categoryLower.startsWith('music-') ||
      categoryLower.startsWith('music ');
    if (!isMusicVideo) return false;

    // Category/subcategory is the ONLY source of truth for genre membership.
    // Tag matching was removed: generic tags like "rock" on a video whose
    // subcategory was explicitly moved to "rock-music" should NOT pull it back
    // onto /music/rock. User rule: if the page was not chosen, the video does
    // not belong there.
    if (variants.has(categoryLower) || variants.has(subcategoryLower)) return true;
    if (variants.has(normNoSep(video.category || '')) || variants.has(normNoSep(video.subcategory || ''))) return true;

    return false;
  });
};
