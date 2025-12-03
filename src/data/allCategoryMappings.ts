
import { 
  Music, Mic, Radio, Headphones, Guitar, Piano, Drum, Volume2,
  Newspaper, Tv, MessageSquare, Users, Heart, Camera, Dog, Cat,
  Building, Home, Utensils, Plane, Car, Ship, Train, Truck,
  Trophy, Dumbbell, Bike, Mountain, Waves, Sun, Cloud, Snowflake,
  Flame, Wind, Droplet, TreePine, Leaf, Flower2, Apple, Coffee,
  Wine, Beer, UtensilsCrossed, ChefHat, Pizza, Sandwich, IceCream,
  Gavel, Shield, Siren, Scale, FileText, BookOpen, GraduationCap,
  Microscope, Atom, Globe, Map, Compass, Anchor, Sailboat, 
  Rocket, Satellite, Star, Moon, Sparkles, Zap, Lightbulb, 
  Cog, Wrench, Hammer, PaintBucket, Palette, Brush, Pencil,
  Video, Film, Clapperboard, Play, Youtube, Monitor, Smartphone,
  Gamepad2, Dice1, Crown, Medal, Award, Target, Crosshair,
  HeartHandshake, UserRound, Baby, PersonStanding, Laugh, Frown,
  Quote, MessageCircle, Send, Mail, Bell, Clock, Calendar,
  DollarSign, TrendingUp, Briefcase, PiggyBank, CreditCard,
  ShoppingCart, Package, Gift, Tag, Percent, Store,
  Hospital, Stethoscope, Pill, Syringe, Activity, HeartPulse,
  Brain, Eye, Ear, Hand, Footprints, Bone,
  Church, Cross, Moon as MoonIcon, Building2, Castle, Landmark,
  Flag, Vote, Megaphone, AlertTriangle, AlertCircle, Info,
  HelpCircle, Search, Filter, Settings, Menu, MoreHorizontal,
  ChevronRight, ArrowRight, ExternalLink, Link, Share2, Download,
  Upload, Cloud as CloudIcon, Database, Server, Code, Terminal,
  LucideIcon, Volleyball, Weight, Bike as BikeIcon, Waves as WavesIcon,
  CircleDot, Tent, Timer, Ticket, Tv2, Radio as RadioIcon
} from 'lucide-react';

export interface CategoryInfo {
  title: string;
  description: string;
  icon: LucideIcon;
  parent?: {
    route: string;
    name: string;
  };
}

