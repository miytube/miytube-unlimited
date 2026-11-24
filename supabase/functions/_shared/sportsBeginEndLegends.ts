/** Shared roster for the archive, upload labels, public pages and sitemaps. */
export interface SportsLegend {
  id: number;
  name: string;
  slug: string;
  sport: string;
  aliases: string[];
}

export const LEGENDS_CATEGORY_SLUG = 'sports-begin-end-legends';
export const LEGENDS_SUBCATEGORY_SLUG = 'legends-sports-begin-end';
export const LEGENDS_BASE_PATH = `/c/${LEGENDS_CATEGORY_SLUG}/${LEGENDS_SUBCATEGORY_SLUG}`;

const legend = (id: number, name: string, sport: string, aliases: string[]): SportsLegend => ({
  id, name, sport, aliases,
  slug: `legend-${name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`,
});

export const SPORTS_LEGENDS: SportsLegend[] = [
  legend(1, 'LeBron James', 'Basketball', ['lebron']),
  legend(2, 'Serena Williams', 'Tennis', ['serena williams', 'serena']),
  legend(3, 'Tom Brady', 'Football', ['tom brady', 'brady']),
  legend(4, 'Kobe Bryant', 'Basketball', ['kobe bryant', 'kobe']),
  legend(5, 'Caitlin Clark', 'Basketball', ['caitlin clark']),
  legend(6, 'Lionel Messi', 'Soccer', ['messi']),
  legend(7, 'Shohei Ohtani', 'Baseball', ['ohtani', 'shohei']),
  legend(8, 'Wayne Gretzky', 'Hockey', ['gretzky']),
  legend(9, 'Tiger Woods', 'Golf', ['tiger woods']),
  legend(10, 'Michael Jordan', 'Basketball', ['michael jordan']),
  legend(11, 'Muhammad Ali', 'Boxing', ['muhammad ali', 'muhammed ali', 'cassius clay', 'ali']),
  legend(12, 'Babe Ruth', 'Baseball', ['babe ruth']),
  legend(13, 'John McEnroe', 'Tennis', ['mcenroe']),
  legend(14, 'Kareem Abdul-Jabbar', 'Basketball', ['kareem', 'abdul-jabbar', 'lew alcindor']),
  legend(15, 'Bill Russell', 'Basketball', ['bill russell']),
  legend(16, 'Jack Nicklaus', 'Golf', ['nicklaus']),
  legend(17, 'Arnold Palmer', 'Golf', ['arnold palmer']),
  legend(18, 'Mario Lemieux', 'Hockey', ['lemieux']),
  legend(19, 'Bobby Orr', 'Hockey', ['bobby orr', 'orr']),
  legend(20, 'Pelé', 'Soccer', ['pele']),
  legend(21, 'Cristiano Ronaldo', 'Soccer', ['cristiano', 'ronaldo']),
  legend(22, 'Jerry Rice', 'Football', ['jerry rice', 'rice']),
  legend(23, 'Walter Payton', 'Football', ['walter payton', 'payton']),
  legend(24, 'Roger Federer', 'Tennis', ['federer']),
  legend(25, 'Jackie Robinson', 'Baseball', ['jackie robinson']),
  legend(26, 'Mike Tyson', 'Boxing', ['mike tyson', 'tyson']),
  legend(27, 'Sugar Ray Leonard', 'Boxing', ['sugar ray leonard', 'sugar ray']),
];

export const SPORTS_LEGENDS_ALPHABETICAL = [...SPORTS_LEGENDS].sort((a, b) => a.name.localeCompare(b.name));
export const getLegendBySlug = (slug?: string | null) =>
  SPORTS_LEGENDS.find((item) => item.slug === (slug || '').toLowerCase().trim());
export const getLegendProfileUrl = (item: SportsLegend, campaign = 'legends_shelf') =>
  `https://sportsbeginend.com/profile/${item.id}?utm_source=miytube&utm_medium=referral&utm_campaign=${campaign}`;

export const LEGENDS_SITEMAP_PATHS = [
  `/c/${LEGENDS_CATEGORY_SLUG}`,
  LEGENDS_BASE_PATH,
  ...SPORTS_LEGENDS.map((item) => `${LEGENDS_BASE_PATH}/${item.slug}`),
];