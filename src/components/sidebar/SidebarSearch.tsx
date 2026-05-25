import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { getSidebarMainCategoryRoute } from '@/data/sidebarMainCategories';

interface SearchItem {
  label: string;
  path: string;
  category?: string;
}

// Consolidated list of all searchable items
const allItems: SearchItem[] = [
  // AI & Technology
  { label: 'AI Agents & Software', path: '/ai-agents-software', category: 'AI & Technology' },
  { label: 'ChatGPT, Gemini, Microsoft', path: '/ai-chatgpt-gemini', category: 'AI & Technology' },
  { label: 'AI Bots & Automation', path: '/ai-bots-automation', category: 'AI & Technology' },
  { label: 'AI Human Resources', path: '/ai-human-resources', category: 'AI & Technology' },
  { label: 'AI Humanoids', path: '/ai-humanoids', category: 'AI & Technology' },
  { label: 'AI Robotics', path: '/ai-robotics', category: 'AI & Technology' },
  { label: 'Cell Phone Tricks & Hacks', path: '/cell-phone-tricks', category: 'AI & Technology' },
  { label: 'Internet Programming', path: '/internet-programming', category: 'AI & Technology' },
  { label: 'Science & Technology', path: '/science-technology', category: 'AI & Technology' },
  { label: 'Science & Tech Inventions', path: '/science-tech-inventions', category: 'AI & Technology' },
  { label: 'Science & Tech Gadgets', path: '/science-tech-gadgets', category: 'AI & Technology' },
  
  // Aviation & Transport
  { label: 'Airplanes Airships & Blimps', path: '/airplanes-airships', category: 'Aviation & Transport' },
  { label: 'Cargo Planes', path: '/cargo-planes', category: 'Aviation & Transport' },
  { label: 'Commercial & Jumbo Jets', path: '/commercial-jumbo-jets', category: 'Aviation & Transport' },
  { label: 'Land & Water Planes', path: '/land-water-planes', category: 'Aviation & Transport' },
  { label: 'Pilots & Captains', path: '/pilots-captains', category: 'Aviation & Transport' },
  { label: 'Single Engine Planes', path: '/single-engine-planes', category: 'Aviation & Transport' },
  { label: 'Aircraft Fleet', path: '/aircraft-fleet', category: 'Aviation & Transport' },
  { label: 'Airports', path: '/airports', category: 'Aviation & Transport' },
  { label: 'Airport Improvements', path: '/airport-improvements', category: 'Aviation & Transport' },
  { label: 'Airport Fails', path: '/airport-fails', category: 'Aviation & Transport' },
  { label: 'Helicopters Commercial', path: '/helicopters-commercial', category: 'Aviation & Transport' },
  { label: 'Helicopters Private', path: '/helicopters-private', category: 'Aviation & Transport' },
  { label: 'Drones', path: '/drones', category: 'Aviation & Transport' },
  
  // Animals & Nature
  { label: 'Amphibians', path: '/amphibians', category: 'Animals & Nature' },
  { label: 'Insects & Spiders', path: '/insects-spiders', category: 'Animals & Nature' },
  { label: 'Birds & Raptors', path: '/birds-raptors', category: 'Animals & Nature' },
  { label: 'Crabs & Lobsters', path: '/crabs-lobsters', category: 'Animals & Nature' },
  { label: 'Fish', path: '/fish', category: 'Animals & Nature' },
  { label: 'Mammals', path: '/mammals', category: 'Animals & Nature' },
  { label: 'Marine Mammals', path: '/marine-mammals', category: 'Animals & Nature' },
  { label: 'Jellyfish & Siphonophores', path: '/jellyfish-siphonophores', category: 'Animals & Nature' },
  { label: 'Reptiles & Snakes', path: '/reptiles-snakes', category: 'Animals & Nature' },
  { label: 'Rodents', path: '/rodents', category: 'Animals & Nature' },
  { label: 'Octopus & Cephalopods', path: '/octopus-cephalopods', category: 'Animals & Nature' },
  { label: 'Pets & Animals', path: '/pets-animals', category: 'Animals & Nature' },
  { label: 'Plants & Flowers', path: '/plants-flowers', category: 'Animals & Nature' },
  { label: 'Fungi', path: '/fungi', category: 'Animals & Nature' },
  { label: 'Lakes', path: '/lakes', category: 'Animals & Nature' },
  { label: 'Rivers', path: '/rivers', category: 'Animals & Nature' },
  { label: 'Oceans', path: '/oceans', category: 'Animals & Nature' },
  { label: 'Seas', path: '/seas', category: 'Animals & Nature' },
  
  // Crime & Justice
  { label: 'Courts Indictment', path: '/courts-indictment', category: 'Crime & Justice' },
  { label: 'Courts Sentencing', path: '/courts-sentencing', category: 'Crime & Justice' },
  { label: 'Courts & Police', path: '/courts-police', category: 'Crime & Justice' },
  { label: 'Supreme Courts', path: '/supreme-courts', category: 'Crime & Justice' },
  { label: 'Crime Fraud & Scammers', path: '/crime-fraud-scammers', category: 'Crime & Justice' },
  { label: 'Criminal Enterprises', path: '/criminal-enterprises', category: 'Crime & Justice' },
  { label: 'Criminal Gangs', path: '/criminal-gangs', category: 'Crime & Justice' },
  { label: 'Criminal Gangsters', path: '/criminal-gangsters', category: 'Crime & Justice' },
  { label: 'Police Chases', path: '/police-chases', category: 'Crime & Justice' },
  { label: 'Police & Sheriff', path: '/police-sheriff', category: 'Crime & Justice' },
  { label: 'Police Stops', path: '/police-stops', category: 'Crime & Justice' },
  { label: 'Jails & Prisons', path: '/jails-prisons', category: 'Crime & Justice' },
  { label: 'Attorney Information', path: '/attorney-information', category: 'Crime & Justice' },
  
  // Business & Finance
  { label: 'Stocks & Commodities', path: '/stocks-commodities', category: 'Business & Finance' },
  { label: 'Bitcoin & Cryptocurrency', path: '/bitcoin-cryptocurrency', category: 'Business & Finance' },
  { label: 'Business Development', path: '/business-development', category: 'Business & Finance' },
  { label: 'Business Leaders', path: '/business-leaders', category: 'Business & Finance' },
  { label: 'Money & Taxes', path: '/money-taxes', category: 'Business & Finance' },
  { label: 'Business Services', path: '/business-services', category: 'Business & Finance' },
  { label: 'Farmers & Farming', path: '/farmers-farming', category: 'Business & Finance' },
  { label: 'Real Estate', path: '/real-estate', category: 'Business & Finance' },
  { label: 'Real Estate Commercial', path: '/real-estate-commercial', category: 'Business & Finance' },
  { label: 'Luxury Real Estate', path: '/luxury-real-estate', category: 'Business & Finance' },
  { label: 'Food Products Business', path: '/food-products-business', category: 'Business & Finance' },
  
  // Entertainment
  { label: 'Entertainment', path: '/entertainment', category: 'Entertainment & Media' },
  { label: 'Oscars & Golden Globes', path: '/oscars-golden-globes', category: 'Entertainment & Media' },
  { label: 'Actors & Actresses', path: '/actors-actresses', category: 'Entertainment & Media' },
  { label: 'Late Night Shows', path: '/late-night-shows', category: 'Entertainment & Media' },
  { label: 'Entertainment Podcasts', path: '/entertainment-podcasts', category: 'Entertainment & Media' },
  { label: 'Hollywood & Celebrities', path: '/hollywood-celebrities', category: 'Entertainment & Media' },
  { label: 'Auditions & Contests', path: '/auditions-contests', category: 'Entertainment & Media' },
  { label: 'Celebrities', path: '/celebrities', category: 'Entertainment & Media' },
  { label: 'Talk Shows', path: '/talk-shows', category: 'Entertainment & Media' },
  { label: 'TV News Shows', path: '/tv-news-shows', category: 'Entertainment & Media' },
  { label: 'Radio Shows', path: '/radio-shows', category: 'Entertainment & Media' },
  
  // Comedy
  { label: 'Comedy', path: '/comedy', category: 'Comedy & Funny' },
  { label: 'Comedians Interviews', path: '/comedians-interviews', category: 'Comedy & Funny' },
  { label: 'Funny Pranks', path: '/funny-pranks', category: 'Comedy & Funny' },
  { label: 'Comedy Roasts', path: '/comedy-roasts', category: 'Comedy & Funny' },
  { label: 'SNL', path: '/snl', category: 'Comedy & Funny' },
  { label: 'Stand Up Comedy', path: '/stand-up-comedy', category: 'Comedy & Funny' },
  { label: 'Comedy Jokes & Pranks', path: '/comedy-jokes-pranks', category: 'Comedy & Funny' },
  { label: 'Comedy Sitcoms', path: '/comedy-sitcoms', category: 'Comedy & Funny' },
  { label: 'Bloopers', path: '/bloopers', category: 'Comedy & Funny' },
  { label: 'Funny Short Videos', path: '/funny-short-videos', category: 'Comedy & Funny' },
  { label: 'Funny Weird', path: '/funny-weird', category: 'Comedy & Funny' },
  
  // Music
  { label: 'Music', path: '/music', category: 'Music' },
  { label: 'Rock & Soul', path: '/rock-soul', category: 'Music' },
  { label: 'Blues', path: '/blues', category: 'Music' },
  { label: 'Classical & Opera', path: '/classical-opera', category: 'Music' },
  { label: 'Country & Western', path: '/country-western', category: 'Music' },
  { label: 'Folk Music', path: '/folk-music', category: 'Music' },
  { label: 'Funk & Hard Rock', path: '/funk-hard-rock', category: 'Music' },
  { label: 'Hip Hop & Rap', path: '/hip-hop-rap', category: 'Music' },
  { label: 'Heavy Metal', path: '/heavy-metal', category: 'Music' },
  { label: 'Pop & R&B', path: '/pop-rnb', category: 'Music' },
  { label: 'Reggaeton', path: '/reggaeton', category: 'Music' },
  { label: 'Salsa', path: '/salsa', category: 'Music' },
  { label: 'Christian Music', path: '/christian-music', category: 'Music' },
  { label: 'Music Artists', path: '/music-artists', category: 'Music' },
  { label: 'Music Lyrics', path: '/music-lyrics', category: 'Music' },
  
  // Gaming
  { label: 'Gaming', path: '/gaming', category: 'Gaming & Hobbies' },
  { label: 'Arcade Games', path: '/arcade-games', category: 'Gaming & Hobbies' },
  { label: 'Casino Slots', path: '/casino-slots', category: 'Gaming & Hobbies' },
  { label: 'Dominoes', path: '/dominos', category: 'Gaming & Hobbies' },
  { label: 'Lottery', path: '/lottery', category: 'Gaming & Hobbies' },
  { label: 'Xbox & PlayStation', path: '/xbox-playstation', category: 'Gaming & Hobbies' },
  { label: 'Card Games', path: '/card-games', category: 'Gaming & Hobbies' },
  { label: 'Magic Tricks', path: '/magic-tricks', category: 'Gaming & Hobbies' },
  { label: 'Game Challenges', path: '/game-challenges', category: 'Gaming & Hobbies' },

  // WSOP / Poker
  { label: 'WSOP', path: '/c/wsop', category: 'WSOP' },
  { label: 'Poker (Card Games)', path: '/c/wsop/poker-card-games', category: 'WSOP' },
  { label: 'Poker (Players)', path: '/c/wsop/poker-players', category: 'WSOP' },
  { label: 'Poker (News & Gossip)', path: '/c/wsop/poker-news-gossip', category: 'WSOP' },
  
  // Fitness & Health
  { label: 'Physical Fitness', path: '/physical-fitness', category: 'Fitness & Health' },
  { label: 'Calisthenics', path: '/calisthenics', category: 'Fitness & Health' },
  { label: 'Weight Lifting', path: '/weight-lifting', category: 'Fitness & Health' },
  { label: 'Yoga Workout', path: '/yoga-workout', category: 'Fitness & Health' },
  { label: 'Workout Female', path: '/workout-female', category: 'Fitness & Health' },
  { label: 'Workout Male', path: '/workout-male', category: 'Fitness & Health' },
  { label: 'Martial Arts', path: '/martial-arts', category: 'Fitness & Health' },
  { label: 'Swimming & Diving', path: '/swimming-diving', category: 'Fitness & Health' },
  
  // Sports
  { label: 'Sports', path: '/sports', category: 'Sports' },
  { label: 'NBA Basketball', path: '/nba-basketball', category: 'Sports' },
  { label: 'NBA East Play in Tournament', path: '/c/nba-basketball/nba-east-play-in-tournament', category: 'Sports' },
  { label: 'NBA West Play in Tournament', path: '/c/nba-basketball/nba-west-play-in-tournament', category: 'Sports' },
  { label: 'NFL Football', path: '/nfl-football', category: 'Sports' },
  { label: 'MLB Baseball', path: '/mlb-baseball', category: 'Sports' },
  { label: 'NHL Hockey', path: '/nhl-hockey', category: 'Sports' },
  { label: 'Soccer & MLS', path: '/soccer-mls', category: 'Sports' },
  { label: 'Boxing', path: '/boxing', category: 'Sports' },
  { label: 'MMA & UFC', path: '/mma-ufc', category: 'Sports' },
  { label: 'Tennis', path: '/tennis', category: 'Sports' },
  { label: 'Golf', path: '/golf', category: 'Sports' },
  { label: 'Olympics', path: '/olympics', category: 'Sports' },
  { label: 'NASCAR Racing', path: '/nascar-racing', category: 'Sports' },
  { label: 'Formula One', path: '/formula-one', category: 'Sports' },
  
  // Travel
  { label: 'Travel', path: '/travel-events', category: 'Travel & Places' },
  { label: 'Beaches', path: '/beaches', category: 'Travel & Places' },
  { label: 'Cities & Towns', path: '/cities-towns', category: 'Travel & Places' },
  { label: 'Hotels', path: '/hotels', category: 'Travel & Places' },
  { label: 'Restaurants', path: '/restaurants', category: 'Travel & Places' },
  { label: 'Night Clubs', path: '/night-clubs', category: 'Travel & Places' },
  { label: 'Street Food', path: '/street-food', category: 'Travel & Places' },
  
  // Film & Animation
  { label: 'Film & Animation', path: '/film-animation', category: 'Film & Animation' },
  { label: 'Action Movies', path: '/action-movies', category: 'Film & Animation' },
  { label: 'Comedy Movies', path: '/comedy-movies', category: 'Film & Animation' },
  { label: 'Drama Movies', path: '/drama-movies', category: 'Film & Animation' },
  { label: 'Documentary Films', path: '/documentary-films', category: 'Film & Animation' },
  { label: 'Animation', path: '/animation', category: 'Film & Animation' },
  { label: 'Cartoons', path: '/cartoons', category: 'Film & Animation' },
  
  // Education
  { label: 'Education', path: '/educational', category: 'Education' },
  { label: 'Kids Education', path: '/kids-education', category: 'Education' },
  { label: 'History', path: '/history', category: 'Education' },
  { label: 'Science', path: '/science', category: 'Education' },
  
  // Vehicles
  { label: 'Autos & Vehicles', path: '/autos-vehicles', category: 'Autos & Vehicles' },
  { label: 'Cars', path: '/cars', category: 'Autos & Vehicles' },
  { label: 'Motorcycles', path: '/motorcycles', category: 'Autos & Vehicles' },
  { label: 'Trucks', path: '/trucks', category: 'Autos & Vehicles' },
  { label: 'Boats', path: '/boats', category: 'Autos & Vehicles' },
  
  // News & Politics
  { label: 'News & Politics', path: '/news-and-politics', category: 'News & Politics' },
  { label: 'Politics', path: '/politics', category: 'News & Politics' },
  { label: 'Weather', path: '/weather', category: 'News & Politics' },
  { label: 'Disasters', path: '/disasters', category: 'News & Politics' },
  
  // Military
  { label: 'Military', path: '/military', category: 'Military' },
  { label: 'Army', path: '/military/army', category: 'Military' },
  { label: 'Navy', path: '/military/navy', category: 'Military' },
  { label: 'Air Force', path: '/military/airforce', category: 'Military' },
  { label: 'Marines', path: '/military/marines', category: 'Military' },
  { label: 'Coast Guard', path: '/military/coast-guard', category: 'Military' },
];

