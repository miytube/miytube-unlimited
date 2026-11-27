/** Shared Music Legends roster for public pages, video shelves and sitemaps. */
export interface MusicLegend {
  id: number;
  name: string;
  slug: string;
  /** Solo artists are people; bands are groups (drives structured data). */
  kind: 'Person' | 'MusicGroup';
  genre: string;
  /** Filter chip on the hub. */
  group: string;
  description: string;
  /** Whole phrases that identify the artist anywhere in a music title or tag. */
  aliases: string[];
  /** Short names that only count when they open the title, e.g. "Prince - Kiss". */
  leadAliases: string[];
}

export const MUSIC_LEGENDS_NAME = 'Music Legends';
export const MUSIC_LEGENDS_TAGLINE = 'From the first chord to the Hall of Fame.';
export const MUSIC_LEGENDS_BASE_PATH = '/music-legends';
/** Stored category for uploads filed straight under Music Legends. */
export const MUSIC_LEGENDS_CATEGORY_SLUG = 'music-legends';

const legend = (
  id: number, name: string, kind: MusicLegend['kind'], genre: string, group: string,
  description: string, aliases: string[], leadAliases: string[] = [],
): MusicLegend => ({
  id, name, kind, genre, group, description, aliases, leadAliases,
  slug: name.toLowerCase().replace(/^the\s+/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
});

export const MUSIC_LEGENDS: MusicLegend[] = [
  legend(1, 'Jimi Hendrix', 'Person', 'Blues Rock', 'Rock',
    'Blues-rock pioneer and electric guitar innovator known for pedal effects, left-handed playing, fretting-hand thumb techniques and The Jimi Hendrix Experience.',
    ['jimi hendrix', 'hendrix']),
  legend(2, 'The Beatles', 'MusicGroup', 'Rock', 'Rock',
    'Groundbreaking 1960s rock band featuring John Lennon, Paul McCartney, George Harrison and Ringo Starr.',
    ['the beatles', 'beatles']),
  legend(3, 'Led Zeppelin', 'MusicGroup', 'Hard Rock', 'Rock',
    'Influential hard rock and heavy metal band led by Robert Plant, Jimmy Page, John Paul Jones and John Bonham.',
    ['led zeppelin']),
  legend(4, 'The Rolling Stones', 'MusicGroup', 'Classic Rock', 'Rock',
    'Long-running classic rock band formed in 1962 with Mick Jagger and Keith Richards.',
    ['the rolling stones', 'rolling stones']),
  legend(5, 'Bob Dylan', 'Person', 'Folk & Rock', 'Folk',
    'Influential singer-songwriter and lyricist whose catalog shaped folk and rock.',
    ['bob dylan']),
  legend(6, 'Aretha Franklin', 'Person', 'Soul', 'Soul & R&B',
    'Known as the "Queen of Soul," celebrated for her powerhouse vocals and classics like "Respect".',
    ['aretha franklin']),
  legend(7, 'Stevie Wonder', 'Person', 'Soul, R&B & Funk', 'Soul & R&B',
    'Multi-instrumentalist, singer and songwriter in soul, R&B and funk with hits like "Superstition" and "Isn\'t She Lovely".',
    ['stevie wonder']),
  legend(8, 'Elvis Presley', 'Person', "Rock 'n' Roll", 'Rock',
    'Defining rock \'n\' roll icon known as the "King of Rock and Roll".',
    ['elvis presley'], ['elvis']),
  legend(9, 'David Bowie', 'Person', 'Art Rock', 'Rock',
    'Genre-shifting singer and performer recognized for reinvention and style.',
    ['david bowie'], ['bowie']),
  legend(10, 'Prince', 'Person', 'Funk, Pop & Rock', 'Pop & Funk',
    'Multi-instrumentalist, performer and songwriter behind tracks like "Purple Rain" and "Kiss".',
    ['prince and the revolution', 'prince the revolution'], ['prince']),
  legend(11, 'Michael Jackson', 'Person', 'Pop', 'Pop & Funk',
    'The "King of Pop," a singer, songwriter and dancer behind "Thriller," "Billie Jean" and "Beat It".',
    ['michael jackson']),
];

export const MUSIC_LEGENDS_ALPHABETICAL = [...MUSIC_LEGENDS].sort((a, b) =>
  a.name.replace(/^The\s+/, '').localeCompare(b.name.replace(/^The\s+/, '')));
export const MUSIC_LEGEND_GROUPS = [...new Set(MUSIC_LEGENDS.map((item) => item.group))];
export const getMusicLegendBySlug = (slug?: string | null) =>
  MUSIC_LEGENDS.find((item) => item.slug === (slug || '').toLowerCase().trim());
const slugify = (value?: string | null) =>
  (value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
/** The artist an upload's subcategory names: "jimi-hendrix", "The Beatles" or "the-beatles". */
export const getMusicLegendBySubcategory = (subcategory?: string | null) => {
  const value = slugify(subcategory);
  if (!value) return undefined;
  return MUSIC_LEGENDS.find((item) => item.slug === value || slugify(item.name) === value);
};
export const musicLegendPath = (item: MusicLegend) => `${MUSIC_LEGENDS_BASE_PATH}/${item.slug}`;

export const MUSIC_LEGENDS_SITEMAP_PATHS = [MUSIC_LEGENDS_BASE_PATH, ...MUSIC_LEGENDS.map(musicLegendPath)];
