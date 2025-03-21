
import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Upload, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { 
  Car, GraduationCap, Film, Scissors, HeartHandshake, Users, Dog, 
  Microscope, Plane, Pizza, Utensils, Quote, Clapperboard, Star, 
  Gavel, Ship, UserRound, House, Anchor, Truck, BarChart, Wrench,
  Bitcoin, Trophy, Smile, Zap, Cloud, Waves, Music, MessageSquare,
  LucideIcon
} from 'lucide-react';

interface SubcategoryMapping {
  [key: string]: {
    title: string;
    description: string;
    icon: LucideIcon;
    parent: {
      route: string;
      name: string;
    };
  };
}

const GenericSubcategoryPage = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory: string }>();
  
  // Map of icons for lookup
  const iconComponents: Record<string, LucideIcon> = {
    Car, GraduationCap, Film, Scissors, HeartHandshake, Users, Dog, 
    Microscope, Plane, Pizza, Utensils, Quote, Clapperboard, Star, 
    Gavel, Ship, UserRound, House, Anchor, Truck, BarChart, Wrench,
    Bitcoin, Trophy, Smile, Zap, Cloud, Waves, Music, MessageSquare
  };
  
  // This mapping can be expanded with all subcategories
  const subcategoryMappings: SubcategoryMapping = {
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
    'cars-drifting': {
      title: 'Car Drifting',
      description: 'Drifting techniques, events, and professional drivers',
      icon: Car,
      parent: { route: '/cars', name: 'Cars' }
    },
    
    // Comedy subcategories
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
    
    // Disasters subcategories
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
  };
  
  // Generate a key from the category and subcategory
  const mappingKey = `${category}-${subcategory}`;
  
  // Default values in case the category is not in our mapping
  let pageTitle = subcategory ? subcategory.replace(/-/g, ' ') : 'Category';
  let pageDescription = 'Explore videos and content in this category';
  let IconComponent: LucideIcon = Film;
  let parentRoute = '/';
  let parentName = 'Home';
  
  // If we have mapping data for this category, use it
  if (subcategoryMappings[mappingKey]) {
    const mapping = subcategoryMappings[mappingKey];
    pageTitle = mapping.title;
    pageDescription = mapping.description;
    IconComponent = mapping.icon;
    parentRoute = mapping.parent.route;
    parentName = mapping.parent.name;
  }
  
  // Sample videos for the subcategory
  const sampleVideos = [
    {
      id: `${category}-${subcategory}-1`,
      title: `Popular ${pageTitle} Content`,
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      channelName: 'Content Creator',
      views: '1.2M',
      timestamp: '3 days ago',
      duration: '14:35',
    },
    {
      id: `${category}-${subcategory}-2`,
      title: `Trending in ${pageTitle}`,
      thumbnail: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=800&q=80',
      channelName: 'Trending Channel',
      views: '856K',
      timestamp: '1 week ago',
      duration: '22:15',
    },
    {
      id: `${category}-${subcategory}-3`,
      title: `Best of ${pageTitle} 2023`,
      thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
      channelName: 'Top Picks',
      views: '2.3M',
      timestamp: '2 months ago',
      duration: '18:42',
    },
    {
      id: `${category}-${subcategory}-4`,
      title: `${pageTitle} Highlights`,
      thumbnail: 'https://images.unsplash.com/photo-1507090960745-b32f65d3113a?auto=format&fit=crop&w=800&q=80',
      channelName: 'Featured Channel',
      views: '4.5M',
      timestamp: '5 months ago',
      duration: '12:18',
    },
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link to={parentRoute} className="hover:text-primary">
            {parentName}
          </Link>
          <ChevronRight size={14} />
          <span className="text-foreground">{pageTitle}</span>
        </div>
        
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <IconComponent className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
            <p className="text-muted-foreground ml-2">
              {pageDescription}
            </p>
          </div>
          <Link 
            to="/upload" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload Content</span>
          </Link>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Featured {pageTitle} Content</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sampleVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Popular in {pageTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sampleVideos.map((video, index) => ({
              ...video,
              id: `popular-${index}`,
              title: `Popular ${pageTitle} - ${index + 1}`,
            })).map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">About {pageTitle}</h2>
          <p className="text-muted-foreground">
            This category features content related to {pageTitle.toLowerCase()}.
            Explore videos, shorts, and more from creators specializing in this area.
            If you're a content creator in this space, consider uploading your own content.
          </p>
          <div className="mt-4">
            <Link to="/upload" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              <Upload size={18} />
              <span>Upload {pageTitle} Content</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GenericSubcategoryPage;