export const SidebarSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const highlightTimerRef = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { tree } = useCustomCategories();

  // Dynamically include every admin-created category, subcategory, and watch page
  // so newly added entries appear in search automatically — no hardcoding needed.
  const dynamicItems = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [];
    const seen = new Set(allItems.map((i) => i.path.toLowerCase()));
    const push = (item: SearchItem) => {
      const key = item.path.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      items.push(item);
    };
    tree.forEach((cat) => {
      const catRoute = getSidebarMainCategoryRoute(cat.slug) || `/c/${cat.slug}`;
      push({ label: cat.name, path: catRoute, category: cat.name });
      cat.subcategories.forEach((sub) => {
        push({
          label: sub.name,
          path: `/c/${cat.slug}/${sub.slug}`,
          category: cat.name,
        });
        sub.watch_pages.forEach((w) => {
          push({
            label: w.name,
            path: `/c/${cat.slug}/${sub.slug}/${w.slug}`,
            category: `${cat.name} • ${sub.name}`,
          });
        });
      });
    });
    return items;
  }, [tree]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const combined = [...allItems, ...dynamicItems];
    const matches = combined.filter(item =>
      item.label.toLowerCase().includes(query) ||
      (item.category && item.category.toLowerCase().includes(query))
    );

    // Rank: starts-with first, then label match, then category match, alphabetical
    return matches.sort((a, b) => {
      const al = a.label.toLowerCase();
      const bl = b.label.toLowerCase();
      const aStarts = al.startsWith(query) ? 0 : 1;
      const bStarts = bl.startsWith(query) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;
      const aLabel = al.includes(query) ? 0 : 1;
      const bLabel = bl.includes(query) ? 0 : 1;
      if (aLabel !== bLabel) return aLabel - bLabel;
      return al.localeCompare(bl);
    });
  }, [searchQuery, dynamicItems]);

  // Reset active selection when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery]);

  // Keep highlighted item in view inside the dropdown
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLAnchorElement>(
      `[data-result-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, filteredItems]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filteredItems.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filteredItems[activeIndex];
      if (item) {
        window.location.href = item.path;
        setSearchQuery('');
        setIsFocused(false);
      }
    } else if (e.key === 'Escape') {
      setSearchQuery('');
      setIsFocused(false);
    }
  };

  // Scroll the sidebar to the first matching link as the user types.
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const nav = document.querySelector('nav');
    if (!nav) return;

    // Expand any collapsed Radix Collapsible group triggers (top-level group sections).
    // Use dispatchEvent so we don't pull keyboard focus away from the input.
    // IMPORTANT: filter by aria-expanded="false" so we only hit Collapsible triggers
    // and NOT other data-state="closed" elements like Tooltip triggers (which would
    // collapse the whole sidebar when its collapse button is wrapped in a Tooltip).
    const fireClick = (el: Element) => {
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    };
    const closedTriggers = nav.querySelectorAll<HTMLButtonElement>(
      'button[data-state="closed"][aria-expanded="false"]'
    );
    closedTriggers.forEach(fireClick);

    // Expand any closed CollapsibleNavLink items (e.g. "How-to & Style" inside the group)
    const closedNavTriggers = nav.querySelectorAll<HTMLDivElement>(
      '[data-sidebar-collapsible-trigger][data-sidebar-collapsible-state="closed"]'
    );
    closedNavTriggers.forEach(fireClick);

    // Restore focus to the input in case any element grabbed it.
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }

    // Wait for expansion animations, then scroll to first matching link.
    const t = window.setTimeout(() => {
      const links = nav.querySelectorAll<HTMLAnchorElement>('a');
      let target: HTMLAnchorElement | null = null;
      for (const a of Array.from(links)) {
        const text = (a.textContent || '').toLowerCase();
        if (text.includes(q)) { target = a; break; }
      }
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('ring-2', 'ring-primary', 'rounded');
        if (highlightTimerRef.current) window.clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = window.setTimeout(() => {
          target?.classList.remove('ring-2', 'ring-primary', 'rounded');
        }, 1800);
      }
    }, 320);

    return () => window.clearTimeout(t);
  }, [searchQuery]);

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative mb-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          className="pl-8 pr-8 h-9 text-sm bg-muted/50"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isFocused && filteredItems.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 overflow-hidden">
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-wide text-muted-foreground border-b bg-muted/30 flex items-center justify-between">
            <span>{filteredItems.length} match{filteredItems.length === 1 ? '' : 'es'}</span>
            <span className="hidden sm:inline">↑↓ navigate · Enter to open</span>
          </div>
          <ScrollArea className="max-h-80">
            <div className="p-1" ref={listRef}>
              {filteredItems.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <Link
                    key={`${item.path}-${index}`}
                    to={item.path}
                    data-result-index={index}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex flex-col px-3 py-2 text-sm rounded transition-colors ${
                      isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/60'
                    }`}
                    onMouseDown={(e) => {
                      // Navigate on mousedown so the input's blur (which closes the
                      // dropdown) can never race with the click event.
                      e.preventDefault();
                      setSearchQuery('');
                      setIsFocused(false);
                      navigate(item.path);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      setSearchQuery('');
                      setIsFocused(false);
                    }}
                  >
                    <span className="font-medium">{item.label}</span>
                    {item.category && (
                      <span className="text-xs text-muted-foreground">{item.category}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
      
      {isFocused && searchQuery && filteredItems.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 p-3 text-sm text-muted-foreground text-center">
          No results found
        </div>
      )}
    </div>
  );
};
