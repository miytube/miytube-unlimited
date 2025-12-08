
import { SubcategoryMapping } from './types';
import { 
  Video, Film, Smile, Gamepad2, Music, Headphones, BookOpen, Moon, Quote,
  GraduationCap, Scissors, Microscope, Newspaper, Users, HeartHandshake, Dog, Star, Heart,
  Plane, Utensils, Pizza, Waves, Cloud, Zap, Ship, Anchor, FileText, PenTool
} from 'lucide-react';

export const sidebarSubcategories: SubcategoryMapping = {
  // Videos subcategories
  '/videos/latest': {
    title: 'Latest Videos',
    description: 'Newest uploaded videos',
    icon: Video,
    parent: { route: '/videos', name: 'Videos' }
  },
  '/videos/featured': {
    title: 'Featured Videos',
    description: 'Top featured videos',
    icon: Video,
    parent: { route: '/videos', name: 'Videos' }
  },
  '/videos/most-viewed': {
    title: 'Most Viewed',
    description: 'Most popular videos by views',
    icon: Video,
    parent: { route: '/videos', name: 'Videos' }
  },

  // Comedy subcategories
  '/comedy/sketches': {
    title: 'Sketches & Skits',
    description: 'Comedy sketches and skits',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/comedy/improv': {
    title: 'Improv Comedy',
    description: 'Improvisation comedy',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },
  '/comedy/parody': {
    title: 'Parody & Satire',
    description: 'Comedy parodies and satire',
    icon: Smile,
    parent: { route: '/comedy', name: 'Comedy' }
  },

  // Gaming subcategories
  '/gaming/action': {
    title: 'Action Games',
    description: 'Action video games',
    icon: Gamepad2,
    parent: { route: '/gaming', name: 'Gaming' }
  },
  '/gaming/rpg': {
    title: 'RPG Games',
    description: 'Role-playing games',
    icon: Gamepad2,
    parent: { route: '/gaming', name: 'Gaming' }
  },
  '/gaming/sports': {
    title: 'Sports Games',
    description: 'Sports video games',
    icon: Gamepad2,
    parent: { route: '/gaming', name: 'Gaming' }
  },
  '/gaming/streaming': {
    title: 'Live Streaming',
    description: 'Gaming live streams',
    icon: Gamepad2,
    parent: { route: '/gaming', name: 'Gaming' }
  },
  '/gaming/reviews': {
    title: 'Game Reviews',
    description: 'Video game reviews',
    icon: Gamepad2,
    parent: { route: '/gaming', name: 'Gaming' }
  },

  // Podcasts subcategories
  '/podcasts/news': {
    title: 'News Podcasts',
    description: 'Current events and news podcasts',
    icon: Headphones,
    parent: { route: '/podcasts', name: 'Podcasts' }
  },
  '/podcasts/comedy': {
    title: 'Comedy Podcasts',
    description: 'Funny and entertaining podcasts',
    icon: Headphones,
    parent: { route: '/podcasts', name: 'Podcasts' }
  },
  '/podcasts/interview': {
    title: 'Interview Podcasts',
    description: 'Interview-style podcasts',
    icon: Headphones,
    parent: { route: '/podcasts', name: 'Podcasts' }
  },
  '/podcasts/educational': {
    title: 'Educational Podcasts',
    description: 'Learning and educational podcasts',
    icon: Headphones,
    parent: { route: '/podcasts', name: 'Podcasts' }
  },

  // Audiobooks subcategories
  '/audiobooks/fiction': {
    title: 'Fiction',
    description: 'Fiction audiobooks',
    icon: BookOpen,
    parent: { route: '/audiobooks', name: 'Audiobooks' }
  },
  '/audiobooks/nonfiction': {
    title: 'Non-Fiction',
    description: 'Non-fiction audiobooks',
    icon: BookOpen,
    parent: { route: '/audiobooks', name: 'Audiobooks' }
  },
  '/audiobooks/self-help': {
    title: 'Self-Help',
    description: 'Self-help and personal development audiobooks',
    icon: BookOpen,
    parent: { route: '/audiobooks', name: 'Audiobooks' }
  },
  '/audiobooks/mystery': {
    title: 'Mystery & Thriller',
    description: 'Mystery and thriller audiobooks',
    icon: BookOpen,
    parent: { route: '/audiobooks', name: 'Audiobooks' }
  },

  // Music subcategories
  '/music/lyrics': {
    title: 'Lyrics',
    description: 'Song lyrics and lyric videos',
    icon: Music,
    parent: { route: '/music', name: 'Music' }
  },

  // Meditation subcategories
  '/meditation/guided': {
    title: 'Guided Meditation',
    description: 'Guided meditation sessions',
    icon: Moon,
    parent: { route: '/meditation', name: 'Meditation' }
  },
  '/meditation/sleep': {
    title: 'Sleep Meditation',
    description: 'Meditation for better sleep',
    icon: Moon,
    parent: { route: '/meditation', name: 'Meditation' }
  },

  // Quotes & Poems subcategories
  '/quotes-poems/inspirational': {
    title: 'Inspirational Quotes',
    description: 'Motivational and inspirational quotes',
    icon: Quote,
    parent: { route: '/quotes-poems', name: 'Quotes & Poems' }
  },
  '/quotes-poems/love': {
    title: 'Love Quotes',
    description: 'Romantic and love quotes',
    icon: Quote,
    parent: { route: '/quotes-poems', name: 'Quotes & Poems' }
  },
  '/quotes-poems/classic': {
    title: 'Classic Poems',
    description: 'Classic poetry and literature',
    icon: Quote,
    parent: { route: '/quotes-poems', name: 'Quotes & Poems' }
  },
  '/quotes-poems/modern': {
    title: 'Modern Poetry',
    description: 'Contemporary and modern poetry',
    icon: Quote,
    parent: { route: '/quotes-poems', name: 'Quotes & Poems' }
  },

  // Education subcategories
  '/education/learn': {
    title: 'Learning Techniques',
    description: 'Study tips and learning methods',
    icon: GraduationCap,
    parent: { route: '/education', name: 'Education' }
  },

  // How-to & Style subcategories
  '/how-to-style/diy': {
    title: 'DIY Projects',
    description: 'Do-it-yourself tutorials and projects',
    icon: Scissors,
    parent: { route: '/how-to-style', name: 'How-to & Style' }
  },
  '/how-to-style/fashion': {
    title: 'Fashion Tips',
    description: 'Fashion advice and style tips',
    icon: Scissors,
    parent: { route: '/how-to-style', name: 'How-to & Style' }
  },
  '/how-to-style/beauty': {
    title: 'Beauty & Makeup',
    description: 'Beauty tutorials and makeup tips',
    icon: Scissors,
    parent: { route: '/how-to-style', name: 'How-to & Style' }
  },
  '/how-to-style/home': {
    title: 'Home Improvement',
    description: 'Home renovation and improvement tips',
    icon: Scissors,
    parent: { route: '/how-to-style', name: 'How-to & Style' }
  },

  // News & Politics subcategories
  '/news/breaking': {
    title: 'Breaking News',
    description: 'Latest breaking news',
    icon: Newspaper,
    parent: { route: '/news', name: 'News & Politics' }
  },
  '/news/politics': {
    title: 'Politics',
    description: 'Political news and analysis',
    icon: Newspaper,
    parent: { route: '/news', name: 'News & Politics' }
  },
  '/news/world': {
    title: 'World News',
    description: 'International news and events',
    icon: Newspaper,
    parent: { route: '/news', name: 'News & Politics' }
  },
  '/news/local': {
    title: 'Local News',
    description: 'Local community news',
    icon: Newspaper,
    parent: { route: '/news', name: 'News & Politics' }
  },

  // People & Blogs subcategories
  '/people-blogs/vlogs': {
    title: 'Vlogs',
    description: 'Video blogs and vlogs',
    icon: Users,
    parent: { route: '/people-blogs', name: 'People & Blogs' }
  },
  '/people-blogs/lifestyle': {
    title: 'Lifestyle',
    description: 'Lifestyle content and videos',
    icon: Users,
    parent: { route: '/people-blogs', name: 'People & Blogs' }
  },
  '/people-blogs/family': {
    title: 'Family Blogs',
    description: 'Family-oriented content',
    icon: Users,
    parent: { route: '/people-blogs', name: 'People & Blogs' }
  },
  '/people-blogs/daily': {
    title: 'Daily Life',
    description: 'Daily life vlogs and updates',
    icon: Users,
    parent: { route: '/people-blogs', name: 'People & Blogs' }
  },

  // Relationships subcategories
  '/relationships/marriage': {
    title: 'Marriage',
    description: 'Marriage advice and tips',
    icon: Heart,
    parent: { route: '/relationships', name: 'Relationships' }
  },

  // Nonprofits subcategories
  '/nonprofits/charity': {
    title: 'Charity Work',
    description: 'Charitable organizations and work',
    icon: HeartHandshake,
    parent: { route: '/nonprofits', name: 'Nonprofits' }
  },
  '/nonprofits/volunteer': {
    title: 'Volunteering',
    description: 'Volunteer opportunities and stories',
    icon: HeartHandshake,
    parent: { route: '/nonprofits', name: 'Nonprofits' }
  },
  '/nonprofits/fundraising': {
    title: 'Fundraising',
    description: 'Fundraising campaigns and events',
    icon: HeartHandshake,
    parent: { route: '/nonprofits', name: 'Nonprofits' }
  },
  '/nonprofits/awareness': {
    title: 'Awareness Campaigns',
    description: 'Social awareness and causes',
    icon: HeartHandshake,
    parent: { route: '/nonprofits', name: 'Nonprofits' }
  },

  // Models subcategories
  '/models/fashion': {
    title: 'Fashion Models',
    description: 'Fashion modeling content',
    icon: Star,
    parent: { route: '/models', name: 'Models' }
  },
  '/models/runway': {
    title: 'Runway Shows',
    description: 'Fashion runway shows',
    icon: Star,
    parent: { route: '/models', name: 'Models' }
  },
  '/models/photoshoots': {
    title: 'Photoshoots',
    description: 'Model photoshoots',
    icon: Star,
    parent: { route: '/models', name: 'Models' }
  },
  '/models/interviews': {
    title: 'Model Interviews',
    description: 'Interviews with models',
    icon: Star,
    parent: { route: '/models', name: 'Models' }
  },

  // Airports subcategories
  '/airports/security': {
    title: 'Airport Security',
    description: 'Airport security and TSA',
    icon: Plane,
    parent: { route: '/airports', name: 'Airports' }
  },
  '/airports/lounges': {
    title: 'Airport Lounges',
    description: 'Airport lounge reviews',
    icon: Plane,
    parent: { route: '/airports', name: 'Airports' }
  },

  // Restaurants subcategories
  '/restaurants/fine-dining': {
    title: 'Fine Dining',
    description: 'Upscale restaurants and fine dining',
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
    description: 'Famous chefs and their restaurants',
    icon: Utensils,
    parent: { route: '/restaurants', name: 'Restaurants' }
  },

  // Foods subcategories
  '/foods/recipes': {
    title: 'Recipes',
    description: 'Cooking recipes and tutorials',
    icon: Pizza,
    parent: { route: '/foods', name: 'Foods' }
  },
  '/foods/cooking': {
    title: 'Cooking Tips',
    description: 'Cooking tips and techniques',
    icon: Pizza,
    parent: { route: '/foods', name: 'Foods' }
  },
  '/foods/baking': {
    title: 'Baking',
    description: 'Baking recipes and tutorials',
    icon: Pizza,
    parent: { route: '/foods', name: 'Foods' }
  },
  '/foods/street': {
    title: 'Street Food',
    description: 'Street food from around the world',
    icon: Pizza,
    parent: { route: '/foods', name: 'Foods' }
  },

  // Beaches subcategories
  '/beaches/tropical': {
    title: 'Tropical Beaches',
    description: 'Tropical beach destinations',
    icon: Waves,
    parent: { route: '/beaches', name: 'Beaches & Lagoons' }
  },
  '/beaches/surfing': {
    title: 'Surfing Spots',
    description: 'Best surfing locations',
    icon: Waves,
    parent: { route: '/beaches', name: 'Beaches & Lagoons' }
  },
  '/beaches/resorts': {
    title: 'Beach Resorts',
    description: 'Beach resort reviews',
    icon: Waves,
    parent: { route: '/beaches', name: 'Beaches & Lagoons' }
  },

  // Weather subcategories
  '/weather/forecast': {
    title: 'Weather Forecast',
    description: 'Daily weather forecasts',
    icon: Cloud,
    parent: { route: '/weather', name: 'Weather' }
  },
  '/weather/storms': {
    title: 'Storms & Hurricanes',
    description: 'Storm tracking and hurricane news',
    icon: Cloud,
    parent: { route: '/weather', name: 'Weather' }
  },
  '/weather/climate': {
    title: 'Climate Change',
    description: 'Climate change news and research',
    icon: Cloud,
    parent: { route: '/weather', name: 'Weather' }
  },
  '/weather/extreme': {
    title: 'Extreme Weather',
    description: 'Extreme weather events',
    icon: Cloud,
    parent: { route: '/weather', name: 'Weather' }
  },

  // Disasters subcategories
  '/disasters/floods': {
    title: 'Floods',
    description: 'Flood events and news',
    icon: Zap,
    parent: { route: '/disasters', name: 'Disasters' }
  },
  '/disasters/landslides': {
    title: 'Landslides',
    description: 'Landslide events and coverage',
    icon: Zap,
    parent: { route: '/disasters', name: 'Disasters' }
  },
  '/disasters/tsunami': {
    title: 'Tsunami',
    description: 'Tsunami events and warnings',
    icon: Zap,
    parent: { route: '/disasters', name: 'Disasters' }
  },

  // Oceans subcategories
  '/oceans/marine-life': {
    title: 'Marine Life',
    description: 'Ocean wildlife and marine life',
    icon: Waves,
    parent: { route: '/oceans', name: 'Waters & Oceans' }
  },
  '/oceans/deep-sea': {
    title: 'Deep Sea',
    description: 'Deep sea exploration',
    icon: Waves,
    parent: { route: '/oceans', name: 'Waters & Oceans' }
  },
  '/oceans/coral-reefs': {
    title: 'Coral Reefs',
    description: 'Coral reef ecosystems',
    icon: Waves,
    parent: { route: '/oceans', name: 'Waters & Oceans' }
  },
  '/oceans/exploration': {
    title: 'Ocean Exploration',
    description: 'Ocean exploration and discovery',
    icon: Waves,
    parent: { route: '/oceans', name: 'Waters & Oceans' }
  },

  // Boats subcategories
  '/boats/sailboats': {
    title: 'Sailboats',
    description: 'Sailboats and sailing',
    icon: Ship,
    parent: { route: '/boats', name: 'Boats' }
  },
  '/boats/speedboats': {
    title: 'Speedboats',
    description: 'Speedboats and fast boats',
    icon: Ship,
    parent: { route: '/boats', name: 'Boats' }
  },

  // Shipping Ports subcategories
  '/shipping-ports/cargo': {
    title: 'Cargo Ports',
    description: 'Cargo shipping ports',
    icon: Anchor,
    parent: { route: '/shipping-ports', name: 'Shipping Ports' }
  },
  '/shipping-ports/cruise': {
    title: 'Cruise Terminals',
    description: 'Cruise ship terminals',
    icon: Anchor,
    parent: { route: '/shipping-ports', name: 'Shipping Ports' }
  },
  '/shipping-ports/history': {
    title: 'Historic Ports',
    description: 'Historic port cities',
    icon: Anchor,
    parent: { route: '/shipping-ports', name: 'Shipping Ports' }
  },

  // Documents subcategories
  '/documents/templates': {
    title: 'Templates',
    description: 'Document templates',
    icon: FileText,
    parent: { route: '/documents', name: 'Documents' }
  },
  '/documents/forms': {
    title: 'Forms',
    description: 'Downloadable forms',
    icon: FileText,
    parent: { route: '/documents', name: 'Documents' }
  },
  '/documents/guides': {
    title: 'Guides',
    description: 'How-to guides and manuals',
    icon: FileText,
    parent: { route: '/documents', name: 'Documents' }
  },
  '/documents/reports': {
    title: 'Reports',
    description: 'Reports and analysis',
    icon: FileText,
    parent: { route: '/documents', name: 'Documents' }
  },

  // Blog subcategories
  '/blog/latest': {
    title: 'Latest Posts',
    description: 'Latest blog posts',
    icon: PenTool,
    parent: { route: '/blog', name: 'Blog' }
  },
  '/blog/featured': {
    title: 'Featured Posts',
    description: 'Featured blog posts',
    icon: PenTool,
    parent: { route: '/blog', name: 'Blog' }
  },
};
