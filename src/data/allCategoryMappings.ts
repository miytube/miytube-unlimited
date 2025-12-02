
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
};

// Helper function to get category info
export const getCategoryInfo = (key: string): CategoryInfo => {
  return allCategoryMappings[key] || {
    title: key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: `Explore content about ${key.replace(/-/g, ' ')}`,
    icon: Video
  };
};
