
import { LucideIcon } from 'lucide-react';
import { 
  Trophy, Bitcoin, BarChart, ShoppingCart, Globe, Wrench, Car,
  Dumbbell, Smile, UserRound, Zap, GraduationCap, Gavel, FileText,
  Ship, Brush, Music, Wine, Plane
} from 'lucide-react';

export interface SubcategoryInfo {
  title: string;
  description: string;
  icon: LucideIcon;
  parent: {
    route: string;
    name: string;
  };
}

export interface SubcategoryMapping {
  [key: string]: SubcategoryInfo;
}

export const subcategoryMappings: SubcategoryMapping = {
  // Boxing subcategories
  'boxing-professional': {
    title: 'Professional Boxing',
    description: 'Professional boxing matches, fighters and championships',
    icon: Trophy,
    parent: { route: '/sports/boxing', name: 'Boxing' }
  },
  'boxing-street-fighting': {
    title: 'Street Fighting',
    description: 'Street fighting techniques and real-world combat',
    icon: Trophy,
    parent: { route: '/sports/boxing', name: 'Boxing' }
  },
  'boxing-amateur': {
    title: 'Amateur Boxing',
    description: 'Amateur boxing competitions and training',
    icon: Trophy,
    parent: { route: '/sports/boxing', name: 'Boxing' }
  },
  'boxing-training': {
    title: 'Boxing Training',
    description: 'Boxing workouts, techniques and training regimens',
    icon: Trophy,
    parent: { route: '/sports/boxing', name: 'Boxing' }
  },
  
  // Business subcategories
  'business-cryptocurrency': {
    title: 'Cryptocurrency',
    description: 'Bitcoin, altcoins, and blockchain technology',
    icon: Bitcoin,
    parent: { route: '/business', name: 'Business' }
  },
  'business-leadership': {
    title: 'Business Leadership',
    description: 'Leadership advice, mentorship and business guidance',
    icon: BarChart,
    parent: { route: '/business', name: 'Business' }
  },
  'business-finance': {
    title: 'Finance & Taxes',
    description: 'Money management, taxes, and interest rates',
    icon: BarChart,
    parent: { route: '/business', name: 'Business' }
  },
  'business-services': {
    title: 'Business Services',
    description: 'Professional services, drones, and business solutions',
    icon: BarChart,
    parent: { route: '/business', name: 'Business' }
  },
  'business-farming': {
    title: 'Farming',
    description: 'Agricultural business, farming techniques and equipment',
    icon: BarChart,
    parent: { route: '/business', name: 'Business' }
  },
  'business-commerce': {
    title: 'Commerce & Trade',
    description: 'Commercial business, trade practices and logistics',
    icon: ShoppingCart,
    parent: { route: '/business', name: 'Business' }
  },
  'business-internet': {
    title: 'Internet Business',
    description: 'Online platforms, coding solutions and web services',
    icon: Globe,
    parent: { route: '/business', name: 'Business' }
  },
  
  // Car subcategories
  'cars-repairs-major': {
    title: 'Major Car Repairs',
    description: 'Engine, transmission, and complex automotive repairs',
    icon: Wrench,
    parent: { route: '/cars/repairs', name: 'Car Repairs' }
  },
  'cars-repairs-minor': {
    title: 'Minor Car Repairs',
    description: 'Quick fixes and simple car maintenance tasks',
    icon: Wrench,
    parent: { route: '/cars/repairs', name: 'Car Repairs' }
  },
  'cars-repairs-hacks': {
    title: 'Car Repair Hacks',
    description: 'Clever automotive repair and maintenance tricks',
    icon: Wrench,
    parent: { route: '/cars/repairs', name: 'Car Repairs' }
  },
  'cars-repairs-maintenance': {
    title: 'Car Maintenance',
    description: 'Regular maintenance procedures and schedules',
    icon: Wrench,
    parent: { route: '/cars/repairs', name: 'Car Repairs' }
  },
  'cars-drifting': {
    title: 'Car Drifting',
    description: 'Drifting techniques, events, and professional drivers',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  'cars-expensive': {
    title: 'Expensive & Rare Cars',
    description: 'Luxury automobiles and rare vehicle collections',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  'cars-future': {
    title: 'Future Vehicles',
    description: 'Concept cars, upcoming models and automotive innovation',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  'cars-types': {
    title: 'Car Types',
    description: 'Sedans, coupes, SUVs and other vehicle classifications',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  'cars-strange': {
    title: 'Strange & Unusual Cars',
    description: 'Weird, unusual and bizarre automotive creations',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  'cars-supercars': {
    title: 'Supercars & Hypercars',
    description: 'High-performance sports cars and exotic vehicles',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  'cars-accidents': {
    title: 'Car Accidents',
    description: 'Driving mistakes, crashes and accident prevention',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  'cars-crashes': {
    title: 'Vehicle Crashes',
    description: 'Cars, trucks, and motorcycle crashes and accidents',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  'cars-motorcycles': {
    title: 'Cars, Trucks & Motorcycles',
    description: 'Various vehicle types and transportation methods',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  
  // Fitness subcategories
  'fitness-calisthenics': {
    title: 'Calisthenics Workout',
    description: 'Bodyweight exercises, street workouts and calisthenics training',
    icon: Dumbbell,
    parent: { route: '/fitness', name: 'Fitness' }
  },
  
  // Comedy Routes
  'comedy-standup': {
    title: 'Stand-up Comedy',
    description: 'Stand-up comedians, performances and specials',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  'comedy-roasts': {
    title: 'Roasts & Jokes',
    description: 'Comedy roasts, jokes and humorous events',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  'comedy-snl': {
    title: 'Saturday Night Live',
    description: 'SNL sketches, performers and history',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  'comedy-sitcom': {
    title: 'Sitcoms',
    description: 'Situation comedy shows and TV series',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  'comedy-pranks': {
    title: 'Pranks & Funny Videos',
    description: 'Practical jokes, pranks and humorous clips',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  'comedy-interviews': {
    title: 'Comedian Interviews',
    description: 'Interviews with comedians, backstage content and work discussions',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  
  // Dating & Relationship Routes
  'relationships-dating': {
    title: 'Dating',
    description: 'Dating advice, tips and experiences',
    icon: UserRound,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  'relationships-breakups': {
    title: 'Breakups',
    description: 'Handling relationship endings and moving forward',
    icon: UserRound,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  'relationships-flirting': {
    title: 'Flirting',
    description: 'Flirting techniques, signs and romantic attraction',
    icon: UserRound,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  'relationships-singles': {
    title: 'Singles',
    description: 'Content for single people and solo lifestyle',
    icon: UserRound,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  'relationships-divorce': {
    title: 'Divorce',
    description: 'Divorce process, coping strategies and legal aspects',
    icon: UserRound,
    parent: { route: '/relationships', name: 'Relationships' }
  },
  
  // Disasters Routes
  'disasters-avalanche': {
    title: 'Avalanches',
    description: 'Avalanche footage, safety information and analysis',
    icon: Zap,
    parent: { route: '/disasters', name: 'Disasters' }
  },
  'disasters-earthquakes': {
    title: 'Earthquakes',
    description: 'Earthquake footage, safety information and analysis',
    icon: Zap,
    parent: { route: '/disasters', name: 'Disasters' }
  },
  'disasters-fires': {
    title: 'Fires & Explosions',
    description: 'Fire disasters, prevention and rescue operations',
    icon: Zap,
    parent: { route: '/disasters', name: 'Disasters' }
  },
  'disasters-hurricanes': {
    title: 'Hurricanes & Tornadoes',
    description: 'Extreme weather events, storms and aftermath',
    icon: Zap,
    parent: { route: '/disasters', name: 'Disasters' }
  },
  'disasters-volcano': {
    title: 'Volcanic Eruptions',
    description: 'Volcanic activity, eruptions and geological impact',
    icon: Zap,
    parent: { route: '/disasters', name: 'Disasters' }
  },
  
  // Education Routes
  'education-anatomy': {
    title: 'Anatomy',
    description: 'Human body structure, function and medical information',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
  'education-countries-history': {
    title: 'Countries & History',
    description: 'National histories, historical events and timeline',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
  'education-immigration': {
    title: 'Immigration',
    description: 'Immigration processes, questions and guidance',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
  'education-geography': {
    title: 'Geography',
    description: 'World geography, maps and geographical features',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
  'education-laws': {
    title: 'Laws & Constitution',
    description: 'Legal education, constitutional principles and rights',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },
  
  // Courts & Crime Routes
  'courts-police-trails': {
    title: 'Court Trials',
    description: 'Court proceedings, trials and legal procedures',
    icon: Gavel,
    parent: { route: '/courts-police', name: 'Courts & Police' }
  },
  'courts-police-sentencing': {
    title: 'Sentencing & Judgments',
    description: 'Court sentences, judgments and legal decisions',
    icon: Gavel,
    parent: { route: '/courts-police', name: 'Courts & Police' }
  },
  'courts-police-supreme-court': {
    title: 'Supreme Court',
    description: 'Supreme court cases, decisions and constitutional law',
    icon: Gavel,
    parent: { route: '/courts-police', name: 'Courts & Police' }
  },
  'courts-police-fraud': {
    title: 'Fraud & Scams',
    description: 'Financial fraud, scams and criminal deception',
    icon: Gavel,
    parent: { route: '/courts-police', name: 'Courts & Police' }
  },
  'courts-police-gangs': {
    title: 'Criminal Gangs',
    description: 'Gang activity, criminal enterprises and law enforcement',
    icon: Gavel,
    parent: { route: '/courts-police', name: 'Courts & Police' }
  },
  'courts-police-crime': {
    title: 'Crime',
    description: 'Criminal activities, definitions and consequences',
    icon: Gavel,
    parent: { route: '/courts-police', name: 'Courts & Police' }
  },
  'courts-police-enterprises': {
    title: 'Criminal Enterprises',
    description: 'Organized crime operations and criminal business activities',
    icon: Gavel,
    parent: { route: '/courts-police', name: 'Courts & Police' }
  },
  
  // Documents & Media Routes
  'documents-word': {
    title: 'Word Processing',
    description: 'Microsoft Word tutorials, templates and tips',
    icon: FileText,
    parent: { route: '/documents', name: 'Documents' }
  },
  'documents-excel': {
    title: 'Excel Spreadsheets',
    description: 'Microsoft Excel tutorials, formulas and data analysis',
    icon: FileText,
    parent: { route: '/documents', name: 'Documents' }
  },
  'documents-writing': {
    title: 'Writing & Composition',
    description: 'Writing techniques, styles and document creation',
    icon: FileText,
    parent: { route: '/documents', name: 'Documents' }
  },
  
  // Shipping and Container Routes
  'shipping-container-ships': {
    title: 'Container Ships',
    description: 'Container vessels, oil tankers and commercial shipping',
    icon: Ship,
    parent: { route: '/shipping', name: 'Shipping' }
  },
  
  // Cosmetics Routes
  'cosmetics-foundation': {
    title: 'Foundation & Powders',
    description: 'Makeup foundations, powders and base products',
    icon: Brush,
    parent: { route: '/cosmetics', name: 'Cosmetics' }
  },
  'cosmetics-lipstick': {
    title: 'Lipstick & Makeup',
    description: 'Lipsticks, lip products and general makeup tutorials',
    icon: Brush,
    parent: { route: '/cosmetics', name: 'Cosmetics' }
  },
  
  // Dance Routes
  'dance-styles': {
    title: 'Dance Styles',
    description: 'Various dance styles, choreography and performance',
    icon: Music,
    parent: { route: '/dance', name: 'Dance' }
  },
  
  // Drinks Routes
  'drinks-alcohol': {
    title: 'Alcoholic & Non-Alcoholic Drinks',
    description: 'Drink recipes, mixing tutorials and beverage information',
    icon: Wine,
    parent: { route: '/drinks', name: 'Drinks' }
  },
  
  // Drone Routes
  'drones-civilian': {
    title: 'Civilian Drones',
    description: 'Consumer drones, remote controlled aircraft and aerial photography',
    icon: Plane,
    parent: { route: '/drones', name: 'Drones' }
  },
};