export const allCategoryMappings: Record<string, CategoryInfo> = {
  // Gaming Categories
  'gaming': { title: 'Gaming', description: 'Video games, esports and gaming content', icon: Gamepad2 },
  'game-challenges': { title: 'Game Challenges', description: 'Gaming challenges and competitions', icon: Target, parent: { route: '/gaming', name: 'Gaming' } },
  'game-toys': { title: 'Game Toys (Rockets, Missiles)', description: 'Gaming toys and RC toys', icon: Rocket, parent: { route: '/gaming', name: 'Gaming' } },
  'arcade-games': { title: 'Gaming (Arcade, Games)', description: 'Arcade and retro gaming', icon: Gamepad2, parent: { route: '/gaming', name: 'Gaming' } },
  'casino-slots': { title: 'Gaming (Casino Slots)', description: 'Casino slot machine games', icon: Dice1, parent: { route: '/gaming', name: 'Gaming' } },
  'dominos': { title: 'Gaming (Dominos, Dominos Falls)', description: 'Domino games and setups', icon: Dice1, parent: { route: '/gaming', name: 'Gaming' } },
  'lottery': { title: 'Gaming (Lottery, Prize, Raffle)', description: 'Lottery and prize games', icon: Ticket, parent: { route: '/gaming', name: 'Gaming' } },
  'xbox-playstation': { title: 'Gaming (Xbox, PlayStation 5)', description: 'Console gaming on Xbox and PlayStation', icon: Gamepad2, parent: { route: '/gaming', name: 'Gaming' } },
  'gaming-cards': { title: 'Gaming Cards', description: 'Card games and trading cards', icon: CreditCard, parent: { route: '/gaming', name: 'Gaming' } },
  'magic-tricks': { title: 'Gaming Magic Tricks', description: 'Magic tricks and illusions', icon: Sparkles, parent: { route: '/gaming', name: 'Gaming' } },
  'fps': { title: 'FPS Games', description: 'First person shooter games', icon: Target, parent: { route: '/gaming', name: 'Gaming' } },
  'moba': { title: 'MOBA Games', description: 'Multiplayer online battle arena games', icon: Zap, parent: { route: '/gaming', name: 'Gaming' } },
  'esports': { title: 'Esports', description: 'Competitive gaming and tournaments', icon: Trophy, parent: { route: '/gaming', name: 'Gaming' } },
  
  // Comedy Categories
  'comedy': { title: 'Comedy', description: 'Laugh with our comedy content', icon: Laugh },
  'comedy-snl': { title: 'Saturday Night Live', description: 'SNL sketches, performers and history', icon: Laugh, parent: { route: '/comedy', name: 'Comedy' } },
  'comedians-interviews': { title: 'Comedians (Interviews, Work)', description: 'Comedian interviews and behind the scenes', icon: Mic, parent: { route: '/comedy', name: 'Comedy' } },
  'comedy-funny-pranks': { title: 'Comedy (Funny, Pranks) Videos', description: 'Funny videos and pranks', icon: Laugh, parent: { route: '/comedy', name: 'Comedy' } },
  'comedy-roasts': { title: 'Comedy (Roasts, Jokes, Events)', description: 'Comedy roasts and events', icon: Laugh, parent: { route: '/comedy', name: 'Comedy' } },
  'comedy-standup': { title: 'Comedy (Stand Up, Jokes)', description: 'Stand-up comedy performances', icon: Mic, parent: { route: '/comedy', name: 'Comedy' } },
  'comedy-jokes-pranks': { title: 'Comedy & Jokes, Pranks', description: 'Jokes and prank content', icon: Laugh, parent: { route: '/comedy', name: 'Comedy' } },
  'comedy-sitcom': { title: 'Comedy Show (Sitcom)', description: 'Sitcom clips and episodes', icon: Tv, parent: { route: '/comedy', name: 'Comedy' } },
  'bloopers': { title: 'Bloopers (Screwup, Blunder)', description: 'Funny bloopers and mistakes', icon: Laugh, parent: { route: '/comedy', name: 'Comedy' } },
  
  // Actors & Celebrities
  'actors-actress-bios': { title: 'Actors & Actress (Bios)', description: 'Actor and actress biographies', icon: Film },
  'actors-information': { title: 'Actors, Actresses Information', description: 'Information about actors and actresses', icon: Users },
  'celebrities': { title: 'Celebrities (Actors, Actresses)', description: 'Celebrity news and content', icon: Star },
  
  // AI Categories
  'ai-agents': { title: 'AI (AI Agents, Software Systems)', description: 'AI agents and systems', icon: Code },
  'ai-chatgpt': { title: 'AI (ChatGPT, Gemini, Microsoft)', description: 'AI assistants and chatbots', icon: Terminal },
  'artificial-intelligence': { title: 'Artificial Intelligence (Bots)', description: 'AI and robotics content', icon: Cog },
  'ai-hr': { title: 'Artificial Intelligence H/R', description: 'AI in human resources', icon: Users },
  'ai-humanoids': { title: 'Artificial Intelligence Humanoids', description: 'AI humanoid robots', icon: PersonStanding },
  'ai-robots': { title: 'Artificial Intelligence Robots', description: 'Robotics and AI', icon: Cog },
  
  // Airplanes Categories
  'airplanes-blimps': { title: 'Airplanes (Airships, Blimps)', description: 'Airships and blimps', icon: Plane },
  'airplanes-cargo': { title: 'Airplanes (Cargo Planes)', description: 'Cargo aircraft', icon: Plane },
  'airplanes-commercial': { title: 'Airplanes (Commercial, Jumbo)', description: 'Commercial airliners', icon: Plane },
  'airplanes-land-water': { title: 'Airplanes (Land, Water)', description: 'Amphibious aircraft', icon: Plane },
  'airplanes-pilots': { title: 'Airplanes (Pilots, Captain)', description: 'Pilots and aviation crew', icon: Plane },
  'airplanes-single-engine': { title: 'Airplanes (Single Engine)', description: 'Single engine aircraft', icon: Plane },
  'airplanes-fleet': { title: 'Airplanes Fleet (Aircrafts)', description: 'Aircraft fleets', icon: Plane },
  
  // Airports
  'airports': { title: 'Airports', description: 'Airport content and tours', icon: Plane },
  'airports-improvements': { title: 'Airports (Improvements, Construction)', description: 'Airport development', icon: Building },
  'airports-fails': { title: 'Airports Fails', description: 'Airport fails and incidents', icon: AlertTriangle },
  
  // History
  'american-history': { title: 'American History', description: 'American historical content', icon: Flag },
  'biblical-history': { title: 'Biblical History', description: 'Biblical and religious history', icon: BookOpen },
  'bible-quotes': { title: 'Bible (Quotes, Scriptures)', description: 'Bible quotes and scriptures', icon: Cross },
  
  // Animals
  'amphibians': { title: 'Amphibian (Frog, Salamander)', description: 'Amphibian content', icon: Dog },
  'animal-insects': { title: 'Animal (Insects, Spiders)', description: 'Insects and spiders', icon: Dog },
  'animals-birds': { title: 'Animals (Birds, Raptors, Fowl)', description: 'Birds and fowl', icon: Dog },
  'animals-crabs': { title: 'Animals (Crabs, Lobsters, Crustaceans)', description: 'Crustaceans', icon: Dog },
  'animals-fish': { title: 'Animals (Fishes, Fish)', description: 'Fish and aquatic life', icon: Dog },
  'animals-mammals': { title: 'Animals (Mammals, Birds, Reptiles)', description: 'Various animals', icon: Dog },
  'animals-orcas': { title: 'Animals (Mammals, Orcas, Dolphins)', description: 'Marine mammals', icon: Dog },
  'animals-jellyfish': { title: 'Animals (Man of War, Siphonophore)', description: 'Jellyfish and related', icon: Dog },
  'animals-reptiles': { title: 'Animals (Reptiles, Snakes)', description: 'Reptiles and snakes', icon: Dog },
  'animals-rodents': { title: 'Animals (Rodents, Rats, Beavers)', description: 'Rodents', icon: Dog },
  'animals-octopus': { title: 'Animals Octopus (Squid, Cephalopod)', description: 'Cephalopods', icon: Dog },
  
  // Animation & Film
  'animation-film-military': { title: 'Animation & Film, Military', description: 'Military animation and films', icon: Film },
  'animation-film-movies': { title: 'Animation, Film, Movies (Clips)', description: 'Movie clips and animation', icon: Clapperboard },
  
  // Arguments
  'arguments': { title: 'Arguments (Arguments, Disrespect)', description: 'Arguments and confrontations', icon: MessageSquare },
  
  // Artifacts
  'artifacts': { title: 'Artifact (Antique, Antiquities)', description: 'Antiques and artifacts', icon: Crown },
  
  // Attorney
  'attorney': { title: 'Attorney (Information, Statistics)', description: 'Legal information', icon: Scale },
  
  // Dating & Attraction
  'attraction-dating': { title: 'Attraction (Dating)', description: 'Dating and attraction content', icon: Heart },
  'dating': { title: 'Dating (Dating)', description: 'Dating content', icon: Heart },
  'dating-breakups': { title: 'Dating (Breakups)', description: 'Breakup content', icon: Heart },
  'dating-flirting': { title: 'Dating (Flirting, Crush)', description: 'Flirting tips', icon: Heart },
  'dating-relationship': { title: 'Dating (Relationship)', description: 'Relationship advice', icon: Heart },
  'dating-single': { title: 'Dating, Single', description: 'Single life content', icon: Heart },
  'divorce': { title: 'Divorce', description: 'Divorce content', icon: Heart },
  
  // Auditions
  'auditions-contests': { title: 'Auditions, Contests (Entertainment)', description: 'Talent shows and contests', icon: Star },
  
  // Autos & Vehicles
  'autos-vehicles': { title: 'Autos & Vehicles', description: 'Cars and vehicles', icon: Car },
  'avalanche': { title: 'Avalanche', description: 'Avalanche footage', icon: Mountain },
  
  // Babies
  'babies-infants': { title: 'Babies/Infants (Funny/Comedy)', description: 'Funny baby content', icon: Baby },
  
  // Blizzard
  'blizzard': { title: 'Blizzard (Blowing Snow, Visibility)', description: 'Blizzard footage', icon: Snowflake },
  
  // Boats
  'boats': { title: 'Boats', description: 'Boat content', icon: Sailboat },
  
  // Boxing
  'boxing-street': { title: 'Boxing (Street Fighting, Brawl)', description: 'Street fighting content', icon: Trophy },
  
  // Business Categories
  'business-bitcoin': { title: 'Business (Bitcoins, Cryptocurrency)', description: 'Crypto and bitcoin', icon: DollarSign },
  'business-developments': { title: 'Business (Developments, Economy)', description: 'Business and economy', icon: TrendingUp },
  'business-leaders': { title: 'Business (Leaders, Advise)', description: 'Business leadership', icon: Briefcase },
  'business-money': { title: 'Business (Money, Taxes, Interest)', description: 'Finance and taxes', icon: DollarSign },
  'business-services': { title: 'Business (Services, Drones)', description: 'Business services', icon: Cog },
  'business-farmers': { title: 'Business Farmers (Farming)', description: 'Farming and agriculture', icon: Leaf },
  'create-business-internet': { title: 'Create Business Internet', description: 'Online business creation', icon: Globe },
  
  // Calisthenics
  'calisthenics': { title: 'Calisthenics - Workout', description: 'Calisthenics training', icon: Dumbbell },
  
  // Car Categories
  'car-major-repairs': { title: 'Car (Major Repairs)', description: 'Major car repairs', icon: Wrench },
  'car-minor-repairs': { title: 'Car (Minor Repairs)', description: 'Minor car repairs', icon: Wrench },
  'car-racing-crashes': { title: 'Car Racing (Crashes, Accidents)', description: 'Racing crashes', icon: Car },
  'car-repairs-hacks': { title: 'Car Repairs, Car Hacks', description: 'Car repair tips', icon: Wrench },
  'car-repo': { title: 'Car Repo (Repossession)', description: 'Car repossession content', icon: Car },
  'cars-drifting': { title: 'Cars (Drifting, Drivers)', description: 'Drifting videos', icon: Car },
  'cars-expensive': { title: 'Cars (Expensive, Rarest)', description: 'Luxury and rare cars', icon: Crown },
  'cars-future': { title: 'Cars (Future Vehicles)', description: 'Future car concepts', icon: Car },
  'cars-sedans': { title: 'Cars (Sedans, Coupe)', description: 'Sedans and coupes', icon: Car },
  'cars-strange': { title: 'Cars (Strange, Weird)', description: 'Unusual cars', icon: Car },
  'cars-supercars': { title: 'Cars (Supercars, Hypercars)', description: 'Supercars and hypercars', icon: Car },
  'cars-accidents': { title: 'Cars Accidents (Idiot, Bad Drivers)', description: 'Car accident footage', icon: AlertTriangle },
  'cars-trucks-motorcycles': { title: 'Cars, Trucks, Motorcycles', description: 'All vehicles', icon: Car },
  'crashes': { title: 'Crashes (Cars, Trucks, Motorcycles)', description: 'Vehicle crashes', icon: AlertTriangle },
  
  // Cell Phone
  'cell-phone-tricks': { title: 'Cell Phone (Tricks, Hacks)', description: 'Phone tips and tricks', icon: Smartphone },
  
  // Colosseum
  'colosseum': { title: 'Colosseum (Rome, Arena, Stadium)', description: 'Colosseum content', icon: Landmark },
  
  // Container Ships
  'container-ships': { title: 'Container Ships, Oil Tankers', description: 'Large vessels', icon: Ship },
  
  // Cosmetics
  'cosmetics-eyelashes': { title: 'Cosmetics (Eyelashes, Eyeshadow)', description: 'Eye makeup', icon: Eye },
  'cosmetics-foundation': { title: 'Cosmetics (Foundation, Powder)', description: 'Foundation makeup', icon: Palette },
  'cosmetics-lipstick': { title: 'Cosmetics (Lipstick, Makeup)', description: 'Lip makeup', icon: Palette },
  
  // Courts Categories
  'court-trials': { title: 'Court Trials, Court Procedures', description: 'Court trials', icon: Gavel },
  'courts-indictment': { title: 'Courts (Indictment, Charges)', description: 'Legal charges', icon: Gavel },
  'courts-sentencing': { title: 'Courts (Sentencing, Judgement)', description: 'Court sentencing', icon: Scale },
  'courts-police-crime': { title: 'Courts & Police, Crime', description: 'Crime and courts', icon: Shield },
  'courts-supreme': { title: 'Courts, Supreme Courts, District', description: 'Supreme court content', icon: Landmark },
  
  // Crime
  'crime-fraud': { title: 'Crime (Fraud, Scammers, Swindlers)', description: 'Fraud and scams', icon: AlertTriangle },
  'crime-works': { title: 'Crime (Works, Commit, What Is)', description: 'Crime content', icon: Shield },
  'criminal-enterprises': { title: 'Criminal Enterprises', description: 'Criminal organizations', icon: Shield },
  'criminal-gangs': { title: 'Criminal Gangs', description: 'Gang content', icon: Users },
  'criminal-gangsters': { title: 'Criminal Gangsters', description: 'Gangster content', icon: Users },
  
  // Crazy/Amazing
  'crazy-amazing': { title: "Crazy/Amazing/Wouldn't Believe", description: 'Unbelievable content', icon: Sparkles },
  
  // Dances
  'dances-styles': { title: 'Dances (Different Styles)', description: 'Dance styles', icon: Music },
  'dances-choreography': { title: 'Dances (Music Choreography)', description: 'Dance choreography', icon: Music },
  
  // Disasters
  'disasters-avalanches': { title: 'Disasters (Avalanches, Snow)', description: 'Avalanche disasters', icon: Mountain },
  'disasters-earthquakes': { title: 'Disasters (Earthquakes, Floods)', description: 'Earthquakes and floods', icon: AlertTriangle },
  'disasters-fires': { title: 'Disasters (Fires, Explosion)', description: 'Fire disasters', icon: Flame },
  'disasters-hurricanes': { title: 'Disasters (Hurricanes, Tornado)', description: 'Storm disasters', icon: Wind },
  'disasters-volcano': { title: 'Disasters (Volcano)', description: 'Volcanic disasters', icon: Flame },
  
  // Documents & Documentaries
  'document-word': { title: 'Document (Word, Excel, Writing)', description: 'Document tutorials', icon: FileText },
  'documentaries-drugs': { title: 'Documentaries (Drugs, Dealers)', description: 'Drug documentaries', icon: Film },
  'documentary': { title: 'Documentary (Real Events, People)', description: 'Documentary films', icon: Film },
  
  // Drinks
  'drinks': { title: 'Drinks (Alcohol, Non-Alcohol)', description: 'Beverage content', icon: Wine },
  
  // Drones
  'drones-civilian': { title: 'Drones (Civilian Drones, Remote)', description: 'Drone content', icon: Plane },
  
  // Drugs
  'drugs-money': { title: 'Drugs (Drugs, Money, Dealers)', description: 'Drug-related content', icon: AlertTriangle },
  
  // Education Categories
  'education': { title: 'Education', description: 'Educational content', icon: GraduationCap },
  'education-anatomy': { title: 'Education (Anatomy, Human Body)', description: 'Anatomy education', icon: Activity },
  'education-countries': { title: 'Education (Countries History)', description: 'Country history', icon: Globe },
  'education-immigration': { title: 'Education (Immigration, Questions)', description: 'Immigration education', icon: Globe },
  'education-kids-geography': { title: 'Education (Kids Geography)', description: 'Geography for kids', icon: Map },
  'education-laws': { title: 'Education (Laws, Constitution)', description: 'Legal education', icon: Scale },
  
  // News & Politics
  'news-politics': { title: 'News & Politics', description: 'Stay informed with the latest news and political coverage', icon: Newspaper },
  'news-shows': { title: 'News Shows', description: '60 minutes, investigative reports and more', icon: Tv },
  'news-politics-podcasts': { title: 'News & Politics Podcasts', description: 'Podcasts covering news and political topics', icon: Mic },
  'politics': { title: 'Politics', description: 'Political news, analysis and commentary', icon: Vote },
  'senate-house': { title: 'Senate & House of Representatives', description: 'Congressional coverage and legislation', icon: Landmark },
  'tv-news-shows': { title: 'T.V. News Shows', description: 'Television news programs and broadcasts', icon: Tv },
  'tv-news-court': { title: 'T.V. News Show Court', description: 'Court TV and legal news coverage', icon: Gavel },
  'talk-shows': { title: 'Talk Shows', description: 'The View, talk shows and discussions', icon: MessageSquare },
  
  // Music Categories
  'music-lyrics': { title: 'Music (Lyrics)', description: 'Music videos with lyrics', icon: Music },
  'music-mandarin': { title: 'Music (Mandarin, Mandopop)', description: 'Mandarin and Mandopop music', icon: Music },
  'music-mandarin-lyrics': { title: 'Music (Mandarin, Mandopop Lyrics)', description: 'Mandarin music with lyrics', icon: Music },
  'music-christmas': { title: 'Music (Christmas Jingles)', description: 'Holiday and Christmas music', icon: Music },
  'music-christmas-lyrics': { title: 'Music (Christmas Jingles Lyrics)', description: 'Christmas music with lyrics', icon: Music },
  'music-blues': { title: 'Music (Blues)', description: 'Blues music and performances', icon: Guitar },
  'music-classical': { title: 'Music (Classical, Opera)', description: 'Classical music and opera performances', icon: Piano },
  'music-country': { title: 'Music (Country, Western)', description: 'Country and western music', icon: Guitar },
  'music-folk': { title: 'Music (Folk: Ballads, Chorus)', description: 'Folk music, ballads and chorus', icon: Music },
  'music-funk-rock': { title: 'Music (Funk & Hard Rock)', description: 'Funk and hard rock music', icon: Guitar },
  'music-alternative': { title: 'Music (Alternative, Others)', description: 'Alternative music and more', icon: Music },
  'music-rock-soul-pop': { title: 'Music (Rock, Soul, Pop)', description: 'Rock, soul, pop and more', icon: Music },
  'music-funk-hiphop-rap': { title: 'Music (Funk, Hip/Hop, Rap)', description: 'Funk, hip hop and rap music', icon: Headphones },
  'music-history': { title: 'Music (History, Musical Work)', description: 'Music history and musical works', icon: BookOpen },
  'music-heavy-metal': { title: 'Music (Heavy Metal)', description: 'Heavy metal music', icon: Guitar },
  'music-mexican-spanish': { title: 'Music (Mexican, Spanish, Latina)', description: 'Latin, Mexican and Spanish music', icon: Music },
  'music-soundtracks': { title: 'Music (Soundtracks)', description: 'Movie and show soundtracks', icon: Film },
  'music-parody': { title: 'Music (Parody, Satire, Witty)', description: 'Parody and satirical music', icon: Laugh },
  'music-pop': { title: 'Music (Pop, Pop Rock, Traditional Pop)', description: 'Pop and pop rock music', icon: Music },
  'music-rap-reggaeton': { title: 'Music (Rap, Reggaeton)', description: 'Rap and reggaeton music', icon: Headphones },
  'music-relaxation': { title: 'Music (Relaxation, Meditation)', description: 'Relaxation and meditation music', icon: Volume2 },
  'music-salsa': { title: 'Music (Salsa)', description: 'Salsa music and dance', icon: Music },
  'music-soul-train': { title: 'Music (Soul Train)', description: 'Soul Train classics', icon: Music },
  'music-garage': { title: 'Music (Alternative, Garage)', description: 'Alternative and garage music', icon: Music },
  'music-artists-interviews': { title: 'Music Artists Interviews', description: 'Interviews with music artists', icon: Mic },
  'music-artists-news': { title: 'Music Artists News & Gossip', description: 'News and gossip about music artists', icon: Newspaper },
  'music-challenges': { title: 'Music Challenges', description: 'Music challenges and trends', icon: Trophy },
  'music-christian': { title: 'Music Christian (Pop, Rap)', description: 'Christian pop and rap music', icon: Cross },
  'musical-instruments': { title: 'Musical Instrument Players', description: 'Musical instrument performances', icon: Piano },
  
  // People Categories
  'people': { title: 'People', description: 'Content about people and society', icon: Users },
  'people-bigotry': { title: 'People (Bigotry, Favoritism)', description: 'Content addressing social issues', icon: Users },
  'people-fighting': { title: 'People (Fighting, Confrontations)', description: 'Confrontations and conflicts', icon: Users },
  'people-karma': { title: 'People (Karma, Deserved)', description: 'Karma and justice content', icon: Scale },
  'people-look-alikes': { title: 'People (Look-alikes, Impressions)', description: 'Celebrity look-alikes and impressions', icon: Users },
  'people-thefts': { title: 'People (Thefts, Stealing)', description: 'Theft and crime content', icon: AlertTriangle },
  'people-blogs': { title: 'People & Blogs', description: 'Personal blogs and vlogs', icon: Users },
  'people-amazing': { title: 'People Amazing', description: 'Amazing people and stories', icon: Star },
  'people-amazing-things': { title: 'People Amazing Things', description: 'Amazing feats and achievements', icon: Sparkles },
  'people-fails': { title: 'People Fails, Comedy', description: 'Funny fails and comedy', icon: Laugh },
  'people-workers': { title: 'People Worker (Fails, Accidents)', description: 'Worker fails and accidents', icon: Wrench },
  
  // Pets & Animals
  'pets-animals': { title: 'Pets & Animals', description: 'Content about pets and animals', icon: Dog },
  
  // Pictures & Photos
  'pictures-photos': { title: 'Pictures & Photos', description: 'Photography and images', icon: Camera },
  
  // Plants
  'plants': { title: 'Plants (Herb, Flower, Vegetables)', description: 'Plants, herbs, flowers and vegetables', icon: Flower2 },
  
  // Police Categories
  'police-chases': { title: 'Police Chases', description: 'High-speed police chases', icon: Siren },
  'police-sheriff': { title: 'Police, Sheriff, Highway Patrol', description: 'Law enforcement content', icon: Shield },
  'police-stops': { title: 'Police/Sheriff Stop', description: 'Traffic stops and encounters', icon: Shield },
  
  // Pranks
  'pranks': { title: 'Pranks (Funny, Weird, Crazy)', description: 'Funny and crazy pranks', icon: Laugh },
  
  // Presidents
  'president-motorcade': { title: "President's Motorcade", description: 'Presidential motorcade footage', icon: Car },
  'presidents': { title: 'Presidents (Air Force One, Marine One)', description: 'Presidential aircraft and transport', icon: Plane },
  'presidents-former': { title: 'Presidents (Former Presidents)', description: 'Former presidents content', icon: Landmark },
  
  // Property
  'property': { title: 'Property (Land, Buildings)', description: 'Property and real estate content', icon: Building },
  
  // Protesters
  'protesters': { title: 'Protesters (Demonstrators)', description: 'Protests and demonstrations', icon: Megaphone },
  
  // Quotes & Poems
  'quotes-poems': { title: 'Quotes, Poems, Statements', description: 'Inspirational quotes and poetry', icon: Quote },
  
  // Radio
  'radio-remote': { title: 'Radio Remote (RC Cars, RC Airplanes)', description: 'RC vehicles and hobbies', icon: Gamepad2 },
  'radio-show': { title: 'Radio Show (Music, Podcasts)', description: 'Radio shows and podcasts', icon: Radio },
  
  // Real Estate
  'real-estate': { title: 'Real Estate', description: 'Real estate and property', icon: Home },
  'real-estate-commercial': { title: 'Real Estate (Commercial)', description: 'Commercial real estate', icon: Building },
  'real-estate-luxury': { title: 'Real Estate (Luxury, Million Dollar)', description: 'Luxury real estate', icon: Crown },
  
  // Relationships
  'relationships': { title: 'Relationships', description: 'Relationship advice and content', icon: Heart },
  
  // Reproductive Systems
  'reproductive-systems': { title: 'Reproductive Systems', description: 'Health and education content', icon: Activity },
  
  // Restaurants
  'restaurants': { title: 'Restaurants', description: 'Restaurant reviews and content', icon: Utensils },
  
  // Riddles
  'riddles': { title: 'Riddles (Conundrum, Puzzle)', description: 'Riddles and puzzles', icon: HelpCircle },
  
  // Rivers
  'rivers': { title: 'Rivers', description: 'River landscapes and nature', icon: Waves },
  
  // Ships & Sailing
  'sailing-ships': { title: 'Sailing Ships', description: 'Sailing vessels and boats', icon: Sailboat },
  'ships-cruise': { title: 'Ships, Cruise Ships', description: 'Cruise ships and ocean liners', icon: Ship },
  'ship-icebreakers': { title: 'Ship Icebreakers', description: 'Icebreaker ships', icon: Ship },
  'shipping-ports': { title: 'Shipping Ports', description: 'Shipping ports and logistics', icon: Anchor },
  'submarines': { title: 'Submarines (Civilian)', description: 'Civilian submarines', icon: Ship },
  'tugboats': { title: 'Tugboats', description: 'Tugboat operations', icon: Ship },
  
  // Science & Technology
  'science': { title: 'Science (Knowledge, Know How)', description: 'Science education and knowledge', icon: Microscope },
  'science-tech-invent': { title: 'Science & Tech (Inventions)', description: 'Scientific inventions', icon: Lightbulb },
  'science-tech-gadgets': { title: 'Science & Tech (Gadgets)', description: 'Technology gadgets', icon: Smartphone },
  'science-technology': { title: 'Science & Technology', description: 'Science and technology content', icon: Atom },
  
  // Seas & Oceans
  'seas': { title: 'Seas', description: 'Sea and ocean content', icon: Waves },
  'waters-oceans': { title: 'Waters, Oceans, Seas, Lakes', description: 'Water bodies and marine life', icon: Waves },
  
  // Snow & Weather
  'snow-storms': { title: 'Snow Storms, Ice Roads', description: 'Snow storms and ice roads', icon: Snowflake },
  'storms': { title: 'Storms', description: 'Storm and weather footage', icon: Cloud },
  'storms-hail': { title: 'Storms (Hail, Blizzard, Ice)', description: 'Hail and blizzard storms', icon: Snowflake },
  'tornado': { title: 'Tornado', description: 'Tornado footage and coverage', icon: Wind },
  'tsunami': { title: 'Tsunami', description: 'Tsunami coverage', icon: Waves },
  'volcanos': { title: 'Volcanos (Lava, Eruptions)', description: 'Volcanic eruptions', icon: Flame },
  
  // Space
  'space': { title: 'Space (Craft, Ship, Shuttle)', description: 'Space exploration content', icon: Rocket },
  'universe': { title: 'Universe (Space, Earth)', description: 'Universe and astronomy', icon: Globe },
  
  // Speeches
  'speech-commencement': { title: 'Speech (Commencement)', description: 'Graduation speeches', icon: GraduationCap },
  'speech-eulogy': { title: 'Speech (Eulogy, Memorial)', description: 'Memorial speeches', icon: Heart },
  'speech-informative': { title: 'Speech (Informative)', description: 'Informative speeches', icon: Info },
  'speech-motivational': { title: 'Speech (Motivational)', description: 'Motivational speeches', icon: Zap },
  'speech-persuasive': { title: 'Speech (Persuasive, Protest)', description: 'Persuasive speeches', icon: Megaphone },
  'speeches': { title: 'Speeches', description: 'Various speeches', icon: Mic },
  
  // Sports - Main categories
  'sports': { title: 'Sports', description: 'Sports content and coverage', icon: Trophy },
  'sports-arenas': { title: 'Sports (Arenas, Stadiums)', description: 'Sports venues', icon: Building2 },
  'sports-basketball-football': { title: 'Sports (Basketball, Football)', description: 'Basketball and football', icon: Trophy },
  'sports-car-racing': { title: 'Sports (Car Racing, WRC)', description: 'Car racing events', icon: Car },
  'sports-comedy': { title: 'Sports (Comedy, Bloopers)', description: 'Sports comedy and bloopers', icon: Laugh },
  'sports-fishing': { title: 'Sports (Fishing)', description: 'Fishing content', icon: Anchor },
  'sports-interviews': { title: 'Sports (Interviews, Athletes)', description: 'Athlete interviews', icon: Mic },
  'sports-kickboxing': { title: 'Sports (Kickboxing)', description: 'Kickboxing fights', icon: Trophy },
  'sports-mlb-players': { title: 'Sports (MLB Players, Coaches)', description: 'MLB players and coaches', icon: Trophy },
  'sports-nba-players': { title: 'Sports (NBA Players, Coaches)', description: 'NBA players and coaches', icon: Trophy },
  'sports-nfl-players': { title: 'Sports (NFL Players, Coaches)', description: 'NFL players and coaches', icon: Trophy },
  'sports-nhl-players': { title: 'Sports (NHL Players, Coaches)', description: 'NHL players and coaches', icon: Trophy },
  'sports-pga-golf': { title: 'Sports (PGA, Golf Players)', description: 'PGA and golf', icon: Target },
  'sports-race-car': { title: 'Sports (Race Car Drivers)', description: 'Race car drivers', icon: Car },
  'sports-cycling': { title: 'Sports (Road, Mountain, Bicycle)', description: 'Cycling sports', icon: Bike },
  'sports-rugby-cricket': { title: 'Sports (Rugby, Cricket, Lacrosse)', description: 'Rugby, cricket and lacrosse', icon: Trophy },
  'sports-soccer': { title: 'Sports (Soccer, American Football)', description: 'Soccer and football', icon: Trophy },
  'sports-water': { title: 'Sports (Surfing, Kayaking)', description: 'Water sports', icon: Waves },
  'sports-tennis-men-finals': { title: 'Sports (Tennis Men Final Champions)', description: 'Men tennis finals', icon: Trophy },
  'sports-tennis-men': { title: 'Sports (Tennis Men)', description: 'Men tennis', icon: Trophy },
  'sports-tennis-women-finals': { title: 'Sports (Tennis Women Final Champions)', description: 'Women tennis finals', icon: Trophy },
  'sports-tennis-women': { title: 'Sports (Tennis Women)', description: 'Women tennis', icon: Trophy },
  'sports-track-field-highlights': { title: 'Sports (Track & Field Highlights)', description: 'Track & field highlights', icon: Trophy },
  'sports-track-field': { title: 'Sports (Track & Field)', description: 'Track & field events', icon: Timer },
  'sports-volleyball': { title: 'Sports (Volleyball)', description: 'Volleyball content', icon: Volleyball },
  'sports-weightlifting': { title: 'Sports (Weightlifting Olympics)', description: 'Olympic weightlifting', icon: Weight },
  'sports-wwe': { title: 'Sports (WWE Sports Entertainment)', description: 'WWE wrestling', icon: Trophy },
  'sports-boxing': { title: 'Sports Boxing', description: 'Boxing content', icon: Trophy },
  'sports-boxing-interviews': { title: 'Sports Boxing (Interviews)', description: 'Boxing interviews', icon: Mic },
  'sports-college-swimming': { title: 'Sports College (Swimming, Hockey)', description: 'College swimming and hockey', icon: Waves },
  'sports-college-baseball': { title: 'Sports College Baseball', description: 'College baseball', icon: Trophy },
  'sports-college-basketball': { title: 'Sports College Basketball', description: 'College basketball', icon: Trophy },
  'sports-college-football': { title: 'Sports College Football', description: 'College football', icon: Trophy },
  'sports-college-football-bowl': { title: 'Sports College Football Bowl', description: 'College football bowl games', icon: Trophy },
  'sports-college-track': { title: 'Sports College Track & Field', description: 'College track & field', icon: Timer },
  'sports-college-women-basketball': { title: 'Sports College Women Basketball', description: 'Women college basketball', icon: Trophy },
  'sports-fans-challenges': { title: 'Sports Fans Challenges', description: 'Fan challenges and prizes', icon: Trophy },
  'sports-football-high-school': { title: 'Sports Football (High School)', description: 'High school football', icon: Trophy },
  'sports-formula-one': { title: 'Sports Formula One (1) Racing', description: 'F1 racing', icon: Car },
  'sports-game-challenges': { title: 'Sports Game (Fan Challenges)', description: 'Fan game challenges', icon: Gamepad2 },
  'sports-golf-ryder-cup': { title: 'Sports Golf (Ryder Cup)', description: 'Ryder Cup golf', icon: Target },
  'sports-hockey-countries': { title: 'Sports Hockey (Countries)', description: 'International hockey', icon: Trophy },
  'sports-horse-racing': { title: 'Sports Horse Racing', description: 'Horse racing', icon: Trophy },
  'sports-horses': { title: 'Sports Horses (Equestrian)', description: 'Equestrian sports', icon: Trophy },
  'sports-mlb-playoffs-al': { title: 'Sports MLB (Playoffs AL)', description: 'MLB AL playoffs', icon: Trophy },
  'sports-mlb-playoffs-nl': { title: 'Sports MLB (Playoffs NL)', description: 'MLB NL playoffs', icon: Trophy },
  'sports-mlb-baseball': { title: 'Sports MLB Baseball', description: 'MLB baseball', icon: Trophy },
  'sports-mlb-world-series': { title: 'Sports MLB Baseball (World Series)', description: 'World Series', icon: Trophy },
  'sports-mlb-world-series-present': { title: 'Sports MLB World Series (Present)', description: 'Current World Series', icon: Trophy },
  'sports-mls-fifa': { title: 'Sports MLS, FIFA, USL, WSL Soccer', description: 'Soccer leagues', icon: Trophy },
  'sports-mma-ufc': { title: 'Sports MMA, UFC Fighting', description: 'MMA and UFC', icon: Trophy },
  'sports-motorcycles': { title: 'Sports Motorcycles (Superbike)', description: 'Motorcycle racing', icon: Bike },
  'sports-nascar': { title: 'Sports Nascar Racing', description: 'NASCAR racing', icon: Car },
  'sports-nba-east-playoffs': { title: 'Sports NBA (East Playoffs)', description: 'NBA Eastern playoffs', icon: Trophy },
  'sports-nba-west-playoffs': { title: 'Sports NBA (West Playoffs)', description: 'NBA Western playoffs', icon: Trophy },
  'sports-nba-basketball': { title: 'Sports NBA Basketball', description: 'NBA basketball', icon: Trophy },
  'sports-news-podcasts': { title: 'Sports News, Podcasts', description: 'Sports news and podcasts', icon: Mic },
  'sports-nfl-football': { title: 'Sports NFL Football', description: 'NFL football', icon: Trophy },
  'sports-nfl-superbowl': { title: 'Sports NFL (Superbowl)', description: 'Super Bowl', icon: Trophy },
  'sports-nhl-allstar-east': { title: 'Sports NHL (All-Star East)', description: 'NHL All-Star East', icon: Trophy },
  'sports-nhl-allstar': { title: 'Sports NHL (All-Star Hockey)', description: 'NHL All-Star game', icon: Trophy },
  'sports-nhl-allstar-west': { title: 'Sports NHL (All-Star West)', description: 'NHL All-Star West', icon: Trophy },
  'sports-nhl-playoffs': { title: 'Sports NHL (Hockey Playoffs)', description: 'NHL playoffs', icon: Trophy },
  'sports-nhl-hockey': { title: 'Sports NHL Hockey', description: 'NHL hockey', icon: Trophy },
  'sports-nhra': { title: 'Sports NHRA Drag Racing', description: 'NHRA drag racing', icon: Car },
  'sports-olympics-track': { title: 'Sports Olympics (Track & Field)', description: 'Olympic track & field', icon: Medal },
  'sports-personalities': { title: 'Sports Personalities (Interviews)', description: 'Sports personalities', icon: Mic },
  'sports-professional-golf': { title: 'Sports Professional Golf', description: 'Professional golf', icon: Target },
  'sports-track-field-main': { title: 'Sports Track & Field', description: 'Track & field', icon: Timer },
  'sports-volleyball-amateur': { title: 'Sports Volleyball (Amateur)', description: 'Amateur volleyball', icon: Volleyball },
  'sports-volleyball-beach': { title: 'Sports Volleyball (Beach)', description: 'Beach volleyball', icon: Volleyball },
  'sports-volleyball-professional': { title: 'Sports Volleyball (Professional)', description: 'Professional volleyball', icon: Volleyball },
  'sports-volleyball-tournament': { title: 'Sports Volleyball (Tournament)', description: 'Volleyball tournaments', icon: Volleyball },
  'sports-wnba-players': { title: 'Sports WNBA (Players)', description: 'WNBA players', icon: Trophy },
  'sports-wnba-champions': { title: 'Sports WNBA (Champions)', description: 'WNBA champions', icon: Trophy },
  'sports-wnba-coaches': { title: 'Sports WNBA (Coaches)', description: 'WNBA coaches', icon: Trophy },
  'sports-wnba-playoffs': { title: 'Sports WNBA (Playoffs)', description: 'WNBA playoffs', icon: Trophy },
  'sports-wnba-basketball': { title: 'Sports WNBA Basketball', description: 'WNBA basketball', icon: Trophy },
  'sports-women-mma': { title: 'Sports Women (MMA, UFC, EFC)', description: 'Women MMA', icon: Trophy },
  'sports-wwe-wrestling': { title: 'Sports WWE Wrestling', description: 'WWE wrestling', icon: Trophy },
  'sports-women-basketball-ncaa': { title: 'Sports (Women Basketball NCAA)', description: 'Women NCAA basketball', icon: Trophy },
  
  // Statues & Art
  'statues': { title: 'Statues, Sculpture, Effigy', description: 'Statues and sculptures', icon: Landmark },
  
  // Stocks & Finance
  'stocks-money': { title: 'Stocks, Money, Commodity', description: 'Financial markets', icon: TrendingUp },
  
  // Stone Carvers
  'stone-carvers': { title: 'Stone Carvers', description: 'Stone carving artistry', icon: Hammer },
  
  // Success
  'success': { title: 'Success (Achieve, Success)', description: 'Success stories', icon: Award },
  
  // Swimming
  'swim-diving': { title: 'Swim (Diving)', description: 'Swimming and diving', icon: Waves },
  
  // Trains
  'train-riders': { title: 'Train Riders (Hobos, Freight)', description: 'Train riding content', icon: Train },
  'trains-commercial': { title: 'Trains (Commercial)', description: 'Commercial trains', icon: Train },
  'trains-passenger': { title: 'Trains (Passenger, Coach)', description: 'Passenger trains', icon: Train },
  'trains-travel': { title: 'Trains (Travel, Crashes)', description: 'Train travel and accidents', icon: Train },
  
  // Travel
  'travel': { title: 'Travel', description: 'Travel content and guides', icon: Plane },
  'travel-beaches': { title: 'Travel (Beaches)', description: 'Beach destinations', icon: Sun },
  'travel-cities': { title: 'Travel (Cities, Towns)', description: 'City travel', icon: Building },
  'travel-country-foods': { title: 'Travel (Country Foods)', description: 'Food travel', icon: Utensils },
  'travel-hotels-expensive': { title: 'Travel (Hotels, Most Expensive)', description: 'Luxury hotels', icon: Crown },
  'travel-hotels': { title: 'Travel (Hotels, Motels)', description: 'Hotel reviews', icon: Building },
  'travel-hotels-unique': { title: 'Travel (Hotels, Unique, Weird)', description: 'Unique hotels', icon: Sparkles },
  'travel-nightclubs': { title: 'Travel (Night Clubs)', description: 'Nightlife', icon: Music },
  'travel-restaurants': { title: 'Travel (Restaurants)', description: 'Restaurant travel', icon: Utensils },
  'travel-street-food': { title: 'Travel (Street Food)', description: 'Street food', icon: UtensilsCrossed },
  'travel-streets': { title: 'Travel (Streets, Night-life)', description: 'Street and nightlife', icon: Building },
  'travel-new-year': { title: 'Travel (World New Year)', description: 'New Year celebrations', icon: Sparkles },
  'travel-events': { title: 'Travel & Events', description: 'Travel and events', icon: Plane },
  'travel-events-countries': { title: 'Travel & Events (Countries)', description: 'Country events', icon: Globe },
  'travel-tips': { title: 'Travel Tips (Overseas)', description: 'Travel tips', icon: Info },
  
  // Trucks
  'trucks-pickups': { title: 'Trucks (Pickups, Vans)', description: 'Pickup trucks and vans', icon: Truck },
  'trucks-semi': { title: 'Trucks (Semi Trucks)', description: 'Semi trucks', icon: Truck },
  'trucks-heavy': { title: 'Trucks/Heavy Equipment', description: 'Heavy equipment', icon: Truck },
  
  // UFOs
  'ufos': { title: "UFO's/Strange Sightings", description: 'UFO sightings', icon: AlertCircle },
  
  // Wealth
  'wealth': { title: 'Wealth, Riches, Luxury', description: 'Luxury lifestyle', icon: Crown },
  
  // Weapons
  'weapons': { title: 'Weapons (Civilian Guns, Knives)', description: 'Weapons content', icon: Target },
  
  // Weather & Disasters
  'weather-disasters': { title: 'Weather & Disasters', description: 'Weather and disaster coverage', icon: Cloud },
  
  // Weightlifting
  'weightlifting-prank': { title: 'Weight Lifting (Prank)', description: 'Weightlifting pranks', icon: Weight },
  'weightlifting-female': { title: 'Weightlifting Female', description: 'Women weightlifting', icon: Weight },
  'weightlifting-male': { title: 'Weightlifting Male', description: 'Men weightlifting', icon: Weight },
  
  // Workers
  'workers': { title: 'Workers (Amazing, Great Things)', description: 'Amazing workers', icon: Wrench },
  
  // Workout
  'workout': { title: 'Workout (Weightlifting, Fitness)', description: 'Workout and fitness', icon: Dumbbell },
  'workout-female': { title: 'Workout Female', description: 'Women workouts', icon: Dumbbell },
  'workout-fitness': { title: 'Workout Fitness', description: 'Fitness workouts', icon: Dumbbell },
  'workout-male': { title: 'Workout Male', description: 'Men workouts', icon: Dumbbell },
  
  // World History
  'world-history': { title: 'World History', description: 'Historical content', icon: Globe },
  
  // Yachts
  'yachts': { title: 'Yachts, Luxury Yachts', description: 'Luxury yachts', icon: Sailboat },
  
  // Yoga
  'yoga': { title: 'Yoga Workout', description: 'Yoga and wellness', icon: Heart },
  
  // Nonprofits
  'nonprofits': { title: 'Nonprofits & Activism', description: 'Nonprofit organizations and activism', icon: HeartHandshake },
  
  // Sound Effects & Audio
  'sound-effects': { title: 'Sound Effects', description: 'Sound effects for projects', icon: Volume2 },
  'asmr': { title: 'ASMR', description: 'Relaxing ASMR content', icon: Headphones },
  
  // Police Department Categories
  'police-department': { title: 'Police Department', description: 'Police department content', icon: Shield },
  'police-fails': { title: 'Police Fails', description: 'Police fails and funny moments', icon: Siren },
  'police-trainings': { title: 'Police Department (Trainings)', description: 'Police training content', icon: Shield },
  'police-personnel': { title: 'Police Department (Personnel)', description: 'Police personnel and officers', icon: Users },
  'police-equipment': { title: 'Police Department (Equipment)', description: 'Police equipment and gear', icon: Shield },
  'police-weapons': { title: 'Police Department (Weapons)', description: 'Police weapons and armory', icon: Target },
  'police-boot-camp': { title: 'Police Department (Boot Camp Training)', description: 'Police boot camp and academy training', icon: Shield },
  'police-vehicle-chases': { title: 'Police Department (Vehicle Chases)', description: 'High-speed police vehicle chases', icon: Car },
  'police-vehicle-crashes': { title: 'Police Department (Vehicle Crashes)', description: 'Police vehicle crashes and accidents', icon: AlertTriangle },
  'police-shootings': { title: 'Police Department (Shootings)', description: 'Police shooting incidents', icon: Target },
  
  // Fire Department Categories
  'fire-department': { title: 'Fire Department', description: 'Fire department content', icon: Flame },
  'fire-department-fails': { title: 'Fire Department Fails', description: 'Fire department fails and funny moments', icon: Flame },
  'fire-trucks': { title: 'Fire Trucks', description: 'Fire trucks and emergency vehicles', icon: Truck },
  'fire-personnel-training': { title: 'Fire Personnel Training', description: 'Firefighter training and personnel', icon: Flame },
  'fire-house-fires': { title: 'Fire Department (House Fires)', description: 'House fire response and rescue', icon: Flame },
  'fire-building-fires': { title: 'Fire Department (Building Fires)', description: 'Building fire response', icon: Building },
  'fire-land-fires': { title: 'Fire Department (Land Fires)', description: 'Land and wildfire response', icon: Flame },
  
  // Military Marines
  'military-marines': { title: 'Military: Marines', description: 'US Marine Corps content', icon: Shield },
  'marine-training': { title: 'Military (Marine Training)', description: 'Marine Corps training', icon: Target },
  'marine-boot-camp': { title: 'Military (Marine Boot Camp)', description: 'Marine boot camp', icon: Shield },
  'marine-ships': { title: 'Military (Marine Ships)', description: 'Marine Corps ships', icon: Ship },
  'marine-personnel': { title: 'Military (Marine Personnel)', description: 'Marine personnel and soldiers', icon: Users },
  'marine-weapons': { title: 'Military (Marine Weapons)', description: 'Marine weapons systems', icon: Target },
  'marine-pilots': { title: 'Military (Marine Pilots)', description: 'Marine pilots and aviation', icon: Plane },
  'marine-duties': { title: 'Military (Marine Duties)', description: 'Marine duties and operations', icon: Shield },
  
  // Military Army
  'military-army': { title: 'Military: Army', description: 'US Army content', icon: Shield },
  'army-training': { title: 'Military (Army Training)', description: 'Army training exercises', icon: Target },
  'army-boot-camp': { title: 'Military (Army Boot Camp)', description: 'Army boot camp training', icon: Shield },
  'army-ships': { title: 'Military (Army Ships)', description: 'Army watercraft', icon: Ship },
  'army-personnel': { title: 'Military (Army Personnel)', description: 'Army personnel and soldiers', icon: Users },
  'army-weapons': { title: 'Military (Army Weapons)', description: 'Army weapons systems', icon: Target },
  'army-pilots': { title: 'Military (Army Pilots)', description: 'Army aviation pilots', icon: Plane },
  'army-duties': { title: 'Military (Army Duties)', description: 'Army duties and operations', icon: Shield },
  
  // Military Navy
  'military-navy': { title: 'Military: Navy', description: 'US Navy content', icon: Anchor },
  'navy-training': { title: 'Military (Navy Training)', description: 'Navy training exercises', icon: Target },
  'navy-boot-camp': { title: 'Military (Navy Boot Camp)', description: 'Navy boot camp training', icon: Anchor },
  'navy-ships': { title: 'Military (Navy Ships)', description: 'Navy ships and vessels', icon: Ship },
  'navy-personnel': { title: 'Military (Navy Personnel)', description: 'Navy personnel and sailors', icon: Users },
  'navy-weapons': { title: 'Military (Navy Weapons)', description: 'Navy weapons systems', icon: Target },
  'navy-pilots': { title: 'Military (Navy Pilots)', description: 'Navy aviation pilots', icon: Plane },
  'navy-duties': { title: 'Military (Navy Duties)', description: 'Navy duties and operations', icon: Anchor },
  
  // Military Coast Guard
  'military-coast-guard': { title: 'Military: Coast Guard', description: 'US Coast Guard content', icon: Anchor },
  'coast-guard-training': { title: 'Military (Coast Guard Training)', description: 'Coast Guard training', icon: Target },
  'coast-guard-boot-camp': { title: 'Military (Coast Guard Boot Camp)', description: 'Coast Guard boot camp', icon: Anchor },
  'coast-guard-ships': { title: 'Military (Coast Guard Ships)', description: 'Coast Guard vessels', icon: Ship },
  'coast-guard-personnel': { title: 'Military (Coast Guard Personnel)', description: 'Coast Guard personnel', icon: Users },
  'coast-guard-weapons': { title: 'Military (Coast Guard Weapons)', description: 'Coast Guard weapons', icon: Target },
  'coast-guard-pilots': { title: 'Military (Coast Guard Pilots)', description: 'Coast Guard aviation', icon: Plane },
  'coast-guard-duties': { title: 'Military (Coast Guard Duties)', description: 'Coast Guard duties', icon: Anchor },
  
  // Military Airforce
  'military-airforce': { title: 'Military: Airforce', description: 'US Air Force content', icon: Plane },
  'airforce-training': { title: 'Military (Airforce Training)', description: 'Air Force training', icon: Target },
  'airforce-boot-camp': { title: 'Military (Airforce Boot Camp)', description: 'Air Force boot camp', icon: Plane },
  'airforce-planes': { title: 'Military (Airforce Planes)', description: 'Air Force aircraft', icon: Plane },
  'airforce-ships': { title: 'Military (Airforce Ships)', description: 'Air Force support vessels', icon: Ship },
  'airforce-personnel': { title: 'Military (Airforce Personnel)', description: 'Air Force personnel', icon: Users },
  'airforce-weapons': { title: 'Military (Airforce Weapons)', description: 'Air Force weapons', icon: Target },
  'airforce-pilots': { title: 'Military (Airforce Pilots)', description: 'Air Force pilots', icon: Plane },
  'airforce-duties': { title: 'Military (Airforce Duties)', description: 'Air Force duties', icon: Plane },
  
  // Military Weapons Drones (shared across branches)
  'military-weapons-drones': { title: 'Military Weapons Drones', description: 'Military drone weapons systems', icon: Plane },
  
  // Physical Fitness Categories
  'physical-fitness': { title: 'Physical Fitness', description: 'Workout videos, weightlifting, yoga, and fitness content', icon: Dumbbell },
  'fitness-weight-lifting': { title: 'Weight Lifting', description: 'Weight lifting videos, pranks, and amazing content', icon: Dumbbell, parent: { route: '/physical-fitness', name: 'Physical Fitness' } },
  'fitness-weightlifting-female': { title: 'Weightlifting Female', description: 'Female weightlifting content and inspiration', icon: Dumbbell, parent: { route: '/physical-fitness', name: 'Physical Fitness' } },
  'fitness-weightlifting-male': { title: 'Weightlifting Male', description: 'Male weightlifting content and training', icon: Dumbbell, parent: { route: '/physical-fitness', name: 'Physical Fitness' } },
  'fitness-workers': { title: 'Workers', description: 'Amazing workers, great things and physical feats', icon: Dumbbell, parent: { route: '/physical-fitness', name: 'Physical Fitness' } },
  'fitness-workout': { title: 'Workout', description: 'Workout videos, weightlifting and fitness content', icon: Dumbbell, parent: { route: '/physical-fitness', name: 'Physical Fitness' } },
  'fitness-workout-female': { title: 'Workout Female', description: 'Female workout routines and fitness inspiration', icon: Dumbbell, parent: { route: '/physical-fitness', name: 'Physical Fitness' } },
  'fitness-workout-fitness': { title: 'Workout Fitness', description: 'General workout and fitness training content', icon: Dumbbell, parent: { route: '/physical-fitness', name: 'Physical Fitness' } },
  'fitness-workout-male': { title: 'Workout Male', description: 'Male workout routines and fitness training', icon: Dumbbell, parent: { route: '/physical-fitness', name: 'Physical Fitness' } },
  'fitness-yoga-workout': { title: 'Yoga Workout', description: 'Yoga workout routines and flexibility training', icon: Dumbbell, parent: { route: '/physical-fitness', name: 'Physical Fitness' } },
  'fitness-calisthenics': { title: 'Calisthenics Workout', description: 'Bodyweight exercises and calisthenics training', icon: Dumbbell, parent: { route: '/physical-fitness', name: 'Physical Fitness' } },
};

// Helper function to get category info
export const getCategoryInfo = (key: string): CategoryInfo => {
  return allCategoryMappings[key] || {
    title: key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: `Explore content about ${key.replace(/-/g, ' ')}`,
    icon: Video
  };
};
