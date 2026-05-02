
import { SubcategoryMapping } from './types';
import { 
  Bot, Cpu, Smartphone, Globe, Rocket, Satellite,
  Plane, Car, Truck, Bike, Train, Ship, Anchor,
  Dog, Fish, Bird, Leaf, TreeDeciduous, Droplets,
  Scale, Shield, Gavel, Lock, AlertTriangle, Siren,
  Briefcase, DollarSign, TrendingUp, Building2, Landmark, Tractor,
  Heart, Baby, Users, Sparkles, Scissors, HeartHandshake, BadgeCheck,
  Utensils, Pizza, Wine,
  Gamepad2, GraduationCap, Palette, Music, Film,
  BookOpen, Church, Crown, Amphora,
  Flag, Megaphone, Newspaper, Radio, Mic,
  Trophy, Dumbbell, Target, Medal, Timer, Waves,
  Clapperboard, Tv, Camera, Star,
  Smile, Laugh, PartyPopper, Zap,
  Headphones, Guitar, Disc,
  Dice1, Wand2, Puzzle,
  Activity, Brain, Stethoscope,
  Image, Shirt, Sun, Snowflake,
  Map, Hotel, Palmtree,
  Wrench, Lightbulb, Hammer,
  Award
} from 'lucide-react';

export const newCategorySubcategories: SubcategoryMapping = {
  // ============ AI & TECHNOLOGY ============
  '/ai/chatbots': {
    title: 'ChatGPT, Gemini, Microsoft',
    description: 'AI chatbots and language models',
    icon: Bot,
    parent: { route: '/ai', name: 'AI & Technology' }
  },
  '/ai/agents': {
    title: 'AI Agents & Software',
    description: 'AI agents and software systems',
    icon: Bot,
    parent: { route: '/ai', name: 'AI & Technology' }
  },
  '/ai/humanoid': {
    title: 'AI Humanoid Robots',
    description: 'Humanoid robots and AI',
    icon: Bot,
    parent: { route: '/ai', name: 'AI & Technology' }
  },
  '/ai/hr': {
    title: 'AI Human Resources',
    description: 'AI in human resources',
    icon: Bot,
    parent: { route: '/ai', name: 'AI & Technology' }
  },
  '/ai/robots': {
    title: 'AI Robots',
    description: 'Artificial intelligence robots',
    icon: Bot,
    parent: { route: '/ai', name: 'AI & Technology' }
  },
  '/ai/bots': {
    title: 'AI Bots & Automation',
    description: 'AI bots and automation systems',
    icon: Bot,
    parent: { route: '/ai', name: 'AI & Technology' }
  },
  '/science-tech/knowledge': {
    title: 'Knowledge & Know How',
    description: 'Scientific knowledge and expertise',
    icon: Cpu,
    parent: { route: '/science-tech', name: 'Science & Tech' }
  },
  '/science-tech/inventions': {
    title: 'Inventions',
    description: 'New inventions and discoveries',
    icon: Cpu,
    parent: { route: '/science-tech', name: 'Science & Tech' }
  },
  '/science-tech/gadgets': {
    title: 'Gadgets & Devices',
    description: 'Tech gadgets and devices',
    icon: Cpu,
    parent: { route: '/science-tech', name: 'Science & Tech' }
  },
  '/science-tech/experiments': {
    title: 'Experiments',
    description: 'Scientific experiments',
    icon: Cpu,
    parent: { route: '/science-tech', name: 'Science & Tech' }
  },
  '/cell-phone/tricks': {
    title: 'Cell Phone Tricks & Hacks',
    description: 'Phone tips, tricks and hacks',
    icon: Smartphone,
    parent: { route: '/cell-phone', name: 'Cell Phone' }
  },
  '/cell-phone/tips': {
    title: 'Cell Phone Tips & Guides',
    description: 'Phone guides and tutorials',
    icon: Smartphone,
    parent: { route: '/cell-phone', name: 'Cell Phone' }
  },
  '/internet/programming': {
    title: 'Programming & Coding',
    description: 'Programming tutorials and coding',
    icon: Globe,
    parent: { route: '/internet', name: 'Internet & Programming' }
  },
  '/internet/web': {
    title: 'Web Development',
    description: 'Web development tutorials',
    icon: Globe,
    parent: { route: '/internet', name: 'Internet & Programming' }
  },
  '/space/craft': {
    title: 'Spacecraft & Shuttles',
    description: 'Spacecraft and space shuttles',
    icon: Rocket,
    parent: { route: '/space', name: 'Space' }
  },
  '/space/universe': {
    title: 'Universe & Earth',
    description: 'Universe and Earth exploration',
    icon: Rocket,
    parent: { route: '/space', name: 'Space' }
  },
  '/space/ufo': {
    title: 'UFOs & Strange Sightings',
    description: 'UFO sightings and strange phenomena',
    icon: Rocket,
    parent: { route: '/space', name: 'Space' }
  },

  // ============ AVIATION & TRANSPORT ============
  '/airplanes/airships': {
    title: 'Airships & Blimps',
    description: 'Airships, blimps and dirigibles',
    icon: Plane,
    parent: { route: '/airplanes', name: 'Airplanes' }
  },
  '/airplanes/cargo': {
    title: 'Cargo Planes',
    description: 'Cargo and freight aircraft',
    icon: Plane,
    parent: { route: '/airplanes', name: 'Airplanes' }
  },
  '/airplanes/commercial': {
    title: 'Commercial & Jumbo Jets',
    description: 'Commercial airlines and jumbo jets',
    icon: Plane,
    parent: { route: '/airplanes', name: 'Airplanes' }
  },
  '/airplanes/land-water': {
    title: 'Land & Water Planes',
    description: 'Amphibious aircraft',
    icon: Plane,
    parent: { route: '/airplanes', name: 'Airplanes' }
  },
  '/airplanes/pilots': {
    title: 'Pilots & Captains',
    description: 'Pilots and flight captains',
    icon: Plane,
    parent: { route: '/airplanes', name: 'Airplanes' }
  },
  '/airplanes/single-engine': {
    title: 'Single Engine & Small Planes',
    description: 'Single engine and small aircraft',
    icon: Plane,
    parent: { route: '/airplanes', name: 'Airplanes' }
  },
  '/airplanes/fleet': {
    title: 'Airplane Fleet & Aircrafts',
    description: 'Aircraft fleets and collections',
    icon: Plane,
    parent: { route: '/airplanes', name: 'Airplanes' }
  },
  '/airports/improvements': {
    title: 'Airport Improvements & Construction',
    description: 'Airport construction and improvements',
    icon: Plane,
    parent: { route: '/airports', name: 'Airports' }
  },
  '/airports/fails': {
    title: 'Airport Fails',
    description: 'Airport fails and funny moments',
    icon: Plane,
    parent: { route: '/airports', name: 'Airports' }
  },
  '/helicopters/passenger': {
    title: 'Passenger & Commercial Helicopters',
    description: 'Commercial helicopter services',
    icon: Plane,
    parent: { route: '/helicopters', name: 'Helicopters' }
  },
  '/helicopters/private': {
    title: 'Private Helicopters',
    description: 'Private helicopter ownership',
    icon: Plane,
    parent: { route: '/helicopters', name: 'Helicopters' }
  },
  '/cars/major-repairs': {
    title: 'Major Car Repairs',
    description: 'Major automotive repairs',
    icon: Car,
    parent: { route: '/autos-vehicles', name: 'Cars & Vehicles' }
  },
  '/cars/minor-repairs': {
    title: 'Minor Car Repairs',
    description: 'Minor automotive repairs and maintenance',
    icon: Car,
    parent: { route: '/autos-vehicles', name: 'Cars & Vehicles' }
  },
  '/cars/racing-crashes': {
    title: 'Racing Crashes & Accidents',
    description: 'Car racing crashes and accidents',
    icon: Car,
    parent: { route: '/autos-vehicles', name: 'Cars & Vehicles' }
  },
  '/cars/hacks': {
    title: 'Car Hacks & Tips',
    description: 'Automotive tips and hacks',
    icon: Car,
    parent: { route: '/autos-vehicles', name: 'Cars & Vehicles' }
  },
  '/cars/repo': {
    title: 'Car Repo & Repossession',
    description: 'Vehicle repossession videos',
    icon: Car,
    parent: { route: '/autos-vehicles', name: 'Cars & Vehicles' }
  },
  '/cars/drifting': {
    title: 'Drifting & Drivers',
    description: 'Car drifting and skilled drivers',
    icon: Car,
    parent: { route: '/autos-vehicles', name: 'Cars & Vehicles' }
  },
  '/cars/expensive': {
    title: 'Expensive & Rarest Cars',
    description: 'Luxury and rare automobiles',
    icon: Car,
    parent: { route: '/autos-vehicles', name: 'Cars & Vehicles' }
  },
  '/cars/future': {
    title: 'Future Vehicles',
    description: 'Concept and future vehicles',
    icon: Car,
    parent: { route: '/autos-vehicles', name: 'Cars & Vehicles' }
  },
  '/cars/sedans': {
    title: 'Sedans & Coupes',
    description: 'Sedan and coupe vehicles',
    icon: Car,
    parent: { route: '/autos-vehicles', name: 'Cars & Vehicles' }
  },
  '/cars/strange': {
    title: 'Strange & Weird Cars',
    description: 'Unusual and strange vehicles',
    icon: Car,
    parent: { route: '/autos-vehicles', name: 'Cars & Vehicles' }
  },
  '/cars/supercars': {
    title: 'Supercars & Hypercars',
    description: 'High-performance supercars',
    icon: Car,
    parent: { route: '/autos-vehicles', name: 'Cars & Vehicles' }
  },
  '/cars/accidents': {
    title: 'Car Accidents & Idiots',
    description: 'Bad drivers and car accidents',
    icon: Car,
    parent: { route: '/autos-vehicles', name: 'Cars & Vehicles' }
  },
  '/cars/crashes': {
    title: 'Car Crashes',
    description: 'Car crash compilations',
    icon: Car,
    parent: { route: '/autos-vehicles', name: 'Cars & Vehicles' }
  },
  '/motorcycles/harley': {
    title: 'Harley Davidson',
    description: 'Harley Davidson motorcycles',
    icon: Bike,
    parent: { route: '/motorcycles', name: 'Motorcycles' }
  },
  '/motorcycles/offroad': {
    title: 'Off Road Bikes',
    description: 'Off-road motorcycles',
    icon: Bike,
    parent: { route: '/motorcycles', name: 'Motorcycles' }
  },
  '/motorcycles/sports': {
    title: 'Sports Bikes',
    description: 'Sport motorcycles',
    icon: Bike,
    parent: { route: '/motorcycles', name: 'Motorcycles' }
  },
  '/motorcycles/street': {
    title: 'Street Bikes',
    description: 'Street motorcycles',
    icon: Bike,
    parent: { route: '/motorcycles', name: 'Motorcycles' }
  },
  '/motorcycles/fails': {
    title: 'Motorcycle Tricks & Fails',
    description: 'Motorcycle stunts and fails',
    icon: Bike,
    parent: { route: '/motorcycles', name: 'Motorcycles' }
  },
  '/trucks/pickups': {
    title: 'Pickups & Vans',
    description: 'Pickup trucks and vans',
    icon: Truck,
    parent: { route: '/trucks', name: 'Trucks' }
  },
  '/trucks/semi': {
    title: 'Semi Trucks',
    description: 'Semi trucks and big rigs',
    icon: Truck,
    parent: { route: '/trucks', name: 'Trucks' }
  },
  '/trucks/heavy': {
    title: 'Heavy Equipment',
    description: 'Heavy trucks and equipment',
    icon: Truck,
    parent: { route: '/trucks', name: 'Trucks' }
  },
  '/trains/commercial': {
    title: 'Commercial Trains',
    description: 'Commercial and freight trains',
    icon: Train,
    parent: { route: '/trains', name: 'Trains' }
  },
  '/trains/passenger': {
    title: 'Passenger Trains',
    description: 'Passenger rail services',
    icon: Train,
    parent: { route: '/trains', name: 'Trains' }
  },
  '/trains/crashes': {
    title: 'Train Crashes & Accidents',
    description: 'Train accidents and crashes',
    icon: Train,
    parent: { route: '/trains', name: 'Trains' }
  },
  '/trains/riders': {
    title: 'Train Riders & Hobos',
    description: 'Train hopping and riders',
    icon: Train,
    parent: { route: '/trains', name: 'Trains' }
  },
  '/drones/civilian': {
    title: 'Civilian & Recreational Drones',
    description: 'Consumer and hobby drones',
    icon: Plane,
    parent: { route: '/drones', name: 'Drones' }
  },
  '/drones/commercial': {
    title: 'Commercial Drones',
    description: 'Commercial drone services',
    icon: Plane,
    parent: { route: '/drones', name: 'Drones' }
  },
  '/boats/icebreakers': {
    title: 'Ship Icebreakers',
    description: 'Icebreaker ships',
    icon: Ship,
    parent: { route: '/boats', name: 'Boats & Ships' }
  },
  '/boats/cruise': {
    title: 'Cruise Ships',
    description: 'Cruise liners and ships',
    icon: Ship,
    parent: { route: '/boats', name: 'Boats & Ships' }
  },
  '/boats/submarines': {
    title: 'Civilian Submarines',
    description: 'Civilian submarine vessels',
    icon: Ship,
    parent: { route: '/boats', name: 'Boats & Ships' }
  },
  '/boats/tugboats': {
    title: 'Tugboats',
    description: 'Tugboats and harbor vessels',
    icon: Ship,
    parent: { route: '/boats', name: 'Boats & Ships' }
  },
  '/boats/yachts': {
    title: 'Yachts & Luxury Yachts',
    description: 'Luxury yachts and boats',
    icon: Ship,
    parent: { route: '/boats', name: 'Boats & Ships' }
  },
  '/boats/sailing': {
    title: 'Sailing Ships',
    description: 'Sailing vessels and ships',
    icon: Ship,
    parent: { route: '/boats', name: 'Boats & Ships' }
  },
  '/boats/container': {
    title: 'Container Ships & Oil Tankers',
    description: 'Cargo ships and tankers',
    icon: Ship,
    parent: { route: '/boats', name: 'Boats & Ships' }
  },
  '/boats/jetski': {
    title: 'Jet Skis & Personal Watercraft',
    description: 'Jet skis and watercraft',
    icon: Ship,
    parent: { route: '/boats', name: 'Boats & Ships' }
  },

  // ============ ANIMALS & NATURE ============
  '/pets-animals/jellyfish': {
    title: 'Man of War & Siphonophores',
    description: 'Jellyfish and siphonophores',
    icon: Dog,
    parent: { route: '/pets-animals', name: 'Pets & Animals' }
  },
  '/plants/herbs': {
    title: 'Herbs & Flowers',
    description: 'Herbs, flowers and plants',
    icon: Leaf,
    parent: { route: '/plants', name: 'Plants' }
  },
  '/plants/vegetables': {
    title: 'Vegetables',
    description: 'Vegetable gardening',
    icon: Leaf,
    parent: { route: '/plants', name: 'Plants' }
  },
  '/fungi/killer': {
    title: 'Killer Fungi',
    description: 'Dangerous fungi and mushrooms',
    icon: TreeDeciduous,
    parent: { route: '/fungi', name: 'Fungi' }
  },
  '/fungi/edible': {
    title: 'Edible Mushrooms',
    description: 'Edible mushrooms and fungi',
    icon: TreeDeciduous,
    parent: { route: '/fungi', name: 'Fungi' }
  },
  '/waters/lakes': {
    title: 'Lakes',
    description: 'Lakes around the world',
    icon: Droplets,
    parent: { route: '/waters', name: 'Lakes & Rivers' }
  },
  '/waters/rivers': {
    title: 'Rivers',
    description: 'Rivers and waterways',
    icon: Droplets,
    parent: { route: '/waters', name: 'Lakes & Rivers' }
  },
  '/waters/seas': {
    title: 'Seas',
    description: 'Seas and coastal waters',
    icon: Droplets,
    parent: { route: '/waters', name: 'Lakes & Rivers' }
  },

  // ============ CRIME & JUSTICE ============
  '/courts/indictment': {
    title: 'Indictment & Charges',
    description: 'Criminal indictments and charges',
    icon: Gavel,
    parent: { route: '/courts', name: 'Courts' }
  },
  '/courts/sentencing': {
    title: 'Sentencing & Judgement',
    description: 'Court sentencing and judgements',
    icon: Gavel,
    parent: { route: '/courts', name: 'Courts' }
  },
  '/courts/supreme': {
    title: 'Supreme Courts & District',
    description: 'Supreme and district courts',
    icon: Gavel,
    parent: { route: '/courts', name: 'Courts' }
  },
  '/courts/crime': {
    title: 'Courts & Police Crime',
    description: 'Court cases and police crime',
    icon: Gavel,
    parent: { route: '/courts', name: 'Courts' }
  },
  '/crime/fraud': {
    title: 'Fraud & Scammers',
    description: 'Fraud, scams and swindlers',
    icon: AlertTriangle,
    parent: { route: '/crime', name: 'Crime' }
  },
  '/crime/works': {
    title: 'How Crime Works',
    description: 'Understanding criminal operations',
    icon: AlertTriangle,
    parent: { route: '/crime', name: 'Crime' }
  },
  '/crime/enterprises': {
    title: 'Criminal Enterprises',
    description: 'Organized crime operations',
    icon: AlertTriangle,
    parent: { route: '/crime', name: 'Crime' }
  },
  '/crime/shootouts': {
    title: 'Shoot-outs',
    description: 'Crime shootouts and gun violence',
    icon: AlertTriangle,
    parent: { route: '/crime', name: 'Crime' }
  },
  '/crime/gangs': {
    title: 'Gangs',
    description: 'Gang activity and crime',
    icon: AlertTriangle,
    parent: { route: '/crime', name: 'Crime' }
  },
  '/crime/gangsters': {
    title: 'Gangsters',
    description: 'Famous gangsters and criminals',
    icon: AlertTriangle,
    parent: { route: '/crime', name: 'Crime' }
  },
  '/people/kindness': {
    title: 'Kindness',
    description: 'Acts of kindness and compassion',
    icon: HeartHandshake,
    parent: { route: '/people', name: 'People' }
  },
  '/people/giving': {
    title: 'Giving',
    description: 'Generous giving and charity',
    icon: HeartHandshake,
    parent: { route: '/people', name: 'People' }
  },
  '/people/help': {
    title: 'Help',
    description: 'People helping others',
    icon: HeartHandshake,
    parent: { route: '/people', name: 'People' }
  },
  '/real-estate/mistakes': {
    title: 'Real Estate Mistakes',
    description: 'Real estate mistakes and lessons',
    icon: Building2,
    parent: { route: '/real-estate', name: 'Real Estate' }
  },
  '/real-estate/fails': {
    title: 'Real Estate Fails',
    description: 'Real estate fails and blunders',
    icon: Building2,
    parent: { route: '/real-estate', name: 'Real Estate' }
  },
  '/police/chases': {
    title: 'Police Chases',
    description: 'High-speed police pursuits',
    icon: Shield,
    parent: { route: '/police', name: 'Police' }
  },
  '/police/sheriff': {
    title: 'Sheriff & Highway Patrol',
    description: 'Sheriff and highway patrol',
    icon: Shield,
    parent: { route: '/police', name: 'Police' }
  },
  '/police/stops': {
    title: 'Police Stops (What to Do)',
    description: 'How to handle police stops',
    icon: Shield,
    parent: { route: '/police', name: 'Police' }
  },
  '/jails/county': {
    title: 'County Jails',
    description: 'County jail information',
    icon: Lock,
    parent: { route: '/jails', name: 'Jails & Prisons' }
  },
  '/jails/prisons': {
    title: 'Prisons',
    description: 'Prison documentaries and info',
    icon: Lock,
    parent: { route: '/jails', name: 'Jails & Prisons' }
  },
  '/attorney/info': {
    title: 'Legal Information',
    description: 'Legal advice and information',
    icon: Scale,
    parent: { route: '/attorney', name: 'Attorney & Legal' }
  },
  '/attorney/stats': {
    title: 'Legal Statistics',
    description: 'Legal statistics and data',
    icon: Scale,
    parent: { route: '/attorney', name: 'Attorney & Legal' }
  },
  '/drugs/money': {
    title: 'Drugs, Money & Dealers',
    description: 'Drug trade and dealers',
    icon: Siren,
    parent: { route: '/drugs', name: 'Drugs' }
  },
  '/drugs/documentary': {
    title: 'Drug Documentaries',
    description: 'Documentaries about drugs',
    icon: Siren,
    parent: { route: '/drugs', name: 'Drugs' }
  },

  // ============ BUSINESS & FINANCE ============
  '/business/crypto': {
    title: 'Bitcoins & Cryptocurrency',
    description: 'Cryptocurrency and blockchain',
    icon: Briefcase,
    parent: { route: '/business', name: 'Business' }
  },
  '/business/developments': {
    title: 'Developments & Economy',
    description: 'Business developments and economy',
    icon: Briefcase,
    parent: { route: '/business', name: 'Business' }
  },
  '/business/leaders': {
    title: 'Leaders & Advice',
    description: 'Business leaders and advice',
    icon: Briefcase,
    parent: { route: '/business', name: 'Business' }
  },
  '/business/money': {
    title: 'Money, Taxes & Interest',
    description: 'Money management and taxes',
    icon: Briefcase,
    parent: { route: '/business', name: 'Business' }
  },
  '/business/services': {
    title: 'Services & Drones',
    description: 'Business services',
    icon: Briefcase,
    parent: { route: '/business', name: 'Business' }
  },
  '/business/farming': {
    title: 'Farmers & Farming',
    description: 'Farming and agriculture business',
    icon: Tractor,
    parent: { route: '/business', name: 'Business' }
  },
  '/stocks/commodity': {
    title: 'Commodity Trading',
    description: 'Commodity markets and trading',
    icon: TrendingUp,
    parent: { route: '/stocks', name: 'Stocks & Money' }
  },
  '/stocks/cash': {
    title: 'Money & Cash Currency',
    description: 'Currency and cash markets',
    icon: TrendingUp,
    parent: { route: '/stocks', name: 'Stocks & Money' }
  },
  '/real-estate/land': {
    title: 'Property & Land',
    description: 'Land and property sales',
    icon: Building2,
    parent: { route: '/real-estate', name: 'Real Estate' }
  },
  '/advertising/tips': {
    title: 'Advertising Tips',
    description: 'Advertising strategies and tips',
    icon: DollarSign,
    parent: { route: '/advertising', name: 'Advertising' }
  },
  '/advertising/campaigns': {
    title: 'Ad Campaigns',
    description: 'Advertising campaigns',
    icon: DollarSign,
    parent: { route: '/advertising', name: 'Advertising' }
  },
  '/food-products/business': {
    title: 'Food Business & Creation',
    description: 'Food product businesses',
    icon: Tractor,
    parent: { route: '/food-products', name: 'Food Products' }
  },

  // ============ LIFESTYLE & RELATIONSHIPS ============
  '/relationships/love': {
    title: 'Love',
    description: 'Love and romance',
    icon: Heart,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  '/relationships/attraction': {
    title: 'Attraction & Flirting',
    description: 'Dating attraction and flirting',
    icon: Heart,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  '/relationships/single': {
    title: 'Dating & Single',
    description: 'Single life and dating',
    icon: Heart,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  '/relationships/intimacy': {
    title: 'Intimacy',
    description: 'Relationship intimacy',
    icon: Heart,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  '/babies/funny': {
    title: 'Babies Funny & Comedy',
    description: 'Funny baby videos',
    icon: Baby,
    parent: { route: '/babies', name: 'Babies & Infants' }
  },
  '/babies/fails': {
    title: 'Baby Fails',
    description: 'Baby fail compilations',
    icon: Baby,
    parent: { route: '/babies', name: 'Babies & Infants' }
  },
  '/cosmetics/eyelashes': {
    title: 'Eyelashes & Eyeshadow',
    description: 'Eye makeup tutorials',
    icon: Sparkles,
    parent: { route: '/cosmetics', name: 'Cosmetics' }
  },
  '/cosmetics/foundation': {
    title: 'Foundation & Powder',
    description: 'Foundation makeup tutorials',
    icon: Sparkles,
    parent: { route: '/cosmetics', name: 'Cosmetics' }
  },
  '/cosmetics/lipstick': {
    title: 'Lipstick & Makeup',
    description: 'Lip makeup tutorials',
    icon: Sparkles,
    parent: { route: '/cosmetics', name: 'Cosmetics' }
  },
  '/hair/cuts': {
    title: 'Hair Cuts (Men & Women)',
    description: 'Haircut styles and tutorials',
    icon: Scissors,
    parent: { route: '/hair', name: 'Hair' }
  },
  '/hair/extensions': {
    title: 'Hair Extensions',
    description: 'Hair extension tutorials',
    icon: Scissors,
    parent: { route: '/hair', name: 'Hair' }
  },
  '/hair/styles': {
    title: 'Hair Styles (Men & Women)',
    description: 'Hairstyle tutorials',
    icon: Scissors,
    parent: { route: '/hair', name: 'Hair' }
  },
  '/ideology/beliefs': {
    title: 'Beliefs & Values',
    description: 'Ideologies and belief systems',
    icon: BadgeCheck,
    parent: { route: '/ideology', name: 'Ideology & Lifestyles' }
  },

  // ============ FOOD & DRINKS ============
  '/foods/tuna': {
    title: 'Blue Tuna & Cutting',
    description: 'Tuna preparation and cutting',
    icon: Pizza,
    parent: { route: '/foods', name: 'Foods' }
  },
  '/foods/seafood': {
    title: 'Crab & Shrimp',
    description: 'Seafood preparation',
    icon: Pizza,
    parent: { route: '/foods', name: 'Foods' }
  },
  '/foods/dieting': {
    title: 'Dieting & Weight Loss',
    description: 'Diet foods and weight loss',
    icon: Pizza,
    parent: { route: '/foods', name: 'Foods' }
  },
  '/foods/fruits': {
    title: 'Fruits & Vegetables',
    description: 'Fresh fruits and vegetables',
    icon: Pizza,
    parent: { route: '/foods', name: 'Foods' }
  },
  '/foods/weight-gain': {
    title: 'Gain Weight',
    description: 'Foods for weight gain',
    icon: Pizza,
    parent: { route: '/foods', name: 'Foods' }
  },
  '/foods/sweets': {
    title: 'Sweets & Cakes',
    description: 'Desserts and sweet treats',
    icon: Pizza,
    parent: { route: '/foods', name: 'Foods' }
  },
  '/foods/harvest': {
    title: 'Harvest Foods',
    description: 'Harvest and seasonal foods',
    icon: Pizza,
    parent: { route: '/foods', name: 'Foods' }
  },
  '/foods/healthy': {
    title: 'Healthy Cooking',
    description: 'Healthy food preparation',
    icon: Pizza,
    parent: { route: '/foods', name: 'Foods' }
  },
  '/drinks/alcohol': {
    title: 'Alcohol',
    description: 'Alcoholic beverages',
    icon: Wine,
    parent: { route: '/drinks', name: 'Drinks' }
  },
  '/drinks/non-alcohol': {
    title: 'Non-Alcohol',
    description: 'Non-alcoholic beverages',
    icon: Wine,
    parent: { route: '/drinks', name: 'Drinks' }
  },

  // ============ KIDS ============
  '/kids/beauty': {
    title: 'Kids Beauty & Cosmetics',
    description: 'Kids beauty and health',
    icon: Baby,
    parent: { route: '/kids', name: 'Kids' }
  },
  '/kids/cartoons': {
    title: 'Cartoons & Comedy',
    description: 'Kids cartoons and comedy',
    icon: Baby,
    parent: { route: '/kids', name: 'Kids' }
  },
  '/kids/education': {
    title: 'Kids Education',
    description: 'Educational content for kids',
    icon: GraduationCap,
    parent: { route: '/kids', name: 'Kids' }
  },
  '/kids/funny': {
    title: 'Kids Funny & Comedy & Fails',
    description: 'Funny kids videos',
    icon: Baby,
    parent: { route: '/kids', name: 'Kids' }
  },
  '/kids/oceanography': {
    title: 'Oceanography & Ocean Science',
    description: 'Ocean science for kids',
    icon: Baby,
    parent: { route: '/kids', name: 'Kids' }
  },
  '/kids/fish': {
    title: 'Kids Animals & Fish',
    description: 'Animal videos for kids',
    icon: Baby,
    parent: { route: '/kids', name: 'Kids' }
  },
  '/kids/animation': {
    title: 'Animation Film & Superhero',
    description: 'Animated superhero content',
    icon: Film,
    parent: { route: '/kids', name: 'Kids' }
  },
  '/kids-education/alphabets': {
    title: 'Alphabets & Letters',
    description: 'Learning alphabets',
    icon: GraduationCap,
    parent: { route: '/kids-education', name: 'Kids Education' }
  },
  '/kids-education/animals': {
    title: 'Animals',
    description: 'Learning about animals',
    icon: GraduationCap,
    parent: { route: '/kids-education', name: 'Kids Education' }
  },
  '/kids-education/colors': {
    title: 'Colors & Shapes',
    description: 'Learning colors and shapes',
    icon: GraduationCap,
    parent: { route: '/kids-education', name: 'Kids Education' }
  },
  '/kids-education/foods': {
    title: 'Foods & Fruits',
    description: 'Learning about foods',
    icon: GraduationCap,
    parent: { route: '/kids-education', name: 'Kids Education' }
  },
  '/kids-education/math': {
    title: 'Math & Counting',
    description: 'Learning math and counting',
    icon: GraduationCap,
    parent: { route: '/kids-education', name: 'Kids Education' }
  },
  '/kids-education/reading': {
    title: 'Reading & Language',
    description: 'Learning reading and language',
    icon: GraduationCap,
    parent: { route: '/kids-education', name: 'Kids Education' }
  },
  '/kids-content/film': {
    title: 'Kids Film (Comedy, Adventure)',
    description: 'Kids movies and films',
    icon: Film,
    parent: { route: '/kids-content', name: 'Kids Content' }
  },
  '/kids-content/games': {
    title: 'Kids Games',
    description: 'Games for children',
    icon: Gamepad2,
    parent: { route: '/kids-content', name: 'Kids Content' }
  },
  '/kids-content/music': {
    title: 'Kids Music & Nursery Rhymes',
    description: 'Music and songs for kids',
    icon: Music,
    parent: { route: '/kids-content', name: 'Kids Content' }
  },
  '/kids-content/videos': {
    title: 'Kids Videos (Toys, Games)',
    description: 'Toy and game videos for kids',
    icon: Film,
    parent: { route: '/kids-content', name: 'Kids Content' }
  },

  // ============ HISTORY & ARTIFACTS ============
  '/history/american': {
    title: 'American History',
    description: 'History of America',
    icon: BookOpen,
    parent: { route: '/history', name: 'History' }
  },
  '/history/world': {
    title: 'World History',
    description: 'World historical events',
    icon: BookOpen,
    parent: { route: '/history', name: 'History' }
  },
  '/history/biblical': {
    title: 'Biblical History',
    description: 'Biblical historical events',
    icon: BookOpen,
    parent: { route: '/history', name: 'History' }
  },
  '/artifacts/antique': {
    title: 'Antiques & Antiquities',
    description: 'Antique collectibles',
    icon: Amphora,
    parent: { route: '/artifacts', name: 'Artifacts & Antiques' }
  },
  '/artifacts/collectibles': {
    title: 'Collectibles',
    description: 'Collectible items',
    icon: Amphora,
    parent: { route: '/artifacts', name: 'Artifacts & Antiques' }
  },
  '/bible/quotes': {
    title: 'Bible Quotes & Scriptures',
    description: 'Biblical quotes and scriptures',
    icon: Church,
    parent: { route: '/bible', name: 'Bible & Religion' }
  },
  '/bible/history': {
    title: 'Biblical History',
    description: 'History from the Bible',
    icon: Church,
    parent: { route: '/bible', name: 'Bible & Religion' }
  },
  '/colosseum/rome': {
    title: 'Rome Arena & Stadium',
    description: 'Roman Colosseum and arenas',
    icon: Landmark,
    parent: { route: '/colosseum', name: 'Colosseum & Arenas' }
  },
  '/statues/sculpture': {
    title: 'Sculpture & Effigy',
    description: 'Sculptures and effigies',
    icon: Crown,
    parent: { route: '/statues', name: 'Statues & Sculpture' }
  },
  '/statues/stone': {
    title: 'Stone Carvers',
    description: 'Stone carving artistry',
    icon: Crown,
    parent: { route: '/statues', name: 'Statues & Sculpture' }
  },

  // ============ GOVERNMENT & POLITICS ============
  '/news/shows': {
    title: 'News Shows (60 Minutes)',
    description: 'Television news programs',
    icon: Newspaper,
    parent: { route: '/news', name: 'News & Politics' }
  },
  '/news/podcasts': {
    title: 'News & Politics Podcasts',
    description: 'Political podcasts',
    icon: Newspaper,
    parent: { route: '/news', name: 'News & Politics' }
  },
  '/presidents/motorcade': {
    title: 'Presidential Motorcade',
    description: 'Presidential motorcade footage',
    icon: Flag,
    parent: { route: '/presidents', name: 'Presidents' }
  },
  '/presidents/airforce': {
    title: 'Air Force One & Marine One',
    description: 'Presidential aircraft',
    icon: Flag,
    parent: { route: '/presidents', name: 'Presidents' }
  },
  '/presidents/former': {
    title: 'Former Presidents',
    description: 'Past presidents of the USA',
    icon: Flag,
    parent: { route: '/presidents', name: 'Presidents' }
  },
  '/senate/house': {
    title: 'House of Representatives',
    description: 'US House of Representatives',
    icon: Landmark,
    parent: { route: '/senate', name: 'Senate & House' }
  },
  '/senate/sessions': {
    title: 'Senate Sessions',
    description: 'Senate proceedings',
    icon: Landmark,
    parent: { route: '/senate', name: 'Senate & House' }
  },
  '/protesters/demonstrators': {
    title: 'Demonstrators',
    description: 'Protest demonstrations',
    icon: Megaphone,
    parent: { route: '/protesters', name: 'Protesters' }
  },
  '/protesters/rallies': {
    title: 'Rallies & Marches',
    description: 'Political rallies and marches',
    icon: Megaphone,
    parent: { route: '/protesters', name: 'Protesters' }
  },
  '/speeches/arguments': {
    title: 'Arguments & Disagreements',
    description: 'Debates and arguments',
    icon: Mic,
    parent: { route: '/speeches', name: 'Speeches' }
  },
  '/speeches/commencement': {
    title: 'Commencement Speeches',
    description: 'Graduation speeches',
    icon: Mic,
    parent: { route: '/speeches', name: 'Speeches' }
  },
  '/speeches/eulogy': {
    title: 'Eulogy & Memorial',
    description: 'Memorial and eulogy speeches',
    icon: Mic,
    parent: { route: '/speeches', name: 'Speeches' }
  },
  '/speeches/informative': {
    title: 'Informative Speeches',
    description: 'Educational speeches',
    icon: Mic,
    parent: { route: '/speeches', name: 'Speeches' }
  },
  '/speeches/motivational': {
    title: 'Motivational Speeches',
    description: 'Inspiring speeches',
    icon: Mic,
    parent: { route: '/speeches', name: 'Speeches' }
  },
  '/speeches/persuasive': {
    title: 'Persuasive & Protest',
    description: 'Persuasive speeches',
    icon: Mic,
    parent: { route: '/speeches', name: 'Speeches' }
  },
  '/speeches/motivation': {
    title: 'Self-Empowerment',
    description: 'Self-empowerment speeches',
    icon: Mic,
    parent: { route: '/speeches', name: 'Speeches' }
  },
  '/journalist/correspondent': {
    title: 'Correspondents & Reporters',
    description: 'News correspondents',
    icon: Radio,
    parent: { route: '/journalist', name: 'Journalist' }
  },

  // ============ SPORTS EXTENDED ============
  '/sports/nba/east-playoffs': {
    title: 'NBA East Playoffs',
    description: 'Eastern Conference playoffs',
    icon: Trophy,
    parent: { route: '/sports/nba', name: 'NBA Basketball' }
  },
  '/sports/nba/west-playoffs': {
    title: 'NBA West Playoffs',
    description: 'Western Conference playoffs',
    icon: Trophy,
    parent: { route: '/sports/nba', name: 'NBA Basketball' }
  },
  '/sports/nba/players': {
    title: 'NBA Players & Coaches',
    description: 'NBA players and coaching',
    icon: Trophy,
    parent: { route: '/sports/nba', name: 'NBA Basketball' }
  },
  '/sports/nfl/superbowl': {
    title: 'Super Bowl',
    description: 'NFL Super Bowl',
    icon: Trophy,
    parent: { route: '/sports/nfl', name: 'NFL Football' }
  },
  '/sports/nfl/players': {
    title: 'NFL Players & Coaches',
    description: 'NFL players and coaching',
    icon: Trophy,
    parent: { route: '/sports/nfl', name: 'NFL Football' }
  },
  '/sports/mlb/al-playoffs': {
    title: 'MLB AL Playoffs',
    description: 'American League playoffs',
    icon: Trophy,
    parent: { route: '/sports/mlb', name: 'MLB Baseball' }
  },
  '/sports/mlb/nl-playoffs': {
    title: 'MLB NL Playoffs',
    description: 'National League playoffs',
    icon: Trophy,
    parent: { route: '/sports/mlb', name: 'MLB Baseball' }
  },
  '/sports/mlb/world-series': {
    title: 'World Series',
    description: 'MLB World Series',
    icon: Trophy,
    parent: { route: '/sports/mlb', name: 'MLB Baseball' }
  },
  '/sports/mlb/players': {
    title: 'MLB Players & Coaches',
    description: 'MLB players and coaching',
    icon: Trophy,
    parent: { route: '/sports/mlb', name: 'MLB Baseball' }
  },
  '/sports/nhl/allstar': {
    title: 'NHL All-Star',
    description: 'NHL All-Star game',
    icon: Trophy,
    parent: { route: '/sports/nhl', name: 'NHL Hockey' }
  },
  '/sports/nhl/east': {
    title: 'All-Star East Team',
    description: 'Eastern All-Star team',
    icon: Trophy,
    parent: { route: '/sports/nhl', name: 'NHL Hockey' }
  },
  '/sports/nhl/west': {
    title: 'All-Star West Team',
    description: 'Western All-Star team',
    icon: Trophy,
    parent: { route: '/sports/nhl', name: 'NHL Hockey' }
  },
  '/sports/nhl/playoffs': {
    title: 'NHL Playoffs',
    description: 'NHL playoff games',
    icon: Trophy,
    parent: { route: '/sports/nhl', name: 'NHL Hockey' }
  },
  '/sports/nhl/players': {
    title: 'NHL Players & Coaches',
    description: 'NHL players and coaching',
    icon: Trophy,
    parent: { route: '/sports/nhl', name: 'NHL Hockey' }
  },
  '/sports/wnba/players': {
    title: 'WNBA Players & Coaches',
    description: 'WNBA players and coaching',
    icon: Trophy,
    parent: { route: '/sports/wnba', name: 'WNBA Basketball' }
  },
  '/sports/wnba/playoffs': {
    title: 'WNBA Playoffs',
    description: 'WNBA playoff games',
    icon: Trophy,
    parent: { route: '/sports/wnba', name: 'WNBA Basketball' }
  },
  '/sports/wnba/championship': {
    title: 'WNBA Championship',
    description: 'WNBA championship games',
    icon: Trophy,
    parent: { route: '/sports/wnba', name: 'WNBA Basketball' }
  },
  '/sports/college/football': {
    title: 'College Football',
    description: 'NCAA football',
    icon: Medal,
    parent: { route: '/sports/college', name: 'College Sports' }
  },
  '/sports/college/basketball': {
    title: 'College Basketball',
    description: 'NCAA basketball',
    icon: Medal,
    parent: { route: '/sports/college', name: 'College Sports' }
  },
  '/sports/college/baseball': {
    title: 'College Baseball',
    description: 'NCAA baseball',
    icon: Medal,
    parent: { route: '/sports/college', name: 'College Sports' }
  },
  '/sports/college/women-basketball': {
    title: 'Women Basketball',
    description: 'NCAA women basketball',
    icon: Medal,
    parent: { route: '/sports/college', name: 'College Sports' }
  },
  '/sports/college/swimming': {
    title: 'Swimming & Hockey',
    description: 'College swimming and hockey',
    icon: Medal,
    parent: { route: '/sports/college', name: 'College Sports' }
  },
  '/sports/college/track': {
    title: 'Track & Field',
    description: 'College track and field',
    icon: Medal,
    parent: { route: '/sports/college', name: 'College Sports' }
  },
  '/sports/college/bowl': {
    title: 'Football Bowl Games',
    description: 'College bowl games',
    icon: Medal,
    parent: { route: '/sports/college', name: 'College Sports' }
  },
  '/sports/mma/ufc': {
    title: 'UFC Fighting',
    description: 'Ultimate Fighting Championship',
    icon: Dumbbell,
    parent: { route: '/sports/mma', name: 'MMA & Fighting' }
  },
  '/sports/mma/women': {
    title: 'Women MMA & UFC',
    description: 'Women mixed martial arts',
    icon: Dumbbell,
    parent: { route: '/sports/mma', name: 'MMA & Fighting' }
  },
  '/sports/boxing/interviews': {
    title: 'Boxing Interviews',
    description: 'Boxer interviews',
    icon: Dumbbell,
    parent: { route: '/sports/mma', name: 'MMA & Fighting' }
  },
  '/sports/kickboxing': {
    title: 'Kickboxing',
    description: 'Kickboxing fights',
    icon: Dumbbell,
    parent: { route: '/sports/mma', name: 'MMA & Fighting' }
  },
  '/sports/wrestling': {
    title: 'WWE Wrestling',
    description: 'Professional wrestling',
    icon: Dumbbell,
    parent: { route: '/sports/mma', name: 'MMA & Fighting' }
  },
  '/sports/formula-one': {
    title: 'Formula One (F1)',
    description: 'Formula 1 racing',
    icon: Timer,
    parent: { route: '/sports/racing', name: 'Racing Sports' }
  },
  '/sports/nhra': {
    title: 'NHRA Drag Racing',
    description: 'NHRA drag racing',
    icon: Timer,
    parent: { route: '/sports/racing', name: 'Racing Sports' }
  },
  '/sports/racing-track': {
    title: 'Racing Track Accidents',
    description: 'Racing track crashes',
    icon: Timer,
    parent: { route: '/sports/racing', name: 'Racing Sports' }
  },
  '/sports/mls': {
    title: 'MLS, FIFA, USL, WSL',
    description: 'Professional soccer leagues',
    icon: Trophy,
    parent: { route: '/sports/soccer', name: 'Soccer & Football' }
  },
  '/sports/rugby': {
    title: 'Rugby, Cricket, Lacrosse',
    description: 'Rugby and cricket sports',
    icon: Trophy,
    parent: { route: '/sports/soccer', name: 'Soccer & Football' }
  },
  '/sports/tennis/men': {
    title: 'Tennis Men',
    description: 'Mens professional tennis',
    icon: Target,
    parent: { route: '/sports/tennis', name: 'Tennis' }
  },
  '/sports/tennis/women': {
    title: 'Tennis Women',
    description: 'Womens professional tennis',
    icon: Target,
    parent: { route: '/sports/tennis', name: 'Tennis' }
  },
  '/sports/tennis/men-finals': {
    title: 'Men Final Championship',
    description: 'Mens tennis finals',
    icon: Target,
    parent: { route: '/sports/tennis', name: 'Tennis' }
  },
  '/sports/tennis/women-finals': {
    title: 'Women Final Championship',
    description: 'Womens tennis finals',
    icon: Target,
    parent: { route: '/sports/tennis', name: 'Tennis' }
  },
  '/sports/pga': {
    title: 'PGA Golf Players',
    description: 'Professional golf',
    icon: Target,
    parent: { route: '/sports/golf', name: 'Golf' }
  },
  '/sports/ryder-cup': {
    title: 'Ryder Cup',
    description: 'Ryder Cup golf',
    icon: Target,
    parent: { route: '/sports/golf', name: 'Golf' }
  },
  '/sports/olympics/track': {
    title: 'Olympics Track & Field',
    description: 'Olympic track events',
    icon: Medal,
    parent: { route: '/sports/olympics', name: 'Olympics' }
  },
  '/sports/track-field': {
    title: 'Track & Field (Highlights)',
    description: 'Track and field highlights',
    icon: Medal,
    parent: { route: '/sports/olympics', name: 'Olympics' }
  },
  '/sports/volleyball/amateur': {
    title: 'Amateur Volleyball',
    description: 'Amateur volleyball',
    icon: Trophy,
    parent: { route: '/sports/volleyball', name: 'Volleyball' }
  },
  '/sports/volleyball/beach': {
    title: 'Beach Volleyball',
    description: 'Beach volleyball',
    icon: Trophy,
    parent: { route: '/sports/volleyball', name: 'Volleyball' }
  },
  '/sports/volleyball/pro': {
    title: 'Professional Volleyball',
    description: 'Professional volleyball',
    icon: Trophy,
    parent: { route: '/sports/volleyball', name: 'Volleyball' }
  },
  '/sports/volleyball/tournament': {
    title: 'Volleyball Tournament',
    description: 'Volleyball tournaments',
    icon: Trophy,
    parent: { route: '/sports/volleyball', name: 'Volleyball' }
  },
  '/sports/surfing': {
    title: 'Surfing & Kayaking',
    description: 'Water sports surfing',
    icon: Waves,
    parent: { route: '/sports/water', name: 'Water Sports' }
  },
  '/sports/diving': {
    title: 'Diving',
    description: 'Competitive diving',
    icon: Waves,
    parent: { route: '/sports/water', name: 'Water Sports' }
  },
  '/sports/fishing': {
    title: 'Fishing',
    description: 'Sport fishing',
    icon: Trophy,
    parent: { route: '/sports/other', name: 'Other Sports' }
  },
  '/sports/cycling': {
    title: 'Road & Mountain Biking',
    description: 'Cycling sports',
    icon: Trophy,
    parent: { route: '/sports/other', name: 'Other Sports' }
  },
  '/sports/horses': {
    title: 'Horses & Equestrian',
    description: 'Equestrian sports',
    icon: Trophy,
    parent: { route: '/sports/other', name: 'Other Sports' }
  },
  '/sports/arenas': {
    title: 'Arenas & Stadiums',
    description: 'Sports venues',
    icon: Trophy,
    parent: { route: '/sports/other', name: 'Other Sports' }
  },
  '/sports/comedy': {
    title: 'Sports Comedy & Bloopers',
    description: 'Funny sports moments',
    icon: Trophy,
    parent: { route: '/sports/other', name: 'Other Sports' }
  },
  '/sports/interviews': {
    title: 'Sports Interviews',
    description: 'Athlete interviews',
    icon: Trophy,
    parent: { route: '/sports/other', name: 'Other Sports' }
  },
  '/sports/weightlifting': {
    title: 'Weightlifting Olympics',
    description: 'Olympic weightlifting',
    icon: Trophy,
    parent: { route: '/sports/other', name: 'Other Sports' }
  },
  '/sports/news': {
    title: 'Sports News & Podcasts',
    description: 'Sports news coverage',
    icon: Trophy,
    parent: { route: '/sports/other', name: 'Other Sports' }
  },
  '/sports/personalities': {
    title: 'Sports Personalities',
    description: 'Famous athletes',
    icon: Trophy,
    parent: { route: '/sports/other', name: 'Other Sports' }
  },
  '/sports/fans': {
    title: 'Fan Challenges',
    description: 'Sports fan challenges',
    icon: Trophy,
    parent: { route: '/sports/other', name: 'Other Sports' }
  },

  // ============ ENTERTAINMENT & MEDIA ============
  '/entertainment/oscars': {
    title: 'Oscars & Golden Globes',
    description: 'Award ceremonies',
    icon: Star,
    parent: { route: '/entertainment', name: 'Entertainment' }
  },
  '/entertainment/actors': {
    title: 'Actors & Actresses',
    description: 'Entertainment actors',
    icon: Star,
    parent: { route: '/entertainment', name: 'Entertainment' }
  },
  '/entertainment/late-night': {
    title: 'Late Night Shows',
    description: 'Late night television',
    icon: Star,
    parent: { route: '/entertainment', name: 'Entertainment' }
  },
  '/entertainment/podcast': {
    title: 'Film & Entertainment Podcasts',
    description: 'Entertainment podcasts',
    icon: Star,
    parent: { route: '/entertainment', name: 'Entertainment' }
  },
  '/entertainment/hollywood': {
    title: 'Hollywood & Celebrities',
    description: 'Hollywood entertainment',
    icon: Star,
    parent: { route: '/entertainment', name: 'Entertainment' }
  },
  '/film/romance': {
    title: 'Romance Films',
    description: 'Romantic movies',
    icon: Clapperboard,
    parent: { route: '/film-animation', name: 'Film' }
  },
  '/film/action-crime': {
    title: 'Action, Crime, Thriller',
    description: 'Action and crime films',
    icon: Clapperboard,
    parent: { route: '/film-animation', name: 'Film' }
  },
  '/film/adventure': {
    title: 'Adventure, Fantasy, Thriller',
    description: 'Adventure films',
    icon: Clapperboard,
    parent: { route: '/film-animation', name: 'Film' }
  },
  '/film/comedy-drama': {
    title: 'Comedy, Drama, Crime',
    description: 'Comedy drama films',
    icon: Clapperboard,
    parent: { route: '/film-animation', name: 'Film' }
  },
  '/film/comedy': {
    title: 'Comedy Films',
    description: 'Comedy movies',
    icon: Clapperboard,
    parent: { route: '/film-animation', name: 'Film' }
  },
  '/film/crime-drama': {
    title: 'Crime, Drama, Thriller',
    description: 'Crime drama films',
    icon: Clapperboard,
    parent: { route: '/film-animation', name: 'Film' }
  },
  '/film/documentary': {
    title: 'Documentary Films',
    description: 'Documentary movies',
    icon: Clapperboard,
    parent: { route: '/film-animation', name: 'Film' }
  },
  '/film/drama': {
    title: 'Drama Films',
    description: 'Drama movies',
    icon: Clapperboard,
    parent: { route: '/film-animation', name: 'Film' }
  },
  '/film/gangsters': {
    title: 'Gangsters, Crime, Drama',
    description: 'Gangster films',
    icon: Clapperboard,
    parent: { route: '/film-animation', name: 'Film' }
  },
  '/film/mystery': {
    title: 'Mystery & Fiction',
    description: 'Mystery films',
    icon: Clapperboard,
    parent: { route: '/film-animation', name: 'Film' }
  },
  '/film/scientific': {
    title: 'Scientific Films',
    description: 'Science fiction films',
    icon: Clapperboard,
    parent: { route: '/film-animation', name: 'Film' }
  },
  '/film/war': {
    title: 'War Films',
    description: 'Military and war movies',
    icon: Clapperboard,
    parent: { route: '/film-animation', name: 'Film' }
  },
  '/film/westerns': {
    title: 'Western Films',
    description: 'Western movies',
    icon: Clapperboard,
    parent: { route: '/film-animation', name: 'Film' }
  },
  '/film/clips': {
    title: 'Film Clips & Trailers',
    description: 'Movie clips and trailers',
    icon: Clapperboard,
    parent: { route: '/film-animation', name: 'Film' }
  },
  '/animation/action': {
    title: 'Action Animation',
    description: 'Action animated films',
    icon: Film,
    parent: { route: '/animation', name: 'Animation' }
  },
  '/animation/fantasy': {
    title: 'Fantasy & Dark Animation',
    description: 'Fantasy animated films',
    icon: Film,
    parent: { route: '/animation', name: 'Animation' }
  },
  '/animation/adventure': {
    title: 'Adventure Animation',
    description: 'Adventure animated films',
    icon: Film,
    parent: { route: '/animation', name: 'Animation' }
  },
  '/animation/cartoons': {
    title: 'Cartoons',
    description: 'Cartoon animations',
    icon: Film,
    parent: { route: '/animation', name: 'Animation' }
  },
  '/animation/comedy': {
    title: 'Comedy Animation',
    description: 'Comedy animated films',
    icon: Film,
    parent: { route: '/animation', name: 'Animation' }
  },
  '/animation/drama': {
    title: 'Drama Animation',
    description: 'Drama animated films',
    icon: Film,
    parent: { route: '/animation', name: 'Animation' }
  },
  '/animation/musical': {
    title: 'Musical Animation',
    description: 'Musical animated films',
    icon: Film,
    parent: { route: '/animation', name: 'Animation' }
  },
  '/animation/parody': {
    title: 'Parody Animation',
    description: 'Parody animated films',
    icon: Film,
    parent: { route: '/animation', name: 'Animation' }
  },
  '/animation/short': {
    title: 'Short Films',
    description: 'Short animated films',
    icon: Film,
    parent: { route: '/animation', name: 'Animation' }
  },
  '/tv-shows/news': {
    title: 'TV News Shows',
    description: 'Television news programs',
    icon: Tv,
    parent: { route: '/tv-shows', name: 'TV Shows' }
  },
  '/tv-shows/court': {
    title: 'Court TV',
    description: 'Court television shows',
    icon: Tv,
    parent: { route: '/tv-shows', name: 'TV Shows' }
  },
  '/tv-shows/talk': {
    title: 'Talk Shows (The View)',
    description: 'Talk show programs',
    icon: Tv,
    parent: { route: '/tv-shows', name: 'TV Shows' }
  },
  '/radio/music': {
    title: 'Music Radio',
    description: 'Radio music programs',
    icon: Radio,
    parent: { route: '/radio', name: 'Radio' }
  },
  '/radio/podcast': {
    title: 'Podcast Radio',
    description: 'Radio podcasts',
    icon: Radio,
    parent: { route: '/radio', name: 'Radio' }
  },
  '/radio/rc': {
    title: 'RC Cars & Airplanes',
    description: 'Radio controlled vehicles',
    icon: Radio,
    parent: { route: '/radio', name: 'Radio' }
  },

  // ============ COMEDY & FUNNY ============
  '/comedy/roasts': {
    title: 'Roasts, Jokes & Events',
    description: 'Comedy roasts and events',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/comedy/snl': {
    title: 'SNL (Saturday Night Live)',
    description: 'Saturday Night Live',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/comedy/sitcom': {
    title: 'Comedy Shows (Sitcom)',
    description: 'Sitcom comedy shows',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/comedy/jokes': {
    title: 'Comedy & Jokes',
    description: 'Jokes and comedy',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/comedians/interviews': {
    title: 'Comedian Interviews & Work',
    description: 'Comedian interviews',
    icon: Smile,
    parent: { route: '/comedians', name: 'Comedians' }
  },
  '/comedians/specials': {
    title: 'Comedy Specials',
    description: 'Stand-up comedy specials',
    icon: Smile,
    parent: { route: '/comedians', name: 'Comedians' }
  },
  '/funny/pranks': {
    title: 'Funny Pranks (Work, Home)',
    description: 'Prank videos',
    icon: Laugh,
    parent: { route: '/funny', name: 'Funny' }
  },
  '/funny/shorts': {
    title: 'Funny Short Videos',
    description: 'Short funny clips',
    icon: Laugh,
    parent: { route: '/funny', name: 'Funny' }
  },
  '/funny/videos': {
    title: 'Funny Videos',
    description: 'Funny video compilations',
    icon: Laugh,
    parent: { route: '/funny', name: 'Funny' }
  },
  '/funny/weird': {
    title: 'Funny Weird (Wacky, Bizarre)',
    description: 'Weird and wacky videos',
    icon: Laugh,
    parent: { route: '/funny', name: 'Funny' }
  },
  '/bloopers/screwup': {
    title: 'Screwups & Blunders',
    description: 'Blooper compilations',
    icon: PartyPopper,
    parent: { route: '/bloopers', name: 'Bloopers' }
  },
  '/bloopers/fails': {
    title: 'Fails & Mistakes',
    description: 'Fail compilations',
    icon: PartyPopper,
    parent: { route: '/bloopers', name: 'Bloopers' }
  },
  '/fails/expensive': {
    title: 'Expensive Fails & Crashes',
    description: 'Expensive fail compilations',
    icon: Zap,
    parent: { route: '/fails', name: 'Fails' }
  },
  '/fails/people': {
    title: 'People Fails & Comedy',
    description: 'People failing videos',
    icon: Zap,
    parent: { route: '/fails', name: 'Fails' }
  },
  '/crazy/amazing': {
    title: 'Amazing Things',
    description: 'Amazing and crazy videos',
    icon: Zap,
    parent: { route: '/crazy', name: 'Crazy & Amazing' }
  },
  '/crazy/wouldnt-believe': {
    title: "Wouldn't Believe",
    description: 'Unbelievable videos',
    icon: Zap,
    parent: { route: '/crazy', name: 'Crazy & Amazing' }
  },

  // ============ MUSIC FULL ============
  '/music/rock': {
    title: 'Rock, Soul, Pop, R&B',
    description: 'Rock and soul music',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/alternative': {
    title: 'Alternative & Others',
    description: 'Alternative music genres',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/blues': {
    title: 'Blues',
    description: 'Blues music',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/christmas': {
    title: 'Christmas Jingles',
    description: 'Christmas music',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/classical': {
    title: 'Classical, Opera, Symphony',
    description: 'Classical music',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/funk': {
    title: 'Funk & Hard Rock',
    description: 'Funk and hard rock',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/hiphop': {
    title: 'Hip Hop, Rap, Funk',
    description: 'Hip hop music',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/heavy-metal': {
    title: 'Heavy Metal',
    description: 'Heavy metal music',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/rap': {
    title: 'Rap & Reggaeton',
    description: 'Rap and reggaeton',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/rnb': {
    title: 'R&B & Soul',
    description: 'R&B and soul music',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/relaxation': {
    title: 'Relaxation & Meditation',
    description: 'Relaxation music',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/salsa': {
    title: 'Salsa',
    description: 'Salsa music',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/soul-train': {
    title: 'Soul Train',
    description: 'Soul Train music',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/christian': {
    title: 'Christian (Pop, Rap, Rock)',
    description: 'Christian music',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/parody': {
    title: 'Parody & Satire',
    description: 'Music parodies',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/pop': {
    title: 'Pop & Soft Rock',
    description: 'Pop music',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/soundtracks': {
    title: 'Soundtracks & Movie Music',
    description: 'Movie soundtracks',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/history': {
    title: 'Music History',
    description: 'History of music',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/mandopop': {
    title: 'Mandopop (Mandarin)',
    description: 'Mandarin pop music',
    icon: Disc,
    parent: { route: '/music/international', name: 'International Music' }
  },
  '/music/mariachi': {
    title: 'Mariachi',
    description: 'Mexican mariachi music',
    icon: Disc,
    parent: { route: '/music/international', name: 'International Music' }
  },
  '/music/latin': {
    title: 'Latin Music',
    description: 'Latin music genres',
    icon: Disc,
    parent: { route: '/music/international', name: 'International Music' }
  },
  '/music/lyrics/mandopop': {
    title: 'Mandopop Lyrics',
    description: 'Mandarin song lyrics',
    icon: Headphones,
    parent: { route: '/music/lyrics', name: 'Music Lyrics' }
  },
  '/music/lyrics/spanish': {
    title: 'Spanish & Mexican Lyrics',
    description: 'Spanish song lyrics',
    icon: Headphones,
    parent: { route: '/music/lyrics', name: 'Music Lyrics' }
  },
  '/music-artists/works': {
    title: 'Artists Works & Interviews',
    description: 'Music artist works',
    icon: Mic,
    parent: { route: '/music-artists', name: 'Music Artists' }
  },
  '/music-artists/interviews': {
    title: 'Artist Interviews',
    description: 'Music artist interviews',
    icon: Mic,
    parent: { route: '/music-artists', name: 'Music Artists' }
  },
  '/music-artists/news': {
    title: 'Artist News & Gossip',
    description: 'Music artist news',
    icon: Mic,
    parent: { route: '/music-artists', name: 'Music Artists' }
  },
  '/music-artists/challenges': {
    title: 'Music Challenges',
    description: 'Music challenges',
    icon: Mic,
    parent: { route: '/music-artists', name: 'Music Artists' }
  },
  '/music/instruments/players': {
    title: 'Instrument Players',
    description: 'Musical instrument players',
    icon: Guitar,
    parent: { route: '/music/instruments', name: 'Instruments' }
  },

  // ============ GAMING & HOBBIES ============
  '/gaming/arcade': {
    title: 'Arcade Games',
    description: 'Classic arcade games',
    icon: Gamepad2,
    parent: { route: '/gaming', name: 'Gaming' }
  },
  '/gaming/casino': {
    title: 'Casino Slots',
    description: 'Casino slot games',
    icon: Gamepad2,
    parent: { route: '/gaming', name: 'Gaming' }
  },
  '/gaming/dominos': {
    title: 'Dominoes & Domino Fails',
    description: 'Domino games and fails',
    icon: Gamepad2,
    parent: { route: '/gaming', name: 'Gaming' }
  },
  '/gaming/lottery': {
    title: 'Lottery, Prize & Raffle',
    description: 'Lottery and prize games',
    icon: Gamepad2,
    parent: { route: '/gaming', name: 'Gaming' }
  },
  '/gaming/xbox': {
    title: 'Xbox & PlayStation 5',
    description: 'Console gaming',
    icon: Gamepad2,
    parent: { route: '/gaming', name: 'Gaming' }
  },
  '/gaming/cards': {
    title: 'Gaming Cards',
    description: 'Card games',
    icon: Gamepad2,
    parent: { route: '/gaming', name: 'Gaming' }
  },
  '/magic-tricks/illusions': {
    title: 'Illusions & Tricks',
    description: 'Magic illusions',
    icon: Wand2,
    parent: { route: '/magic-tricks', name: 'Magic Tricks' }
  },
  '/magic-tricks/card': {
    title: 'Card Tricks',
    description: 'Card magic tricks',
    icon: Wand2,
    parent: { route: '/magic-tricks', name: 'Magic Tricks' }
  },
  '/game-challenges/toys': {
    title: 'Game Toys (Rockets, Missiles)',
    description: 'Toy games and challenges',
    icon: Target,
    parent: { route: '/game-challenges', name: 'Game Challenges' }
  },
  '/game-challenges/experiments': {
    title: 'Experiments Toys',
    description: 'Experiment toy challenges',
    icon: Target,
    parent: { route: '/game-challenges', name: 'Game Challenges' }
  },
  '/riddles/conundrum': {
    title: 'Conundrums & Puzzles',
    description: 'Brain teasers and puzzles',
    icon: Puzzle,
    parent: { route: '/riddles', name: 'Riddles & Puzzles' }
  },
  '/dances/styles': {
    title: 'Different Dance Styles',
    description: 'Various dance styles',
    icon: Trophy,
    parent: { route: '/dances', name: 'Dances' }
  },
  '/dances/choreography': {
    title: 'Music Choreography',
    description: 'Dance choreography',
    icon: Trophy,
    parent: { route: '/dances', name: 'Dances' }
  },

  // ============ FITNESS & HEALTH ============
  '/fitness/calisthenics': {
    title: 'Calisthenics Workout',
    description: 'Bodyweight exercises',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Fitness & Workout' }
  },
  '/fitness/weightlifting-prank': {
    title: 'Weight Lifting Pranks',
    description: 'Weightlifting prank videos',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Fitness & Workout' }
  },
  '/fitness/weightlifting-female': {
    title: 'Weightlifting Female',
    description: 'Women weightlifting',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Fitness & Workout' }
  },
  '/fitness/weightlifting-male': {
    title: 'Weightlifting Male',
    description: 'Men weightlifting',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Fitness & Workout' }
  },
  '/fitness/workout': {
    title: 'Workout & Fitness',
    description: 'General workout videos',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Fitness & Workout' }
  },
  '/fitness/workout-female': {
    title: 'Workout Female',
    description: 'Women workout videos',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Fitness & Workout' }
  },
  '/fitness/workout-male': {
    title: 'Workout Male',
    description: 'Men workout videos',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Fitness & Workout' }
  },
  '/fitness/yoga': {
    title: 'Yoga Workout',
    description: 'Yoga exercises',
    icon: Dumbbell,
    parent: { route: '/physical-fitness', name: 'Fitness & Workout' }
  },
  '/martial-arts/self-defense': {
    title: 'Self Defense',
    description: 'Self defense techniques',
    icon: Activity,
    parent: { route: '/martial-arts', name: 'Martial Arts' }
  },
  '/martial-arts/training': {
    title: 'Martial Arts Training',
    description: 'Martial arts training',
    icon: Activity,
    parent: { route: '/martial-arts', name: 'Martial Arts' }
  },
  '/health/reproductive': {
    title: 'Reproductive Systems',
    description: 'Reproductive health',
    icon: Heart,
    parent: { route: '/health', name: 'Health' }
  },
  '/health/mental': {
    title: 'Mental Health',
    description: 'Mental health awareness',
    icon: Heart,
    parent: { route: '/health', name: 'Health' }
  },
  '/success/achieve': {
    title: 'Achieve Success',
    description: 'Success and achievement',
    icon: Activity,
    parent: { route: '/success', name: 'Success & Achievement' }
  },
  '/success/motivation': {
    title: 'Self-Empowerment',
    description: 'Motivation and empowerment',
    icon: Activity,
    parent: { route: '/success', name: 'Success & Achievement' }
  },

  // ============ MODELS & PHOTOS ============
  '/models/female-male': {
    title: 'Female & Male Models',
    description: 'Professional models',
    icon: Star,
    parent: { route: '/models', name: 'Models' }
  },
  '/models/fit': {
    title: 'Fit Models',
    description: 'Fitness models',
    icon: Star,
    parent: { route: '/models', name: 'Models' }
  },
  '/models/mature': {
    title: 'Mature Models',
    description: 'Mature fashion models',
    icon: Star,
    parent: { route: '/models', name: 'Models' }
  },
  '/models/plus-size': {
    title: 'Plus Size & Curvy',
    description: 'Plus size models',
    icon: Star,
    parent: { route: '/models', name: 'Models' }
  },
  '/models/swimsuit': {
    title: 'Swimsuit & Lingerie',
    description: 'Swimsuit models',
    icon: Star,
    parent: { route: '/models', name: 'Models' }
  },
  '/models/fall': {
    title: 'Fall Clothes',
    description: 'Fall fashion modeling',
    icon: Shirt,
    parent: { route: '/models/seasonal', name: 'Seasonal Modeling' }
  },
  '/models/summer': {
    title: 'Summer Clothes',
    description: 'Summer fashion modeling',
    icon: Shirt,
    parent: { route: '/models/seasonal', name: 'Seasonal Modeling' }
  },
  '/models/winter': {
    title: 'Winter Clothes',
    description: 'Winter fashion modeling',
    icon: Shirt,
    parent: { route: '/models/seasonal', name: 'Seasonal Modeling' }
  },
  '/models/fashion-fails': {
    title: 'Fashion Fails',
    description: 'Runway and fashion fails',
    icon: Shirt,
    parent: { route: '/models/seasonal', name: 'Seasonal Modeling' }
  },
  '/pictures/photography': {
    title: 'Photography',
    description: 'Photography content',
    icon: Image,
    parent: { route: '/pictures', name: 'Pictures & Photos' }
  },
  '/pictures/portraits': {
    title: 'Portraits',
    description: 'Portrait photography',
    icon: Image,
    parent: { route: '/pictures', name: 'Pictures & Photos' }
  },

  // ============ TRAVEL & PLACES ============
  '/travel/beaches': {
    title: 'Travel Beaches',
    description: 'Beach travel destinations',
    icon: Map,
    parent: { route: '/travel-events', name: 'Travel & Events' }
  },
  '/travel/cities': {
    title: 'Cities & Towns',
    description: 'City travel guides',
    icon: Map,
    parent: { route: '/travel-events', name: 'Travel & Events' }
  },
  '/travel/country-foods': {
    title: 'Country Foods',
    description: 'International cuisine',
    icon: Map,
    parent: { route: '/travel-events', name: 'Travel & Events' }
  },
  '/travel/hotels-expensive': {
    title: 'Most Expensive Hotels',
    description: 'Luxury hotel reviews',
    icon: Map,
    parent: { route: '/travel-events', name: 'Travel & Events' }
  },
  '/travel/hotels': {
    title: 'Hotels & Motels',
    description: 'Hotel accommodations',
    icon: Map,
    parent: { route: '/travel-events', name: 'Travel & Events' }
  },
  '/travel/hotels-unique': {
    title: 'Unique & Weird Hotels',
    description: 'Unusual hotel stays',
    icon: Map,
    parent: { route: '/travel-events', name: 'Travel & Events' }
  },
  '/travel/nightclubs': {
    title: 'Night Clubs',
    description: 'Nightlife destinations',
    icon: Map,
    parent: { route: '/travel-events', name: 'Travel & Events' }
  },
  '/travel/restaurants': {
    title: 'Travel Restaurants',
    description: 'Restaurant discoveries',
    icon: Map,
    parent: { route: '/travel-events', name: 'Travel & Events' }
  },
  '/travel/street-food': {
    title: 'Street Food',
    description: 'Street food around the world',
    icon: Map,
    parent: { route: '/travel-events', name: 'Travel & Events' }
  },
  '/travel/nightlife': {
    title: 'Streets & Night Life',
    description: 'City nightlife',
    icon: Map,
    parent: { route: '/travel-events', name: 'Travel & Events' }
  },
  '/travel/new-year': {
    title: 'World New Year Celebrations',
    description: 'New Year celebrations',
    icon: Map,
    parent: { route: '/travel-events', name: 'Travel & Events' }
  },
  '/travel/tips': {
    title: 'Travel Tips (Overseas)',
    description: 'International travel tips',
    icon: Map,
    parent: { route: '/travel-events', name: 'Travel & Events' }
  },

  // ============ HOW TO & EDUCATION ============
  '/how-to/building': {
    title: 'Building & Garages',
    description: 'Construction tutorials',
    icon: Wrench,
    parent: { route: '/how-to-style', name: 'How To' }
  },
  '/how-to/clean-carpet': {
    title: 'Clean Carpet & Windows',
    description: 'Cleaning tutorials',
    icon: Wrench,
    parent: { route: '/how-to-style', name: 'How To' }
  },
  '/how-to/clean-bathroom': {
    title: 'Clean Shower & Sink',
    description: 'Bathroom cleaning',
    icon: Wrench,
    parent: { route: '/how-to-style', name: 'How To' }
  },
  '/how-to/remodel': {
    title: 'Remodel Bathroom',
    description: 'Bathroom remodeling',
    icon: Wrench,
    parent: { route: '/how-to-style', name: 'How To' }
  },
  '/how-to/windows-doors': {
    title: 'Fix Windows & Doors',
    description: 'Window and door repairs',
    icon: Wrench,
    parent: { route: '/how-to-style', name: 'How To' }
  },
  '/how-to/toilets': {
    title: 'Fix/Replace Toilets',
    description: 'Toilet repairs',
    icon: Wrench,
    parent: { route: '/how-to-style', name: 'How To' }
  },
  '/how-to/arts-crafts': {
    title: 'Arts & Crafts',
    description: 'Arts and crafts projects',
    icon: Wrench,
    parent: { route: '/how-to-style', name: 'How To' }
  },
  '/home-electrical/replace': {
    title: 'Replace & Repair',
    description: 'Electrical repairs',
    icon: Zap,
    parent: { route: '/home-electrical', name: 'Home Electrical' }
  },
  '/home-electrical/install': {
    title: 'Installation',
    description: 'Electrical installation',
    icon: Zap,
    parent: { route: '/home-electrical', name: 'Home Electrical' }
  },
  '/education/anatomy': {
    title: 'Anatomy & Human Body',
    description: 'Human anatomy education',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
  '/education/countries': {
    title: 'Countries History',
    description: 'World countries history',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
  '/education/immigration': {
    title: 'Immigration & Questions',
    description: 'Immigration information',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
  '/education/geography': {
    title: 'Kids Geography',
    description: 'Geography for children',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
  '/education/laws': {
    title: 'Laws & Constitution',
    description: 'Legal education',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
  '/documentaries/drugs': {
    title: 'Drugs & Dealers',
    description: 'Drug documentaries',
    icon: BookOpen,
    parent: { route: '/documentaries', name: 'Documentaries' }
  },
  '/documentaries/real-events': {
    title: 'Real Events & People',
    description: 'True story documentaries',
    icon: BookOpen,
    parent: { route: '/documentaries', name: 'Documentaries' }
  },
  '/machines/amazing': {
    title: 'Amazing Machines',
    description: 'Incredible machines',
    icon: Hammer,
    parent: { route: '/machines', name: 'Machines' }
  },

  // ============ PEOPLE & WORKERS ============
  '/people/bigotry': {
    title: 'Bigotry & Favoritism',
    description: 'Social issues content',
    icon: Users,
    parent: { route: '/people-blogs', name: 'People' }
  },
  '/people/fighting': {
    title: 'Fighting & Confrontations',
    description: 'Confrontation videos',
    icon: Users,
    parent: { route: '/people-blogs', name: 'People' }
  },
  '/people/karma': {
    title: 'Karma & Deserved',
    description: 'Karma instant justice',
    icon: Users,
    parent: { route: '/people-blogs', name: 'People' }
  },
  '/people/lookalikes': {
    title: 'Look-a-likes & Impressionists',
    description: 'Celebrity lookalikes',
    icon: Users,
    parent: { route: '/people-blogs', name: 'People' }
  },
  '/people/thefts': {
    title: 'Thefts & Stealing',
    description: 'Theft caught on camera',
    icon: Users,
    parent: { route: '/people-blogs', name: 'People' }
  },
  '/people/amazing': {
    title: 'People Amazing',
    description: 'Amazing people videos',
    icon: Users,
    parent: { route: '/people-blogs', name: 'People' }
  },
  '/people/amazing-things': {
    title: 'Amazing Things',
    description: 'People doing amazing things',
    icon: Users,
    parent: { route: '/people-blogs', name: 'People' }
  },
  '/people/fails': {
    title: 'People Fails & Comedy',
    description: 'Fail compilations',
    icon: Users,
    parent: { route: '/people-blogs', name: 'People' }
  },
  '/workers/amazing': {
    title: 'Amazing & Great Things',
    description: 'Workers doing amazing things',
    icon: Briefcase,
    parent: { route: '/workers', name: 'Workers' }
  },
  '/workers/fails': {
    title: 'Worker Fails & Accidents',
    description: 'Workplace fails',
    icon: Briefcase,
    parent: { route: '/workers', name: 'Workers' }
  },
  '/moments/good': {
    title: 'Good Moments',
    description: 'Heartwarming moments',
    icon: Award,
    parent: { route: '/moments', name: 'Moments' }
  },
  '/moments/bad': {
    title: 'Bad Moments',
    description: 'Unfortunate moments',
    icon: Award,
    parent: { route: '/moments', name: 'Moments' }
  },
  '/moments/special': {
    title: 'Special Moments',
    description: 'Special and memorable moments',
    icon: Award,
    parent: { route: '/moments', name: 'Moments' }
  },

  // ============ ADDITIONAL MISSING MAPPINGS ============
  
  // Entertainment Auditions
  '/entertainment/auditions': {
    title: 'Auditions & Contests',
    description: 'Entertainment auditions and contests',
    icon: Star,
    parent: { route: '/entertainment', name: 'Entertainment' }
  },

  // Beaches & Lagoons
  '/beaches': {
    title: 'Beaches & Lagoons',
    description: 'Beach destinations and lagoons',
    icon: Palmtree,
    parent: { route: '/travel-events', name: 'Travel & Events' }
  },
  '/beaches/tropical': {
    title: 'Tropical Beaches',
    description: 'Tropical beach destinations',
    icon: Palmtree,
    parent: { route: '/beaches', name: 'Beaches & Lagoons' }
  },
  '/beaches/surfing': {
    title: 'Surfing Spots',
    description: 'Best surfing beach spots',
    icon: Palmtree,
    parent: { route: '/beaches', name: 'Beaches & Lagoons' }
  },
  '/beaches/resorts': {
    title: 'Beach Resorts',
    description: 'Beach resort destinations',
    icon: Palmtree,
    parent: { route: '/beaches', name: 'Beaches & Lagoons' }
  },

  // Airports additional
  '/airports/security': {
    title: 'Airport Security',
    description: 'Airport security content',
    icon: Plane,
    parent: { route: '/airports', name: 'Airports' }
  },
  '/airports/lounges': {
    title: 'Airport Lounges',
    description: 'Airport lounge reviews',
    icon: Plane,
    parent: { route: '/airports', name: 'Airports' }
  },

  // Restaurants additional
  '/restaurants/fine-dining': {
    title: 'Fine Dining',
    description: 'Fine dining restaurants',
    icon: Utensils,
    parent: { route: '/restaurants', name: 'Restaurants' }
  },
  '/restaurants/fast-food': {
    title: 'Fast Food',
    description: 'Fast food restaurants',
    icon: Utensils,
    parent: { route: '/restaurants', name: 'Restaurants' }
  },
  '/restaurants/reviews': {
    title: 'Restaurant Reviews',
    description: 'Restaurant reviews and ratings',
    icon: Utensils,
    parent: { route: '/restaurants', name: 'Restaurants' }
  },
  '/restaurants/celebrity-chefs': {
    title: 'Celebrity Chefs',
    description: 'Celebrity chef restaurants',
    icon: Utensils,
    parent: { route: '/restaurants', name: 'Restaurants' }
  },

  // Education additional
  '/education/medicine': {
    title: 'Medicine & Medication',
    description: 'Medical education content',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
  '/education/religion': {
    title: 'Religion',
    description: 'Religious education content',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
  '/education/nursing': {
    title: 'RN Nursing & LVN',
    description: 'Nursing education content',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
  '/education/learn': {
    title: 'Learning Techniques',
    description: 'Learning methods and techniques',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },

  // Models additional
  '/models/fashion': {
    title: 'Fashion Models',
    description: 'Fashion model content',
    icon: Star,
    parent: { route: '/models', name: 'Models' }
  },
  '/models/seasonal': {
    title: 'Seasonal Modeling',
    description: 'Seasonal fashion modeling',
    icon: Shirt,
    parent: { route: '/models', name: 'Models' }
  },

  // Music Country & Folk
  '/music/country': {
    title: 'Country & Western',
    description: 'Country and western music',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/folk': {
    title: 'Folk (Ballads, Chorus)',
    description: 'Folk music and ballads',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/spanish': {
    title: 'Spanish & Mexican',
    description: 'Spanish and Mexican music',
    icon: Disc,
    parent: { route: '/music/international', name: 'International Music' }
  },
  '/music/international': {
    title: 'International Music',
    description: 'Music from around the world',
    icon: Disc,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/lyrics': {
    title: 'Music Lyrics',
    description: 'Song lyrics and annotations',
    icon: Headphones,
    parent: { route: '/music', name: 'Music' }
  },
  '/music/instruments': {
    title: 'Musical Instruments',
    description: 'Musical instruments and players',
    icon: Guitar,
    parent: { route: '/music', name: 'Music' }
  },
  '/music-artists': {
    title: 'Music Artists',
    description: 'Music artists and performers',
    icon: Mic,
    parent: { route: '/music', name: 'Music' }
  },

  // Sports parent categories
  '/sports/nba': {
    title: 'NBA Basketball',
    description: 'NBA basketball content',
    icon: Trophy,
    parent: { route: '/sports', name: 'Sports' }
  },
  '/sports/nfl': {
    title: 'NFL Football',
    description: 'NFL football content',
    icon: Trophy,
    parent: { route: '/sports', name: 'Sports' }
  },
  '/sports/mlb': {
    title: 'MLB Baseball',
    description: 'MLB baseball content',
    icon: Trophy,
    parent: { route: '/sports', name: 'Sports' }
  },
  '/sports/nhl': {
    title: 'NHL Hockey',
    description: 'NHL hockey content',
    icon: Trophy,
    parent: { route: '/sports', name: 'Sports' }
  },
  '/sports/wnba': {
    title: 'WNBA Basketball',
    description: 'WNBA basketball content',
    icon: Trophy,
    parent: { route: '/sports', name: 'Sports' }
  },
  '/sports/college': {
    title: 'College Sports',
    description: 'NCAA college sports content',
    icon: Medal,
    parent: { route: '/sports', name: 'Sports' }
  },
  '/sports/mma': {
    title: 'MMA & Fighting',
    description: 'Mixed martial arts and fighting',
    icon: Dumbbell,
    parent: { route: '/sports', name: 'Sports' }
  },
  '/sports/racing': {
    title: 'Racing Sports',
    description: 'Racing and motorsports',
    icon: Timer,
    parent: { route: '/sports', name: 'Sports' }
  },
  '/sports/soccer': {
    title: 'Soccer & Football',
    description: 'Soccer and international football',
    icon: Trophy,
    parent: { route: '/sports', name: 'Sports' }
  },
  '/sports/tennis': {
    title: 'Tennis',
    description: 'Professional tennis content',
    icon: Target,
    parent: { route: '/sports', name: 'Sports' }
  },
  '/sports/golf': {
    title: 'Golf',
    description: 'Golf and PGA content',
    icon: Target,
    parent: { route: '/sports', name: 'Sports' }
  },
  '/sports/olympics': {
    title: 'Olympics',
    description: 'Olympic games content',
    icon: Medal,
    parent: { route: '/sports', name: 'Sports' }
  },
  '/sports/volleyball': {
    title: 'Volleyball',
    description: 'Volleyball content',
    icon: Trophy,
    parent: { route: '/sports', name: 'Sports' }
  },
  '/sports/water': {
    title: 'Water Sports',
    description: 'Water sports and aquatics',
    icon: Waves,
    parent: { route: '/sports', name: 'Sports' }
  },
  '/sports/other': {
    title: 'Other Sports',
    description: 'Various sports content',
    icon: Trophy,
    parent: { route: '/sports', name: 'Sports' }
  },
  '/sports/boxing': {
    title: 'Boxing',
    description: 'Boxing matches and content',
    icon: Dumbbell,
    parent: { route: '/sports/mma', name: 'MMA & Fighting' }
  },
  '/sports/nascar': {
    title: 'NASCAR Racing',
    description: 'NASCAR racing content',
    icon: Timer,
    parent: { route: '/sports/racing', name: 'Racing Sports' }
  },
  '/sports/motorcycle-racing': {
    title: 'Motorcycle Superbike',
    description: 'Motorcycle racing content',
    icon: Timer,
    parent: { route: '/sports/racing', name: 'Racing Sports' }
  },
  '/sports/horse-racing': {
    title: 'Horse Racing',
    description: 'Horse racing content',
    icon: Timer,
    parent: { route: '/sports/racing', name: 'Racing Sports' }
  },
  '/sports/swimming': {
    title: 'Swimming',
    description: 'Swimming competitions',
    icon: Waves,
    parent: { route: '/sports/water', name: 'Water Sports' }
  },
  '/meditation/guided': {
    title: 'Guided Meditation',
    description: 'Guided meditation sessions',
    icon: Brain,
    parent: { route: '/meditation', name: 'Meditation' }
  },
  '/meditation/sleep': {
    title: 'Sleep Meditation',
    description: 'Meditation for better sleep',
    icon: Brain,
    parent: { route: '/meditation', name: 'Meditation' }
  },

  // Parent category pages
  '/animation': {
    title: 'Animation',
    description: 'Animated films and content',
    icon: Film,
    parent: { route: '/film-animation', name: 'Film & Animation' }
  },
  '/tv-shows': {
    title: 'TV Shows',
    description: 'Television shows and series',
    icon: Tv,
    parent: { route: '/entertainment', name: 'Entertainment' }
  },
  '/radio': {
    title: 'Radio',
    description: 'Radio content and shows',
    icon: Radio,
    parent: { route: '/entertainment', name: 'Entertainment' }
  },
  '/comedians': {
    title: 'Comedians',
    description: 'Comedian profiles and performances',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/funny': {
    title: 'Funny Videos',
    description: 'Funny and humorous content',
    icon: Laugh,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/bloopers': {
    title: 'Bloopers',
    description: 'Blooper reels and outtakes',
    icon: PartyPopper,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/fails': {
    title: 'Fails',
    description: 'Fail compilations',
    icon: Zap,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/crazy': {
    title: 'Crazy & Amazing',
    description: 'Crazy and amazing content',
    icon: Zap,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/magic-tricks': {
    title: 'Magic Tricks',
    description: 'Magic tricks and illusions',
    icon: Wand2,
    parent: { route: '/gaming', name: 'Gaming & Hobbies' }
  },
  '/game-challenges': {
    title: 'Game Challenges',
    description: 'Game challenges and competitions',
    icon: Target,
    parent: { route: '/gaming', name: 'Gaming & Hobbies' }
  },
  '/riddles': {
    title: 'Riddles & Puzzles',
    description: 'Brain teasers and puzzles',
    icon: Puzzle,
    parent: { route: '/gaming', name: 'Gaming & Hobbies' }
  },
  '/dances': {
    title: 'Dances',
    description: 'Dance performances and styles',
    icon: Trophy,
    parent: { route: '/gaming', name: 'Gaming & Hobbies' }
  },
  '/martial-arts': {
    title: 'Martial Arts',
    description: 'Martial arts training and content',
    icon: Activity,
    parent: { route: '/physical-fitness', name: 'Fitness' }
  },
  '/health': {
    title: 'Health',
    description: 'Health and wellness content',
    icon: Heart,
    parent: { route: '/physical-fitness', name: 'Fitness' }
  },
  '/success': {
    title: 'Success & Achievement',
    description: 'Success and motivation content',
    icon: Activity,
    parent: { route: '/physical-fitness', name: 'Fitness' }
  },
  '/home-electrical': {
    title: 'Home Electrical',
    description: 'Home electrical tutorials',
    icon: Zap,
    parent: { route: '/how-to-style', name: 'How To' }
  },
  '/documentaries': {
    title: 'Documentaries',
    description: 'Documentary films and series',
    icon: BookOpen,
    parent: { route: '/how-to-style', name: 'How To' }
  },
  '/machines': {
    title: 'Machines',
    description: 'Machine and engineering content',
    icon: Hammer,
    parent: { route: '/how-to-style', name: 'How To' }
  },
  '/workers': {
    title: 'Workers',
    description: 'Workers and workplace content',
    icon: Briefcase,
    parent: { route: '/people-blogs', name: 'People' }
  },
  '/moments': {
    title: 'Moments',
    description: 'Memorable moments and highlights',
    icon: Award,
    parent: { route: '/people-blogs', name: 'People' }
  },
  '/pictures': {
    title: 'Pictures & Photos',
    description: 'Photography and pictures',
    icon: Image,
    parent: { route: '/models', name: 'Models' }
  },
};
