
import { Route } from "react-router-dom";
import GenericSubcategoryPage from "@/pages/categories/GenericSubcategoryPage";

// Generate routes for all categories from the mapping
const categoryKeys = [
  // Comedy Categories
  'comedy-snl', 'comedians-interviews', 'comedy-funny-pranks', 'comedy-roasts',
  'comedy-standup', 'comedy-jokes-pranks', 'comedy-sitcom', 'bloopers',
  
  // Actors & Celebrities
  'actors-actress-bios', 'actors-information', 'celebrities',
  
  // AI Categories
  'ai-agents', 'ai-chatgpt', 'artificial-intelligence', 'ai-hr', 'ai-humanoids', 'ai-robots',
  
  // Airplanes Categories
  'airplanes-blimps', 'airplanes-cargo', 'airplanes-commercial', 'airplanes-land-water',
  'airplanes-pilots', 'airplanes-single-engine', 'airplanes-fleet',
  
  // Airports
  'airports', 'airports-improvements', 'airports-fails',
  
  // History
  'american-history', 'biblical-history', 'bible-quotes',
  
  // Animals
  'amphibians', 'animal-insects', 'animals-birds', 'animals-crabs', 'animals-fish',
  'animals-mammals', 'animals-orcas', 'animals-jellyfish', 'animals-reptiles',
  'animals-rodents', 'animals-octopus',
  
  // Animation & Film
  'animation-film-military', 'animation-film-movies',
  
  // Various Categories
  'arguments', 'artifacts', 'attorney', 'attraction-dating', 'auditions-contests',
  'autos-vehicles', 'avalanche', 'babies-infants', 'blizzard', 'boats', 'boxing-street',
  
  // Business Categories
  'business-bitcoin', 'business-developments', 'business-leaders', 'business-money',
  'business-services', 'business-farmers', 'create-business-internet',
  
  // Calisthenics & Cars
  'calisthenics', 'car-major-repairs', 'car-minor-repairs', 'car-racing-crashes',
  'car-repairs-hacks', 'car-repo', 'cars-drifting', 'cars-expensive', 'cars-future',
  'cars-sedans', 'cars-strange', 'cars-supercars', 'cars-accidents', 'cars-trucks-motorcycles',
  'crashes', 'cell-phone-tricks', 'colosseum', 'container-ships',
  
  // Cosmetics
  'cosmetics-eyelashes', 'cosmetics-foundation', 'cosmetics-lipstick',
  
  // Courts & Crime
  'court-trials', 'courts-indictment', 'courts-sentencing', 'courts-police-crime',
  'courts-supreme', 'crime-fraud', 'crime-works', 'criminal-enterprises',
  'criminal-gangs', 'criminal-gangsters', 'crazy-amazing',
  
  // Dances & Dating
  'dances-styles', 'dances-choreography', 'dating', 'dating-breakups', 'dating-flirting',
  'dating-relationship', 'dating-single', 'divorce',
  
  // Disasters & Documentaries
  'disasters-avalanches', 'disasters-earthquakes', 'disasters-fires', 'disasters-hurricanes',
  'disasters-volcano', 'document-word', 'documentaries-drugs', 'documentary',
  'drinks', 'drones-civilian', 'drugs-money',
  
  // Education
  'education', 'education-anatomy', 'education-countries', 'education-immigration',
  'education-kids-geography', 'education-laws',
  
  // News & Politics
  'news-politics', 'news-shows', 'news-politics-podcasts', 'politics', 
  'senate-house', 'tv-news-shows', 'tv-news-court', 'talk-shows',
  
  // Music Categories
  'music-lyrics', 'music-mandarin', 'music-mandarin-lyrics', 'music-christmas',
  'music-christmas-lyrics', 'music-blues', 'music-classical', 'music-country',
  'music-folk', 'music-funk-rock', 'music-alternative', 'music-rock-soul-pop',
  'music-funk-hiphop-rap', 'music-history', 'music-heavy-metal', 'music-mexican-spanish',
  'music-soundtracks', 'music-parody', 'music-pop', 'music-rap-reggaeton',
  'music-relaxation', 'music-salsa', 'music-soul-train', 'music-garage',
  'music-artists-interviews', 'music-artists-news', 'music-challenges',
  'music-christian', 'musical-instruments',
  
  // People Categories
  'people', 'people-bigotry', 'people-fighting', 'people-karma', 'people-look-alikes',
  'people-thefts', 'people-blogs', 'people-amazing', 'people-amazing-things',
  'people-fails', 'people-workers',
  
  // Pictures & Photos
  'pictures-photos',
  
  // Plants
  'plants',
  
  // Police Categories
  'police-chases', 'police-sheriff', 'police-stops',
  
  // Pranks
  'pranks',
  
  // Presidents
  'president-motorcade', 'presidents', 'presidents-former',
  
  // Property
  'property',
  
  // Protesters
  'protesters',
  
  // Quotes & Poems
  'quotes-poems',
  
  // Radio
  'radio-remote', 'radio-show',
  
  // Real Estate
  'real-estate', 'real-estate-commercial', 'real-estate-luxury',
  
  // Relationships
  'relationships',
  
  // Reproductive Systems
  'reproductive-systems',
  
  // Restaurants
  'restaurants',
  
  // Riddles
  'riddles',
  
  // Rivers
  'rivers',
  
  // Ships & Sailing
  'sailing-ships', 'ships-cruise', 'ship-icebreakers', 'shipping-ports',
  'submarines', 'tugboats',
  
  // Science & Technology
  'science', 'science-tech-invent', 'science-tech-gadgets', 'science-technology',
  
  // Seas & Oceans
  'seas', 'waters-oceans',
  
  // Snow & Weather
  'snow-storms', 'storms', 'storms-hail', 'tornado', 'tsunami', 'volcanos',
  
  // Space
  'space', 'universe',
  
  // Speeches
  'speech-commencement', 'speech-eulogy', 'speech-informative',
  'speech-motivational', 'speech-persuasive', 'speeches',
  
  // Sports - All categories
  'sports', 'sports-arenas', 'sports-basketball-football', 'sports-car-racing',
  'sports-comedy', 'sports-fishing', 'sports-interviews', 'sports-kickboxing',
  'sports-mlb-players', 'sports-nba-players', 'sports-nfl-players', 'sports-nhl-players',
  'sports-pga-golf', 'sports-race-car', 'sports-cycling', 'sports-rugby-cricket',
  'sports-soccer', 'sports-water', 'sports-tennis-men-finals', 'sports-tennis-men',
  'sports-tennis-women-finals', 'sports-tennis-women', 'sports-track-field-highlights',
  'sports-track-field', 'sports-volleyball', 'sports-weightlifting', 'sports-wwe',
  'sports-boxing', 'sports-boxing-interviews', 'sports-college-swimming',
  'sports-college-baseball', 'sports-college-basketball', 'sports-college-football',
  'sports-college-football-bowl', 'sports-college-track', 'sports-college-women-basketball',
  'sports-fans-challenges', 'sports-football-high-school', 'sports-formula-one',
  'sports-game-challenges', 'sports-golf-ryder-cup', 'sports-hockey-countries',
  'sports-horse-racing', 'sports-horses', 'sports-mlb-playoffs-al', 'sports-mlb-playoffs-nl',
  'sports-mlb-baseball', 'sports-mlb-world-series', 'sports-mlb-world-series-present',
  'sports-mls-fifa', 'sports-mma-ufc', 'sports-motorcycles', 'sports-nascar',
  'sports-nba-east-playoffs', 'sports-nba-west-playoffs', 'sports-nba-basketball',
  'sports-news-podcasts', 'sports-nfl-football', 'sports-nfl-superbowl',
  'sports-nhl-allstar-east', 'sports-nhl-allstar', 'sports-nhl-allstar-west',
  'sports-nhl-playoffs', 'sports-nhl-hockey', 'sports-nhra', 'sports-olympics-track',
  'sports-personalities', 'sports-professional-golf', 'sports-track-field-main',
  'sports-volleyball-amateur', 'sports-volleyball-beach', 'sports-volleyball-professional',
  'sports-volleyball-tournament', 'sports-wnba-players', 'sports-wnba-champions',
  'sports-wnba-coaches', 'sports-wnba-playoffs', 'sports-wnba-basketball',
  'sports-women-mma', 'sports-wwe-wrestling', 'sports-women-basketball-ncaa',
  
  // Statues & Art
  'statues',
  
  // Stocks & Finance
  'stocks-money',
  
  // Stone Carvers
  'stone-carvers',
  
  // Success
  'success',
  
  // Swimming
  'swim-diving',
  
  // Trains
  'train-riders', 'trains-commercial', 'trains-passenger', 'trains-travel',
  
  // Travel
  'travel', 'travel-beaches', 'travel-cities', 'travel-country-foods',
  'travel-hotels-expensive', 'travel-hotels', 'travel-hotels-unique',
  'travel-nightclubs', 'travel-restaurants', 'travel-street-food',
  'travel-streets', 'travel-new-year', 'travel-events', 'travel-events-countries',
  'travel-tips',
  
  // Trucks
  'trucks-pickups', 'trucks-semi', 'trucks-heavy',
  
  // UFOs
  'ufos',
  
  // Wealth
  'wealth',
  
  // Weapons
  'weapons',
  
  // Weather & Disasters
  'weather-disasters',
  
  // Weightlifting
  'weightlifting-prank', 'weightlifting-female', 'weightlifting-male',
  
  // Workers
  'workers',
  
  // Workout
  'workout', 'workout-female', 'workout-fitness', 'workout-male',
  
  // World History
  'world-history',
  
  // Yachts
  'yachts',
  
  // Yoga
  'yoga',
  
  // Nonprofits
  'nonprofits',
  
  // Pets & Animals
  'pets-animals',
];

export const allCategoryRoutes = categoryKeys.map(key => (
  <Route key={key} path={`/${key}`} element={<GenericSubcategoryPage />} />
));
