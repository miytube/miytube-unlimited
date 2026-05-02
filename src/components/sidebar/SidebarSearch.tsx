import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return allItems.filter(item => 
      item.label.toLowerCase().includes(query) ||
      (item.category && item.category.toLowerCase().includes(query))
    ).slice(0, 10);
  }, [searchQuery]);

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative mb-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
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
          <ScrollArea className="max-h-64">
            <div className="p-1">
              {filteredItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex flex-col px-3 py-2 text-sm rounded hover:bg-accent transition-colors"
                  onClick={() => {
                    setSearchQuery('');
                    setIsFocused(false);
                  }}
                >
                  <span className="font-medium">{item.label}</span>
                  {item.category && (
                    <span className="text-xs text-muted-foreground">{item.category}</span>
                  )}
                </Link>
              ))}
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
